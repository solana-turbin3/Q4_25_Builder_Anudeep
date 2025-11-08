use anchor_lang::prelude::*;
use anchor_instruction_sysvar::Ed25519InstructionSignatures;
use anchor_lang::system_program::{transfer, Transfer};
use solana_program::{ed25519_program, hash::hash};
use solana_program::sysvar::instructions::{load_current_index_checked, load_instruction_at_checked};

use crate::{Bet, errors::DiceError};

const HOUSE_EDGE_POINTS: u16 = 150;

#[derive(Accounts)]
pub struct SettleBet<'info> {
    #[account(
        mut,
        address = bet_account.player
    )]
    /// CHECK: Validated using bet_account
    pub user: UncheckedAccount<'info>,

    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"vault", authority.key().as_ref()],
        bump
    )]
    pub vault_account: SystemAccount<'info>,

    #[account(
        mut,
        close = user,
        seeds = [b"bet", vault_account.key().as_ref(), bet_account.seed.to_le_bytes().as_ref()],
        bump = bet_account.bump
    )]
    pub bet_account: Account<'info, Bet>,

    #[account(
        address = sysvar::instructions::ID @ DiceError::InstructionSysvarNotFound
    )]
    /// CHECK: Only used for instruction lookup
    pub ix_sysvar: UncheckedAccount<'info>,

    pub sys_program: Program<'info, System>,
}

impl<'info> SettleBet<'info> {
    pub fn settle_bet(&mut self, signature_bytes: &[u8], bumps: &SettleBetBumps) -> Result<()> {
        // Derive a pseudo-random number from the signature
        let sig_hash = hash(signature_bytes).to_bytes();
        let mut part_buf = [0u8; 16];

        part_buf.copy_from_slice(&sig_hash[..16]);
        let low_half = u128::from_le_bytes(part_buf);

        part_buf.copy_from_slice(&sig_hash[16..]);
        let high_half = u128::from_le_bytes(part_buf);

        let random_roll = low_half
            .wrapping_add(high_half)
            .wrapping_rem(100) as u8
            + 1;

        // Determine outcome
        if self.bet_account.roll > random_roll {
            let total_points = 10_000;
            let reward = (self.bet_account.amount as u128)
                .checked_mul((total_points - HOUSE_EDGE_POINTS) as u128).unwrap()
                .checked_div(self.bet_account.roll as u128).unwrap()
                .checked_div(total_points as u128).unwrap() as u64;

            // Re-derive PDA signer seeds for vault
            let vault_seeds: [&[&[u8]]; 1] =
                [&[b"vault", &self.authority.key().to_bytes(), &[bumps.vault_account]]];

            let cpi_ctx = CpiContext::new_with_signer(
                self.sys_program.to_account_info(),
                Transfer {
                    from: self.vault_account.to_account_info(),
                    to: self.user.to_account_info(),
                },
                &vault_seeds,
            );

            transfer(cpi_ctx, reward)?;
        }

        Ok(())
    }

    pub fn confirm_ed25519_sig(&self, signature_bytes: &[u8]) -> Result<()> {
        // Locate previous instruction (Ed25519 verification)
        let current_idx = load_current_index_checked(&self.ix_sysvar.to_account_info())? as usize;
        let previous_ix = load_instruction_at_checked(current_idx - 1, &self.ix_sysvar.to_account_info())?;

        require_keys_eq!(previous_ix.program_id, ed25519_program::ID, DiceError::Ed25519Program);
        require_eq!(previous_ix.accounts.len(), 0, DiceError::Ed25519Accounts);

        let parsed_sigs = Ed25519InstructionSignatures::unpack(previous_ix.data.as_slice()).unwrap().0;

        require_eq!(parsed_sigs.len(), 1, DiceError::Ed25519DataLength);
        let sig_data = parsed_sigs.first().ok_or(DiceError::Ed25519Signature)?;

        require!(sig_data.is_verifiable, DiceError::Ed25519Signature);
        require_keys_eq!(sig_data.public_key.unwrap(), self.authority.key(), DiceError::Ed25519Pubkey);
        require!(sig_data.signature.unwrap().eq(signature_bytes), DiceError::Ed25519Signature);
        require!(
            sig_data.message.as_ref().unwrap().eq(self.bet_account.to_slice().as_slice()),
            DiceError::Ed25519Message
        );

        Ok(())
    }
}

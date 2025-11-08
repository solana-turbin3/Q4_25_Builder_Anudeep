use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

pub use instructions::*;
pub use state::*;
pub use errors::*;

declare_id!("CsxCdEdjHKQpRdir1iRpqZ92qJ2nxTdP4qT1Qx95Uxw1");


#[program]
pub mod anchor_dice_game {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, amount: u64) -> Result<()> {
        ctx.accounts.init(amount)
    }

    pub fn place_bet(ctx: Context<PlaceBet>, seed: u128, roll: u8, amount: u64) -> Result<()> {
        ctx.accounts.create_bet(seed, roll, amount, &ctx.bumps)?;
        ctx.accounts.deposit(amount)
    }

    pub fn resolve_bet(ctx: Context<SettleBet>, sig: Vec<u8>) -> Result<()> {
        ctx.accounts.confirm_ed25519_sig(&sig)?;
        ctx.accounts.settle_bet(&sig, &ctx.bumps)
    }

    pub fn refund_bet(ctx: Context<RefundBet>) -> Result<()> {
        ctx.accounts.refund_bet(&ctx.bumps)
    }
}

pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("2Qc13ASVqkdAej8xAq6ShhqE3ywwJpxfo1UqQFW9oMQk");

#[program]
pub mod maps_dot_fun {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        bump: u8,
    ) -> Result<()> {
        let snapshot = &mut ctx.accounts.snapshot;
        snapshot.bump = bump;
        snapshot.merkle_root = [0; 32];
        snapshot.timestamp = Clock::get().unwrap().unix_timestamp;
        snapshot.total_supply = 0;
        snapshot.token_mint = ctx.accounts.token_mint.key();
        Ok(())
    }

    pub fn create_snapshot(
        ctx: Context<CreateSnapshot>,
        merkle_root: [u8; 32],
    ) -> Result<()> {
        let snapshot = &mut ctx.accounts.snapshot;
        snapshot.merkle_root = merkle_root;
        snapshot.timestamp = Clock::get().unwrap().unix_timestamp;
        
        let total_supply = ctx.accounts.token_mint.supply.unwrap_or(0);
        snapshot.total_supply = total_supply;
        
        Ok(())
    }

    pub fn update_account(
        ctx: Context<UpdateAccount>,
        new_balance: u64,
    ) -> Result<()> {
        let account = &mut ctx.accounts.account;
        account.balance = new_balance;
        account.snapshot_count += 1;
        Ok(())
    }
}
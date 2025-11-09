use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[account]
pub struct Snapshot {
    pub bump: u8,
    pub merkle_root: [u8; 32],
    pub timestamp: i64,
    pub total_supply: u64,
    pub token_mint: Pubkey,
}

impl Snapshot {
    pub const SIZE: usize = 8 + 32 + 8 + 8 + 32;
}

#[account]
pub struct Account {
    pub authority: Pubkey,
    pub balance: u64,
    pub snapshot_count: u64,
}

impl Account {
    pub const SIZE: usize = 32 + 8 + 8;
}
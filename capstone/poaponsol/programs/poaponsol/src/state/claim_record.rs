use anchor_lang::prelude::*;

#[account]
pub struct ClaimRecord {
    pub wallet: Pubkey,
    pub event: Pubkey,
    pub mint: Pubkey,
    pub collection_mint: Pubkey,
    pub claimed_at: i64,
    pub event_name: String,
    pub event_uri: String,
}

impl ClaimRecord {
    pub const LEN: usize = 8 + 32 + 32 + 32 + 32 + 8 + 4 + 100 + 4 + 200;
}

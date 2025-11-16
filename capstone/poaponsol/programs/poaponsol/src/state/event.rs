use anchor_lang::prelude::*;

#[account]
pub struct Event {
    pub name: String,
    pub organizer: Pubkey,
    pub collection_mint: Pubkey,
    pub uri: String,
    pub start_timestamp: i64,
    pub end_timestamp: i64,
    pub max_claims: u32,
    pub is_active: bool,
    pub bump: u8,
}

impl Event {
    pub const LEN: usize = 8 + 4 + 32 + 32 + 4 + 200 + 8 + 8 + 4 + 1 + 1;
}

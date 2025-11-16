use anchor_lang::prelude::*;

#[account]
pub struct OrganizerProfile {
    pub organizer: Pubkey,
    pub event_count: u64,
}

impl OrganizerProfile {
    pub const LEN: usize = 8 + 32 + 8;
}

use anchor_lang::prelude::*;

#[event]
pub struct EventCreated {
    pub event: Pubkey,
    pub authority: Pubkey,
}

#[event]
pub struct BadgeMinted {
    pub event: Pubkey,
    pub recipient: Pubkey,
}

#[event]
pub struct EventClosed {
    pub event: Pubkey,
    pub organizer: Pubkey,
}
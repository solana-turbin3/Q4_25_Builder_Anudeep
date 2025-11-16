use crate::{errors::PoapError, state::event::Event};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct CloseEvent<'info> {
    #[account(mut)]
    pub organizer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"event", event.organizer.as_ref(), event.name.as_bytes()],
        bump,
        has_one = organizer @ PoapError::NotAuthorized,
    )]
    pub event: Account<'info, Event>,
}

impl<'info> CloseEvent<'info> {
    pub fn handler(&mut self) -> Result<()> {
        let event = &mut self.event;

        require!(event.is_active, PoapError::EventAlreadyClosed);

        event.is_active = false;
        msg!("Event '{}' closed successfully by organizer.", event.name);

        Ok(())
    }
}

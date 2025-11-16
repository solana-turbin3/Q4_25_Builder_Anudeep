use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;
pub mod events;

use crate::instructions::*;
pub use constants::*;
pub use errors::*;
pub use state::*;
pub use events::*;

declare_id!("DzqHpVGTsTumRwUBSgv16PKStMA7xK3XhXwTNB921B6r");

#[program]
pub mod poaponsol {
    use super::*;

    pub fn create_event(
        ctx: Context<CreateEvent>,
        args: create_event::CreateEventArgs,
    ) -> Result<()> {
        ctx.accounts.handler(args, &ctx.bumps)?;
        emit!(EventCreated {
            event: ctx.accounts.event.key(),
            authority: ctx.accounts.collection_authority.key(),
        });
        Ok(())
    }

    pub fn mint_badge(ctx: Context<MintBadge>) -> Result<()> {
        ctx.accounts.handler()?;
        emit!(BadgeMinted {
            event: ctx.accounts.event.key(),
            recipient: ctx.accounts.claimer.key(),
        });
        Ok(())
    }

    pub fn close_event(ctx: Context<CloseEvent>) -> Result<()> {
        ctx.accounts.handler()?;
        emit!(EventClosed {
            event: ctx.accounts.event.key(),
            organizer: ctx.accounts.organizer.key(),
        });
        Ok(())
    }
}

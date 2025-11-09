use super::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = Snapshot::SIZE,
        seeds = [b"snapshot"],
        bump
    )]
    pub snapshot: Account<'info, Snapshot>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateSnapshot<'info> {
    #[account(
        mut,
        seeds = [b"snapshot"],
        bump = snapshot.bump
    )]
    pub snapshot: Account<'info, Snapshot>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_mint: Account<'info, Mint>,
}

#[derive(Accounts)]
pub struct UpdateAccount<'info> {
    #[account(
        mut,
        constraint = account.authority == authority.key @ Err(ErrorCode::Unauthorized)
    )]
    pub account: Account<'info, Account>,
    #[account(mut)]
    pub authority: Signer<'info>,
}
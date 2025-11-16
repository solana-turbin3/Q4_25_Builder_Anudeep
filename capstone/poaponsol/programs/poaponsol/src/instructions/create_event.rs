use anchor_lang::prelude::*;
use mpl_core::{instructions::CreateCollectionV2CpiBuilder, ID as CORE_PROGRAM_ID};

use crate::{
    constants::{COLLECTION_AUTHORITY_SEED, EVENT_SEED, PROFILE_SEED},
    state::event::Event,
    state::CollectionAuthority,
    state::OrganizerProfile,
    errors::PoapError,
};

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct CreateEventArgs {
    pub name: String,
    pub uri: String,
    pub start_timestamp: i64,
    pub end_timestamp: i64,
    pub max_claims: u32,
}

#[derive(Accounts)]
pub struct CreateEvent<'info> {
    #[account(mut)]
    pub organizer: Signer<'info>,

    #[account(
        init_if_needed,
        payer = organizer,
        space = OrganizerProfile::LEN,
        seeds = [PROFILE_SEED, organizer.key().as_ref()],
        bump,
        constraint = profile.organizer == organizer.key() || profile.organizer == Pubkey::default(),
    )]
    pub profile: Account<'info, OrganizerProfile>,

    #[account(
        init,
        payer = organizer,
        space = Event::LEN,
        seeds = [
            EVENT_SEED,
            organizer.key().as_ref(),
            &profile.event_count.to_le_bytes(),
        ],
        bump
    )]
    pub event: Account<'info, Event>,

    #[account(mut)]
    pub collection: Signer<'info>,

    #[account(
        init,
        payer = organizer,
        space = CollectionAuthority::INIT_SPACE,
        seeds = [COLLECTION_AUTHORITY_SEED, collection.key().as_ref()],
        bump,
    )]
    pub collection_authority: Account<'info, CollectionAuthority>,

    /// CHECK: Validated by Metaplex Core CPI
    #[account(address = CORE_PROGRAM_ID)]
    pub core_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> CreateEvent<'info> {
    pub fn handler(&mut self, args: CreateEventArgs, bumps: &CreateEventBumps) -> Result<()> {
        let event = &mut self.event;
        let organizer = &self.organizer;
        let collection = &self.collection;
        let core_program = &self.core_program;
        let profile = &mut self.profile;
        let ca = &mut self.collection_authority;

        if profile.organizer == Pubkey::default() {
            profile.organizer = organizer.key();
        }

        // let event_index = profile.event_count;
        profile.event_count = profile.event_count.checked_add(1).ok_or(PoapError::InvalidArgument)?;

        let ca_bump = bumps.collection_authority;
        ca.set_inner(CollectionAuthority {
            bump: ca_bump,
            creator: organizer.key(),
            collection: collection.key(),
            nft_name: args.name.clone(),
            nft_uri: args.uri.clone(),
        });

        let binding = collection.key();
        let ca_signer_seeds: &[&[&[u8]]] = &[&[
            COLLECTION_AUTHORITY_SEED,
            binding.as_ref(),
            &[ca_bump],
        ]];

        CreateCollectionV2CpiBuilder::new(&core_program.to_account_info())
            .collection(&collection.to_account_info())
            .payer(&organizer.to_account_info())
            .update_authority(Some(&self.collection_authority.to_account_info()))
            .system_program(&self.system_program.to_account_info())
            .name(args.name.clone())
            .uri(args.uri.clone())
            .plugins(vec![])
            .external_plugin_adapters(vec![])
            .invoke_signed(ca_signer_seeds)?;

        let event_bump = bumps.event;
        event.set_inner(Event {
            name: args.name,
            organizer: organizer.key(),
            collection_mint: collection.key(),
            uri: args.uri,
            start_timestamp: args.start_timestamp,
            end_timestamp: args.end_timestamp,
            max_claims: args.max_claims,
            is_active: true,
            bump: event_bump,
        });

        Ok(())
    }
}

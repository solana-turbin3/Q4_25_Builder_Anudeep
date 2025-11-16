use anchor_lang::prelude::*;
use mpl_core::{
    instructions::CreateV2CpiBuilder,
    types::{
        Attribute, Attributes, BurnDelegate, FreezeDelegate, Plugin, PluginAuthority,
        PluginAuthorityPair,
    },
    ID as CORE_PROGRAM_ID,
};

use crate::{
    constants::{CLAIM_SEED, COLLECTION_AUTHORITY_SEED},
    errors::PoapError,
    state::{claim_record::ClaimRecord, collection_authority::CollectionAuthority, event::Event},
};

#[derive(Accounts)]
pub struct MintBadge<'info> {
    #[account(mut)]
    pub claimer: Signer<'info>,

    #[account(
        mut,
        constraint = badge_mint.data_is_empty() @ PoapError::AssetAlreadyInitialized
    )]
    pub badge_mint: Signer<'info>,

    #[account(
        mut,
        constraint = event.is_active @ PoapError::EventNotActive
    )]
    pub event: Account<'info, Event>,

    /// The collection NFT mint
    #[account(
        mut,
        constraint = collection.owner == &CORE_PROGRAM_ID @ PoapError::InvalidCollection,
        constraint = !collection.data_is_empty() @ PoapError::CollectionNotInitialized
    )]
    /// CHECK: validated via core
    pub collection: UncheckedAccount<'info>,

    #[account(
        seeds = [COLLECTION_AUTHORITY_SEED, collection.key().as_ref()],
        bump = collection_authority.bump,
    )]
    pub collection_authority: Account<'info, CollectionAuthority>,

    #[account(
        init,
        payer = claimer,
        space = ClaimRecord::LEN,
        seeds = [CLAIM_SEED, event.key().as_ref(), claimer.key().as_ref()],
        bump
    )]
    pub claim_record: Account<'info, ClaimRecord>,

    #[account(address = CORE_PROGRAM_ID)]
    /// CHECK: verified by core CPI
    pub core_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> MintBadge<'info> {
    pub fn handler(&mut self) -> Result<()> {
        let claimer = &self.claimer;
        let badge_mint = &self.badge_mint;
        let collection = &self.collection;
        let collection_authority = &self.collection_authority;
        let core_program = &self.core_program;
        let record = &mut self.claim_record;
        let event = &self.event;

        let signer_seeds: &[&[&[u8]]] = &[&[
            COLLECTION_AUTHORITY_SEED,
            &collection.key().to_bytes(),
            &[collection_authority.bump],
        ]];

        let timestamp = Clock::get()?.unix_timestamp;

        CreateV2CpiBuilder::new(&core_program.to_account_info())
            .asset(&badge_mint.to_account_info())
            .collection(Some(&collection.to_account_info()))
            .authority(Some(&collection_authority.to_account_info()))
            .payer(&claimer.to_account_info())
            .owner(Some(&claimer.to_account_info()))
            .update_authority(None)
            .system_program(&self.system_program.to_account_info())
            .name(collection_authority.nft_name.clone())
            .uri(collection_authority.nft_uri.clone())
            .plugins(vec![
                PluginAuthorityPair {
                    plugin: Plugin::Attributes(Attributes {
                        attribute_list: vec![
                            Attribute {
                                key: "Creator".to_string(),
                                value: collection_authority.creator.to_string(),
                            },
                            Attribute {
                                key: "Minter".to_string(),
                                value: claimer.key().to_string(),
                            },
                            Attribute {
                                key: "Collection".to_string(),
                                value: collection.key().to_string(),
                            },
                            Attribute {
                                key: "Mint Timestamp".to_string(),
                                value: timestamp.to_string(),
                            },
                        ],
                    }),
                    authority: None,
                },
                PluginAuthorityPair {
                    plugin: Plugin::FreezeDelegate(FreezeDelegate { frozen: true }),
                    authority: Some(PluginAuthority::Address {
                        address: collection_authority.key(),
                    }),
                },
                PluginAuthorityPair {
                    plugin: Plugin::BurnDelegate(BurnDelegate {}),
                    authority: Some(PluginAuthority::Address {
                        address: collection_authority.key(),
                    }),
                },
            ])
            .external_plugin_adapters(vec![])
            .invoke_signed(signer_seeds)?;

        record.set_inner(ClaimRecord {
            wallet: claimer.key(),
            event: event.key(),
            mint: badge_mint.key(),
            collection_mint: collection.key(),
            claimed_at: timestamp,
            event_name: event.name.clone(),
            event_uri: event.uri.clone(),
        });

        Ok(())
    }
}

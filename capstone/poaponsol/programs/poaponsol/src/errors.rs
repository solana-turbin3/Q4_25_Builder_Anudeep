use anchor_lang::prelude::*;

#[error_code]
pub enum PoapError {
    #[msg("Collection already initialized")]
    CollectionAlreadyInitialized,
    #[msg("Asset already initialized")]
    AssetAlreadyInitialized,
    #[msg("Event is not active")]
    EventNotActive,
    #[msg("Event has ended")]
    InvalidCollection,
    #[msg("Collection not initialized")]
    CollectionNotInitialized,
    #[msg("Event already closed")]
    NotAuthorized,
    #[msg("event is already closed")]
    EventAlreadyClosed,
    #[msg("Not authorized to perform this action")]
    InvalidArgument,
}

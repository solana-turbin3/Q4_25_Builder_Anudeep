use anchor_lang::prelude::*;

#[account]
pub struct CollectionAuthority {
    pub bump: u8,
    pub creator: Pubkey,
    pub collection: Pubkey,
    pub nft_name: String,
    pub nft_uri: String,
}

impl CollectionAuthority {
    pub const INIT_SPACE: usize = 1 + 32 + 32 + (4 + 50) + (4 + 200);
}

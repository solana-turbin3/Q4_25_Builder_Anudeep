use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid merkle root")]
    InvalidMerkleRoot,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Invalid account")]
    InvalidAccount,
    #[msg("Invalid token mint")]
    InvalidTokenMint,
    #[msg("Invalid snapshot")]
    InvalidSnapshot,
    #[msg("Invalid bump")]
    InvalidBump,
    #[msg("Invalid timestamp")]
    InvalidTimestamp,
    #[msg("Invalid merkle root")]
    InvalidMerkleRoot,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Invalid account")]
    InvalidAccount,
    #[msg("Invalid token mint")]
    InvalidTokenMint,
}

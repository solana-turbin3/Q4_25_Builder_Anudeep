use super::*;
use anchor_lang::prelude::*;
use std::convert::TryInto;

pub fn compute_merkle_root(
    accounts: &[AccountInfo],
    balances: &[u64],
) -> Result<[u8; 32]> {
    let mut hash = [0u8; 32];
    let mut data = Vec::new();
    
    for ((account, balance), i) in accounts.iter().zip(balances).enumerate() {
        let mut bytes = Vec::new();
        bytes.extend_from_slice(&account.key.to_bytes());
        bytes.extend_from_slice(&balance.to_le_bytes());
        data.extend_from_slice(&bytes);
    }
    
    hash::hashv(&data).try_into().map_err(|_| ProgramError::InvalidArgument)
}

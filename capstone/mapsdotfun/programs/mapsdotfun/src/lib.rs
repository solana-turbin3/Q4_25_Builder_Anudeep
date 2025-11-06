pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("2Qc13ASVqkdAej8xAq6ShhqE3ywwJpxfo1UqQFW9oMQk");

#[program]
pub mod mapsdotfun {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        initialize::handler(ctx)
    }
}

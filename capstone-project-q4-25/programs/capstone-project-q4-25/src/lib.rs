use anchor_lang::prelude::*;

declare_id!("DcCkrh3if8j8c1RSMgdW89MVXHDiKgLiAcAQPnCebASo");

#[program]
pub mod capstone_project_q4_25 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

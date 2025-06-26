use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Wrap<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
}

pub(crate) fn handler(ctx: Context<Wrap>, amount: u64) -> Result<()> {
    
    Ok(())
}
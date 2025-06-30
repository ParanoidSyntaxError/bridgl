use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Unwrap<'info> {
    #[account()]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,
}

pub(crate) fn handler(
    _ctx: Context<Unwrap>,
) -> Result<()> {
    
    Ok(())
}
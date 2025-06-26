use anchor_lang::prelude::*;

use crate::{
    constants::CONTROLLER_SEED,
    state::Controller,
};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        seeds = [CONTROLLER_SEED],
        bump,
        payer = payer,
        space = Controller::SPACE,
    )]
    pub controller: Account<'info, Controller>,

    pub system_program: Program<'info, System>,
}

pub(crate) fn handler(ctx: Context<Initialize>, router: Pubkey) -> Result<()> {
    let controller = &mut ctx.accounts.controller;

    controller.bump = ctx.bumps.controller;
    controller.router = router;

    Ok(())
}
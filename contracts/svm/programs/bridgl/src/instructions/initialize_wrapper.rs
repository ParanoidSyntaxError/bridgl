use anchor_lang::prelude::*;
use anchor_spl::{
    token::Token,
    token_interface::{Mint, TokenAccount},
};

use crate::{
    constants::{CONTROLLER_SEED, VAULT_SEED, WRAPPER_DECIMALS, WRAPPER_SEED},
    state::Controller,
};

#[derive(Accounts)]
#[instruction(chain_selector: u64, bridgl_address: Vec<u8>, underlying_token: Vec<u8>)]
pub struct InitializeWrapper<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        seeds = [CONTROLLER_SEED],
        bump,
    )]
    pub controller: Account<'info, Controller>,

    #[account(
        init,
        seeds = [
            WRAPPER_SEED,
            &chain_selector.to_le_bytes(),
            bridgl_address.as_ref(),
            underlying_token.as_ref(),
        ],
        bump,
        payer = payer,
        mint::decimals = WRAPPER_DECIMALS,
        mint::authority = controller,
        mint::freeze_authority = controller
    )]
    pub wrapper: InterfaceAccount<'info, Mint>,

    pub system_program: Program<'info, System>,

    pub token_program: Program<'info, Token>,
}

pub(crate) fn handler(
    _ctx: Context<InitializeWrapper>,
    _chain_selector: u64,
    _bridgl_address: Vec<u8>,
    _underlying_token: Vec<u8>,
) -> Result<()> {
    Ok(())
}

use anchor_lang::prelude::*;

use anchor_spl::{
    token::{self, Token},
    token_interface::{Mint, TokenAccount},
};

use solabi::encode::encode;

use crate::{
    constants::{CONTROLLER_SEED, VAULT_SEED},
    error::BridglError,
    state::{Controller, SVM2AnyMessage, WrapParams},
};

#[derive(Accounts)]
#[instruction(destination_chain_selector: u64, bridgl_address: Vec<u8>, to: Vec<u8>, amount: u64)]
pub struct Wrap<'info> {
    #[account()]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        seeds = [CONTROLLER_SEED],
        bump,
    )]
    pub controller: Account<'info, Controller>,

    #[account(
        mut,
        seeds = [
            VAULT_SEED,
            &destination_chain_selector.to_le_bytes(),
            bridgl_address.as_ref(),
            underlying_token.key().to_bytes().as_ref(),
        ],
        bump,
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        constraint = from.mint == underlying_token.key(),
        constraint = from.owner == authority.key(),
    )]
    pub from: InterfaceAccount<'info, TokenAccount>,

    pub underlying_token: InterfaceAccount<'info, Mint>,

    pub system_program: Program<'info, System>,

    pub token_program: Program<'info, Token>,
}

pub(crate) fn handler(
    ctx: Context<Wrap>,
    destination_chain_selector: u64,
    bridgl_address: Vec<u8>,
    to: Vec<u8>,
    amount: u64,
    extra_args: Vec<u8>,
) -> Result<()> {
    token::transfer_checked(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::TransferChecked {
                from: ctx.accounts.from.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
                mint: ctx.accounts.underlying_token.to_account_info(),
            },
        ),
        amount,
        ctx.accounts.underlying_token.decimals,
    )?;

    // TODO: get name and symbol from the underlying token
    let params = WrapParams {
        name: String::from("NAME"),
        symbol: String::from("SYMBOL"),
        underlying_token: ctx.accounts.underlying_token.key().to_bytes().to_vec(),
        to: to,
        amount: amount.into(),
    };
    let params_data = encode::<WrapParams>(&params);



    Ok(())
}

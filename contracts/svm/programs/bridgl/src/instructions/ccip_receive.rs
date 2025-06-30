use anchor_lang::prelude::*;

use anchor_spl::{
    token::{self, Token},
    token_interface::{Mint, TokenAccount}
};

use solabi::{
    decode::decode,
    encode::encode,
};

use crate::{
    constants::{
        ALLOWED_OFFRAMP, CONTROLLER_SEED, EXTERNAL_EXECUTION_CONFIG_SEED,
        MAX_MESSAGE_DATA_SIZE, MAX_SENDER_ADDRESS_SIZE, WRAPPER_SEED,
    }, error::BridglError, state::{Any2SVMMessage, Controller, UnwrapParams, WrapParams}, wrap, ID
};

#[derive(Accounts)]
#[instruction(message: Any2SVMMessage)]
pub struct CcipReceive<'info> {
    /// The authority PDA from the offramp program that must sign the transaction
    /// This ensures only authorized offramp programs can call this function
    #[account(
        seeds = [
            EXTERNAL_EXECUTION_CONFIG_SEED, 
            ID.as_ref()
        ],
        bump,
        seeds::program = offramp_program.key(),
    )]
    pub authority: Signer<'info>,

    /// The offramp program account
    /// Used for deriving PDA seeds
    /// CHECK: offramp program: exists only to derive the allowed offramp PDA and the authority PDA
    pub offramp_program: UncheckedAccount<'info>,

    /// PDA from the router program that verifies this offramp is allowed
    /// If this PDA doesn't exist, the router doesn't allow this offramp
    /// CHECK: PDA of the router program verifying the signer is an allowed offramp
    #[account(
        owner = controller.router @ BridglError::InvalidCaller, // this guarantees that it was initialized
        seeds = [
            ALLOWED_OFFRAMP,
            message.source_chain_selector.to_le_bytes().as_ref(),
            offramp_program.key().as_ref()
        ],
        bump,
        seeds::program = controller.router,
    )]
    pub allowed_offramp: UncheckedAccount<'info>,

    #[account(
        seeds = [CONTROLLER_SEED],
        bump,
    )]
    pub controller: Account<'info, Controller>,

    #[account(mut)]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        constraint = to.mint == mint.key() @ BridglError::InvalidToAccount,
    )]
    pub to: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub(crate) fn handler(
    ctx: Context<CcipReceive>,
    message: Any2SVMMessage,
) -> Result<()> {
    // Validate data size against the maximum allowed
    if message.data.len() > MAX_MESSAGE_DATA_SIZE {
        msg!(
            "Error: Message data size ({}) exceeds maximum allowed ({})",
            message.data.len(), 
            MAX_MESSAGE_DATA_SIZE
        );
        return Err(BridglError::MessageDataTooLarge.into());
    }
    // Validate sender address size against the maximum allowed
    if message.sender.len() > MAX_SENDER_ADDRESS_SIZE {
        msg!(
            "Error: Sender address size ({}) exceeds maximum allowed ({})", 
            message.sender.len(), 
            MAX_SENDER_ADDRESS_SIZE
        );
        return Err(BridglError::SenderAddressTooLarge.into());
    }

    let selector = message.data[0];
    let data = &message.data[1..];

    let controller_signer_seeds: &[&[&[u8]]] = &[&[CONTROLLER_SEED, &[ctx.accounts.controller.bump]]];

    match selector {
        0 => {
            // Wrap
            let params = decode::<WrapParams>(data).map_err(|e| {
                msg!("Error: Invalid message data ({:?})", e);
                BridglError::InvalidMessageData
            })?;

            let (wrapper, _) = Pubkey::find_program_address(&[
                WRAPPER_SEED,
                &message.source_chain_selector.to_le_bytes(),
                message.sender.as_ref(),
                params.underlying_token.as_ref(),
            ], ctx.program_id);

            if wrapper != ctx.accounts.mint.key() {
                msg!("Error: Invalid wrapper mint ({:?})", wrapper);
                return Err(BridglError::InvalidWrapperMint.into());
            }

            if params.to != ctx.accounts.to.key().to_bytes() {
                msg!("Error: decoded `to` address does not match provided account");
                return Err(BridglError::InvalidToAccount.into());
            }

            let amount: u64 = params.amount.try_into().map_err(|_| {
                msg!("Error: Amount too large for u64");
                BridglError::TooManyTokens
            })?;

            token::mint_to(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    token::MintTo {
                        mint: ctx.accounts.mint.to_account_info(),
                        to: ctx.accounts.to.to_account_info(),
                        authority: ctx.accounts.controller.to_account_info(),
                    },
                    controller_signer_seeds
                ),
                amount,
            )?;
        }
        1 => {
            // Unwrap
            let params = decode::<UnwrapParams>(data).map_err(|e| {
                msg!("Error: Invalid message data ({:?})", e);
                BridglError::InvalidMessageData
            })?;

            if params.underlying_token != ctx.accounts.mint.key().to_bytes() {
                msg!("Error: Invalid underlying token ({:?})", params.underlying_token);
                return Err(BridglError::InvalidUnderlyingToken.into());
            }

            if params.to != ctx.accounts.to.key().to_bytes() {
                msg!("Error: decoded `to` address does not match provided account");
                return Err(BridglError::InvalidToAccount.into());
            }

            let amount: u64 = params.amount.try_into().map_err(|_| {
                msg!("Error: Amount too large for u64");
                BridglError::TooManyTokens
            })?;

            token::transfer_checked(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(), 
                    token::TransferChecked {
                        from: ctx.accounts.vault.to_account_info(),
                        to: ctx.accounts.to.to_account_info(),
                        authority: ctx.accounts.controller.to_account_info(),
                        mint: ctx.accounts.mint.to_account_info(),
                    }, 
                    controller_signer_seeds
                ), 
                amount, 
                ctx.accounts.mint.decimals
            )?;
        }
        _ => {
            msg!("Error: Invalid message selector ({})", selector);
            return Err(BridglError::InvalidMessageSelector.into());
        }
    }

    Ok(())
}
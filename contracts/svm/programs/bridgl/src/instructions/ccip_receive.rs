use anchor_lang::prelude::*;

use anchor_spl::{
    token::Token, 
    token_interface::Mint
};

use crate::{
    ID,
    constants::{
        ALLOWED_OFFRAMP, CONTROLLER_SEED, EXTERNAL_EXECUTION_CONFIG_SEED,
        MAX_MESSAGE_DATA_SIZE, MAX_SENDER_ADDRESS_SIZE, WRAPPER_SEED,
    },
    state::{Any2SVMMessage, Controller},
    error::BridglError,
};

#[derive(Accounts, Debug)]
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

    /*
    #[account(
        init_if_needed,
        seeds = [
            WRAPPER_SEED,
            message.source_chain_selector.to_le_bytes().as_ref(),
            message.sender.as_ref(),
        ],
        bump,
        payer = authority,
        mint::authority = controller,
    )]
    pub wrapper: Account<'info, Mint>,

    pub system_program: Program<'info, System>,

    pub token_program: Program<'info, Token>,
    */
}

pub(crate) fn handler(ctx: Context<CcipReceive>, message: Any2SVMMessage) -> Result<()> {
    // Validate data size against the maximum allowed
    if message.data.len() > MAX_MESSAGE_DATA_SIZE {
        msg!("Error: Message data size ({}) exceeds maximum allowed ({})", 
             message.data.len(), MAX_MESSAGE_DATA_SIZE);
        return Err(BridglError::MessageDataTooLarge.into());
    }
    // Validate sender address size against the maximum allowed
    if message.sender.len() > MAX_SENDER_ADDRESS_SIZE {
        msg!("Error: Sender address size ({}) exceeds maximum allowed ({})", 
             message.sender.len(), MAX_SENDER_ADDRESS_SIZE);
        return Err(BridglError::SenderAddressTooLarge.into());
    }

    Ok(())
}
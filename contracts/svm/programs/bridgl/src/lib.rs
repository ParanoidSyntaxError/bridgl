use anchor_lang::prelude::*;

pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

pub use constants::*;
pub use error::*;
pub use instructions::*;
pub use state::*;

declare_id!("2gjEcWRLgE8JvcJR2gu5ZQHibUnmTiVwnY6c6jMFsjxU");

#[program]
pub mod bridgl {
    use super::*;

    pub fn initialize_controller(ctx: Context<InitializeController>, router: Pubkey) -> Result<()> {
        initialize_controller::handler(ctx, router)
    }

    pub fn initialize_wrapper(
        ctx: Context<InitializeWrapper>,
        chain_selector: u64,
        bridgl_address: Vec<u8>,
        underlying_token: Vec<u8>,
    ) -> Result<()> {
        initialize_wrapper::handler(ctx, chain_selector, bridgl_address, underlying_token)
    }

    pub fn wrap(
        ctx: Context<Wrap>,
        destination_chain_selector: u64,
        bridgl_address: Vec<u8>,
        to: Vec<u8>,
        amount: u64,
        extra_args: Vec<u8>,
    ) -> Result<()> {
        wrap::handler(
            ctx,
            destination_chain_selector,
            bridgl_address,
            to,
            amount,
            extra_args,
        )
    }

    pub fn unwrap(ctx: Context<Unwrap>) -> Result<()> {
        unwrap::handler(ctx)
    }

    pub fn ccip_receive(ctx: Context<CcipReceive>, message: Any2SVMMessage) -> Result<()> {
        ccip_receive::handler(ctx, message)
    }
}

use anchor_lang::prelude::*;

pub mod constants;
pub mod state;
pub mod instructions;
pub mod error;

pub use constants::*;
pub use state::*;
pub use instructions::*;
pub use error::*;

declare_id!("8So6fEmZXfYjAhCfFggyfhTvYjfEjWXTWjLQA2spmi4k");

#[program]
pub mod bridgl {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, router: Pubkey) -> Result<()> {
        initialize::handler(ctx, router)
    }

    pub fn wrap(ctx: Context<Wrap>, amount: u64) -> Result<()> {
        wrap::handler(ctx, amount)
    }

    pub fn ccip_receive(ctx: Context<CcipReceive>, message: Any2SVMMessage) -> Result<()> {
        ccip_receive::handler(ctx, message)
    }
}

use anchor_lang::prelude::*;

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize, Default)]
pub struct SVMTokenAmount {
    /// The mint address of the token on Solana
    pub token: Pubkey,
    /// The amount of tokens (denominated in Solana token amount)
    pub amount: u64,
}
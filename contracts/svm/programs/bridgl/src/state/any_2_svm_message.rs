use anchor_lang::prelude::*;

use crate::state::SVMTokenAmount;

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Any2SVMMessage {
    /// Unique identifier of the cross-chain message
    pub message_id: [u8; 32],
    /// Identifier of the source blockchain (chain selector)
    pub source_chain_selector: u64,
    /// Address of the sender on the source chain (in bytes)
    pub sender: Vec<u8>,
    /// Arbitrary data payload in the message
    pub data: Vec<u8>,
    /// List of token transfers included in the message
    pub token_amounts: Vec<SVMTokenAmount>,
}
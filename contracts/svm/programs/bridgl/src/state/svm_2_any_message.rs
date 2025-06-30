use anchor_lang::prelude::*;

use crate::state::SVMTokenAmount;

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct SVM2AnyMessage {
    pub receiver: Vec<u8>,
    pub data: Vec<u8>,
    pub token_amounts: Vec<SVMTokenAmount>,
    pub fee_token: Pubkey,
    pub extra_args: Vec<u8>,
}
use std::mem::size_of;

use anchor_lang::prelude::*;

use crate::constants::ANCHOR_DISCRIMINATOR;

#[account]
#[derive(InitSpace, Default, Debug)]
pub struct Controller {
    pub bump: u8,

    pub router: Pubkey,
}

impl Controller {
    pub const SPACE: usize = ANCHOR_DISCRIMINATOR + size_of::<&Self>();
}
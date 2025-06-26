use anchor_lang::prelude::*;

pub const ANCHOR_DISCRIMINATOR: usize = 8;

/// 1KB limit for message data
pub const MAX_MESSAGE_DATA_SIZE: usize = 1024;
/// Max 64 bytes for sender address
pub const MAX_SENDER_ADDRESS_SIZE: usize = 64;

pub const CONTROLLER_SEED: &[u8] = b"controller";
pub const WRAPPER_SEED: &[u8] = b"wrapper";
/// Seed for the external execution config PDA
pub const EXTERNAL_EXECUTION_CONFIG_SEED: &[u8] = b"external_execution_config";
/// Seed for allowed offramp PDA
pub const ALLOWED_OFFRAMP: &[u8] = b"allowed_offramp";

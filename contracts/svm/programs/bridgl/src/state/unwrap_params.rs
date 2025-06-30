use solabi::{
    decode::{Decode, DecodeError, Decoder},
    encode::{Encode, Encoder, Size},
};

#[derive(Debug, Eq, PartialEq)]
pub struct UnwrapParams {
    pub underlying_token: Vec<u8>,
    pub to: Vec<u8>,
    pub amount: u128,
}

impl Encode for UnwrapParams {
    fn size(&self) -> Size {
        (
            self.underlying_token.as_slice(),
            self.to.as_slice(),
            self.amount,
        )
            .size()
    }

    fn encode(&self, encoder: &mut Encoder) {
        (
            self.underlying_token.as_slice(),
            self.to.as_slice(),
            self.amount,
        )
            .encode(encoder);
    }
}

impl Decode for UnwrapParams {
    fn is_dynamic() -> bool {
        <(Vec<u8>, Vec<u8>, u128)>::is_dynamic()
    }

    fn decode(decoder: &mut Decoder) -> Result<Self, DecodeError> {
        let (
            underlying_token, 
            to, 
            amount,
        ) = Decode::decode(decoder)?;
        Ok(Self {
            underlying_token,
            to,
            amount,
        })
    }
}

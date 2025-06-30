use solabi::{
    decode::{Decode, DecodeError, Decoder},
    encode::{Encode, Encoder, Size},
};

#[derive(Debug, Eq, PartialEq)]
pub struct WrapParams {
    pub name: String,
    pub symbol: String,
    pub underlying_token: Vec<u8>,
    pub to: Vec<u8>,
    pub amount: u128,
}

impl Encode for WrapParams {
    fn size(&self) -> Size {
        (
            self.name.as_str(),
            self.symbol.as_str(),
            self.underlying_token.as_slice(),
            self.to.as_slice(),
            self.amount,
        )
            .size()
    }

    fn encode(&self, encoder: &mut Encoder) {
        (
            self.name.as_str(),
            self.symbol.as_str(),
            self.underlying_token.as_slice(),
            self.to.as_slice(),
            self.amount,
        )
            .encode(encoder);
    }
}

impl Decode for WrapParams {
    fn is_dynamic() -> bool {
        <(String, String, Vec<u8>, Vec<u8>, u128)>::is_dynamic()
    }

    fn decode(decoder: &mut Decoder) -> Result<Self, DecodeError> {
        let (
            name, 
            symbol, 
            underlying_token, 
            to, 
            amount,
        ) = Decode::decode(decoder)?;
        Ok(Self {
            name,
            symbol,
            underlying_token,
            to,
            amount,
        })
    }
}

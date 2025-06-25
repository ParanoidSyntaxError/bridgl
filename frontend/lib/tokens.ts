import { arbSepolia, avaxFuji, bnbTestnet, baseSepolia, ethSepolia, opSepolia } from "./networks";

export interface TokenMetadata {
    name: string;
    symbol: string;
}

export interface Token extends TokenMetadata {
    address: string;
}

export const wethMetadata: TokenMetadata = {
    name: "WETH",
    symbol: "WETH",
}

export const wavaxMetadata: TokenMetadata = {
    name: "WAVAX",
    symbol: "WAVAX",
}

export const wbnbMetadata: TokenMetadata = {
    name: "WBNB",
    symbol: "WBNB",
}

export const linkMetadata: TokenMetadata = {
    name: "Chainlink",
    symbol: "LINK",
}

/*
export const usdcMetadata: TokenMetadata = {
    name: "USDC",
    symbol: "USDC",
}

export const usdtMetadata: TokenMetadata = {
    name: "Tether",
    symbol: "USDT",
}
*/

export const testnetTokens = new Map<bigint, Token[]>([
    [ethSepolia.chainSelector, [
        {...wethMetadata, address: "0x097D90c9d3E0B50Ca60e1ae45F6A81010f9FB534"},
        {...linkMetadata, address: "0x779877A7B0D9E8603169DdbD7836e478b4624789"},
    ]],
    //sol
    [baseSepolia.chainSelector, [
        {...wethMetadata, address: "0x4200000000000000000000000000000000000006"},
        {...linkMetadata, address: "0xE4aB69C077896252FAFBD49EFD26B5D171A32410"},
    ]],
    [avaxFuji.chainSelector, [
        {...wavaxMetadata, address: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c"},
        {...linkMetadata, address: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846"},
    ]],
    [bnbTestnet.chainSelector, [
        {...wbnbMetadata, address: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd"},
        {...linkMetadata, address: "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06"},
    ]],
    [arbSepolia.chainSelector, [
        {...wethMetadata, address: "0xE591bf0A0CF924A0674d7792db046B23CEbF5f34"},
        {...linkMetadata, address: "0xb1D4538B4571d411F07960EF2838Ce337FE1E80E"},
    ]],
    [opSepolia.chainSelector, [
        {...wethMetadata, address: "0x4200000000000000000000000000000000000006"},
        {...linkMetadata, address: "0xE4aB69C077896252FAFBD49EFD26B5D171A32410"},
    ]],
    //pol
]);
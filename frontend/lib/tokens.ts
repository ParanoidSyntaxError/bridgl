export interface Token {
    name: string;
    symbol: string;
    address: string;
}

export const testnetTokens: Map<string, Token[]> = new Map([
    ["", [
        { symbol: "USDC", name: "USD Coin", address: "0x00" },
        { symbol: "USDT", name: "Tether", address: "0x00" },
        { symbol: "LINK", name: "Chainlink", address: "0x00" },
    ]],
]);
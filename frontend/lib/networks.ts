export interface Token {
    name: string
    symbol: string
    address: string
}

export interface Network {
    name: string
    symbol: string
    chainId: number
}

export const supportedNetworks: Network[] = [
    { name: "Ethereum", symbol: "ETH", chainId: 1 },
    { name: "Base", symbol: "BASE", chainId: 8453 },
    { name: "Arbitrum", symbol: "ARB", chainId: 42161 },
    { name: "Optimism", symbol: "OP", chainId: 10 },
    { name: "Avalanche", symbol: "AVAX", chainId: 43114 },
    { name: "Polygon", symbol: "POL", chainId: 137 },
];

export const defaultTokens: Map<number, Token[]> = new Map([
    [1, [
        { symbol: "WETH", name: "Ethereum", address: "0x00" },
        { symbol: "USDC", name: "USD Coin", address: "0x00" },
        { symbol: "USDT", name: "Tether", address: "0x00" },
        { symbol: "LINK", name: "Chainlink", address: "0x00" },
    ]],
    [8453, [
        { symbol: "WETH", name: "Ethereum", address: "0x00" },
        { symbol: "USDC", name: "USD Coin", address: "0x00" },
        { symbol: "USDT", name: "Tether", address: "0x00" },
        { symbol: "LINK", name: "Chainlink", address: "0x00" },
    ]],
    [42161, [
        { symbol: "WETH", name: "Ethereum", address: "0x00" },
        { symbol: "USDC", name: "USD Coin", address: "0x00" },
        { symbol: "USDT", name: "Tether", address: "0x00" },
        { symbol: "LINK", name: "Chainlink", address: "0x00" },
    ]],
    [10, [
        { symbol: "WETH", name: "Ethereum", address: "0x00" },
        { symbol: "USDC", name: "USD Coin", address: "0x00" },
        { symbol: "USDT", name: "Tether", address: "0x00" },
        { symbol: "LINK", name: "Chainlink", address: "0x00" },
    ]],
    [43114, [
        { symbol: "WETH", name: "Ethereum", address: "0x00" },
        { symbol: "USDC", name: "USD Coin", address: "0x00" },
        { symbol: "USDT", name: "Tether", address: "0x00" },
        { symbol: "LINK", name: "Chainlink", address: "0x00" },
    ]],
    [137, [
        { symbol: "WETH", name: "Ethereum", address: "0x00" },
        { symbol: "USDC", name: "USD Coin", address: "0x00" },
        { symbol: "USDT", name: "Tether", address: "0x00" },
        { symbol: "LINK", name: "Chainlink", address: "0x00" },
    ]],
]);
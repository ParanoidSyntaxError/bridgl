export interface Token {
    name: string;
    symbol: string;
    address: string;
}

export interface Network {
    name: string;
    symbol: string;
    chainSelector: string;
}

export const testnetNetworks: Network[] = [
    { name: "Ethereum Sepolia", symbol: "ETH", chainSelector: "16015286601757825753" },
    { name: "Solana Devnet", symbol: "SOL", chainSelector: "16423721717087811551" },
    { name: "Base Sepolia", symbol: "BASE", chainSelector: "10344971235874465080" },
    { name: "Arbitrum Sepolia", symbol: "ARB", chainSelector: "3478487238524512106" },
    { name: "OP Sepolia", symbol: "OP", chainSelector: "5224473277236331295" },
    { name: "Avalanche Fuji", symbol: "AVAX", chainSelector: "14767482510784806043" },
    { name: "Polygon Amoy", symbol: "POL", chainSelector: "16281711391670634445" },
];

export const testnetTokens: Map<string, Token[]> = new Map([
    ["", [
        { symbol: "USDC", name: "USD Coin", address: "0x00" },
        { symbol: "USDT", name: "Tether", address: "0x00" },
        { symbol: "LINK", name: "Chainlink", address: "0x00" },
    ]],
]);
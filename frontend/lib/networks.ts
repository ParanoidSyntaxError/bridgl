export interface Network {
    name: string;
    symbol: string;
    chainSelector: string;
}

export const mainnetNetworks: Network[] = [
    { name: "Ethereum", symbol: "ETH", chainSelector: "" },
    { name: "Solana", symbol: "SOL", chainSelector: "" },
    { name: "Base", symbol: "BASE", chainSelector: "" },
    { name: "Avalanche", symbol: "AVAX", chainSelector: "" },
    { name: "BNB Chain", symbol: "BNB", chainSelector: "" },
    { name: "Arbitrum", symbol: "ARB", chainSelector: "" },
    { name: "Optimism", symbol: "OP", chainSelector: "" },
    { name: "Polygon", symbol: "POL", chainSelector: "" },
];

export const testnetNetworks: Network[] = [
    { name: "Ethereum Sepolia", symbol: "ETH", chainSelector: "16015286601757825753" },
    { name: "Solana Devnet", symbol: "SOL", chainSelector: "16423721717087811551" },
    { name: "Base Sepolia", symbol: "BASE", chainSelector: "10344971235874465080" },
    { name: "Avalanche Fuji", symbol: "AVAX", chainSelector: "14767482510784806043" },
    { name: "BNB Chain Testnet", symbol: "BNB", chainSelector: "13264668187771770619" },
    { name: "Arbitrum Sepolia", symbol: "ARB", chainSelector: "3478487238524512106" },
    { name: "OP Sepolia", symbol: "OP", chainSelector: "5224473277236331295" },
    { name: "Polygon Amoy", symbol: "POL", chainSelector: "16281711391670634445" },
];
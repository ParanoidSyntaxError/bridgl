import { Chain } from "viem";
import * as viemChains from 'viem/chains';

export interface Network {
    name: string;
    symbol: string;
    icon: string;
    chainSelector: bigint;
    ccipRouterAddress: string;
    bridglAddress: string;
    viemChain: Chain | undefined;
}

export const ethSepolia: Network = {
    name: "Ethereum Sepolia",
    symbol: "ETH",
    icon: "https://app.dynamic.xyz/assets/networks/eth.svg",
    chainSelector: BigInt("16015286601757825753"),
    ccipRouterAddress: "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
    bridglAddress: "0x5dF681bA036a3bFA9c65F0AEa1Bc8089f4FB80e7",
    viemChain: viemChains.sepolia,
};

/*
export const solDevnet: Network = {
    name: "Solana Devnet",
    symbol: "SOL",
    icon: "https://app.dynamic.xyz/assets/networks/solana.svg",
    chainSelector: BigInt("16423721717087811551"),
    ccipRouterAddress: "Ccip842gzYHhvdDkSyi2YVCoAWPbYJoApMFzSxQroE9C",
    bridglAddress: "",
    viemChain: undefined,
};
*/

export const baseSepolia: Network = {
    name: "Base Sepolia",
    symbol: "BASE",
    icon: "https://app.dynamic.xyz/assets/networks/base.svg",
    chainSelector: BigInt("10344971235874465080"),
    ccipRouterAddress: "0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93",
    bridglAddress: "0x44a20905AaC9FdCeCCD3eb8343287eB28905F3aa",
    viemChain: viemChains.baseSepolia,
};

export const avaxFuji: Network = {
    name: "Avalanche Fuji",
    symbol: "AVAX",
    icon: "https://app.dynamic.xyz/assets/networks/avax.svg",
    chainSelector: BigInt("14767482510784806043"),
    ccipRouterAddress: "0xF694E193200268f9a4868e4Aa017A0118C9a8177",
    bridglAddress: "0x64E017197fA1285A96161213cdBfcAecc2da62BB",
    viemChain: viemChains.avalancheFuji
};

export const bnbTestnet: Network = {
    name: "BNB Chain Testnet",
    symbol: "BNB",
    icon: "https://app.dynamic.xyz/assets/networks/bnb.svg",
    chainSelector: BigInt("13264668187771770619"),
    ccipRouterAddress: "0xE1053aE1857476f36A3C62580FF9b016E8EE8F6f",
    bridglAddress: "0x5dF681bA036a3bFA9c65F0AEa1Bc8089f4FB80e7",
    viemChain: viemChains.bscTestnet,
};

export const arbSepolia: Network = {
    name: "Arbitrum Sepolia",
    symbol: "ARB",
    icon: "https://app.dynamic.xyz/assets/networks/arbitrum.svg",
    chainSelector: BigInt("3478487238524512106"),
    ccipRouterAddress: "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165",
    bridglAddress: "0x5dF681bA036a3bFA9c65F0AEa1Bc8089f4FB80e7",
    viemChain: viemChains.arbitrumSepolia
};

export const opSepolia: Network = {
    name: "OP Sepolia",
    symbol: "OP",
    icon: "https://app.dynamic.xyz/assets/networks/optimism.svg",
    chainSelector: BigInt("5224473277236331295"),
    ccipRouterAddress: "0x114A20A10b43D4115e5aeef7345a1A71d2a60C57",
    bridglAddress: "0x5dF681bA036a3bFA9c65F0AEa1Bc8089f4FB80e7",
    viemChain: viemChains.optimismSepolia
};


export const polAmoy: Network = {
    name: "Polygon Amoy",
    symbol: "POL",
    icon: "https://app.dynamic.xyz/assets/networks/polygon.svg",
    chainSelector: BigInt("16281711391670634445"),
    ccipRouterAddress: "0x9C32fCB86BF0f4a1A8921a9Fe46de3198bb884B2",
    bridglAddress: "0x7531437fD063acC4a1b1401C1C61F85AFc120971",
    viemChain: viemChains.polygonAmoy,
};

export const testnets = new Map<bigint, Network>([
    [ethSepolia.chainSelector, ethSepolia],
    //[solDevnet.chainSelector, solDevnet],
    [baseSepolia.chainSelector, baseSepolia],
    [avaxFuji.chainSelector, avaxFuji],
    [bnbTestnet.chainSelector, bnbTestnet],
    [arbSepolia.chainSelector, arbSepolia],
    [opSepolia.chainSelector, opSepolia],
    [polAmoy.chainSelector, polAmoy]
]);
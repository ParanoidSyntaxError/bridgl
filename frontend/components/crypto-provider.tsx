"use client";

import { DynamicContextProvider, EvmNetwork, mergeNetworks } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { avalancheFuji, bscTestnet } from "viem/chains";

const customEvmNetworks: EvmNetwork[] = [
    {
        blockExplorerUrls: [avalancheFuji.blockExplorers.default.url],
        chainId: avalancheFuji.id,
        chainName: avalancheFuji.name,
        iconUrls: ['https://app.dynamic.xyz/assets/networks/avax.svg'],
        name: avalancheFuji.name,
        nativeCurrency: {
            decimals: avalancheFuji.nativeCurrency.decimals,
            name: avalancheFuji.nativeCurrency.name,
            symbol: avalancheFuji.nativeCurrency.symbol,
            iconUrl: 'https://app.dynamic.xyz/assets/networks/avax.svg',
        },
        networkId: avalancheFuji.id,
        rpcUrls: [avalancheFuji.rpcUrls.default.http[0]],
        vanityName: 'Avalanche Fuji',
    },
    {
        blockExplorerUrls: [bscTestnet.blockExplorers.default.url],
        chainId: bscTestnet.id,
        chainName: bscTestnet.name,
        iconUrls: ['https://app.dynamic.xyz/assets/networks/bnb.svg'],
        name: bscTestnet.name,
        nativeCurrency: {
            decimals: bscTestnet.nativeCurrency.decimals,
            name: bscTestnet.nativeCurrency.name,
            symbol: bscTestnet.nativeCurrency.symbol,
            iconUrl: 'https://app.dynamic.xyz/assets/networks/bnb.svg',
        },
        networkId: bscTestnet.id,
        rpcUrls: [bscTestnet.rpcUrls.default.http[0]],
        vanityName: 'BSC Testnet',
    }
];

export function CryptoProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <DynamicContextProvider
            theme="light"
            settings={{
                environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID,
                walletConnectors: [
                    EthereumWalletConnectors,
                    SolanaWalletConnectors
                ],
                initialAuthenticationMode: "connect-only",
                overrides: {
                    evmNetworks: (networks) => mergeNetworks(networks, customEvmNetworks)
                }
            }}
        >
            <>
                {children}
            </>
        </DynamicContextProvider>
    );
}
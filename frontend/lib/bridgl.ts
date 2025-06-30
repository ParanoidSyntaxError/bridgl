import { BridglAbi, IERC20MetadataAbi } from "@/abi";
import { Network } from "@/lib/networks";
import { Address, encodeAbiParameters, Hex, isAddress, parseUnits } from "viem";
import * as CCIP from "@chainlink/ccip-js";
import { EVMExtraArgsV2 } from "@chainlink/ccip-js";
import { Wallet } from "@dynamic-labs/sdk-react-core";
import { isEthereumWallet } from "@dynamic-labs/ethereum";

const ccipClient = CCIP.createClient();

export async function wrap(
    wallet: Wallet,
    sourceNetwork: Network,
    destinationNetwork: Network,
    underlyingToken: string,
    to: string,
    uiAmount: string
): Promise<Hex | undefined> {
    try {
        if (!isEthereumWallet(wallet)) {
            return undefined;
        }

        const provider = await wallet.getWalletClient();
        const publicClient = await wallet.getPublicClient();

        if (!sourceNetwork.viemChain || !destinationNetwork.viemChain) {
            return undefined;
        }

        if (provider.chain.id !== sourceNetwork.viemChain.id) {
            return undefined;
        }

        if(!isAddress(underlyingToken)) {
            return undefined;
        }
        if(!isAddress(to)) {
            return undefined;
        }

        const [name, symbol, decimals] = await Promise.all([
            publicClient.readContract({
                abi: IERC20MetadataAbi,
                functionName: "name",
                address: underlyingToken
            }),
            publicClient.readContract({
                abi: IERC20MetadataAbi,
                functionName: "symbol",
                address: underlyingToken
            }),
            publicClient.readContract({
                abi: IERC20MetadataAbi,
                functionName: "decimals",
                address: underlyingToken
            })
        ]);

        const amount = parseUnits(uiAmount, decimals);

        const data = encodeWrapMessage(
            "Bridgl " + name,
            "b" + symbol,
            underlyingToken,
            to,
            amount
        );

        const extraArgs: EVMExtraArgsV2 = {
            gasLimit: 1_000_000,
            allowOutOfOrderExecution: true
        };
        const extraArgsEncoded = encodeEvmExtraArgsV2(extraArgs);

        const ccipFee = await evmCcipFee(
            publicClient,
            sourceNetwork.ccipRouterAddress as Address,
            destinationNetwork.chainSelector,
            destinationNetwork.bridglAddress as Address,
            data,
            extraArgs
        );
        if (!ccipFee) {
            return undefined;
        }

        const hash = await provider.writeContract({
            chain: sourceNetwork.viemChain,
            address: sourceNetwork.bridglAddress as Address,
            abi: BridglAbi,
            functionName: "wrap",
            args: [
                destinationNetwork.chainSelector,
                encodeAbiParameters([{ type: "address" }], [destinationNetwork.bridglAddress as Address]),
                extraArgsEncoded,
                underlyingToken,
                encodeAbiParameters([{ type: "address" }], [to as Address]),
                amount
            ],
            value: ccipFee
        });

        return hash;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export async function unwrap(
    wallet: Wallet,
    sourceNetwork: Network,
    destinationNetwork: Network,
    underlyingToken: string,
    to: string,
    amount: bigint
): Promise<Hex | undefined> {
    try {
        if (!isEthereumWallet(wallet)) {
            console.log("Not an EVM wallet");
            return undefined;
        }

        const provider = await wallet.getWalletClient();
        const publicClient = await wallet.getPublicClient();

        if (!sourceNetwork.viemChain || !destinationNetwork.viemChain) {
            console.log("Invalid network");
            return undefined;
        }

        if (provider.chain.id !== sourceNetwork.viemChain.id) {
            console.log("Invalid network");
            return undefined;
        }

        if(!isAddress(underlyingToken)) {
            console.log("Invalid underlying token");
            return undefined;
        }
        if(!isAddress(to)) {
            console.log("Invalid to address");
            return undefined;
        }

        const data = encodeWrapMessage(
            "",
            "",
            underlyingToken,
            to,
            amount
        );

        const extraArgs: EVMExtraArgsV2 = {
            gasLimit: 1_000_000,
            allowOutOfOrderExecution: true
        };
        const extraArgsEncoded = encodeEvmExtraArgsV2(extraArgs);

        const ccipFee = await evmCcipFee(
            publicClient,
            sourceNetwork.ccipRouterAddress as Address,
            destinationNetwork.chainSelector,
            destinationNetwork.bridglAddress as Address,
            data,
            extraArgs
        );
        if (!ccipFee) {
            console.log("Invalid CCIP fee");
            return undefined;
        }

        const hash = await provider.writeContract({
            chain: sourceNetwork.viemChain,
            address: sourceNetwork.bridglAddress as Address,
            abi: BridglAbi,
            functionName: "unwrap",
            args: [
                destinationNetwork.chainSelector,
                encodeAbiParameters([{ type: "address" }], [destinationNetwork.bridglAddress as Address]),
                extraArgsEncoded,
                encodeAbiParameters([{ type: "address" }], [underlyingToken as Address]),
                encodeAbiParameters([{ type: "address" }], [to as Address]),
                amount
            ],
            value: ccipFee
        });

        return hash;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
async function evmCcipFee(
    publicClient: any,
    routerAddress: Address,
    destinationChainSelector: bigint,
    destinationBridglAddress: Address,
    data: Hex,
    extraArgs: EVMExtraArgsV2
): Promise<bigint | undefined> {
    try {
        return await ccipClient.getFee({
            client: publicClient,
            routerAddress: routerAddress,
            destinationAccount: destinationBridglAddress,
            destinationChainSelector: destinationChainSelector.toString(),
            data: data,
            extraArgs: extraArgs
        }) * BigInt("2");
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

function encodeEvmExtraArgsV2(extraArgs: EVMExtraArgsV2): Hex {
    const extraArgParams = [
        { name: "gasLimit", type: "uint256" },
        { name: "allowOutOfOrderExecution", type: "bool" },
    ];
    const extraArgValues = [
        extraArgs.gasLimit,
        extraArgs.allowOutOfOrderExecution
    ];
    const extraArgEncoded = encodeAbiParameters(extraArgParams, extraArgValues);

    return `0x${"181dcf10" + extraArgEncoded.slice(2)}`;
}

function encodeWrapMessage(
    name: string,
    symbol: string,
    underlyingToken: Address,
    to: Address,
    amount: bigint
): Hex {
    const wrapParams = [
        { name: "name", type: "string" },
        { name: "symbol", type: "string" },
        { name: "underlyingToken", type: "address" },
        { name: "to", type: "address" },
        { name: "amount", type: "uint256" }
    ];
    const wrapValues = [
        name,
        symbol,
        underlyingToken,
        to,
        amount
    ];
    const encodedWrap = encodeAbiParameters(wrapParams, wrapValues);

    const messageLayout = [
        { name: "selector", type: "uint8" },
        { name: "data", type: "bytes" }
    ];
    return encodeAbiParameters(messageLayout, [0, encodedWrap]);
}
"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, ArrowDown } from "lucide-react"
import { Network, solDevnet, testnets } from "@/lib/networks"
import Link from "next/link"
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { unwrap, wrap } from "@/lib/bridgl"
import { testnetTokens, Token } from "@/lib/tokens"
import { isEthereumWallet } from "@dynamic-labs/ethereum"
import { BridglWrapperAbi, IERC20Abi, IERC20MetadataAbi } from "@/abi"
import { Address, decodeAbiParameters, parseUnits, zeroAddress } from "viem"
import { ToastContainer, useToast } from "@/components/ui/toast"

export default function BridgePage() {
    const { primaryWallet } = useDynamicContext();

    const [fromNetwork, setFromNetwork] = useState<Network | null>(null)
    const [toNetwork, setToNetwork] = useState<Network | null>(null)
    const [tokenInput, setTokenInput] = useState("")
    const [selectedToken, setSelectedToken] = useState<string | null>(null)
    const [amount, setAmount] = useState("")
    const [showFromNetworks, setShowFromNetworks] = useState(false)
    const [showToNetworks, setShowToNetworks] = useState(false)
    const [showTokenDropdown, setShowTokenDropdown] = useState(false)

    // Toast hook
    const { toasts, removeToast, showSuccessToast, showErrorToast } = useToast();

    const fromNetworkRef = useRef<HTMLDivElement>(null)
    const toNetworkRef = useRef<HTMLDivElement>(null)
    const tokenDropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node

            // Check if click is outside from network dropdown
            if (fromNetworkRef.current && !fromNetworkRef.current.contains(target)) {
                setShowFromNetworks(false)
            }

            // Check if click is outside to network dropdown
            if (toNetworkRef.current && !toNetworkRef.current.contains(target)) {
                setShowToNetworks(false)
            }

            // Check if click is outside token dropdown
            if (tokenDropdownRef.current && !tokenDropdownRef.current.contains(target)) {
                setShowTokenDropdown(false)
            }
        }

        // Add event listener when any dropdown is open
        if (showFromNetworks || showToNetworks || showTokenDropdown) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        // Cleanup event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [showFromNetworks, showToNetworks, showTokenDropdown])

    const handleTokenInputChange = (value: string) => {
        setTokenInput(value)
        setSelectedToken(value)

        // Show dropdown when user starts typing or clicks
        if (value.length > 0 || showTokenDropdown) {
            setShowTokenDropdown(true)
        }
    }

    const handleTokenSelect = (token: Token) => {
        setSelectedToken(token.address)
        setTokenInput(`${token.symbol}`)
        setShowTokenDropdown(false)
    }

    const supportedNetworks = testnets.values().toArray().filter(network => network.chainSelector !== solDevnet.chainSelector);
    const defaultTokens = testnetTokens.get(fromNetwork?.chainSelector || BigInt("0")) || [];

    const isCustomAddress = tokenInput.startsWith("0x") && tokenInput.length > 10;

    const handleBridge = async () => {
        try {
            if (!primaryWallet) {
                console.log("No primary wallet");
                return;
            }

            if (!fromNetwork || !toNetwork || !selectedToken) {
                console.log("No network or token");
                return;
            }

            if (!isEthereumWallet(primaryWallet)) {
                console.log("Not an EVM wallet");
                return;
            }

            const publicClient = await primaryWallet.getPublicClient();

            const [allowance, decimals] = await Promise.all([
                publicClient.readContract({
                    abi: IERC20Abi,
                    functionName: "allowance",
                    address: selectedToken as Address,
                    args: [primaryWallet.address as Address, fromNetwork.bridglAddress as Address]
                }),
                publicClient.readContract({
                    abi: IERC20MetadataAbi,
                    functionName: "decimals",
                    address: selectedToken as Address
                })
            ]);

            const parsedAmount = parseUnits(amount, decimals);
            if (parsedAmount > allowance) {
                const provider = await primaryWallet.getWalletClient();
                const hash = await provider.writeContract({
                    chain: fromNetwork.viemChain,
                    address: selectedToken as Address,
                    abi: IERC20Abi,
                    functionName: "approve",
                    args: [fromNetwork.bridglAddress as Address, parsedAmount]
                });
                if (!hash) {
                    console.log("Approve transaction failed");
                    return;
                }
                console.log("Approve transaction hash:", hash);
            }

            let wrapperUnderlying;
            try {
                const wrapper = await publicClient.readContract({
                    abi: BridglWrapperAbi,
                    functionName: "underlying",
                    address: selectedToken as Address
                });
                if (wrapper[1] !== zeroAddress) {
                    console.log("Wrapper:", wrapper);
                    wrapperUnderlying = decodeAbiParameters([{ type: "address" }], wrapper[1])[0];
                }
            } catch {}

            let hash;
            if (wrapperUnderlying) {
                console.log("Unwrapping");
                console.log("Wrapper underlying:", wrapperUnderlying);
                hash = await unwrap(
                    primaryWallet,
                    fromNetwork,
                    toNetwork,
                    wrapperUnderlying,
                    primaryWallet.address,
                    parsedAmount
                );
            } else {
                console.log("Wrapping");
                hash = await wrap(
                    primaryWallet,
                    fromNetwork,
                    toNetwork,
                    selectedToken,
                    primaryWallet.address,
                    amount
                );
            }
            if (!hash) {
                console.log("Invalid transaction");
                return;
            }

            console.log("Bridge transaction hash:", hash);

            setTimeout(() => {
                showSuccessToast("Success", `${fromNetwork.viemChain?.blockExplorers?.default.url}/tx/${hash}`)
            }, 2000);
        } catch (error) {
            console.error("Bridge error:", error);

            setTimeout(() => {
                showErrorToast("Error", error as string)
            }, 2000);
        }
    }

    const isFormValid = () => {
        return (selectedToken || isCustomAddress) && amount && fromNetwork && toNetwork
    }

    return (
        <div className="min-h-screen bg-white text-black relative overflow-hidden">
            {/* Toast Container */}
            <ToastContainer toasts={toasts} onClose={removeToast} />

            {/* Page Grid Background */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
                {/* Horizontal lines */}
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={`page-grid-h-${i}`}
                        className="absolute w-full border-t border-black"
                        style={{ top: `${i * 5}%` }}
                    />
                ))}
                {/* Vertical lines */}
                {Array.from({ length: 16 }).map((_, i) => (
                    <div
                        key={`page-grid-v-${i}`}
                        className="absolute h-full border-l border-black"
                        style={{ left: `${i * 6.25}%` }}
                    />
                ))}
            </div>

            {/* Header */}
            <header className="border-b-2 border-black bg-white relative h-16">
                <nav className="h-full px-6 flex justify-between items-center">
                    <div className="text-3xl font-bold tracking-wide">
                        <Link href="/" className="hover:text-red-600 transition-colors">
                            BRIDGL
                        </Link>
                    </div>
                    <div>
                        <DynamicWidget
                            innerButtonComponent={"Connect"}
                        />
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-12 relative z-10">
                {/* Bridge Form - Compact Single Card Design */}
                <div className="max-w-lg mx-auto">
                    <div className="border-2 border-black bg-white p-6 relative">
                        {/* Corner accents */}
                        <div className="absolute top-1 left-1 w-2 h-2 bg-red-600"></div>
                        <div className="absolute bottom-1 right-1 w-2 h-2 bg-black"></div>

                        <div className="relative z-10 space-y-5">
                            {/* From Network Section */}
                            <div className="relative" ref={fromNetworkRef}>
                                <label className="block text-xs font-bold mb-2 tracking-wider">FROM NETWORK</label>
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            setShowFromNetworks(!showFromNetworks)
                                            // Close other dropdowns
                                            setShowToNetworks(false)
                                            setShowTokenDropdown(false)
                                        }}
                                        className="w-full p-3 border-2 border-black bg-white text-left flex justify-between items-center hover:border-red-600 transition-colors"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <span className="font-bold text-sm">{fromNetwork ? fromNetwork.name : "SELECT NETWORK"}</span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${showFromNetworks ? "rotate-180" : ""}`} />
                                    </button>
                                    {showFromNetworks && (
                                        <div className="absolute h-36 overflow-y-scroll top-full left-0 right-0 border-2 border-black bg-white z-50 mt-1 shadow-lg">
                                            {supportedNetworks.values().toArray().map((network, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => {
                                                        setSelectedToken(null)
                                                        setTokenInput("")
                                                        setFromNetwork(network)
                                                        setShowFromNetworks(false)
                                                    }}
                                                    className="w-full p-2 text-left hover:bg-red-50 border-b border-black/10 last:border-b-0 flex items-center space-x-2"
                                                >
                                                    <span className="font-bold text-sm">{network.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Token Selection Section */}
                            <div className="relative" ref={tokenDropdownRef}>
                                <label className="block text-xs font-bold mb-2 tracking-wider">TOKEN</label>
                                <div className="relative">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Select token or enter contract address (0x...)"
                                            value={tokenInput}
                                            onChange={(e) => handleTokenInputChange(e.target.value)}
                                            onFocus={() => {
                                                setShowTokenDropdown(true)
                                                // Close other dropdowns
                                                setShowFromNetworks(false)
                                                setShowToNetworks(false)
                                            }}
                                            className="w-full p-3 pr-10 border-2 border-black bg-white font-mono text-xs focus:border-red-600 focus:outline-none"
                                        />
                                        <button
                                            onClick={() => {
                                                setShowTokenDropdown(!showTokenDropdown)
                                                // Close other dropdowns
                                                setShowFromNetworks(false)
                                                setShowToNetworks(false)
                                            }}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-red-600 transition-colors"
                                        >
                                            <ChevronDown
                                                className={`w-4 h-4 transition-transform ${showTokenDropdown ? "rotate-180" : ""}`}
                                            />
                                        </button>
                                    </div>

                                    {showTokenDropdown && defaultTokens.length > 0 && !isCustomAddress && (
                                        <div className="absolute top-full left-0 right-0 border-2 border-black bg-white z-50 max-h-40 overflow-y-auto mt-1 shadow-lg">
                                            {defaultTokens.map((token, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleTokenSelect(token)}
                                                    className="w-full p-2 text-left hover:bg-red-50 border-b border-black/10 last:border-b-0 flex items-center space-x-2"
                                                >
                                                    <div>
                                                        <div className="font-bold text-sm">{token.symbol}</div>
                                                        <div className="text-xs text-gray-600">{token.name}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Amount Section - Repositioned and Standardized */}
                            <div>
                                <label className="block text-xs font-bold mb-2 tracking-wider">AMOUNT</label>
                                <input
                                    type="number"
                                    placeholder="0.0"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    onFocus={() => {
                                        // Close all dropdowns when focusing on amount input
                                        setShowFromNetworks(false)
                                        setShowToNetworks(false)
                                        setShowTokenDropdown(false)
                                    }}
                                    className="w-full p-3 border-2 border-black bg-white text-base font-bold focus:border-red-600 focus:outline-none"
                                />
                            </div>

                            {/* Direction Arrow with Divider */}
                            <div className="flex items-center justify-center py-2">
                                <div className="flex-1 border-t-2 border-black/20"></div>
                                <div className="mx-4 p-2 border-2 border-black bg-white">
                                    <ArrowDown className="w-5 h-5 text-red-600" />
                                </div>
                                <div className="flex-1 border-t-2 border-black/20"></div>
                            </div>

                            {/* To Network Section */}
                            <div className="relative" ref={toNetworkRef}>
                                <label className="block text-xs font-bold mb-2 tracking-wider">TO NETWORK</label>
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            setShowToNetworks(!showToNetworks)
                                            // Close other dropdowns
                                            setShowFromNetworks(false)
                                            setShowTokenDropdown(false)
                                        }}
                                        className="w-full p-3 border-2 border-black bg-white text-left flex justify-between items-center hover:border-red-600 transition-colors"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <span className="font-bold text-sm">{toNetwork ? toNetwork.name : "SELECT NETWORK"}</span>
                                        </div>
                                        <ChevronDown className={`w-5 h-5 transition-transform ${showToNetworks ? "rotate-180" : ""}`} />
                                    </button>
                                    {showToNetworks && (
                                        <div className="absolute h-36 overflow-y-scroll top-full left-0 right-0 border-2 border-black bg-white z-50 mt-1 shadow-lg">
                                            {supportedNetworks.values().toArray().map((network, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => {
                                                        setToNetwork(network)
                                                        setShowToNetworks(false)
                                                    }}
                                                    className="w-full p-2 text-left hover:bg-red-50 border-b border-black/10 last:border-b-0 flex items-center space-x-2"
                                                >
                                                    <span className="font-bold text-sm">{network.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bridge Button */}
                            <div className="pt-3">
                                <button
                                    onClick={handleBridge}
                                    onFocus={() => {
                                        // Close all dropdowns when focusing on bridge button
                                        setShowFromNetworks(false)
                                        setShowToNetworks(false)
                                        setShowTokenDropdown(false)
                                    }}
                                    disabled={!isFormValid()}
                                    className="w-full bg-black text-white px-6 py-3 text-base font-bold hover:bg-red-600 transition-colors border-2 border-black hover:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:border-black"
                                >
                                    BRIDGE TOKENS
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

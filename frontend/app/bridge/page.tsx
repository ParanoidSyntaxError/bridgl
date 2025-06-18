"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, ArrowDown } from "lucide-react"
import { Network, testnetNetworks } from "@/lib/networks"
import { testnetTokens, Token } from "@/lib/tokens"

export default function BridgePage() {
    const [fromNetwork, setFromNetwork] = useState<Network | null>(null)
    const [toNetwork, setToNetwork] = useState<Network | null>(null)
    const [tokenInput, setTokenInput] = useState("")
    const [selectedToken, setSelectedToken] = useState<Token | null>(null)
    const [amount, setAmount] = useState("")
    const [showFromNetworks, setShowFromNetworks] = useState(false)
    const [showToNetworks, setShowToNetworks] = useState(false)
    const [showTokenDropdown, setShowTokenDropdown] = useState(false)

    // Refs for click outside detection
    const fromNetworkRef = useRef<HTMLDivElement>(null)
    const toNetworkRef = useRef<HTMLDivElement>(null)
    const tokenDropdownRef = useRef<HTMLDivElement>(null)

    // Click outside handler
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
        setSelectedToken(null)

        // Show dropdown when user starts typing or clicks
        if (value.length > 0 || showTokenDropdown) {
            setShowTokenDropdown(true)
        }
    }

    const handleTokenSelect = (token: Token) => {
        setSelectedToken(token)
        setTokenInput(`${token.symbol} - ${token.name}`)
        setShowTokenDropdown(false)
    }

    const handleTokenInputFocus = () => {
        setShowTokenDropdown(true)
    }

    const handleTokenInputBlur = () => {
        // Remove the timeout-based blur handler since we're using click outside detection
    }

    const filteredTokens = testnetTokens.get(fromNetwork?.chainSelector || "") || [];

    const isCustomAddress = tokenInput.startsWith("0x") && tokenInput.length > 10

    const handleBridge = () => {
        // Bridge logic would go here
        const tokenData = selectedToken || (isCustomAddress ? { address: tokenInput } : null)
        console.log("Bridging:", {
            token: tokenData,
            amount,
            fromNetwork,
            toNetwork,
        })
    }

    const isFormValid = () => {
        return (selectedToken || isCustomAddress) && amount && fromNetwork && toNetwork
    }

    return (
        <div className="min-h-screen bg-white text-black relative overflow-hidden">
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
            <header className="border-b-2 border-black relative z-10">
                <div className="container mx-auto px-6 py-4">
                    <nav className="flex justify-between items-center">
                        <a href="/" className="text-sm tracking-wider hover:text-red-600 transition-colors">
                            ← BACK TO BRIDGL
                        </a>
                        <div className="text-sm tracking-wider font-bold">SECURE BRIDGING PROTOCOL</div>
                    </nav>
                </div>
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
                                            {fromNetwork && (
                                                <div className="w-6 h-6 border border-black bg-white flex items-center justify-center text-xs font-bold">
                                                    {fromNetwork.symbol}
                                                </div>
                                            )}
                                            <span className="font-bold text-sm">{fromNetwork ? fromNetwork.name : "SELECT NETWORK"}</span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${showFromNetworks ? "rotate-180" : ""}`} />
                                    </button>
                                    {showFromNetworks && (
                                        <div className="absolute h-36 overflow-y-scroll top-full left-0 right-0 border-2 border-black bg-white z-50 mt-1 shadow-lg">
                                            {testnetNetworks.map((network, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => {
                                                        setFromNetwork(network)
                                                        setShowFromNetworks(false)
                                                    }}
                                                    className="w-full p-2 text-left hover:bg-red-50 border-b border-black/10 last:border-b-0 flex items-center space-x-2"
                                                >
                                                    <div className="w-6 h-6 border border-black bg-white flex items-center justify-center text-xs font-bold">
                                                        {network.symbol}
                                                    </div>
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
                                            onBlur={handleTokenInputBlur}
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

                                    {showTokenDropdown && (
                                        <div className="absolute top-full left-0 right-0 border-2 border-black bg-white z-50 max-h-40 overflow-y-auto mt-1 shadow-lg">
                                            {filteredTokens.length > 0 ? (
                                                <>
                                                    <div className="p-1.5 bg-gray-50 border-b border-black/10">
                                                        <span className="text-xs font-bold tracking-wider text-gray-600">DEFAULT TOKENS</span>
                                                    </div>
                                                    {filteredTokens.map((token, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => handleTokenSelect(token)}
                                                            className="w-full p-2 text-left hover:bg-red-50 border-b border-black/10 last:border-b-0 flex items-center space-x-2"
                                                        >
                                                            <div className="w-6 h-6 border border-black bg-white flex items-center justify-center text-xs font-bold">
                                                                {token.symbol}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-sm">{token.symbol}</div>
                                                                <div className="text-xs text-gray-600">{token.name}</div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </>
                                            ) : tokenInput.length > 0 ? (
                                                <div className="p-3 text-center text-gray-500 text-xs">
                                                    {isCustomAddress ? (
                                                        <span className="text-green-600 font-bold">Custom token address detected</span>
                                                    ) : (
                                                        "No matching tokens found"
                                                    )}
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="p-1.5 bg-gray-50 border-b border-black/10">
                                                        <span className="text-xs font-bold tracking-wider text-gray-600">DEFAULT TOKENS</span>
                                                    </div>
                                                    {filteredTokens.map((token, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => handleTokenSelect(token)}
                                                            className="w-full p-2 text-left hover:bg-red-50 border-b border-black/10 last:border-b-0 flex items-center space-x-2"
                                                        >
                                                            <div className="w-6 h-6 border border-black bg-white flex items-center justify-center text-xs font-bold">
                                                                {token.symbol}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-sm">{token.symbol}</div>
                                                                <div className="text-xs text-gray-600">{token.name}</div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </>
                                            )}
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
                                            {toNetwork && (
                                                <div className="w-6 h-6 border border-black bg-white flex items-center justify-center text-xs font-bold">
                                                    {toNetwork.symbol}
                                                </div>
                                            )}
                                            <span className="font-bold text-sm">{toNetwork ? toNetwork.name : "SELECT NETWORK"}</span>
                                        </div>
                                        <ChevronDown className={`w-5 h-5 transition-transform ${showToNetworks ? "rotate-180" : ""}`} />
                                    </button>
                                    {showToNetworks && (
                                        <div className="absolute h-36 overflow-y-scroll top-full left-0 right-0 border-2 border-black bg-white z-50 mt-1 shadow-lg">
                                            {testnetNetworks.map((network, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => {
                                                        setToNetwork(network)
                                                        setShowToNetworks(false)
                                                    }}
                                                    className="w-full p-2 text-left hover:bg-red-50 border-b border-black/10 last:border-b-0 flex items-center space-x-2"
                                                >
                                                    <div className="w-6 h-6 border border-black bg-white flex items-center justify-center text-xs font-bold">
                                                        {network.symbol}
                                                    </div>
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
                                    BRIDGE TOKENS →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

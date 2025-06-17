import { AlertTriangle, Hexagon, Shield, Zap } from "lucide-react"

export default function BridglLanding() {
    const bridgeHacks = [
        {
            name: "Ronin Bridge",
            amount: "$625M",
            description: "ITS SO OVER",
        },
        {
            name: "Wormhole",
            amount: "$325M",
            description: "DONT LOOK AT THE CHART BROS",
        },
        {
            name: "Poly Network",
            amount: "$611M",
            description: "BRB BUYING ROPE",
        },
        {
            name: "BNB Bridge",
            amount: "$100M",
            description: "JUST",
        },
    ]

    const supportedNetworks = [
        { name: "Ethereum", symbol: "ETH" },
        { name: "Base", symbol: "BASE" },
        { name: "Arbitrum", symbol: "ARB" },
        { name: "Optimism", symbol: "OP" },
        { name: "Avalanche", symbol: "AVAX" },
        { name: "Polygon", symbol: "POL" },
    ];

    return (
        <div className="min-h-screen bg-white text-black">
            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <header className="border-b-2 border-black">
                    <div className="container mx-auto px-6 py-4">
                        <nav className="flex justify-between items-center">
                            <div className="text-4xl font-bold tracking-wider">BRIDGL</div>
                            <a
                                href="#"
                                className="bg-black text-white px-8 py-1 tracking-wide text-lg font-bold hover:bg-red-600 transition-colors border-2 border-black hover:border-red-600 inline-block"
                            >
                                START BRIDGLING
                            </a>
                        </nav>
                    </div>
                </header>

                {/* Title Section */}
                <section className="py-24 border-b-2 border-black relative overflow-hidden">
                    {/* Grid Background - Title Section Only */}
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Horizontal lines */}
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={`title-h-${i}`}
                                className="absolute w-full border-t border-black/10"
                                style={{ top: `${i * 16.67}%` }}
                            />
                        ))}
                        {/* Vertical lines */}
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={`title-v-${i}`}
                                className="absolute h-full border-l border-black/10"
                                style={{ left: `${i * 16.67}%` }}
                            />
                        ))}
                    </div>

                    {/* Right side vertical line */}
                    <div className="absolute top-0 right-16 w-[2px] h-full bg-black"></div>

                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl relative">
                            <h1 className="px-4 bg-red-600 text-white text-8xl md:text-9xl font-black tracking-tighter mb-8">
                                BRIDGL
                            </h1>
                            <div className="border-l-4 border-red-600 pl-6 mb-12">
                                <p className="text-xl md:text-2xl font-light leading-relaxed">
                                    DECENTRALIZED CROSS-CHAIN WRAPPER
                                    <br />
                                    <span className="text-red-600">BRIDGE ANY TOKEN</span>
                                </p>
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                                <Hexagon className="w-5 h-5" color="blue" />
                                <span className="text-blue-600">POWERED BY CHAINLINK CCIP</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Rekt Section */}
                <section id="rekt" className="py-20 border-b-2 border-black bg-white relative">
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="mb-16">
                            <div className="flex items-center space-x-4 mb-6">
                                <h2 className="text-4xl md:text-6xl font-black">
                                    <span className="text-red-600">REKT</span> BRIDGES
                                </h2>
                            </div>
                            <p className="text-lg text-gray-600 max-w-xl">
                                Stop getting rekt. Over <span className="text-red-600 font-bold">$2.5 BILLION</span> lost to bridge 
                                hacks. Just BRIDGL.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {bridgeHacks.map((hack, index) => (
                                <div key={index} className="border-2 border-black bg-white p-6 relative overflow-hidden">
                                    {/* Grid pattern background */}
                                    <div className="absolute inset-0 pointer-events-none opacity-5">
                                        {/* Horizontal lines */}
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <div
                                                key={`rekt-grid-h-${index}-${i}`}
                                                className="absolute w-full border-t border-black"
                                                style={{ top: `${i * 16.67}%` }}
                                            />
                                        ))}
                                        {/* Vertical lines */}
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <div
                                                key={`rekt-grid-v-${index}-${i}`}
                                                className="absolute h-full border-l border-black"
                                                style={{ left: `${i * 16.67}%` }}
                                            />
                                        ))}
                                    </div>

                                    <div className="absolute top-0 left-0 w-full h-2 bg-red-600" />
                                    <div className="absolute top-2 right-0 w-2 h-full bg-black/10" />

                                    {/* Content with relative z-index to stay above grid */}
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-bold">{hack.name}</h3>
                                            <span className="text-2xl font-black text-red-600">{hack.amount}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{hack.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-6 border-2 border-red-600 bg-red-50 relative">
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-600"></div>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-600"></div>
                            <p className="text-center text-lg">
                                <span className="font-bold text-red-600">DISCLAIMER:</span> Every other bridge sucks
                            </p>
                        </div>
                    </div>
                </section>

                {/* Supported Networks Section */}
                <section id="networks" className="py-20">
                    <div className="container mx-auto px-6">
                        <div className="mb-16">
                            <h2 className="text-4xl md:text-6xl font-black mb-6">
                                SUPPORTED
                                <br />
                                <span className="text-red-600">NETWORKS</span>
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl">
                                Bridge tokens across many of the most popular networks.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {supportedNetworks.map((network, index) => (
                                <div key={index} className="text-center">
                                    <div className="aspect-square border-2 border-black bg-white p-3 relative flex flex-col items-center justify-center overflow-hidden">
                                        {/* Grid pattern background */}
                                        <div className="absolute inset-0 pointer-events-none opacity-5">
                                            {/* Horizontal lines */}
                                            {Array.from({ length: 4 }).map((_, i) => (
                                                <div
                                                    key={`grid-h-${i}`}
                                                    className="absolute w-full border-t border-black"
                                                    style={{ top: `${i * 25}%` }}
                                                />
                                            ))}
                                            {/* Vertical lines */}
                                            {Array.from({ length: 4 }).map((_, i) => (
                                                <div
                                                    key={`grid-v-${i}`}
                                                    className="absolute h-full border-l border-black"
                                                    style={{ left: `${i * 25}%` }}
                                                />
                                            ))}
                                        </div>

                                        {/* Corner squares */}
                                        <div className="absolute top-1 left-1 w-2 h-2 bg-red-600"></div>
                                        <div className="absolute bottom-1 right-1 w-2 h-2 bg-black"></div>

                                        <div className="w-12 h-12 mb-2 bg-white border-2 border-black flex items-center justify-center font-bold text-sm relative z-10">
                                            {network.symbol}
                                        </div>
                                        <h3 className="font-bold text-sm relative z-10">{network.name}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 text-center">
                            <a href="#" className="bg-black text-white px-12 py-4 tracking-wide text-lg font-bold hover:bg-red-600 transition-colors border-2 border-black hover:border-red-600">
                                START BRIDGLING
                            </a>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t-2 border-black py-8">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-4 md:mb-0">
                                <p className="font-mono text-sm">BRIDGL. SECURE BY DESIGN.</p>
                            </div>
                            <div className="flex space-x-8 text-sm">
                                <a href="#" className="hover:text-red-600 transition-colors">
                                    TWITTER
                                </a>
                                <a href="#" className="hover:text-red-600 transition-colors">
                                    GITHUB
                                </a>
                                <a href="#" className="hover:text-red-600 transition-colors">
                                    DEVFOLIO
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}
import { ArrowRight, Shield, Zap, ArrowUpDown, Diamond, Circle, Square, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";

export default function HomePage() {
	const bridgeHacks = [
		{ name: "RONIN", amount: "$625M" },
		{ name: "POLY NETWORK", amount: "$611M" },
		{ name: "BNB CHAIN", amount: "$586M" },
		{ name: "WORMHOLE", amount: "$326M" },
		{ name: "NOMAD", amount: "$190M" },
		{ name: "MULTICHAIN", amount: "$126M" },
		{ name: "HARMONY", amount: "$100M" },
		{ name: "QUBIT FINANCE", amount: "$80M" },
	];

	const supportedNetworks = [
		{ name: "ETHEREUM", symbol: "ETH" },
		{ name: "POLYGON", symbol: "POL" },
		{ name: "BSC", symbol: "BNB" },
		{ name: "ARBITRUM", symbol: "ARB" },
		{ name: "OPTIMISM", symbol: "OP" },
	];

	return (
		<div className="min-h-screen bg-white cursor-default">
			{/* Navigation */}
			<nav className="py-4">
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<span className="text-4xl font-black bg-black text-white tracking-tight p-2">BRIDGL</span>
						</div>
						<Button className="bg-blue-600 text-white px-4 rounded-none font-bold text-sm cursor-pointer">
							LAUNCH APP
						</Button>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="py-10">
				<div className="container mx-auto px-4">
					<div className="flex justify-left">
						<div className="text-left">
							<h1 className="text-8xl md:text-9xl font-black text-black leading-none tracking-tighter mb-8">
								BRIDGE
								<br />
								<span className="text-red-600">ANY</span>
								<br />
								TOKEN
							</h1>
							<div className="space-y-6">
								<p className="text-2xl text-gray-600 leading-tight">
									The most secure wrapped asset bridge. Ever.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Hall of Shame Section */}
			<section className="py-20 bg-black">
				<div className="flex flex-col justify-center">
					<div className="text-center">
						<h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
							REKT WALL
						</h2>
						<p className="text-xl text-gray-300">Bridge hacks that cost users billions in stolen funds.</p>
					</div>
					<div className="text-white px-4 mt-16 space-y-4">
						{bridgeHacks.map((rekt, i) => (
							<div key={i} className="flex justify-between items-center">
								<div className="text-4xl">
									{rekt.name}
								</div>
								<div className="text-3xl font-black text-red-600">
									{rekt.amount}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Value Proposition */}
			<section className="py-16">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl">
						<h2 className="text-5xl md:text-6xl font-black text-black leading-tight mb-6">
							Bridge your assets cross-chain with a couple of clicks.{" "}
							<span className="text-gray-500">Transparent and verifiable transactions.</span>
						</h2>
					</div>
				</div>
			</section>

			{/* Networks Section */}
			<section id="networks" className="py-24 bg-gray-50">
				<div className="px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-black text-black mb-6">SUPPORTED NETWORKS</h2>
						<p className="text-xl text-gray-600">Bridge between the most popular blockchain networks</p>
					</div>

					<div className="flex w-fit space-x-2">
						{supportedNetworks.map((network, i) => (
							<div
								key={i}
								className="flex flex-col w-42 h-32 p-4 bg-black"
							>
								<div className="text-white text-2xl font-black font-mono">{network.symbol}</div>
								<div className="text-red-500 text-xl">{network.name}</div>
								<div className="w-full h-full flex justify-end items-end">
									<div className="bg-white w-3 h-3" />
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Final CTA */}
			<section className="py-32">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-6xl md:text-7xl font-black text-black mb-8 leading-none tracking-tighter">
						START
						<br />
						<span className="text-red-600">BRIDGING</span>
					</h2>
					<p className="text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
						Connect your wallet and experience the simplest way to move tokens across chains.
					</p>
					<div className="flex flex-col sm:flex-row gap-6 justify-center">
						<Button size="lg" className="bg-blue-600 text-white rounded-none px-12 py-6 text-xl font-black cursor-pointer">
							LAUNCH APP
						</Button>
					</div>
				</div>
			</section>
		</div>
	)
}
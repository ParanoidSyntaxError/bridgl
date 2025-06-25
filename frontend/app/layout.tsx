import "./globals.css";
import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import { CryptoProvider } from "@/components/crypto-provider";

const spaceMono = Space_Mono({
	weight: ["400", "700"],
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "BRIDGL",
	description: "The most secure bridge ever",
	icons: {
		icon: "bridgl-logo.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${spaceMono.className} antialiased`} suppressHydrationWarning>
			<body>
				<CryptoProvider>
					<main>
						{children}
					</main>
				</CryptoProvider>
			</body>
		</html>
	);
}

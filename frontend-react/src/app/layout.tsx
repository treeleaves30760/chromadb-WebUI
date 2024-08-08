import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Chromadb WebUI",
	description: "This is the web interface for Chromadb",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="zh-tw">
			<body className={inter.className}>
				<Header />
				{children}
			</body>
		</html>
	);
}

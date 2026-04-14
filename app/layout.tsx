import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import AdHeader from "@/components/ads/AdHeader";
import AdMobileSticky from "@/components/ads/AdMobileSticky";
import VisitorCounter from "@/components/VisitorCounter";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Proxy War Watch — Who Backs Whom in Global Conflicts 2026",
  description:
    "Track proxy conflicts worldwide. See which countries back which factions, support types, and evidence levels for Yemen, Ukraine, Syria, Libya and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-950 text-gray-100">
        <AdHeader />
        <header className="border-b border-gray-800 px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-white hover:text-orange-400 transition-colors">
            Proxy War Watch
          </Link>
          <nav className="flex gap-4 text-sm text-gray-400">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/about" className="hover:text-white">About</Link>
          </nav>
          <VisitorCounter />
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-800 px-4 py-4 text-center text-xs text-gray-500">
          Proxy War Watch © 2026 — Data from OSINT, UN reports, and investigative journalism
        </footer>
        <AdMobileSticky />
      </body>
    </html>
  );
}

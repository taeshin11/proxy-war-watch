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
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <AdHeader />
        <header className="bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inset-0 rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative rounded-full h-2.5 w-2.5 bg-indigo-400"></span>
              </span>
              <Link href="/" className="text-lg font-bold">Proxy War Watch</Link>
              <span className="text-xs text-slate-400 border border-slate-700 rounded-full px-2 py-0.5 hidden sm:block">LIVE</span>
            </div>
            <nav className="flex gap-1">
              <Link href="/" className="text-slate-300 hover:text-white hover:bg-slate-700/50 px-3 py-2 rounded-lg text-sm">Home</Link>
              <Link href="/#conflicts" className="text-slate-300 hover:text-white hover:bg-slate-700/50 px-3 py-2 rounded-lg text-sm">Conflicts</Link>
              <Link href="/about" className="text-slate-300 hover:text-white hover:bg-slate-700/50 px-3 py-2 rounded-lg text-sm">About</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">Proxy War Watch</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs">Data from OSINT, UN reports, and investigative journalism</span>
            </div>
            <VisitorCounter />
          </div>
        </footer>
        <AdMobileSticky />
      </body>
    </html>
  );
}

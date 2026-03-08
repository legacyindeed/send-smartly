import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const bodyFont = Inter({ subsets: ["latin"], variable: "--font-body" });
const displayFont = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-display" });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME ?? "Smart Remittance Optimizer",
  description: "Premium remittance comparison with real FX baseline and mixed real/simulated provider quotes.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Scholarship Copilot | AI-Powered Academic Discovery",
  description: "Automate your scholarship discovery, evaluation, and application process with advanced AI agents.",
};

import { Header } from "@/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen" suppressHydrationWarning>
        <Header />
        <main className="relative z-10 min-h-screen pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}

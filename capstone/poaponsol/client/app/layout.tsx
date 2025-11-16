import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SolanaProvider } from "@/components/providers/wallet-provider";
import { Toaster } from "sonner";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "poaponsol",
  description: "A Solana poap",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={spaceGrotesk.className}>
      <body className="font-spaceGrotesk antialiased bg-black text-white">
          <SolanaProvider>
            <Toaster position="bottom-right" />
            {children}
          </SolanaProvider>
      </body>
    </html>
  );
}

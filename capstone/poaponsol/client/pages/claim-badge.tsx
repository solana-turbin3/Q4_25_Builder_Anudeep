"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { mintBadge } from "../lib/badges";
import * as anchor from "@coral-xyz/anchor";

export default function ClaimBadgePage() {
  const wallet = useWallet();

  const handleClaim = async () => {
    const eventPda = new anchor.web3.PublicKey("EVENT_PDA_FROM_BACKEND");
    const collectionMint = new anchor.web3.PublicKey("COLLECTION_MINT_FROM_BACKEND");

    await mintBadge(wallet as any, eventPda, collectionMint);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <button
        className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-400"
        onClick={handleClaim}
      >
        Claim Badge
      </button>
    </div>
  );
}

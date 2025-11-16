"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { createEvent } from "../lib/events";

export default function CreateEventPage() {
  const wallet = useWallet();

  const handleCreate = async () => {
    if (!wallet.connected) return alert("Connect wallet first");

    const args = {
      name: "SolanaConf 2025",
      uri: "https://arweave.net/solana-event.json",
      startTimestamp: new Date().getTime() / 1000,
      endTimestamp: new Date().getTime() / 1000 + 86400,
      maxClaims: 500,
    };

    await createEvent(wallet as any, args);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <button
        className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-400"
        onClick={handleCreate}
      >
        Create Event
      </button>
    </div>
  );
}

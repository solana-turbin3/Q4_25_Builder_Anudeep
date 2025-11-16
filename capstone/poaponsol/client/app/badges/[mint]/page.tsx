"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as anchor from "@coral-xyz/anchor";
import {
  Calendar,
  User,
  ExternalLink,
  Ticket,
  QrCode,
  Hash,
  Fingerprint,
} from "lucide-react";
import { fetchBadgeDetails } from "@/lib/badgeQueries";
import { useParams } from 'next/navigation'
import { useWallet, Wallet } from "@solana/wallet-adapter-react";

export default function BadgeDetailsPage(){
  const { mint } = useParams<{ mint: string}>()!;
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { wallet } = useWallet();

  const loadDetails = async () => {
    setLoading(true);

    const mintKey = new anchor.web3.PublicKey(mint);
    const info = await fetchBadgeDetails(wallet!.adapter as unknown as Wallet ,mintKey);

    setDetails(info);
    setLoading(false);
  };

  useEffect(() => {
    loadDetails();
  }, []);

  if (loading)
    return (
      <main className="min-h-screen bg-[#0B0B0B] text-white flex justify-center items-center">
        <p className="text-neutral-500">Loading badge details…</p>
      </main>
    );

  if (!details)
    return (
      <main className="min-h-screen bg-[#0B0B0B] text-white flex justify-center items-center">
        <p className="text-neutral-500">Badge not found.</p>
      </main>
    );

  const {
    badgeMint,
    claimedAt,
    eventName,
    eventPda,
    eventUri,
    collectionMint,
  } = details;

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-white pt-32 px-6">
      <div className="max-w-5xl mx-auto space-y-14">
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-semibold">
            Badge{" "}
            <span className="bg-gradient-to-tr from-emerald-400 to-white bg-clip-text text-transparent">
              Details
            </span>
          </h1>

          <p className="text-neutral-400 mt-3">
            Complete on-chain information about this attendance badge.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-14"
        >
          <div className="flex flex-col items-center">
            <div className="h-56 w-56 rounded-3xl bg-gradient-to-br from-emerald-600/20 to-emerald-400/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.2)]">
              <Ticket size={90} className="text-emerald-400" />
            </div>

            <p className="text-neutral-400 text-sm mt-3">
              NFT Mint: {badgeMint}
            </p>
          </div>

          <div className="space-y-8">
            {/* Event Name */}
            <div>
              <h2 className="text-3xl font-semibold text-white">
                {eventName}
              </h2>
              <p className="text-neutral-400 text-sm">
                Collection Mint: {collectionMint}
              </p>
            </div>

            <div className="space-y-5 bg-black/30 border border-emerald-500/20 p-6 rounded-xl backdrop-blur-lg shadow-[0_0_30px_rgba(16,185,129,0.1)]">
              
              <div className="flex items-center gap-3 text-neutral-300">
                <Calendar size={18} className="text-emerald-300" />
                <span>
                  Claimed at:{" "}
                  {new Date(claimedAt * 1000).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-3 text-neutral-300">
                <User size={18} className="text-emerald-300" />
                <span>Owner: </span>
              </div>

              <div className="flex items-center gap-3 text-neutral-300">
                <Fingerprint size={18} className="text-emerald-300" />
                <span>Event PDA: {eventPda}</span>
              </div>

              <div className="flex items-center gap-3 text-neutral-300">
                <Hash size={18} className="text-emerald-300" />
                <a
                  href={eventUri}
                  target="_blank"
                  className="text-emerald-400 hover:text-emerald-300 text-sm"
                >
                  View Event Metadata
                </a>
              </div>

              <a
                href={`https://explorer.solana.com/address/${badgeMint}?cluster=devnet`}
                target="_blank"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm pt-2"
              >
                View NFT on Explorer <ExternalLink size={14} />
              </a>
            </div>

            <button className="px-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all flex items-center gap-2 text-emerald-300 text-sm">
              <QrCode size={16} /> Generate Shareable QR 
              <span className="text-yellow-300">
                (Coming Soon)
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

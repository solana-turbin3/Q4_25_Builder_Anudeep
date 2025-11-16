"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchEventByPda } from "@/lib/eventQueries";
import { useWallet, Wallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Users,
  ArrowUpRight,
  QrCode,
  ExternalLink,
} from "lucide-react";
import * as anchor from "@coral-xyz/anchor";

export default function EventDetailsPage() {
  const params = useParams();
  const eventId = Array.isArray(params?.eventId) ? params?.eventId[0] : params?.eventId;
  const { wallet, connected } = useWallet();
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadEvent = async () => {
    if (!wallet?.adapter || !eventId) return;
    setLoading(true);

    const pubkey = new anchor.web3.PublicKey(eventId);
    const result = await fetchEventByPda(wallet.adapter as unknown as Wallet, pubkey);

    setEventData(result);
    setLoading(false);
  };

  useEffect(() => {
    if (connected) loadEvent();
  }, [connected]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-500">
        Loading event…
      </div>
    );

  if (!eventData)
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-500">
        Event not found.
      </div>
    );

  const e = eventData.data;

  const readableStart = new Date(Number(e.startTimestamp) * 1000).toDateString();
  const readableEnd = new Date(Number(e.endTimestamp) * 1000).toDateString();

  const now = Math.floor(Date.now() / 1000);
  const status =
    now < e.startTimestamp
      ? "Upcoming"
      : now > e.endTimestamp
      ? "Ended"
      : "Active";

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-white pt-32 px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-semibold">
            {e.name}
          </h1>

          <p className="text-neutral-400 max-w-2xl mx-auto mt-3">
            Your on-chain POAP event hosted on Solana.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center"
        >
          <span
            className={`px-5 py-2 rounded-full text-sm font-semibold ${
              status === "Active"
                ? "bg-emerald-500/20 text-emerald-400"
                : status === "Upcoming"
                ? "bg-blue-500/20 text-blue-300"
                : "bg-neutral-700 text-neutral-400"
            }`}
          >
            {status}
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 border border-emerald-500/20 backdrop-blur-xl rounded-2xl p-8 shadow-[0_0_40px_rgba(16,185,129,0.15)] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-emerald-300">Event Info</h3>
                <p className="text-neutral-300">
                  {e.uri}
                </p>
              </div>

              <div className="flex items-center gap-3 text-neutral-300">
                <Calendar className="text-emerald-400" size={20} />
                <span>{readableStart}</span>
              </div>

              <div className="flex items-center gap-3 text-neutral-300">
                <Clock className="text-emerald-400" size={20} />
                <span>{readableEnd}</span>
              </div>

              <div className="flex items-center gap-3 text-neutral-300">
                <Users className="text-emerald-400" size={20} />
                <span>Max Claims: {e.maxClaims}</span>
              </div>

              <div className="text-sm text-neutral-400 break-all">
                <strong className="text-neutral-300">Organizer:</strong>
                <br />
                {e.organizer.toBase58()}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-emerald-300 mb-2">
                  Collection Mint
                </h3>
                <p className="text-neutral-400 break-all">
                  {e.collectionMint.toBase58()}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-emerald-300 mb-2">
                  Event PDA
                </h3>
                <p className="text-neutral-400 break-all">{eventId}</p>
              </div>

              <a
                href={`https://explorer.solana.com/address/${eventId}?cluster=devnet`}
                target="_blank"
                className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200"
              >
                View on Explorer <ExternalLink size={16} />
              </a>

              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 border border-neutral-700 hover:border-emerald-400 hover:text-emerald-300 transition-all">
                <QrCode size={16} />
                Share Event QR 
                <span className="text-yellow-300">
                  (Coming Soon)
                </span>
              </button>

              <Link href={`/badges/${eventId}`}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full mt-4 flex items-center justify-center gap-3 px-5 py-3 
                    rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-400 text-black 
                    font-semibold shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.35)]
                    transition-all"
                >
                  Claim Badge
                  <ArrowUpRight size={18} />
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ExternalLink, Clock, User, Wallet } from "lucide-react";
import * as anchor from "@coral-xyz/anchor";
import { fetchAttendees } from "@/lib/attendeeQueries";
import { useWallet } from "@solana/wallet-adapter-react";

export default function AttendeesPage() {
  const params = useParams();
  const { wallet } = useWallet();
  const eventId = Array.isArray(params?.eventId) ? params?.eventId[0] : params?.eventId;
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAttendees = async () => {
    setLoading(true);
    const eventPubkey = new anchor.web3.PublicKey(eventId!);
    const list = await fetchAttendees(eventPubkey, wallet!);
    setAttendees(list);
    setLoading(false);
  };

  useEffect(() => {
    loadAttendees();
  }, []);

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-white pt-32 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-semibold">
            Event{" "}
            <span className="bg-gradient-to-tr from-emerald-400 to-white bg-clip-text text-transparent">
              Attendees
            </span>
          </h1>

          <p className="text-neutral-400 mt-3 max-w-xl mx-auto">
            View all participants who claimed the POAP badge for this event.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-neutral-400"
        >
          {attendees.length} attendee{attendees.length === 1 ? "" : "s"}
        </motion.div>

        {loading && (
          <div className="text-center py-20 text-neutral-500">
            Loading attendees…
          </div>
        )}

        {!loading && attendees.length === 0 && (
          <div className="text-center py-20 text-neutral-500">
            No attendees yet.
          </div>
        )}

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {attendees.map((a, idx) => (
            <motion.div
              key={a.wallet}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative bg-black/40 border border-emerald-500/20 
                rounded-2xl p-6 backdrop-blur-xl shadow-[0_0_25px_rgba(16,185,129,0.15)]
                hover:shadow-[0_0_35px_rgba(16,185,129,0.25)] transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none" />

              <div className="relative z-10 space-y-5">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500/40 to-emerald-300/10 flex items-center justify-center border border-emerald-500/20">
                    <User size={28} className="text-emerald-400" />
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-neutral-300 text-sm">Wallet Address</p>
                  <p className="font-mono text-emerald-300 text-sm break-all mt-1">
                    {a.wallet}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-neutral-300 text-sm">Badge Mint</p>
                  <p className="font-mono text-neutral-400 text-xs break-all mt-1">
                    {a.mint}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-neutral-300 text-sm">
                  <Clock size={16} className="text-emerald-300" />
                  <span>
                    {new Date(a.claimedAt * 1000).toLocaleString()}
                  </span>
                </div>

                <a
                  href={`https://explorer.solana.com/address/${a.mint}?cluster=devnet`}
                  target="_blank"
                  className="flex items-center gap-2 justify-center mt-3 text-emerald-400 hover:text-emerald-300 text-sm"
                >
                  View Badge <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}

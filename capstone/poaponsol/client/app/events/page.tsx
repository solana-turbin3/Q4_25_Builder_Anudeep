"use client";

import { useEffect, useState } from "react";
import { fetchEventsByOrganizer, fetchActiveEvents } from "@/lib/eventQueries";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Users, ChevronRight } from "lucide-react";
import Link from "next/link";
import Breadcrumb from "@/components/BreadCrumb";

export default function EventsPage() {
  const { publicKey, connected, wallet } = useWallet();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    if (!connected || !wallet?.adapter) return;

    setLoading(true);
    const list = await fetchEventsByOrganizer(wallet.adapter as any, publicKey!);
    setEvents(list || []);
    setLoading(false);
  };

  useEffect(() => {
    if (connected) loadEvents();
  }, [connected]);

  return (
    <>
    <main className="min-h-screen bg-[#0B0B0B] text-white pt-32 px-6">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb
      homeElement={'Home'}
      separator={<span> | </span>}
      activeClasses='text-emerald-400'
      containerClasses='flex py-2 bg-[#0B0B0B]' 
      listClasses='hover:underline mx-2 font-bold'
      capitalizeLinks
    />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-semibold">
            Your{" "}
            <span className="bg-gradient-to-tr from-emerald-400 to-white bg-clip-text text-transparent">
              Events
            </span>
          </h1>

          <p className="text-neutral-400 max-w-xl mx-auto mt-3">
            Manage and explore all POAP events you’ve created on Solana.
          </p>
        </motion.div>

        {loading && (
          <div className="text-center text-neutral-500 py-20">Loading events...</div>
        )}

        {!loading && events.length === 0 && (
          <div className="text-center py-20 text-neutral-400">
            No events created yet.
            <br />
            <Link
              href="/"
              className="mt-4 inline-block text-emerald-400 hover:text-emerald-300"
            >
              Create your first event →
            </Link>
          </div>
        )}

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {events.map((item, idx) => {
            const e = item.data;
            return (
              <motion.div
                key={item.pubkey.toBase58()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative p-6 rounded-2xl bg-black/40 border border-emerald-500/20 backdrop-blur-xl 
                  shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] 
                  transition-all duration-300 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.07),transparent_70%)] pointer-events-none" />

                <div className="relative z-10">
                  <h3 className="text-2xl font-semibold mb-2 text-emerald-300">
                    {e.name}
                  </h3>

                  <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
                    {e.uri}
                  </p>

                  <div className="flex flex-col gap-3 text-neutral-300 text-sm mt-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-emerald-300" />
                      <span>
                        {new Date(Number(e.startTimestamp) * 1000).toDateString()}
                        {" → "}
                        {new Date(Number(e.endTimestamp) * 1000).toDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-emerald-300" />
                      <span>{e.maxClaims} max claims</span>
                    </div>

                    <div>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          e.isActive
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-neutral-700 text-neutral-300"
                        }`}
                      >
                        {e.endTimestamp < Date.now() / 1000 ? "Ended" : "Active"}
                      </span>
                    </div>
                  </div>

                  <Link href={`/events/${item.pubkey.toBase58()}`}>
                    <button
                      className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2 
                        rounded-xl border border-emerald-500/40 text-emerald-300 
                        group-hover:bg-emerald-400 group-hover:text-black
                        transition-all duration-300 cursor-pointer"
                    >
                      View Details
                      <ChevronRight size={18} />
                    </button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </main>
    </>
  );
}

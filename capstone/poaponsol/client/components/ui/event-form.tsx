"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createEvent } from "@/lib/events";
import { useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";

export default function EventForm({
  walletConnected,
  onClose,
}: {
  walletConnected: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    uri: "",
    start: "",
    end: "",
    maxClaims: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { wallet } = useWallet();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage("");
      const args = {
        name: `${formData.name}`,
        uri: `${formData.uri}`,
        startTimestamp: new anchor.BN(Math.floor(Date.now() / 1000)),
        endTimestamp: new anchor.BN(Math.floor(Date.now() / 1000) + 86400),
        maxClaims: new anchor.BN(Number(formData.maxClaims)),
      };

      const result = await createEvent(wallet?.adapter as any, args);
      console.log("Event response result:", result);
      toast.success(`Event created: ${result.eventPda.toBase58()}`);
      onClose();
    } catch (err: any) {
      toast.error(`Failed: ${err.message}`);
      console.error(err);
      setErrorMessage(err.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      // className="backdrop-blur-md bg-black/40 border border-emerald-500/20 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.1)] p-8 w-full max-w-2xl mx-auto"
    >
      <h2 className="text-3xl md:text-4xl font-semibold text-emerald-400 mb-6">
        Create New Event
      </h2>
      <h3 className="text-sm text-red-400 mb-4">
        {errorMessage}
      </h3>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 text-neutral-200"
      >
        <div>
          <label className="block text-sm mb-2 text-neutral-400">Event Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-transparent border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-400 transition-all duration-200 placeholder:text-neutral-500"
            placeholder="SolanaConf 2025"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-neutral-400">Event URI</label>
          <input
            type="text"
            name="uri"
            value={formData.uri}
            onChange={handleChange}
            className="w-full bg-transparent border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-400 transition-all duration-200 placeholder:text-neutral-500"
            placeholder="https://arweave.net/event.json"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-neutral-400">Start Time</label>
          <input
            type="date"
            name="start"
            value={formData.start}
            onChange={handleChange}
            className="w-full bg-transparent border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-400 transition-all duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-neutral-400">End Time</label>
          <input
            type="date"
            name="end"
            value={formData.end}
            onChange={handleChange}
            className="w-full bg-transparent border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-400 transition-all duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-neutral-400">Max Claims</label>
          <input
            type="number"
            name="maxClaims"
            value={formData.maxClaims}
            onChange={handleChange}
            className="w-full bg-transparent border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-400 transition-all duration-200"
            placeholder="e.g. 500"
            required
          />
        </div>

        <div className="flex flex-col justify-end">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            disabled={!walletConnected}
            className={`flex items-center justify-center gap-2 border-2 rounded-xl px-5 py-3 text-lg font-semibold hover:cursor-pointer transition-all duration-300 ${
              walletConnected
                ? "bg-gradient-to-tr from-emerald-500 to-emerald-400 text-black border-emerald-500 hover:shadow-lg hover:shadow-emerald-400/20"
                : "bg-neutral-800 border-neutral-700 text-neutral-500 cursor-not-allowed"
            }`}
          >
            {loading
            ? "Processing..."
            : walletConnected
            ? "Create Event"
            : "Connect Wallet to Proceed"}
            <ArrowUpRight size={18} />
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

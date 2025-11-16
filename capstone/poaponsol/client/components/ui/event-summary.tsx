"use client";

import { motion } from "framer-motion";

export default function EventSummary({
  walletAddress,
  eventActive,
  claimsRemaining,
  totalClaims,
}: {
  walletAddress: string;
  eventActive: boolean;
  claimsRemaining: number;
  totalClaims: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="mt-10 backdrop-blur-md bg-black/40 border border-emerald-500/20 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.1)] p-8 w-full max-w-2xl mx-auto"
    >
      <h3 className="text-2xl font-semibold text-emerald-400 mb-4">
        Event Summary
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-neutral-300">
        <div>
          <p className="text-sm text-neutral-400">Wallet Address</p>
          <p className="font-mono truncate">{walletAddress || "Not Connected"}</p>
        </div>

        <div>
          <p className="text-sm text-neutral-400">Event Status</p>
          <p
            className={`font-semibold ${
              eventActive ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {eventActive ? "Active" : "Closed"}
          </p>
        </div>

        <div>
          <p className="text-sm text-neutral-400">Claims Remaining</p>
          <p className="font-semibold text-emerald-300">
            {claimsRemaining} / {totalClaims}
          </p>
        </div>

        <div>
          <p className="text-sm text-neutral-400">Network</p>
          <p className="font-semibold text-emerald-300">Solana Devnet</p>
        </div>
      </div>
    </motion.div>
  );
}

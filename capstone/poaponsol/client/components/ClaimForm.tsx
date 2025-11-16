"use client";

import { memo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { mintBadge } from "@/lib/badges";
import { toast } from "sonner";
import * as anchor from "@coral-xyz/anchor";

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modal = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, scale: 0.95, y: 40, transition: { duration: 0.2 } },
};

const ClaimForm = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { connected, wallet, publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventPda: "",
    collectionMint: "",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !wallet?.adapter) return toast.error("Connect wallet first!");
    if (!formData.eventPda || !formData.collectionMint)
      return toast.error("Please fill all fields.");

    setLoading(true);
    try {
      const eventPubkey = new anchor.web3.PublicKey(formData.eventPda.trim());
      const collectionPubkey = new anchor.web3.PublicKey(formData.collectionMint.trim());
      const badgeMint = await mintBadge(wallet.adapter as any, eventPubkey, collectionPubkey);
      toast.success(`Badge minted successfully: ${badgeMint.toBase58()}`);
      onClose();
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || "Failed to claim badge");
      toast.error(err.message || "Failed to claim badge");
    } finally {
      setLoading(false);
    }
  };
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-md"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="absolute inset-0" onClick={onClose} />
          {formError && (<div className="absolute top-6 bg-red-600 text-white px-4 py-2 rounded-md shadow-md">
            {formError}
          </div>)}
          <motion.div
            // variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-[#0c0c0c]/80 backdrop-blur-2xl border border-emerald-500/20 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.2)] w-[90%] max-w-lg p-8 sm:p-10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none"></div>

            {/* <button
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-400 hover:text-emerald-400 transition-colors duration-200"
            >
              <X size={22} />
            </button> */}

            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl font-semibold text-emerald-400 text-center">
                Claim Your Badge
              </h2>

              <form onSubmit={handleClaim} className="space-y-6">
                <div>
                  <label className="block text-sm mb-2 text-neutral-400">
                    Event PDA
                  </label>
                  <input
                    type="text"
                    name="eventPda"
                    value={formData.eventPda}
                    onChange={handleChange}
                    placeholder="Enter event PDA"
                    className="w-full bg-transparent border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-400 transition-all duration-200 placeholder:text-neutral-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-neutral-400">
                    Collection Mint
                  </label>
                  <input
                    type="text"
                    name="collectionMint"
                    value={formData.collectionMint}
                    onChange={handleChange}
                    placeholder="Enter collection mint address"
                    className="w-full bg-transparent border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-400 transition-all duration-200 placeholder:text-neutral-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-neutral-400">
                    Connected Wallet
                  </label>
                  <input
                    type="text"
                    value={publicKey?.toBase58() || "Not connected"}
                    readOnly
                    className="w-full bg-transparent border border-neutral-700 rounded-xl px-4 py-3 text-neutral-400"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading || !connected}
                  type="submit"
                  className={`w-full hover:cursor-pointer flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-lg font-semibold transition-all duration-300 ${
                    connected
                      ? "bg-gradient-to-tr from-emerald-500 to-emerald-400 text-black border-emerald-500 hover:shadow-lg hover:shadow-emerald-400/30"
                      : "bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed"
                  }`}
                >
                  {loading ? "Processing..." : "Claim Badge"}
                  <ArrowUpRight size={18} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(ClaimForm);

"use client";

import { mintBadge } from "@/lib/badges";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import * as anchor from "@coral-xyz/anchor";
import Form from "@/components/Form";
import ClaimForm from "./ClaimForm";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: {
    duration: 0.8,
    ease: [0.22, 1, 0.36, 1] as any,
  },
};

const fadeInUpDelayed = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: {
    duration: 0.8,
    delay: 0.5,
    ease: [0.22, 1, 0.36, 1] as any,
  },
};

const Hero = () => {
  const { connected, wallet } = useWallet();
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [claimOpen, setClaimOpen] = useState(false);

  const handleFormOpen = async () => {
    if (!connected || !wallet?.adapter) return toast.error("Connect wallet first!");
    setFormOpen(true);
  };

  const handleClaimOpen = async () => {
    if (!connected || !wallet?.adapter) return toast.error("Connect wallet first!");
    setClaimOpen(true);
  };
  
  return (
    <section className="relative py-14 w-full mt-20">
      <div className="abosolute z-99">
        <Form open={formOpen} onClose={() => setFormOpen(false)} />
        <ClaimForm open={claimOpen} onClose={() => setClaimOpen(false)} />
      </div>
      <motion.div
        className="max-w-3xl relative mx-auto flex flex-col items-center justify-center text-center"
        {...fadeInUp}
      >
        <h1 className="font-headline text-5xl md:text-5xl leading-tight font-semibold max-w-xl text-balance">
          Create, claim, and verify{" "}
          <span className="relative inline-block bg-gradient-to-tr from-emerald-400 to-white bg-clip-text text-transparent">
            attendance badges
          </span>{" "}
          effortlessly
        </h1>

        <p className="mt-4 text-base md:text-xl font-subtitle font-light text-neutral-400 max-w-xl">
          Celebrate every moment on-chain fast, verifiable, and decentralized
          with Solana.
        </p>

        <motion.div
          className="flex justify-center mt-8 gap-4"
          {...fadeInUpDelayed}
        >
          <motion.button
            className="flex items-center gap-2 bg-emerald-400 h-16 md:-auto border-2 hover:bg-white hover:text-black border-emerald-400 rounded-full px-2 md:px-5 py-3 text-lg font-subtitle font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-emerald-400/30 group hover:cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFormOpen}
            disabled={loading}
          >
            {/* <span>Create Event</span> */}
            {loading ? "Processing..." : "Create Event"}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: [0, 5, 0] }}
              transition={{
                repeat: Infinity,
                repeatDelay: 2.5,
                duration: 1,
              }}
              className="bg-white text-black bg-opacity-30 rounded-full p-0.5"
            >
              <ArrowUpRight size={18} />
            </motion.div>
          </motion.button>

          <motion.button
            className="flex items-center gap-2 border-2 h-16 bg-white text-black hover:bg-emerald-400 hover:text-white border-emerald-400 rounded-full px-2 md:px-5 py-2 text-lg font-subtitle font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-emerald-400/20 group hover:cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClaimOpen}
            disabled={loading}
          >
            {/* <span>Claim Badge</span> */}
            {loading ? "Processing..." : "Claim Badge"}
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

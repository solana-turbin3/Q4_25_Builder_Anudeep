"use client";

import { Button } from "./ui/button";
import React from "react";
import { useState } from "react";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";
import FooterGradient from "./ui/footer-gradient";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import Form from "./Form";

export default function Footer() {
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const { connected, wallet } = useWallet();
  const handleFormOpen = async () => {
    if (!connected || !wallet?.adapter) return toast.error("Connect wallet first!");
    setFormOpen(true);
  };
  return (
    <>
      <footer className="h-[30rem] md:h-[40rem] relative py-10 mt-0 md:mt-20">
        <div className="abosolute z-99">
          <Form open={formOpen} onClose={() => setFormOpen(false)} />
        </div>
        <div className="bg-black z-[-1] opacity-95 absolute inset-0 bg-dot-white"></div>
        <FooterGradient />
        <div className="flex z-[20] flex-col items-center justify-between h-full">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-6xl text-center font-medium">
              proof of attendance protocol for the
              <span className="text-muted-foreground/40 text-3xl md:text-5xl">
                <br />
                <span className="bg-gradient-to-tr mx-2 from-white via-emerald-400 to-white bg-clip-text text-transparent">
                  Solana ecosystem.
                </span>
              </span>
            </h1>
            <p className="text-muted-foreground mt-4 text-center max-w-2xl p-2 md:p-0">
              Celebrate every moment on-chain create, distribute, and verify attendance
              badges as NFTs. Fast, verifiable, and decentralized with Solana’s high-speed
              infrastructure.
            </p>
            <motion.button
            className="flex items-center gap-2 mt-10 bg-emerald-400 border-2 hover:bg-white hover:text-black border-emerald-400 rounded-full px-5 py-3 text-lg font-subtitle font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-emerald-400/30 group hover:cursor-pointer"
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
          </div>

          <div className="flex border-border/40 pt-8 w-full">
            <div className="max-w-6xl mx-auto px-4 w-full flex items-center justify-between">
              <div className="text-sm md:text-base">
                &copy;{new Date().getFullYear()} poaponsol
              </div>
              <div className="flex gap-4 items-center justify-center">
                <Link
                  href="https://github.com/0x4nud33p/poaponsol"
                  target="_blank"
                  className=""
                >
                  <IconBrandGithub className="size-5 md:size-8" />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/0x4nud33p/"
                  target="_blank"
                  className=""
                >
                  <IconBrandLinkedin className="size-5 md:size-8" />
                </Link>
                <Link
                  href="https://x.com/0x4nud33p"
                  target="_blank"
                  className=""
                >
                  <IconBrandX className="size-5 md:size-8" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

"use client";

import { memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EventForm from "./ui/event-form";
import { useWallet } from "@solana/wallet-adapter-react";
import { X } from "lucide-react";

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

const Form = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { connected } = useWallet();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

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
          <div
            className="absolute inset-0"
            onClick={onClose}
          />

          <motion.div
            // variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-[#0c0c0c]/80 backdrop-blur-2xl border border-emerald-500/20 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.2)] w-[90%] max-w-3xl p-6 sm:p-10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_60%)] pointer-events-none"></div>
            <div className="relative z-10 space-y-10">
              <EventForm
                walletConnected={connected}
                onClose={onClose}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(Form);

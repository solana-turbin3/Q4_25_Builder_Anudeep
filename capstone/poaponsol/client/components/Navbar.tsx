"use client";

import React from "react";
import Link from "next/link";
import WalletWrapper from "@/components/WalletWrapper";

const Navbar = () => {
  return (
    <header className="fixed top-0 inset-x-0 z-30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mt-4 rounded-2xl border border-neutral-800 bg-black/40 backdrop-blur-xl supports-[backdrop-filter]:bg-black/30 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between px-5 py-4">
            <Link
              href="/"
              className="text-lg md:text-xl font-bold tracking-wide bg-gradient-to-r from-emerald-400 via-white to-emerald-500 bg-clip-text text-transparent"
            >
              POAPonSOL
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-sm text-gray-300 hover:text-emerald-400 transition-colors"
              >
                Features
              </Link>
              <Link
                href="/events"
                className="text-sm text-gray-300 hover:text-emerald-400 transition-colors"
              >
               My Events
              </Link>
              <Link
                href="/badges"
                className="text-sm text-gray-300 hover:text-emerald-400 transition-colors"
              >
               My Badges
              </Link>
            </nav>
            <div className="hidden md:block">
              <WalletWrapper />
            </div>
            <div className="md:hidden h-10 md:w-auto md:h-auto">
              <WalletWrapper />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

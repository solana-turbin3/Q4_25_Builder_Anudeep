import { FeaturesSectionDemo } from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0B0B0B] text-white">
      <Navbar />

      <section className="flex flex-col items-center justify-center mt-0 md:mt-20 px-6 md:px-0">
        <Hero />
      </section>
      <section
        id="features"
        className="flex flex-col lg:flex-row mt-20 mx-auto w-full max-w-7xl px-6"
      >
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="max-w-md">
            <h2 className="text-3xl md:text-5xl font-semibold leading-tight mb-6">
              Why <span className="text-emerald-400">POAPonSOL</span>?
            </h2>
            <p className="text-neutral-400 text-base md:text-lg">
              POAPonSOL is a decentralized proof-of-attendance protocol built on
              Solana enabling event organizers to create, distribute, and
              verify digital attendance badges as NFTs.
            </p>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center mt-10 lg:mt-0">
          <FeaturesSectionDemo />
        </div>
      </section>

      <Footer />
    </main>
  );
}

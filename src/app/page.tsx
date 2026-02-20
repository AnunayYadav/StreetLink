"use client";

import { ArrowRight, Store, ShoppingBag, ShieldCheck, ChevronRight, Zap, Users, Globe } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-50 flex flex-col overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[0%] left-[20%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <header className="relative z-10 w-full border-b border-border-subtle bg-background/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-accent rotate-3">
              <Store size={28} strokeWidth={3} />
            </div>
            <span className="text-2xl font-black text-surface-900 tracking-tighter">Localynk</span>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-surface-500">
              <Link href="/search" className="hover:text-primary transition-colors">Markets</Link>
              <Link href="/onboarding" className="hover:text-primary transition-colors">Register</Link>
              <Link href="/orders" className="hover:text-primary transition-colors">Support</Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-soft rounded-full text-primary border border-primary/10">
                <Zap size={14} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-widest">Next-Gen Local Commerce</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black leading-[0.9] text-surface-900 tracking-tighter">
                Local <br />
                <span className="text-primary italic">Heartbeat.</span> <br />
                Linked.
              </h1>
              <p className="text-muted font-bold text-lg leading-relaxed max-w-lg">
                The heart of your neighborhood, digitally linked. Connecting local vendors with modern shoppers through power and elegance.
              </p>

              {/* Stats moved here for desktop flow */}
              <div className="hidden lg:grid grid-cols-2 gap-12 pt-10 border-t border-border-subtle">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-primary">
                    <Users size={20} />
                    <span className="text-2xl font-black text-surface-900 tracking-tight">12k+</span>
                  </div>
                  <p className="text-[10px] font-black text-muted uppercase tracking-widest italic">Verified Vendors</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-secondary">
                    <Globe size={20} />
                    <span className="text-2xl font-black text-surface-900 tracking-tight">24/7</span>
                  </div>
                  <p className="text-[10px] font-black text-muted uppercase tracking-widest italic">Digital Access</p>
                </div>
              </div>
            </motion.div>

            <div className="space-y-6">
              <motion.div
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-primary/20 rounded-[32px] blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <Link href="/onboarding" className="relative block p-8 bg-contrast-bg text-contrast-text rounded-[32px] shadow-2xl glass overflow-hidden min-h-[180px] flex flex-col justify-between group text-left">
                  <div className="absolute right-0 top-0 w-48 h-48 bg-primary opacity-20 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                  <div className="flex justify-between items-start relative z-10">
                    <div className="w-16 h-16 bg-primary/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-primary shadow-accent group-hover:scale-110 transition-transform border border-primary/20">
                      <Store size={32} strokeWidth={3} />
                    </div>
                    <div className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-primary group-hover:text-white transition-all">
                      <ArrowRight size={24} />
                    </div>
                  </div>
                  <div className="relative z-10 mt-6 text-left">
                    <h3 className="text-2xl font-black mb-1 tracking-tight text-inherit">Digitalize Your Shop</h3>
                    <p className="opacity-60 text-[9px] font-black uppercase tracking-[0.3em] text-inherit">Launch in 60 seconds</p>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <Link href="/search" className="block p-8 glass-card rounded-[32px] border border-border-subtle shadow-premium hover:border-primary/20 transition-all min-h-[180px] flex flex-col justify-between group text-left">
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 bg-primary-soft text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner border border-primary/10">
                      <ShoppingBag size={32} strokeWidth={3} />
                    </div>
                    <div className="w-12 h-12 bg-surface-50 glass rounded-xl flex items-center justify-center text-surface-300 group-hover:bg-primary group-hover:text-white transition-all">
                      <ChevronRight size={24} />
                    </div>
                  </div>
                  <div className="mt-6 text-left">
                    <h3 className="text-2xl font-black text-surface-900 mb-1 tracking-tight">Explore Markets</h3>
                    <p className="text-muted text-[9px] font-black uppercase tracking-[0.3em]">Discover local artisans</p>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Mobile-only stats section (hidden on large screens) */}
          <div className="lg:hidden mt-20 grid grid-cols-2 gap-8 border-t border-border-subtle pt-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <Users size={18} />
                <span className="text-xl font-black text-surface-900 tracking-tight">12k+</span>
              </div>
              <p className="text-[10px] font-black text-muted uppercase tracking-widest italic leading-tight">Verified <br /> Local Merchants</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-secondary">
                <Globe size={18} />
                <span className="text-xl font-black text-surface-900 tracking-tight">Real-time</span>
              </div>
              <p className="text-[10px] font-black text-muted uppercase tracking-widest italic leading-tight">Digital <br /> Connectivity</p>
            </div>
          </div>
        </div>

        {/* Brand Footer */}
        <footer className="relative z-10 bg-surface-100/50 border-t border-border-subtle pt-20 pb-32">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-3 gap-12 items-start text-left">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                  <Store size={18} />
                </div>
                <span className="text-lg font-black text-surface-900 tracking-tighter">Localynk</span>
              </div>
              <p className="text-sm font-bold text-muted leading-relaxed max-w-xs">
                Empowering India&apos;s micro-entrepreneurs through high-performance digital inclusion.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-900">Platform</h4>
              <nav className="flex flex-col gap-4 text-sm font-bold text-muted">
                <Link href="/search" className="hover:text-primary transition-colors">Vendor Discovery</Link>
                <Link href="/onboarding" className="hover:text-primary transition-colors">Store Registration</Link>
                <Link href="#" className="hover:text-primary transition-colors">Market Analytics</Link>
              </nav>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-900">Platform Trust</h4>
              <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest px-4 py-2 bg-primary-soft rounded-lg border border-primary/10 w-fit">
                <ShieldCheck size={14} strokeWidth={3} />
                SSL Encrypted Network
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

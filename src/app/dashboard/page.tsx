"use client";

import {
    TrendingUp,
    Plus,
    Share2,
    QrCode,
    ChevronRight,
    Clock,
    Package,
    ArrowRight,
    LayoutGrid
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

export default function VendorDashboard() {
    return (
        <div className="min-h-screen bg-surface-50">
            <header className="sticky top-0 bg-surface-50/80 backdrop-blur-md z-30 border-b border-border-subtle">
                <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-6 flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-3xl overflow-hidden glass shadow-premium border-2 border-white dark:border-white/10 rotate-3 transform transition-transform hover:rotate-0">
                            <img
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-0.5">Verified Partner</h1>
                            <p className="text-xl font-black text-surface-900 tracking-tight flex items-center gap-2">
                                Merchant Portal
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <button className="w-12 h-12 glass rounded-2xl flex items-center justify-center shadow-premium border border-border-subtle active:scale-90 transition-all">
                            <Share2 size={20} className="text-surface-900" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="w-full">
                <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24 space-y-12 py-12">
                    <div className="grid lg:grid-cols-12 gap-10">
                        {/* Left Column: Stats & Actions */}
                        <div className="lg:col-span-7 space-y-10">
                            {/* Wallet Section */}
                            <section className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <h2 className="text-sm font-black text-surface-900 uppercase tracking-widest">Earnings Stats</h2>
                                    <div className="px-3 py-1.5 bg-card-bg rounded-xl border border-border-subtle text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                        Monthly <ChevronRight size={12} />
                                    </div>
                                </div>

                                <div className="card-elevated bg-primary p-8 text-contrast-text relative overflow-hidden group shadow-accent">
                                    <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                                    <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Total Available Balance</p>
                                            <h3 className="text-5xl font-black tracking-tighter flex items-baseline gap-2">
                                                ₹ 0
                                                <span className="text-sm font-bold opacity-60">.00</span>
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-5 bg-white/15 rounded-3xl backdrop-blur-sm border border-white/10 group-hover:bg-white/20 transition-colors">
                                                <p className="text-[8px] font-black uppercase tracking-widest opacity-70 mb-2">Success Rate</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="font-black text-xl tracking-tight">0%</span>
                                                    <TrendingUp size={16} />
                                                </div>
                                            </div>
                                            <div className="p-5 bg-white/15 rounded-3xl backdrop-blur-sm border border-white/10 group-hover:bg-white/20 transition-colors">
                                                <p className="text-[8px] font-black uppercase tracking-widest opacity-70 mb-2">Deliveries</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="font-black text-xl tracking-tight">0</span>
                                                    <Package size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Quick Actions Grid */}
                            <section className="grid sm:grid-cols-2 gap-6">
                                <Link href="/products" className="glass-card p-6 flex flex-col gap-5 border border-border-subtle hover:border-primary/20 transition-all group shadow-elevated rounded-[32px]">
                                    <div className="w-16 h-16 rounded-3xl bg-primary-soft text-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner border border-primary/10">
                                        <Plus size={32} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-surface-900 uppercase tracking-widest text-[10px] mb-1 opacity-60">Manage Inventory</h4>
                                        <p className="text-2xl font-black tracking-tight">Add Product</p>
                                    </div>
                                </Link>
                                <div className="glass-card p-6 flex flex-col gap-5 border border-border-subtle hover:border-primary/20 transition-all group cursor-pointer shadow-elevated rounded-[32px]">
                                    <div className="w-16 h-16 rounded-3xl bg-secondary-soft text-secondary dark:bg-surface-100 dark:text-surface-900 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner border border-border-subtle">
                                        <QrCode size={32} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-surface-900 uppercase tracking-widest text-[10px] mb-1 opacity-60">Digital Entrance</h4>
                                        <p className="text-2xl font-black tracking-tight">Store QR Code</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Active Orders & Promo */}
                        <div className="lg:col-span-5 space-y-10">
                            <section className="space-y-6">
                                <div className="flex items-center justify-between px-1">
                                    <h2 className="text-sm font-black text-surface-900 uppercase tracking-widest">Active Orders</h2>
                                    <Link href="/orders" className="text-[10px] font-black uppercase tracking-widest text-primary hover:translate-x-1 transition-transform flex items-center gap-1">
                                        History <ArrowRight size={12} />
                                    </Link>
                                </div>

                                <div className="space-y-4">
                                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 bg-card-bg rounded-[32px] border-2 border-dashed border-border-subtle shadow-inner">
                                        <div className="w-20 h-20 bg-surface-50 rounded-full flex items-center justify-center text-surface-200">
                                            <Clock size={40} />
                                        </div>
                                        <div className="space-y-1 px-6">
                                            <p className="text-xl font-black text-surface-900 tracking-tight">Queue Clear</p>
                                            <p className="text-[10px] font-bold text-muted italic uppercase tracking-widest leading-relaxed">No orders in flight</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Promotion Banner */}
                            <section className="card-premium p-6 bg-contrast-bg text-contrast-text relative overflow-hidden group shadow-2xl">
                                <div className="absolute right-0 bottom-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                                <div className="relative z-10 flex flex-col gap-6">
                                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/5 rotate-6 transform group-hover:rotate-0 transition-transform">
                                        <LayoutGrid size={32} className="text-primary" />
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Intelligent AI Hub</h4>
                                        <p className="text-2xl font-black tracking-tight leading-tight">Generate magic descriptions for your menu</p>
                                        <button className="text-sm font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 group pt-2">
                                            Unlock Now <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

"use client";

import { useState } from "react";
import { Search, MapPin, Star, SlidersHorizontal, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const VENDORS: any[] = [];

export default function CustomerDiscovery() {
    const [activeCategory, setActiveCategory] = useState("All");

    return (
        <div className="min-h-screen bg-surface-50">
            {/* Top Bar */}
            <header className="sticky top-0 bg-surface-50/90 backdrop-blur-md z-30 border-b border-border-subtle">
                <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-6 w-full grid lg:grid-cols-2 gap-6 items-center">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-primary shadow-inner border border-primary/10">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] opacity-80 italic">Market Explorer</p>
                                <h1 className="text-xl font-black text-surface-900 tracking-tighter">Locating Neighbors...</h1>
                            </div>
                        </div>
                        <button className="lg:hidden w-12 h-12 bg-card-bg rounded-2xl flex items-center justify-center shadow-premium border border-border-subtle active:scale-95 transition-all">
                            <SlidersHorizontal size={20} className="text-surface-900" />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center gap-4">
                        <div className="relative group flex-1">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary transition-colors" size={24} />
                            <input
                                type="text"
                                placeholder="Search neighborhood artisans..."
                                className="w-full h-16 pl-16 pr-8 rounded-3xl glass-card shadow-premium border border-border-subtle outline-none font-bold text-lg text-surface-900 placeholder:text-surface-300 focus:border-primary/40 focus:ring-8 focus:ring-primary/5 transition-all"
                            />
                        </div>
                        <button className="hidden lg:flex w-16 h-16 glass rounded-3xl items-center justify-center shadow-premium border border-border-subtle hover:border-primary/20 active:scale-95 transition-all">
                            <SlidersHorizontal size={24} className="text-surface-900" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="w-full pb-32 pt-10">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    {/* Categories */}
                    <div className="mb-12 overflow-x-auto no-scrollbar flex gap-4">
                        {["All", "Fast Food", "Snacks", "Healthy", "Desserts", "Traditional", "Organic"].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 border-2 shrink-0 ${activeCategory === cat
                                    ? "bg-primary text-white border-primary shadow-accent"
                                    : "bg-card-bg text-surface-500 border-border-subtle shadow-premium hover:border-primary/20"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* Featured Column */}
                        <div className="lg:col-span-8">
                            <section className="mb-12">
                                <div className="card-elevated bg-surface-900 h-[350px] relative overflow-hidden group shadow-2xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200"
                                        className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-[2000ms]"
                                        alt="Featured"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/20 to-transparent" />
                                    <div className="absolute bottom-10 left-10 right-10 text-white space-y-4">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                                            <Star size={12} fill="currentColor" strokeWidth={0} />
                                            Featured Today
                                        </div>
                                        <h2 className="text-5xl font-black tracking-tighter leading-[0.9]">Authentic Mughlai <br /> Street Flavors</h2>
                                        <p className="text-white/60 text-sm font-bold italic max-w-md">Experience the legendary spice blends of Kanpur&apos;s most celebrated street artisan.</p>
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-black text-surface-900 uppercase tracking-widest">Recommended Mix</h3>
                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest italic">Sorted by Distance</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {VENDORS.length > 0 ? VENDORS.map(vendor => (
                                        <Link key={vendor.id} href={`/shop/${vendor.id}`}>
                                            <motion.div
                                                whileTap={{ scale: 0.98 }}
                                                className="card-premium p-6 flex flex-col gap-6 group relative bg-card-bg shadow-elevated border-2 border-transparent hover:border-primary/20 transition-all"
                                            >
                                                <div className="w-full h-48 rounded-[32px] overflow-hidden bg-surface-50 shadow-inner">
                                                    <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-black text-surface-900 text-2xl tracking-tighter mb-1">{vendor.name}</h4>
                                                            <p className="text-[11px] font-black text-muted italic uppercase tracking-widest">{vendor.category} • {vendor.distance}</p>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-soft text-primary rounded-xl text-[11px] font-black border border-primary/10">
                                                            <Star size={14} fill="currentColor" strokeWidth={0} />
                                                            {vendor.rating}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
                                                        <span className="text-sm font-black text-surface-400 uppercase tracking-widest">{vendor.priceRange} Average</span>
                                                        <div className="w-10 h-10 bg-surface-50 rounded-2xl flex items-center justify-center text-surface-300 group-hover:bg-primary group-hover:text-white transition-all">
                                                            <ArrowRight size={20} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    )) : (
                                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-6 bg-card-bg rounded-[32px] border-2 border-dashed border-border-subtle shadow-inner">
                                            <div className="w-24 h-24 bg-surface-50 rounded-full flex items-center justify-center text-surface-200">
                                                <Search size={48} />
                                            </div>
                                            <div className="space-y-2 px-6">
                                                <p className="text-2xl font-black text-surface-900 tracking-tight">No Vendors Active</p>
                                                <p className="text-sm font-bold text-muted italic">Local micro-markets are currently resting. <br className="hidden md:block" /> Check back during peak street hours.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Side Column: Trending/Stats (Hidden on mobile) */}
                        <div className="hidden lg:block lg:col-span-4 space-y-12">
                            <section className="p-8 glass-card text-foreground relative overflow-hidden group shadow-elevated rounded-[32px] border border-border-subtle">
                                <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                                <div className="relative z-10 space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Local Insights</h4>
                                    <div className="space-y-8">
                                        <div className="space-y-1">
                                            <p className="text-4xl font-black tracking-tighter text-surface-900">0</p>
                                            <p className="text-[10px] font-black text-muted uppercase tracking-widest">Active Shops Nearby</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-4xl font-black tracking-tighter text-surface-900">--</p>
                                            <p className="text-[10px] font-black text-muted uppercase tracking-widest">Average Value</p>
                                        </div>
                                    </div>
                                    <button className="w-full py-5 glass bg-primary/10 text-primary border border-primary/20 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all">
                                        Open Marketplace Map
                                    </button>
                                </div>
                            </section>

                            <section className="space-y-6">
                                <h3 className="text-[10px] font-black text-surface-900 uppercase tracking-[0.3em] ml-2">Trending Searches</h3>
                                <div className="flex flex-wrap gap-3">
                                    {["Samosa", "Lassi", "Momos", "Kachori", "Masala Chai", "Paneer Tikka"].map(tag => (
                                        <span key={tag} className="px-5 py-3 bg-card-bg border border-border-subtle rounded-2xl text-[11px] font-black text-surface-500 hover:border-primary/20 hover:text-primary transition-all cursor-pointer">
                                            # {tag}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

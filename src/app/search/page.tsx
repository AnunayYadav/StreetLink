"use client";

import { useState } from "react";
import { Search, MapPin, Star, ArrowRight, ArrowLeft, Utensils } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const VENDORS: any[] = [];

const categories = [
    { key: "all", label: "All" },
    { key: "food", label: "Street Food" },
    { key: "snacks", label: "Snacks" },
    { key: "fresh", label: "Fresh Produce" },
    { key: "drinks", label: "Drinks" },
    { key: "desserts", label: "Desserts" },
    { key: "grocery", label: "Grocery" },
];

const trendingSearches = ["Samosa", "Lassi", "Momos", "Kachori", "Masala Chai", "Paneer Tikka", "Biryani", "Jalebi"];

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
    })
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04 } }
};

const chipVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 20 } }
};

export default function CustomerDiscovery() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="sticky top-0 bg-background/90 backdrop-blur-xl z-30"
            >
                <div className="max-w-3xl mx-auto px-5 md:px-8 pt-6 pb-4">
                    <motion.div
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="flex items-center gap-3 mb-4"
                    >
                        <motion.div whileHover={{ x: -2 }} whileTap={{ scale: 0.9 }}>
                            <Link href="/" className="w-10 h-10 bg-surface-50 rounded-xl flex items-center justify-center text-surface-400 hover:text-surface-900 transition-colors">
                                <ArrowLeft size={18} />
                            </Link>
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center"
                        >
                            <MapPin size={18} />
                        </motion.div>
                        <div>
                            <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">Market Explorer</p>
                            <h1 className="text-sm font-bold text-surface-900 tracking-tight">Discover Nearby</h1>
                        </div>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="relative"
                    >
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-300" size={16} />
                        <input
                            type="text"
                            placeholder="Search shops, food, products..."
                            className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-50 outline-none font-medium text-sm text-surface-900 placeholder:text-surface-300 focus:ring-2 focus:ring-primary/20 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </motion.div>
                </div>
            </motion.header>

            <main className="w-full pb-24">
                <div className="max-w-3xl mx-auto px-5 md:px-8 space-y-6 pt-2">

                    {/* Category Tabs */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25, duration: 0.4 }}
                        className="overflow-x-auto no-scrollbar -mx-5 px-5"
                    >
                        <div className="flex gap-2">
                            {categories.map((cat, i) => (
                                <motion.button
                                    key={cat.key}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + i * 0.04, type: "spring", stiffness: 300, damping: 20 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveCategory(cat.key)}
                                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors shrink-0 ${activeCategory === cat.key
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "bg-surface-50 text-surface-500 hover:text-surface-700"
                                        }`}
                                >
                                    {cat.label}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Featured Banner */}
                    <motion.section
                        custom={1}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        className="rounded-2xl h-48 md:h-56 relative overflow-hidden group"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
                            alt="Featured"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="absolute bottom-5 left-5 right-5 text-white space-y-1.5"
                        >
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary rounded-md text-[9px] font-semibold uppercase tracking-wider"
                            >
                                <Star size={10} fill="currentColor" strokeWidth={0} />
                                Featured Today
                            </motion.div>
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight leading-tight">Authentic Mughlai Street Flavors</h2>
                            <p className="text-white/60 text-xs max-w-sm">Experience the legendary spice blends of Kanpur&apos;s most celebrated street artisan.</p>
                        </motion.div>
                    </motion.section>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { val: "0", label: "Shops Nearby", color: "" },
                            { val: "--", label: "Avg. Value", color: "" },
                            { val: "Live", label: "Market Status", color: "text-primary" },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                custom={2 + i}
                                variants={fadeUp}
                                initial="hidden"
                                animate="visible"
                                whileHover={{ y: -2 }}
                                className="bg-surface-50 rounded-xl p-3 text-center"
                            >
                                <p className={`text-lg font-bold text-surface-900 ${stat.color}`}>{stat.val}</p>
                                <p className="text-[10px] text-surface-400">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Trending Searches */}
                    <motion.section custom={5} variants={fadeUp} initial="hidden" animate="visible" className="space-y-2.5">
                        <h3 className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider ml-0.5">Trending</h3>
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-wrap gap-2"
                        >
                            {trendingSearches.map(tag => (
                                <motion.button
                                    key={tag}
                                    variants={chipVariant}
                                    whileHover={{ scale: 1.08, y: -1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-3 py-1.5 bg-surface-50 hover:bg-surface-100 rounded-lg text-xs font-medium text-surface-500 hover:text-primary transition-colors"
                                >
                                    {tag}
                                </motion.button>
                            ))}
                        </motion.div>
                    </motion.section>

                    {/* Vendor List */}
                    <motion.section custom={6} variants={fadeUp} initial="hidden" animate="visible" className="space-y-3">
                        <div className="flex items-center justify-between ml-0.5">
                            <h3 className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider">Nearby Shops</h3>
                            <span className="text-[10px] text-surface-300">Sorted by distance</span>
                        </div>

                        {VENDORS.length > 0 ? (
                            <div className="space-y-3">
                                {VENDORS.map((vendor, i) => (
                                    <Link key={vendor.id} href={`/shop/${vendor.id}`}>
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.08, duration: 0.4 }}
                                            whileHover={{ x: 4 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="bg-surface-50 rounded-2xl p-3 flex gap-3 items-center hover:bg-surface-100 transition-colors"
                                        >
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-100 shrink-0">
                                                <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm text-surface-900 truncate">{vendor.name}</h4>
                                                <p className="text-xs text-surface-400 mt-0.5">{vendor.category} • {vendor.distance}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1 shrink-0">
                                                <div className="flex items-center gap-1 text-xs font-medium text-primary">
                                                    <Star size={12} fill="currentColor" strokeWidth={0} />
                                                    {vendor.rating}
                                                </div>
                                                <span className="text-[10px] text-surface-400">{vendor.priceRange}</span>
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, type: "spring" }}
                                className="py-14 flex flex-col items-center justify-center text-center"
                            >
                                <motion.div
                                    animate={{ rotate: [0, 5, -5, 0], y: [0, -3, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-14 h-14 bg-surface-50 rounded-2xl flex items-center justify-center text-surface-300 mb-4"
                                >
                                    <Utensils size={24} />
                                </motion.div>
                                <p className="font-semibold text-sm text-surface-900 mb-1">No vendors nearby</p>
                                <p className="text-sm text-surface-400 max-w-xs">Local shops will appear here when they&apos;re active. Check back during peak hours.</p>
                            </motion.div>
                        )}
                    </motion.section>
                </div>
            </main>
        </div>
    );
}

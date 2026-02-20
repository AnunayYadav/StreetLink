"use client";

import { useState } from "react";
import {
    Search, MapPin, Star, ArrowLeft, Store,
    Cherry, Salad, UtensilsCrossed, Scissors, Wrench, ShoppingBasket,
    Coffee, Shirt, Pill, Bike, Sparkles, Compass, LayoutGrid
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/context/language-context";

const VENDORS: any[] = [];

export default function CustomerDiscovery() {
    const { t } = useLanguage();
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const categories = [
        { key: "all", label: t("common.all"), icon: LayoutGrid, color: "" },
        { key: "grocery", label: t("cat.grocery"), icon: ShoppingBasket, color: "#3B82F6" },
        { key: "food", label: t("cat.food"), icon: UtensilsCrossed, color: "#F59E0B" },
        { key: "clothing", label: t("cat.clothing"), icon: Shirt, color: "#EC4899" },
        { key: "fruits", label: t("cat.fruits"), icon: Cherry, color: "#F43F5E" },
        { key: "vegetables", label: t("cat.vegetables"), icon: Salad, color: "#22C55E" },
        { key: "tailoring", label: t("cat.tailoring"), icon: Scissors, color: "#A855F7" },
        { key: "repair", label: t("cat.repair"), icon: Wrench, color: "#64748B" },
        { key: "pharmacy", label: t("cat.pharmacy"), icon: Pill, color: "#14B8A6" },
        { key: "cafe", label: t("cat.cafe"), icon: Coffee, color: "#D97706" },
        { key: "delivery", label: t("onboarding.register"), icon: Bike, color: "#E23744" },
    ];

    const trendingSearches = [
        "Tailor near me", "Fresh vegetables", "Phone repair",
        "Chai stall", "Grocery store", "Medical shop",
        "Clothes alteration", "Cycle repair", "Stationery",
        "Salon", "Bakery", "Key maker"
    ];

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
                            <Compass size={18} />
                        </motion.div>
                        <div>
                            <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">{t("explorer.title")}</p>
                            <h1 className="text-sm font-bold text-surface-900 tracking-tight">{t("explorer.subtitle") || "Nearby Shops"}</h1>
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
                            placeholder={t("explorer.placeholder")}
                            className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-50 outline-none font-medium text-sm text-surface-900 placeholder:text-surface-300 focus:ring-2 focus:ring-primary/20 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </motion.div>
                </div>
            </motion.header>

            <main className="w-full pb-24">
                <div className="max-w-3xl mx-auto px-5 md:px-8 space-y-6 pt-2">

                    {/* Category Tabs — icon-based scroll with all vendor types */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25, duration: 0.4 }}
                        className="overflow-x-auto no-scrollbar -mx-5 px-5"
                    >
                        <div className="flex gap-3">
                            {categories.map((cat, i) => {
                                const IconComp = cat.icon;
                                const isActive = activeCategory === cat.key;
                                return (
                                    <motion.button
                                        key={cat.key}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + i * 0.03, type: "spring", stiffness: 300, damping: 20 }}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveCategory(cat.key)}
                                        className="flex flex-col items-center gap-1.5 shrink-0"
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isActive
                                            ? "bg-primary text-white shadow-lg shadow-primary/25"
                                            : "bg-surface-50 text-surface-400 hover:bg-surface-100"
                                            }`}
                                        >
                                            <IconComp size={20} strokeWidth={2} />
                                        </div>
                                        <span className={`text-[10px] font-semibold transition-colors ${isActive ? "text-primary" : "text-surface-400"}`}>
                                            {cat.label}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Featured Banner — generic marketplace */}
                    <motion.section
                        custom={1}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        className="rounded-2xl h-48 md:h-56 relative overflow-hidden group"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
                            alt="Local marketplace"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
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
                                <Sparkles size={10} fill="currentColor" strokeWidth={0} />
                                {t("explorer.your_neighbourhood")}
                            </motion.div>
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight leading-tight">{t("explorer.one_tap")}</h2>
                            <p className="text-white/60 text-xs max-w-sm">{t("explorer.one_tap_desc")}</p>
                        </motion.div>
                    </motion.section>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { val: "0", label: t("explorer.shops_nearby"), color: "" },
                            { val: "10+", label: t("explorer.categories_stat"), color: "" },
                            { val: t("explorer.live"), label: t("explorer.market_status"), color: "text-primary" },
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
                        <h3 className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider ml-0.5">{t("explorer.popular")}</h3>
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
                                    onClick={() => setSearchQuery(tag)}
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
                            <h3 className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider">{t("explorer.nearby")}</h3>
                            <span className="text-[10px] text-surface-300">{t("explorer.nearby_desc")}</span>
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
                                    <Store size={24} />
                                </motion.div>
                                <p className="font-semibold text-sm text-surface-900 mb-1">{t("explorer.no_results")}</p>
                                <p className="text-sm text-surface-400 max-w-xs">{t("explorer.inventory_updates")}</p>
                            </motion.div>
                        )}
                    </motion.section>
                </div>
            </main>
        </div>
    );
}

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
    Zap
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
    })
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: (i: number) => ({
        opacity: 1,
        scale: 1,
        transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
    })
};

export default function VendorDashboard() {
    return (
        <div className="min-h-screen bg-background">
            <motion.header
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="sticky top-0 bg-background/90 backdrop-blur-xl z-30"
            >
                <div className="max-w-4xl mx-auto px-5 md:px-8 pt-6 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <motion.div
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 18 }}
                            className="w-10 h-10 rounded-xl overflow-hidden"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                        <div>
                            <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">Verified Partner</p>
                            <h1 className="text-sm font-bold text-surface-900 tracking-tight">Merchant Portal</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 bg-surface-50 rounded-xl flex items-center justify-center transition-colors"
                        >
                            <Share2 size={16} className="text-surface-500" />
                        </motion.button>
                    </div>
                </div>
            </motion.header>

            <main className="w-full">
                <div className="max-w-4xl mx-auto px-5 md:px-8 pb-24 space-y-6 pt-4">

                    {/* Earnings Card */}
                    <motion.section
                        custom={0}
                        variants={scaleIn}
                        initial="hidden"
                        animate="visible"
                        className="bg-primary rounded-2xl p-5 text-white relative overflow-hidden"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-3xl"
                        />
                        <div className="relative z-10">
                            <p className="text-[10px] font-medium uppercase tracking-wider opacity-70 mb-1">Total Balance</p>
                            <div className="flex items-baseline gap-1 mb-4">
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                    className="text-3xl font-bold tracking-tight"
                                >₹0</motion.span>
                                <span className="text-xs opacity-50">.00</span>
                            </div>
                            <div className="flex gap-3">
                                <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="flex-1 bg-white/10 rounded-xl p-3">
                                    <p className="text-[9px] uppercase tracking-wider opacity-60 mb-1">Success Rate</p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-sm">0%</span>
                                        <TrendingUp size={14} className="opacity-60" />
                                    </div>
                                </motion.div>
                                <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="flex-1 bg-white/10 rounded-xl p-3">
                                    <p className="text-[9px] uppercase tracking-wider opacity-60 mb-1">Deliveries</p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-sm">0</span>
                                        <Package size={14} className="opacity-60" />
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Quick Actions */}
                    <motion.section custom={2} variants={fadeUp} initial="hidden" animate="visible" className="space-y-2">
                        <h2 className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider ml-0.5">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <motion.div whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.97 }}>
                                <Link href="/products" className="block bg-surface-50 hover:bg-surface-100 p-4 rounded-2xl transition-colors group">
                                    <motion.div
                                        whileHover={{ rotate: 90 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3"
                                    >
                                        <Plus size={20} strokeWidth={2.5} />
                                    </motion.div>
                                    <p className="font-semibold text-sm text-surface-900">Add Product</p>
                                    <p className="text-[10px] text-surface-400 mt-0.5">Manage inventory</p>
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.97 }}>
                                <div className="bg-surface-50 hover:bg-surface-100 p-4 rounded-2xl transition-colors group cursor-pointer">
                                    <div className="w-10 h-10 rounded-xl bg-surface-200 text-surface-500 dark:bg-surface-100 dark:text-surface-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                                        <QrCode size={20} strokeWidth={2} />
                                    </div>
                                    <p className="font-semibold text-sm text-surface-900">Store QR Code</p>
                                    <p className="text-[10px] text-surface-400 mt-0.5">Share your shop</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.section>

                    {/* Active Orders */}
                    <motion.section custom={3} variants={fadeUp} initial="hidden" animate="visible" className="space-y-2">
                        <div className="flex items-center justify-between ml-0.5">
                            <h2 className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider">Active Orders</h2>
                            <Link href="/orders" className="text-xs font-medium text-primary flex items-center gap-1 hover:gap-2 transition-all">
                                View all <ArrowRight size={12} />
                            </Link>
                        </div>
                        <div className="bg-surface-50 rounded-2xl py-12 flex flex-col items-center justify-center text-center">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="w-12 h-12 bg-surface-100 rounded-xl flex items-center justify-center text-surface-300 mb-3"
                            >
                                <Clock size={22} />
                            </motion.div>
                            <p className="font-semibold text-sm text-surface-900">No active orders</p>
                            <p className="text-xs text-surface-400 mt-0.5">Orders will appear here in real-time</p>
                        </div>
                    </motion.section>

                    {/* AI Feature Card */}
                    <motion.section
                        custom={4}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ y: -3 }}
                        className="bg-contrast-bg text-contrast-text rounded-2xl p-5 relative overflow-hidden group cursor-pointer"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.4, 1], x: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute right-0 bottom-0 w-32 h-32 bg-primary/15 rounded-full blur-2xl"
                        />
                        <div className="relative z-10 flex items-start gap-4">
                            <motion.div
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0"
                            >
                                <Zap size={20} className="text-primary" />
                            </motion.div>
                            <div className="flex-1 space-y-1">
                                <p className="text-[10px] font-medium uppercase tracking-wider opacity-50">AI Hub</p>
                                <p className="font-semibold text-sm leading-snug">Generate magic descriptions for your menu</p>
                                <button className="text-xs font-medium text-primary flex items-center gap-1 mt-2 hover:gap-2 transition-all">
                                    Unlock Now <ArrowRight size={12} />
                                </button>
                            </div>
                        </div>
                    </motion.section>

                </div>
            </main>
        </div>
    );
}

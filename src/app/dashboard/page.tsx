"use client";

import { useState, useRef, useCallback } from "react";
import {
    TrendingUp,
    Plus,
    Share2,
    QrCode,
    ChevronRight,
    Clock,
    Package,
    ArrowRight,
    Zap,
    X,
    Download,
    Copy,
    Check
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
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

const VENDOR_SLUG = "vendor-store";

export default function VendorDashboard() {
    const [showQR, setShowQR] = useState(false);
    const [copied, setCopied] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);

    const shopUrl = typeof window !== "undefined"
        ? `${window.location.origin}/shop/${VENDOR_SLUG}`
        : `/shop/${VENDOR_SLUG}`;

    const handleCopyLink = useCallback(() => {
        navigator.clipboard.writeText(shopUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [shopUrl]);

    const handleDownloadQR = useCallback(() => {
        if (!qrRef.current) return;
        const svg = qrRef.current.querySelector("svg");
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = 1024;
            canvas.height = 1024;
            if (ctx) {
                // White background
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, 1024, 1024);
                // Draw QR centered with padding
                const padding = 80;
                ctx.drawImage(img, padding, padding, 1024 - padding * 2, 1024 - padding * 2);
                // Add text below
                ctx.fillStyle = "#1a1a1a";
                ctx.font = "bold 28px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("Scan to visit our store", 512, 1024 - 30);
            }
            const link = document.createElement("a");
            link.download = `${VENDOR_SLUG}-qr-code.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        };

        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    }, []);

    const handleShare = useCallback(async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Visit our shop on StreetLink",
                    text: "Check out our products on StreetLink!",
                    url: shopUrl,
                });
            } catch {
                // User cancelled
            }
        } else {
            handleCopyLink();
        }
    }, [shopUrl, handleCopyLink]);

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
                            onClick={handleShare}
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
                                <button
                                    onClick={() => setShowQR(true)}
                                    className="w-full text-left bg-surface-50 hover:bg-surface-100 p-4 rounded-2xl transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-surface-200 text-surface-500 dark:bg-surface-100 dark:text-surface-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                                        <QrCode size={20} strokeWidth={2} />
                                    </div>
                                    <p className="font-semibold text-sm text-surface-900">Store QR Code</p>
                                    <p className="text-[10px] text-surface-400 mt-0.5">Share your shop</p>
                                </button>
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

            {/* QR Code Modal */}
            <AnimatePresence>
                {showQR && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowQR(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="fixed inset-x-4 top-[50%] -translate-y-[50%] max-w-sm mx-auto bg-background rounded-3xl z-50 overflow-hidden shadow-2xl"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-5 pb-0">
                                <div>
                                    <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">Your Store</p>
                                    <h3 className="text-lg font-bold text-surface-900 tracking-tight">QR Code</h3>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowQR(false)}
                                    className="w-9 h-9 bg-surface-50 rounded-xl flex items-center justify-center text-surface-400 hover:text-surface-900 transition-colors"
                                >
                                    <X size={16} />
                                </motion.button>
                            </div>

                            {/* QR Code */}
                            <div className="p-6 flex flex-col items-center">
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.15, type: "spring", stiffness: 250, damping: 20 }}
                                    ref={qrRef}
                                    className="bg-white p-5 rounded-2xl shadow-lg shadow-primary/5 relative"
                                >
                                    <QRCodeSVG
                                        value={shopUrl}
                                        size={200}
                                        level="H"
                                        bgColor="#ffffff"
                                        fgColor="#1a1a1a"
                                        imageSettings={{
                                            src: "",
                                            height: 0,
                                            width: 0,
                                            excavate: false,
                                        }}
                                    />
                                    {/* Decorative corners */}
                                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary/30 rounded-tl-lg" />
                                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary/30 rounded-tr-lg" />
                                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary/30 rounded-bl-lg" />
                                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary/30 rounded-br-lg" />
                                </motion.div>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-xs text-surface-400 mt-4 text-center"
                                >
                                    Customers can scan this to visit your store
                                </motion.p>

                                {/* Shop URL */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.35 }}
                                    className="mt-3 w-full bg-surface-50 rounded-xl px-3 py-2.5 flex items-center gap-2"
                                >
                                    <p className="flex-1 text-xs text-surface-500 truncate font-mono">{shopUrl}</p>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleCopyLink}
                                        className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${copied
                                            ? 'bg-green-500/10 text-green-500'
                                            : 'bg-surface-100 text-surface-400 hover:text-surface-900'
                                            }`}
                                    >
                                        {copied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} />}
                                    </motion.button>
                                </motion.div>
                            </div>

                            {/* Actions */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="px-6 pb-6 flex gap-3"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleDownloadQR}
                                    className="flex-1 h-11 bg-surface-50 hover:bg-surface-100 rounded-xl text-sm font-semibold text-surface-900 flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Download size={15} /> Download
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleShare}
                                    className="flex-1 h-11 bg-primary hover:bg-primary-dark rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20"
                                >
                                    <Share2 size={15} /> Share
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

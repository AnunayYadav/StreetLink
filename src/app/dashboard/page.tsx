"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
    TrendingUp,
    Plus,
    Share2,
    QrCode,
    Clock,
    Package,
    ArrowRight,
    Zap,
    X,
    Download,
    Copy,
    Check,
    LogIn,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/lib/context/auth-context";
import { useLanguage } from "@/lib/context/language-context";

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

// Shop URL is now dynamic based on merchantProfile.id

export default function VendorDashboard() {
    const { isLoggedIn, isGuest, user, role, merchantProfile, isLoading } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();
    const [showQR, setShowQR] = useState(false);
    const [copied, setCopied] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);

    // Redirect guests to onboarding
    useEffect(() => {
        if (!isLoading) {
            // Redirect guests or merchants who haven't set up a shop yet
            if (!isLoggedIn || isGuest || (role === 'merchant' && !merchantProfile)) {
                router.replace("/onboarding");
            }
        }
    }, [isLoggedIn, isGuest, role, merchantProfile, router, isLoading]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
            </div>
        );
    }

    const shopUrl = typeof window !== "undefined" && merchantProfile?.id
        ? `${window.location.origin}/shop/${merchantProfile.id}`
        : "";

    const handleCopyLink = useCallback(() => {
        navigator.clipboard.writeText(shopUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [shopUrl]);

    const handleDownloadQR = useCallback(() => {
        const svg = qrRef.current?.querySelector("svg");
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `${merchantProfile?.name || "shop"}-qr-code.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }, [merchantProfile]);

    const handleShare = useCallback(async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: merchantProfile?.name || "StreetLink Shop",
                    text: "Check out our products on StreetLink!",
                    url: shopUrl,
                });
            } catch {
                // User cancelled
            }
        } else {
            handleCopyLink();
        }
    }, [shopUrl, handleCopyLink, merchantProfile]);

    // Don't render if not merchant (will redirect)
    if (!isLoggedIn || isGuest) { // Changed condition
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4 px-6"
                >
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto">
                        <LogIn size={28} />
                    </div>
                    <h2 className="text-xl font-bold text-surface-900">{t("dashboard.merchant_only")}</h2>
                    <p className="text-sm text-surface-400 max-w-xs">{t("dashboard.onboarding_req")}</p>
                    <Link href="/onboarding" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors">
                        {t("dashboard.register_now")} <ArrowRight size={14} />
                    </Link>
                </motion.div>
            </div>
        );
    }

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
                            className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg"
                        >
                            {merchantProfile?.name?.[0]?.toUpperCase() || "M"}
                        </motion.div>
                        <div>
                            <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">{t("dashboard.title")}</p>
                            <h1 className="text-sm font-bold text-surface-900 tracking-tight">{merchantProfile?.name || t("dashboard.title")}</h1>
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
                        className="bg-primary rounded-2xl p-6 text-white relative overflow-hidden shadow-xl shadow-primary/20"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-3xl"
                        />
                        <div className="relative z-10">
                            <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70 mb-1">{t("dashboard.balance")}</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                    className="text-4xl font-bold tracking-tight"
                                >₹0</motion.span>
                                <span className="text-sm opacity-60 font-medium">.00</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                <div>
                                    <p className="text-[9px] uppercase tracking-wider opacity-60 mb-1">{t("dashboard.success_rate")}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-base">0%</span>
                                        <TrendingUp size={14} className="opacity-60" />
                                    </div>
                                </div>
                                <div className="border-l border-white/10 pl-4">
                                    <p className="text-[9px] uppercase tracking-wider opacity-60 mb-1">{t("dashboard.deliveries")}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-base">0</span>
                                        <Package size={14} className="opacity-60" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Quick Actions */}
                    <motion.section custom={1} variants={fadeUp} initial="hidden" animate="visible" className="space-y-3">
                        <h2 className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider ml-0.5">{t("dashboard.actions")}</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                                <Link href="/products" className="block bg-surface-50 hover:bg-surface-100 p-4 rounded-[24px] transition-all border border-transparent hover:border-surface-200 group">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                                        <Plus size={20} strokeWidth={2.5} />
                                    </div>
                                    <p className="font-bold text-sm text-surface-900 tracking-tight">{t("dashboard.add_product")}</p>
                                    <p className="text-[10px] text-surface-400 mt-0.5">{t("dashboard.manage_inventory")}</p>
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                                <button
                                    onClick={() => setShowQR(true)}
                                    className="w-full text-left bg-surface-50 hover:bg-surface-100 p-4 rounded-[24px] transition-all border border-transparent hover:border-surface-200 group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-surface-200 text-surface-500 dark:bg-surface-100 dark:text-surface-400 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                                        <QrCode size={20} strokeWidth={2.5} />
                                    </div>
                                    <p className="font-bold text-sm text-surface-900 tracking-tight">{t("dashboard.qr_code")}</p>
                                    <p className="text-[10px] text-surface-400 mt-0.5">{t("dashboard.share_shop")}</p>
                                </button>
                            </motion.div>
                        </div>
                    </motion.section>

                    {/* Active Orders */}
                    <motion.section custom={2} variants={fadeUp} initial="hidden" animate="visible" className="space-y-3">
                        <div className="flex items-center justify-between ml-0.5">
                            <h2 className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider">{t("nav.orders")}</h2>
                            <Link href="/orders" className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5 hover:gap-2.5 transition-all">
                                {t("dashboard.view_all")} <ArrowRight size={12} strokeWidth={3} />
                            </Link>
                        </div>
                        <div className="bg-surface-50 rounded-[24px] py-14 flex flex-col items-center justify-center text-center px-6">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="w-14 h-14 bg-surface-100 rounded-2xl flex items-center justify-center text-surface-300 mb-4"
                            >
                                <Clock size={24} />
                            </motion.div>
                            <p className="font-bold text-sm text-surface-900 tracking-tight">{t("dashboard.no_orders")}</p>
                            <p className="text-[10px] text-surface-400 mt-1 uppercase tracking-widest font-semibold flex items-center gap-2">
                                <span className="w-1 h-1 bg-surface-300 rounded-full" />
                                {t("dashboard.realtime")}
                                <span className="w-1 h-1 bg-surface-300 rounded-full" />
                            </p>
                        </div>
                    </motion.section>

                    {/* AI Insights Card */}
                    <motion.section
                        custom={3}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        className="bg-contrast-bg text-contrast-text rounded-[24px] p-6 relative overflow-hidden group cursor-pointer border border-border-subtle shadow-sm"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.4, 1], x: [0, 10, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute right-0 bottom-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-50"
                        />
                        <div className="relative z-10 flex items-start gap-5">
                            <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
                                <Zap size={22} className="text-primary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-sm tracking-tight mb-1">{t("dashboard.ai_title")}</h3>
                                <p className="text-xs text-contrast-text/60 leading-relaxed font-medium">{t("dashboard.ai_desc")}</p>
                                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
                                    {t("dashboard.coming_soon")}
                                    <ArrowRight size={10} />
                                </div>
                            </div>
                        </div>
                    </motion.section>
                </div>
            </main>

            {/* QR Modal */}
            <AnimatePresence>
                {showQR && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowQR(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto bg-background rounded-[32px] overflow-hidden shadow-2xl z-[70]"
                        >
                            <div className="p-6 border-b border-surface-100 flex items-center justify-between bg-surface-50/50">
                                <h3 className="font-bold text-lg text-surface-900 tracking-tight">{t("dashboard.qr_code")}</h3>
                                <button onClick={() => setShowQR(false)} className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center text-surface-400 hover:text-surface-600 transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="p-8 flex flex-col items-center">
                                <div ref={qrRef} className="p-6 bg-white rounded-3xl shadow-xl shadow-surface-200/50 mb-8 border border-surface-100 ring-4 ring-primary/5">
                                    <QRCodeSVG
                                        value={shopUrl}
                                        size={180}
                                        level="H"
                                        includeMargin={false}
                                        imageSettings={{
                                            src: "/logo.png",
                                            height: 30,
                                            width: 30,
                                            excavate: true,
                                        }}
                                    />
                                </div>
                                <div className="w-full space-y-3">
                                    <button
                                        onClick={handleDownloadQR}
                                        className="w-full h-12 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors"
                                    >
                                        <Download size={16} />
                                        {t("dashboard.download_qr")}
                                    </button>
                                    <button
                                        onClick={handleCopyLink}
                                        className="w-full h-12 bg-surface-100 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-surface-200 transition-colors"
                                    >
                                        {copied ? <Check size={16} /> : <Copy size={16} />}
                                        {copied ? t("dashboard.copied") : t("dashboard.copy_link")}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

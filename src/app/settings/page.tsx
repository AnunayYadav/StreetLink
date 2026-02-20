"use client";

import { useState } from "react";
import { ArrowLeft, Bell, Globe, Shield, ChevronRight, LogOut, User, Eye, Store, ArrowRight, LogIn, X, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/lib/context/auth-context";
import { useLanguage, LANGUAGES, LanguageCode } from "@/lib/context/language-context";

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
    })
};

export default function SettingsPage() {
    const { isMerchant, merchantProfile, logout, user, isLoggedIn } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const router = useRouter();
    const [notifications, setNotifications] = useState(true);
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const settingsSections = [
        ...(isMerchant ? [{
            title: t("settings.shop_profile"),
            items: [
                { icon: Store, label: merchantProfile?.name || "My Shop", desc: merchantProfile?.categories?.join(", ") || t("settings.manage_shop"), action: "link" as const, href: "/onboarding" },
            ]
        }] : []),
        {
            title: t("settings.preferences"),
            items: [
                { icon: Bell, label: t("settings.notifications"), desc: notifications ? t("settings.enabled") : t("settings.disabled"), action: "toggle" as const, toggleValue: notifications, onToggle: () => setNotifications(!notifications) },
                {
                    icon: Globe,
                    label: t("settings.language"),
                    desc: `${language.nativeName} (${language.name})`,
                    action: "button" as const,
                    onClick: () => setShowLanguageModal(true)
                },
                { icon: Eye, label: t("settings.appearance"), desc: t("settings.sys_default"), action: "theme" as const },
            ]
        },
        {
            title: t("settings.privacy"),
            items: [
                { icon: Shield, label: t("settings.data_privacy"), desc: t("settings.manage_data"), action: "link" as const },
            ]
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="sticky top-0 bg-background/90 backdrop-blur-xl z-30"
            >
                <div className="max-w-3xl mx-auto px-5 md:px-8 pt-6 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <motion.div whileHover={{ x: -2 }} whileTap={{ scale: 0.9 }}>
                            <Link href="/" className="w-10 h-10 bg-surface-50 rounded-xl flex items-center justify-center text-surface-400 hover:text-surface-900 transition-colors">
                                <ArrowLeft size={18} />
                            </Link>
                        </motion.div>
                        <div>
                            <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">{t("settings.preferences")}</p>
                            <h1 className="text-sm font-bold text-surface-900 tracking-tight">{t("settings.title")}</h1>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </motion.header>

            <main className="max-w-3xl mx-auto px-5 md:px-8 pb-24 pt-4 space-y-8">

                {/* User Card */}
                {isMerchant ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
                        whileHover={{ scale: 1.01 }}
                        className="bg-surface-50 rounded-2xl p-4 flex items-center gap-3"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.25, type: "spring", stiffness: 300, damping: 15 }}
                            className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg"
                        >
                            {merchantProfile?.name?.[0]?.toUpperCase() || "M"}
                        </motion.div>
                        <div className="flex-1">
                            <p className="font-semibold text-sm text-surface-900">{merchantProfile?.name || "Merchant"}</p>
                            <p className="text-xs text-surface-400">{user?.email || t("common.verified")}</p>
                        </div>
                        <div className="px-2 py-1 bg-primary text-white text-[9px] font-bold uppercase tracking-wider rounded-lg shadow-sm shadow-primary/20">
                            {t("onboarding.register")}
                        </div>
                    </motion.div>
                ) : isLoggedIn ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
                        className="bg-surface-50 rounded-2xl p-5 space-y-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-bold text-lg">
                                {user?.name?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-sm text-surface-900">{user?.name || "User"}</p>
                                <p className="text-xs text-surface-400">{user?.email}</p>
                            </div>
                        </div>
                        <Link
                            href="/onboarding"
                            className="flex items-center justify-between p-3.5 bg-primary rounded-xl transition-all group shadow-lg shadow-primary/10 hover:shadow-primary/20"
                        >
                            <div className="flex items-center gap-2.5 text-white">
                                <Store size={18} />
                                <span className="text-sm font-bold tracking-tight">{t("settings.setup_portfolio")}</span>
                            </div>
                            <ArrowRight size={16} className="text-white group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
                        className="bg-surface-50 rounded-2xl p-5 space-y-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-surface-100 text-surface-400 flex items-center justify-center">
                                <User size={22} />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-sm text-surface-900">{t("settings.guest_user")}</p>
                                <p className="text-xs text-surface-400">{t("settings.join_launch")}</p>
                            </div>
                        </div>
                        <Link
                            href="/login"
                            className="flex items-center justify-between p-3.5 bg-primary/10 hover:bg-primary/15 rounded-xl transition-colors group"
                        >
                            <div className="flex items-center gap-2.5 text-primary">
                                <LogIn size={18} />
                                <span className="text-sm font-bold tracking-tight">{t("settings.join_streetlink")}</span>
                            </div>
                            <ArrowRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                )}

                {/* Settings Sections */}
                {settingsSections.map((section, sectionIdx) => (
                    <motion.section
                        key={section.title}
                        custom={sectionIdx + 1}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        className="space-y-2"
                    >
                        <h2 className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider ml-0.5">{section.title}</h2>
                        <div className="bg-surface-50 rounded-2xl overflow-hidden divide-y divide-surface-100">
                            {section.items.map((item, itemIdx) => {
                                const Icon = item.icon;
                                return (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, x: -15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + sectionIdx * 0.12 + itemIdx * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                        whileHover={{ x: 3 }}
                                        onClick={item.action === "button" ? item.onClick : undefined}
                                        className="flex items-center gap-3 p-4 hover:bg-surface-100 transition-colors cursor-pointer"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-surface-100 text-surface-500 flex items-center justify-center shrink-0">
                                            <Icon size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm text-surface-900">{item.label}</p>
                                            <p className="text-[10px] text-surface-400 truncate">{item.desc}</p>
                                        </div>
                                        {item.action === "toggle" ? (
                                            <button
                                                onClick={item.onToggle}
                                                className={`w-11 h-6 rounded-full p-0.5 transition-colors ${item.toggleValue ? 'bg-primary' : 'bg-surface-200'}`}
                                            >
                                                <motion.div
                                                    animate={{ x: item.toggleValue ? 20 : 0 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                    className="w-5 h-5 bg-white rounded-full shadow-sm"
                                                />
                                            </button>
                                        ) : item.action === "theme" ? (
                                            <ThemeToggle />
                                        ) : (
                                            <ChevronRight size={14} className="text-surface-300 shrink-0" />
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.section>
                ))}

                {/* Logout */}
                {isLoggedIn && (
                    <motion.button
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.4 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="w-full bg-surface-50 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl p-4 flex items-center gap-3 transition-colors group"
                    >
                        <motion.div
                            whileHover={{ rotate: -10 }}
                            className="w-9 h-9 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center"
                        >
                            <LogOut size={16} />
                        </motion.div>
                        <span className="font-medium text-sm text-red-500">{t("settings.logout")}</span>
                    </motion.button>
                )}
            </main>

            {/* Language Selection Modal */}
            <AnimatePresence>
                {showLanguageModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowLanguageModal(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-x-4 bottom-10 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 max-w-sm mx-auto bg-background rounded-[32px] shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="p-6 border-b border-surface-100 flex items-center justify-between bg-surface-50/50">
                                <div>
                                    <h3 className="text-lg font-bold text-surface-900 tracking-tight">{t("settings.lang_select_title")}</h3>
                                    <p className="text-xs text-surface-400">{t("settings.lang_select_desc")}</p>
                                </div>
                                <button
                                    onClick={() => setShowLanguageModal(false)}
                                    className="w-10 h-10 bg-surface-100 rounded-full flex items-center justify-center text-surface-500 hover:text-surface-900 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="max-h-[60vh] overflow-y-auto no-scrollbar p-3 grid grid-cols-1 gap-1">
                                {LANGUAGES.map((lang) => (
                                    <motion.button
                                        key={lang.code}
                                        whileHover={{ x: 4, backgroundColor: "var(--surface-50)" }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            setLanguage(lang.code as LanguageCode);
                                            setShowLanguageModal(false);
                                        }}
                                        className={`flex items-center justify-between p-4 rounded-2xl transition-all ${language.code === lang.code
                                            ? "bg-primary/5 text-primary"
                                            : "text-surface-700 hover:bg-surface-50"
                                            }`}
                                    >
                                        <div className="text-left">
                                            <p className="font-bold text-sm tracking-tight">{lang.nativeName}</p>
                                            <p className="text-[10px] opacity-60 font-medium uppercase tracking-wider">{lang.name}</p>
                                        </div>
                                        {language.code === lang.code && (
                                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                                <Check size={16} strokeWidth={3} />
                                            </div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

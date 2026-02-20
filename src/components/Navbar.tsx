"use client";

import { useState } from "react";
import { Store, Menu, X, LogIn, ChevronRight, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/lib/context/auth-context";
import { useLanguage } from "@/lib/context/language-context";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isLoggedIn, isMerchant, role, logout } = useAuth();
    const { t } = useLanguage();
    const pathname = usePathname();

    const navLinks = [
        { href: "/search", label: t("nav.explorer") },
        // Only show Register if NOT a logged in user (consumer)
        ...(role === "user" ? [] : [{ href: "/onboarding", label: t("onboarding.register") || "Register" }]),
        { href: "/support", label: t("nav.support") || "Support" },
        { href: "/settings", label: t("nav.settings") },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="sticky top-0 z-40 w-full bg-background/50 backdrop-blur-md border-b border-border-subtle"
        >
            <div className="max-w-7xl mx-auto px-5 md:px-12 py-4 md:py-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 3 }}
                        transition={{ delay: 0.25, type: "spring", stiffness: 300, damping: 15 }}
                        whileHover={{ scale: 1.1, rotate: 0 }}
                        className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-accent"
                    >
                        <Store size={22} strokeWidth={3} className="md:w-7 md:h-7" />
                    </motion.div>
                    <span className="text-xl md:text-2xl font-black text-surface-900 tracking-tighter group-hover:text-primary transition-colors">Localynk</span>
                </Link>

                <div className="flex items-center gap-3">
                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em]">
                        {navLinks.map((link, i) => (
                            <motion.div
                                key={link.href}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.08 }}
                                className="relative py-2"
                            >
                                <Link
                                    href={link.href}
                                    className={`transition-all hover:text-primary ${isActive(link.href) ? "text-primary tracking-[0.25em]" : "text-surface-500"}`}
                                >
                                    {link.label}
                                </Link>
                                {isActive(link.href) && (
                                    <motion.div
                                        layoutId="navUnderline"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_8px_rgba(226,55,68,0.4)]"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </motion.div>
                        ))}
                    </nav>

                    <div className="h-4 w-px bg-surface-100 hidden md:block mx-4" />

                    <div className="flex items-center gap-2">
                        <ThemeToggle />

                        {/* Auth Button Desktop */}
                        <div className="hidden md:block">
                            {isLoggedIn ? (
                                <Link href="/settings">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-10 h-10 rounded-xl bg-surface-50 flex items-center justify-center text-surface-400 hover:text-primary hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10"
                                    >
                                        <User size={18} />
                                    </motion.div>
                                </Link>
                            ) : (
                                <Link href="/login">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                                    >
                                        <LogIn size={14} />
                                        <span>Join</span>
                                    </motion.div>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden w-10 h-10 bg-surface-50 rounded-xl flex items-center justify-center text-surface-500 transition-colors border border-border-subtle"
                    >
                        <AnimatePresence mode="wait">
                            {mobileMenuOpen ? (
                                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                                    <X size={18} />
                                </motion.div>
                            ) : (
                                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                                    <Menu size={18} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="md:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-t border-border-subtle shadow-2xl"
                    >
                        <nav className="px-5 pb-8 pt-4 space-y-2">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05, duration: 0.3 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center justify-between p-4 rounded-2xl transition-all text-sm font-bold ${isActive(link.href) ? "bg-primary/5 text-primary" : "hover:bg-surface-50 text-surface-900"}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {isActive(link.href) && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                            {link.label}
                                        </div>
                                        <ChevronRight size={14} className={isActive(link.href) ? "text-primary" : "text-surface-300"} />
                                    </Link>
                                </motion.div>
                            ))}

                            <div className="pt-6 border-t border-surface-100 mt-4 space-y-3">
                                {!isLoggedIn ? (
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-between p-4.5 rounded-[22px] bg-primary text-white text-sm font-bold shadow-xl shadow-primary/25"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                                <LogIn size={16} />
                                            </div>
                                            <span>{t("nav.login_btn")}</span>
                                        </div>
                                        <ArrowRight size={16} />
                                    </Link>
                                ) : (
                                    <div className="flex gap-3">
                                        <Link
                                            href="/settings"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl bg-surface-50 text-surface-900 text-sm font-bold border border-border-subtle"
                                        >
                                            <User size={16} />
                                            <span>Profile</span>
                                        </Link>
                                        {isMerchant && (
                                            <Link
                                                href="/dashboard"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20"
                                            >
                                                <Store size={16} />
                                                <span>Portal</span>
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}

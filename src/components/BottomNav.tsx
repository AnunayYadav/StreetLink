"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Home, User, ShoppingBag, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/context/auth-context";
import { useLanguage } from "@/lib/context/language-context";

export default function BottomNav() {
    const pathname = usePathname();
    const { isMerchant } = useAuth();
    const { t } = useLanguage();

    // Don't show on checkout, shop views, onboarding, or login
    if (pathname === "/checkout" || pathname?.startsWith("/shop/") || pathname === "/onboarding" || pathname === "/login") return null;

    // Build nav items dynamically based on role
    const navItems = isMerchant
        ? [
            { label: t("nav.dashboard"), icon: LayoutDashboard, href: "/dashboard" },
            { label: t("nav.explorer"), icon: Search, href: "/search" },
            { label: t("nav.orders"), icon: ShoppingBag, href: "/orders" },
            { label: t("nav.settings"), icon: User, href: "/settings" },
        ]
        : [
            { label: t("nav.explorer"), icon: Search, href: "/search" },
            { label: t("nav.orders"), icon: ShoppingBag, href: "/orders" },
            { label: t("nav.settings"), icon: User, href: "/settings" },
        ];

    return (
        <motion.nav
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 25 }}
            className="fixed bottom-0 md:bottom-10 left-0 md:left-1/2 md:-translate-x-1/2 w-full md:w-auto md:min-w-[500px] h-20 md:h-22 nav-blur md:rounded-[32px] md:border md:border-border-subtle md:shadow-2xl px-8 flex items-center justify-around md:justify-center md:gap-16 z-50"
        >
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="group flex flex-col items-center gap-1.5"
                    >
                        <motion.div
                            whileTap={{ scale: 0.85 }}
                            whileHover={{ y: -2 }}
                            className={`p-2.5 rounded-2xl transition-all duration-300 relative ${isActive ? "bg-primary-soft shadow-accent/5 text-primary" : "text-surface-500 group-hover:text-surface-900 group-hover:bg-surface-100"}`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="navIndicator"
                                    className="absolute inset-0 bg-primary-soft rounded-2xl"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <Icon
                                size={isActive ? 28 : 24}
                                strokeWidth={isActive ? 3 : 2}
                                className="relative z-10 transition-all"
                            />
                        </motion.div>
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${isActive ? "opacity-100 translate-y-0 text-primary" : "opacity-0 -translate-y-1 text-surface-500 group-hover:opacity-100 group-hover:translate-y-0"}`}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </motion.nav>
    );
}

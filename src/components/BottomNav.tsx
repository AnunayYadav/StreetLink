"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Wallet, User, ShoppingBag } from "lucide-react";

export default function BottomNav() {
    const pathname = usePathname();

    // Don't show on landing page, checkout, or shop views
    if (pathname === "/" || pathname === "/checkout" || pathname?.startsWith("/shop/")) return null;

    const navItems = [
        { label: "Explorer", icon: Search, href: "/search" },
        { label: "Orders", icon: ShoppingBag, href: "/orders" },
        { label: "Wallet", icon: Wallet, href: "/dashboard" },
        { label: "Profile", icon: User, href: "/onboarding" },
    ];

    return (
        <nav className="fixed bottom-0 md:bottom-10 left-0 md:left-1/2 md:-translate-x-1/2 w-full md:w-auto md:min-w-[500px] h-20 md:h-22 nav-blur md:rounded-[32px] md:border md:border-border-subtle md:shadow-2xl px-8 flex items-center justify-around md:justify-center md:gap-16 z-50 transition-all duration-500">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`group flex flex-col items-center gap-1.5 transition-all ${isActive ? "text-primary md:scale-110" : "text-surface-500 hover:text-surface-900"
                            }`}
                    >
                        <div className={`p-2.5 rounded-2xl transition-all duration-300 ${isActive ? "bg-primary-soft shadow-accent/5" : "group-hover:bg-surface-100"}`}>
                            <Icon size={isActive ? 28 : 24} strokeWidth={isActive ? 3 : 2} className="transition-all" />
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"}`}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}

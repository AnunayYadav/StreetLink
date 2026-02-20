"use client";

import { useState } from "react";
import { ArrowLeft, Bell, Globe, Shield, ChevronRight, LogOut, User, Smartphone, Eye } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
    })
};

export default function SettingsPage() {
    const [notifications, setNotifications] = useState(true);

    const settingsSections = [
        {
            title: "Account",
            items: [
                { icon: User, label: "Profile", desc: "Manage your account details", action: "link" as const },
                { icon: Smartphone, label: "Linked Devices", desc: "1 device connected", action: "link" as const },
            ]
        },
        {
            title: "Preferences",
            items: [
                { icon: Bell, label: "Notifications", desc: notifications ? "Enabled" : "Disabled", action: "toggle" as const, toggleValue: notifications, onToggle: () => setNotifications(!notifications) },
                { icon: Globe, label: "Language", desc: "English", action: "link" as const },
                { icon: Eye, label: "Appearance", desc: "System default", action: "theme" as const },
            ]
        },
        {
            title: "Privacy & Security",
            items: [
                { icon: Shield, label: "Data & Privacy", desc: "Manage your data", action: "link" as const },
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
                            <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">Preferences</p>
                            <h1 className="text-sm font-bold text-surface-900 tracking-tight">Settings</h1>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </motion.header>

            <main className="max-w-3xl mx-auto px-5 md:px-8 pb-24 pt-4 space-y-8">

                {/* User Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
                    whileHover={{ scale: 1.01 }}
                    className="bg-surface-50 rounded-2xl p-4 flex items-center gap-3 cursor-pointer"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.25, type: "spring", stiffness: 300, damping: 15 }}
                        className="w-12 h-12 rounded-xl overflow-hidden bg-surface-100"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                    <div className="flex-1">
                        <p className="font-semibold text-sm text-surface-900">Merchant User</p>
                        <p className="text-xs text-surface-400">merchant@localynk.in</p>
                    </div>
                    <ChevronRight size={16} className="text-surface-300" />
                </motion.div>

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
                                        className="flex items-center gap-3 p-4 hover:bg-surface-100 transition-colors cursor-pointer"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-surface-100 text-surface-500 flex items-center justify-center shrink-0">
                                            <Icon size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm text-surface-900">{item.label}</p>
                                            <p className="text-[10px] text-surface-400">{item.desc}</p>
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
                <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-surface-50 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl p-4 flex items-center gap-3 transition-colors group"
                >
                    <motion.div
                        whileHover={{ rotate: -10 }}
                        className="w-9 h-9 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center"
                    >
                        <LogOut size={16} />
                    </motion.div>
                    <span className="font-medium text-sm text-red-500">Log Out</span>
                </motion.button>

                {/* App Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-center pt-4 space-y-1"
                >
                    <p className="text-xs text-surface-300">Localynk v1.0.0</p>
                    <p className="text-[10px] text-surface-300">Made with ❤️ for local merchants</p>
                </motion.div>
            </main>
        </div>
    );
}

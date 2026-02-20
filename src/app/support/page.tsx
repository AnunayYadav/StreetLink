"use client";

import { ArrowLeft, MessageCircle, Mail, Phone, ChevronRight, HelpCircle, FileText, Shield } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import { useLanguage } from "@/lib/context/language-context";
import ChatBot from "@/components/ChatBot";
import { useState } from "react";

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
    })
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.85, y: 10 },
    visible: (i: number) => ({
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { delay: 0.15 + i * 0.1, type: "spring" as const, stiffness: 260, damping: 20 }
    })
};

export default function SupportPage() {
    const { t } = useLanguage();
    const [isChatOpen, setIsChatOpen] = useState(false);

    const faqs = [
        { q: t("support.faq.q1"), a: t("support.faq.a1") },
        { q: t("support.faq.q2"), a: t("support.faq.a2") },
        { q: t("support.faq.q3"), a: t("support.faq.a3") },
        { q: t("support.faq.q4"), a: t("support.faq.a4") },
        { q: t("support.faq.q5"), a: t("support.faq.a5") },
    ];

    const contactOptions = [
        { icon: MessageCircle, label: t("support.contact.chat"), desc: t("support.contact.chat_desc"), color: "#22C55E", bg: "rgba(34,197,94,0.1)", onClick: () => setIsChatOpen(true) },
        { icon: Mail, label: t("support.contact.email"), desc: t("support.contact.email_desc"), color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
        { icon: Phone, label: t("support.contact.call"), desc: t("support.contact.call_desc"), color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
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
                            <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">{t("support.title")}</p>
                            <h1 className="text-sm font-bold text-surface-900 tracking-tight">{t("support.subtitle")}</h1>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </motion.header>

            <main className="max-w-3xl mx-auto px-5 md:px-8 pb-24 pt-4 space-y-8">

                {/* Contact Options */}
                <motion.section custom={0} variants={fadeUp} initial="hidden" animate="visible" className="space-y-3">
                    <h2 className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider ml-0.5">{t("support.get_touch")}</h2>
                    <div className="grid sm:grid-cols-3 gap-3">
                        {contactOptions.map((opt, i) => {
                            const Icon = opt.icon;
                            return (
                                <motion.button
                                    key={opt.label}
                                    custom={i}
                                    variants={scaleIn}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={opt.onClick}
                                    className="bg-surface-50 hover:bg-surface-100 rounded-2xl p-4 flex flex-col items-center gap-2.5 transition-colors text-center w-full"
                                >
                                    <motion.div
                                        animate={{ rotate: [0, 3, -3, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: opt.bg, color: opt.color }}
                                    >
                                        <Icon size={20} />
                                    </motion.div>
                                    <div>
                                        <p className="font-semibold text-sm text-surface-900">{opt.label}</p>
                                        <p className="text-[10px] text-surface-400 mt-0.5">{opt.desc}</p>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.section>

                <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

                {/* FAQs */}
                <section className="space-y-3">
                    <motion.h2
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider ml-0.5"
                    >{t("support.faq")}</motion.h2>
                    <div className="space-y-2">
                        {faqs.map((faq, i) => (
                            <motion.details
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.45 + i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="group bg-surface-50 rounded-xl overflow-hidden"
                            >
                                <summary className="flex items-center gap-3 p-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <HelpCircle size={16} />
                                    </div>
                                    <span className="flex-1 font-medium text-sm text-surface-900">{faq.q}</span>
                                    <ChevronRight size={14} className="text-surface-300 group-open:rotate-90 transition-transform duration-200" />
                                </summary>
                                <div className="px-4 pb-4 pl-15">
                                    <p className="text-sm text-surface-400 leading-relaxed ml-11">{faq.a}</p>
                                </div>
                            </motion.details>
                        ))}
                    </div>
                </section>

                {/* Quick Links */}
                <section className="space-y-3">
                    <motion.h2
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider ml-0.5"
                    >{t("support.resources")}</motion.h2>
                    <div className="space-y-2">
                        {[
                            { icon: FileText, label: t("support.res.tos"), desc: t("support.res.tos_desc") },
                            { icon: Shield, label: t("support.res.privacy"), desc: t("support.res.privacy_desc") },
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.85 + i * 0.1, duration: 0.4 }}
                                    whileHover={{ x: 4 }}
                                    className="bg-surface-50 hover:bg-surface-100 rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-colors"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-surface-100 text-surface-400 flex items-center justify-center shrink-0">
                                        <Icon size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm text-surface-900">{item.label}</p>
                                        <p className="text-[10px] text-surface-400">{item.desc}</p>
                                    </div>
                                    <ChevronRight size={14} className="text-surface-300" />
                                </motion.div>
                            );
                        })}
                    </div>
                </section>
            </main>
        </div>
    );
}

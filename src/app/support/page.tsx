"use client";

import { ArrowLeft, MessageCircle, Mail, Phone, ChevronRight, HelpCircle, FileText, Shield } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

const faqs = [
    { q: "How do I register my shop?", a: "Go to the Register page and follow the 3-step onboarding process. It takes less than 60 seconds." },
    { q: "How do customers find my shop?", a: "Once registered, your shop appears on the Market Explorer. Customers nearby can discover and order from you." },
    { q: "Is there a commission fee?", a: "Localynk charges a minimal platform fee of 2% per transaction. No hidden charges." },
    { q: "How do I receive payments?", a: "Payments are settled directly to your linked bank account within 24 hours of order completion." },
    { q: "Can I manage my inventory?", a: "Yes! Use the Products page in your dashboard to add, edit, or remove items from your catalog." },
];

const contactOptions = [
    { icon: MessageCircle, label: "Live Chat", desc: "Chat with our team", color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
    { icon: Mail, label: "Email Us", desc: "support@localynk.in", color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
    { icon: Phone, label: "Call Us", desc: "+91 1800-XXX-XXXX", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
];

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
                            <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">Help Center</p>
                            <h1 className="text-sm font-bold text-surface-900 tracking-tight">Support</h1>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </motion.header>

            <main className="max-w-3xl mx-auto px-5 md:px-8 pb-24 pt-4 space-y-8">

                {/* Contact Options */}
                <motion.section custom={0} variants={fadeUp} initial="hidden" animate="visible" className="space-y-3">
                    <h2 className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider ml-0.5">Get in Touch</h2>
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
                                    className="bg-surface-50 hover:bg-surface-100 rounded-2xl p-4 flex flex-col items-center gap-2.5 transition-colors text-center"
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

                {/* FAQs */}
                <section className="space-y-3">
                    <motion.h2
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider ml-0.5"
                    >Frequently Asked Questions</motion.h2>
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
                    >Resources</motion.h2>
                    <div className="space-y-2">
                        {[
                            { icon: FileText, label: "Terms of Service", desc: "Read our terms" },
                            { icon: Shield, label: "Privacy Policy", desc: "How we protect your data" },
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

"use client";

import { useState } from "react";
import {
    ArrowLeft,
    ShieldCheck,
    CheckCircle2,
    User,
    Phone,
    CreditCard,
    MapPin,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutPage() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("upi");

    const handlePlaceOrder = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-surface-50 p-8 flex flex-col items-center justify-center">
                <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
                    <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 12 }}
                        className="w-40 h-40 bg-primary text-white rounded-[48px] flex items-center justify-center mb-12 shadow-accent relative"
                    >
                        <CheckCircle2 size={80} strokeWidth={3} />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-premium border-4 border-surface-50"
                        >
                            <User size={24} className="text-primary" />
                        </motion.div>
                    </motion.div>

                    <div className="space-y-6 mb-16 text-center">
                        <h1 className="text-5xl md:text-7xl font-black text-surface-900 tracking-tighter leading-none uppercase italic">Order Secured</h1>
                        <p className="text-lg font-bold text-muted italic max-w-xl mx-auto">
                            The manifest has been received. Your vendor is preparing your fresh items for rapid local fulfillment.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 w-full mb-16">
                        <div className="card-premium p-8 bg-card-bg border-border-subtle shadow-elevated relative group">
                            <div className="absolute top-0 left-10 -translate-y-1/2 px-6 py-2 bg-contrast-bg text-contrast-text text-[11px] font-black uppercase tracking-[0.3em] rounded-xl">
                                Customer Metadata
                            </div>
                            <div className="space-y-8 pt-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-left">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2 italic">Recipient Identity</p>
                                        <p className="text-3xl font-black text-surface-900 tracking-tight">Verified Buyer</p>
                                    </div>
                                    <div className="w-14 h-14 bg-contrast-bg text-primary rounded-2xl flex items-center justify-center shadow-xl">
                                        <Phone size={24} strokeWidth={3} />
                                    </div>
                                </div>
                                <div className="h-px bg-border-subtle" />
                                <div className="text-left font-black">
                                    <p className="text-[10px] text-primary uppercase tracking-[0.3em] mb-2 italic">Operation Center</p>
                                    <p className="text-surface-900">Local Fulfillment Node</p>
                                </div>
                            </div>
                        </div>

                        <div className="card-premium p-8 bg-contrast-bg text-contrast-text relative group overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                            <div className="relative z-10 space-y-8">
                                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic">Settlement Summary</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-xl font-bold">
                                        <span className="opacity-40">Item Log</span>
                                        <span>Red Apples • 1kg</span>
                                    </div>
                                    <div className="flex justify-between items-center text-4xl font-black tracking-tighter pt-4 border-t border-surface-50/10">
                                        <span className="text-primary italic">Total</span>
                                        <span>₹120</span>
                                    </div>
                                </div>
                                <p className="text-[10px] font-black opacity-40 uppercase tracking-widest italic pt-4">Transaction Confirmed via UPI Node</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 w-full">
                        <Link href="/orders" className="flex-1 btn-primary h-20 bg-contrast-bg text-contrast-text shadow-elevated text-base tracking-[0.3em] uppercase group">
                            <span className="font-black">Track Order</span>
                            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                        <Link href="/search" className="flex-1 btn-primary h-20 shadow-accent text-base tracking-[0.3em] uppercase">
                            <span className="font-black">Back to Discovery</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-50">
            <header className="sticky top-0 bg-surface-50/80 backdrop-blur-md z-30 border-b border-border-subtle">
                <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-6 flex items-center gap-8 w-full">
                    <Link href="/shop/1" className="w-14 h-14 bg-card-bg text-surface-900 rounded-2xl flex items-center justify-center shadow-premium border border-border-subtle hover:border-primary/20 active:scale-95 transition-all">
                        <ArrowLeft size={28} />
                    </Link>
                    <div>
                        <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em] opacity-80 italic">Verified Checkout</p>
                        <h1 className="text-2xl font-black text-surface-900 tracking-tighter uppercase">Secure Transaction</h1>
                    </div>
                </div>
            </header>

            <main className="w-full pt-12 pb-40">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid lg:grid-cols-12 gap-12 items-start">
                        {/* Summary Column */}
                        <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-40">
                            <section className="space-y-6">
                                <h2 className="text-[11px] font-black text-surface-900 uppercase tracking-[0.3em] ml-2 italic">Order Snapshot</h2>
                                <div className="glass-card p-8 text-foreground border border-border-subtle shadow-premium space-y-8 rounded-[32px]">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-[28px] glass overflow-hidden shrink-0 shadow-inner border border-border-subtle">
                                            <img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=120" alt="Produce" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-surface-900 text-xl tracking-tight leading-none group-hover:text-primary transition-colors">Artisan Produce</h4>
                                            <p className="text-[11px] font-black text-muted uppercase tracking-[0.2em] mt-2 italic">1 Unit • ₹120</p>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-dashed border-border-subtle flex justify-between items-end">
                                        <div>
                                            <h4 className="font-black text-primary text-[10px] uppercase tracking-[0.3em] mb-1">Settlement Total</h4>
                                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest italic leading-none">Includes direct delivery</p>
                                        </div>
                                        <span className="text-5xl font-black text-primary tracking-tighter">₹120</span>
                                    </div>
                                </div>
                            </section>

                            <div className="flex items-center gap-4 p-5 bg-contrast-bg text-contrast-text rounded-[32px] shadow-2xl relative overflow-hidden group">
                                <div className="absolute right-0 top-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                                <ShieldCheck size={32} className="text-primary shrink-0 relative z-10" />
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Security Protocol</p>
                                    <p className="text-[11px] font-bold opacity-60 mt-1">256-bit encrypted node end-to-end</p>
                                </div>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="lg:col-span-8 space-y-12">
                            <section className="space-y-8">
                                <h2 className="text-[11px] font-black text-surface-900 uppercase tracking-[0.3em] ml-2 italic">Receiver Profile</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="relative group">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary transition-colors" size={24} />
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            className="w-full h-20 pl-16 pr-8 rounded-3xl glass-card shadow-premium border border-border-subtle outline-none font-black text-lg text-surface-900 placeholder:text-surface-300 focus:border-primary/40 focus:ring-8 focus:ring-primary/5 transition-all"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary transition-colors" size={24} />
                                        <input
                                            type="tel"
                                            placeholder="WhatsApp Number"
                                            className="w-full h-20 pl-16 pr-8 rounded-3xl glass-card shadow-premium border border-border-subtle outline-none font-black text-lg text-surface-900 placeholder:text-surface-300 focus:border-primary/40 focus:ring-8 focus:ring-primary/5 transition-all"
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-8">
                                <h2 className="text-[11px] font-black text-surface-900 uppercase tracking-[0.3em] ml-2 italic">Dispatch Configuration</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <button
                                        onClick={() => setPaymentMethod("upi")}
                                        className={`p-6 rounded-[32px] border-2 flex flex-col gap-5 transition-all group relative overflow-hidden ${paymentMethod === 'upi' ? 'border-primary bg-primary-soft shadow-accent' : 'border-border-subtle bg-card-bg shadow-premium hover:border-primary/20'}`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${paymentMethod === 'upi' ? 'bg-primary text-white shadow-accent' : 'bg-surface-100 text-surface-400'}`}>
                                            <CreditCard size={32} strokeWidth={3} />
                                        </div>
                                        <div>
                                            <span className="font-black text-surface-900 text-xl uppercase tracking-widest block leading-none">UPI Instant</span>
                                            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mt-2 italic">Standard Node Processing</p>
                                        </div>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" className="absolute top-8 right-8 h-5 opacity-40 grayscale group-hover:grayscale-0 transition-all" alt="UPI" />
                                    </button>

                                    <button
                                        onClick={() => setPaymentMethod("cod")}
                                        className={`p-6 rounded-[32px] border-2 flex flex-col gap-5 transition-all group relative overflow-hidden ${paymentMethod === 'cod' ? 'border-surface-900 bg-contrast-bg text-contrast-text shadow-elevated' : 'border-border-subtle bg-card-bg shadow-premium hover:border-primary/20'}`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${paymentMethod === 'cod' ? 'bg-surface-50 text-surface-900' : 'bg-surface-100 text-surface-400'}`}>
                                            <MapPin size={32} strokeWidth={3} />
                                        </div>
                                        <div>
                                            <span className="font-black text-xl uppercase tracking-widest block leading-none">Hand Settlement</span>
                                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic ${paymentMethod === 'cod' ? 'opacity-40' : 'text-muted'}`}>Pay at fulfillment node</p>
                                        </div>
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            {/* Sticky Action Footer */}
            <div className="fixed bottom-0 left-0 w-full p-6 md:p-10 bg-background/80 backdrop-blur-2xl border-t border-border-subtle z-50">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <button
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="btn-primary w-full h-20 md:h-16 shadow-accent relative overflow-hidden active:scale-95 transition-all text-base md:text-sm tracking-[0.3em]"
                    >
                        <AnimatePresence mode="wait">
                            {isProcessing ? (
                                <motion.div
                                    key="processing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-4"
                                >
                                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                    <span className="font-black uppercase tracking-widest">Protocol Verification...</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-4"
                                >
                                    <span className="font-black uppercase tracking-[0.3em]">Authorize Settlement • ₹120</span>
                                    <ArrowRight size={24} strokeWidth={3} />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {isProcessing && (
                            <motion.div
                                className="absolute inset-x-0 bottom-0 h-1.5 bg-white/30"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 2 }}
                            />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import {
    ArrowLeft,
    Clock,
    CheckCircle2,
    XCircle,
    Phone,
    MessageSquare,
    PackageCheck,
    MoreVertical,
    Calendar,
    Filter
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_ORDERS: any[] = [];

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
    })
};

export default function OrderManagement() {
    const [orders, setOrders] = useState(INITIAL_ORDERS);
    const [activeTab, setActiveTab] = useState("New");

    const updateStatus = (id: string, newStatus: string) => {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    };

    const tabs = ["New", "Active", "Completed", "Cancelled"];

    return (
        <div className="min-h-screen bg-surface-50 pb-20">
            <motion.header
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="sticky top-0 bg-surface-50/80 backdrop-blur-md z-30 border-b border-border-subtle"
            >
                <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-6 flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                        <motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.9 }}>
                            <Link href="/dashboard" className="w-12 h-12 bg-card-bg text-surface-900 rounded-2xl flex items-center justify-center shadow-premium border border-border-subtle hover:border-primary/30 transition-colors">
                                <ArrowLeft size={24} />
                            </Link>
                        </motion.div>
                        <div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] opacity-80 italic">Order Pipeline</p>
                            <h1 className="text-2xl font-black text-surface-900 tracking-tighter uppercase">Operations</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            className="hidden md:flex items-center gap-2 px-6 h-12 bg-contrast-bg text-contrast-text rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-premium transition-colors"
                        >
                            <Calendar size={18} className="text-primary" />
                            History
                        </motion.button>
                        <motion.button
                            whileHover={{ rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-12 h-12 bg-card-bg rounded-2xl flex items-center justify-center shadow-premium border border-border-subtle transition-colors"
                        >
                            <Filter size={20} className="text-surface-900" />
                        </motion.button>
                    </div>
                </div>
            </motion.header>

            <main className="w-full pt-10">
                <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
                    {/* Modern Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.4 }}
                        className="max-w-2xl lg:mx-0 p-2 bg-card-bg rounded-[32px] shadow-premium border border-border-subtle flex gap-2"
                    >
                        {tabs.map((tab, i) => (
                            <motion.button
                                key={tab}
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + i * 0.05, type: "spring", stiffness: 300, damping: 22 }}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab
                                    ? 'text-white shadow-accent'
                                    : 'text-surface-500 hover:text-surface-900 hover:bg-surface-50'
                                    }`}
                            >
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeOrderTab"
                                        className="absolute inset-0 bg-primary rounded-2xl shadow-accent"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{tab}</span>
                            </motion.button>
                        ))}
                    </motion.div>

                    <div className="grid lg:grid-cols-12 gap-10">
                        {/* Stats Sidebar */}
                        <div className="lg:col-span-3 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                                className="card-premium p-8 bg-contrast-bg text-contrast-text relative overflow-hidden group shadow-2xl"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.35, 0.2] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute right-0 top-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"
                                />
                                <div className="relative z-10 space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Live Operations</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <motion.div
                                                animate={{ scale: [1, 1.4, 1] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                className="w-2 h-2 bg-primary rounded-full"
                                            />
                                            <motion.p
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.5, type: "spring" }}
                                                className="text-4xl font-black tracking-tighter"
                                            >12</motion.p>
                                        </div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none italic">Incoming requests now</p>
                                    </div>
                                    <div className="pt-6 border-t border-surface-50/5 space-y-4">
                                        <div className="flex justify-between items-center text-[10px] font-black tracking-widest">
                                            <span className="opacity-40">Acceptance Rate</span>
                                            <span className="text-emerald-400">98.2%</span>
                                        </div>
                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "98%" }}
                                                transition={{ delay: 0.7, duration: 1.2, ease: "easeOut" }}
                                                className="h-full bg-emerald-400 shadow-accent shadow-emerald-400/50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Orders List */}
                        <div className="lg:col-span-9 space-y-8">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex items-center justify-between px-1"
                            >
                                <h2 className="text-[10px] font-black text-surface-900 uppercase tracking-widest leading-none">Pipeline Feed — {activeTab} Orders</h2>
                                <p className="text-[10px] font-black text-muted uppercase tracking-widest italic leading-none">Auto-refresh Active</p>
                            </motion.div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <AnimatePresence mode="popLayout">
                                    {orders.length > 0 ? orders.map((order, i) => (
                                        <motion.div
                                            key={order.id}
                                            layout
                                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                            transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                            whileHover={{ y: -3 }}
                                            className="card-premium p-8 bg-card-bg border-2 border-transparent hover:border-primary/20 transition-colors shadow-elevated relative group"
                                        >
                                            <div className="flex justify-between items-start mb-8">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="font-black text-surface-900 text-2xl tracking-tighter leading-none">{order.customer}</h3>
                                                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                                    </div>
                                                    <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em] italic">
                                                        {order.time} — <span className="text-muted">{order.id}</span>
                                                    </p>
                                                </div>
                                                <motion.button whileTap={{ scale: 0.85 }} className="w-10 h-10 bg-surface-50 rounded-xl flex items-center justify-center text-surface-300 hover:text-surface-900 transition-colors">
                                                    <MoreVertical size={20} />
                                                </motion.button>
                                            </div>

                                            <div className="p-6 bg-surface-50 rounded-3xl border border-border-subtle mb-8 min-h-[100px] flex flex-col justify-center">
                                                <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-3 italic">Itemized manifest</p>
                                                <p className="text-base font-black text-surface-900 leading-tight">{order.items}</p>
                                            </div>

                                            <div className="flex items-center justify-between mb-10">
                                                <div>
                                                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-1">Settlement</p>
                                                    <span className="text-3xl font-black text-surface-900">₹{order.total}</span>
                                                </div>
                                                <div className="flex gap-3">
                                                    <motion.a whileTap={{ scale: 0.9 }} href={`tel:123`} className="w-14 h-14 bg-card-bg rounded-2xl text-surface-900 border border-border-subtle flex items-center justify-center hover:bg-surface-50 transition-colors shadow-premium">
                                                        <Phone size={24} />
                                                    </motion.a>
                                                    <motion.a whileTap={{ scale: 0.9 }} href={`wa.link`} className="w-14 h-14 bg-card-bg rounded-2xl text-[#25D366] border border-border-subtle flex items-center justify-center hover:bg-surface-50 transition-colors shadow-premium">
                                                        <MessageSquare size={24} />
                                                    </motion.a>
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                {order.status === "pending" && (
                                                    <>
                                                        <motion.button
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => updateStatus(order.id, "rejected")}
                                                            className="flex-1 h-16 bg-surface-50 text-surface-900 text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl transition-colors border-2 border-border-subtle hover:bg-surface-100"
                                                        >
                                                            Decline
                                                        </motion.button>
                                                        <motion.button
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => updateStatus(order.id, "accepted")}
                                                            className="flex-[1.5] h-16 bg-primary text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-accent transition-colors"
                                                        >
                                                            Accept Order
                                                        </motion.button>
                                                    </>
                                                )}
                                                {order.status === "accepted" && (
                                                    <motion.button
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => updateStatus(order.id, "completed")}
                                                        className="grow h-16 bg-contrast-bg text-contrast-text text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-elevated flex items-center justify-center gap-3 transition-colors"
                                                    >
                                                        <PackageCheck size={24} strokeWidth={3} className="text-primary" />
                                                        Complete Service
                                                    </motion.button>
                                                )}
                                                {order.status === "completed" && (
                                                    <div className="grow h-16 flex items-center justify-center gap-3 text-emerald-500 font-black text-[11px] uppercase tracking-[0.3em] bg-emerald-50 rounded-2xl border-2 border-emerald-100 italic">
                                                        <CheckCircle2 size={24} strokeWidth={3} />
                                                        Manifest Delivered
                                                    </div>
                                                )}
                                                {order.status === "rejected" && (
                                                    <div className="grow h-16 flex items-center justify-center gap-3 text-muted font-black text-[11px] uppercase tracking-[0.3em] bg-surface-50 rounded-2xl border-2 border-border-subtle italic">
                                                        <XCircle size={24} strokeWidth={3} />
                                                        Refused
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )) : (
                                        <motion.div
                                            key="empty"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                                            className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-6 bg-card-bg rounded-[32px] border-2 border-dashed border-border-subtle shadow-inner"
                                        >
                                            <motion.div
                                                animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 0] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                className="w-24 h-24 bg-surface-50 rounded-full flex items-center justify-center text-surface-200"
                                            >
                                                <Clock size={48} />
                                            </motion.div>
                                            <div className="space-y-2 px-6">
                                                <p className="text-2xl font-black text-surface-900 tracking-tight">Pipeline Clear</p>
                                                <p className="text-sm font-bold text-muted italic">There are no incoming manifest requests right now. <br className="hidden md:block" /> Stay standby for real-time local orders.</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

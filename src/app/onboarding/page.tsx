"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Camera, MapPin, Store, ArrowLeft, Languages, Sparkles,
    ChevronRight, Cherry, Salad, UtensilsCrossed, Scissors, Wrench,
    ShoppingBasket, Coffee, Shirt, Pill, Bike
} from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const categories = [
    { name: "Fruits", icon: Cherry, color: "#F43F5E", bg: "rgba(244,63,94,0.1)" },
    { name: "Vegetables", icon: Salad, color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
    { name: "Street Food", icon: UtensilsCrossed, color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
    { name: "Grocery", icon: ShoppingBasket, color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
    { name: "Tailoring", icon: Scissors, color: "#A855F7", bg: "rgba(168,85,247,0.1)" },
    { name: "Repair", icon: Wrench, color: "#64748B", bg: "rgba(100,116,139,0.1)" },
    { name: "Cafe & Tea", icon: Coffee, color: "#D97706", bg: "rgba(217,119,6,0.1)" },
    { name: "Clothing", icon: Shirt, color: "#EC4899", bg: "rgba(236,72,153,0.1)" },
    { name: "Pharmacy", icon: Pill, color: "#14B8A6", bg: "rgba(20,184,166,0.1)" },
    { name: "Delivery", icon: Bike, color: "#E23744", bg: "rgba(226,55,68,0.1)" },
];

const pageVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 })
};

const staggerGrid = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } }
};

const gridItem = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 20 } }
};

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(0);
    const [formData, setFormData] = useState<{
        shopName: string;
        category: string;
        location: { lat: number; lng: number } | null;
        language: string;
    }>({
        shopName: "",
        category: "",
        location: null,
        language: "English"
    });

    const nextStep = () => { setDirection(1); setStep(s => Math.min(s + 1, 3)); };
    const prevStep = () => { setDirection(-1); setStep(s => Math.max(s - 1, 1)); };

    const handleLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setFormData({ ...formData, location: { lat: pos.coords.latitude, lng: pos.coords.longitude } });
            });
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 w-full"
            >
                <div className="max-w-2xl mx-auto px-5 md:px-8 pt-6 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <motion.div whileHover={{ x: -2 }} whileTap={{ scale: 0.9 }}>
                            <Link href="/" className="w-10 h-10 bg-surface-50 rounded-xl flex items-center justify-center text-surface-400 hover:text-surface-900 transition-colors">
                                <ArrowLeft size={18} />
                            </Link>
                        </motion.div>
                        <div>
                            <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">Step {step} of 3</p>
                            <h1 className="text-sm font-bold text-surface-900 tracking-tight">Merchant Onboarding</h1>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </motion.header>

            {/* Progress Bar */}
            <div className="w-full">
                <div className="max-w-2xl mx-auto px-5 md:px-8 mb-8 flex gap-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-surface-100">
                            <motion.div
                                initial={false}
                                animate={{ width: step >= i ? "100%" : "0%" }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className={`h-full rounded-full ${step >= i ? 'bg-primary' : ''}`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 w-full relative z-10">
                <div className="max-w-2xl mx-auto px-5 md:px-8 pb-28">
                    <AnimatePresence mode="wait" custom={direction}>
                        {/* Step 1: Shop Details */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                custom={direction}
                                variants={pageVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                className="space-y-8"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="space-y-1"
                                >
                                    <h2 className="text-2xl md:text-3xl font-black text-surface-900 tracking-tight">Your Digital Storefront</h2>
                                    <p className="text-sm text-surface-400">Set up the basics for your shop.</p>
                                </motion.div>

                                {/* Shop Name Input */}
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="space-y-2"
                                >
                                    <label className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider ml-0.5">Shop Name</label>
                                    <div className="relative group">
                                        <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="text"
                                            placeholder="e.g. The Artisan Coffee"
                                            className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-50 outline-none font-medium text-sm text-surface-900 placeholder:text-surface-300 focus:ring-2 focus:ring-primary/20 transition-all"
                                            value={formData.shopName}
                                            onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                                        />
                                    </div>
                                </motion.div>

                                {/* Category Grid */}
                                <div className="space-y-3">
                                    <motion.label
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.25 }}
                                        className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider ml-0.5 block"
                                    >What do you sell?</motion.label>
                                    <motion.div
                                        variants={staggerGrid}
                                        initial="hidden"
                                        animate="visible"
                                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5"
                                    >
                                        {categories.map(cat => {
                                            const IconComponent = cat.icon;
                                            const isSelected = formData.category === cat.name;
                                            return (
                                                <motion.button
                                                    key={cat.name}
                                                    variants={gridItem}
                                                    whileHover={{ scale: 1.04, y: -2 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setFormData({ ...formData, category: cat.name })}
                                                    className={`relative p-3.5 rounded-2xl transition-colors group flex flex-col items-center gap-2 ${isSelected
                                                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                                        : 'bg-surface-50 hover:bg-surface-100'
                                                        }`}
                                                >
                                                    <div
                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isSelected
                                                            ? 'bg-white/20'
                                                            : ''
                                                            }`}
                                                        style={!isSelected ? { backgroundColor: cat.bg, color: cat.color } : undefined}
                                                    >
                                                        <IconComponent size={20} strokeWidth={2} className={isSelected ? 'text-white' : ''} />
                                                    </div>
                                                    <span className={`text-[10px] font-semibold tracking-wide ${isSelected ? 'text-white' : 'text-surface-500'}`}>{cat.name}</span>
                                                </motion.button>
                                            );
                                        })}
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Location & Photo */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                custom={direction}
                                variants={pageVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                className="space-y-8"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="space-y-1"
                                >
                                    <h2 className="text-2xl md:text-3xl font-black text-surface-900 tracking-tight">Identity & Reach</h2>
                                    <p className="text-sm text-surface-400">Help customers find you on the map.</p>
                                </motion.div>

                                <div className="space-y-4">
                                    {/* Location Button */}
                                    <motion.button
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleLocation}
                                        className={`w-full p-4 rounded-2xl transition-colors relative overflow-hidden group ${formData.location
                                            ? 'bg-primary/10 ring-2 ring-primary/30'
                                            : 'bg-surface-50 hover:bg-surface-100'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4 relative z-10">
                                            <motion.div
                                                animate={formData.location ? { scale: [1, 1.1, 1] } : { y: [0, -2, 0] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${formData.location ? 'bg-primary text-white' : 'bg-surface-100 text-surface-400'}`}
                                            >
                                                <MapPin size={20} strokeWidth={2} />
                                            </motion.div>
                                            <div className="text-left flex-1">
                                                <p className="font-semibold text-sm text-surface-900">
                                                    {formData.location ? 'Location Verified' : 'Auto-locate Shop'}
                                                </p>
                                                <p className={`text-xs mt-0.5 ${formData.location ? 'text-primary font-medium' : 'text-surface-400'}`}>
                                                    {formData.location ? 'GPS Locked ✓' : 'Tap to sync your position'}
                                                </p>
                                            </div>
                                            {!formData.location && (
                                                <motion.div animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                                    <ChevronRight size={16} className="text-surface-300" />
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.button>

                                    {/* Photo Upload */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        whileHover={{ scale: 1.01 }}
                                        className="relative group overflow-hidden rounded-2xl bg-surface-50 hover:bg-surface-100 aspect-[16/10] flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer"
                                    >
                                        <motion.div
                                            animate={{ y: [0, -4, 0] }}
                                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                            className="w-12 h-12 bg-surface-100 group-hover:bg-surface-200 rounded-xl flex items-center justify-center text-surface-400 group-hover:text-surface-500 transition-colors"
                                        >
                                            <Camera size={22} />
                                        </motion.div>
                                        <div className="text-center space-y-0.5">
                                            <p className="font-semibold text-sm text-surface-900">Upload Store Photo</p>
                                            <p className="text-xs text-surface-400">Increases trust by up to 80%</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Final Settings */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                custom={direction}
                                variants={pageVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                className="space-y-8"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="space-y-1"
                                >
                                    <h2 className="text-2xl md:text-3xl font-black text-surface-900 tracking-tight">Ready to Launch!</h2>
                                    <p className="text-sm text-surface-400">Final polish for your digital business.</p>
                                </motion.div>

                                <div className="space-y-4">
                                    {/* Language Selector */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="space-y-2"
                                    >
                                        <label className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider ml-0.5">Preferred Language</label>
                                        <div className="relative group">
                                            <Languages className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300 group-focus-within:text-primary transition-colors" size={18} />
                                            <select
                                                className="w-full h-12 pl-11 pr-10 rounded-xl bg-surface-50 outline-none font-medium text-surface-900 appearance-none text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                                                value={formData.language}
                                                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                            >
                                                <option>English</option>
                                                <option>Hindi (हिंदी)</option>
                                                <option>Tamil (தமிழ்)</option>
                                                <option>Telugu (తెలుగు)</option>
                                                <option>Kannada (ಕನ್ನಡ)</option>
                                                <option>Bengali (বাংলা)</option>
                                            </select>
                                            <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-300 rotate-90 pointer-events-none" />
                                        </div>
                                    </motion.div>

                                    {/* Ready Card */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.35, type: "spring", stiffness: 200, damping: 20 }}
                                        className="p-5 bg-primary/5 rounded-2xl relative overflow-hidden group"
                                    >
                                        <motion.div
                                            animate={{ scale: [1, 1.3, 1] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute right-0 bottom-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl"
                                        />
                                        <div className="flex gap-4 relative z-10">
                                            <motion.div
                                                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0"
                                            >
                                                <Sparkles size={20} />
                                            </motion.div>
                                            <div className="space-y-0.5">
                                                <h4 className="font-semibold text-sm text-surface-900">Everything synchronized!</h4>
                                                <p className="text-sm text-surface-400 leading-relaxed">Your storefront is ready to accept digital payments and orders.</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Bottom Action Bar */}
            <motion.div
                initial={{ y: 60 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 25 }}
                className="fixed bottom-0 left-0 w-full p-4 bg-background/90 backdrop-blur-xl z-40"
            >
                <div className="max-w-2xl mx-auto flex gap-3">
                    <AnimatePresence>
                        {step > 1 && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8, width: 0 }}
                                animate={{ opacity: 1, scale: 1, width: "auto" }}
                                exit={{ opacity: 0, scale: 0.8, width: 0 }}
                                onClick={prevStep}
                                className="w-12 h-12 bg-surface-50 rounded-xl flex items-center justify-center text-surface-500 hover:text-surface-900 shrink-0 transition-colors"
                            >
                                <ArrowLeft size={18} />
                            </motion.button>
                        )}
                    </AnimatePresence>
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={step === 3 ? () => window.location.href = '/dashboard' : nextStep}
                        className="flex-1 bg-primary hover:bg-primary-dark text-white h-12 rounded-xl text-sm font-semibold tracking-wide flex items-center justify-center gap-2 group transition-colors shadow-lg shadow-primary/20"
                    >
                        <span>{step === 3 ? 'Launch My Store' : 'Next Step'}</span>
                        <motion.div
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <ChevronRight size={16} strokeWidth={2.5} />
                        </motion.div>
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}

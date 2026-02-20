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

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
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

    const nextStep = () => setStep(s => Math.min(s + 1, 3));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

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
            <header className="relative z-10 w-full">
                <div className="max-w-2xl mx-auto px-5 md:px-8 pt-6 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="w-10 h-10 bg-surface-50 rounded-xl flex items-center justify-center text-surface-400 hover:text-surface-900 active:scale-95 transition-all">
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">Step {step} of 3</p>
                            <h1 className="text-sm font-bold text-surface-900 tracking-tight">Merchant Onboarding</h1>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            {/* Progress Bar */}
            <div className="w-full">
                <div className="max-w-2xl mx-auto px-5 md:px-8 mb-8 flex gap-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-surface-100">
                            <motion.div
                                initial={false}
                                animate={{ width: step >= i ? "100%" : "0%" }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className={`h-full rounded-full ${step >= i ? 'bg-primary' : ''}`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 w-full relative z-10">
                <div className="max-w-2xl mx-auto px-5 md:px-8 pb-28">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Shop Details */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.25 }}
                                className="space-y-8"
                            >
                                <div className="space-y-1">
                                    <h2 className="text-2xl md:text-3xl font-black text-surface-900 tracking-tight">Your Digital Storefront</h2>
                                    <p className="text-sm text-surface-400">Set up the basics for your shop.</p>
                                </div>

                                {/* Shop Name Input */}
                                <div className="space-y-2">
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
                                </div>

                                {/* Category Grid */}
                                <div className="space-y-3">
                                    <label className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider ml-0.5">What do you sell?</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                                        {categories.map(cat => {
                                            const IconComponent = cat.icon;
                                            const isSelected = formData.category === cat.name;
                                            return (
                                                <button
                                                    key={cat.name}
                                                    onClick={() => setFormData({ ...formData, category: cat.name })}
                                                    className={`relative p-3.5 rounded-2xl transition-all group flex flex-col items-center gap-2 ${isSelected
                                                        ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]'
                                                        : 'bg-surface-50 hover:bg-surface-100 active:scale-[0.97]'
                                                        }`}
                                                >
                                                    <div
                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isSelected
                                                            ? 'bg-white/20'
                                                            : ''
                                                            }`}
                                                        style={!isSelected ? { backgroundColor: cat.bg, color: cat.color } : undefined}
                                                    >
                                                        <IconComponent size={20} strokeWidth={2} className={isSelected ? 'text-white' : ''} />
                                                    </div>
                                                    <span className={`text-[10px] font-semibold tracking-wide ${isSelected ? 'text-white' : 'text-surface-500'}`}>{cat.name}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Location & Photo */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.25 }}
                                className="space-y-8"
                            >
                                <div className="space-y-1">
                                    <h2 className="text-2xl md:text-3xl font-black text-surface-900 tracking-tight">Identity & Reach</h2>
                                    <p className="text-sm text-surface-400">Help customers find you on the map.</p>
                                </div>

                                <div className="space-y-4">
                                    {/* Location Button */}
                                    <button
                                        onClick={handleLocation}
                                        className={`w-full p-4 rounded-2xl transition-all relative overflow-hidden group ${formData.location
                                            ? 'bg-primary/10 ring-2 ring-primary/30'
                                            : 'bg-surface-50 hover:bg-surface-100'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${formData.location ? 'bg-primary text-white' : 'bg-surface-100 text-surface-400'}`}>
                                                <MapPin size={20} strokeWidth={2} />
                                            </div>
                                            <div className="text-left flex-1">
                                                <p className={`font-semibold text-sm ${formData.location ? 'text-surface-900' : 'text-surface-900'}`}>
                                                    {formData.location ? 'Location Verified' : 'Auto-locate Shop'}
                                                </p>
                                                <p className={`text-xs mt-0.5 ${formData.location ? 'text-primary font-medium' : 'text-surface-400'}`}>
                                                    {formData.location ? 'GPS Locked ✓' : 'Tap to sync your position'}
                                                </p>
                                            </div>
                                            {!formData.location && (
                                                <ChevronRight size={16} className="text-surface-300" />
                                            )}
                                        </div>
                                    </button>

                                    {/* Photo Upload */}
                                    <div className="relative group overflow-hidden rounded-2xl bg-surface-50 hover:bg-surface-100 aspect-[16/10] flex flex-col items-center justify-center gap-3 transition-all cursor-pointer">
                                        <div className="w-12 h-12 bg-surface-100 group-hover:bg-surface-200 rounded-xl flex items-center justify-center text-surface-400 group-hover:text-surface-500 group-hover:scale-105 transition-all">
                                            <Camera size={22} />
                                        </div>
                                        <div className="text-center space-y-0.5">
                                            <p className="font-semibold text-sm text-surface-900">Upload Store Photo</p>
                                            <p className="text-xs text-surface-400">Increases trust by up to 80%</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Final Settings */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.25 }}
                                className="space-y-8"
                            >
                                <div className="space-y-1">
                                    <h2 className="text-2xl md:text-3xl font-black text-surface-900 tracking-tight">Ready to Launch!</h2>
                                    <p className="text-sm text-surface-400">Final polish for your digital business.</p>
                                </div>

                                <div className="space-y-4">
                                    {/* Language Selector */}
                                    <div className="space-y-2">
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
                                    </div>

                                    {/* Ready Card */}
                                    <div className="p-5 bg-primary/5 rounded-2xl relative overflow-hidden group">
                                        <div className="absolute right-0 bottom-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
                                        <div className="flex gap-4 relative z-10">
                                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                                                <Sparkles size={20} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <h4 className="font-semibold text-sm text-surface-900">Everything synchronized!</h4>
                                                <p className="text-sm text-surface-400 leading-relaxed">Your storefront is ready to accept digital payments and orders.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 w-full p-4 bg-background/90 backdrop-blur-xl z-40">
                <div className="max-w-2xl mx-auto flex gap-3">
                    {step > 1 && (
                        <button
                            onClick={prevStep}
                            className="w-12 h-12 bg-surface-50 rounded-xl flex items-center justify-center text-surface-500 hover:text-surface-900 active:scale-95 transition-all shrink-0"
                        >
                            <ArrowLeft size={18} />
                        </button>
                    )}
                    <button
                        onClick={step === 3 ? () => window.location.href = '/dashboard' : nextStep}
                        className="flex-1 bg-primary hover:bg-primary-dark text-white h-12 rounded-xl text-sm font-semibold tracking-wide flex items-center justify-center gap-2 group active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                    >
                        <span>{step === 3 ? 'Launch My Store' : 'Next Step'}</span>
                        <ChevronRight size={16} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}

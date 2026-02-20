"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Camera, MapPin, Store, ArrowLeft, Languages, Sparkles,
    ChevronRight, Cherry, Salad, UtensilsCrossed, Scissors, Wrench,
    ShoppingBasket, Coffee, Shirt, Pill, Bike, Loader2, Check,
    Phone, Mail, CreditCard, MoreHorizontal, X, ImageIcon, AlertCircle
} from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/lib/context/auth-context";
import { useLanguage } from "@/lib/context/language-context";
import { createClient } from "@/lib/supabase/client";

const getCategories = (t: any) => [
    { name: t("cat.fruits"), icon: Cherry, color: "#F43F5E", bg: "rgba(244,63,94,0.1)", key: "Fruits" },
    { name: t("cat.vegetables"), icon: Salad, color: "#22C55E", bg: "rgba(34,197,94,0.1)", key: "Vegetables" },
    { name: t("cat.food"), icon: UtensilsCrossed, color: "#F59E0B", bg: "rgba(245,158,11,0.1)", key: "Street Food" },
    { name: t("cat.grocery"), icon: ShoppingBasket, color: "#3B82F6", bg: "rgba(59,130,246,0.1)", key: "Grocery" },
    { name: t("cat.tailoring"), icon: Scissors, color: "#A855F7", bg: "rgba(168,85,247,0.1)", key: "Tailoring" },
    { name: t("cat.repair"), icon: Wrench, color: "#64748B", bg: "rgba(100,116,139,0.1)", key: "Repair" },
    { name: t("cat.cafe"), icon: Coffee, color: "#D97706", bg: "rgba(217,119,6,0.1)", key: "Cafe & Tea" },
    { name: t("cat.clothing"), icon: Shirt, color: "#EC4899", bg: "rgba(236,72,153,0.1)", key: "Clothing" },
    { name: t("cat.pharmacy"), icon: Pill, color: "#14B8A6", bg: "rgba(20,184,166,0.1)", key: "Pharmacy" },
    { name: t("cat.delivery"), icon: Bike, color: "#E23744", bg: "rgba(226,55,68,0.1)", key: "Delivery" },
    { name: t("cat.others"), icon: MoreHorizontal, color: "#6366F1", bg: "rgba(99,102,241,0.1)", key: "Others" },
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
    const { t } = useLanguage();
    const router = useRouter();
    const categories = getCategories(t);
    const { isLoggedIn, isGuest, user, isLoading } = useAuth();
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(0);
    const [shopNameError, setShopNameError] = useState("");
    const [categoryError, setCategoryError] = useState("");
    const [locationLoading, setLocationLoading] = useState(false);
    const [launching, setLaunching] = useState(false);
    const [storePhoto, setStorePhoto] = useState<string | null>(null);
    const [storePhotoName, setStorePhotoName] = useState("");

    // Redirect guests to login first
    useEffect(() => {
        if (!isLoading) {
            if (isGuest) {
                router.replace("/login?redirect=/onboarding");
            }
        }
    }, [isGuest, router, isLoading]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
            </div>
        );
    }
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<{
        shopName: string;
        categories: string[];
        otherCategory: string;
        location: { lat: number; lng: number } | null;
        address: string;
        addressDetails: string;
        language: string;
        phone: string;
        email: string;
        upiId: string;
    }>({
        shopName: "",
        categories: [],
        otherCategory: "",
        location: null,
        address: "",
        addressDetails: "",
        language: "English",
        phone: "",
        email: user?.email || "",
        upiId: "",
    });

    const toggleCategory = (catName: string) => {
        setFormData(prev => {
            const exists = prev.categories.includes(catName);
            return {
                ...prev,
                categories: exists
                    ? prev.categories.filter(c => c !== catName)
                    : [...prev.categories, catName]
            };
        });
        setCategoryError("");
    };

    const nextStep = () => {
        if (step === 1) {
            let hasError = false;
            if (!formData.shopName.trim()) {
                setShopNameError(t("onboarding.shop_error"));
                hasError = true;
            } else {
                setShopNameError("");
            }
            if (formData.categories.length === 0) {
                setCategoryError(t("onboarding.cat_error"));
                hasError = true;
            } else {
                setCategoryError("");
            }
            if (hasError) return;
        }
        setDirection(1);
        setStep(s => Math.min(s + 1, 3));
    };
    const prevStep = () => { setDirection(-1); setStep(s => Math.max(s - 1, 1)); };

    const handleLocation = () => {
        if (locationLoading) return;
        if (navigator.geolocation) {
            setLocationLoading(true);
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setFormData(prev => ({
                        ...prev,
                        location: { lat: latitude, lng: longitude }
                    }));

                    // Reverse geocode
                    try {
                        const res = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                            { headers: { 'Accept-Language': 'en' } }
                        );
                        const data = await res.json();
                        if (data.display_name) {
                            setFormData(prev => ({
                                ...prev,
                                address: data.display_name,
                                location: { lat: latitude, lng: longitude }
                            }));
                        }
                    } catch {
                        setFormData(prev => ({
                            ...prev,
                            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                        }));
                    }
                    setLocationLoading(false);
                },
                () => {
                    setLocationLoading(false);
                    alert(t("onboarding.address_error"));
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        }
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setStorePhotoName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setStorePhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setStorePhoto(null);
        setStorePhotoName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleLaunch = async () => {
        if (!user || launching) return;
        setLaunching(true);

        const supabase = createClient();

        try {
            // 1. Create/Update Shop
            const { data: shop, error: shopError } = await supabase
                .from('shops')
                .upsert({
                    owner_id: user.id,
                    name: formData.shopName,
                    categories: formData.categories,
                    phone: formData.phone,
                    address: formData.address + (formData.addressDetails ? `, ${formData.addressDetails}` : ""),
                    latitude: formData.location?.lat,
                    longitude: formData.location?.lng,
                    logo_url: storePhoto // In a real app, upload this to Supabase Storage first
                }, { onConflict: 'owner_id' })
                .select()
                .single();

            if (shopError) throw shopError;

            // 2. Update User Role to merchant
            const { error: roleError } = await supabase
                .from('profiles')
                .update({ role: 'merchant' })
                .eq('id', user.id);

            if (roleError) throw roleError;

            // 3. Success
            router.push('/dashboard');
        } catch (error: any) {
            console.error("Launch error:", error);
            alert(error.message || "Failed to launch shop. Please try again.");
        } finally {
            setLaunching(false);
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
                            <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">{t("onboarding.step_of", step)}</p>
                            <h1 className="text-sm font-bold text-surface-900 tracking-tight">{t("onboarding.merchant_title")}</h1>
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
                                    <h2 className="text-2xl md:text-3xl font-black text-surface-900 tracking-tight">{t("onboarding.step1_title")}</h2>
                                    <p className="text-sm text-surface-400">{t("onboarding.step1_desc")}</p>
                                </motion.div>

                                {/* Shop Name Input */}
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="space-y-2"
                                >
                                    <label className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider ml-0.5 flex items-center gap-1">
                                        {t("onboarding.shop_name")} <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative group">
                                        <Store className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${shopNameError ? 'text-red-400' : 'text-surface-300 group-focus-within:text-primary'}`} size={18} />
                                        <input
                                            type="text"
                                            placeholder={t("onboarding.shop_placeholder")}
                                            className={`w-full h-12 pl-11 pr-4 rounded-xl bg-surface-50 outline-none font-medium text-sm text-surface-900 placeholder:text-surface-300 transition-all ${shopNameError ? 'ring-2 ring-red-400/40 focus:ring-red-400/60' : 'focus:ring-2 focus:ring-primary/20'}`}
                                            value={formData.shopName}
                                            onChange={(e) => {
                                                setFormData({ ...formData, shopName: e.target.value });
                                                if (e.target.value.trim()) setShopNameError("");
                                            }}
                                        />
                                    </div>
                                    <AnimatePresence>
                                        {shopNameError && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -5, height: 0 }}
                                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                                exit={{ opacity: 0, y: -5, height: 0 }}
                                                className="text-xs text-red-400 font-medium flex items-center gap-1 ml-0.5"
                                            >
                                                <AlertCircle size={12} /> {shopNameError}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Category Grid — Multi-select */}
                                <div className="space-y-3">
                                    <motion.label
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.25 }}
                                        className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider ml-0.5 flex items-center gap-1"
                                    >
                                        {t("onboarding.what_sell")} <span className="text-red-400">*</span>
                                        <span className="text-[10px] font-normal text-surface-300 ml-1">{t("onboarding.select_multiple")}</span>
                                    </motion.label>
                                    <motion.div
                                        variants={staggerGrid}
                                        initial="hidden"
                                        animate="visible"
                                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5"
                                    >
                                        {categories.map(cat => {
                                            const IconComponent = cat.icon;
                                            const isSelected = formData.categories.includes(cat.name);
                                            return (
                                                <motion.button
                                                    key={cat.name}
                                                    variants={gridItem}
                                                    whileHover={{ scale: 1.04, y: -2 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => toggleCategory(cat.key || cat.name)}
                                                    className={`relative p-3.5 rounded-2xl transition-colors group flex flex-col items-center gap-2 ${isSelected
                                                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                                        : 'bg-surface-50 hover:bg-surface-100'
                                                        }`}
                                                >
                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="absolute top-1.5 right-1.5 w-5 h-5 bg-white/25 rounded-full flex items-center justify-center"
                                                        >
                                                            <Check size={11} strokeWidth={3} />
                                                        </motion.div>
                                                    )}
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

                                    {/* Others custom input */}
                                    <AnimatePresence>
                                        {formData.categories.includes("Others") && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pt-2">
                                                    <input
                                                        type="text"
                                                        placeholder={t("onboarding.custom_cat")}
                                                        className="w-full h-11 px-4 rounded-xl bg-surface-50 outline-none font-medium text-sm text-surface-900 placeholder:text-surface-300 focus:ring-2 focus:ring-primary/20 transition-all"
                                                        value={formData.otherCategory}
                                                        onChange={(e) => setFormData({ ...formData, otherCategory: e.target.value })}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Selected count */}
                                    {formData.categories.length > 0 && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-xs text-primary font-medium ml-0.5"
                                        >
                                            {formData.categories.length === 1
                                                ? t("onboarding.cat_selected_single")
                                                : t("onboarding.cat_selected_count", formData.categories.length)}
                                        </motion.p>
                                    )}

                                    <AnimatePresence>
                                        {categoryError && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -5, height: 0 }}
                                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                                exit={{ opacity: 0, y: -5, height: 0 }}
                                                className="text-xs text-red-400 font-medium flex items-center gap-1 ml-0.5"
                                            >
                                                <AlertCircle size={12} /> {categoryError}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
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
                                    <h2 className="text-2xl md:text-3xl font-black text-surface-900 tracking-tight">{t("onboarding.step2_title")}</h2>
                                    <p className="text-sm text-surface-400">{t("onboarding.step2_desc")}</p>
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
                                        disabled={locationLoading}
                                        className={`w-full p-4 rounded-2xl transition-colors relative overflow-hidden group text-left ${formData.location
                                            ? 'bg-primary/10 ring-2 ring-primary/30'
                                            : 'bg-surface-50 hover:bg-surface-100'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${formData.location ? 'bg-primary text-white' : locationLoading ? 'bg-surface-100 text-primary' : 'bg-surface-100 text-surface-400'}`}>
                                                {locationLoading ? (
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    >
                                                        <Loader2 size={20} strokeWidth={2} />
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        animate={formData.location ? { scale: [1, 1.1, 1] } : { y: [0, -2, 0] }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                    >
                                                        <MapPin size={20} strokeWidth={2} />
                                                    </motion.div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-surface-900">
                                                    {locationLoading ? t("onboarding.detecting_loc") : formData.location ? t("onboarding.loc_verified") : t("onboarding.locate")}
                                                </p>
                                                {locationLoading ? (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <motion.div
                                                            className="flex gap-1"
                                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                                            transition={{ duration: 1.5, repeat: Infinity }}
                                                        >
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                                                        </motion.div>
                                                        <p className="text-xs text-primary/70">Syncing GPS...</p>
                                                    </div>
                                                ) : formData.address ? (
                                                    <p className="text-xs mt-0.5 text-primary font-medium truncate">{formData.address}</p>
                                                ) : formData.location ? (
                                                    <p className="text-xs mt-0.5 text-primary font-medium">{t("onboarding.gps_locked")}</p>
                                                ) : (
                                                    <p className="text-xs mt-0.5 text-surface-400">{t("onboarding.loc_sync")}</p>
                                                )}
                                            </div>
                                            {!formData.location && !locationLoading && (
                                                <motion.div animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                                    <ChevronRight size={16} className="text-surface-300" />
                                                </motion.div>
                                            )}
                                            {formData.location && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 400 }}
                                                    className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0"
                                                >
                                                    <Check size={14} className="text-white" strokeWidth={3} />
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.button>

                                    {/* Display address if available */}
                                    <AnimatePresence>
                                        {formData.address && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="bg-surface-50 rounded-xl p-4 space-y-3">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider">{t("onboarding.address_detected")}</label>
                                                        <p className="text-sm text-surface-700 leading-relaxed">{formData.address}</p>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider">{t("onboarding.address_extra")}</label>
                                                        <input
                                                            type="text"
                                                            placeholder={t("onboarding.address_placeholder")}
                                                            className="w-full h-10 px-3 rounded-lg bg-white dark:bg-surface-100 outline-none font-medium text-sm text-surface-900 placeholder:text-surface-300 focus:ring-2 focus:ring-primary/20 transition-all"
                                                            value={formData.addressDetails}
                                                            onChange={(e) => setFormData({ ...formData, addressDetails: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Photo Upload — Working */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handlePhotoUpload}
                                        />

                                        {storePhoto ? (
                                            <div className="relative rounded-2xl overflow-hidden group">
                                                <img
                                                    src={storePhoto}
                                                    alt="Store preview"
                                                    className="w-full aspect-[16/10] object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                                                    <div>
                                                        <p className="text-white text-sm font-semibold flex items-center gap-1.5">
                                                            <Check size={14} className="text-green-400" /> {t("onboarding.photo_success")}
                                                        </p>
                                                        <p className="text-white/60 text-xs mt-0.5 truncate max-w-[200px]">{storePhotoName}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => fileInputRef.current?.click()}
                                                            className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                                                        >
                                                            <Camera size={16} />
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={removePhoto}
                                                            className="w-9 h-9 bg-red-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-red-300 hover:bg-red-500/30 transition-colors"
                                                        >
                                                            <X size={16} />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <motion.div
                                                whileHover={{ scale: 1.01 }}
                                                onClick={() => fileInputRef.current?.click()}
                                                className="relative group overflow-hidden rounded-2xl bg-surface-50 hover:bg-surface-100 aspect-[16/10] flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer border-2 border-dashed border-surface-200 hover:border-primary/30"
                                            >
                                                <motion.div
                                                    animate={{ y: [0, -4, 0] }}
                                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                                    className="w-12 h-12 bg-surface-100 group-hover:bg-surface-200 rounded-xl flex items-center justify-center text-surface-400 group-hover:text-surface-500 transition-colors"
                                                >
                                                    <Camera size={22} />
                                                </motion.div>
                                                <div className="text-center space-y-0.5">
                                                    <p className="font-semibold text-sm text-surface-900">{t("onboarding.photo")}</p>
                                                    <p className="text-xs text-surface-400">{t("onboarding.upload_desc")}</p>
                                                </div>
                                                <div className="flex gap-2 mt-1">
                                                    <span className="text-[10px] text-surface-300 flex items-center gap-1"><ImageIcon size={10} /> JPG, PNG, WEBP</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Contact & Final Settings */}
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
                                    <h2 className="text-2xl md:text-3xl font-black text-surface-900 tracking-tight">{t("onboarding.step3_title")}</h2>
                                    <p className="text-sm text-surface-400">{t("onboarding.step3_desc")}</p>
                                </motion.div>

                                <div className="space-y-4">
                                    {/* Phone Number */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 }}
                                        className="space-y-2"
                                    >
                                        <label className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider ml-0.5 flex items-center gap-1">
                                            {t("onboarding.phone")} <span className="text-red-400">*</span>
                                        </label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300 group-focus-within:text-primary transition-colors" size={18} />
                                            <input
                                                type="tel"
                                                placeholder="+91 98765 43210"
                                                className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-50 outline-none font-medium text-sm text-surface-900 placeholder:text-surface-300 focus:ring-2 focus:ring-primary/20 transition-all"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Email */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.25 }}
                                        className="space-y-2"
                                    >
                                        <label className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider ml-0.5">
                                            {t("onboarding.email")}
                                        </label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300 group-focus-within:text-primary transition-colors" size={18} />
                                            <input
                                                type="email"
                                                placeholder="yourshop@email.com"
                                                className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-50 outline-none font-medium text-sm text-surface-900 placeholder:text-surface-300 focus:ring-2 focus:ring-primary/20 transition-all"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </motion.div>

                                    {/* UPI ID */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.35 }}
                                        className="space-y-2"
                                    >
                                        <label className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider ml-0.5">
                                            {t("onboarding.upi")} <span className="text-[10px] font-normal text-surface-300">{t("onboarding.upi_desc")}</span>
                                        </label>
                                        <div className="relative group">
                                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300 group-focus-within:text-primary transition-colors" size={18} />
                                            <input
                                                type="text"
                                                placeholder="yourname@upi"
                                                className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-50 outline-none font-medium text-sm text-surface-900 placeholder:text-surface-300 focus:ring-2 focus:ring-primary/20 transition-all"
                                                value={formData.upiId}
                                                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Language Selector */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.45 }}
                                        className="space-y-2"
                                    >
                                        <label className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider ml-0.5">{t("onboarding.pref_lang")}</label>
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
                                        transition={{ delay: 0.55, type: "spring", stiffness: 200, damping: 20 }}
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
                                                <h4 className="font-semibold text-sm text-surface-900">{t("onboarding.almost_there")}</h4>
                                                <p className="text-sm text-surface-400 leading-relaxed">{t("onboarding.almost_desc")}</p>
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
                        onClick={step === 3 ? handleLaunch : nextStep}
                        disabled={launching}
                        className="flex-1 bg-primary hover:bg-primary-dark text-white h-12 rounded-xl text-sm font-semibold tracking-wide flex items-center justify-center gap-2 group transition-colors shadow-lg shadow-primary/20 disabled:opacity-70"
                    >
                        {launching ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <>
                                <span>{step === 3 ? t("onboarding.launch") : t("onboarding.next_step")}</span>
                                <motion.div
                                    animate={{ x: [0, 3, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <ChevronRight size={16} strokeWidth={2.5} />
                                </motion.div>
                            </>
                        )}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}

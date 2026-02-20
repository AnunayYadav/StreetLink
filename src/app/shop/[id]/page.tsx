"use client";

import { useState, useEffect, useCallback } from "react";
import {
    ArrowLeft,
    ShoppingCart,
    Phone,
    MessageCircle,
    Star,
    MapPin,
    Plus,
    Minus,
    ChevronRight,
    Share2,
    Heart,
    Info,
    Loader2,
    Store
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/context/language-context";
import { createClient } from "@/lib/supabase/client";

export default function ShopView() {
    const { t } = useLanguage();
    const params = useParams();
    const [shop, setShop] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cart, setCart] = useState<Record<string, number>>({});
    const [isLiked, setIsLiked] = useState(false);
    const supabase = createClient();

    const fetchShopData = useCallback(async () => {
        setIsLoading(true);
        const { id } = params;

        // Fetch Shop
        const { data: shopData, error: shopError } = await supabase
            .from('shops')
            .select('*')
            .eq('id', id)
            .single();

        if (!shopError && shopData) {
            setShop(shopData);

            // Fetch Products
            const { data: productData, error: productError } = await supabase
                .from('products')
                .select('*')
                .eq('shop_id', id)
                .is('is_available', true);

            if (!productError && productData) {
                setProducts(productData);
            }
        }
        setIsLoading(false);
    }, [params, supabase]);

    useEffect(() => {
        fetchShopData();
    }, [fetchShopData]);

    const addToCart = (id: string) => {
        setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const removeFromCart = (id: string) => {
        if (!cart[id]) return;
        const newCart = { ...cart };
        if (newCart[id] === 1) delete newCart[id];
        else newCart[id] -= 1;
        setCart(newCart);
    };

    const cartTotalCount = Object.values(cart).reduce((a, b) => a + b, 0);
    const cartTotalPrice = Object.entries(cart).reduce((total, [id, qty]) => {
        const product = products.find((p: any) => p.id === id);
        return total + (product?.price || 0) * qty;
    }, 0);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
                <p className="text-sm font-bold text-surface-400 uppercase tracking-widest italic">{t("shop.loading") || "Synchronizing Marketplace..."}</p>
            </div>
        );
    }

    if (!shop) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-surface-50 rounded-3xl flex items-center justify-center text-surface-200 mb-6">
                    <Store size={40} />
                </div>
                <h1 className="text-2xl font-black text-surface-900 mb-2">Shop Not Found</h1>
                <p className="text-surface-400 max-w-xs mb-8">The shop you are looking for might have moved or is temporarily offline.</p>
                <Link href="/search" className="bg-primary text-white h-12 px-8 rounded-xl font-bold flex items-center gap-2">
                    <ArrowLeft size={18} /> Back to Market
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-50 pb-40">
            {/* Immersive Header */}
            <div className="relative h-[450px] md:h-[600px] overflow-hidden">
                <img
                    src={shop.logo_url || "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800"}
                    alt={shop.name}
                    className="w-full h-full object-cover scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/20 to-transparent" />

                <div className="absolute top-10 left-0 w-full z-20">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                        <Link href="/search" className="w-14 h-14 bg-white/10 backdrop-blur-2xl text-white rounded-2xl flex items-center justify-center border border-white/20 hover:bg-white/20 active:scale-95 transition-all">
                            <ArrowLeft size={28} />
                        </Link>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className="w-14 h-14 bg-white/10 backdrop-blur-2xl text-white rounded-2xl flex items-center justify-center border border-white/20 hover:bg-white/20 active:scale-95 transition-all shadow-xl"
                            >
                                <Heart size={28} fill={isLiked ? "var(--primary)" : "none"} className={isLiked ? "text-primary border-none" : ""} />
                            </button>
                            <button className="w-14 h-14 bg-white/10 backdrop-blur-2xl text-white rounded-2xl flex items-center justify-center border border-white/20 hover:bg-white/20 active:scale-95 transition-all shadow-xl">
                                <Share2 size={28} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-20 left-0 w-full text-white">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="px-5 py-2 bg-primary text-[11px] font-black rounded-xl uppercase tracking-[0.2em] shadow-accent">
                                {shop.is_verified ? t("shop.verified") : "Local Vendor"}
                            </span>
                        </div>
                        <div className="max-w-3xl">
                            <h1 className="text-5xl md:text-7xl font-black mb-3 tracking-tighter leading-none">{shop.name}</h1>
                            <div className="flex items-center gap-6 text-white/60 text-lg font-bold">
                                <p className="flex items-center gap-2">
                                    <MapPin size={24} className="text-primary shrink-0" />
                                    {shop.address || "Area Merchant"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shop Interaction Cards */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-16 md:-mt-24 relative z-10 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <a href={`tel:${shop.phone || ''}`} className="glass-card p-8 flex flex-col gap-4 group hover:border-primary/20 transition-all border border-border-subtle shadow-premium">
                    <div className="w-14 h-14 glass text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner border border-primary/10">
                        <Phone size={28} strokeWidth={3} />
                    </div>
                    <div>
                        <p className="font-black text-[11px] uppercase tracking-[0.2em] text-surface-900 group-hover:text-primary transition-colors">{t("shop.call")}</p>
                        <p className="text-[10px] font-bold text-muted mt-1 uppercase tracking-widest italic">{shop.phone || t("shop.instant_support")}</p>
                    </div>
                </a>
                <a href={`https://wa.me/${shop.phone?.replace('+', '').replace(' ', '') || ''}`} className="glass-card p-8 flex flex-col gap-4 group hover:border-emerald-500/20 transition-all border border-border-subtle shadow-premium">
                    <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner border border-emerald-500/10">
                        <MessageCircle size={28} strokeWidth={3} />
                    </div>
                    <div>
                        <p className="font-black text-[11px] uppercase tracking-[0.2em] text-surface-900 group-hover:text-emerald-500 transition-colors">{t("shop.chat")}</p>
                        <p className="text-[10px] font-bold text-muted mt-1 uppercase tracking-widest italic">{t("shop.quick_response")}</p>
                    </div>
                </a>

                <div className="lg:col-span-2 glass-card p-8 text-foreground flex items-center justify-around shadow-premium relative overflow-hidden border border-border-subtle">
                    <div className="absolute left-0 top-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,var(--primary),transparent)] opacity-5" />
                    <div className="text-center relative z-10">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">{t("shop.rating")}</p>
                        <p className="text-3xl font-black flex items-center gap-2 justify-center text-surface-900">
                            <Star size={24} fill="var(--primary)" strokeWidth={0} /> 4.5
                        </p>
                    </div>
                    <div className="w-px h-12 bg-border-subtle" />
                    <div className="text-center relative z-10">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">{t("shop.happy_souls")}</p>
                        <p className="text-3xl font-black text-surface-900">20+</p>
                    </div>
                    <div className="w-px h-12 bg-border-subtle" />
                    <div className="text-center relative z-10">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">{t("shop.service")}</p>
                        <p className="text-3xl font-black italic text-surface-900">{t("shop.free")}</p>
                    </div>
                </div>
            </div>

            {/* Product List */}
            <main className="max-w-7xl mx-auto px-6 md:px-12 py-20 space-y-12">
                <div className="flex items-center justify-between border-b-2 border-border-subtle pb-8">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black text-surface-900 tracking-tighter uppercase">{t("shop.produce_title")}</h2>
                        <p className="text-base font-bold text-muted italic mt-2">{t("shop.produce_desc")}</p>
                    </div>
                    <button className="hidden md:flex w-16 h-16 bg-card-bg rounded-3xl items-center justify-center shadow-premium hover:border-primary/20 transition-all">
                        <Info size={28} className="text-surface-300" />
                    </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.length > 0 ? products.map((product: any) => (
                        <motion.div
                            key={product.id}
                            layout
                            className="card-premium p-6 flex flex-col gap-6 bg-card-bg border-2 border-transparent hover:border-primary/10 transition-all duration-500 group overflow-hidden"
                        >
                            <div className="w-full h-56 rounded-[32px] overflow-hidden bg-surface-50 shadow-inner group-hover:rotate-2 transition-transform duration-700">
                                <img
                                    src={product.image_url || "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=400"}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="flex-1 flex flex-col pt-2">
                                <div className="space-y-1 mb-6">
                                    <h4 className="font-black text-surface-900 text-2xl tracking-tighter leading-tight group-hover:text-primary transition-colors">{product.name}</h4>
                                    <p className="text-[11px] font-black text-muted uppercase tracking-[0.2em] italic">Fresh Stock / {product.category || 'Unit'}</p>
                                </div>

                                <div className="mt-auto flex justify-between items-center bg-surface-50 p-4 rounded-3xl shadow-inner border border-border-subtle">
                                    <span className="text-3xl font-black text-surface-900 tracking-tighter">₹{product.price}</span>

                                    <AnimatePresence mode="wait">
                                        {!cart[product.id] ? (
                                            <motion.button
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                onClick={() => addToCart(product.id)}
                                                className="h-12 w-12 bg-primary text-white rounded-2xl shadow-accent active:scale-90 transition-all flex items-center justify-center"
                                            >
                                                <Plus size={24} strokeWidth={3} />
                                            </motion.button>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="flex items-center gap-4 bg-card-bg rounded-2xl p-1 shadow-premium border border-border-subtle"
                                            >
                                                <button
                                                    onClick={() => removeFromCart(product.id)}
                                                    className="w-10 h-10 rounded-xl bg-surface-50 flex items-center justify-center text-primary hover:bg-primary-soft transition-colors"
                                                >
                                                    <Minus size={18} strokeWidth={3} />
                                                </button>
                                                <span className="text-base font-black text-surface-900 w-4 text-center">{cart[product.id]}</span>
                                                <button
                                                    onClick={() => addToCart(product.id)}
                                                    className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-accent transition-colors"
                                                >
                                                    <Plus size={18} strokeWidth={3} />
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-6 bg-card-bg rounded-[32px] border-2 border-dashed border-border-subtle shadow-inner">
                            <div className="w-24 h-24 bg-surface-50 rounded-full flex items-center justify-center text-surface-200">
                                <ShoppingCart size={48} />
                            </div>
                            <div className="space-y-2 px-6">
                                <p className="text-2xl font-black text-surface-900 tracking-tight">{t("shop.empty")}</p>
                                <p className="text-sm font-bold text-muted italic">{t("shop.empty_desc")}</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Bottom Checkout Sheet */}
            <AnimatePresence>
                {cartTotalCount > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-32 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-7xl z-50 pointer-events-none"
                    >
                        <div className="mx-auto max-w-2xl bg-contrast-bg p-6 rounded-[32px] shadow-2xl flex justify-between items-center ring-4 ring-primary/10 backdrop-blur-2xl pointer-events-auto">
                            <div className="flex items-center gap-6">
                                <div className="bg-primary p-4 rounded-2xl text-white shadow-accent shrink-0">
                                    <ShoppingCart size={28} strokeWidth={3} />
                                </div>
                                <div>
                                    <p className="font-black text-contrast-text text-2xl tracking-tighter leading-none">{t("shop.items_count", cartTotalCount)}</p>
                                    <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mt-2">{t("shop.total", cartTotalPrice.toLocaleString())}</p>
                                </div>
                            </div>
                            <Link
                                href="/checkout"
                                className="bg-primary hover:bg-primary-dark text-white px-10 h-16 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-accent flex items-center gap-4 group transition-all"
                            >
                                {t("shop.checkout")}
                                <ChevronRight size={20} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

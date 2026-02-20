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
            {/* Immersive Header */}
            <div className="relative h-[500px] md:h-[650px] overflow-hidden">
                <motion.img
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1.05 }}
                    transition={{ duration: 10, ease: "easeOut" }}
                    src={shop.logo_url || "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800"}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/40 to-transparent" />
                <div className="absolute inset-0 bg-black/10" />

                <div className="absolute top-10 left-0 w-full z-20">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link href="/search" className="w-12 h-12 bg-white/10 backdrop-blur-md text-white rounded-2xl flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all shadow-lg">
                                <ArrowLeft size={24} />
                            </Link>
                        </motion.div>
                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsLiked(!isLiked)}
                                className="w-12 h-12 bg-white/10 backdrop-blur-md text-white rounded-2xl flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all shadow-lg"
                            >
                                <Heart size={24} fill={isLiked ? "var(--primary)" : "none"} className={isLiked ? "text-primary border-none" : ""} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-12 h-12 bg-white/10 backdrop-blur-md text-white rounded-2xl flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all shadow-lg"
                            >
                                <Share2 size={24} />
                            </motion.button>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-24 left-0 w-full text-white">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-2">
                                <span className="px-4 py-1.5 bg-primary/20 backdrop-blur-md text-primary border border-primary/30 text-[10px] font-black rounded-lg uppercase tracking-[0.2em]">
                                    {shop.is_verified ? t("shop.verified") : "Verified Vendor"}
                                </span>
                            </div>
                            <div className="max-w-4xl">
                                <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tight leading-[0.9] drop-shadow-2xl">{shop.name}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-white/80 text-lg md:text-xl font-medium">
                                    <p className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                                        <MapPin size={20} className="text-primary" />
                                        {shop.address || "Local Merchant"}
                                    </p>
                                    <p className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 italic">
                                        <Info size={20} className="text-primary/70" />
                                        {shop.categories?.join(", ") || "Fresh Collective"}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Shop Interaction Cards */}
            {/* Shop Interaction Cards */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-12 md:-mt-20 relative z-10 grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <motion.a
                    whileHover={{ y: -5 }}
                    href={`tel:${shop.phone || ''}`}
                    className="bg-background/80 backdrop-blur-2xl p-6 rounded-3xl flex flex-col gap-4 group transition-all border border-surface-200/50 shadow-2xl shadow-surface-900/5"
                >
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner border border-primary/10">
                        <Phone size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="font-bold text-[11px] uppercase tracking-[0.15em] text-surface-400 group-hover:text-primary transition-colors">{t("shop.call")}</p>
                        <p className="text-sm font-black text-surface-900 mt-1">{shop.phone || "Connect Instantly"}</p>
                    </div>
                </motion.a>

                <motion.a
                    whileHover={{ y: -5 }}
                    href={`https://wa.me/${shop.phone?.replace('+', '').replace(' ', '') || ''}`}
                    className="bg-background/80 backdrop-blur-2xl p-6 rounded-3xl flex flex-col gap-4 group transition-all border border-surface-200/50 shadow-2xl shadow-surface-900/5"
                >
                    <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner border border-emerald-500/10">
                        <MessageCircle size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="font-bold text-[11px] uppercase tracking-[0.15em] text-surface-400 group-hover:text-emerald-500 transition-colors">{t("shop.chat")}</p>
                        <p className="text-sm font-black text-surface-900 mt-1">{t("shop.quick_response")}</p>
                    </div>
                </motion.a>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 bg-background/80 backdrop-blur-2xl p-6 rounded-3xl text-foreground flex items-center justify-around shadow-2xl shadow-surface-900/5 border border-surface-200/50"
                >
                    <div className="text-center">
                        <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-1">{t("shop.rating")}</p>
                        <p className="text-2xl font-black flex items-center gap-1.5 justify-center text-surface-900">
                            <Star size={20} fill="var(--primary)" className="text-primary" strokeWidth={0} /> 4.5
                        </p>
                    </div>
                    <div className="w-px h-10 bg-surface-100" />
                    <div className="text-center">
                        <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-1">{t("shop.happy_souls")}</p>
                        <p className="text-2xl font-black text-surface-900">20+</p>
                    </div>
                    <div className="w-px h-10 bg-surface-100" />
                    <div className="text-center">
                        <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-1">{t("shop.service")}</p>
                        <p className="text-2xl font-black italic text-surface-900">{t("shop.free")}</p>
                    </div>
                </motion.div>
            </div>

            {/* Product List */}
            <main className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-end justify-between border-b border-surface-200 pb-8"
                >
                    <div>
                        <h2 className="text-4xl md:text-6xl font-black text-surface-900 tracking-tight">{t("shop.produce_title") || "Fresh Catalog"}</h2>
                        <p className="text-lg font-medium text-surface-400 mt-2">{t("shop.produce_desc") || "Handpicked quality items from your local vendor."}</p>
                    </div>
                    <button className="hidden md:flex w-12 h-12 bg-surface-100 rounded-2xl items-center justify-center hover:bg-surface-200 transition-all">
                        <Info size={24} className="text-surface-400" />
                    </button>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {products.length > 0 ? products.map((product: any, i: number) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-background rounded-[40px] p-4 flex flex-col gap-5 border border-surface-100 hover:border-primary/20 transition-all duration-500 group shadow-xl shadow-surface-900/5"
                        >
                            <div className="w-full aspect-square rounded-[32px] overflow-hidden bg-surface-50 relative">
                                <img
                                    src={product.image_url || "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=400"}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                {!product.is_available && (
                                    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                                        <span className="px-4 py-2 bg-surface-900 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">Out of Stock</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 flex flex-col px-2 pb-2">
                                <div className="space-y-1 mb-6">
                                    <h4 className="font-bold text-surface-900 text-xl tracking-tight leading-tight group-hover:text-primary transition-colors">{product.name}</h4>
                                    <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">{product.category || 'Standard Unit'}</p>
                                </div>

                                <div className="mt-auto flex justify-between items-center bg-surface-50 p-3 rounded-2xl border border-surface-100/50">
                                    <div>
                                        <p className="text-[9px] font-black text-surface-400 uppercase tracking-widest mb-0.5">Price</p>
                                        <span className="text-2xl font-black text-surface-900 tracking-tight">₹{product.price}</span>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {!cart[product.id] ? (
                                            <motion.button
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.8, opacity: 0 }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => addToCart(product.id)}
                                                className="h-11 w-11 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center hover:bg-primary-dark transition-colors"
                                            >
                                                <Plus size={20} strokeWidth={3} />
                                            </motion.button>
                                        ) : (
                                            <motion.div
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="flex items-center gap-3 bg-white rounded-xl p-1 shadow-md border border-surface-100"
                                            >
                                                <button
                                                    onClick={() => removeFromCart(product.id)}
                                                    className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
                                                >
                                                    <Minus size={16} strokeWidth={3} />
                                                </button>
                                                <span className="text-sm font-black text-surface-900 w-4 text-center">{cart[product.id]}</span>
                                                <button
                                                    onClick={() => addToCart(product.id)}
                                                    className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-md hover:bg-primary-dark transition-colors"
                                                >
                                                    <Plus size={16} strokeWidth={3} />
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
                        className="fixed bottom-32 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg z-50 pointer-events-none"
                    >
                        <div className="mx-auto bg-surface-950 p-4 rounded-[32px] shadow-2xl flex justify-between items-center border border-white/10 backdrop-blur-3xl pointer-events-auto">
                            <div className="flex items-center gap-4 pl-2">
                                <div className="w-12 h-12 bg-primary rounded-2xl text-white shadow-lg shadow-primary/20 flex items-center justify-center shrink-0">
                                    <ShoppingCart size={24} strokeWidth={3} />
                                </div>
                                <div>
                                    <p className="font-black text-white text-lg tracking-tight leading-none">{cartTotalCount} {cartTotalCount === 1 ? 'Item' : 'Items'}</p>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1.5">Total: ₹{cartTotalPrice.toLocaleString()}</p>
                                </div>
                            </div>
                            <Link
                                href="/checkout"
                                className="bg-primary hover:bg-primary-dark text-white px-8 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-3 transition-all"
                            >
                                {t("shop.checkout") || "Checkout"}
                                <ArrowLeft size={16} strokeWidth={3} className="rotate-180" />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

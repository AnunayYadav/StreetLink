"use client";

import { useState } from "react";
import {
    ArrowLeft,
    Plus,
    Trash2,
    Camera,
    X,
    LayoutGrid,
    ChevronRight,
    TrendingUp,
    CircleCheck,
    Package
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_PRODUCTS: any[] = [];

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
    })
};

export default function ProductManagement() {
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [isAdding, setIsAdding] = useState(false);
    const [activeFilter, setActiveFilter] = useState("all");
    const [newProduct, setNewProduct] = useState({ name: "", price: "", unit: "kg" });

    const addProduct = () => {
        if (!newProduct.name || !newProduct.price) return;
        const item = {
            id: Date.now().toString(),
            ...newProduct,
            price: Number(newProduct.price),
            isAvailable: true,
            image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=200"
        };
        setProducts([item, ...products]);
        setIsAdding(false);
        setNewProduct({ name: "", price: "", unit: "kg" });
    };

    const deleteProduct = (id: string) => {
        setProducts(products.filter(p => p.id !== id));
    };

    const toggleAvailability = (id: string) => {
        setProducts(products.map(p => p.id === id ? { ...p, isAvailable: !p.isAvailable } : p));
    };

    const filters = [
        { key: "all", label: "All Items" },
        { key: "live", label: "Live" },
        { key: "draft", label: "Draft" },
    ];

    const filteredProducts = products.filter(p => {
        if (activeFilter === "live") return p.isAvailable;
        if (activeFilter === "draft") return !p.isAvailable;
        return true;
    });

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="sticky top-0 bg-background/90 backdrop-blur-xl z-30"
            >
                <div className="max-w-3xl mx-auto px-5 md:px-8 pt-6 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <motion.div whileHover={{ x: -2 }} whileTap={{ scale: 0.9 }}>
                            <Link href="/dashboard" className="w-10 h-10 bg-surface-50 text-surface-500 rounded-xl flex items-center justify-center hover:text-surface-900 transition-colors">
                                <ArrowLeft size={18} />
                            </Link>
                        </motion.div>
                        <div>
                            <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">Inventory</p>
                            <h1 className="text-sm font-bold text-surface-900 tracking-tight">My Catalog</h1>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsAdding(true)}
                        className="h-10 px-4 bg-primary text-white rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                    >
                        <Plus size={16} strokeWidth={2.5} />
                        <span className="text-xs font-semibold hidden sm:inline">Add Item</span>
                    </motion.button>
                </div>
            </motion.header>

            <main className="w-full pt-2">
                <div className="max-w-3xl mx-auto px-5 md:px-8 space-y-5">

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { icon: Package, val: products.length, label: "Total Items", color: "bg-primary/10 text-primary" },
                            { icon: CircleCheck, val: products.filter(p => p.isAvailable).length, label: "Live", color: "bg-emerald-500/10 text-emerald-500" },
                            { icon: TrendingUp, val: "0%", label: "Growth", color: "bg-amber-500/10 text-amber-500" },
                        ].map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={stat.label}
                                    custom={i}
                                    variants={fadeUp}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover={{ y: -2 }}
                                    className="bg-surface-50 rounded-2xl p-4"
                                >
                                    <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center mb-2`}>
                                        <Icon size={16} />
                                    </div>
                                    <p className="text-2xl font-bold text-surface-900 tracking-tight">{stat.val}</p>
                                    <p className="text-[10px] text-surface-400 mt-0.5">{stat.label}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Filter Tabs */}
                    <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="flex gap-1.5 bg-surface-50 p-1 rounded-xl">
                        {filters.map(f => (
                            <button
                                key={f.key}
                                onClick={() => setActiveFilter(f.key)}
                                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all relative ${activeFilter === f.key
                                    ? 'text-surface-900 shadow-sm'
                                    : 'text-surface-400 hover:text-surface-500'
                                    }`}
                            >
                                {activeFilter === f.key && (
                                    <motion.div
                                        layoutId="activeFilter"
                                        className="absolute inset-0 bg-background rounded-lg shadow-sm"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{f.label}</span>
                            </button>
                        ))}
                    </motion.div>

                    {/* Product List */}
                    <div className="space-y-3">
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.length > 0 ? filteredProducts.map((product, i) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, x: -30, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 30, scale: 0.95 }}
                                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    whileHover={{ x: 3 }}
                                    className={`bg-surface-50 rounded-2xl p-3 flex gap-3 items-center ${!product.isAvailable ? 'opacity-50' : ''}`}
                                >
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-100 shrink-0">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-sm text-surface-900 truncate">{product.name}</h4>
                                        <p className="text-primary font-bold text-sm mt-0.5">₹{product.price} <span className="text-xs text-surface-400 font-normal">/ {product.unit}</span></p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => toggleAvailability(product.id)}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors ${product.isAvailable
                                                ? 'bg-emerald-500/10 text-emerald-600'
                                                : 'bg-surface-100 text-surface-400'
                                                }`}
                                        >
                                            {product.isAvailable ? 'Live' : 'Draft'}
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.85 }}
                                            onClick={() => deleteProduct(product.id)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3, type: "spring" }}
                                    className="py-16 flex flex-col items-center justify-center text-center"
                                >
                                    <motion.div
                                        animate={{ rotate: [0, 5, -5, 0], y: [0, -4, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        className="w-14 h-14 bg-surface-50 rounded-2xl flex items-center justify-center text-surface-300 mb-4"
                                    >
                                        <LayoutGrid size={24} />
                                    </motion.div>
                                    <p className="font-semibold text-surface-900 mb-1">No products yet</p>
                                    <p className="text-sm text-surface-400 max-w-xs">Add your first product to start selling to customers in your area.</p>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setIsAdding(true)}
                                        className="mt-4 h-10 px-5 bg-primary text-white rounded-xl flex items-center justify-center gap-2 text-sm font-medium shadow-lg shadow-primary/20"
                                    >
                                        <Plus size={16} /> Add First Product
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Add Product Sheet */}
            <AnimatePresence>
                {isAdding && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAdding(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 28, stiffness: 200 }}
                            className="fixed bottom-0 left-0 w-full bg-background rounded-t-2xl shadow-2xl z-50"
                        >
                            <div className="max-w-lg mx-auto p-5 pb-8">
                                <div className="w-10 h-1 bg-surface-200 rounded-full mx-auto mb-5" />
                                <div className="flex justify-between items-center mb-5">
                                    <div>
                                        <h3 className="font-bold text-lg text-surface-900">New Product</h3>
                                        <p className="text-xs text-surface-400">Add to your catalog</p>
                                    </div>
                                    <motion.button whileTap={{ scale: 0.85, rotate: 90 }} onClick={() => setIsAdding(false)} className="w-8 h-8 bg-surface-50 rounded-lg flex items-center justify-center text-surface-400">
                                        <X size={16} />
                                    </motion.button>
                                </div>

                                <div className="space-y-4">
                                    {/* Photo Upload */}
                                    <motion.div
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        className="aspect-[2/1] w-full rounded-xl bg-surface-50 flex flex-col items-center justify-center group hover:bg-surface-100 transition-colors cursor-pointer"
                                    >
                                        <motion.div
                                            animate={{ y: [0, -3, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="w-10 h-10 bg-surface-100 group-hover:bg-surface-200 rounded-lg text-surface-400 flex items-center justify-center mb-2 transition-colors"
                                        >
                                            <Camera size={20} />
                                        </motion.div>
                                        <span className="text-xs text-surface-400 font-medium">Tap to add photo</span>
                                    </motion.div>

                                    {/* Input Fields */}
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            placeholder="Product name"
                                            className="w-full h-12 px-4 rounded-xl bg-surface-50 outline-none font-medium text-sm text-surface-900 placeholder:text-surface-300 focus:ring-2 focus:ring-primary/20 transition-all"
                                            value={newProduct.name}
                                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        />
                                        <div className="flex gap-3">
                                            <input
                                                type="number"
                                                placeholder="Price (₹)"
                                                className="flex-1 h-12 px-4 rounded-xl bg-surface-50 outline-none font-medium text-sm text-surface-900 placeholder:text-surface-300 focus:ring-2 focus:ring-primary/20 transition-all"
                                                value={newProduct.price}
                                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                            />
                                            <select
                                                className="w-28 h-12 px-3 rounded-xl bg-surface-50 outline-none font-medium text-sm text-surface-900 appearance-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                value={newProduct.unit}
                                                onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                                            >
                                                <option>kg</option>
                                                <option>piece</option>
                                                <option>500g</option>
                                                <option>dozen</option>
                                                <option>plate</option>
                                                <option>litre</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Publish Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={addProduct}
                                        className="w-full bg-primary hover:bg-primary-dark text-white h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                    >
                                        Add to Catalog
                                        <ChevronRight size={16} strokeWidth={2.5} />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Bottom Save Bar */}
            <AnimatePresence>
                {products.length > 0 && (
                    <motion.div
                        initial={{ y: 80 }}
                        animate={{ y: 0 }}
                        exit={{ y: 80 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 w-full p-4 bg-background/90 backdrop-blur-xl z-30"
                    >
                        <div className="max-w-3xl mx-auto">
                            <motion.div whileTap={{ scale: 0.98 }}>
                                <Link href="/dashboard" className="flex w-full bg-primary hover:bg-primary-dark text-white h-12 rounded-xl text-sm font-semibold tracking-wide items-center justify-center gap-2 shadow-lg shadow-primary/20">
                                    Save & Finish
                                    <ChevronRight size={16} />
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

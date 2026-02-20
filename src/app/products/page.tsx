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
    Tag,
    CircleCheck,
    CircleAlert
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_PRODUCTS: any[] = [];

export default function ProductManagement() {
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [isAdding, setIsAdding] = useState(false);
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

    return (
        <div className="min-h-screen bg-surface-50 pb-40">
            <header className="sticky top-0 bg-surface-50/80 backdrop-blur-md z-30 border-b border-border-subtle">
                <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-6 flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="w-12 h-12 bg-card-bg text-surface-900 rounded-2xl flex items-center justify-center shadow-premium border border-border-subtle hover:border-primary/30 active:scale-95 transition-all">
                            <ArrowLeft size={24} />
                        </Link>
                        <div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] opacity-80 italic">Inventory Management</p>
                            <h1 className="text-2xl font-black text-surface-900 tracking-tighter uppercase">My Catalog</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="hidden md:flex items-center gap-2 px-6 h-12 bg-surface-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-premium active:scale-95 transition-all">
                            <Tag size={16} className="text-primary" />
                            Categories
                        </button>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="h-12 px-6 md:px-8 bg-primary text-white rounded-2xl flex items-center justify-center gap-3 shadow-accent active:scale-95 transition-all"
                        >
                            <Plus size={24} strokeWidth={3} />
                            <span className="hidden sm:inline font-black text-xs uppercase tracking-widest">Add Item</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="w-full pt-10">
                <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
                    <div className="grid lg:grid-cols-12 gap-10 items-start">
                        {/* Summary Column */}
                        <div className="lg:col-span-3 space-y-8">
                            <div className="p-8 glass-card text-foreground relative overflow-hidden group shadow-elevated rounded-[32px] border border-border-subtle">
                                <div className="absolute right-0 top-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                                <div className="relative z-10 space-y-8">
                                    <div className="w-14 h-14 glass text-primary rounded-2xl flex items-center justify-center border border-primary/20 shadow-accent">
                                        <TrendingUp size={28} />
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Catalog Health</h4>
                                        <div className="space-y-2">
                                            <p className="text-5xl font-black text-surface-900 tracking-tighter">{products.length}</p>
                                            <p className="text-[10px] font-black text-muted uppercase tracking-widest italic leading-relaxed">Active high-performance listings</p>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-border-subtle">
                                        <p className="text-[10px] font-black text-muted uppercase tracking-widest italic leading-none">Catalog status: Synchronized</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 px-2">
                                <h3 className="text-[10px] font-black text-surface-400 uppercase tracking-[0.3em]">Catalog Filters</h3>
                                <div className="space-y-3">
                                    {["In Stock", "Out of Stock", "Featured"].map(filter => (
                                        <button key={filter} className="w-full flex items-center justify-between p-4 rounded-xl bg-card-bg border border-border-subtle text-[11px] font-black uppercase tracking-widest text-surface-500 hover:border-primary/20 transition-all">
                                            {filter}
                                            <div className="w-2 h-2 rounded-full bg-surface-200" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* List Column */}
                        <div className="lg:col-span-9 space-y-8">
                            <div className="flex items-center justify-between px-1">
                                <h2 className="text-[10px] font-black text-surface-900 uppercase tracking-widest leading-none">Catalog Hub — Grid View</h2>
                                <div className="flex gap-4">
                                    <button className="w-10 h-10 bg-surface-900 text-white rounded-xl flex items-center justify-center shadow-premium"><LayoutGrid size={20} /></button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.length > 0 ? products.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        className={`card-premium p-6 flex flex-col gap-6 bg-card-bg border-2 border-transparent transition-all duration-500 overflow-hidden group ${!product.isAvailable ? 'grayscale opacity-60' : 'shadow-elevated hover:border-primary/20'}`}
                                    >
                                        <div className="w-full h-48 rounded-[32px] overflow-hidden bg-surface-50 shadow-inner group-hover:rotate-2 transition-transform duration-700">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className="flex-1 flex flex-col pt-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-black text-surface-900 text-2xl tracking-tighter leading-tight">{product.name}</h4>
                                                <button
                                                    onClick={() => deleteProduct(product.id)}
                                                    className="p-2 text-surface-200 hover:text-rose-500 transition-colors"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                            <p className="text-3xl font-black text-primary mb-6 leading-none">₹{product.price} <span className="text-[10px] text-muted font-bold uppercase tracking-widest italic opacity-60">/ {product.unit}</span></p>

                                            <div className="mt-auto flex items-center justify-between pt-6 border-t border-border-subtle">
                                                <button
                                                    onClick={() => toggleAvailability(product.id)}
                                                    className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] px-5 py-3 rounded-2xl border-2 transition-all ${product.isAvailable
                                                        ? 'bg-primary-soft text-primary border-primary/10 shadow-accent/5'
                                                        : 'bg-surface-100 text-surface-400 border-border-subtle'
                                                        }`}
                                                >
                                                    {product.isAvailable ? (
                                                        <><CircleCheck size={16} strokeWidth={3} /> Live</>
                                                    ) : (
                                                        <><CircleAlert size={16} strokeWidth={3} /> Draft</>
                                                    )}
                                                </button>
                                                <div className="w-12 h-12 bg-surface-50 rounded-2xl flex items-center justify-center text-surface-300 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                                                    <ChevronRight size={24} />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-6 bg-card-bg rounded-[32px] border-2 border-dashed border-border-subtle shadow-inner">
                                        <div className="w-24 h-24 bg-surface-50 rounded-full flex items-center justify-center text-surface-200">
                                            <LayoutGrid size={48} />
                                        </div>
                                        <div className="space-y-2 px-6">
                                            <p className="text-2xl font-black text-surface-900 tracking-tight">Catalog Empty</p>
                                            <p className="text-sm font-bold text-muted italic">You haven&apos;t added any products to your micro-market yet. <br className="hidden md:block" /> Start by adding your first high-performance listing.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal-style "Add Product" Sheet */}
            <AnimatePresence>
                {isAdding && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAdding(false)}
                            className="fixed inset-0 bg-surface-900/60 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 w-full bg-card-bg rounded-t-[32px] shadow-2xl z-50"
                        >
                            <div className="max-w-xl mx-auto p-8 pb-12">
                                <div className="w-12 h-1.5 bg-border-subtle rounded-full mx-auto mb-8" />
                                <div className="flex justify-between items-center mb-10">
                                    <div>
                                        <h3 className="text-2xl font-black text-surface-900 tracking-tight leading-tight">New Listing</h3>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest italic">Inventory Management</p>
                                    </div>
                                    <button onClick={() => setIsAdding(false)} className="w-10 h-10 bg-surface-50 rounded-2xl flex items-center justify-center text-surface-400">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="aspect-video w-full rounded-3xl bg-surface-50 flex flex-col items-center justify-center border-2 border-dashed border-border-subtle group hover:border-primary transition-all cursor-pointer relative overflow-hidden">
                                        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-primary/20" />
                                        <div className="p-5 bg-card-bg rounded-3xl text-surface-400 group-hover:text-primary mb-4 shadow-premium border border-border-subtle transition-transform group-active:scale-95">
                                            <Camera size={32} />
                                        </div>
                                        <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Capture Photo</span>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-surface-900 uppercase tracking-widest ml-1">Product Details</label>
                                        <div className="relative group">
                                            <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-300 group-focus-within:text-primary transition-colors" size={20} />
                                            <input
                                                type="text"
                                                placeholder="Product Name (e.g. Handmade Ceramic Bowl)"
                                                className="w-full h-16 pl-14 pr-6 rounded-2xl glass shadow-premium border border-border-subtle outline-none font-bold text-surface-900 placeholder:text-surface-400 focus:border-primary/30 transition-all text-sm"
                                                value={newProduct.name}
                                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex gap-4">
                                            <input
                                                type="number"
                                                placeholder="Price (₹)"
                                                className="flex-1 h-16 px-6 rounded-2xl bg-card-bg shadow-premium border border-border-subtle outline-none font-bold text-surface-900 placeholder:text-surface-400 focus:border-primary/30 transition-all text-sm"
                                                value={newProduct.price}
                                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                            />
                                            <select
                                                className="w-32 h-16 px-6 rounded-2xl bg-card-bg shadow-premium border border-border-subtle outline-none font-bold text-surface-900 appearance-none text-sm"
                                                value={newProduct.unit}
                                                onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                                            >
                                                <option>kg</option>
                                                <option>piece</option>
                                                <option>500g</option>
                                                <option>dozen</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        onClick={addProduct}
                                        className="w-full btn-primary h-16 text-sm font-black uppercase tracking-[0.2em] shadow-accent flex items-center justify-center gap-3"
                                    >
                                        Publish Item
                                        <ChevronRight size={18} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <div className="fixed bottom-0 left-0 w-full p-6 md:p-8 bg-background/80 backdrop-blur-2xl border-t border-border-subtle z-40">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <Link href="/dashboard" className="btn-primary w-full h-20 md:h-16 shadow-accent text-base md:text-sm tracking-[0.3em] uppercase flex items-center justify-center gap-4">
                        <span className="font-black">Save & Finish Catalog</span>
                        <ChevronRight size={24} className="opacity-40" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Store, Mail, Lock, User, Eye, EyeOff,
    ArrowRight, Loader2, AlertCircle, Check, Sparkles
} from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/lib/context/auth-context";
import { isSupabaseConfigured } from "@/lib/supabase/client";

import { Suspense } from "react";

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
    })
};

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, signup, isLoggedIn } = useAuth();
    const redirectTo = searchParams.get("redirect") || "/";

    const [mode, setMode] = useState<"login" | "signup">("login");
    const [role, setRole] = useState<"user" | "merchant">("user");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (isLoggedIn) {
            router.replace(redirectTo);
        }
    }, [isLoggedIn, router, redirectTo]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Validation
        if (mode === "signup" && !name.trim()) {
            setError("Please enter your name");
            setLoading(false);
            return;
        }
        if (!email.trim()) {
            setError("Please enter your email");
            setLoading(false);
            return;
        }
        if (!password) {
            setError("Please enter your password");
            setLoading(false);
            return;
        }

        // Simulate small network delay for UX
        await new Promise(r => setTimeout(r, 600));

        let result;
        if (mode === "signup") {
            result = await signup(name.trim(), email.trim(), password, role);
        } else {
            result = await login(email.trim(), password);
        }

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                // If merchant signup, go to onboarding/dashboard
                if (mode === "signup" && role === "merchant") {
                    router.push("/dashboard");
                } else if (mode === "signup" && role === "user") {
                    router.push("/search");
                } else {
                    router.push(redirectTo);
                }
            }, 800);
        } else {
            setError(result.error || "Something went wrong");
        }

        setLoading(false);
    };

    const switchMode = () => {
        setMode(m => m === "login" ? "signup" : "login");
        setError("");
        setSuccess(false);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <motion.div
                    animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[15%] -right-[10%] w-[50%] h-[50%] bg-primary/8 rounded-full blur-[140px]"
                />
                <motion.div
                    animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                    className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-secondary/8 rounded-full blur-[120px]"
                />
            </div>

            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 px-5 md:px-8 pt-6 pb-2 flex items-center justify-between max-w-xl mx-auto w-full"
            >
                <Link href="/" className="flex items-center gap-2.5 group">
                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 3 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 15 }}
                        className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20"
                    >
                        <Store size={18} strokeWidth={3} />
                    </motion.div>
                    <span className="text-lg font-black text-surface-900 tracking-tighter group-hover:text-primary transition-colors">Localynk</span>
                </Link>
                <ThemeToggle />
            </motion.header>

            {/* Main */}
            <main className="flex-1 flex items-center justify-center relative z-10 px-5 py-8">
                <div className="w-full max-w-md">
                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.5 }}
                        className="text-center mb-8"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 15 }}
                            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={mode}
                                    initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                >
                                    {mode === "login" ? (
                                        <Lock size={28} className="text-primary" />
                                    ) : (
                                        <Sparkles size={28} className="text-primary" />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={mode}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h1 className="text-2xl md:text-3xl font-black text-surface-900 tracking-tight">
                                    {mode === "login" ? "Welcome Back" : "Create Account"}
                                </h1>
                                <p className="text-sm text-surface-400 mt-1.5">
                                    {mode === "login"
                                        ? "Sign in to access your shop & orders"
                                        : "Join StreetLink and connect with your neighborhood"
                                    }
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {!isSupabaseConfigured() && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-600 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                            >
                                <AlertCircle size={14} />
                                Backend Not Configured - Keys Missing
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.5 }}
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >
                        {/* Role Selection (signup only) */}
                        <AnimatePresence>
                            {mode === "signup" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-4 mb-6"
                                >
                                    <label className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider ml-0.5 block">Join as</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setRole("user")}
                                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center ${role === "user" ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "border-surface-100 bg-surface-50 hover:bg-surface-100"}`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === "user" ? "bg-primary text-white" : "bg-surface-100 text-surface-400"}`}>
                                                <User size={20} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-bold text-surface-900">Consumer</p>
                                                <p className="text-[8px] text-surface-400 font-medium">Shop & Explore</p>
                                            </div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRole("merchant")}
                                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center ${role === "merchant" ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "border-surface-100 bg-surface-50 hover:bg-surface-100"}`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === "merchant" ? "bg-primary text-white" : "bg-surface-100 text-surface-400"}`}>
                                                <Store size={20} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-bold text-surface-900">Merchant</p>
                                                <p className="text-[8px] text-surface-400 font-medium">Digitalize Shop</p>
                                            </div>
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider ml-0.5 mb-1.5 block">Full Name</label>
                                            <div className="relative">
                                                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-300" />
                                                <input
                                                    type="text"
                                                    placeholder="Your name"
                                                    value={name}
                                                    onChange={e => { setName(e.target.value); setError(""); }}
                                                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-surface-50 outline-none font-medium text-sm text-surface-900 placeholder:text-surface-300 focus:ring-2 focus:ring-primary/20 transition-all font-inter"
                                                    autoComplete="name"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Email */}
                        <div>
                            <label className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider ml-0.5 mb-1.5 block">Email Address</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-300" />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setError(""); }}
                                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-surface-50 outline-none font-medium text-sm text-surface-900 placeholder:text-surface-300 focus:ring-2 focus:ring-primary/20 transition-all"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider ml-0.5 mb-1.5 block">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-300" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder={mode === "signup" ? "Min 6 characters" : "Enter your password"}
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setError(""); }}
                                    className="w-full h-12 pl-10 pr-12 rounded-xl bg-surface-50 outline-none font-medium text-sm text-surface-900 placeholder:text-surface-300 focus:ring-2 focus:ring-primary/20 transition-all"
                                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-surface-300 hover:text-surface-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: "auto" }}
                                    exit={{ opacity: 0, y: -8, height: 0 }}
                                    className="flex items-center gap-2 px-3.5 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-medium"
                                >
                                    <AlertCircle size={14} className="shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit */}
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            disabled={loading || success}
                            className="w-full h-12 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <AnimatePresence mode="wait">
                                {success ? (
                                    <motion.div
                                        key="success"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Check size={18} strokeWidth={3} />
                                        <span>{mode === "login" ? "Signed In!" : "Account Created!"}</span>
                                    </motion.div>
                                ) : loading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <Loader2 size={18} className="animate-spin" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="idle"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center gap-2"
                                    >
                                        <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
                                        <ArrowRight size={16} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </motion.form>

                    {/* Divider */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="my-6 flex items-center gap-3"
                    >
                        <div className="flex-1 h-px bg-surface-100" />
                        <span className="text-[10px] font-semibold text-surface-300 uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-surface-100" />
                    </motion.div>

                    {/* Switch mode */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="text-center"
                    >
                        <p className="text-sm text-surface-400">
                            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                            <button
                                type="button"
                                onClick={switchMode}
                                className="text-primary font-semibold hover:underline underline-offset-2 transition-all"
                            >
                                {mode === "login" ? "Sign Up" : "Sign In"}
                            </button>
                        </p>
                    </motion.div>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-10 text-center"
                    >
                        <p className="text-[10px] text-surface-300">
                            By continuing, you agree to our Terms of Service & Privacy Policy
                        </p>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}

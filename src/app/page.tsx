"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Store, ShoppingBag, ShieldCheck, ChevronRight, Zap, Users, Globe, Menu, X, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/lib/context/auth-context";
import { useLanguage } from "@/lib/context/language-context";

const navLinks = [
  { href: "/search", label: "Markets" },
  { href: "/onboarding", label: "Register" },
  { href: "/support", label: "Support" },
  { href: "/settings", label: "Settings" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }
  })
};

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isMerchant, isLoggedIn } = useAuth();
  const { t } = useLanguage();

  // Handle auto-redirect for logged in users
  useEffect(() => {
    if (isLoggedIn) {
      if (isMerchant) {
        router.replace("/dashboard");
      } else {
        router.replace("/search");
      }
    }
  }, [isLoggedIn, isMerchant, router]);

  // Nav links are now dynamic inside the component
  const navLinks = [
    { href: "/search", label: t("nav.explorer") },
    { href: "/onboarding", label: t("onboarding.register") || "Register" },
    { href: "/support", label: t("nav.support") || "Support" },
    { href: "/settings", label: t("nav.settings") },
  ];

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 15, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-[0%] left-[20%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]"
        />
      </div>

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-20 w-full bg-background/50 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-12 py-4 md:py-6 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 3 }}
              transition={{ delay: 0.25, type: "spring", stiffness: 300, damping: 15 }}
              className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-accent"
            >
              <Store size={22} strokeWidth={3} className="md:w-7 md:h-7" />
            </motion.div>
            <span className="text-xl md:text-2xl font-black text-surface-900 tracking-tighter">Localynk</span>
          </motion.div>
          <div className="flex items-center gap-3">
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-surface-500">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                >
                  <Link href={link.href} className="hover:text-primary transition-colors">{link.label}</Link>
                </motion.div>
              ))}
            </nav>
            <ThemeToggle />
            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 bg-surface-50 rounded-xl flex items-center justify-center text-surface-500 transition-colors"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X size={18} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden bg-background/95 backdrop-blur-xl"
            >
              <nav className="px-5 pb-4 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 transition-all text-sm font-medium text-surface-900"
                    >
                      {link.label}
                      <ChevronRight size={14} className="text-surface-300" />
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-2 border-t border-surface-100 mt-2">
                  {isMerchant ? (
                    <motion.div
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25, duration: 0.3 }}
                    >
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all text-sm font-bold text-primary"
                      >
                        {t("nav.dashboard_btn")}
                        <ArrowRight size={14} />
                      </Link>
                    </motion.div>
                  ) : isLoggedIn ? (
                    <motion.div
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25, duration: 0.3 }}
                    >
                      <Link
                        href="/onboarding"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all text-sm font-bold text-primary"
                      >
                        {t("nav.register_btn")}
                        <ArrowRight size={14} />
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25, duration: 0.3 }}
                    >
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all text-sm font-bold text-primary"
                      >
                        {t("nav.login_btn")}
                        <LogIn size={14} />
                      </Link>
                    </motion.div>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-5 md:px-12 pt-12 md:pt-16 pb-24">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-soft rounded-full text-primary border border-primary/10"
              >
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Zap size={14} fill="currentColor" />
                </motion.div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Next-Gen Local Commerce</span>
              </motion.div>

              <motion.h1
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-4xl md:text-7xl font-black leading-tight text-surface-900 tracking-tighter"
              >
                {t("landing.title")}
              </motion.h1>

              <motion.p
                custom={3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-muted font-medium text-base md:text-lg leading-relaxed max-w-lg"
              >
                {t("landing.subtitle")}
              </motion.p>

              {/* Stats moved here for desktop flow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="hidden lg:grid grid-cols-2 gap-12 pt-10 border-t border-border-subtle"
              >
                <motion.div
                  whileHover={{ y: -2 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-3 text-primary">
                    <Users size={20} />
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.1, type: "spring" }}
                      className="text-2xl font-bold text-surface-900 tracking-tight"
                    >12k+</motion.span>
                  </div>
                  <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">Verified Vendors</p>
                </motion.div>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-3 text-secondary">
                    <Globe size={20} />
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2, type: "spring" }}
                      className="text-2xl font-bold text-surface-900 tracking-tight"
                    >24/7</motion.span>
                  </div>
                  <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">Digital Access</p>
                </motion.div>
              </motion.div>
            </motion.div>

            <div className="space-y-5 md:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-primary/20 rounded-2xl md:rounded-[32px] blur-3xl transition-all duration-500"
                />
                <Link href="/onboarding" className="relative block p-6 md:p-8 bg-contrast-bg text-contrast-text rounded-2xl md:rounded-[32px] shadow-2xl overflow-hidden min-h-[140px] md:min-h-[180px] flex flex-col justify-between group text-left">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute right-0 top-0 w-40 h-40 bg-primary opacity-20 rounded-full -mr-16 -mt-16 blur-3xl"
                  />
                  <div className="flex justify-between items-start relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className="w-12 h-12 md:w-16 md:h-16 bg-primary/20 backdrop-blur-xl rounded-xl md:rounded-2xl flex items-center justify-center text-primary"
                    >
                      <Store size={24} strokeWidth={3} className="md:w-8 md:h-8" />
                    </motion.div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 backdrop-blur-md rounded-lg md:rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-primary group-hover:text-white transition-all">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                  <div className="relative z-10 mt-4 md:mt-6 text-left">
                    <h3 className="text-xl md:text-2xl font-bold mb-0.5 tracking-tight text-inherit">Digitalize Your Shop</h3>
                    <p className="opacity-60 text-[9px] font-semibold uppercase tracking-[0.2em] text-inherit">Launch in 60 seconds</p>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <Link href="/search" className="block p-6 md:p-8 bg-surface-50 rounded-2xl md:rounded-[32px] hover:bg-surface-100 transition-colors min-h-[140px] md:min-h-[180px] flex flex-col justify-between group text-left">
                  <div className="flex justify-between items-start">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 text-primary rounded-xl md:rounded-2xl flex items-center justify-center"
                    >
                      <ShoppingBag size={24} strokeWidth={3} className="md:w-8 md:h-8" />
                    </motion.div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-surface-100 rounded-lg md:rounded-xl flex items-center justify-center text-surface-300 group-hover:bg-primary group-hover:text-white transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                  <div className="mt-4 md:mt-6 text-left">
                    <h3 className="text-xl md:text-2xl font-bold text-surface-900 mb-0.5 tracking-tight">Explore Markets</h3>
                    <p className="text-muted text-[9px] font-semibold uppercase tracking-[0.2em]">Discover local artisans</p>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Mobile-only stats section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="lg:hidden mt-16 grid grid-cols-2 gap-6 border-t border-border-subtle pt-8"
          >
            <motion.div whileHover={{ y: -2 }} className="space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <Users size={18} />
                <span className="text-xl font-bold text-surface-900 tracking-tight">12k+</span>
              </div>
              <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">Verified Merchants</p>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} className="space-y-1">
              <div className="flex items-center gap-2 text-secondary">
                <Globe size={18} />
                <span className="text-xl font-bold text-surface-900 tracking-tight">Real-time</span>
              </div>
              <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">Digital Access</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Brand Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="relative z-10 bg-surface-100/50 border-t border-border-subtle pt-16 pb-24"
        >
          <div className="max-w-7xl mx-auto px-5 md:px-12 grid md:grid-cols-3 gap-10 items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                  <Store size={18} />
                </div>
                <span className="text-lg font-bold text-surface-900 tracking-tight">Localynk</span>
              </div>
              <p className="text-sm text-muted leading-relaxed max-w-xs">
                Empowering India&apos;s micro-entrepreneurs through digital inclusion.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="space-y-4"
            >
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-surface-400">Platform</h4>
              <nav className="flex flex-col gap-3 text-sm text-muted">
                <Link href="/search" className="hover:text-primary transition-colors">Vendor Discovery</Link>
                <Link href="/onboarding" className="hover:text-primary transition-colors">Store Registration</Link>
                <Link href="/support" className="hover:text-primary transition-colors">Help & Support</Link>
                <Link href="/settings" className="hover:text-primary transition-colors">Settings</Link>
              </nav>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="space-y-4"
            >
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-surface-400">Trust</h4>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-2 text-[10px] font-semibold text-primary uppercase tracking-wider px-3 py-2 bg-primary/5 rounded-lg w-fit"
              >
                <ShieldCheck size={14} />
                SSL Encrypted
              </motion.div>
            </motion.div>
          </div>
        </motion.footer>
      </main>
    </div>
  );
}

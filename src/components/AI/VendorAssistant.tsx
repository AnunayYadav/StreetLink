"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    Send,
    Sparkles,
    Bot,
    User,
} from "lucide-react";
import { useLanguage } from "@/lib/context/language-context";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function VendorAssistant() {
    const { langCode } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Namaste! 🙏 I'm your StreetLink Sahayak. I can help you set up your shop, add products, manage orders, or answer any questions — in your own language. How can I help?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<any>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 400);
        }
    }, [isOpen]);

    // Initialize Web Speech API
    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition =
                (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = false;

                recognitionRef.current.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setInput(transcript);
                    setIsListening(false);
                    handleSend(transcript);
                };

                recognitionRef.current.onerror = () => {
                    setIsListening(false);
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const speak = (text: string) => {
        if (!voiceEnabled || typeof window === "undefined") return;
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const langMap: Record<string, string> = {
            en: "en-IN",
            hi: "hi-IN",
            pa: "pa-IN",
            gu: "gu-IN",
            mr: "mr-IN",
            ta: "ta-IN",
            te: "te-IN",
            bn: "bn-IN",
            ml: "ml-IN",
            kn: "kn-IN",
        };
        utterance.lang = langMap[langCode] || "en-IN";
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    const toggleListening = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setInput("");
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch { /* already running */ }
        }
    };

    const handleSend = async (manualInput?: string) => {
        const textToSend = manualInput || input;
        if (!textToSend.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: textToSend };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: textToSend,
                    language: langCode,
                    history: messages,
                }),
            });

            const data = await response.json();

            if (data.text) {
                const assistantMessage: Message = { role: "assistant", content: data.text };
                setMessages((prev) => [...prev, assistantMessage]);
                speak(data.text);
            } else {
                throw new Error("No reply");
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "I'm having trouble connecting. Please check your internet and try again.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // ─── Quick-action chips for first-time users ───
    const quickActions = [
        "How to register my shop?",
        "Help me add products",
        "How does payment work?",
    ];

    return (
        <>
            {/* ═══════════════════════════════════════════════════
                 FLOATING TRIGGER BUTTON
            ═══════════════════════════════════════════════════ */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-24 md:bottom-8 right-5 z-50 w-14 h-14 rounded-full
                            bg-gradient-to-br from-primary to-primary-dark
                            text-white shadow-[0_6px_24px_rgba(226,55,68,0.35)]
                            flex items-center justify-center"
                    >
                        <Sparkles size={22} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* ═══════════════════════════════════════════════════
                 CHAT DRAWER
            ═══════════════════════════════════════════════════ */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ y: "100%", opacity: 0.5 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0.5 }}
                            transition={{ type: "spring", damping: 32, stiffness: 380 }}
                            className="fixed inset-x-0 bottom-0 md:right-6 md:bottom-6 md:left-auto md:top-auto
                                md:w-[420px] md:max-h-[680px] md:rounded-3xl
                                h-[85vh] md:h-auto
                                bg-[var(--background)] border border-[var(--border-subtle)]
                                shadow-[0_-8px_60px_rgba(0,0,0,0.15)]
                                rounded-t-3xl md:rounded-3xl
                                flex flex-col overflow-hidden z-[70]"
                        >
                            {/* ──── HEADER ──── */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md">
                                        <Bot size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-[var(--foreground)]">
                                            StreetLink Sahayak
                                        </h3>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-semibold text-[var(--surface-muted)] uppercase tracking-wider">
                                                AI Guide • Online
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    {/* Voice toggle */}
                                    <button
                                        onClick={() => {
                                            if (isSpeaking) window.speechSynthesis.cancel();
                                            setVoiceEnabled(!voiceEnabled);
                                        }}
                                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors
                                            ${voiceEnabled
                                                ? "bg-primary/10 text-primary"
                                                : "bg-[var(--surface-100)] text-[var(--surface-muted)]"
                                            }`}
                                        title={voiceEnabled ? "Mute voice" : "Unmute voice"}
                                    >
                                        {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                                    </button>

                                    {/* Close */}
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="w-9 h-9 rounded-xl bg-[var(--surface-100)] flex items-center justify-center
                                            text-[var(--surface-muted)] hover:text-[var(--foreground)] transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* ──── MESSAGES ──── */}
                            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 overscroll-contain">
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.25, delay: i === 0 ? 0 : 0.05 }}
                                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`flex gap-2.5 max-w-[88%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                                }`}
                                        >
                                            {/* Avatar */}
                                            <div
                                                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5
                                                    ${msg.role === "user"
                                                        ? "bg-[var(--surface-200)] text-[var(--surface-500)]"
                                                        : "bg-gradient-to-br from-primary to-primary-dark text-white"
                                                    }`}
                                            >
                                                {msg.role === "user" ? (
                                                    <User size={14} />
                                                ) : (
                                                    <Bot size={14} />
                                                )}
                                            </div>

                                            {/* Bubble */}
                                            <div
                                                className={`px-4 py-3 text-[13px] leading-relaxed
                                                    ${msg.role === "user"
                                                        ? "bg-primary text-white rounded-2xl rounded-tr-md"
                                                        : "bg-[var(--surface-100)] text-[var(--foreground)] rounded-2xl rounded-tl-md"
                                                    }`}
                                            >
                                                {msg.content}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Quick action chips — show only when 1 message */}
                                {messages.length === 1 && !isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="flex flex-wrap gap-2 pt-2"
                                    >
                                        {quickActions.map((action) => (
                                            <button
                                                key={action}
                                                onClick={() => handleSend(action)}
                                                className="px-3.5 py-2 rounded-xl text-[11px] font-semibold
                                                    bg-primary/8 text-primary border border-primary/15
                                                    hover:bg-primary/15 active:scale-95 transition-all"
                                            >
                                                {action}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}

                                {/* Loading dots */}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="flex gap-2.5 items-start">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                                                <Bot size={14} className="text-white" />
                                            </div>
                                            <div className="flex items-center gap-1 bg-[var(--surface-100)] px-4 py-3 rounded-2xl rounded-tl-md">
                                                <span className="w-1.5 h-1.5 bg-[var(--surface-muted)] rounded-full animate-bounce" />
                                                <span className="w-1.5 h-1.5 bg-[var(--surface-muted)] rounded-full animate-bounce [animation-delay:0.15s]" />
                                                <span className="w-1.5 h-1.5 bg-[var(--surface-muted)] rounded-full animate-bounce [animation-delay:0.3s]" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* ──── SPEAKING INDICATOR ──── */}
                            <AnimatePresence>
                                {isSpeaking && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="flex items-center justify-center gap-3 px-5 py-2.5 bg-primary/8 border-t border-primary/10">
                                            <div className="flex gap-[3px] items-end h-3.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{ height: [3, 14, 3] }}
                                                        transition={{
                                                            duration: 0.6,
                                                            repeat: Infinity,
                                                            delay: i * 0.08,
                                                        }}
                                                        className="w-[3px] bg-primary rounded-full"
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                                Speaking...
                                            </span>
                                            <button
                                                onClick={() => window.speechSynthesis.cancel()}
                                                className="text-[10px] font-bold text-[var(--surface-muted)] hover:text-primary ml-1 transition-colors"
                                            >
                                                STOP
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ──── INPUT ──── */}
                            <div className="px-4 py-3 border-t border-[var(--border-subtle)] bg-[var(--background)]">
                                <div className="flex items-center gap-2">
                                    {/* Mic Button */}
                                    <motion.button
                                        whileTap={{ scale: 0.88 }}
                                        onClick={toggleListening}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all
                                            ${isListening
                                                ? "bg-red-500 text-white shadow-lg shadow-red-500/25 animate-pulse"
                                                : "bg-[var(--surface-100)] text-[var(--surface-muted)] hover:text-[var(--foreground)]"
                                            }`}
                                        title={isListening ? "Stop listening" : "Voice input"}
                                    >
                                        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                                    </motion.button>

                                    {/* Text Input */}
                                    <div className="relative flex-1">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                            placeholder="Ask anything..."
                                            className="w-full h-10 pl-4 pr-11 rounded-xl text-[13px]
                                                bg-[var(--surface-100)] text-[var(--foreground)]
                                                placeholder:text-[var(--surface-muted)]
                                                focus:outline-none focus:ring-2 focus:ring-primary/25
                                                transition-all"
                                        />
                                        <button
                                            onClick={() => handleSend()}
                                            disabled={!input.trim() || isLoading}
                                            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7
                                                bg-primary text-white rounded-lg flex items-center justify-center
                                                disabled:opacity-30 disabled:cursor-not-allowed
                                                hover:brightness-110 active:scale-90 transition-all"
                                        >
                                            <Send size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Footer branding */}
                                <p className="text-center text-[9px] font-semibold text-[var(--surface-muted)] mt-2 tracking-wider uppercase">
                                    Powered by Gemini AI
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

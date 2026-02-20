"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, User, Bot, Loader2, Minimize2, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/context/language-context";

interface Message {
    role: "user" | "bot";
    content: string;
}

export default function ChatBot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { t } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([
        { role: "bot", content: t("chat.greeting") }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages.map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                })
            });

            const data = await response.json();
            if (data.text) {
                setMessages(prev => [...prev, { role: "bot", content: data.text }]);
            } else {
                setMessages(prev => [...prev, { role: "bot", content: t("chat.error_connect") }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: "bot", content: t("chat.error_generic") }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 550 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="relative w-full bg-background rounded-[24px] flex flex-col border border-border-subtle overflow-hidden shadow-sm mb-8"
                >
                    {/* Header */}
                    <div className="p-5 border-b border-border-subtle bg-surface-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-surface-900 tracking-tight">{t("chat.title")}</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <p className="text-[10px] text-surface-400 font-medium uppercase tracking-wider">{t("chat.online")}</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-surface-100 rounded-full flex items-center justify-center text-surface-400 hover:text-surface-900 transition-colors"
                        >
                            <Minimize2 size={18} />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar bg-surface-50/30"
                    >
                        {messages.map((m, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                key={i}
                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${m.role === "user"
                                    ? "bg-primary text-white rounded-tr-none shadow-premium-soft"
                                    : "bg-white dark:bg-surface-100 text-surface-900 rounded-tl-none border border-border-subtle shadow-sm"
                                    }`}>
                                    {m.content}
                                </div>
                            </motion.div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-surface-100 p-4 rounded-2xl rounded-tl-none border border-border-subtle shadow-sm">
                                    <Loader2 size={16} className="animate-spin text-primary" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-border-subtle bg-background">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                placeholder={t("chat.placeholder")}
                                className="w-full h-12 pl-4 pr-14 rounded-2xl bg-surface-50 outline-none font-medium text-sm text-surface-900 placeholder:text-surface-300 focus:ring-2 focus:ring-primary/20 transition-all border border-border-subtle"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="absolute right-1 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:scale-95"
                            >
                                <Send size={16} strokeWidth={2.5} />
                            </button>
                        </div>
                        <p className="text-[9px] text-center text-surface-300 mt-2 font-medium uppercase tracking-widest">{t("chat.powered_by")}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

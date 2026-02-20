"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare,
    X,
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    Send,
    Loader2,
    Sparkles,
    User,
    Bot,
    ArrowRight
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
            content: "Namaste! I am your StreetLink Guide. I can help you set up your shop, add products, or answer any questions in your preferred language. Would you like a tour?"
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize Web Speech API
    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = false;

                recognitionRef.current.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setInput(transcript);
                    setIsListening(false);
                    // Automatically send after voice input
                    handleSend(transcript);
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error("Speech recognition error:", event.error);
                    setIsListening(false);
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };
            }
        }
    }, []);

    const speak = (text: string) => {
        if (!voiceEnabled || typeof window === "undefined") return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Map langCode to BCP 47 tags
        const langMap: Record<string, string> = {
            en: "en-US",
            hi: "hi-IN",
            pa: "pa-IN",
            gu: "gu-IN",
            mr: "mr-IN",
            ta: "ta-IN",
            te: "te-IN"
        };

        utterance.lang = langMap[langCode] || "en-US";
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setInput("");
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const handleSend = async (manualInput?: string) => {
        const textToSend = manualInput || input;
        if (!textToSend.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: textToSend };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: textToSend,
                    language: langCode,
                    history: messages
                })
            });

            const data = await response.json();

            if (data.text) {
                const assistantMessage: Message = { role: "assistant", content: data.text };
                setMessages(prev => [...prev, assistantMessage]);
                speak(data.text);
            } else {
                throw new Error("No reply from AI");
            }
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: Message = {
                role: "assistant",
                content: "I'm having trouble connecting right now. Please try again or check your internet."
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-primary text-white rounded-2xl shadow-2xl flex items-center justify-center z-50 group border-4 border-white dark:border-surface-900"
            >
                <div className="absolute inset-0 bg-primary rounded-2xl animate-ping opacity-25 group-hover:hidden" />
                <Sparkles size={28} className="relative z-10" />
            </motion.button>

            {/* AI Assistant Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ x: "100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-surface-950 shadow-2xl z-[70] flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between bg-primary/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                        <Sparkles size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-surface-900 dark:text-white">AI Assistant</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                            <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Active & Guiding</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setVoiceEnabled(!voiceEnabled)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${voiceEnabled ? 'bg-primary/10 text-primary' : 'bg-surface-100 text-surface-400'}`}
                                    >
                                        {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="w-10 h-10 bg-surface-100 dark:bg-surface-800 rounded-xl flex items-center justify-center text-surface-500"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                                {messages.map((msg, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={i}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-surface-100' : 'bg-primary'}`}>
                                                {msg.role === 'user' ? <User size={16} className="text-surface-600" /> : <Bot size={16} className="text-white" />}
                                            </div>
                                            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                                ? 'bg-surface-900 text-white rounded-tr-none'
                                                : 'bg-surface-50 dark:bg-surface-900 text-surface-700 dark:text-surface-300 rounded-tl-none'
                                                }`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="flex gap-3 items-center">
                                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                                <Bot size={16} className="text-white" />
                                            </div>
                                            <div className="flex gap-1">
                                                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                                                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                                                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-6 border-t border-surface-100 dark:border-surface-800 space-y-4">
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                            placeholder="Ask anything..."
                                            className="w-full h-12 pl-4 pr-12 bg-surface-50 dark:bg-surface-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                        <button
                                            onClick={() => handleSend()}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:scale-105 transition-transform"
                                        >
                                            <Send size={16} />
                                        </button>
                                    </div>
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={toggleListening}
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isListening
                                            ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/20'
                                            : 'bg-surface-100 dark:bg-surface-800 text-surface-600'
                                            }`}
                                    >
                                        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                                    </motion.button>
                                </div>

                                {isSpeaking && (
                                    <div className="flex items-center justify-center gap-3 p-3 bg-primary/10 rounded-xl">
                                        <div className="flex gap-0.5 items-end h-3">
                                            {[...Array(5)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ height: [4, 12, 4] }}
                                                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                                    className="w-1 bg-primary rounded-full"
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest italic">Speaking Guide...</span>
                                        <button onClick={() => window.speechSynthesis.cancel()} className="text-[10px] font-bold text-surface-400 hover:text-primary">STOP</button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

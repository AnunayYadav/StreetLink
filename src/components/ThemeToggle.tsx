"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/context/theme-context";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="w-12 h-12 rounded-2xl glass border border-border-subtle flex items-center justify-center shadow-premium active:scale-90 transition-all"
            aria-label="Toggle Theme"
        >
            {theme === 'light' ? (
                <Moon size={20} className="text-surface-900" />
            ) : (
                <Sun size={20} className="text-surface-900" />
            )}
        </button>
    );
}

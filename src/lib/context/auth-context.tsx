"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type UserRole = "guest" | "user" | "merchant";

export interface UserProfile {
    name: string;
    email: string;
    createdAt: string;
}

export interface MerchantProfile {
    shopName: string;
    categories: string[];
    phone: string;
    email: string;
    address: string;
}

interface AuthContextType {
    role: UserRole;
    isGuest: boolean;
    isLoggedIn: boolean;
    isMerchant: boolean;
    user: UserProfile | null;
    merchantProfile: MerchantProfile | null;
    signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    loginAsMerchant: (profile: MerchantProfile) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = "streetlink_auth";
const USERS_KEY = "streetlink_users";

// Simple local user store — ready to be replaced with Supabase
function getStoredUsers(): Record<string, { name: string; email: string; password: string; createdAt: string }> {
    try {
        const data = localStorage.getItem(USERS_KEY);
        return data ? JSON.parse(data) : {};
    } catch {
        return {};
    }
}

function saveUser(email: string, name: string, password: string) {
    const users = getStoredUsers();
    users[email.toLowerCase()] = { name, email: email.toLowerCase(), password, createdAt: new Date().toISOString() };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [role, setRole] = useState<UserRole>("guest");
    const [user, setUser] = useState<UserProfile | null>(null);
    const [merchantProfile, setMerchantProfile] = useState<MerchantProfile | null>(null);

    // Load persisted auth on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(AUTH_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                if (data.user) {
                    setUser(data.user);
                    if (data.role === "merchant" && data.merchantProfile) {
                        setRole("merchant");
                        setMerchantProfile(data.merchantProfile);
                    } else {
                        setRole("user");
                    }
                }
            }
        } catch {
            // ignore parse errors
        }
    }, []);

    const persistAuth = useCallback((r: UserRole, u: UserProfile | null, mp: MerchantProfile | null) => {
        localStorage.setItem(AUTH_KEY, JSON.stringify({ role: r, user: u, merchantProfile: mp }));
    }, []);

    const signup = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        const users = getStoredUsers();
        const key = email.toLowerCase();

        if (users[key]) {
            return { success: false, error: "An account with this email already exists" };
        }
        if (password.length < 6) {
            return { success: false, error: "Password must be at least 6 characters" };
        }

        saveUser(email, name, password);
        const profile: UserProfile = { name, email: key, createdAt: new Date().toISOString() };
        setUser(profile);
        setRole("user");
        persistAuth("user", profile, null);

        return { success: true };
    }, [persistAuth]);

    const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        const users = getStoredUsers();
        const key = email.toLowerCase();
        const stored = users[key];

        if (!stored) {
            return { success: false, error: "No account found with this email" };
        }
        if (stored.password !== password) {
            return { success: false, error: "Incorrect password" };
        }

        const profile: UserProfile = { name: stored.name, email: stored.email, createdAt: stored.createdAt };
        setUser(profile);

        // Check if this user was previously a merchant
        try {
            const authData = localStorage.getItem(AUTH_KEY);
            if (authData) {
                const parsed = JSON.parse(authData);
                if (parsed.user?.email === key && parsed.role === "merchant" && parsed.merchantProfile) {
                    setRole("merchant");
                    setMerchantProfile(parsed.merchantProfile);
                    persistAuth("merchant", profile, parsed.merchantProfile);
                    return { success: true };
                }
            }
        } catch {
            // continue with user role
        }

        setRole("user");
        persistAuth("user", profile, null);
        return { success: true };
    }, [persistAuth]);

    const loginAsMerchant = useCallback((profile: MerchantProfile) => {
        setRole("merchant");
        setMerchantProfile(profile);
        persistAuth("merchant", user, profile);
    }, [user, persistAuth]);

    const logout = useCallback(() => {
        setRole("guest");
        setUser(null);
        setMerchantProfile(null);
        localStorage.removeItem(AUTH_KEY);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                role,
                isGuest: role === "guest",
                isLoggedIn: role !== "guest",
                isMerchant: role === "merchant",
                user,
                merchantProfile,
                signup,
                login,
                loginAsMerchant,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

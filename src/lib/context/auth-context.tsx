"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export type UserRole = "guest" | "user" | "merchant";

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar_url?: string;
    createdAt: string;
}

export interface MerchantProfile {
    id: string;
    owner_id: string;
    name: string;
    description: string | null;
    categories: string[];
    phone: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    is_verified: boolean;
    logo_url: string | null;
    createdAt: string;
}

interface AuthContextType {
    role: UserRole;
    isGuest: boolean;
    isLoggedIn: boolean;
    isMerchant: boolean;
    user: UserProfile | null;
    merchantProfile: MerchantProfile | null;
    isLoading: boolean;
    signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    refreshProfile: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [role, setRole] = useState<UserRole>("guest");
    const [user, setUser] = useState<UserProfile | null>(null);
    const [merchantProfile, setMerchantProfile] = useState<MerchantProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    const fetchProfile = useCallback(async (userId: string) => {
        try {
            // Get user profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (profileError || !profile) {
                console.error("Error fetching profile:", profileError);
                return;
            }

            const mappedUser: UserProfile = {
                id: profile.id,
                name: profile.full_name || 'User',
                email: profile.email,
                role: (profile.role as UserRole) || 'user',
                avatar_url: profile.avatar_url,
                createdAt: profile.created_at
            };

            setUser(mappedUser);
            setRole(mappedUser.role);

            // If merchant, get shop profile
            if (mappedUser.role === 'merchant') {
                const { data: shop, error: shopError } = await supabase
                    .from('shops')
                    .select('*')
                    .eq('owner_id', userId)
                    .single();

                if (!shopError && shop) {
                    setMerchantProfile({
                        id: shop.id,
                        owner_id: shop.owner_id,
                        name: shop.name,
                        description: shop.description,
                        categories: shop.categories || [],
                        phone: shop.phone,
                        address: shop.address,
                        latitude: shop.latitude,
                        longitude: shop.longitude,
                        is_verified: shop.is_verified,
                        logo_url: shop.logo_url,
                        createdAt: shop.created_at
                    });
                }
            }
        } catch (err) {
            console.error("Auth initialization error:", err);
        }
    }, [supabase]);

    useEffect(() => {
        if (!isSupabaseConfigured()) {
            setIsLoading(false);
            return;
        }

        const initAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                await fetchProfile(session.user.id);
            }
            setIsLoading(false);
        };

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                await fetchProfile(session.user.id);
                setIsLoading(false);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setRole("guest");
                setMerchantProfile(null);
                setIsLoading(false);
                router.push('/');
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase, fetchProfile, router]);

    const signup = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        if (!isSupabaseConfigured()) {
            return { success: false, error: "Supabase is not configured. Please add your URL and Key to .env.local" };
        }
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                }
            }
        });

        if (error) return { success: false, error: error.message };
        return { success: true };
    }, [supabase]);

    const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        if (!isSupabaseConfigured()) {
            return { success: false, error: "Supabase is not configured. Please add your URL and Key to .env.local" };
        }
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) return { success: false, error: error.message };
        return { success: true };
    }, [supabase]);

    const logout = useCallback(async () => {
        await supabase.auth.signOut();
    }, [supabase]);

    const refreshProfile = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            await fetchProfile(session.user.id);
        }
    }, [supabase, fetchProfile]);

    return (
        <AuthContext.Provider
            value={{
                role,
                isGuest: role === "guest",
                isLoggedIn: role !== "guest",
                isMerchant: role === "merchant",
                user,
                merchantProfile,
                isLoading,
                signup,
                login,
                logout,
                refreshProfile
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

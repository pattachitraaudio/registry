"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { APIResCode } from "@/enums/APIResCode";
import { iUser } from "@/interfaces/iUser";
import { neoFetch } from "@/neoFetch";

interface AuthContextType {
    user: iUser | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    authLoading: boolean;
    authError: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<iUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        (async function () {
            setLoading(true);
            try {
                const res = await neoFetch("/api/auth/session", {
                    method: "GET",
                });

                if (res.code === APIResCode.SUCCESS) {
                    console.log("wow! auth success");
                    setUser(res.data.user);
                }
            } catch (error) {
                console.error("Session check failed:", error);
                setError("Session check failed");
            }

            console.log("setLoading: false");
            setLoading(false);
        })();
    }, []);

    async function login(email: string, password: string) {
        try {
            const res = await neoFetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            console.log("Here!!!");
            if (!(res.code === APIResCode.SUCCESS)) {
                // TODO: If email needs verification, redirect to checkEmail page
                /*
                if (data.needsVerification) {
                    router.push(`/checkEmail?email=${encodeURIComponent(data.email)}`);
                    return;
                }
                    */

                console.log("error here!...");
                setError(res.message || "Login failed");
                throw new Error("GENERIC_ERROR");
            }

            setUser(res.data.user);
        } catch (err) {
            setError("An error occurred. Please try again.");
            setLoading(false);
            throw err;
        }
    }

    async function logout() {
        try {
            await neoFetch("/api/auth/logout", { method: "POST" });
            setUser(null);
        } catch (err) {
            console.error("Logout error:", error);
            throw err;
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, authLoading: loading, authError: error }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

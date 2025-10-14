"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { IUser } from "@/interfaces/IUser";
import { ErrorResponse } from "@/interfaces/APIResponses/ErrorResponse";
import { UserResponse } from "@/interfaces/APIResponses/UserResponse";
import { APIResponseCode } from "@/app/enums/APIResponseCode";

interface AuthContextType {
    user: IUser | null;
    // setUser: (user: User | null) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    authLoading: boolean;
    authError: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        (async function () {
            setLoading(true);
            try {
                const res = await fetch("/api/auth/session");

                const resObj = (await res.json()) as UserResponse | ErrorResponse;
                console.log("resObj:", resObj);

                if (resObj.status === APIResponseCode.SUCCESS) {
                    console.log("wow! auth success");
                    setUser(resObj.data);
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
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const resObj = (await res.json()) as ErrorResponse | UserResponse;
            // console.log(resObj);

            if (resObj.status === APIResponseCode.GENERIC_ERROR) {
                // TODO: If email needs verification, redirect to checkEmail page
                /*
                if (data.needsVerification) {
                    router.push(`/checkEmail?email=${encodeURIComponent(data.email)}`);
                    return;
                }
                    */
                setError(resObj.message || "Login failed");
                throw new Error("GENERIC_ERROR");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
            setLoading(false);
            throw err;
        }
    }

    async function logout() {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
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

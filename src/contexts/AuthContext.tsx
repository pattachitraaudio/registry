"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { IUser } from "@/interfaces/IUsersafe";
import { APIResCode } from "@/enums/APIResCode";
import { IAPISessionErrorResponse, IAPISessionSuccessResponse } from "@/interfaces/apiResponses/auth/session";
import { IAPILoginErrorResponse, IAPILoginSuccessResponse } from "@/interfaces/apiResponses/auth/login";
import { PostLoginRouteHandlerReturnType } from "@/app/api/auth/login/route";
import { iAPIErrRes } from "@/types/apiResponse/xAPIRes";

interface AuthContextType {
    user: IUser | null;
    // setUser: (user: User | null) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    authLoading: boolean;
    authError: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export type GetSessionRouteHandlerReturnType = IAPISessionSuccessResponse | IAPISessionErrorResponse | iAPIErrRes;

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        (async function () {
            setLoading(true);
            try {
                const res = await fetch("/api/auth/session");

                const resObj = (await res.json()) as GetSessionRouteHandlerReturnType;
                console.log("resObj:", resObj);

                if (resObj.code === APIResCode.SUCCESS) {
                    console.log("wow! auth success");
                    setUser(resObj.data.user);
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

            const resObj = (await res.json()) as PostLoginRouteHandlerReturnType;
            // console.log(resObj);

            console.log("HEre!!!");
            if (!(resObj.code === APIResCode.SUCCESS)) {
                // TODO: If email needs verification, redirect to checkEmail page
                /*
                if (data.needsVerification) {
                    router.push(`/checkEmail?email=${encodeURIComponent(data.email)}`);
                    return;
                }
                    */
                console.log("error here!...");
                setError(resObj.message || "Login failed");
                throw new Error("GENERIC_ERROR");
            }

            setUser(resObj.data.user);
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

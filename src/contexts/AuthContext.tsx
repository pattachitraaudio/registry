"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { neoFetch } from "@/lib/neoFetch";
import { validateSessionReqBodyJSON } from "@/app/api/auth/session/validator";
import { iSessionPayload } from "@/lib/session";

interface AuthContextType {
    sessionPayload: iSessionPayload | null;
    // login: (email: string, password: string) => Promise<void>;
    // logout: () => Promise<void>;
    authLoading: boolean;
    authError: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [sessionPayload, setSessionPayload] = useState<iSessionPayload | null>(null);
    const [loading, setLoading] = useState(true);

    const [err, setErr] = useState("");

    useEffect(() => {
        (async function () {
            setLoading(true);

            try {
                const jsonBodyValidationResult = await validateSessionReqBodyJSON({}, {} as iSessionPayload);

                const apiResResult = await neoFetch("/api/auth/session", {
                    method: "GET",
                    body: jsonBodyValidationResult.ret,
                });

                if (apiResResult.err != null) {
                    setErr("err while fetching /api/auth/session");
                    return;
                }

                const apiRes = apiResResult.ret;

                if (apiRes.statusCode !== 200) {
                    setErr("session err:" + apiRes.body.msg);
                    return;
                }

                setSessionPayload(apiRes.body);
            } finally {
                setLoading(false);
            }
        })();
    }, []);
    /*

    async function logout() {
        try {
            await neoFetch("/api/auth/logout", { method: "POST" });
            setUser(null);
        } catch (err) {
            console.error("Logout error:", error);
            throw err;
        }
    }
        */

    return (
        <AuthContext.Provider value={{ sessionPayload, authLoading: loading, authError: err }}>
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

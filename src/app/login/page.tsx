"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { validateLoginReqBodyJSON } from "../api/auth/login/validate";
import { neoFetch } from "@/lib/neoFetch";
import { useAuth } from "@/contexts/AuthContext";
import { APIResCode, getErrMessageFromAPIResCode } from "@/enums/APIResCode";
import { checkEmailURL } from "../checkEmailURL";
// import { LoginResponse } from "@/interfaces/APIResponses/LoginResponse";

export default function LoginPage() {
    const router = useRouter();
    const { sessionPayload, authLoading } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState<boolean>(false);
    const [err, setErr] = useState("");

    useEffect(() => {
        // Redirect if already logged in
        if (!authLoading && sessionPayload != null) {
            router.push("/");
        }
    }, [sessionPayload, authLoading, router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const jsonBody = { email, password };

            const jsonBodyValidationResult = await validateLoginReqBodyJSON(jsonBody);

            if (jsonBodyValidationResult.err != null) {
                return;
            }

            const apiResResult = await neoFetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: jsonBodyValidationResult.ret,
            });

            if (apiResResult.err != null) {
                setErr("failed to fetch /api/auth/login");
                return;
            }

            const apiRes = apiResResult.ret;
            // const statusCode = apiRes.statusCode;

            if (apiRes.statusCode !== 200) {
                // console.error(apiRes.body);

                if (apiRes.body.errCode == APIResCode.Error.Login.EMAIL_NOT_VERIFIED) {
                    router.push(checkEmailURL(email));
                }

                setErr(getErrMessageFromAPIResCode(apiRes.body.errCode));
                return;
            }

            router.push("/");
        } finally {
            setLoading(false);
        }
    }
    /*
    (e) => {

                        (async function () {
                            try {
                                await login(email, password);
                                console.log("pushing /");
                            } catch {
                                // Do nothing
                            }
                        })();
                    }

                    */
    /*
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        */
    /*
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const resObj = (await response.json()) as ErrorResponse | 

            if (resObj.status === APIResCode.GENERIC_ERROR) {
                // If email needs verification, redirect to checkEmail page
                /*
                if (data.needsVerification) {
                    router.push(`/checkEmail?email=${encodeURIComponent(data.email)}`);
                    return;
                }
                setError(resObj.message || "Login failed");
                return;
            }

            // Set user in context
            // setUser((resObj as LoginResponse).data);
            router.push("/");
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
        */
    // };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center border-b-[2px] pb-2 mb-4">Login</CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <form className="mt-2" onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {err && (
                            <div className="rounded-md bg-destructive/10 border border-destructive/50 p-3 text-sm text-destructive">
                                {err}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label className="ml-2" htmlFor="email">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="ml-2" htmlFor="password">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link href="/signUp" className="font-medium text-primary hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

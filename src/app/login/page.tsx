"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
// import { LoginResponse } from "@/interfaces/APIResponses/LoginResponse";

export default function LoginPage() {
    const router = useRouter();
    const { user, login, authLoading, authError } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        // Redirect if already logged in
        if (!authLoading && user) {
            router.push("/");
        }
    }, [user, authLoading, router]);

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
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();

                        (async function () {
                            try {
                                await login(email, password);
                                console.log("pushing /");
                                router.push("/");
                            } catch {
                                // Do nothing
                            }
                        })();
                    }}
                >
                    <CardContent className="space-y-4">
                        {authError && (
                            <div className="rounded-md bg-destructive/10 border border-destructive/50 p-3 text-sm text-destructive">
                                {authError}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
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
                            <Label htmlFor="password">Password</Label>
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
                        <Button type="submit" className="w-full" disabled={authLoading}>
                            {authLoading ? "Logging in..." : "Login"}
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

"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { neoFetch } from "@/neoFetch";
import { APIResCode } from "@/enums/APIResCode";

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error" | "no-token">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("no-token");
            setMessage("No verification token provided");
            return;
        }

        const verifyEmail = async () => {
            try {
                const res = await neoFetch("/api/auth/verifyEmail", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ vfToken: token }),
                });

                if (res.code === APIResCode.SUCCESS) {
                    setStatus("success");
                    setMessage(res.message);
                    setTimeout(() => {
                        router.push("/login");
                    }, 3000);
                } else {
                    setStatus("error");
                    setMessage(res.message || "Verification failed");
                }
            } catch {
                setStatus("error");
                setMessage("An error occurred during verification");
            }
        };

        verifyEmail();
    }, [token, router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
                    <CardDescription className="text-center">
                        {status === "loading" && "Verifying your email address..."}
                        {status === "success" && "Your email has been verified!"}
                        {status === "error" && "Verification failed"}
                        {status === "no-token" && "Invalid verification link"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4 py-8">
                    {status === "loading" && <Loader2 className="h-16 w-16 animate-spin text-neutral-500" />}
                    {status === "success" && <CheckCircle className="h-16 w-16 text-green-600" />}
                    {(status === "error" || status === "no-token") && <XCircle className="h-16 w-16 text-red-600" />}
                    <p className="text-center text-sm text-neutral-600">{message}</p>
                    {status === "success" && (
                        <p className="text-center text-sm text-neutral-500">Redirecting to login...</p>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    {status === "success" && <Button onClick={() => router.push("/login")}>Go to Login</Button>}
                    {(status === "error" || status === "no-token") && (
                        <Button variant="default" onClick={() => router.push("/signUp")}>
                            Back to Sign Up
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-background-50 p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
                            <CardDescription className="text-center">Loading...</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center space-y-4 py-8">
                            <Loader2 className="h-16 w-16 animate-spin text-neutral-500" />
                        </CardContent>
                    </Card>
                </div>
            }
        >
            <VerifyEmailContent />
        </Suspense>
    );
}

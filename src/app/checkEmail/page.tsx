"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Loader2 } from "lucide-react";

/*
export default function CheckEmailPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleResend = async () => {
        if (!email) return;

        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await fetch("/api/auth/resendverification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Verification email sent successfully!");
            } else {
                setError(data.error || "Failed to resend email");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-120">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-neutral-100 p-3">
                            <Mail className="h-8 w-8 text-neutral-700" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">Check your email</CardTitle>
                    <CardDescription className="text-center">We&apos;ve sent a verification link to</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-center font-medium text-primary">{email}</p>
                    <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800">
                        <p className="font-medium mb-1">Please verify your email address</p>
                        <p>Click the link in the email to verify your account. The link will expire in 24 hours.</p>
                    </div>
                    {message && <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">{message}</div>}
                    {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>}
                    <div className="text-center text-sm text-muted-foreground">
                        <p>Didn&apos;t receive the email?</p>
                        <p>Check your spam folder or request a new one.</p>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <Button
                        onClick={handleResend}
                        disabled={loading}
                        variant="outline"
                        className="w-full bg-primary text-primary-foreground"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            "Resend verification email"
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

*/

function CheckEmailContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleResend = async () => {
        if (!email) return;
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await fetch("/api/auth/resendverification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Verification email sent successfully!");
            } else {
                setError(data.error || "Failed to resend email");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-120">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-neutral-100 p-3">
                            <Mail className="h-8 w-8 text-neutral-700" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">Check your email</CardTitle>
                    <CardDescription className="text-center">We&apos;ve sent a verification link to</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-center font-medium text-primary">{email}</p>
                    <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800">
                        <p className="font-medium mb-1">Please verify your email address</p>
                        <p>Click the link in the email to verify your account. The link will expire in 24 hours.</p>
                    </div>
                    {message && <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">{message}</div>}
                    {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>}
                    <div className="text-center text-sm text-muted-foreground">
                        <p>Didn&apos;t receive the email?</p>
                        <p>Check your spam folder or request a new one.</p>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <Button
                        onClick={handleResend}
                        disabled={loading}
                        variant="outline"
                        className="w-full bg-primary text-primary-foreground"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            "Resend verification email"
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function CheckEmailPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-background p-4">
                    <Card className="w-120">
                        <CardHeader>
                            <div className="flex justify-center mb-4">
                                <div className="rounded-full bg-neutral-100 p-3">
                                    <Mail className="h-8 w-8 text-neutral-700" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl text-center">Loading...</CardTitle>
                        </CardHeader>
                    </Card>
                </div>
            }
        >
            <CheckEmailContent />
        </Suspense>
    );
}

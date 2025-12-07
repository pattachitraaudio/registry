"use client";

declare global {
    interface Window {
        cloudflareTurnstileOnSuccessCallback?: (token: string) => void;
        cloudflareTurnstileOnErrorCallback?: () => void;
        cloudflareTurnstileOnExpiredCallback?: () => void;
        turnstile: Turnstile.Turnstile;
    }
}

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import Script from "next/script";
import { neoFetch } from "@/lib/neoFetch";
import { validateSignUpReqBodyJSON } from "../api/auth/signUp/validate";
import { checkEmailURL } from "../checkEmailURL";

/*
interface iSignUpForm {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    referralCode: string;

    // state:
}
    */

export default function SignUpPage() {
    const router = useRouter();
    const { sessionPayload, authLoading } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [referralCode, setReferralCode] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [formSubmissionState, setFormSubmissionState] = useState<true | false>(false);
    const [captchaRes, setCaptchaRes] = useState("");
    const turnstileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Redirect if already logged in
        if (!authLoading && sessionPayload != null) {
            router.push("/");
        }
    }, [sessionPayload, authLoading, router]);

    // Expose turnstile functions
    useEffect(() => {
        window.cloudflareTurnstileOnSuccessCallback = function (token: string) {
            setFormSubmissionState(true);
            setCaptchaRes(token);
        };
        window.cloudflareTurnstileOnErrorCallback = function () {
            console.error("turnstile err");
        };
        window.cloudflareTurnstileOnExpiredCallback = function () {
            console.error("turnstile expired");
        };

        return () => {
            delete window.cloudflareTurnstileOnSuccessCallback;
            delete window.cloudflareTurnstileOnErrorCallback;
            delete window.cloudflareTurnstileOnExpiredCallback;
        };
    });

    async function handleFormValidationErr(errCode: number) {
        console.error("form validation errCode:", errCode);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const jsonBody = { name, email, password, referralCode, captchaRes };
            const jsonBodyValidationResult = await validateSignUpReqBodyJSON(jsonBody);

            if (jsonBodyValidationResult.err != null) {
                handleFormValidationErr(jsonBodyValidationResult.err);
                return;
            }

            const apiResResult = await neoFetch("/api/auth/signUp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: jsonBodyValidationResult.ret,
            });

            if (apiResResult.err != null) {
                console.error("apiRes error: ", apiResResult.err);
                setError("failed to fetch /api/auth/signUp");
                return;
            }

            const apiRes = apiResResult.ret;

            if (apiRes.statusCode !== 201) {
                // const err = apiRes.body;
                if (turnstileRef.current) {
                    window.turnstile.reset(turnstileRef.current);
                }
                console.error("api response err");

                // setError(apiRes.body)
                return;
            }

            router.push(checkEmailURL(email));
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex flex-col min-h-screen items-center justify-center bg-background p-8">
            <h1 className="mb-10 text-[2rem] text-center">Pattachitra registry</h1>
            <Card className="w-120">
                <CardHeader>
                    <CardTitle className="text-center text-2xl mb-4">Sign up</CardTitle>
                    <CardDescription>Enter your information below to create your account</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && <CardContent className="text-xs text-[#e5484d]">{error}</CardContent>}
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="romeo@pattachitra.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <FieldDescription>
                                    Must be 8 to 64 characters in length and must contain at least one uppercase letter,
                                    one lowercase letter, one number, and one special character
                                </FieldDescription>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="referralCode">Referral code</FieldLabel>
                                <Input
                                    id="referralCode"
                                    type="text"
                                    required
                                    placeholder="REF0123456789ABCDEF0123456789ABCDEF"
                                    value={referralCode}
                                    onChange={(e) => setReferralCode(e.target.value)}
                                />
                            </Field>
                            <FieldGroup>
                                <Field
                                    className="grid justify-center cf-turnstile"
                                    data-sitekey="0x4AAAAAAB6mq_Lf3mTf0mCa"
                                    data-theme="dark"
                                    data-size="normal"
                                    data-callback="cloudflareTurnstileOnSuccessCallback"
                                    data-error-callback="cloudflareTurnstileOnErrorCallback"
                                    data-expired-callback="cloudflareTurnstileOnExpiredCallback"
                                    ref={turnstileRef}
                                ></Field>
                                <Field>
                                    <Button disabled={!formSubmissionState} type="submit">
                                        {loading ? "Creating account..." : "Sign up"}
                                    </Button>
                                    <FieldDescription className="px-6 text-center">
                                        Already have an account?{" "}
                                        <Link href="/login" className="font-medium text-primary hover:underline">
                                            Login
                                        </Link>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></Script>
        </main>
    );
}

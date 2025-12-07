"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { neoFetch } from "@/lib/neoFetch";
import { validateVerifyEmailReqBodyJSON } from "../api/auth/verifyEmail/validate";
import { ValueOf } from "@/lib/enum";

const STATUS = {
    LOADING: { val: 0, msg: "Verifying your email address..." },
    SUCCESS: { val: 1, msg: "Your email has been verified!" },
    ERROR: { val: 2, msg: "Verification failed" },
    TOKEN_NOT_PRESENT: { val: 3, msg: "Invalid verification link" },
} as const;

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const vfToken = searchParams.get("vfToken");

    const [status, setStatus] = useState<ValueOf<typeof STATUS>>(STATUS.LOADING);
    const [err, setErr] = useState("");

    useEffect(() => {
        if (!vfToken) {
            setStatus(STATUS.TOKEN_NOT_PRESENT);
            setErr("No verification token provided");
            return;
        }

        async function handleVerifyEmail() {
            if (vfToken == null) {
                return;
            }

            try {
                const jsonBody = { vfToken };
                const jsonBodyValidationResult = await validateVerifyEmailReqBodyJSON(jsonBody);

                if (jsonBodyValidationResult.err != null) {
                    setStatus(STATUS.ERROR);
                    setErr("Invalid 'vfToken'");
                    return;
                }

                const apiResResult = await neoFetch("/api/auth/verifyEmail", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: jsonBodyValidationResult.ret,
                });

                if (apiResResult.err != null) {
                    setErr("Err fetching /api/auth/verifyEmail");
                    setStatus(STATUS.ERROR);
                    return;
                }

                const apiRes = apiResResult.ret;

                if (apiRes.statusCode !== 200) {
                    const err = apiRes.body;
                    setErr("API err: " + err.message);
                    setStatus(STATUS.ERROR);
                    return;
                }

                router.push("/login");
            } catch {
                setErr("Verification failed");
            } finally {
            }
        }

        handleVerifyEmail();
    }, [vfToken, router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
                    <CardDescription className="text-center">{status.msg}</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col items-center space-y-4 py-8">
                    {STATUS.LOADING === status && <Loader2 className="h-16 w-16 animate-spin text-neutral-500" />}
                    {STATUS.SUCCESS === status && (
                        <>
                            <CheckCircle className="h-16 w-16 text-green-600" />
                        </>
                    )}
                    {(status === STATUS.TOKEN_NOT_PRESENT || status === STATUS.ERROR) && (
                        <XCircle className="h-16 w-16 text-red-600" />
                    )}

                    <p className="text-center text-sm text-neutral-600">{err}</p>
                    {STATUS.SUCCESS == status && (
                        <p className="text-center text-sm text-neutral-500">Redirecting to login...</p>
                    )}
                </CardContent>

                <CardFooter className="flex justify-center">
                    {STATUS.SUCCESS === status && <Button onClick={() => router.push("/login")}>Go to Login</Button>}
                    {(STATUS.TOKEN_NOT_PRESENT === status || STATUS.ERROR === status) && (
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

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Loader2, CheckCircle } from "lucide-react";

interface AddAccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
    onAccountAdded: () => void;
}

type DialogState = "form" | "validating" | "validated";

export function AddAccountDialog({
    open,
    onOpenChange,
    userId,
    onAccountAdded,
}: AddAccountDialogProps) {
    const [state, setState] = useState<DialogState>("form");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [validationData, setValidationData] = useState<any>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleValidate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setState("validating");

        try {
            const response = await fetch("/api/accounts/validate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ apiKey }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "API key validation failed");
                setState("form");
                return;
            }

            setValidationData(data.data);
            setState("validated");
        } catch (err) {
            setError("Failed to validate API key");
            setState("form");
        }
    };

    const handleAddAccount = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/accounts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    email,
                    password,
                    apiKey,
                    validationData,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to add account");
                return;
            }

            // Reset form and close dialog
            setEmail("");
            setPassword("");
            setApiKey("");
            setValidationData(null);
            setState("form");
            onOpenChange(false);
            onAccountAdded();
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setEmail("");
        setPassword("");
        setApiKey("");
        setValidationData(null);
        setState("form");
        setError("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogClose onClick={handleClose} />
                <DialogHeader>
                    <DialogTitle>Add New Account</DialogTitle>
                    <DialogDescription>
                        {state === "form" &&
                            "Enter the account credentials and API key"}
                        {state === "validating" && "Validating API key..."}
                        {state === "validated" &&
                            "API key validated successfully!"}
                    </DialogDescription>
                </DialogHeader>

                {state === "form" && (
                    <form onSubmit={handleValidate} className="space-y-4 py-4">
                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Account Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="account@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Account Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="apiKey">API Key</Label>
                            <Input
                                id="apiKey"
                                type="text"
                                placeholder="Enter your API key"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Validate API Key</Button>
                        </DialogFooter>
                    </form>
                )}

                {state === "validating" && (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <Loader2 className="h-12 w-12 animate-spin text-neutral-500" />
                        <p className="text-sm text-neutral-600">
                            Validating your API key...
                        </p>
                    </div>
                )}

                {state === "validated" && (
                    <div className="space-y-4 py-4">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                            <div className="rounded-md bg-green-50 p-4 w-full">
                                <p className="font-medium text-green-800 mb-2">
                                    API Key Validated Successfully!
                                </p>
                                {validationData && (
                                    <div className="text-sm text-green-700">
                                        <p>Status: {validationData.status}</p>
                                        {validationData.accountType && (
                                            <p>
                                                Account Type:{" "}
                                                {validationData.accountType}
                                            </p>
                                        )}
                                        {validationData.expiresAt && (
                                            <p>
                                                Expires:{" "}
                                                {new Date(
                                                    validationData.expiresAt,
                                                ).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                                {error}
                            </div>
                        )}
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAddAccount}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    "Add Account"
                                )}
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

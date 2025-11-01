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
import { Loader2 } from "lucide-react";
import { formatCurrency, ACCOUNT_VALUE_INR } from "@/constants";

interface RedeemDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
    availableAccounts: number;
    onRedeemed: () => void;
}

export function RedeemDialog({ open, onOpenChange, userId, availableAccounts, onRedeemed }: RedeemDialogProps) {
    const [accountsToRedeem, setAccountsToRedeem] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const totalValue = accountsToRedeem * ACCOUNT_VALUE_INR;

    const handleRedeem = async () => {
        if (accountsToRedeem <= 0 || accountsToRedeem > availableAccounts) {
            setError(`Please enter a value between 1 and ${availableAccounts}`);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/redemptions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    accountsToRedeem,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Redemption failed");
                return;
            }

            // Success
            setAccountsToRedeem(1);
            onOpenChange(false);
            onRedeemed();
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogClose onClick={() => onOpenChange(false)} />
                <DialogHeader>
                    <DialogTitle>Redeem Accounts</DialogTitle>
                    <DialogDescription>Select the number of accounts you want to redeem</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>}

                    <div className="space-y-2">
                        <Label htmlFor="accounts">Number of Accounts</Label>
                        <Input
                            id="accounts"
                            type="number"
                            min="1"
                            max={availableAccounts}
                            value={accountsToRedeem}
                            onChange={(e) => setAccountsToRedeem(parseInt(e.target.value) || 1)}
                        />
                        <p className="text-xs text-neutral-500">Available to redeem: {availableAccounts} accounts</p>
                    </div>

                    <div className="rounded-lg bg-green-50 p-4 border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-900">Total Redemption Value</p>
                                <p className="text-xs text-green-700">
                                    {accountsToRedeem} × {formatCurrency(ACCOUNT_VALUE_INR)}
                                </p>
                            </div>
                            <p className="text-2xl font-bold text-green-700">{formatCurrency(totalValue)}</p>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleRedeem} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Redeeming...
                            </>
                        ) : (
                            "Redeem Now"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Wallet, Calendar } from "lucide-react";
import { formatCurrency } from "@/constants";

interface MetricsCardsProps {
    totalClaimableValue: number;
    currentMonthAccounts: number;
    accountValueINR: number;
}

export function MetricsCards({ totalClaimableValue, currentMonthAccounts, accountValueINR }: MetricsCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Value Per Account</CardTitle>
                    <Wallet className="h-4 w-4 text-neutral-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(accountValueINR)}</div>
                    <p className="text-xs text-neutral-500 mt-1">Current market value</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Accounts This Month</CardTitle>
                    <Calendar className="h-4 w-4 text-neutral-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{currentMonthAccounts}</div>
                    <p className="text-xs text-neutral-500 mt-1">Created in current month</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Claimable Value</CardTitle>
                    <TrendingUp className="h-4 w-4 text-neutral-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(totalClaimableValue)}</div>
                    <p className="text-xs text-neutral-500 mt-1">From unredeemed accounts</p>
                </CardContent>
            </Card>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/constant";

interface Redemption {
    _id: string;
    accountsRedeemed: number;
    totalValue: number;
    redeemedAt: string;
}

interface RedemptionHistoryProps {
    userId: string;
}

export function RedemptionHistory({ userId }: RedemptionHistoryProps) {
    const [redemptions, setRedemptions] = useState<Redemption[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRedemptions();
    }, [userId]);

    const fetchRedemptions = async () => {
        try {
            /*
            const response = await fetch(`/api/redemptions?userId=${userId}`);
            const data = await response.json();

            if (response.ok) {
                setRedemptions(data.redemptions);
            }
                */
        } catch (error) {
            console.error("Failed to fetch redemptions:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Redemption History</CardTitle>
                <p className="text-sm text-neutral-500">Track your account redemptions</p>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-neutral-600">Loading history...</p>
                    </div>
                ) : redemptions.length === 0 ? (
                    <div className="flex items-center justify-center py-8 text-neutral-500">
                        <p>No redemptions yet</p>
                    </div>
                ) : (
                    <div className="rounded-lg border border-neutral-200">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead className="text-right">Accounts</TableHead>
                                    <TableHead className="text-right">Total Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {redemptions.map((redemption) => (
                                    <TableRow key={redemption._id}>
                                        <TableCell>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {new Date(redemption.redeemedAt).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </p>
                                                <p className="text-xs text-neutral-500">
                                                    {new Date(redemption.redeemedAt).toLocaleTimeString("en-US", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className="font-medium">{redemption.accountsRedeemed}</span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className="font-semibold text-green-600">
                                                {formatCurrency(redemption.totalValue)}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

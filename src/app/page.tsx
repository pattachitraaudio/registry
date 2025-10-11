"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { AccountsTable } from "@/components/AccountsTable";
import { AddAccountDialog } from "@/components/AddAccountDialog";
import { MetricsCards } from "@/components/MetricsCards";
import { AccountsChart } from "@/components/AccountsChart";
import { RedeemDialog } from "@/components/RedeemDialog";
import { RedemptionHistory } from "@/components/RedemptionHistory";
import { Plus, LogOut } from "lucide-react";

interface Account {
    _id: string;
    email: string;
    apiKey: string;
    isActive: boolean;
    validationData?: any;
    createdAt: string;
    updatedAt: string;
}

interface Metrics {
    totalAccounts: number;
    currentMonthAccounts: number;
    accountsRedeemed: number;
    unredeemedAccounts: number;
    totalClaimableValue: number;
    accountValueINR: number;
    chartData: { label: string; count: number }[];
}

export default function Home() {
    const router = useRouter();
    const { user, logout, loading: authLoading } = useAuth();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [redeemDialogOpen, setRedeemDialogOpen] = useState(false);
    const [period, setPeriod] = useState<"day" | "week" | "month">("month");

    useEffect(() => {
        // Wait for auth to finish loading
        if (authLoading) return;

        if (!user) {
            router.push("/login");
            return;
        }
        fetchAccounts();
        fetchMetrics();
    }, [user, authLoading, router, period]);

    const fetchAccounts = async () => {
        if (!user) return;

        try {
            const response = await fetch(
                `/api/accounts?userId=${user._id}`,
            );
            const data = await response.json();

            if (response.ok) {
                setAccounts(data.accounts);
            }
        } catch (error) {
            console.error("Failed to fetch accounts:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMetrics = async () => {
        if (!user) return;

        try {
            const response = await fetch(
                `/api/accounts/metrics?userId=${user._id}&period=${period}`,
            );
            const data = await response.json();

            if (response.ok) {
                setMetrics(data);
            }
        } catch (error) {
            console.error("Failed to fetch metrics:", error);
        }
    };

    const handleDeleteAccount = async (accountId: string) => {
        if (!user) return;

        try {
            const response = await fetch(
                `/api/accounts?accountId=${accountId}&userId=${user._id}`,
                {
                    method: "DELETE",
                },
            );

            if (response.ok) {
                setAccounts(accounts.filter((acc) => acc._id !== accountId));
                fetchMetrics(); // Refresh metrics after deletion
            }
        } catch (error) {
            console.error("Failed to delete account:", error);
        }
    };

    const handlePeriodChange = (newPeriod: "day" | "week" | "month") => {
        setPeriod(newPeriod);
    };

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    // Show loading state while checking authentication
    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-card border-b border-border">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Keymaster
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Welcome, {user.name}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Metrics Cards */}
                {metrics && (
                    <MetricsCards
                        totalClaimableValue={metrics.totalClaimableValue}
                        currentMonthAccounts={metrics.currentMonthAccounts}
                        accountValueINR={metrics.accountValueINR}
                    />
                )}

                {/* Accounts Chart */}
                {metrics && metrics.chartData.length > 0 && (
                    <div className="mb-6">
                        <AccountsChart
                            data={metrics.chartData}
                            period={period}
                            onPeriodChange={handlePeriodChange}
                        />
                    </div>
                )}

                {/* Redemption Section */}
                {metrics && metrics.unredeemedAccounts > 0 && (
                    <div className="mb-6">
                        <Button
                            onClick={() => setRedeemDialogOpen(true)}
                            variant="default"
                            size="lg"
                            className="w-full sm:w-auto"
                        >
                            Redeem Accounts ({metrics.unredeemedAccounts} available)
                        </Button>
                    </div>
                )}

                {/* Redemption History */}
                {user && (
                    <div className="mb-6">
                        <RedemptionHistory userId={user._id} />
                    </div>
                )}

                {/* Accounts Table Section */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">
                            Your Accounts
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Manage your connected accounts
                        </p>
                    </div>
                    <Button
                        onClick={() => setDialogOpen(true)}
                        className="gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add Account
                    </Button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <p className="text-muted-foreground">Loading accounts...</p>
                    </div>
                ) : (
                    <AccountsTable
                        accounts={accounts}
                        onDelete={handleDeleteAccount}
                    />
                )}
            </main>

            {/* Add Account Dialog */}
            <AddAccountDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                userId={user._id}
                onAccountAdded={() => {
                    fetchAccounts();
                    fetchMetrics();
                }}
            />

            {/* Redeem Dialog */}
            {metrics && (
                <RedeemDialog
                    open={redeemDialogOpen}
                    onOpenChange={setRedeemDialogOpen}
                    userId={user._id}
                    availableAccounts={metrics.unredeemedAccounts}
                    onRedeemed={() => {
                        fetchAccounts();
                        fetchMetrics();
                    }}
                />
            )}
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { AccountsTable } from "@/components/AccountsTable";
import { AddAccountDialog } from "@/components/AddAccountDialog";
// import { RedemptionHistory } from "@/components/RedemptionHistory";
import { Plus, LogOut } from "lucide-react";
// import { IAccount } from "@/interfaces/IAccount";
// import { IUser } from "@/interfaces/IUser";
// import { AccountsResponse } from "@/interfaces/APIResponses/AccountsResponse";

export default function Home() {
    const router = useRouter();
    const { user, logout, authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);

    const fetchAccounts = async () => {
        if (!user) return;

        /*
        try {
            const res = await fetch(`/api/accounts`);
            const resObj = (await res.json()) as AccountsResponse;

            if (res.status === 200) {
                setAccounts(resObj.data.accounts);
            }
        } catch (error) {
            console.error("Failed to fetch accounts:", error);
        } finally {
            setLoading(false);
        }
            */
    };

    const handleLogout = () => {
        logout();
    };

    useEffect(() => {
        // Wait for auth to finish loading
        console.log("authLoading:", authLoading);
        if (authLoading) return;

        if (!user) {
            console.log("Wow, User:", user);
            router.push("/login");
            return;
        }
        fetchAccounts();
    }, [user, authLoading]);

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
                        <h1 className="text-2xl font-bold text-foreground"></h1>
                        <p className="text-sm text-muted-foreground">Welcome, {user.name}</p>
                    </div>
                    <Button variant="outline" onClick={handleLogout} className="gap-2">
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Accounts Table Section */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Your Accounts</h2>
                        <p className="text-sm text-muted-foreground">Manage your connected accounts</p>
                    </div>
                    <Button onClick={() => setDialogOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Account
                    </Button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <p className="text-muted-foreground">Loading accounts...</p>
                    </div>
                ) : (
                    <AccountsTable accounts={accounts} onDelete={handleDeleteAccount} />
                )}
            </main>

            {/* Add Account Dialog */}
            <AddAccountDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                userId={user.id}
                onAccountAdded={() => {
                    fetchAccounts();
                    fetchMetrics();
                }}
            />

            {/* Redeem Dialog */}
            {/*metrics && (
                <RedeemDialog
                    open={redeemDialogOpen}
                    onOpenChange={setRedeemDialogOpen}
                    userId={user.id}
                    availableAccounts={metrics.unredeemedAccounts}
                    onRedeemed={() => {
                        fetchAccounts();
                        fetchMetrics();
                    }}
                />
            )*/}
        </div>
    );
}

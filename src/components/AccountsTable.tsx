"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Eye, EyeOff, Trash2, CheckCircle, XCircle } from "lucide-react";

interface Account {
    _id: string;
    email: string;
    apiKey: string;
    isActive: boolean;
    validationData?: any;
    createdAt: string;
    updatedAt: string;
}

interface AccountsTableProps {
    accounts: Account[];
    onDelete: (accountId: string) => void;
}

export function AccountsTable({ accounts, onDelete }: AccountsTableProps) {
    const [visibleApiKeys, setVisibleApiKeys] = useState<Set<string>>(
        new Set(),
    );

    const toggleApiKeyVisibility = (accountId: string) => {
        setVisibleApiKeys((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(accountId)) {
                newSet.delete(accountId);
            } else {
                newSet.add(accountId);
            }
            return newSet;
        });
    };

    const handleDelete = async (accountId: string) => {
        if (!confirm("Are you sure you want to delete this account?")) {
            return;
        }
        onDelete(accountId);
    };

    const maskApiKey = (apiKey: string) => {
        if (apiKey.length <= 8) return "••••••••";
        return "••••" + apiKey.slice(-4);
    };

    return (
        <div className="rounded-lg border bg-card shadow-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[220px]">Email</TableHead>
                        <TableHead className="w-[280px]">API Key</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                        <TableHead className="w-[130px]">Added Date</TableHead>
                        <TableHead className="w-[120px] text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {accounts.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="text-center py-8 text-muted-foreground"
                            >
                                No accounts found. Add your first account to get
                                started.
                            </TableCell>
                        </TableRow>
                    ) : (
                        accounts.map((account) => (
                            <TableRow key={account._id}>
                                <TableCell className="font-medium">
                                    {account.email}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                                            {visibleApiKeys.has(account._id)
                                                ? account.apiKey
                                                : maskApiKey(account.apiKey)}
                                        </code>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() =>
                                                toggleApiKeyVisibility(
                                                    account._id,
                                                )
                                            }
                                        >
                                            {visibleApiKeys.has(account._id) ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {account.isActive ? (
                                            <>
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                <span className="text-sm text-green-700">
                                                    Active
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="h-4 w-4 text-red-600" />
                                                <span className="text-sm text-red-700">
                                                    Inactive
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-muted-foreground">
                                        {new Date(
                                            account.createdAt,
                                        ).toLocaleDateString()}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(account._id)}
                                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

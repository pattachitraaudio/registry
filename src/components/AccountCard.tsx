"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Trash2, CheckCircle, Clock } from "lucide-react";

interface AccountCardProps {
    account: {
        _id: string;
        email: string;
        isActive: boolean;
        validationData?: any;
        createdAt: string;
        updatedAt: string;
    };
    onDelete: (accountId: string) => void;
}

export function AccountCard({ account, onDelete }: AccountCardProps) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this account?")) {
            return;
        }

        setDeleting(true);
        await onDelete(account._id);
        setDeleting(false);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                            {account.email}
                            {account.isActive && (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                        </CardTitle>
                        <CardDescription>
                            Added{" "}
                            {new Date(account.createdAt).toLocaleDateString()}
                        </CardDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            {account.validationData && (
                <CardContent>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-neutral-600">Status:</span>
                            <span className="font-medium capitalize">
                                {account.validationData.status}
                            </span>
                        </div>
                        {account.validationData.accountType && (
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-600">
                                    Account Type:
                                </span>
                                <span className="font-medium capitalize">
                                    {account.validationData.accountType}
                                </span>
                            </div>
                        )}
                        {account.validationData.expiresAt && (
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-600 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Expires:
                                </span>
                                <span className="font-medium">
                                    {new Date(
                                        account.validationData.expiresAt,
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>
                </CardContent>
            )}
            <CardFooter>
                <div className="w-full">
                    <div
                        className={`text-xs px-2 py-1 rounded-full inline-block ${
                            account.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-neutral-100 text-neutral-800"
                        }`}
                    >
                        {account.isActive ? "Active" : "Inactive"}
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}

"use client";

import { useState, useEffect, useReducer, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, RefreshCw, DeleteIcon, Trash2, RefreshCcw } from "lucide-react";

import { accountProviders } from "@/constants/accountProviders";

type AccountProviderValue = keyof typeof accountProviders;

type tElevenLabsAcc = {
    email: string;
    apiKey: string;
    user?: tElevenLabsUserRes;
};
export default function Home() {
    const router = useRouter();
    const { user, logout, authLoading } = useAuth();

    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [accountProviderValue, setAccountProviderValue] = useState<AccountProviderValue>("elevenLabs");
    const [elevenlabsAccounts, setElevenlabsAccounts] = useState<tElevenLabsAcc[] | null>(null);

    const [isSelected, setIsSelected] = useState(false);

    async function getAllElevenLabsAccounts() {
        if (!user) return;

        setLoading(true);
        setErr("");

        try {
            const res = await neoFetch("/api/account/elevenLabs/get", { method: "GET" });

            if (res.code !== APIResCode.SUCCESS) {
                setErr(res.message);
                return;
            }

            setElevenlabsAccounts(res.data.accounts);
        } catch (err) {
            setErr("Error getting your elevenlabs accounts");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // Wait for auth to finish loading
        console.log("authLoading:", authLoading);
        if (authLoading) return;

        if (!user) {
            console.log("Wow, User:", user);
            router.push("/login");
            return;
        }

        getAllElevenLabsAccounts();
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

    function handleDeleteAccount() {}

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-card border-b border-border">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground"></h1>
                        <p className="text-sm text-muted-foreground">Welcome, {user.name}</p>
                    </div>
                    <Button variant="outline" onClick={logout} className="gap-2">
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 text-center">
                <header className="flex items-center justify-center gap-[1em] mb-[4em]">
                    <p>Provider: </p>
                    <SelectAccountProvider value={accountProviderValue} setValue={setAccountProviderValue} />
                </header>
                {/* Accounts Table Section */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Your Accounts</h2>
                        <p className="text-sm text-muted-foreground">Manage your connected accounts</p>
                    </div>
                    <div className="flex gap-[1em]">
                        <Button disabled={!isSelected}>
                            <RefreshCcw />
                        </Button>
                        <Button disabled={!isSelected}>
                            <Trash2 />
                        </Button>
                        <Button onClick={() => setDialogOpen(true)} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add account
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <p className="text-muted-foreground">Loading accounts...</p>
                    </div>
                ) : elevenlabsAccounts != null ? (
                    <ElevenLabsAccountTable
                        accounts={elevenlabsAccounts}
                        onSelectDeselect={(isSelected: boolean) => {
                            setIsSelected(isSelected);
                        }}
                        onAccDel={(delAcc: tElevenLabsAcc) => {
                            setElevenlabsAccounts((acc) => {
                                if (acc == null) {
                                    return null;
                                }

                                return acc.filter((currAcc) => delAcc.apiKey == currAcc.apiKey);
                            });
                        }}
                    />
                ) : (
                    <></>
                )}
            </main>

            {/* Add Account Dialog */}
            <ElevenLabsAddAccountDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onAccountAdded={(account: tElevenLabsAcc) => {
                    setElevenlabsAccounts((elevenlabsAccounts) => {
                        if (elevenlabsAccounts == null) {
                            return null;
                        }

                        return [...elevenlabsAccounts, account];
                    });
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

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

function SelectAccountProvider({
    value,
    setValue,
}: {
    value: AccountProviderValue;
    setValue: Dispatch<SetStateAction<AccountProviderValue>>;
}) {
    return (
        <Select
            onValueChange={(value) => {
                setValue(value as AccountProviderValue);
            }}
        >
            <SelectTrigger className="w-[180px]">{accountProviders[value]}</SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <>
                        {Object.entries(accountProviders).map(([key, val]) => (
                            <SelectItem value={key} key={key}>
                                {val}
                            </SelectItem>
                        ))}
                    </>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

/*
const data: Payment[] = [
    {
        id: "m5gr84i9",
        amount: 316,
        status: "success",
        email: "ken99@example.com",
    },
    {
        id: "3u1reuv4",
        amount: 242,
        status: "success",
        email: "Abe45@example.com",
    },
    {
        id: "derv1ws0",
        amount: 837,
        status: "processing",
        email: "Monserrat44@example.com",
    },
    {
        id: "5kma53ae",
        amount: 874,
        status: "success",
        email: "Silas22@example.com",
    },
    {
        id: "bhqecj4p",
        amount: 721,
        status: "failed",
        email: "carmella@example.com",
    },
];
*/

/*
export type Payment = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
};

export const columns: ColumnDef<Payment>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Email
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"));

            // Format the amount as a dollar amount
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);

            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const payment = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

*/

function ElevenLabsAccountTable({
    accounts,
    onAccDel,
    onSelectDeselect,
}: {
    accounts: tElevenLabsAcc[];
    onAccDel: (delAcc: tElevenLabsAcc) => void;
    onSelectDeselect: (isSelected: boolean) => void;
}) {
    /*
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        accounts,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });
                <Input
                    placeholder="Filter emails..."
                    value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                        // {table.getHeaderGroups().map((headerGroup) => (
                                {headerGroup.headers.map((header) => {
                                    return (
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                    );
                                })}
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                    {row.getVisibleCells().map((cell) => (
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length}{" "}
                    row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    */

    // let [isAllSelected, setIsAllSelected] = useState<boolean>(false);
    const SelectAll = Array.from({ length: accounts.length }).map(() => true);
    const UnselectAll = Array.from({ length: accounts.length }).map(() => false);

    // const [numRowsSel, setNumRowsSel] = useState<number>(0);
    const [isSelArr, setIsSelArr] = useState<boolean[]>(UnselectAll);

    const NumRowsEvent = {
        INC: 0,
        DEC: 1,
        NONE: 2,
        ALL: 3,
    } as const;

    const [numRowsSel, dispatch] = useReducer(function (
        state,
        { event }: { event: (typeof NumRowsEvent)[keyof typeof NumRowsEvent] },
    ) {
        switch (event) {
            case NumRowsEvent.NONE:
                return 0;
            case NumRowsEvent.ALL:
                return accounts.length;
            case NumRowsEvent.INC:
                return state + 1;
            case NumRowsEvent.DEC:
                return state - 1;
        }
    }, 0);

    useEffect(() => {
        numRowsSel === 0 ? onSelectDeselect(false) : onSelectDeselect(true);
    }, [numRowsSel]);

    function formatAPIKey(apiKey: string) {
        return "••••" + apiKey.slice(apiKey.length - 6);
    }

    return (
        <div className="w-full">
            <div className="flex items-center py-4"></div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">
                                <Checkbox
                                    checked={accounts.length !== 0 && numRowsSel === accounts.length}
                                    onCheckedChange={(isAllSel: boolean) => {
                                        if (accounts.length === 0) {
                                            return;
                                        }

                                        return isAllSel
                                            ? (setIsSelArr(SelectAll), dispatch({ event: NumRowsEvent.ALL }))
                                            : (setIsSelArr(UnselectAll), dispatch({ event: NumRowsEvent.NONE }));
                                    }}
                                />
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>API Key</TableHead>
                            <TableHead>Credits Remaining</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {accounts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        ) : (
                            <>
                                {accounts.map((acc, i) => (
                                    <TableRow key={acc.apiKey} data-state={"selected"}>
                                        <TableCell key={0}>
                                            <Checkbox
                                                checked={isSelArr.at(i)}
                                                onCheckedChange={(isSel) => {
                                                    dispatch({ event: isSel ? NumRowsEvent.INC : NumRowsEvent.DEC });
                                                    setIsSelArr((isSelArr) =>
                                                        isSelArr.map((isSelCurr, j) =>
                                                            i === j ? !isSelCurr : isSelCurr,
                                                        ),
                                                    );
                                                }}
                                                aria-label="Select all"
                                            />
                                        </TableCell>
                                        <TableCell key={1}>{acc.user?.firstName || "--"}</TableCell>
                                        <TableCell key={2}>{acc.email}</TableCell>
                                        <TableCell key={3}>{formatAPIKey(acc.apiKey)}</TableCell>
                                        <TableCell key={4}>
                                            {acc.user
                                                ? `${acc.user.subscription.characterLimit - acc.user.subscription.characterCount} / ${acc.user.subscription.characterLimit}`
                                                : "--"}
                                        </TableCell>
                                        <TableCell key={5}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => window.navigator.clipboard.writeText(acc.apiKey)}
                                                    >
                                                        Copy API Key
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>View customer</DropdownMenuItem>
                                                    <DropdownMenuItem>View payment details</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

interface AddAccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAccountAdded: (account: tElevenLabsAcc) => void;
}

type DialogState = "form" | "validating" | "validated";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle } from "lucide-react";
import { neoFetch } from "@/neoFetch";
import { APIResCode } from "@/enums/APIResCode";
import { sElevenLabsUserResSchema, tElevenLabsUserRes } from "@/schemas/account/sElevenLabsUserResponse";

export function ElevenLabsAddAccountDialog({ open, onOpenChange, onAccountAdded }: AddAccountDialogProps) {
    const [state, setState] = useState<DialogState>("form");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [apiKey, setApiKey] = useState("");

    const [userData, setUserData] = useState<tElevenLabsUserRes | null>(null);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleValidate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setState("validating");

        try {
            // const res = await fetch("https://api.elevenlabs.io/v1/user", {
            const res = await fetch("http://mockapi.elevenlabs.io:8080/user", {
                headers: {
                    "XI-API-KEY": apiKey,
                },
            });

            if (res.status !== 200) {
                setError("API key validation failed");
                setState("form");
                return;
            }

            const resObj = sElevenLabsUserResSchema.parse(await res.json());

            setUserData(resObj);
            setState("validated");
        } catch (err) {
            console.log(err);
            setError("Failed to validate API key");
            setState("form");
        }
    };

    async function handleAddAccount() {
        setLoading(true);
        setError("");

        try {
            const res = await neoFetch("/api/account/elevenLabs/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    apiKey,
                    email,
                    password,
                }),
            });

            if (res.code !== APIResCode.SUCCESS) {
                setError(res.message || "Failed to add account");
                return;
            }

            // Reset form and close dialog
            setEmail("");
            setPassword("");
            setApiKey("");
            setUserData(null);
            setState("form");
            onOpenChange(false);
            onAccountAdded({
                apiKey,
                email,
                user: res.data,
            });
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const handleClose = () => {
        setEmail("");
        setPassword("");
        setApiKey("");
        setUserData(null);
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
                        {state === "form" && "Enter the account credentials and API key"}
                        {state === "validating" && "Validating API key..."}
                        {state === "validated" && "API key validated successfully!"}
                    </DialogDescription>
                </DialogHeader>

                {state === "form" && (
                    <form onSubmit={handleValidate} className="space-y-4 py-4">
                        {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>}
                        <div className="space-y-2">
                            <Label htmlFor="email">Account Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="romeo@pattachitra.studio"
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
                            <Button type="button" variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button type="submit">Validate API Key</Button>
                        </DialogFooter>
                    </form>
                )}

                {state === "validating" && (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <Loader2 className="h-12 w-12 animate-spin text-neutral-500" />
                        <p className="text-sm text-neutral-600">Validating your API key...</p>
                    </div>
                )}

                {state === "validated" && (
                    <div className="space-y-4 py-4">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                            <div className="rounded-md bg-green-50 p-4 w-full">
                                <p className="font-medium text-green-800 mb-2">API Key Validated Successfully!</p>
                                {userData && (
                                    <div className="text-sm text-green-700">
                                        <p>ID: {userData.userID}</p>
                                        <p>
                                            Credits remaining:{" "}
                                            {userData.subscription.characterLimit -
                                                userData.subscription.characterCount}{" "}
                                            / {userData.subscription.characterLimit}
                                        </p>

                                        {/*                                        {validationData.accountType && (
                                            <p>Account Type: {validationData.accountType}</p>
                                        )}
                                        {validationData.expiresAt && (
                                            <p>Expires: {new Date(validationData.expiresAt).toLocaleDateString()}</p>
                                        )}
                                            */}
                                    </div>
                                )}
                            </div>
                        </div>
                        {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>}
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddAccount} disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    "Add account"
                                )}
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

/*
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import type { AccountIndex, AccountValue } from "@/constants/accountProviders";
import { accounts } from "@/constants/accountProviders";

export function Combobox({ setValue }: { setValue: React.Dispatch<React.SetStateAction<AccountValue>> }) {
    const [open, setOpen] = React.useState(false);
    const [index, setIndex] = React.useState<AccountIndex>(0);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                    {accounts[index].label}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {accounts.map((acc, i) => (
                                <CommandItem
                                    key={acc.value}
                                    value={acc.value}
                                    onSelect={() => {
                                        setIndex(i as AccountIndex);
                                        setValue(acc.value);
                                        setOpen(false);
                                    }}
                                >
                                    {acc.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

// <CommandInput placeholder="Search framework..." className="h-9" />

/*
                                    <Check
                                        className={cn("ml-auto", acc === framework.value ? "opacity-100" : "opacity-0")}
                                    />
                                    */

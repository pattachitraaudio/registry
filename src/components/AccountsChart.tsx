"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartData {
    label: string;
    count: number;
}

interface AccountsChartProps {
    data: ChartData[];
    period: "day" | "week" | "month";
    onPeriodChange: (period: "day" | "week" | "month") => void;
}

export function AccountsChart({ data, period, onPeriodChange }: AccountsChartProps) {
    // Format labels based on period type
    const formattedData = data.map((item) => {
        let formattedLabel: string;

        if (period === "day") {
            // Format: 2024-01-15 -> Jan 15
            const date = new Date(item.label);
            formattedLabel = date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
        } else if (period === "week") {
            // Format: 2024-W03 -> Week 3
            const weekNum = item.label.split("-W")[1];
            formattedLabel = `Week ${weekNum}`;
        } else {
            // Format: 2024-01 -> Jan 2024
            const [year, month] = item.label.split("-");
            const date = new Date(parseInt(year), parseInt(month) - 1);
            formattedLabel = date.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
            });
        }

        return {
            label: formattedLabel,
            count: item.count,
        };
    });

    const getPeriodLabel = () => {
        switch (period) {
            case "day":
                return "Daily";
            case "week":
                return "Weekly";
            case "month":
                return "Monthly";
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Accounts Addd Over Time</CardTitle>
                        <p className="text-sm text-neutral-500">{getPeriodLabel()} account creation statistics</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={period === "day" ? "default" : "outline"}
                            size="sm"
                            onClick={() => onPeriodChange("day")}
                        >
                            Day
                        </Button>
                        <Button
                            variant={period === "week" ? "default" : "outline"}
                            size="sm"
                            onClick={() => onPeriodChange("week")}
                        >
                            Week
                        </Button>
                        <Button
                            variant={period === "month" ? "default" : "outline"}
                            size="sm"
                            onClick={() => onPeriodChange("month")}
                        >
                            Month
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {formattedData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={formattedData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#171717" name="Accounts" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-[300px] text-neutral-500">
                        No account data available yet
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

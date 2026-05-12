"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/formatting";

export type CategorySpend = {
  category: string;
  total: number;
  transactionCount: number;
};

export function SpendingCategoryChart({ data }: { data: CategorySpend[] }) {
  return (
    <Card className="h-96">
      <h2 className="text-lg font-semibold">Spending by category</h2>
      <div className="mt-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.slice(0, 8)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dfe4dc" />
            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(value) => formatCurrency(Number(value))} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Bar dataKey="total" fill="#0f766e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

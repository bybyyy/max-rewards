"use client";

import { useEffect, useMemo, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { apiFetch } from "@/lib/apiClient";
import { formatCurrency } from "@/lib/formatting";

type Transaction = {
  id: string;
  merchant: string;
  name: string;
  amount: number;
  date: string;
  category: string;
  pending: boolean;
  accountName: string;
  accountMask: string | null;
};

const ranges = [
  { label: "Past 30 days", value: "30d" },
  { label: "This month", value: "this_month" },
  { label: "Year to date", value: "ytd" },
  { label: "Past year", value: "1y" }
];

export default function TransactionsPage() {
  return (
    <AuthGuard>
      <AppShell>
        <TransactionsContent />
      </AppShell>
    </AuthGuard>
  );
}

function TransactionsContent() {
  const [range, setRange] = useState("30d");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const total = useMemo(
    () => transactions.reduce((sum, transaction) => sum + transaction.amount, 0),
    [transactions]
  );

  async function loadTransactions(nextRange = range) {
    setLoading(true);
    try {
      const payload = await apiFetch<{ transactions: Transaction[] }>(`/dashboard/transactions?range=${nextRange}`);
      setTransactions(payload.transactions);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load transactions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions(range);
  }, [range]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-3xl font-semibold">All transactions</h1>
          <p className="mt-1 text-muted">Review imported spending by merchant, category, amount, and date.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {ranges.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={range === option.value ? "primary" : "secondary"}
              onClick={() => setRange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
      {error ? <Toast message={error} tone="error" /> : null}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-l-brand">
          <p className="text-sm text-muted">Transactions</p>
          <p className="mt-2 text-2xl font-semibold">{transactions.length}</p>
        </Card>
        <Card className="border-l-4 border-l-sky-500">
          <p className="text-sm text-muted">Total amount</p>
          <p className="mt-2 text-2xl font-semibold">{formatCurrency(total)}</p>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <p className="text-sm text-muted">Selected range</p>
          <p className="mt-2 text-2xl font-semibold">{ranges.find((item) => item.value === range)?.label}</p>
        </Card>
      </div>
      <Card className="overflow-hidden p-0">
        <div className="border-b border-line px-5 py-4">
          <h2 className="font-semibold">Transaction history</h2>
          <p className="text-sm text-muted">{loading ? "Loading..." : "Most recent imports first"}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-panel text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Merchant</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Account</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-t border-line">
                  <td className="px-5 py-3">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <div className="font-medium">{transaction.merchant}</div>
                    {transaction.pending ? <div className="text-xs text-amber-700">Pending</div> : null}
                  </td>
                  <td className="px-5 py-3 capitalize">{transaction.category}</td>
                  <td className="px-5 py-3 text-muted">
                    {transaction.accountName} {transaction.accountMask ? `...${transaction.accountMask}` : ""}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold">{formatCurrency(transaction.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {transactions.length === 0 ? (
          <div className="px-5 py-8 text-sm text-muted">No transactions found for this range.</div>
        ) : null}
      </Card>
    </div>
  );
}

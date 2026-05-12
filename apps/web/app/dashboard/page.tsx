"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";
import { PlaidLinkButton } from "@/components/plaid/PlaidLinkButton";
import { ConnectionStatus } from "@/components/plaid/ConnectionStatus";
import {
  SpendingSummaryCards,
  type DashboardSummary
} from "@/components/dashboard/SpendingSummaryCards";
import {
  SpendingCategoryChart,
  type CategorySpend
} from "@/components/dashboard/SpendingCategoryChart";
import { MonthlyTrendChart, type MonthlyTrend } from "@/components/dashboard/MonthlyTrendChart";
import { TopCategories } from "@/components/dashboard/TopCategories";
import { apiFetch } from "@/lib/apiClient";
import { Toast } from "@/components/ui/Toast";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <AppShell>
        <DashboardContent />
      </AppShell>
    </AuthGuard>
  );
}

function DashboardContent() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [categories, setCategories] = useState<CategorySpend[]>([]);
  const [trends, setTrends] = useState<MonthlyTrend[]>([]);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      const [summaryPayload, categoryPayload, trendsPayload] = await Promise.all([
        apiFetch<DashboardSummary>("/dashboard/summary"),
        apiFetch<{ categories: CategorySpend[] }>("/dashboard/spending-by-category"),
        apiFetch<{ trends: MonthlyTrend[] }>("/dashboard/monthly-trends")
      ]);
      setSummary(summaryPayload);
      setCategories(categoryPayload.categories);
      setTrends(trendsPayload.trends);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load dashboard");
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-semibold">Spending dashboard</h1>
          <p className="mt-1 text-muted">Connect accounts, sync transactions, and inspect reward-relevant spending.</p>
        </div>
        <PlaidLinkButton onSynced={loadDashboard} />
      </div>
      {error ? <Toast message={error} tone="error" /> : null}
      {summary ? <SpendingSummaryCards summary={summary} /> : null}
      {summary ? <ConnectionStatus connectedItems={summary.connectedItems} /> : null}
      <div className="grid gap-4 xl:grid-cols-2">
        <SpendingCategoryChart data={categories} />
        <MonthlyTrendChart data={trends} />
      </div>
      <TopCategories data={categories} />
    </div>
  );
}

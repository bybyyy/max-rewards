import { CreditCard, Layers, ReceiptText, WalletCards } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/formatting";

export type DashboardSummary = {
  transactionCount: number;
  connectedItems: number;
  totalSpend: number;
  categoryCount: number;
};

export function SpendingSummaryCards({ summary }: { summary: DashboardSummary }) {
  const stats = [
    { label: "Analyzed spend", value: formatCurrency(summary.totalSpend), icon: WalletCards, tone: "bg-emerald-50 text-brand" },
    { label: "Transactions", value: String(summary.transactionCount), icon: ReceiptText, tone: "bg-sky-50 text-sky-700" },
    { label: "Categories", value: String(summary.categoryCount), icon: Layers, tone: "bg-amber-50 text-amber-700" },
    { label: "Connections", value: String(summary.connectedItems), icon: CreditCard, tone: "bg-rose-50 text-rose-700" }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{stat.label}</p>
              <span className={`rounded-md p-2 ${stat.tone}`}>
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
          </Card>
        );
      })}
    </div>
  );
}

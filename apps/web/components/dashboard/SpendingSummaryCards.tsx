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
    { label: "Analyzed spend", value: formatCurrency(summary.totalSpend), icon: WalletCards },
    { label: "Transactions", value: String(summary.transactionCount), icon: ReceiptText },
    { label: "Categories", value: String(summary.categoryCount), icon: Layers },
    { label: "Connections", value: String(summary.connectedItems), icon: CreditCard }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{stat.label}</p>
              <Icon className="h-4 w-4 text-brand" />
            </div>
            <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
          </Card>
        );
      })}
    </div>
  );
}

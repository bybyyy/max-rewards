import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/formatting";
import type { CategorySpend } from "./SpendingCategoryChart";

export function TopCategories({ data }: { data: CategorySpend[] }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold">Top categories</h2>
      <div className="mt-4 space-y-3">
        {data.slice(0, 6).map((item) => (
          <div key={item.category} className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium capitalize">{item.category}</p>
              <p className="text-sm text-muted">{item.transactionCount} transactions</p>
            </div>
            <p className="font-semibold">{formatCurrency(item.total)}</p>
          </div>
        ))}
        {data.length === 0 ? <p className="text-sm text-muted">No categorized spending yet.</p> : null}
      </div>
    </Card>
  );
}

import { formatCurrency, formatPercent } from "@/lib/formatting";

export type CategoryBreakdown = {
  category: string;
  annualSpend: number;
  rewardRate: number;
  estimatedRewards: number;
};

export function RewardBreakdown({ items }: { items: CategoryBreakdown[] }) {
  return (
    <div className="mt-4 overflow-hidden rounded-md border border-line">
      {items.map((item) => (
        <div key={item.category} className="grid grid-cols-4 gap-2 border-b border-line px-3 py-2 text-sm last:border-b-0">
          <span className="capitalize">{item.category}</span>
          <span>{formatCurrency(item.annualSpend)}</span>
          <span>{formatPercent(item.rewardRate)}</span>
          <span className="font-semibold">{formatCurrency(item.estimatedRewards)}</span>
        </div>
      ))}
    </div>
  );
}

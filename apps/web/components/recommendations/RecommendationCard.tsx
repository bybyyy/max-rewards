import { Award } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/formatting";
import { RewardBreakdown, type CategoryBreakdown } from "./RewardBreakdown";

export type Recommendation = {
  cardId: string;
  name: string;
  issuer: string;
  rewardType: string;
  estimatedGrossRewards: number;
  signupBonusValue: number;
  annualFee: number;
  estimatedNetValue: number;
  categoryBreakdown: CategoryBreakdown[];
  reasoning: string[];
};

export function RecommendationCard({ recommendation, rank }: { recommendation: Recommendation; rank: number }) {
  return (
    <Card>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-accent" />
            <p className="text-sm font-semibold text-accent">#{rank} recommendation</p>
          </div>
          <h2 className="mt-2 text-xl font-semibold">{recommendation.name}</h2>
          <p className="text-sm text-muted">{recommendation.issuer} · {recommendation.rewardType}</p>
        </div>
        <div className="rounded-md bg-panel px-4 py-3 text-right">
          <p className="text-sm text-muted">Estimated net value</p>
          <p className="text-2xl font-semibold">{formatCurrency(recommendation.estimatedNetValue)}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Stat label="Gross rewards" value={formatCurrency(recommendation.estimatedGrossRewards)} />
        <Stat label="Signup bonus" value={formatCurrency(recommendation.signupBonusValue)} />
        <Stat label="Annual fee" value={formatCurrency(recommendation.annualFee)} />
      </div>
      <ul className="mt-4 space-y-2 text-sm text-muted">
        {recommendation.reasoning.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
      <RewardBreakdown items={recommendation.categoryBreakdown} />
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-white p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

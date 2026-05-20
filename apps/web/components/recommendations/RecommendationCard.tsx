import { Award, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/formatting";
import { RewardBreakdown, type CategoryBreakdown } from "./RewardBreakdown";

export type Recommendation = {
  cardId: string;
  name: string;
  issuer: string;
  network?: string | null;
  rewardType: string;
  rewardCurrency?: string;
  bestFor?: string[];
  applyUrl?: string | null;
  sourceUrl?: string | null;
  lastVerified?: string | null;
  estimatedGrossRewards: number;
  signupBonusValue: number;
  annualFee: number;
  estimatedNetValue: number;
  preferenceScore?: number;
  rankingScore?: number;
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
          <p className="text-sm text-muted">
            {[recommendation.issuer, recommendation.network, recommendation.rewardType].filter(Boolean).join(" · ")}
          </p>
          {recommendation.bestFor?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {recommendation.bestFor.map((label) => (
                <span key={label} className="rounded-full border border-line bg-panel px-2.5 py-1 text-xs text-muted">
                  {label}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="rounded-md bg-panel px-4 py-3 text-right">
          <p className="text-sm text-muted">Estimated net value</p>
          <p className="text-2xl font-semibold">{formatCurrency(recommendation.estimatedNetValue)}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Gross rewards" value={formatCurrency(recommendation.estimatedGrossRewards)} />
        <Stat label="Signup bonus" value={formatCurrency(recommendation.signupBonusValue)} />
        <Stat label="Annual fee" value={formatCurrency(recommendation.annualFee)} />
        <Stat label="Reward currency" value={recommendation.rewardCurrency ?? "Rewards"} />
        {recommendation.preferenceScore ? (
          <Stat label="Preference weight" value={formatCurrency(recommendation.preferenceScore)} />
        ) : null}
      </div>
      <ul className="mt-4 space-y-2 text-sm text-muted">
        {recommendation.reasoning.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-4 text-sm text-muted">
        {recommendation.lastVerified ? <span>Verified {formatVerifiedDate(recommendation.lastVerified)}</span> : null}
        {recommendation.sourceUrl ? (
          <a
            className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
            href={recommendation.sourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            Source
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : null}
        {recommendation.applyUrl ? (
          <a
            className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
            href={recommendation.applyUrl}
            target="_blank"
            rel="noreferrer"
          >
            Issuer page
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : null}
      </div>
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

function formatVerifiedDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

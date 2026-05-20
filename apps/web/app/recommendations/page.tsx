"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";
import {
  RecommendationFilters,
  type RecommendationFilterState
} from "@/components/recommendations/RecommendationFilters";
import { RecommendationCard, type Recommendation } from "@/components/recommendations/RecommendationCard";
import { Toast } from "@/components/ui/Toast";
import { apiFetch } from "@/lib/apiClient";

const defaultFilters: RecommendationFilterState = {
  noAnnualFee: false,
  rewardType: "",
  studentCards: false,
  includeSignupBonus: true,
  goal: "flexible",
  welcomeBonusImportance: "medium",
  preferredIssuer: "",
  avoidedIssuer: ""
};

export default function RecommendationsPage() {
  return (
    <AuthGuard>
      <AppShell>
        <RecommendationsContent />
      </AppShell>
    </AuthGuard>
  );
}

function RecommendationsContent() {
  const [filters, setFilters] = useState(defaultFilters);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState("");

  async function run() {
    try {
      const payload = await apiFetch<{ recommendations: Recommendation[] }>("/recommendations/run", {
        method: "POST",
        json: {
          ...filters,
          rewardType: filters.rewardType || undefined,
          goal: filters.goal || undefined,
          preferredIssuer: filters.preferredIssuer || undefined,
          avoidedIssuer: filters.avoidedIssuer || undefined
        }
      });
      setRecommendations(payload.recommendations);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to run recommendations");
    }
  }

  useEffect(() => {
    run();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Card recommendations</h1>
        <p className="mt-1 text-muted">Rank cards by estimated annual net rewards from your spending history.</p>
      </div>
      <RecommendationFilters filters={filters} setFilters={setFilters} onRun={run} />
      {error ? <Toast message={error} tone="error" /> : null}
      <div className="space-y-4">
        {recommendations.map((recommendation, index) => (
          <RecommendationCard
            key={recommendation.cardId}
            recommendation={recommendation}
            rank={index + 1}
          />
        ))}
        {recommendations.length === 0 ? (
          <Toast message="No recommendations yet. Link an account and seed cards to generate results." />
        ) : null}
      </div>
    </div>
  );
}

"use client";

import { Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export type RecommendationFilterState = {
  noAnnualFee: boolean;
  rewardType: string;
  studentCards: boolean;
  includeSignupBonus: boolean;
  goal: string;
  welcomeBonusImportance: string;
  preferredIssuer: string;
  avoidedIssuer: string;
};

export function RecommendationFilters({
  filters,
  setFilters,
  onRun
}: {
  filters: RecommendationFilterState;
  setFilters: (filters: RecommendationFilterState) => void;
  onRun: () => void;
}) {
  return (
    <div className="rounded-lg border border-line bg-white/95 p-4 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-4">
        <label className="space-y-2 text-sm font-medium">
          Reward goal
          <Select
            className="w-full"
            value={filters.goal}
            onChange={(event) => {
              const goal = event.target.value;
              setFilters({
                ...filters,
                goal,
                rewardType: goal === "flexible" ? "" : goal
              });
            }}
          >
            <option value="flexible">Flexible</option>
            <option value="cashback">Cash back</option>
            <option value="travel">Travel</option>
          </Select>
        </label>
        <label className="space-y-2 text-sm font-medium">
          Welcome bonus priority
          <Select
            className="w-full"
            value={filters.welcomeBonusImportance}
            onChange={(event) => setFilters({ ...filters, welcomeBonusImportance: event.target.value })}
          >
            <option value="medium">Balanced</option>
            <option value="high">Very important</option>
            <option value="low">Not important</option>
          </Select>
        </label>
        <label className="space-y-2 text-sm font-medium">
          Preferred bank
          <Input
            placeholder="Optional issuer"
            value={filters.preferredIssuer}
            onChange={(event) => setFilters({ ...filters, preferredIssuer: event.target.value })}
          />
        </label>
        <label className="space-y-2 text-sm font-medium">
          Bank to avoid
          <Input
            placeholder="Optional issuer"
            value={filters.avoidedIssuer}
            onChange={(event) => setFilters({ ...filters, avoidedIssuer: event.target.value })}
          />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-4">
        <Select
          value={filters.rewardType}
          onChange={(event) => setFilters({ ...filters, rewardType: event.target.value })}
        >
          <option value="">All reward types</option>
          <option value="cashback">Cashback only</option>
          <option value="travel">Travel only</option>
        </Select>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.noAnnualFee}
            onChange={(event) => setFilters({ ...filters, noAnnualFee: event.target.checked })}
          />
          No annual fee
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.studentCards}
            onChange={(event) => setFilters({ ...filters, studentCards: event.target.checked })}
          />
          Student cards
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.includeSignupBonus}
            onChange={(event) => setFilters({ ...filters, includeSignupBonus: event.target.checked })}
          />
          Include signup bonus
        </label>
        <Button onClick={onRun}>
          <Filter className="mr-2 h-4 w-4" />
          Run recommendations
        </Button>
      </div>
    </div>
  );
}

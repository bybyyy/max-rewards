"use client";

import { Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

export type RecommendationFilterState = {
  noAnnualFee: boolean;
  rewardType: string;
  studentCards: boolean;
  includeSignupBonus: boolean;
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
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-line bg-white p-4">
      <Select
        value={filters.rewardType}
        onChange={(event) => setFilters({ ...filters, rewardType: event.target.value })}
      >
        <option value="">All rewards</option>
        <option value="cashback">Cashback</option>
        <option value="travel">Travel</option>
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
  );
}

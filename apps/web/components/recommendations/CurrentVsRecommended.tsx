import { Card } from "@/components/ui/Card";

export function CurrentVsRecommended() {
  return (
    <Card>
      <h2 className="text-lg font-semibold">Current card comparison</h2>
      <p className="mt-2 text-sm text-muted">
        MVP compares your spending against the seeded card catalog. Add current-card selection later to show exact
        side-by-side reward deltas.
      </p>
    </Card>
  );
}

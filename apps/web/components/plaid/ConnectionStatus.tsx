import { Card } from "@/components/ui/Card";

export function ConnectionStatus({ connectedItems }: { connectedItems: number }) {
  return (
    <Card>
      <p className="text-sm text-muted">Connected institutions</p>
      <p className="mt-2 text-3xl font-semibold">{connectedItems}</p>
      <p className="mt-2 text-sm text-muted">
        {connectedItems > 0 ? "Your accounts are ready for analysis." : "Link an account to populate the dashboard."}
      </p>
    </Card>
  );
}

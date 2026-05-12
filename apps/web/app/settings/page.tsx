"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { apiFetch } from "@/lib/apiClient";

type PlaidItem = {
  id: string;
  institutionName: string | null;
  status: string;
  accounts: Array<{ id: string; name: string; mask: string | null; type: string; subtype: string | null }>;
};

export default function SettingsPage() {
  return (
    <AuthGuard>
      <AppShell>
        <SettingsContent />
      </AppShell>
    </AuthGuard>
  );
}

function SettingsContent() {
  const [items, setItems] = useState<PlaidItem[]>([]);

  async function load() {
    const payload = await apiFetch<{ items: PlaidItem[] }>("/plaid/items");
    setItems(payload.items);
  }

  async function removeItem(id: string) {
    await apiFetch(`/plaid/items/${id}`, { method: "DELETE" });
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="mt-1 text-muted">Review connected institutions and remove stored account links.</p>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="font-semibold">{item.institutionName ?? "Linked institution"}</h2>
                <p className="text-sm text-muted">{item.status}</p>
                <div className="mt-3 space-y-1 text-sm">
                  {item.accounts.map((account) => (
                    <p key={account.id}>
                      {account.name} {account.mask ? `ending ${account.mask}` : ""}
                    </p>
                  ))}
                </div>
              </div>
              <Button variant="secondary" onClick={() => removeItem(item.id)}>
                Remove
              </Button>
            </div>
          </Card>
        ))}
        {items.length === 0 ? <Card className="text-sm text-muted">No linked institutions yet.</Card> : null}
      </div>
    </div>
  );
}

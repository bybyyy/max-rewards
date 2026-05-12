"use client";

import { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Link as LinkIcon, RefreshCw } from "lucide-react";
import { apiFetch } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";

export function PlaidLinkButton({ onSynced }: { onSynced?: () => void }) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    apiFetch<{ link_token: string }>("/plaid/link-token", { method: "POST" })
      .then((payload) => setLinkToken(payload.link_token))
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to create Plaid link"));
  }, []);

  const onSuccess = useCallback(
    async (publicToken: string) => {
      setStatus("Connecting account...");
      await apiFetch("/plaid/exchange-public-token", {
        method: "POST",
        json: { publicToken }
      });
      setStatus("Syncing transactions...");
      await apiFetch("/plaid/sync-transactions", { method: "POST" });
      setStatus("Account connected and transactions synced.");
      onSynced?.();
    },
    [onSynced]
  );

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess
  });

  return (
    <div className="space-y-3">
      {error ? <Toast message={error} tone="error" /> : null}
      {status ? <Toast message={status} tone={status.includes("synced") ? "success" : "info"} /> : null}
      <Button onClick={() => open()} disabled={!ready || !linkToken}>
        {ready ? <LinkIcon className="mr-2 h-4 w-4" /> : <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
        Link account
      </Button>
    </div>
  );
}

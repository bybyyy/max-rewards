"use client";

import { FormEvent, useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import { apiFetch } from "@/lib/apiClient";
import { changePassword, getMe, updateProfile, type SafeUser } from "@/lib/auth";

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
  const [user, setUser] = useState<SafeUser | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const [itemsPayload, mePayload] = await Promise.all([
        apiFetch<{ items: PlaidItem[] }>("/plaid/items"),
        getMe()
      ]);
      setItems(itemsPayload.items);
      setUser(mePayload.user);
      setName(mePayload.user.name ?? "");
      setEmail(mePayload.user.email);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load settings");
    }
  }

  async function removeItem(id: string) {
    await apiFetch(`/plaid/items/${id}`, { method: "DELETE" });
    await load();
  }

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    setStatus("");
    setError("");
    try {
      const payload = await updateProfile(email, name || null);
      setUser(payload.user);
      setStatus("Profile updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update profile");
    }
  }

  async function savePassword(event: FormEvent) {
    event.preventDefault();
    setStatus("");
    setError("");
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setStatus("Password changed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to change password");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="mt-1 text-muted">Manage your profile, sign-in details, and connected institutions.</p>
      </div>
      {error ? <Toast message={error} tone="error" /> : null}
      {status ? <Toast message={status} tone="success" /> : null}
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <Card className="border-l-4 border-l-sky-500">
            <h2 className="text-lg font-semibold">Profile</h2>
            <p className="mt-1 text-sm text-muted">Signed in as {user?.email ?? "Loading..."}</p>
            <form className="mt-4 space-y-3" onSubmit={saveProfile}>
              <label className="block space-y-2 text-sm font-medium">
                Name
                <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
              </label>
              <label className="block space-y-2 text-sm font-medium">
                Email
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </label>
              <Button type="submit">Save profile</Button>
            </form>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <h2 className="text-lg font-semibold">Password</h2>
            <form className="mt-4 space-y-3" onSubmit={savePassword}>
              <Input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
              <Input
                type="password"
                placeholder="New password, minimum 8 characters"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
              <Button type="submit" variant="secondary">
                Change password
              </Button>
            </form>
          </Card>
        </div>
        <Card className="border-l-4 border-l-brand">
          <h2 className="text-lg font-semibold">Linked institutions</h2>
          <p className="mt-1 text-sm text-muted">Review connected accounts and remove stored links.</p>
          <div className="mt-4 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-md border border-line bg-panel/60 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="font-semibold">{item.institutionName ?? "Linked institution"}</h3>
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
              </div>
            ))}
            {items.length === 0 ? <div className="text-sm text-muted">No linked institutions yet.</div> : null}
          </div>
        </Card>
      </div>
    </div>
  );
}

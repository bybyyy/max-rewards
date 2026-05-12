"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, type SafeUser } from "@/lib/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((payload) => setUser(payload.user))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return <div className="p-8 text-sm text-muted">Checking your session...</div>;
  }

  return user ? <>{children}</> : null;
}

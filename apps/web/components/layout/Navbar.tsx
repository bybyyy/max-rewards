"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, LogOut } from "lucide-react";
import { logout } from "@/lib/auth";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <header className="border-b border-line bg-white">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-10 xl:px-14">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <CreditCard className="h-5 w-5 text-brand" />
          Max Rewards
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link className="rounded-md px-3 py-2 hover:bg-panel" href="/dashboard">
            Dashboard
          </Link>
          <Link className="rounded-md px-3 py-2 hover:bg-panel" href="/recommendations">
            Recommendations
          </Link>
          <Link className="rounded-md px-3 py-2 hover:bg-panel" href="/transactions">
            Transactions
          </Link>
          <Link className="rounded-md px-3 py-2 hover:bg-panel" href="/settings">
            Settings
          </Link>
          <Button variant="ghost" onClick={handleLogout} aria-label="Log out">
            <LogOut className="h-4 w-4" />
          </Button>
        </nav>
      </div>
    </header>
  );
}

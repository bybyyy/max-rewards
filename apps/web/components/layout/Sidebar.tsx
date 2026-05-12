import Link from "next/link";
import { BarChart3, CreditCard, ReceiptText, Settings } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/recommendations", label: "Recommendations", icon: CreditCard },
  { href: "/transactions", label: "Transactions", icon: ReceiptText },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-line bg-white/85 p-4 md:block">
      <div className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-panel"
            >
              <Icon className="h-4 w-4 text-brand" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

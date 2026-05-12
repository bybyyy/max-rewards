import Link from "next/link";
import { BarChart3, CreditCard, Settings } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/recommendations", label: "Cards", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  return (
    <aside className="hidden w-56 border-r border-line bg-white p-4 md:block">
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

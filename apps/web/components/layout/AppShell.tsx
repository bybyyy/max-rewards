import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ecfdf5_0,#fbfbf8_34%,#f8fafc_100%)]">
      <Navbar />
      <div className="flex w-full">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 xl:px-14">{children}</main>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, BarChart3, LockKeyhole, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#fbfbf8]">
      <section className="mx-auto grid min-h-[88vh] max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Portfolio MVP</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight text-ink md:text-6xl">
            Max Rewards
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            Link your accounts with Plaid, analyze real spending patterns, and estimate which credit cards could
            produce stronger cashback or travel rewards.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex h-11 items-center rounded-md bg-brand px-5 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Get recommendations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex h-11 items-center rounded-md border border-line bg-white px-5 text-sm font-semibold hover:bg-panel"
            >
              Link your card
            </Link>
          </div>
        </div>
        <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="grid gap-4">
            {[
              { icon: LockKeyhole, title: "Secure linking", text: "Plaid Link keeps bank credentials out of your app." },
              { icon: BarChart3, title: "Spending analysis", text: "Transactions are grouped into portfolio-friendly categories." },
              { icon: Sparkles, title: "Explainable ranking", text: "Each card shows estimated value and the spending behind it." }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-md border border-line p-4">
                  <Icon className="h-5 w-5 text-brand" />
                  <h2 className="mt-3 font-semibold">{item.title}</h2>
                  <p className="mt-1 text-sm text-muted">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

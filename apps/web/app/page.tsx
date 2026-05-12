"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  CreditCard,
  Gift,
  Plane,
  Search,
  Sparkles,
  WalletCards,
  X
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import { login, signup } from "@/lib/auth";

type AuthMode = "signin" | "signup";

export default function LandingPage() {
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfaff] text-[#11143f]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 lg:px-10">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 text-white shadow-lg shadow-violet-200">
            <CreditCard className="h-5 w-5" />
          </span>
          <span className="text-xl font-bold">Max Rewards</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
          <a href="#partners">Partners</a>
          <a href="#resources">Resources</a>
        </nav>
        <div className="flex items-center gap-3">
          <button className="hidden text-sm font-semibold sm:inline" onClick={() => setAuthMode("signin")}>
            Sign in
          </button>
          <button
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200"
            onClick={() => setAuthMode("signup")}
          >
            Sign up
          </button>
        </div>
      </header>

      <section className="relative mx-auto grid min-h-[690px] max-w-7xl items-center gap-8 px-5 pb-16 pt-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
            <Sparkles className="h-4 w-4" />
            Maximize every swipe.
          </div>
          <h1 className="mt-8 max-w-2xl text-5xl font-bold leading-[1.05] tracking-normal md:text-7xl">
            Maximize your credit card <span className="text-violet-600">rewards.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Max Rewards helps you analyze spending, compare card value, and find smarter cashback or travel rewards
            faster.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              className="inline-flex h-14 items-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-7 text-sm font-semibold text-white shadow-xl shadow-violet-200"
              onClick={() => setAuthMode("signup")}
            >
              Sign up for free
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button
              className="inline-flex h-14 items-center rounded-xl border border-violet-100 bg-white px-7 text-sm font-semibold shadow-sm"
              onClick={() => setAuthMode("signin")}
            >
              Sign in
            </button>
          </div>
          <div className="mt-10 grid max-w-2xl gap-4 text-xs text-slate-600 sm:grid-cols-3">
            <MiniValue icon={Gift} text="Personalized strategies tailored to you" />
            <MiniValue icon={BarChart3} text="Find the best rewards and redemptions" />
            <MiniValue icon={WalletCards} text="Save on travel and everyday spend" />
          </div>
        </div>

        <div className="relative min-h-[560px]">
          <div className="absolute inset-x-0 bottom-0 h-[360px] rounded-t-[45%] bg-gradient-to-tr from-violet-100 via-white to-indigo-100" />
          <img
            className="absolute bottom-0 right-0 h-[380px] w-[72%] rounded-t-[160px] object-cover object-center opacity-95"
            src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80"
            alt="Tropical travel destination"
          />
          <div className="absolute right-10 top-24 hidden h-10 w-40 rotate-[-10deg] items-center justify-center rounded-full bg-white/70 text-violet-700 shadow-lg md:flex">
            <Plane className="h-8 w-8" />
          </div>
          <div className="absolute right-16 top-44 h-64 w-44 rotate-[7deg] rounded-3xl bg-[#111827] p-5 text-white shadow-2xl">
            <div className="h-7 w-9 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-500" />
            <p className="mt-24 text-2xl font-semibold tracking-widest">VISA</p>
            <p className="text-xs text-slate-300">Signature</p>
          </div>
          <div className="absolute left-0 top-8 w-[88%] max-w-[390px] rotate-[-4deg] rounded-3xl border border-white bg-white/95 p-6 shadow-2xl shadow-indigo-100 backdrop-blur">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Your rewards overview</p>
                <p className="mt-7 text-xs font-semibold text-slate-500">Total value</p>
                <p className="text-3xl font-bold">$2,740</p>
                <p className="text-xs font-semibold text-emerald-500">+ $560 this month</p>
              </div>
              <div className="h-20 w-28 rounded-2xl bg-gradient-to-br from-violet-300 via-indigo-100 to-slate-50" />
            </div>
            <div className="mt-8 space-y-4">
              {[
                ["AmEx Rewards", "125,000"],
                ["Chase Ultimate", "82,340"],
                ["Capital One Miles", "45,670"],
                ["Citi ThankYou", "21,450"]
              ].map(([name, points]) => (
                <div key={name} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-600">{name}</span>
                  <span className="font-bold">{points}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl bg-violet-50 p-3">
              <p className="text-xs font-semibold text-slate-500">Top redemption opportunity</p>
              <div className="mt-3 flex items-center gap-3">
                <img
                  className="h-16 w-20 rounded-xl object-cover"
                  src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=400&q=80"
                  alt="Overwater resort"
                />
                <div>
                  <p className="text-sm font-bold">Island getaway</p>
                  <p className="text-xs text-slate-600">80,000 points</p>
                  <p className="text-xs font-semibold text-emerald-600">Value $1,800</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="partners" className="border-y border-violet-100 bg-white/80 px-5 py-10">
        <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-violet-400">
          Trusted by reward smart users
        </p>
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-2 items-center gap-6 text-center text-xl font-bold text-slate-400 md:grid-cols-5">
          <span>nerdwallet</span>
          <span>The Points Guy</span>
          <span>Forbes</span>
          <span>Travel + Leisure</span>
          <span>Yahoo Finance</span>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-5 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold">
            Smarter strategies. <span className="text-violet-600">Bigger rewards.</span>
          </h2>
          <p className="mt-3 text-slate-600">Everything you need to get more out of every card in your wallet.</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-4" id="how-it-works">
          <Feature icon={CreditCard} title="Personalized recommendations" text="Get card recommendations based on goals and spending." />
          <Feature icon={Search} title="Find better rewards" text="Compare cashback, travel points, fees, and welcome offers." />
          <Feature icon={BarChart3} title="Track and optimize" text="Review categories and transactions from linked accounts." />
          <Feature icon={Plane} title="Unlock travel value" text="Turn points and card rewards into higher-value trips." />
        </div>
        <div className="mt-14 rounded-3xl bg-gradient-to-r from-violet-100 via-white to-indigo-100 p-8 shadow-sm">
          <div className="grid items-center gap-6 md:grid-cols-[160px_1fr]">
            <img
              className="h-32 w-32 rounded-full object-cover"
              src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=500&q=80"
              alt="Reward travel"
            />
            <div>
              <p className="text-2xl font-medium leading-9 text-[#11143f]">
                Max Rewards helped me spot better card value from my everyday spend without manually sorting every
                transaction.
              </p>
              <p className="mt-4 text-sm font-semibold text-violet-700">Verified member</p>
            </div>
          </div>
        </div>
      </section>

      {authMode ? <AuthDialog mode={authMode} setMode={setAuthMode} onClose={() => setAuthMode(null)} /> : null}
    </main>
  );
}

function MiniValue({ icon: Icon, text }: { icon: typeof Gift; text: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
      <span>{text}</span>
    </div>
  );
}

function Feature({ icon: Icon, title, text }: { icon: typeof Gift; title: string; text: string }) {
  return (
    <div className="text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-100 to-white text-violet-600 shadow-sm">
        <Icon className="h-7 w-7" />
      </span>
      <h3 className="mt-5 font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function AuthDialog({
  mode,
  setMode,
  onClose
}: {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
  onClose: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setStatus(isSignup ? "Creating your account..." : "Signing you in...");

    try {
      if (isSignup) {
        await signup(email, password, name || undefined);
      } else {
        await login(email, password);
      }
      setStatus("Success. Loading your dashboard...");
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to continue");
      setStatus("");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#11143f]/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{isSignup ? "Create your account" : "Welcome back"}</h2>
            <p className="mt-1 text-sm text-slate-600">
              {isSignup ? "Start comparing card rewards with your spending." : "Sign in to continue to your dashboard."}
            </p>
          </div>
          <button className="rounded-full p-2 hover:bg-violet-50" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          {error ? <Toast message={error} tone="error" /> : null}
          {status ? <Toast message={status} tone="success" /> : null}
          {isSignup ? (
            <Input placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
          ) : null}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button className="h-12 w-full bg-violet-600 hover:bg-violet-700" disabled={loading}>
            {loading ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-600">
          {isSignup ? "Already have an account?" : "Need an account?"}{" "}
          <button
            className="font-semibold text-violet-700"
            onClick={() => {
              setError("");
              setStatus("");
              setMode(isSignup ? "signin" : "signup");
            }}
          >
            {isSignup ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}

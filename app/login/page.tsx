"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuth((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      login(email);
      setLoading(false);
      router.push("/account");
    }, 400);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      login("bobbypodila065@gmail.com", "Bobby Podila");
      setLoading(false);
      router.push("/account");
    }, 400);
  };

  return (
    <div className="mx-3 sm:mx-6 max-w-md lg:mx-auto py-8">
      <div className="glass rounded-[32px] p-6 sm:p-10 shadow-lift border border-white/60 dark:border-white/15 backdrop-blur-xl">
        <div className="text-center">
          <p className="text-xs tracking-[0.24em] uppercase font-semibold text-skyx-700 dark:text-skyx-200">
            Welcome to Skyshore
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold mt-2 text-navy dark:text-white">
            Sign In
          </h1>
          <p className="text-sm text-navy/70 dark:text-white/70 mt-1.5">
            Access your Wave Points, past orders & coastal rewards.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mt-6 w-full flex items-center justify-center gap-3 rounded-full bg-white/80 dark:bg-white/10 border border-navy/15 dark:border-white/20 py-3 text-sm font-semibold text-navy dark:text-white hover:bg-white transition shadow-sm"
        >
          <svg className="size-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-navy/10 dark:border-white/10" />
          </div>
          <span className="relative bg-[#FFF8ED] dark:bg-navy px-3 text-xs uppercase tracking-wider text-navy/50 dark:text-white/50">
            or with email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy/70 dark:text-white/70 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. you@example.com"
              className="w-full rounded-full bg-white/80 dark:bg-white/10 px-4 py-3 text-sm outline-none border border-navy/15 dark:border-white/15 text-navy dark:text-white placeholder:text-navy/40 dark:placeholder:text-white/40 focus:border-skyx-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-navy/70 dark:text-white/70">
                Password
              </label>
              <button
                type="button"
                className="text-xs text-skyx-700 dark:text-skyx-300 hover:underline"
              >
                Forgot?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-full bg-white/80 dark:bg-white/10 px-4 py-3 text-sm outline-none border border-navy/15 dark:border-white/15 text-navy dark:text-white placeholder:text-navy/40 dark:placeholder:text-white/40 focus:border-skyx-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-full bg-coral text-white py-3.5 font-semibold text-sm hover:bg-coral-dark shadow-soft transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-navy/70 dark:text-white/70">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-coral underline hover:text-coral-dark">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { useAuth } from "@/store/auth";

export function SignInModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const login = useAuth((s) => s.login);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      login(email);
      setLoading(false);
      onClose();
    }, 300);
  };

  const handleGoogle = () => {
    setLoading(true);
    setTimeout(() => {
      login("bobbypodila065@gmail.com", "Bobby Podila");
      setLoading(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-navy/50 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" aria-label="Sign in" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="glass w-full max-w-sm rounded-[28px] p-6 sm:p-8 shadow-lift animate-pop-in">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold">Sign In</h2>
          <button type="button" onClick={onClose} className="rounded-full glass px-3 py-1.5 text-sm font-semibold" aria-label="Close">✕</button>
        </div>

        <button type="button" onClick={handleGoogle} className="mt-5 w-full flex items-center justify-center gap-2 rounded-full bg-white/80 dark:bg-white/10 border border-navy/15 py-2.5 text-sm font-semibold">
          Continue with Google (Demo)
        </button>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full rounded-full bg-white/80 dark:bg-white/10 px-4 py-2.5 text-sm outline-none border border-navy/15 dark:border-white/15 text-navy dark:text-white"
            autoFocus
          />
          <button type="submit" disabled={loading} className="w-full rounded-full bg-coral text-white py-3 font-semibold text-sm disabled:opacity-50">
            {loading ? "Signing in…" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

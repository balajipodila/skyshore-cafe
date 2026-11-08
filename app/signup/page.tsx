"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";

export default function SignupPage() {
  const router = useRouter();
  const login = useAuth((s) => s.login);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setLoading(true);
    setTimeout(() => {
      login(email, name);
      setLoading(false);
      router.push("/account");
    }, 300);
  };

  return (
    <div className="mx-3 sm:mx-6 max-w-md lg:mx-auto py-8">
      <div className="glass rounded-[32px] p-6 sm:p-10 shadow-lift border border-white/60 dark:border-white/15 backdrop-blur-xl">
        <div className="text-center">
          <p className="text-xs tracking-[0.24em] uppercase font-semibold text-skyx-700 dark:text-skyx-200">Join the Coastal Family</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold mt-2 text-navy dark:text-white">Create Account</h1>
          <p className="text-sm text-navy/70 dark:text-white/70 mt-1.5">Get 100 Wave Points instant welcome bonus!</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy/70 dark:text-white/70 mb-1.5">Full Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Balaji Podila" className="w-full rounded-full bg-white/80 dark:bg-white/10 px-4 py-3 text-sm outline-none border border-navy/15 dark:border-white/15 text-navy dark:text-white focus:border-skyx-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy/70 dark:text-white/70 mb-1.5">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-full bg-white/80 dark:bg-white/10 px-4 py-3 text-sm outline-none border border-navy/15 dark:border-white/15 text-navy dark:text-white focus:border-skyx-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy/70 dark:text-white/70 mb-1.5">Mobile Number (for SMS & WhatsApp)</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full rounded-full bg-white/80 dark:bg-white/10 px-4 py-3 text-sm outline-none border border-navy/15 dark:border-white/15 text-navy dark:text-white focus:border-skyx-500" />
          </div>
          <button type="submit" disabled={loading} className="w-full mt-2 rounded-full bg-coral text-white py-3.5 font-semibold text-sm hover:bg-coral-dark shadow-soft transition disabled:opacity-50">
            {loading ? "Creating Account..." : "Create Account & Claim 100 Points"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-navy/70 dark:text-white/70">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-coral underline hover:text-coral-dark">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

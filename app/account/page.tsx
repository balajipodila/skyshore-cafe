"use client";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/data";
import { menuForOutlet } from "@/lib/menu";
import { useCart } from "@/store/cart";
import { useLocation } from "@/store/location";
import { useAuth } from "@/store/auth";

const ORDERS = [
  { id: "SS-2048", items: "Masala Chai ×2, Samosa", total: 140, status: "Out for delivery", date: "Today" },
  { id: "SS-2031", items: "Sunset Sky, Paneer Roll", total: 330, status: "Delivered", date: "Yesterday" },
  { id: "SS-2017", items: "Filter Coffee, Pav Bhaji", total: 180, status: "Delivered", date: "Oct 28" },
  { id: "SS-2009", items: "Mango Lassi ×2", total: 220, status: "Delivered", date: "Oct 25" },
];

export default function AccountPage() {
  const add = useCart((s) => s.add);
  const outletId = useLocation((s) => s.outletId);
  const outletMenu = menuForOutlet(outletId);
  const user = useAuth((s) => s.user);
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const logout = useAuth((s) => s.logout);

  const displayName = user?.name || "Bobby Podila";
  const displayEmail = user?.email || "bobbypodila065@gmail.com";
  const points = user?.points || 340;

  return (
    <div className="mx-3 sm:mx-6 max-w-6xl lg:mx-auto pb-16">
      <header className="glass rounded-[28px] p-6 sm:p-8 flex flex-col lg:flex-row justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs uppercase tracking-[0.22em] font-semibold text-skyx-700 dark:text-skyx-200">
              Welcome back
            </p>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold mt-1">
            Namaste, {displayName}
          </h1>
          <p className="text-xs text-navy/60 dark:text-white/60 mt-1">
            {displayEmail} {isAuthenticated && "• Verified Coastal Member"}
          </p>

          <div className="mt-3 flex gap-2">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={logout}
                className="text-xs underline text-navy/60 dark:text-white/60 hover:text-coral transition"
              >
                Sign out of this device
              </button>
            ) : (
              <Link
                href="/login"
                className="text-xs font-semibold text-coral underline hover:text-coral-dark"
              >
                Sign in to sync your Wave Points
              </Link>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl px-5 py-4 max-w-sm w-full">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold">Wave Points</p>
            <span className="text-xs font-bold text-coral">Tier: Coastal Gold</span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex-1 h-3 rounded-full bg-navy/10 dark:bg-white/10 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-skyx-400 to-coral"
                style={{ width: `${Math.min(100, (points / 500) * 100)}%` }}
              />
            </div>
            <span className="font-bold text-sm">{points} / 500</span>
          </div>
          <p className="text-xs text-navy/60 dark:text-white/60 mt-1.5">
            {500 - points > 0 ? `${500 - points} more for ₹100 off your next order.` : "Reward voucher ready to claim!"}
          </p>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <section aria-labelledby="history" className="lg:col-span-3 space-y-4">
          <h2 id="history" className="font-serif text-2xl font-semibold">Order history</h2>
          {ORDERS.map((o) => (
            <GlassCard key={o.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{o.id} · {o.date}</p>
                <p className="text-sm text-navy/70 dark:text-white/70">{o.items}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-white/80 dark:bg-white/10 px-3 py-1 text-sm font-bold">{formatINR(o.total)}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${o.status.includes("delivery") ? "bg-coral/15 text-coral-dark" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"}`}>
                  {o.status}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const first = outletMenu[0];
                    if (first) add({ id: first.id, name: first.name, price: first.sizes[0]?.price ?? 0, qty: 1, size: first.sizes[0]?.label, image: first.image });
                  }}
                  className="rounded-full bg-navy text-white dark:bg-white dark:text-navy px-4 py-2 text-sm font-semibold hover:bg-coral hover:text-white transition"
                >
                  Reorder
                </button>
              </div>
            </GlassCard>
          ))}
        </section>

        <section aria-label="Account details" className="lg:col-span-2 space-y-4">
          <GlassCard>
            <h3 className="font-serif text-xl font-semibold">Favourites</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {outletMenu.slice(0, 3).map((m) => (
                <li key={m.id} className="flex justify-between bg-white/60 dark:bg-white/10 rounded-full px-3 py-2">
                  <span>{m.name}</span>
                  <span className="font-semibold">{formatINR(m.sizes[0]?.price ?? 0)}</span>
                </li>
              ))}
            </ul>
            <Button href="/menu" variant="ghost" className="mt-4 w-full">Browse menu</Button>
          </GlassCard>

          <GlassCard>
            <h3 className="font-serif text-xl font-semibold">Saved addresses</h3>
            <p className="mt-2 text-sm text-navy/70 dark:text-white/70">Home — Brodipet, Guntur<br />Beach Stay — RK Beach Road, Vizag</p>
            <button type="button" className="mt-3 rounded-full border border-navy/20 dark:border-white/20 px-4 py-2 text-xs font-semibold hover:bg-white/40">Add a new address</button>
          </GlassCard>

          <GlassCard>
            <h3 className="font-serif text-xl font-semibold">Wave Points</h3>
            <p className="mt-2 text-4xl font-bold">{points}</p>
            <p className="text-sm text-navy/70 dark:text-white/70">That&apos;s ₹{Math.round(points / 10)} in rewards waiting. Valid across all 12 outlets.</p>
          </GlassCard>
        </section>
      </div>
    </div>
  );
}

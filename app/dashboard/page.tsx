"use client";
import { GlassCard } from "@/components/ui/GlassCard";

const ORDERS = [
  { id: "SS-2048", items: "Masala Chai, Samosa", total: 140, status: "Brewing", outlet: "Vizag" },
  { id: "SS-2047", items: "Sunset Sky ×2", total: 420, status: "Packed", outlet: "Bengaluru" },
  { id: "SS-2046", items: "Pav Bhaji, Cold Coffee", total: 269, status: "Delivered", outlet: "Chennai" },
  { id: "SS-2045", items: "Family Combo", total: 599, status: "Delivered", outlet: "Hyderabad" },
  { id: "SS-2044", items: "Falooda ×3", total: 450, status: "Delivered", outlet: "Goa" },
];

export default function DashboardPage() {
  return (
    <div className="mx-3 sm:mx-6 max-w-6xl lg:mx-auto">
      <header className="glass rounded-[28px] p-6 sm:p-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] font-semibold text-coral">Mock admin</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold">Today at Skyshore</h1>
        </div>
        <p className="text-sm text-navy/70 dark:text-white/70">Live-ish numbers · All outlets</p>
      </header>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Revenue today", value: "₹1,24,500", sub: "+12% vs yesterday" },
          { label: "Orders", value: "847", sub: "38 per outlet avg" },
          { label: "Avg rating", value: "4.6 ★", sub: "from 1,204 reviews" },
          { label: "Wave Points given", value: "12,400", sub: "this week" },
        ].map((c) => (
          <GlassCard key={c.label}>
            <p className="text-sm text-navy/60 dark:text-white/60">{c.label}</p>
            <p className="font-serif text-3xl font-bold mt-1">{c.value}</p>
            <p className="text-xs text-emerald-700 font-semibold mt-1">{c.sub}</p>
          </GlassCard>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="orders" className="glass rounded-[22px] p-5">
          <h2 id="orders" className="font-serif text-2xl font-semibold">Recent orders</h2>
          <ul className="mt-4 space-y-3">
            {ORDERS.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 bg-white/60 dark:bg-white/10 rounded-2xl px-4 py-3 text-sm">
                <div>
                  <p className="font-semibold">{o.id} · {o.outlet}</p>
                  <p className="text-navy/70 dark:text-white/70">{o.items}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{o.total}</p>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${o.status === "Delivered" ? "bg-emerald-100 text-emerald-700" : "bg-coral/15 text-coral-dark"}`}>{o.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="bestsellers" className="space-y-5">
          <div className="glass rounded-[22px] p-5">
            <h2 id="bestsellers" className="font-serif text-2xl font-semibold">Bestsellers today</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                ["Masala Chai", 342],
                ["Sunset Sky", 218],
                ["Samosa", 196],
                ["Cold Coffee", 174],
                ["Pav Bhaji", 112],
              ].map(([name, n]) => (
                <li key={name} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 font-medium">{name}</span>
                  <div className="flex-1 h-2.5 rounded-full bg-navy/10 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-skyx-400 to-coral" style={{ width: `${Math.min(100, (Number(n) / 342) * 100)}%` }} />
                  </div>
                  <span className="font-bold">{n}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-[22px] p-5">
            <h3 className="font-serif text-xl font-semibold">Outlet sales</h3>
            <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
              {[
                ["Vizag", "₹28k"],
                ["Bengaluru", "₹22k"],
                ["Chennai", "₹18k"],
                ["Hyderabad", "₹15k"],
                ["Goa", "₹12k"],
                ["Mumbai", "₹11k"],
              ].map(([city, v]) => (
                <div key={city} className="rounded-xl bg-white/60 dark:bg-white/10 px-3 py-2 flex justify-between">
                  <span>{city}</span>
                  <span className="font-bold">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-[22px] p-5">
            <h3 className="font-serif text-xl font-semibold">Ratings trend (7 days)</h3>
            <div className="flex items-end gap-2 h-24 mt-4" aria-label="Ratings bar chart">
              {[4.2, 4.4, 4.5, 4.7, 4.6, 4.8, 4.6].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-skyx-500 to-coral" style={{ height: `${(v / 5) * 100}%` }} />
                  <span className="text-[11px]">{v}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-navy/60 mt-2">CSS chart — swap for Recharts in production.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

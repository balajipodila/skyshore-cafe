"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/data";

const STEPS = ["Received", "Brewing & Baking", "Packed", "Out for delivery", "Delivered"];

export default function TrackPage() {
  const [idx, setIdx] = useState(1);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("skyshore_active_order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {}

    const t = setInterval(() => setIdx((i) => Math.min(i + 1, STEPS.length - 1)), 6000);
    return () => clearInterval(t);
  }, []);

  const orderId = order?.orderId || "SS-2048";
  const outlet = order?.outletName || "Visakhapatnam (Beach Road)";
  const total = order?.total || 140;
  const whatsappUrl =
    order?.notifications?.customerConfirmation?.whatsapp?.link ||
    `https://api.whatsapp.com/send?phone=918912344001&text=${encodeURIComponent(
      `Hello Skyshore Cafe! Checking my order #${orderId}`
    )}`;

  return (
    <div className="mx-3 sm:mx-6 max-w-3xl lg:mx-auto pb-16">
      <header className="glass rounded-[28px] p-6 sm:p-8 animate-float-slow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2 animate-pulse-soft">
              <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
              Order Live
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold">Order #{orderId}</h1>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs uppercase tracking-wider text-navy/60 dark:text-white/60">Estimated Time</p>
            <p className="font-serif text-2xl font-bold text-coral animate-pulse-soft">15 – 20 mins</p>
          </div>
        </div>

        <p className="mt-2 text-sm text-navy/70 dark:text-white/70">
          Outlet: <strong>Skyshore {outlet}</strong> · Amount: <strong>{formatINR(total)}</strong>
        </p>
      </header>

      {/* Multi-Channel Notification Dispatch Banner */}
      <section className="glass rounded-[24px] p-5 sm:p-6 mt-5 shadow-soft border border-white/60 dark:border-white/10 animate-slide-up">
        <h2 className="font-serif text-lg font-semibold text-navy dark:text-white mb-3">
          Multi-Channel Notifications Dispatched
        </h2>
        <div className="grid sm:grid-cols-3 gap-3 text-xs">
          <div className="rounded-2xl bg-white/70 dark:bg-white/5 p-3 border border-navy/10 dark:border-white/10 hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 mb-1">
              <span>📧</span> Email Sent
            </div>
            <p className="text-navy/70 dark:text-white/70">
              Routed to <strong>bobbypodila065@gmail.com</strong> and {order?.customerEmail || "your email"}.
            </p>
          </div>

          <div className="rounded-2xl bg-white/70 dark:bg-white/5 p-3 border border-navy/10 dark:border-white/10 hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center gap-1.5 font-bold text-skyx-600 dark:text-skyx-400 mb-1">
              <span>📱</span> SMS Alert
            </div>
            <p className="text-navy/70 dark:text-white/70">
              Order tracking SMS sent to <strong>{order?.customerPhone || "+91 98765 43210"}</strong>.
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 p-3 border border-emerald-500/30 flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300 mb-1">
                <span>💬</span> WhatsApp Ready
              </div>
              <p className="text-navy/70 dark:text-white/70">
                Full order bill & live updates on your WhatsApp.
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 font-semibold text-xs transition hover:scale-105 active:scale-95"
            >
              Open in WhatsApp →
            </a>
          </div>
        </div>
      </section>

      {/* Progress timeline */}
      <section className="glass rounded-[24px] p-6 sm:p-8 mt-5 animate-slide-up" aria-live="polite">
        <h2 className="font-serif text-xl font-semibold mb-6">Preparation Progress</h2>
        <ol className="space-y-6">
          {STEPS.map((s, i) => {
            const done = i < idx;
            const current = i === idx;
            const final = i === STEPS.length - 1 && idx === STEPS.length - 1;
            return (
              <li key={s} className="flex items-start gap-4 group">
                <span
                  className={`relative grid size-10 shrink-0 place-items-center rounded-full text-white text-sm font-bold shadow-sm transition-all duration-300 ${
                    done || final
                      ? "bg-emerald-500 scale-100"
                      : current
                      ? "bg-coral animate-pulse scale-110"
                      : "bg-navy/15 text-navy/50 dark:text-white/50 group-hover:scale-105"
                  }`}
                  aria-hidden
                >
                  {done || final ? "✓" : i + 1}
                  {current && (
                    <span className="absolute -right-1.5 -top-1.5 text-base animate-steam">
                      ☕
                    </span>
                  )}
                </span>

                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between">
                    <p className={`font-semibold text-base transition-colors ${current ? "text-coral font-bold" : done ? "text-emerald-600 dark:text-emerald-400" : ""}`}>
                      {s}
                    </p>
                    {current && (
                      <span className="text-xs uppercase font-bold tracking-wider text-coral animate-pulse">
                        In Progress
                      </span>
                    )}
                    {done && <span className="text-xs font-semibold text-emerald-600">Completed</span>}
                  </div>
                  <p className="text-xs text-navy/60 dark:text-white/60 mt-0.5">
                    {i === 0
                      ? "Order received & payment verified."
                      : i === 1
                      ? "Your masala chai / coffee is brewing on the coastal flame."
                      : i === 2
                      ? "Carefully packed with eco-friendly insulated packaging."
                      : i === 3
                      ? "Our coastal rider is on the way."
                      : "Handed over warm. Enjoy your sips!"}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 pt-6 border-t border-navy/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/menu"
            className="rounded-full bg-navy text-white dark:bg-white dark:text-navy px-6 py-2.5 text-xs sm:text-sm font-semibold hover:bg-coral transition hover:scale-105 active:scale-95"
          >
            Order More Sips & Bites
          </Link>
          <a
            href="tel:+918912344001"
            className="text-xs sm:text-sm font-semibold underline text-navy dark:text-white hover:text-coral transition"
          >
            Need help? Call Skyshore Support (+91 89123 44001)
          </a>
        </div>
      </section>
    </div>
  );
}

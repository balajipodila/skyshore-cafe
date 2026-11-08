"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/data";
import { useOrder } from "@/store/order";

const STEPS = ["Received", "Brewing & Baking", "Packed", "Out for delivery", "Delivered"];

export default function TrackPage() {
  const order = useOrder((s) => s.activeOrder);
  const updateStatus = useOrder((s) => s.updateStatus);
  const idx = order?.statusIndex ?? 0;

  useEffect(() => {
    if (!order) {
      try {
        const raw = localStorage.getItem("skyshore_active_order");
        if (raw) {
          const parsed = JSON.parse(raw);
          useOrder.setState({ activeOrder: { ...parsed, statusIndex: parsed.statusIndex ?? 0 } });
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!order) return;
    const t = setInterval(() => {
      if (idx < STEPS.length - 1) updateStatus(idx + 1);
    }, 4000);
    return () => clearInterval(t);
  }, [idx, order, updateStatus]);

  const orderId = order?.id || "SS-2048";
  const outlet = order?.outletName || "Visakhapatnam (Beach Road)";
  const total = order?.total || 140;
  const eta = idx >= 4 ? "Delivered" : idx === 3 ? "Arriving now" : idx === 2 ? "12 min" : idx === 1 ? "18 min" : "22 min";

  // No external WhatsApp link — mock only. Customer data stays local.

  return (
    <div className="mx-3 sm:mx-6 max-w-3xl lg:mx-auto pb-16">
      <header className="glass rounded-[28px] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
              Order Live
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold">Order #{orderId}</h1>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs uppercase tracking-wider text-navy/60 dark:text-white/60">Estimated Time</p>
            <p className="font-serif text-2xl font-bold text-coral">{eta}</p>
          </div>
        </div>
        <p className="mt-2 text-sm text-navy/70 dark:text-white/70">
          Outlet: <strong>Skyshore {outlet}</strong> · Amount: <strong>{formatINR(total)}</strong>
        </p>
        {order && (
          <p className="text-xs text-navy/60 dark:text-white/60 mt-1">
            {order.mode === "delivery" ? `Delivering to ${order.address || order.city || "Address"}, ${order.pincode || ""}` : "Pickup order"} · {order.paymentMethod}
          </p>
        )}
      </header>

      <section className="glass rounded-[24px] p-6 sm:p-8 mt-5" aria-live="polite">
        <h2 className="font-serif text-xl font-semibold mb-6">Preparation Progress</h2>
        <ol className="space-y-6">
          {STEPS.map((s, i) => {
            const done = i < idx;
            const current = i === idx;
            const final = i === STEPS.length - 1 && idx === STEPS.length - 1;
            return (
              <li key={s} className="flex items-start gap-4">
                <span className={`relative grid size-10 shrink-0 place-items-center rounded-full text-white text-sm font-bold shadow-sm transition-all ${done || final ? "bg-emerald-500" : current ? "bg-coral animate-pulse" : "bg-navy/15 text-navy/50 dark:text-white/50"}`} aria-hidden>
                  {done || final ? "✓" : i + 1}
                  {current && <span className="absolute -right-1.5 -top-1.5 text-base animate-steam">☕</span>}
                </span>
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between">
                    <p className={`font-semibold text-base ${current ? "text-coral font-bold" : ""}`}>{s}</p>
                    {current && <span className="text-xs uppercase font-bold tracking-wider text-coral animate-pulse">In Progress</span>}
                    {done && <span className="text-xs font-semibold text-emerald-600">Completed</span>}
                  </div>
                  <p className="text-xs text-navy/60 dark:text-white/60 mt-0.5">
                    {i === 0 ? "Order received & payment verified." : i === 1 ? "Your masala chai / coffee is brewing on the coastal flame." : i === 2 ? "Carefully packed with eco-friendly insulated packaging." : i === 3 ? "Our coastal rider is on the way." : "Handed over warm. Enjoy your sips!"}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 pt-6 border-t border-navy/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
          <Link href="/menu" className="rounded-full bg-navy text-white dark:bg-white dark:text-navy px-6 py-2.5 text-xs sm:text-sm font-semibold hover:bg-coral transition">
            Order More Sips & Bites
          </Link>
          <a href="tel:+918912344001" className="text-xs sm:text-sm font-semibold underline hover:text-emerald-600">
            Need help? Call Skyshore (+91 89123 44001)
          </a>
        </div>
      </section>

      {!order && (
        <p className="text-center text-sm text-navy/60 dark:text-white/60 mt-6">
          No active order found. <Link href="/menu" className="underline font-semibold">Place an order</Link> to track it here.
        </p>
      )}
    </div>
  );
}

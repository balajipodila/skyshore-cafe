"use client";
import { useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/store/cart";
import { formatINR } from "@/lib/data";

export function CartAddPopup() {
  const lastAdded = useCart((s) => s.lastAddedItem);
  const clearLastAdded = useCart((s) => s.clearLastAdded);
  const setDrawerOpen = useCart((s) => s.setDrawerOpen);
  const total = useCart((s) => s.total());
  const count = useCart((s) => s.count());

  useEffect(() => {
    if (!lastAdded) return;
    const timer = setTimeout(() => {
      clearLastAdded();
    }, 4000);
    return () => clearTimeout(timer);
  }, [lastAdded, clearLastAdded]);

  if (!lastAdded) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-4 sm:right-6 z-[60] glass rounded-3xl p-4 shadow-lift border border-white/60 dark:border-white/20 max-w-sm w-full animate-slide-up backdrop-blur-xl"
    >
      <div className="flex items-start gap-3.5">
        {lastAdded.image ? (
          <div className="relative size-14 shrink-0 rounded-2xl overflow-hidden border border-white/40 shadow-sm">
            <Image
              src={lastAdded.image}
              alt={lastAdded.name}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
        ) : (
          <div className="size-14 shrink-0 rounded-2xl bg-coral/20 text-coral-dark grid place-items-center font-bold">
            ✓
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            Added to your basket
          </div>
          <h4 className="font-serif font-semibold text-navy dark:text-white truncate text-base mt-0.5">
            {lastAdded.name}
          </h4>
          <p className="text-xs text-navy/70 dark:text-white/70">
            {lastAdded.size ? `${lastAdded.size} · ` : ""}
            {formatINR(lastAdded.price)} × {lastAdded.qty}
          </p>
        </div>

        <button
          type="button"
          onClick={clearLastAdded}
          aria-label="Dismiss notification"
          className="text-navy/40 dark:text-white/40 hover:text-navy dark:hover:text-white text-lg p-1"
        >
          ✕
        </button>
      </div>

      <div className="mt-3.5 pt-3 border-t border-navy/10 dark:border-white/10 flex items-center justify-between gap-2">
        <span className="text-xs text-navy/70 dark:text-white/70">
          Basket: <strong className="text-navy dark:text-white">{count} {count === 1 ? "item" : "items"}</strong> ({formatINR(total)})
        </span>
        <button
          type="button"
          onClick={() => {
            clearLastAdded();
            setDrawerOpen(true);
          }}
          className="rounded-full bg-navy text-white dark:bg-white dark:text-navy px-4 py-1.5 text-xs font-semibold hover:bg-coral hover:text-white dark:hover:bg-coral dark:hover:text-white transition shadow-sm"
        >
          View Basket →
        </button>
      </div>
    </div>
  );
}

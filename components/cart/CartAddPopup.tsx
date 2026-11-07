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

  const confettiColors = ["#FF7A6B", "#3FA9C4", "#EAC88C", "#2A9D8F", "#F4F1DE"];

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-4 sm:right-6 z-[60] glass rounded-3xl p-4 shadow-lift border border-white/60 dark:border-white/20 max-w-sm w-full animate-pop-in backdrop-blur-xl"
    >
      {/* Confetti particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute size-1.5 rounded-full animate-float-slow"
            style={{
              left: `${8 + i * 8}%`,
              top: `${-4 + (i % 3) * 6}%`,
              backgroundColor: confettiColors[i % confettiColors.length],
              animationDelay: `${i * 0.1}s`,
              opacity: 0.8,
            }}
          />
        ))}
      </div>

      <div className="relative flex items-start gap-3.5">
        {lastAdded.image ? (
          <div className="relative size-14 shrink-0 rounded-2xl overflow-hidden border border-white/40 shadow-sm animate-scale-in">
            <Image
              src={lastAdded.image}
              alt={lastAdded.name}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
        ) : (
          <div className="size-14 shrink-0 rounded-2xl bg-coral/20 text-coral-dark grid place-items-center font-bold animate-pop-in">
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
          className="text-navy/40 dark:text-white/40 hover:text-navy dark:hover:text-white text-lg p-1 hover:rotate-90 transition-transform"
        >
          ✕
        </button>
      </div>

      <div className="relative mt-3.5 pt-3 border-t border-navy/10 dark:border-white/10 flex items-center justify-between gap-2">
        <span className="text-xs text-navy/70 dark:text-white/70">
          Basket: <strong className="text-navy dark:text-white animate-count-tick inline-block">{count} {count === 1 ? "item" : "items"}</strong> ({formatINR(total)})
        </span>
        <button
          type="button"
          onClick={() => {
            clearLastAdded();
            setDrawerOpen(true);
          }}
          className="rounded-full bg-navy text-white dark:bg-white dark:text-navy px-4 py-1.5 text-xs font-semibold hover:bg-coral hover:text-white dark:hover:bg-coral dark:hover:text-white transition shadow-sm hover:scale-105 active:scale-95"
        >
          View Basket →
        </button>
      </div>
    </div>
  );
}

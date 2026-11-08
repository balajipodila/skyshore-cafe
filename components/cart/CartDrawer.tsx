"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useCart } from "@/store/cart";
import { Button } from "../ui/Button";
import { formatINR } from "@/lib/data";

export function CartDrawer({ open: propsOpen, onClose: propsOnClose }: { open?: boolean; onClose?: () => void }) {
  const storeOpen = useCart((s) => s.isDrawerOpen);
  const setStoreOpen = useCart((s) => s.setDrawerOpen);
  const isControlled = typeof propsOpen === "boolean";
  const isOpen = isControlled ? propsOpen : storeOpen;
  const handleClose = () => {
    if (propsOnClose) propsOnClose();
    setStoreOpen(false);
  };
  const closeRef = useRef<HTMLButtonElement>(null);

  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const total = useCart((s) => s.total());

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    // Focus the close button for screen readers / keyboard
    setTimeout(() => closeRef.current?.focus(), 50);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-navy/40 backdrop-blur-sm animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
        onClick={handleClose}
      >
        <aside
          onClick={(e) => e.stopPropagation()}
          className="glass ml-auto h-full w-full sm:max-w-md p-4 sm:p-6 flex flex-col rounded-none sm:rounded-l-[28px] animate-slide-in-right max-w-[100vw] overflow-x-hidden"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold">Your basket</h2>
            <button ref={closeRef} type="button" onClick={handleClose} className="glass rounded-full px-4 py-2 text-sm font-semibold min-h-[44px]" aria-label="Close cart">
              Close
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex-1 grid place-items-center py-16 text-center">
              <div>
                <p className="font-serif text-xl">Your basket is empty — for now.</p>
                <p className="text-sm text-navy/60 mt-1">The sea is waiting. Add something warm.</p>
                <Button href="/menu" variant="primary" className="mt-5">
                  Browse menu
                </Button>
              </div>
            </div>
          ) : (
            <>
              <ul className="mt-5 flex-1 overflow-y-auto space-y-3 pr-1">
                {items.map((i) => (
                  <li key={`${i.id}-${i.size ?? "base"}`} className="glass rounded-2xl p-3 flex gap-3 items-center animate-slide-up">
                    {i.image && (
                      <Image src={i.image} alt={i.name} width={64} height={64} className="size-16 rounded-xl object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold leading-tight truncate">{i.name}</p>
                      <p className="text-xs text-navy/60">
                        {i.size ? `${i.size} · ` : ""}
                        {formatINR(i.price)} × {i.qty}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold">{formatINR(i.price * i.qty)}</p>
                      <button type="button" onClick={() => remove(i.id, i.size)} className="text-xs underline mt-1 min-h-[28px]" aria-label={`Remove ${i.name}`}>
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 space-y-2">
                <div className="glass rounded-full px-4 py-3 text-sm flex justify-between">
                  <span>Free delivery above ₹299</span>
                  <span className="font-bold">{total >= 299 ? "Free" : formatINR(29)}</span>
                </div>
                <p className="text-sm text-navy/70 dark:text-white/70">
                  Pairs well with: <span className="font-semibold">Samosa ₹30</span> — one-tap add from the menu.
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-serif text-xl font-semibold">Total</span>
                  <span className="font-bold text-xl">{formatINR(total)}</span>
                </div>
                <div className="flex gap-2">
                  <Button href="/checkout" className="flex-1">
                    Checkout
                  </Button>
                  <button type="button" onClick={clear} className="rounded-full px-4 py-2 text-sm font-semibold border min-h-[44px]">
                    Clear
                  </button>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </>
  );
}
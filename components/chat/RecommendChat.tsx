"use client";
import { useRef, useState } from "react";
import { menuForOutlet } from "@/lib/menu";
import type { MenuItem } from "@/lib/types";
import { useCart } from "@/store/cart";
import { useLocation } from "@/store/location";
import { formatINR } from "@/lib/data";
import { useFocusTrap } from "@/hooks/useFocusTrap";

type Msg = { role: "user" | "ai"; text: string; items?: MenuItem[]; source?: "ai" | "fallback" };

export function RecommendChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Tell me a mood — something like “light, sweet and cold under ₹100” — and I will find a few sips for you." },
  ]);
  const add = useCart((s) => s.add);
  const outletId = useLocation((s) => s.outletId);

  const panelRef = useRef<HTMLElement>(null);
  useFocusTrap({ open, onClose: () => setOpen(false), containerRef: panelRef });

  async function send() {
    const currentInput = input.trim();
    if (!currentInput) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: currentInput }]);
    setLoading(true);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ prompt: currentInput, outletId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not fetch recommendations");
      const outletMenu = menuForOutlet(outletId);
      const items: MenuItem[] = (data.items as string[])
        .map((id) => outletMenu.find((m) => m.id === id))
        .filter(Boolean) as MenuItem[];
      setMessages((m) => [
        ...m,
        { role: "ai", text: data.reason || data.note || "Here are a few that fit.", items, source: data.source },
      ]);
    } catch {
      setMessages((m) => [...m, { role: "ai", text: "I hit a wave. Try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-40 glass rounded-full px-5 py-3.5 font-semibold shadow-lift hover:-translate-y-0.5 transition"
        aria-expanded={open}
        aria-label="Ask Skyshore AI for a recommendation"
      >
        {open ? "Close" : "Not sure? Ask AI"}
      </button>

      {open && (
        <section
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu recommender"
          className="fixed bottom-24 right-4 sm:right-5 z-40 glass w-[min(92vw,420px)] rounded-[24px] p-4 max-h-[70vh] flex flex-col animate-pop-in"
        >
          <h2 className="font-serif text-xl font-semibold">Skyshore recommender</h2>
          <p className="text-xs text-navy/60 dark:text-white/60 mt-0.5">English · Telugu · Hindi · Tenglish — all fine.</p>

          <div className="mt-3 flex-1 overflow-y-auto space-y-3 pr-1">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <div className={`inline-block max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "bg-navy text-white dark:bg-white dark:text-navy" : "bg-white/70 dark:bg-white/10"}`}>
                  {m.source === "fallback" && (
                    <span className="block text-[11px] font-bold uppercase tracking-wide text-navy/50 dark:text-white/50">Basic search</span>
                  )}
                  {m.text}
                  {m.items && m.items.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {m.items.map((it) => (
                        <div key={it.id} className="flex items-center gap-2 bg-white dark:bg-white/10 rounded-xl p-2">
                          <img src={it.image} alt={it.name} className="size-10 rounded-lg object-cover" />
                          <div className="flex-1 text-left">
                            <p className="text-sm font-semibold leading-tight">{it.name}</p>
                            <p className="text-xs">{formatINR(it.sizes[0]?.price ?? 0)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => add({ id: it.id, name: it.name, price: it.sizes[0]?.price ?? 0, qty: 1, size: it.sizes[0]?.label, image: it.image })}
                            className="rounded-full bg-coral text-white px-3 py-1.5 text-xs font-semibold min-h-[36px]"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && <p className="text-sm text-navy/60">Thinking…</p>}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="mt-3 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="light, sweet and cold under ₹100"
              maxLength={300}
              className="flex-1 min-w-0 rounded-full bg-white/80 dark:bg-white/10 px-4 py-2.5 text-sm outline-none border border-navy/10 dark:border-white/15 text-navy dark:text-white placeholder:text-navy/50 dark:placeholder:text-white/50 min-h-[44px]"
              aria-label="Describe what you crave"
            />
            <button type="submit" className="rounded-full bg-navy text-white dark:bg-white dark:text-navy px-5 py-2.5 text-sm font-semibold min-h-[44px]">
              Send
            </button>
          </form>
        </section>
      )}
    </>
  );
}

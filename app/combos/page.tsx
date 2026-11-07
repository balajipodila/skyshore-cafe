"use client";
import combos from "@/data/combos.json";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/store/cart";

export default function CombosPage() {
  const add = useCart((s) => s.add);

  return (
    <div className="mx-3 sm:mx-6 max-w-7xl lg:mx-auto pb-12">
      <header className="glass rounded-[28px] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold">Combos & Offers</h1>
          <p className="mt-2 text-navy/70 dark:text-white/70 max-w-2xl">
            Built for students, couples, families, and anyone who likes to save. Every combo shows exactly what you save.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="coral">WAVE10 — 10% off</Badge>
          <Badge tone="coral">FIRSTSIP — ₹100 off first order</Badge>
        </div>
      </header>

      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {combos.map((c) => (
          <GlassCard key={c.id}>
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-serif text-2xl font-semibold leading-tight">{c.name}</h2>
              <Badge tone="sand">{c.tag}</Badge>
            </div>
            <ul className="mt-3 space-y-1.5 text-sm text-navy/70 dark:text-white/80">
              {c.items.map((i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden className="mt-1.5 size-1.5 rounded-full bg-coral" />
                  {i}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-end justify-between">
              <div>
                <p className="text-sm text-navy/60 dark:text-white/60 line-through">{formatINR(c.original)}</p>
                <p className="font-bold text-2xl">{formatINR(c.price)}</p>
              </div>
              <p className="rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-sm font-bold dark:bg-emerald-900/30 dark:text-emerald-200">
                You save {formatINR(c.original - c.price)}
              </p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                onClick={() =>
                  add({
                    id: c.id,
                    name: c.name,
                    price: c.price,
                    qty: 1,
                    size: "Combo Set",
                  })
                }
                className="w-full rounded-full bg-coral text-white py-3 text-sm font-semibold hover:bg-coral-dark transition shadow-soft"
              >
                Add Combo to Basket · {formatINR(c.price)}
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      <section aria-label="Happy hour" className="mt-8 glass rounded-[22px] p-6 grid md:grid-cols-3 gap-4 items-center">
        <div className="md:col-span-2">
          <h2 className="font-serif text-2xl font-semibold">Weekday happy hour · 4–6 PM</h2>
          <p className="text-sm text-navy/70 dark:text-white/70 mt-1">
            Flat 20% off select cold drinks. Because the golden hour deserves a glass.
          </p>
        </div>
        <Button href="/menu" variant="primary">
          Order for happy hour
        </Button>
      </section>
    </div>
  );
}

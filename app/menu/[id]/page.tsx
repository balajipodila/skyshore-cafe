"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { formatINR } from "@/lib/data";
import { ALL_MENU } from "@/lib/menu";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/store/cart";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const item = ALL_MENU.find((m) => m.id === id) ?? ALL_MENU[0];
  const [size, setSize] = useState(item.sizes[0]?.label ?? "");
  const [milk, setMilk] = useState("Regular");
  const [sweet, setSweet] = useState("Medium");
  const add = useCart((s) => s.add);

  const selected = item.sizes.find((s) => s.label === size) ?? item.sizes[0];
  const price = selected?.price ?? 0;

  const pairs = ALL_MENU.filter((m) => m.id !== item.id).slice(0, 3);

  return (
    <div className="mx-3 sm:mx-6 max-w-6xl lg:mx-auto">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-[28px] h-[380px] lg:h-[520px]">
          <Image src={item.image} alt={item.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          <span className="absolute top-4 left-4 glass rounded-full px-3 py-1.5 text-sm font-semibold">
            {item.nutrition.calories} kcal · {item.label}
          </span>
        </div>

        <div className="space-y-5">
          <header>
            <div className="flex flex-wrap gap-2">
              <Badge>{item.veg ? "Veg" : "Non-veg"}</Badge>
              <Badge tone="sand">{item.category}</Badge>
              <Badge tone="coral">{item.spice} spice</Badge>
              {item.premium && <Badge tone="coral">Premium</Badge>}
            </div>
            <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-semibold leading-[1.1]">{item.name}</h1>
            <p className="mt-2 text-navy/75 dark:text-white/80 leading-relaxed">{item.description}</p>
            <p className="mt-2 font-bold text-2xl">{formatINR(price)}</p>
          </header>

          <fieldset>
            <legend className="text-sm font-semibold">Size</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {item.sizes.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setSize(s.label)}
                  aria-pressed={size === s.label}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold ${size === s.label ? "bg-navy text-white dark:bg-white dark:text-navy" : "bg-white/70 dark:bg-white/10"}`}
                >
                  {s.label} · {formatINR(s.price)}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-semibold">Milk</span>
              <select value={milk} onChange={(e) => setMilk(e.target.value)} className="mt-1 w-full rounded-full bg-white/80 dark:bg-white/10 px-4 py-2.5 text-sm outline-none border border-navy/10">
                <option>Regular</option>
                <option>Less milk</option>
                <option>No milk</option>
                <option>Oat milk (+₹30)</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Sweetness</span>
              <select value={sweet} onChange={(e) => setSweet(e.target.value)} className="mt-1 w-full rounded-full bg-white/80 dark:bg-white/10 px-4 py-2.5 text-sm outline-none border border-navy/10">
                <option>Less sweet</option>
                <option>Medium</option>
                <option>Extra sweet</option>
              </select>
            </label>
          </div>

          <div>
            <p className="text-sm font-semibold">Add-ons</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Extra shot", "Ice cream scoop", "Extra cheese"].map((a) => (
                <label key={a} className="inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-white/10 px-4 py-2 text-sm cursor-pointer">
                  <input type="checkbox" className="size-4" />
                  {a}
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => add({ id: item.id, name: item.name, price, qty: 1, size, image: item.image })}
            className="w-full rounded-full bg-coral text-white py-4 font-semibold text-lg min-h-[52px] hover:bg-coral-dark transition"
          >
            Add to cart · {formatINR(price)}
          </button>

          <details className="glass rounded-2xl p-5">
            <summary className="font-serif text-xl font-semibold cursor-pointer">Nutrition details</summary>
            <dl className="mt-3 grid grid-cols-3 gap-3 text-sm">
              {[
                ["Calories", `${item.nutrition.calories} kcal`],
                ["Protein", `${item.nutrition.protein}g`],
                ["Carbs", `${item.nutrition.carbs}g`],
                ["Fat", `${item.nutrition.fat}g`],
                ["Sugar", `${item.nutrition.sugar}g`],
                ["Fibre", `${item.nutrition.fibre}g`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-white/70 dark:bg-white/10 p-3 text-center">
                  <dt className="text-xs uppercase tracking-wide text-navy/60">{k}</dt>
                  <dd className="font-bold">{v}</dd>
                </div>
              ))}
            </dl>
            {item.allergens.length > 0 && (
              <p className="mt-3 text-sm">Allergens: <strong>{item.allergens.join(", ")}</strong></p>
            )}
          </details>
        </div>
      </div>

      <section aria-labelledby="pairs" className="mt-10">
        <h2 id="pairs" className="font-serif text-3xl font-semibold">Pairs well with</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {pairs.map((p) => (
            <div key={p.id} className="glass rounded-2xl p-4 flex items-center gap-3">
              <Image src={p.image} alt={p.name} width={64} height={64} className="size-16 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold leading-tight truncate">{p.name}</p>
                <p className="text-sm">{formatINR(p.sizes[0]?.price ?? 0)}</p>
              </div>
              <button
                type="button"
                onClick={() => add({ id: p.id, name: p.name, price: p.sizes[0]?.price ?? 0, qty: 1, size: p.sizes[0]?.label, image: p.image })}
                className="rounded-full bg-navy text-white dark:bg-white dark:text-navy px-4 py-2 text-sm font-semibold"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="reviews" className="mt-10">
        <h2 id="reviews" className="font-serif text-3xl font-semibold">Recent reviews</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="glass rounded-2xl p-5">
            <p className="font-semibold">Ananya · Visakhapatnam</p>
            <p className="text-sm text-navy/70 mt-1">“Good, but ask for less sweet if you are not from here. The counter listens.”</p>
          </div>
          <div className="glass rounded-2xl p-5">
            <p className="font-semibold">Rohit · Bengaluru</p>
            <p className="text-sm text-navy/70 mt-1">“Portion is honest for the price. Came back twice in one week.”</p>
          </div>
        </div>
      </section>
    </div>
  );
}

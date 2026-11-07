"use client";
import { useMemo, useState } from "react";
import { formatINR } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import { Badge } from "@/components/ui/Badge";
import { useLocation } from "@/store/location";
import { menuForOutlet, localIdsForOutlet, getOutlet } from "@/lib/menu";

const CATS = ["All", "Hot Drinks", "Cold Drinks", "Snacks", "Meals & Bakery", "Signature"];

export default function MenuPage() {
  const outletId = useLocation((s) => s.outletId);
  const outlet = getOutlet(outletId);
  const localIds = useMemo(() => localIdsForOutlet(outletId), [outletId]);
  const outletMenu = useMemo(() => menuForOutlet(outletId), [outletId]);

  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<Record<string, boolean>>({
    veg: false, nonVeg: false, hot: false, cold: false, caffeineFree: false, under100: false, under200: false,
  });
  const [sort, setSort] = useState<"popular" | "priceLow" | "priceHigh">("popular");
  const [limit, setLimit] = useState(24);

  const items = useMemo(() => {
    let list = outletMenu.slice();
    if (cat !== "All") list = list.filter((m) => m.category === cat);
    if (q) list = list.filter((m) => (m.name + m.description + m.tags.join(" ")).toLowerCase().includes(q.toLowerCase()));
    if (filters.veg) list = list.filter((m) => m.veg);
    if (filters.nonVeg) list = list.filter((m) => !m.veg);
    if (filters.hot) list = list.filter((m) => m.hot);
    if (filters.cold) list = list.filter((m) => !m.hot);
    if (filters.caffeineFree) list = list.filter((m) => m.caffeineFree !== false);
    if (filters.under100) list = list.filter((m) => (m.sizes[0]?.price ?? 999) <= 100);
    if (filters.under200) list = list.filter((m) => (m.sizes[0]?.price ?? 999) <= 200);
    if (sort === "popular") list.sort((a, b) => b.popularity - a.popularity);
    if (sort === "priceLow") list.sort((a, b) => (a.sizes[0]?.price ?? 0) - (b.sizes[0]?.price ?? 0));
    if (sort === "priceHigh") list.sort((a, b) => (b.sizes[0]?.price ?? 0) - (a.sizes[0]?.price ?? 0));
    return list;
  }, [cat, q, filters, sort, outletMenu]);

  const visibleItems = items.slice(0, limit);

  return (
    <div className="mx-3 sm:mx-6 max-w-7xl lg:mx-auto">
      <header className="glass rounded-[28px] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.22em] font-semibold text-skyx-700 dark:text-skyx-200">
          Skyshore {outlet.city} · {outlet.area}
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold mt-1">Menu</h1>
        <p className="mt-2 text-navy/70 dark:text-white/70 max-w-2xl">
          Everything from ₹20 cutting chai to ₹899 sunset sets. Local specials for {outlet.city} are marked “Only at {outlet.city}”.
        </p>
      </header>

      <div className="mt-6 flex flex-col lg:flex-row gap-5 items-start">
        <aside className="glass rounded-[22px] p-4 w-full lg:w-72 shrink-0" aria-label="Filters">
          <div className="flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCat(c);
                  setLimit(24);
                }}
                className={`rounded-full px-4 py-2 text-sm font-semibold min-h-[40px] transition ${cat === c ? "bg-navy text-white dark:bg-white dark:text-navy shadow-sm" : "bg-white/70 dark:bg-white/10 hover:bg-white"}`}
                aria-pressed={cat === c}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-5">
            <label htmlFor="search" className="text-sm font-semibold">Search</label>
            <input
              id="search"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setLimit(24);
              }}
              placeholder="Try “cold” or “chai”…"
              className="mt-1 w-full rounded-full bg-white/80 dark:bg-white/10 px-4 py-2.5 text-sm outline-none border border-navy/10 dark:border-white/15"
            />
          </div>

          <fieldset className="mt-5">
            <legend className="text-sm font-semibold">Filters</legend>
            <div className="mt-2 grid gap-2 text-sm">
              {[
                ["veg", "Veg only"],
                ["nonVeg", "Non-veg"],
                ["hot", "Hot"],
                ["cold", "Cold"],
                ["caffeineFree", "Caffeine-free"],
                ["under100", "Under ₹100"],
                ["under200", "Under ₹200"],
              ].map(([key, label]) => (
                <label key={key} className="inline-flex items-center gap-2 rounded-full px-2 py-1 hover:bg-white/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters[key]}
                    onChange={() => {
                      setFilters((f) => ({ ...f, [key]: !f[key] }));
                      setLimit(24);
                    }}
                    className="size-4 rounded"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-5">
            <label htmlFor="sort" className="text-sm font-semibold">Sort</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="mt-1 w-full rounded-full bg-white/80 dark:bg-white/10 px-4 py-2.5 text-sm outline-none border border-navy/10 dark:border-white/15"
            >
              <option value="popular">Most popular</option>
              <option value="priceLow">Price: low to high</option>
              <option value="priceHigh">Price: high to low</option>
            </select>
          </div>

          <p className="mt-4 text-xs">
            <Badge>{items.length} items · {outletMenu.length} at {outlet.city}</Badge>
          </p>
        </aside>

        <div className="flex-1 min-w-0">
          {items.length === 0 ? (
            <div className="glass rounded-[22px] p-8 text-center">
              <p className="font-serif text-2xl">Nothing matches — yet.</p>
              <p className="text-sm text-navy/60 mt-1">Try fewer filters. The sea is big.</p>
              <p className="mt-3 text-sm">From <strong>{formatINR(20)}</strong> chai to <strong>{formatINR(899)}</strong> signature sets.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visibleItems.map((m) => (
                  <ProductCard key={m.id} item={m} localCity={localIds.has(m.id) ? outlet.city : undefined} />
                ))}
              </div>

              {visibleItems.length < items.length && (
                <div className="mt-8 text-center">
                  <button
                    type="button"
                    onClick={() => setLimit((prev) => prev + 24)}
                    className="rounded-full glass px-8 py-3 text-sm font-semibold shadow-soft hover:bg-white dark:hover:bg-white/20 transition hover:-translate-y-0.5"
                  >
                    Load More Sips & Bites ({items.length - visibleItems.length} more)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
import Image from "next/image";
import Link from "next/link";
import type { MenuItem } from "@/lib/types";
import { useCart } from "@/store/cart";
import { Badge } from "./Badge";
import { formatINR } from "@/lib/data";

export function ProductCard({ item, localCity }: { item: MenuItem; localCity?: string }) {
  const add = useCart((s) => s.add);
  const basePrice = item.sizes[0]?.price ?? 0;

  return (
    <article
      className="group glass-soft rounded-[22px] overflow-hidden p-0 hover:-translate-y-1 transition"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-[1.05] transition duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className="absolute top-3 left-3 glass rounded-full px-2.5 py-1 text-xs font-semibold">
          {item.nutrition.calories} kcal · {item.label}
        </span>
        <span className="absolute top-3 right-3 rounded-full bg-white/80 backdrop-blur px-2.5 py-1 text-xs font-bold">
          {item.veg ? "Veg" : "Non-veg"}
        </span>
        {(item.premium || localCity) && (
          <span className="absolute bottom-3 left-3 flex gap-1.5">
            {item.premium && (
              <span className="rounded-full bg-coral text-white px-2.5 py-1 text-xs font-bold">Premium</span>
            )}
            {localCity && (
              <span className="glass rounded-full px-2.5 py-1 text-xs font-bold">Only at {localCity}</span>
            )}
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-xl font-semibold leading-tight">{item.name}</h3>
          <span className="font-bold text-lg whitespace-nowrap">{formatINR(basePrice)}</span>
        </div>
        <p className="mt-2 text-sm text-navy/70 dark:text-white/70 leading-relaxed line-clamp-2">
          {item.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.slice(0, 2).map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
          <Badge tone="sand">{item.prepTime} min</Badge>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Link
            href={`/menu/${item.id}`}
            className="flex-1 text-center rounded-full py-2.5 text-sm font-semibold border border-navy/10 dark:border-white/15 hover:bg-white/50 dark:hover:bg-white/10 transition"
            aria-label={`View ${item.name}`}
          >
            View
          </Link>
          <button
            type="button"
            onClick={() =>
              add({ id: item.id, name: item.name, price: basePrice, qty: 1, size: item.sizes[0]?.label, image: item.image })
            }
            className="flex-1 rounded-full bg-navy text-white dark:bg-white dark:text-navy py-2.5 text-sm font-semibold hover:bg-coral hover:text-white transition"
            aria-label={`Add ${item.name} to cart`}
          >
            Quick add
          </button>
        </div>
      </div>
    </article>
  );
}

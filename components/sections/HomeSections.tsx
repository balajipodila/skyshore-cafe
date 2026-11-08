"use client";
import Image from "next/image";
import { REVIEWS, formatINR } from "@/lib/data";
import { OUTLETS, getOutlet } from "@/lib/menu";
import { todaysSpecials, todaysCombos, chefsSpecial } from "@/lib/daily";
import { useLocation } from "@/store/location";
import { useCart } from "@/store/cart";
import { useEffect, useState } from "react";
import { ProductCard } from "../ui/ProductCard";
import { Button } from "../ui/Button";
import { Rating } from "../ui/Rating";
import { WaveDivider } from "../ui/WaveDivider";
import { GlassCard } from "../ui/GlassCard";
import { Badge } from "../ui/Badge";
import combos from "@/data/combos.json";
import Link from "next/link";

export function Hero() {
  return (
    <section aria-label="Hero" className="relative mx-3 sm:mx-6 max-w-7xl lg:mx-auto overflow-hidden rounded-[32px] min-h-[540px] sm:min-h-[600px]">
      <div className="absolute inset-0 animate-parallax-slow">
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&q=80"
          alt="Calm beach with turquoise water and soft sky at golden hour"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/55 via-navy/10 to-transparent" />
      </div>

      <div className="relative z-10 flex h-full min-h-[540px] sm:min-h-[600px] flex-col justify-end p-6 sm:p-10 lg:p-14 pb-16 animate-fade-in-up">
        <div className="glass rounded-[24px] p-6 sm:p-8 max-w-2xl">
          <p className="text-xs tracking-[0.24em] uppercase font-semibold text-skyx-700 dark:text-skyx-200 animate-pulse-soft">
            Skyshore Café · Vizag to Delhi
          </p>
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-balance">
            Where the sky meets the sea, and your chai is always hot.
          </h1>
          <p className="mt-3 text-base sm:text-lg leading-relaxed text-navy/75 dark:text-white/80">
            A beachside café for everyone — students on ₹25 chai, families on falooda, and couples who just want to watch the light change.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button href="/menu">Order Now</Button>
            <Button href="/combos" variant="ghost">
              See today&apos;s combos
            </Button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
            <Rating value={4.8} />
            <span className="text-navy/60 dark:text-white/70">4.8 · 12k+ reviews</span>
            <span className="flex items-center gap-1.5 ml-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-emerald-500">
                142 brewing now
              </span>
            </span>
          </div>

          <div className="mt-6 pt-4 border-t border-navy/10 dark:border-white/10 flex items-center justify-between">
            <div className="flex -space-x-2.5 animate-fade-in">
              {[1, 2, 3, 4, 5].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/64?u=customer${i}@skyshore.cafe`}
                  alt={`Customer ${i}`}
                  className="rounded-full border-2 border-white dark:border-navy size-8 h-8 object-cover animate-float-slow hover:scale-110 transition-transform"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </div>
            <div className="text-right">
              <p className="text-xs text-navy/60 dark:text-white/60">Join 12,400+ sea lovers this week</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function useDaily(outletId: string) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return {
    specials: todaysSpecials(outletId),
    combos: todaysCombos(outletId),
    chef: chefsSpecial(outletId),
  };
}

function SkeletonCards({ n = 3 }: { n?: number }) {
  return (
    <div className="grid gap-5 md:grid-cols-3" aria-hidden>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="glass rounded-[22px] overflow-hidden">
          <div className="h-48 bg-navy/10 dark:bg-white/10 animate-pulse" />
          <div className="p-5 space-y-3">
            <div className="h-5 rounded-full bg-navy/10 animate-pulse w-2/3" />
            <div className="h-3 rounded-full bg-navy/10 animate-pulse w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChefSpecial() {
  const outletId = useLocation((s) => s.outletId);
  const daily = useDaily(outletId);
  const add = useCart((s) => s.add);
  if (!daily) {
    return (
      <section aria-labelledby="chef" className="mx-3 sm:mx-6 max-w-7xl lg:mx-auto mt-10">
        <div className="glass rounded-[28px] overflow-hidden grid lg:grid-cols-2">
          <div className="h-64 lg:h-[420px] bg-navy/10 animate-pulse" />
          <div className="p-6 sm:p-8">
            <div className="h-4 w-32 rounded-full bg-navy/10 animate-pulse" />
            <div className="mt-4 h-8 w-3/4 rounded-full bg-navy/10 animate-pulse" />
            <div className="mt-3 h-4 w-full rounded-full bg-navy/10 animate-pulse" />
          </div>
        </div>
      </section>
    );
  }
  const { chef } = daily;
  if (!chef) return null;
  const { item, note } = chef;
  return (
    <section aria-labelledby="chef" className="mx-3 sm:mx-6 max-w-7xl lg:mx-auto mt-10">
      <div className="glass rounded-[28px] overflow-hidden grid lg:grid-cols-2">
        <div className="relative h-64 lg:h-[420px]">
          <Image src={item.image} alt={item.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" loading="lazy" />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge tone="coral">Chef&apos;s special</Badge>
            {item.premium && <Badge>Premium</Badge>}
          </div>
          <span className="absolute bottom-4 left-4 glass rounded-full px-3 py-1.5 text-sm font-semibold">
            {item.nutrition.calories} kcal · {item.label}
          </span>
        </div>
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          <p className="text-xs uppercase tracking-[0.22em] font-semibold text-skyx-700 dark:text-skyx-200">
            Why chef picked it · {getOutlet(outletId).city}
          </p>
          <h2 id="chef" className="font-serif text-3xl sm:text-4xl font-semibold mt-2">{item.name}</h2>
          <p className="mt-3 text-navy/75 dark:text-white/80 leading-relaxed">{note}</p>
          <p className="mt-3 font-bold text-2xl">{formatINR(item.sizes[0]?.price ?? 0)}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button href={`/menu/${item.id}`}>Order this</Button>
            <button
              type="button"
              onClick={() => add({ id: item.id, name: item.name, price: item.sizes[0]?.price ?? 0, qty: 1, size: item.sizes[0]?.label, image: item.image })}
              className="rounded-full bg-navy text-white dark:bg-white dark:text-navy px-6 py-3 text-sm sm:text-base font-semibold min-h-[44px]"
            >
              Quick add
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TodaySpecials() {
  const outletId = useLocation((s) => s.outletId);
  const daily = useDaily(outletId);
  return (
    <section aria-labelledby="specials" className="mx-3 sm:mx-6 max-w-7xl lg:mx-auto mt-10">
      <div className="flex items-end justify-between gap-4">
        <h2 id="specials" className="font-serif text-3xl sm:text-4xl font-semibold">
          Today&apos;s specials
        </h2>
        <p className="text-sm text-navy/60 dark:text-white/60 hidden sm:block">Changed with the tide, daily.</p>
      </div>
      <div className="mt-5">
        {!daily ? (
          <SkeletonCards />
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {daily.specials.map((m, i) => (
              <ProductCard key={m.id} item={m} priority={i === 0} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function ComboStrip() {
  const outletId = useLocation((s) => s.outletId);
  const daily = useDaily(outletId);
  const shown = daily ? daily.combos : combos.slice(0, 4);
  return (
    <section aria-labelledby="combos" className="mx-3 sm:mx-6 max-w-7xl lg:mx-auto mt-10">
      <WaveDivider />
      <GlassCard className="mt-2">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5 justify-between">
          <div>
            <p className="text-xs tracking-[0.22em] uppercase font-semibold text-coral">Combos & offers</p>
            <h2 id="combos" className="font-serif text-3xl font-semibold mt-1">
              Chai + Samosa for ₹49. Need we say more?
            </h2>
            <p className="text-sm text-navy/70 dark:text-white/70 mt-1">
              {combos.length} combos · You save up to ₹250 every time. Code <strong>WAVE10</strong> for 10% off.
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1" aria-live="polite">
            {shown.map((c) => (
              <div key={c.id} className="shrink-0 rounded-2xl bg-white/70 dark:bg-white/10 px-4 py-3 text-sm">
                <p className="font-semibold">{c.name}</p>
                <p className="font-bold">{formatINR(c.price)}</p>
                <p className="text-xs text-emerald-600 font-semibold">You save {formatINR(c.original - c.price)}</p>
              </div>
            ))}
          </div>
          <Button href="/combos">All combos</Button>
        </div>
      </GlassCard>
    </section>
  );
}

export function StoryTeaser() {
  return (
    <section aria-labelledby="story" className="mx-3 sm:mx-6 max-w-7xl lg:mx-auto mt-14 grid gap-6 lg:grid-cols-12 items-start">
      <div className="lg:col-span-5 relative">
        <Image
          src="/founder.jpg"
          alt="Podila Balaji, founder of Skyshore"
          width={800}
          height={600}
          className="rounded-[28px] object-cover object-top aspect-[4/5] lg:aspect-auto lg:h-[520px] w-full"
        />
        <div className="glass absolute -bottom-5 -right-2 sm:gap-3 rounded-2xl px-4 py-3 max-w-[240px]">
          <p className="text-xs uppercase tracking-widest font-semibold">Since 2019</p>
          <p className="font-serif text-lg leading-tight">Started as a beach stall. Still the same recipe.</p>
        </div>
      </div>
      <div className="lg:col-span-7 lg:pl-8 lg:pt-10">
        <p className="text-xs tracking-[0.22em] uppercase font-semibold text-skyx-700 dark:text-skyx-200">Our story</p>
        <h2 id="story" className="mt-2 font-serif text-4xl sm:text-5xl font-semibold leading-[1.1] text-balance">
          We opened a café that smells like rain on sand.
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-navy/75 dark:text-white/80 max-w-2xl">
          I&apos;m Podila Balaji (Bobby) — born in Guntur, with an explorer&apos;s heart. I&apos;ve spent my life travelling along India&apos;s coastlines, drawn to the open sea, the salt in the breeze, and the calm of secluded beaches at dusk. In 2019, I started Skyshore near RK Beach with two tables and a single burner so that anyone who loves the sea can sit with a hot chai and honest food without a hurry. Six years on, we&apos;re in twelve cities, but the coastal spirit remains untouched.
        </p>
        <ul className="mt-6 space-y-3 max-w-xl">
          {[
            "Milk from local dairies, not powders",
            "Masala ground in small batches, every week",
            "Prices a student can pay once a day, every day",
          ].map((t) => (
            <li key={t} className="flex gap-3 items-start">
              <span className="mt-1 size-2 rounded-full bg-coral" aria-hidden />
              <span className="text-base">{t}</span>
            </li>
          ))}
        </ul>
        <div className="mt-7">
          <Button href="/about" variant="outline">
            Meet the founder
          </Button>
        </div>
      </div>
    </section>
  );
}

export function OutletsTeaser() {
  return (
    <section aria-labelledby="outlets" className="mx-3 sm:mx-6 max-w-7xl lg:mx-auto mt-14">
      <div className="flex items-end justify-between gap-4">
        <h2 id="outlets" className="font-serif text-3xl sm:text-4xl font-semibold">
          Twelve shores, one calm.
        </h2>
        <Button href="/outlets" variant="ghost" className="hidden sm:inline-flex">
          All outlets
        </Button>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {OUTLETS.slice(0, 4).map((o) => (
          <div key={o.id} className="relative overflow-hidden rounded-[22px] h-56 group">
            <Image
              src={o.image}
              alt={`${o.city} — ${o.area}`}
              fill
              className="object-cover group-hover:scale-105 transition duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
            <div className="absolute bottom-0 p-4 text-white">
              <p className="font-serif text-xl font-semibold">{o.city}</p>
              <p className="text-sm opacity-85">{o.area} · {o.timings}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-navy/60 dark:text-white/60">+ 8 more cities · <Link href="/outlets" className="underline font-semibold">See all</Link></p>
    </section>
  );
}

export function Testimonials() {
  return (
    <section aria-labelledby="reviews" className="mx-3 sm:mx-6 max-w-7xl lg:mx-auto mt-14">
      <h2 id="reviews" className="font-serif text-3xl sm:text-4xl font-semibold">
        Said at the counter.
      </h2>
      <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.slice(0, 3).map((r) => (
          <GlassCard key={r.id}>
            <Rating value={r.rating} />
            <p className="mt-3 leading-relaxed">“{r.text}”</p>
            <p className="mt-4 text-sm font-semibold">{r.name} · {r.city}</p>
            <p className="text-xs text-navy/60 dark:text-white/60">Ordered {r.dish}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

export function Newsletter() {
  return (
    <section aria-labelledby="newsletter" className="mx-3 sm:mx-6 max-w-7xl lg:mx-auto mt-14">
      <GlassCard className="grid lg:grid-cols-2 gap-6 items-center">
        <div>
          <h2 id="newsletter" className="font-serif text-3xl font-semibold">One email a week. Wave Points, first dibs, no spam.</h2>
          <p className="mt-2 text-navy/70 dark:text-white/70">Get ₹100 off your first online order. Unsubscribe whenever.</p>
        </div>
        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()} aria-label="Newsletter signup">
          <label className="sr-only" htmlFor="newsletter-email">Email address</label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="you@example.com"
            className="flex-1 min-w-0 rounded-full bg-white/80 dark:bg-white/10 px-5 py-3 text-sm outline-none border border-navy/10 dark:border-white/15"
          />
          <button type="submit" className="rounded-full bg-coral text-white px-6 py-3 text-sm font-semibold">
            Join
          </button>
        </form>
      </GlassCard>
    </section>
  );
}

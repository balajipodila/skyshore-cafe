import Image from "next/image";
import { OUTLETS } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";

export default function OutletsPage() {
  return (
    <div className="mx-3 sm:mx-6 max-w-7xl lg:mx-auto">
      <header className="glass rounded-[28px] p-6 sm:p-8 flex flex-col lg:flex-row justify-between gap-4 lg:items-end">
        <div>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold">Outlets</h1>
          <p className="mt-2 text-navy/70 dark:text-white/70 max-w-2xl">Twelve locations, twelve small coastlines. All fictional for this demo — but we&apos;d love the real ones to feel this real.</p>
        </div>
        <Badge tone="coral">Delivery in 9 cities</Badge>
      </header>

      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {OUTLETS.map((o) => (
          <GlassCard key={o.id} className="overflow-hidden p-0">
            <div className="relative h-48">
              <Image
                src={o.image}
                alt={`${o.city} outlet ambience`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <span className="absolute bottom-3 left-3 glass rounded-full px-3 py-1 text-xs font-semibold">{o.timings}</span>
            </div>
            <div className="p-5">
              <h2 className="font-serif text-2xl font-semibold">{o.city} · {o.area}</h2>
              <p className="mt-1.5 text-sm text-navy/70 dark:text-white/80 leading-relaxed">{o.address}</p>
              <p className="mt-2 text-sm">
                <a href={`tel:${o.phone}`} className="font-semibold underline">{o.phone}</a>
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {o.services.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(o.address)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-full bg-navy text-white dark:bg-white dark:text-navy px-5 py-2.5 text-sm font-semibold"
              >
                Get directions
              </a>
            </div>
          </GlassCard>
        ))}
      </div>

      <section aria-label="Map" className="mt-8 glass rounded-[22px] p-6 grid lg:grid-cols-3 gap-5 items-center">
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl h-64 bg-skyx-100 dark:bg-white/5 grid place-items-center">
          <p className="absolute text-sm font-semibold text-navy/60"> stylised map — 12 dots across India</p>
          {OUTLETS.map((o, i) => (
            <span
              key={o.id}
              className="absolute size-3 rounded-full bg-coral border-2 border-white shadow"
              style={{ left: `${8 + i * 7}%`, top: `${22 + (i % 4) * 16}%` }}
              title={o.city}
              aria-label={o.city}
            />
          ))}
          <div className="absolute bottom-3 left-3 glass rounded-full px-3 py-1 text-xs font-semibold">Vizag · Chennai · GoA · Mumbai · Kolkata …</div>
        </div>
        <div>
          <h2 className="font-serif text-2xl font-semibold">Delivery availability</h2>
          <p className="text-sm text-navy/70 dark:text-white/70 mt-1">Free delivery above ₹299. Pincode checked at checkout.</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {OUTLETS.map((o) => (
              <li key={o.id} className="flex justify-between bg-white/60 dark:bg-white/10 rounded-full px-3 py-1.5">
                <span>{o.city}</span>
                <span className="font-semibold">{o.services.includes("delivery") ? "Delivery ✓" : "Pickup only"}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

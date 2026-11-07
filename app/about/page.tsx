import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";

export default function AboutPage() {
  return (
    <div className="mx-3 sm:mx-6 max-w-6xl lg:mx-auto">
      <header className="glass rounded-[28px] p-6 sm:p-8">
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold">About Skyshore</h1>
        <p className="mt-2 text-navy/70 dark:text-white/70 max-w-2xl">A calm place to sit while the light changes. That was the whole brief.</p>
      </header>

      <section aria-labelledby="owner" className="mt-6 grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4">
          <div className="relative overflow-hidden rounded-[24px] h-[420px]">
            <Image src="/founder.jpg" alt="Podila Balaji, founder of Skyshore" fill className="object-cover" />
            <div className="absolute bottom-3 left-3 glass rounded-2xl px-4 py-3 max-w-[260px]">
              <p className="font-serif font-semibold">Podila Balaji (Bobby)</p>
              <p className="text-xs">Founder</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-8">
          <GlassCard>
            <p className="text-xs uppercase tracking-[0.22em] font-semibold text-skyx-700">Founder note</p>
            <h2 id="owner" className="font-serif text-3xl font-semibold mt-1">“I wanted a café that smells like the first rain on sand.”</h2>
            <p className="mt-3 leading-relaxed text-navy/80 dark:text-white/80">
              I&apos;m Podila Balaji — Bobby to my friends. I&apos;m from Guntur, and travelling has been my lifelong passion — wandering across peninsular roads, exploring hidden coastal coves, watching fishermen cast nets into sunrise tides, and breathing the scent of the sea. Whenever I traveled between cities, I longed for a quiet stop with a clean table, genuine warmth, and a comforting cup of tea that felt like home.
            </p>
            <p className="mt-3 leading-relaxed text-navy/80 dark:text-white/80">
              So in 2019, I set up two wooden tables and a burner near RK Beach in Visakhapatnam. The idea was simple: bring the peaceful aura of the sea into a café where anyone — students counting their last ₹50, busy travellers, families, or lovers watching the golden horizon — can sit as long as they want. Today, Skyshore is across twelve cities from Vizag to Mumbai, Kochi to Delhi, but that same coastal soul and honest hospitality brew in every single cup.
            </p>
          </GlassCard>

          <div className="grid sm:grid-cols-3 gap-4 mt-5">
            {["Honest prices", "Local sourcing", "Sit a while"].map((v) => (
              <GlassCard key={v}>
                <p className="font-serif text-xl font-semibold">{v}</p>
                <p className="text-sm text-navy/70 dark:text-white/70 mt-1">
                  {v === "Honest prices" && "₹25 chai, every day, not a promo."}
                  {v === "Local sourcing" && "Milk, paneer and produce from within 60 km."}
                  {v === "Sit a while" && "No one hurries you out. That is the point."}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="timeline" className="mt-10">
        <h2 id="timeline" className="font-serif text-3xl font-semibold">Milestones</h2>
        <ol className="mt-5 space-y-4">
          {[
            { year: "2019", title: "First stall", text: "Two tables, one burner, RK Beach." },
            { year: "2021", title: "First café", text: "Beach Road, 28 seats, and a proper filter." },
            { year: "2023", title: "South expansion", text: "Chennai, Hyderabad, Bengaluru open." },
            { year: "2025", title: "12 outlets", text: "From Goa to Kolkata — same calm, new shores." },
          ].map((m) => (
            <li key={m.year} className="glass rounded-2xl p-5 flex gap-4 items-start">
              <span className="font-serif text-2xl font-bold text-coral">{m.year}</span>
              <div>
                <p className="font-semibold">{m.title}</p>
                <p className="text-sm text-navy/70 dark:text-white/70">{m.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

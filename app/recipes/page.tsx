import Image from "next/image";
import recipes from "@/data/recipes.json";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function RecipesPage() {
  return (
    <div className="mx-3 sm:mx-6 max-w-6xl lg:mx-auto">
      <header className="glass rounded-[28px] p-6 sm:p-8">
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold">Recipes & Our Dishes</h1>
        <p className="mt-2 text-navy/70 dark:text-white/70 max-w-2xl">Every dish has a story first. Here are a few we are allowed to share.</p>
      </header>

      <div className="mt-6 space-y-6">
        {recipes.map((r) => (
          <article key={r.id} className="glass rounded-[24px] overflow-hidden grid lg:grid-cols-2">
            <div className="relative h-64 lg:h-auto">
              <Image
                src={r.image}
                alt={r.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
            </div>
            <div className="p-6">
              <h2 className="font-serif text-3xl font-semibold leading-tight">{r.title}</h2>
              <p className="mt-2 text-navy/75 dark:text-white/80 leading-relaxed">{r.story}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge>{r.prepTime}</Badge>
                <Badge tone="sand">Serves {r.serves}</Badge>
                <Badge>{r.difficulty}</Badge>
              </div>

              <div className="mt-5 grid sm:grid-cols-2 gap-5">
                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-wide">Ingredients</h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-navy/75 dark:text-white/80">
                    {r.ingredients.map((i) => (
                      <li key={i} className="flex gap-2">
                        <span aria-hidden className="mt-1.5 size-1.5 rounded-full bg-coral" />
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-wide">Method</h3>
                  <ol className="mt-2 space-y-2 text-sm text-navy/75 dark:text-white/80 list-decimal list-inside">
                    {r.steps.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="mt-6">
                <Button href={`/menu/${r.dishId}`}>Order this</Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section aria-labelledby="behind" className="mt-10">
        <GlassCard className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.22em] font-semibold text-coral">Behind the counter</p>
            <h2 id="behind" className="font-serif text-3xl font-semibold mt-1">Why our chai is strong and our sunset is layered</h2>
            <p className="mt-3 leading-relaxed text-navy/80 dark:text-white/80">
              At 6 AM, the first pot is only water, ginger and cardamom. Tea leaves go in last, for two minutes — never longer. That is the whole secret, and it is also why so many people say our chai tastes like the one at home, not the one at a highway dhaba. The Sunset Sky follows the opposite rule: colour last, so it sits on top like light.
            </p>
            <p className="mt-3 leading-relaxed text-navy/80 dark:text-white/80">
              Come sit at the counter at 7 AM. We will show you both.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=700&q=80"
            alt="Barista pouring milk into chai"
            className="rounded-2xl object-cover h-56 w-full"
          />
        </GlassCard>
      </section>
    </div>
  );
}

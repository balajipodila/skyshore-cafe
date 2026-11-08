"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import recipes from "@/data/recipes.json";
import { menuForOutlet } from "@/lib/menu";
import { useLocation } from "@/store/location";
import { useCart } from "@/store/cart";
import { Badge } from "@/components/ui/Badge";
import { formatINR } from "@/lib/data";

export default function RecipeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const recipe = recipes.find((r) => r.id === id);

  const outletId = useLocation((s) => s.outletId);
  const outletMenu = menuForOutlet(outletId);
  const dish = recipe ? outletMenu.find((m) => m.id === recipe.dishId) : null;

  const add = useCart((s) => s.add);

  if (!recipe) {
    return (
      <div className="mx-3 sm:mx-6 max-w-3xl lg:mx-auto text-center py-16">
        <h1 className="font-serif text-3xl font-semibold">Recipe not found</h1>
        <p className="text-navy/60 mt-2">This shore drifted out with the tide.</p>
        <Link href="/recipes" className="mt-6 inline-block rounded-full bg-coral text-white px-6 py-2.5 font-semibold">Back to recipes</Link>
      </div>
    );
  }

  return (
    <div className="mx-3 sm:mx-6 max-w-6xl lg:mx-auto">
      <article className="glass rounded-[28px] overflow-hidden">
        <div className="relative h-72 sm:h-96">
          <Image src={recipe.image} alt={recipe.title} fill sizes="(max-width: 1024px) 100vw, 100vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
          <div className="absolute bottom-6 left-6 sm:left-8 right-6 text-white">
            <h1 className="font-serif text-3xl sm:text-5xl font-semibold leading-[1.1]">{recipe.title}</h1>
            <p className="mt-2 text-white/85 max-w-2xl leading-relaxed">{recipe.story}</p>
          </div>
        </div>

        <div className="p-6 sm:p-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge>{recipe.prepTime}</Badge>
              <Badge tone="sand">Serves {recipe.serves}</Badge>
              <Badge>{recipe.difficulty}</Badge>
            </div>

            <section>
              <h2 className="font-serif text-2xl font-semibold">Ingredients</h2>
              <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-navy/80 dark:text-white/80">
                {recipe.ingredients.map((i) => (
                  <li key={i} className="flex gap-2"><span aria-hidden className="mt-1.5 size-1.5 rounded-full bg-coral shrink-0" />{i}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold">Method</h2>
              <ol className="mt-3 space-y-3 text-navy/80 dark:text-white/80">
                {recipe.steps.map((s, i) => (
                  <li key={s} className="flex gap-3">
                    <span className="shrink-0 size-7 rounded-full bg-coral text-white grid place-items-center text-xs font-bold">{i + 1}</span>
                    <span className="text-sm leading-relaxed">{s}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <aside className="glass rounded-[22px] p-5 h-fit sticky top-28">
            <h2 className="font-serif text-xl font-semibold">Order this dish</h2>
            {dish ? (
              <>
                <div className="mt-3 flex items-center gap-3">
                  <Image src={dish.image} alt={dish.name} width={64} height={64} className="size-16 rounded-xl object-cover" sizes="64px" />
                  <div>
                    <p className="font-semibold leading-tight">{dish.name}</p>
                    <p className="text-sm text-navy/60">{formatINR(dish.sizes[0]?.price ?? 0)} · {dish.nutrition.calories} kcal</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => add({ id: dish.id, name: dish.name, price: dish.sizes[0]?.price ?? 0, qty: 1, size: dish.sizes[0]?.label, image: dish.image })}
                  className="mt-4 w-full rounded-full bg-coral text-white py-3 font-semibold hover:bg-coral-dark transition"
                >
                  Order this (Add to cart)
                </button>
                <Link href={`/menu/${dish.id}`} className="mt-2 block text-center text-sm font-semibold underline">
                  View full details
                </Link>
              </>
            ) : (
              <p className="mt-3 text-sm text-navy/70">This dish isn&apos;t available at the selected outlet. Switch outlet to find it. <Link href="/menu" className="underline font-semibold">Browse menu</Link></p>
            )}
          </aside>
        </div>
      </article>

      <Link href="/recipes" className="mt-6 inline-block rounded-full glass px-6 py-2.5 text-sm font-semibold">
        ← Back to all recipes
      </Link>
    </div>
  );
}

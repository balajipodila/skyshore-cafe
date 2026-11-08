"use client";
import Link from "next/link";

const ARTICLES = [
  {
    id: "sea-salt-and-tea",
    title: "Sea Salt, Beach Wind, and the Perfect Masala Chai",
    excerpt: "If you want to know why our chai tastes like the one at home and not the one at a highway dhaba, start with the wind. Beach Road stalls pull their masala chai forward 10 minutes before the sun sets.",
    author: "Bobby · Founder",
    date: "Nov 6, 2026",
    reading: "3 min read",
    image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=900&q=80",
    body: "At 6 AM, the bench stall outside RK Beach only has water, ginger and cardamom on the burner. Tea leaves go in last, for two minutes — never longer. That is the whole secret, and it is also why so many people say our chai tastes like home. The Sunset Sky follows the opposite rule: colour last, so it sits on top like light.",
  },
  {
    id: "mango-season",
    title: "The Mango Season: How Alphonso Arrives and Why It Matters",
    excerpt: "Every May, a lorry from Ratnagiri hits the kitchen at 5 AM. We turn it into lassi by 6. No essence, no shortcuts — and customers can taste the difference.",
    author: "Head Chef",
    date: "Nov 4, 2026",
    reading: "4 min read",
    image: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=900&q=80",
    body: "In Ratnagiri, mangoes ripen near the coast and reach us in 24 hours. The pulp is thick enough to coat a spoon, so we churn it with curd and a pinch of elaichi. No added syrup. The same mango travels into our lassi, our juice, and once a week, a small-batch ice cream that sells out.",
  },
  {
    id: "no-slackers",
    title: "Slow Mornings, Fast Tawas: How We Handle Happy Hour",
    excerpt: "From 4 to 6 PM we do 4x orders in half the time. The trick is two tawas, two deep fryers, and a head chef who never leaves the pass.",
    author: "Ops Team · Vizag",
    date: "Oct 28, 2026",
    reading: "5 min read",
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=900&q=80",
    body: "Happy hour is when fishing boats come back. Our kitchen runs a double tawa — one for pav bhaji, one for fried rice. Cold drinks stay on the blender. We prep cut vegetables at 2 PM, not 4. The secret is timing, not new equipment.",
  },
];

export default function ArticlesPage() {
  return (
    <div className="mx-3 sm:mx-6 max-w-6xl lg:mx-auto pb-16">
      <header className="glass rounded-[28px] p-6 sm:p-10">
        <p className="text-xs tracking-[0.22em] uppercase font-semibold text-coral">Behind the counter</p>
        <h1 className="font-serif text-4xl sm:text-6xl font-semibold mt-2">Stories from the counter</h1>
        <p className="mt-3 text-navy/70 dark:text-white/70 max-w-2xl">
          Small notes from Bobby and the kitchen — why we do what we do, how we do it, and what changed this season.
        </p>
      </header>

      <div className="mt-8 space-y-8">
        {ARTICLES.map((a) => (
          <article key={a.id} className="glass rounded-[28px] p-6 sm:p-8 grid lg:grid-cols-3 gap-6 hover:shadow-lift transition">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 text-xs">
                <span>{a.author}</span> · <span>{a.date}</span> · <span>{a.reading}</span>
              </div>
              <h2 className="font-serif text-3xl font-semibold mt-2 leading-tight">{a.title}</h2>
              <p className="mt-3 text-navy/80 dark:text-white/80 leading-relaxed">{a.body}</p>
              <p className="mt-4 text-sm font-semibold">{a.excerpt}</p>
              <Link href="/recipes" className="mt-5 inline-block rounded-full bg-coral text-white px-5 py-2.5 text-sm font-semibold hover:bg-coral-dark transition">
                See dishes from this story
              </Link>
            </div>
            <img src={a.image} alt={a.title} className="rounded-2xl object-cover h-64 w-full" />
          </article>
        ))}
      </div>
    </div>
  );
}

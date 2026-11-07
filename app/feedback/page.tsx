"use client";
import { useState } from "react";
import { REVIEWS, MENU } from "@/lib/data";
import { useLocation } from "@/store/location";
import { menuForOutlet } from "@/lib/menu";
import { GlassCard } from "@/components/ui/GlassCard";
import { Rating } from "@/components/ui/Rating";

const AVG = 4.6;

export default function FeedbackPage() {
  const outletId = useLocation((s) => s.outletId);
  const dishes = menuForOutlet(outletId);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [dish, setDish] = useState(dishes[0]?.name ?? MENU[0]?.name ?? "");
  const [name, setName] = useState("");

  const distribution = [
    { stars: 5, pct: 72 },
    { stars: 4, pct: 18 },
    { stars: 3, pct: 6 },
    { stars: 2, pct: 3 },
    { stars: 1, pct: 1 },
  ];

  return (
    <div className="mx-3 sm:mx-6 max-w-6xl lg:mx-auto">
      <header className="glass rounded-[28px] p-6 sm:p-8 grid lg:grid-cols-2 gap-6">
        <div>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold">Feedback & Reviews</h1>
          <p className="mt-2 text-navy/70 dark:text-white/70">Tell us straight. We read every one — aloud, on Fridays.</p>
          <div className="mt-5 flex items-center gap-3">
            <span className="font-serif text-5xl font-bold">{AVG}</span>
            <div>
              <Rating value={AVG} />
              <p className="text-sm text-navy/60 mt-1">from 12,408 reviews</p>
            </div>
          </div>

          <div className="mt-5 space-y-2" aria-label="Rating distribution">
            {distribution.map((d) => (
              <div key={d.stars} className="flex items-center gap-2 text-sm">
                <span className="w-6 font-semibold">{d.stars}★</span>
                <div className="flex-1 h-2 rounded-full bg-navy/10 dark:bg-white/10 overflow-hidden">
                  <div className="h-full bg-coral" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="w-10 text-right text-navy/60">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <form className="glass rounded-2xl p-5 space-y-3" onSubmit={(e) => e.preventDefault()} aria-label="Leave a review">
          <fieldset>
            <legend className="text-sm font-semibold">Your rating</legend>
            <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Star rating">
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setRating(v)}
                  aria-pressed={rating === v}
                  aria-label={`${v} stars`}
                  className={`size-9 grid place-items-center rounded-full text-lg ${rating === v ? "bg-coral text-white" : "bg-white/70"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="text-sm font-semibold">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="mt-1 w-full rounded-full bg-white/80 dark:bg-white/10 px-4 py-2.5 text-sm outline-none border border-navy/10" />
          </label>

          <label className="block">
            <span className="text-sm font-semibold">Dish</span>
            <select value={dish} onChange={(e) => setDish(e.target.value)} className="mt-1 w-full rounded-full bg-white/80 dark:bg-white/10 px-4 py-2.5 text-sm outline-none border border-navy/10">
              {dishes.map((m) => (
                <option key={m.id} value={m.name}>{m.name}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold">Your words</span>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="What did you love, or what should we fix?" className="mt-1 w-full rounded-2xl bg-white/80 dark:bg-white/10 px-4 py-2.5 text-sm outline-none border border-navy/10" />
          </label>

          <div className="rounded-2xl border-2 border-dashed border-navy/15 dark:border-white/20 p-4 text-center text-sm text-navy/60">
            Photo upload (optional) — drag or tap to add a picture of your dish
          </div>

          <button type="submit" className="w-full rounded-full bg-coral text-white py-3 font-semibold min-h-[48px]">
            Post review
          </button>
        </form>
      </header>

      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((r) => (
          <GlassCard key={r.id}>
            <Rating value={r.rating} />
            <p className="mt-3 leading-relaxed">“{r.text}”</p>
            <p className="mt-4 text-sm font-semibold">{r.name} · {r.city}</p>
            <p className="text-xs text-navy/60">{r.dish} · {r.date}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

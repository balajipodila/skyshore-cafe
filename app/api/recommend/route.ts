import { NextResponse } from "next/server";
import { menuForOutlet } from "@/lib/menu";

export const dynamic = "force-dynamic";

function fallbackRecommend(prompt: string, menu: ReturnType<typeof menuForOutlet>) {
  const text = String(prompt || "").toLowerCase();

  // Parse constraints strictly
  const maxPriceMatch = text.match(/under\s*₹?\s*(\d+)/i) || text.match(/below\s*₹?\s*(\d+)/i) || text.match(/₹\s*(\d+)/) || text.match(/under\s+(\d+)/i);
  const explicitMax = maxPriceMatch ? Number(maxPriceMatch[1]) : null;
  const wantsCheap = /\bcheap\b|budget|under 100/.test(text);
  const maxPrice = explicitMax ?? (wantsCheap ? 100 : 10000);

  const wantsCold = /\b(cold|iced|cool|thand|nimbu|sharbat|juice|shake|lassi|cooler|mocktail)\b/.test(text);
  const wantsHot = /\b(hot|chai|coffee|tea|kaapi|kapi|garam|गरम|వెడి)\b/.test(text);
  const wantsVeg = /\b(veg|vegetarian|shakahari|veg only|తృణ|విజి|शाकाहारी)\b/.test(text);
  const wantsSpicy = /spicy|spice|mirchi|masala|hot|కారం|तीखा/.test(text);
  const wantsSweet = /sweet|dessert|mitha|meeta|cake|ice cream|falooda|shake|chocolate|brownie|donut|cookie|తీపి|मीठा/.test(text);
  const wantsSnack = /snack|light bite|chaat|samosa|bajji|puff|roll|pav|breakfast|tiffin/.test(text);
  const wantsMeal = /meal|thali|rice|dosa|pasta|pizza|burger|dinner|lunch|for two|family|sharing|भोजन/.test(text);
  const wantsDrink = /drink|beverage|juice|coffee|chai|tea|lassi|shake|cooler/.test(text) || (wantsCold || wantsHot);
  const wantsPremium = /premium|expensive|high end|single origin|tasting flight|belgian|truffle|lobster|seafood/.test(text);

  const candidates = menu.filter((m) => {
    const base = m.sizes[0]?.price ?? 9999;
    // Hard price enforcement
    if (base > maxPrice) return false;

    // Hard hot/cold enforcement
    if (wantsCold && m.hot === true) return false;
    if (wantsHot && m.hot === false) return false;

    // Hard veg enforcement
    if (wantsVeg && !m.veg) return false;

    // Category enforcement to avoid dessert→dinner mismatch
    if (wantsSweet && /platter|dinner set|sharing bowl|seafood platter/.test(m.category.toLowerCase()) && !/dessert|sweet|cake|chocolate|falooda/.test(`${m.name} ${m.tags.join(" ")}`.toLowerCase())) return false;
    // Cheap should never return premium
    if (wantsCheap && m.premium) return false;

    return true;
  });

  const scored = candidates
    .map((m) => {
      let score = m.popularity;
      const hay = `${m.name} ${m.description} ${m.category} ${m.tags.join(" ")}`.toLowerCase();

      // Reward category matches
      if (wantsSweet && /(dessert|sweet|cake|chocolate|brownie|donut|cookie|falooda|shake|mousse|cheesecake|ice cream|bebinca|mishti)/.test(hay)) score += 60;
      if (wantsDrink && /(drink|cold drinks|hot drinks|juice|shake|lassi|cooler|mocktail)/.test(m.category.toLowerCase())) score += 40;
      if (wantsSnack && /(snack|street|chaat|bajji|puff|roll|pav|bhel|samosa)/.test(m.category.toLowerCase())) score += 50;
      if (wantsMeal && /(meal|thali|fried rice|dosa|pasta|pizza|burger|platter|bowl)/.test(m.category.toLowerCase())) score += 50;

      if (wantsSpicy && (m.spice === "hot" || m.spice === "medium")) score += 40;
      if (wantsSpicy && m.spice === "hot") score += 20;

      if (wantsCold && m.hot === false) score += 25;
      if (wantsHot && m.hot === true) score += 25;
      if (wantsCold && /(cold|iced|lassi|shake|juice|cooler|sharbat|mocktail|soda|nimbu)/.test(hay)) score += 30;
      if (wantsHot && /(hot|chai|coffee|tea|kaapi)/.test(hay)) score += 30;
      if (wantsCheap) score += Math.max(0, 30 - (m.sizes[0]?.price ?? 0) / 10);
      if (wantsPremium && m.premium) score += 60;

      // Penalize premium in cheap queries (already filtered, but keep as safety)
      if (wantsCheap && m.premium) score -= 100;

      return { m, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((x) => x.m);

  return { candidates: scored, source: "fallback" as const };
}

export async function POST(req: Request) {
  const body = await req.json();
  const prompt: string = body.prompt ?? body.query ?? "";
  const outletId: string = body.outletId ?? "vizag-beach-road";
  const menu = menuForOutlet(outletId);

  console.log("[recommend] query:", JSON.stringify(prompt), "outletId:", outletId, "menuSize:", menu.length);

  const aiBaseUrl = process.env.AI_BASE_URL;
  const aiApiKey = process.env.AI_API_KEY;
  const aiModel = process.env.AI_MODEL;

  const hasKey = aiApiKey && aiApiKey.trim().length > 0;

  if (!hasKey) {
    console.log("[recommend] source: fallback (no key)");
    const fb = fallbackRecommend(prompt, menu);
    return NextResponse.json(
      {
        items: fb.candidates.map((p) => p.id),
        reason: fb.candidates[0] ? `From "${prompt}" — here are a few that fit.` : "No items matched.",
        note: "Basic search — no AI key configured",
        source: "fallback",
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const compact = menu.map((m) => ({
    id: m.id,
    name: m.name,
    price: m.sizes[0]?.price ?? 0,
    veg: m.veg,
    tags: m.tags,
  }));

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${aiBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aiApiKey}`,
      },
      body: JSON.stringify({
        model: aiModel || "auto",
        temperature: 0.3,
        max_tokens: 400,
        messages: [
          { role: "system", content: "You are the Skyshore Café recommender. Respond with JSON only." },
          {
            role: "user",
            content: `User: "${prompt}"\n\nMenu JSON: ${JSON.stringify(compact)}\n\nRespond ONLY: {"items":[{"id":"id1","reason":""}],"note":""}`,
          },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errBody = await response.text();
      console.log("[recommend] AI HTTP error", response.status, errBody.slice(0, 200));
      const fb = fallbackRecommend(prompt, menu);
      return NextResponse.json({ items: fb.candidates.map((p) => p.id), reason: fb.candidates[0] ? `From "${prompt}" — here are a few.` : "", note: "AI unavailable, using basic search", source: "fallback" }, { headers: { "Cache-Control": "no-store" } });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content ?? "";
    console.log("[recommend] raw model text:", raw);

    const jsonText = raw.replace(/```json\n?/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(jsonText);

    const validIds = new Set(menu.map((m) => m.id));
    const maxPriceMatch = prompt.match(/under\s*₹?\s*(\d+)/i);
    const maxPrice = maxPriceMatch ? Number(maxPriceMatch[1]) : 10000;
    const wantsCheap = /\bcheap\b/.test(prompt.toLowerCase()) ? 100 : maxPrice;

    const validated = [];
    for (const it of parsed.items || []) {
      const id = typeof it === "string" ? it : it.id;
      if (!validIds.has(id)) continue;
      const item = menu.find((m) => m.id === id);
      const price = item?.sizes[0]?.price ?? 0;
      if (price > wantsCheap) continue;
      validated.push(id);
      if (validated.length >= 4) break;
    }

    if (validated.length > 0) {
      console.log("[recommend] source: ai");
      return NextResponse.json({ items: validated, reason: parsed.note || "Here are a few.", note: parsed.note || "", source: "ai" }, { headers: { "Cache-Control": "no-store" } });
    }
  } catch (err) {
    console.log("[recommend] AI call error:", String(err));
  }

  console.log("[recommend] source: fallback (AI failed)");
  const fb = fallbackRecommend(prompt, menu);
  return NextResponse.json({ items: fb.candidates.map((p) => p.id), reason: fb.candidates[0] ? `From "${prompt}" — basic search fallback.` : "", note: "Basic search — AI failed", source: "fallback" }, { headers: { "Cache-Control": "no-store" } });
}

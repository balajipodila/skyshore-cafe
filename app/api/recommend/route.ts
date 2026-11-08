import { NextResponse } from "next/server";
import { menuForOutlet } from "@/lib/menu";

export const dynamic = "force-dynamic";

// Simple in-memory rate limiter: 20 req/min per IP
const RATE_LIMIT = new Map<string, number[]>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const window = 60_000;
  const arr = RATE_LIMIT.get(ip) || [];
  const recent = arr.filter((t) => now - t < window);
  if (recent.length >= 20) return false;
  recent.push(now);
  RATE_LIMIT.set(ip, recent);
  return true;
}

function fallbackRecommend(prompt: string, menu: ReturnType<typeof menuForOutlet>) {
  const text = String(prompt || "").toLowerCase();

  // Hard price limit
  const maxPriceMatch = text.match(/under\s*₹?\s*(\d+)/i) || text.match(/below\s*₹?\s*(\d+)/i) || text.match(/₹\s*(\d+)/) || text.match(/under\s+(\d+)/i);
  const explicitMax = maxPriceMatch ? Number(maxPriceMatch[1]) : null;
  const wantsCheap = /\bcheap\b|budget/.test(text);
  const maxPrice = explicitMax ?? (wantsCheap ? 100 : 10000);

  const wantsCold = /\b(cold|iced|cool|thand|nimbu|sharbat|juice|shake|lassi|cooler|mocktail)\b/.test(text);
  const wantsHot = /\b(hot|chai|coffee|tea|kaapi|kapi|garam|गरम|వెడి)\b/.test(text);
  const wantsVeg = /\b(veg|vegetarian|shakahari|veg only|తృణ|విజి|शाकाहारी)\b/.test(text);
  const wantsSpicy = /spicy|spice|mirchi|masala|hot|కారం|तीखा/.test(text);
  const wantsSweet = /sweet|dessert|mitha|meeta|cake|ice cream|falooda|shake|chocolate|brownie|donut|cookie|తీపి|मीठा/.test(text);
  const wantsDessertStrict = /dessert|sweet/.test(text);
  const wantsSnack = /snack|light bite|chaat|samosa|bajji|puff|roll|pav|breakfast|tiffin/.test(text);
  const wantsMeal = /meal|thali|rice|dosa|pasta|pizza|burger|dinner|lunch|for two|family|sharing|भोजन/.test(text);
  const wantsDrink = /drink|beverage|juice|coffee|chai|tea|lassi|shake|cooler/.test(text) || (wantsCold || wantsHot);
  const wantsLight = /light|halka|kam|चैय्या|లايت్/.test(text);
  const wantsPremium = /premium|expensive|high end|single origin|tasting flight|belgian|truffle|lobster|seafood/.test(text);
  const wantsCoffee = /coffee|caf/i.test(text);

  const candidates = menu.filter((m) => {
    const base = m.sizes[0]?.price ?? 9999;

    // Hard price filter
    if (base > maxPrice) return false;

    // Premium query: must be premium or price >= 399
    if (wantsPremium && !m.premium && base < 399) return false;

    // Hard hot/cold
    if (wantsCold && m.temp !== "cold") return false;
    if (wantsHot && m.temp !== "hot") return false;

    // Hard veg
    if (wantsVeg && !m.veg) return false;

    // Hard category mismatches
    if (wantsSweet || wantsDessertStrict) {
      if (wantsSweet && m.category !== "dessert") return false;
    }
    if (wantsSnack && m.category !== "snack") return false;
    if (wantsMeal && m.category !== "meal") return false;
    if (wantsCoffee && !(m as any).isCoffee) return false;

    // Spicy & light hard filters
    if (wantsSpicy && m.spice < 2) return false;
    if (wantsLight && m.nutrition.calories > 200) return false;

    if (wantsCheap && m.premium) return false;

    return true;
  });

  // Score and rank
  const scored = candidates
    .map((m) => {
      let score = m.popularity;
      const hay = `${m.name} ${m.description} ${m.category} ${m.tags.join(" ")}`.toLowerCase();

      if (wantsSweet && /(dessert|sweet|cake|chocolate|brownie|donut|cookie|falooda|shake|mousse|cheesecake|ice cream|bebinca|mishti)/.test(hay)) score += 60;
      if (wantsDrink && /(drink|cold drinks|hot drinks|juice|shake|lassi|cooler|mocktail)/.test(m.category.toLowerCase())) score += 40;
      if (wantsSnack && /(snack|street|chaat|bajji|puff|roll|pav|bhel|samosa)/.test(m.category.toLowerCase())) score += 50;
      if (wantsMeal && /(meal|thali|fried rice|dosa|pasta|pizza|burger|platter|bowl)/.test(m.category.toLowerCase())) score += 50;

      if (wantsSpicy && (m.spice >= 2)) score += 40;
      if (wantsSpicy && m.spice >= 3) score += 20;

      if (wantsCold && m.hot === false) score += 25;
      if (wantsHot && m.hot === true) score += 25;
      if (wantsCold && /(cold|iced|lassi|shake|juice|cooler|sharbat|mocktail|soda|nimbu)/.test(hay)) score += 30;
      if (wantsHot && /(hot|chai|coffee|tea|kaapi)/.test(hay)) score += 30;

      if (wantsLight && m.label === "Light") score += 35;
      if (wantsLight && m.nutrition.calories < 150) score += 20;

      if (wantsCheap) score += Math.max(0, 30 - (m.sizes[0]?.price ?? 0) / 10);
      if (wantsPremium && m.premium) score += 60;

      return { m, score };
    })
    .sort((a, b) => b.score - a.score);

  // Do NOT pad to 4. Return only those above a minimal relevance threshold.
  // If query is very generic, return top 3. If specific, return up to 4 that genuinely match.
  const matched = scored.filter((x) => x.score > 80 || (x.score > 55 && (wantsSweet || wantsMeal || wantsSnack || wantsPremium))).slice(0, 4);

  return { candidates: matched.map((x) => x.m), source: "fallback" as const };
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429, headers: { "Cache-Control": "no-store" } });
  }

  const body = await req.json();
  const prompt: string = String(body.prompt ?? body.query ?? "").slice(0, 300);
  const outletId: string = String(body.outletId ?? "vizag-beach-road").slice(0, 50);
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
        reason: fb.candidates.length > 0 ? `From "${prompt}" — here are a few that fit.` : "No items matched your query for this outlet. Try broader terms.",
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
      return NextResponse.json({ items: fb.candidates.map((p) => p.id), reason: fb.candidates.length > 0 ? `From "${prompt}" — here are a few.` : "No items matched.", note: "AI unavailable, using basic search", source: "fallback" }, { headers: { "Cache-Control": "no-store" } });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content ?? "";
    console.log("[recommend] raw model text:", raw);

    const jsonText = raw.replace(/```json\n?/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(jsonText);

    const validIds = new Set(menu.map((m) => m.id));
    const maxPriceMatch = prompt.match(/under\s*₹?\s*(\d+)/i);
    const maxPrice = maxPriceMatch ? Number(maxPriceMatch[1]) : (/\bcheap\b/.test(prompt.toLowerCase()) ? 100 : 10000);

    const validated = [];
    for (const it of parsed.items || []) {
      const id = typeof it === "string" ? it : it.id;
      if (!validIds.has(id)) continue;
      const item = menu.find((m) => m.id === id);
      const price = item?.sizes[0]?.price ?? 0;
      if (price > maxPrice) continue;
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
  return NextResponse.json({ items: fb.candidates.map((p) => p.id), reason: fb.candidates.length > 0 ? `From "${prompt}" — basic search fallback.` : "No items matched.", note: "Basic search — AI failed", source: "fallback" }, { headers: { "Cache-Control": "no-store" } });
}

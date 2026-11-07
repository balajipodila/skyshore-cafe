import { NextResponse } from "next/server";
import { menuForOutlet } from "@/lib/menu";

export const dynamic = "force-dynamic";

function fallbackRecommend(prompt: string, menu: ReturnType<typeof menuForOutlet>) {
  const text = String(prompt || "").toLowerCase();
  const maxPriceMatch = text.match(/under\s*₹?\s*(\d+)/i) || text.match(/below\s*₹?\s*(\d+)/i) || text.match(/₹\s*(\d+)/);
  const maxPrice = maxPriceMatch ? Number(maxPriceMatch[1]) : 10000;
  const wantsCold = /\b(cold|iced|cool|nimbu|sharbat|juice|shake|lassi|cooler|mocktail)\b/.test(text);
  const wantsHot = /\b(hot|chai|coffee|tea|kaapi)\b/.test(text);
  const wantsVeg = /\b(veg|vegetarian|shाकाहारी|veg only)\b/.test(text);
  const wantsSpicy = /spicy|spice|mirchi|masala|hot/.test(text);
  const wantsSweet = /sweet|dessert|mitha|meeta|cake|ice cream|falooda|shake|chocolate|brownie|donut|cookie/.test(text);
  const wantsSnack = /snack|light bite|chaat|samosa|bajji|puff|roll|pav|breakfast|tiffin/.test(text);
  const wantsMeal = /meal|thali|rice|dosa|pasta|pizza|burger|dinner|lunch|for two|family|sharing/.test(text);
  const wantsCheap = /cheap|budget|under|less|₹\d/i.test(text);

  let candidates = menu.filter((m) => {
    const base = m.sizes[0]?.price ?? 9999;
    if (base > maxPrice) return false;
    if (wantsCold && m.hot === true) return false;
    if (wantsHot && m.hot === false) return false;
    if (wantsVeg && !m.veg) return false;
    return true;
  });

  const scored = candidates
    .map((m) => {
      let score = m.popularity; // base
      const hay = `${m.name} ${m.description} ${m.category} ${m.tags.join(" ")}`.toLowerCase();
      const keywordHits = (re: RegExp) => (re.test(hay) ? 60 : 0);
      if (wantsSpicy && (m.spice === "hot" || m.spice === "medium")) score += keywordHits(/spicy|mirchi|masala|street|snack|bajji|pav|roll|misal|gongura/);
      if (wantsSpicy && m.spice === "hot") score += 20;
      if (wantsSweet) score += keywordHits(/dessert|sweet|cake|chocolate|brownie|donut|cookie|falooda|shake|mousse|cheesecake|ice cream|bebinca|mishti|tower|jar|mango lassi|rose milk|choco/);
      if (wantsSnack && /(snack|street|chaat|bajji|puff|roll|pav|bhel|samosa|maggi|corn|sundal|punugulu)/.test(hay)) score += 50;
      if (wantsMeal && /(meal|thali|fried rice|dosa|pasta|pizza|burger|dinner|lunch|platter|bowl|misal|chole|haleem|benne|rice)/.test(hay)) score += 50;
      if (wantsCold && m.hot === false) score += 25;
      if (wantsCold && /(cold|iced|lassi|shake|juice|cooler|sharbat|mocktail|soda|nimbu)/.test(hay)) score += 30;
      if (wantsCheap) score += Math.max(0, 30 - (m.sizes[0]?.price ?? 0) / 10);
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

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || !apiKey.trim() || apiKey === "your_key_here") {
    const fb = fallbackRecommend(prompt, menu);
    console.log("[recommend] fallback path (no API key)");
    return NextResponse.json(
      {
        items: fb.candidates.map((p) => p.id),
        reason: `From "${prompt}" — here are a few that fit your mood and budget.`,
        source: "fallback",
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  // Compact menu only: id, name, price, veg, tags
  const compact = menu.map((m) => ({
    id: m.id,
    name: m.name,
    price: m.sizes[0]?.price ?? 0,
    veg: m.veg,
    tags: m.tags,
  }));

  let response: Response;
  try {
    response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-latest",
        max_tokens: 400,
        temperature: 0.3,
        messages: [
          {
            role: "user",
            content: `You are the Skyshore Café menu recommender. User said (English/Telugu/Hindi/Tenglish okay): "${prompt}"

Menu (JSON array of {id, name, price, veg, tags}):
${JSON.stringify(compact)}

Return ONLY valid JSON with this shape:
{"items": ["id1", "id2"], "reason": "one short friendly sentence"}

Pick 2-4 item ids that exist exactly as shown. The reason should be warm and specific.`,
          },
        ],
      }),
    });
  } catch (err) {
    console.log("[recommend] AI call threw, fallback:", String(err));
    const fb = fallbackRecommend(prompt, menu);
    return NextResponse.json(
      { items: fb.candidates.map((p) => p.id), reason: `From "${prompt}" — here are a few that fit.`, source: "fallback" },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  console.log("[recommend] AI status:", response.status);

  if (!response.ok) {
    console.log("[recommend] AI non-ok, fallback");
    const fb = fallbackRecommend(prompt, menu);
    return NextResponse.json(
      { items: fb.candidates.map((p) => p.id), reason: `From "${prompt}" — here are a few that fit.`, source: "fallback" },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const data = (await response.json()) as { content?: Array<{ text?: string }> };
  const raw = data.content?.[0]?.text ?? "";
  console.log("[recommend] raw model response:", raw);
  const jsonText = raw.replace(/```json\n?|```\n?/g, "").trim();
  try {
    const parsed = JSON.parse(jsonText);
    const validIds = new Set(menu.map((m) => m.id));
    const items = (parsed.items || []).filter((id: string) => validIds.has(id)).slice(0, 4);
    if (!items.length) throw new Error("no valid ids");
    return NextResponse.json(
      { items, reason: parsed.reason || "Here are a few that fit.", source: "ai" },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    console.log("[recommend] invalid JSON from AI, fallback");
    const fb = fallbackRecommend(prompt, menu);
    return NextResponse.json(
      { items: fb.candidates.map((p) => p.id), reason: `From "${prompt}" — here are a few that fit.`, source: "fallback" },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}

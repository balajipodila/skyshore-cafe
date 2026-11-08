import { NextResponse } from "next/server";
import { menuForOutlet } from "@/lib/menu";

export const dynamic = "force-dynamic";

function fallbackRecommend(prompt: string, menu: ReturnType<typeof menuForOutlet>) {
  const text = String(prompt || "").toLowerCase();
  const maxPriceMatch = text.match(/under\s*₹?\s*(\d+)/i) || text.match(/below\s*₹?\s*(\d+)/i) || text.match(/₹\s*(\d+)/);
  const maxPrice = maxPriceMatch ? Number(maxPriceMatch[1]) : 10000;
  const wantsCold = /\b(cold|iced|cool|thand|nimbu|sharbat|juice|shake|lassi|cooler|mocktail)\b/.test(text) || /thand|冷/.test(text);
  const wantsHot = /\b(hot|chai|coffee|tea|kaapi|kapi|गरम| వేడి)/.test(text);
  const wantsVeg = /\b(veg|vegetarian|shakahari|shakahari|veg only|తృణ|విజి|शाकाहारी)\b/.test(text);
  const wantsSpicy = /spicy|spice|mirchi|masala|hot|కారం|तीखा|तीखे/.test(text);
  const wantsSweet = /sweet|dessert|mitha|meeta|cake|ice cream|falooda|shake|chocolate|brownie|donut|cookie|తీపి|मीठा|मिठाई/.test(text);
  const wantsSnack = /snack|light bite|chaat|samosa|bajji|puff|roll|pav|breakfast|tiffin|చీరో|स्नैक/.test(text);
  const wantsMeal = /meal|thali|rice|dosa|pasta|pizza|burger|dinner|lunch|for two|family|sharing|भोजन|भात/.test(text);
  const wantsCheap = /cheap|budget|under|less|₹\d/i.test(text);

  const candidates = menu.filter((m) => {
    const base = m.sizes[0]?.price ?? 9999;
    if (base > maxPrice) return false;
    if (wantsCold && m.hot === true) return false;
    if (wantsHot && m.hot === false) return false;
    if (wantsVeg && !m.veg) return false;
    return true;
  });

  const scored = candidates
    .map((m) => {
      let score = m.popularity;
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

  console.log("[recommend]", JSON.stringify({ query: prompt, outletId, menuSize: menu.length }));

  const compact = menu.map((m) => ({
    id: m.id,
    name: m.name,
    price: m.sizes[0]?.price ?? 0,
    veg: m.veg,
    tags: m.tags,
  }));

  // OpenAI-compatible path
  const aiBaseUrl = process.env.AI_BASE_URL;
  const aiApiKey = process.env.AI_API_KEY;
  const aiModel = process.env.AI_MODEL;

  if (aiBaseUrl && aiApiKey && aiModel) {
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
          model: aiModel,
          temperature: 0.3,
          max_tokens: 400,
          messages: [
            {
              role: "system",
              content: `You are the Skyshore Café menu recommender. User might speak English, Telugu (తెలుగు), Hindi (हिन्दी), or Tenglish (mix). Always respond with valid JSON only.`,
            },
            {
              role: "user",
              content: `User said: "${prompt}"

Menu (JSON array of {id, name, price, veg, tags}):
${JSON.stringify(compact)}

Return ONLY valid JSON with this exact shape:
{"items": [{"id": "id1", "reason": "short reason"}, {"id": "id2", "reason": "short reason"}], "note": "1 sentence summary"}

Pick at most 4 item ids that exist exactly as shown.`,
            },
          ],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        const rawContent = data.choices?.[0]?.message?.content ?? "";
        console.log("[recommend] raw model response:", rawContent);

        const jsonText = rawContent.replace(/```json\n?/g, "").replace(/```/g, "").trim();

        const parsed = JSON.parse(jsonText);

        const validIds = new Set(menu.map((m) => m.id));
        const maxPriceMatch = prompt.match(/under\s*₹?\s*(\d+)/i);
        const maxPrice = maxPriceMatch ? Number(maxPriceMatch[1]) : 10000;

        const validatedItems: Array<{ id: string; reason: string }> = [];
        for (const it of parsed.items || []) {
          const id = typeof it === "string" ? it : it.id;
          const reason = typeof it === "object" && it.reason ? it.reason : "Fits your mood";
          if (!validIds.has(id)) continue;
          const item = menu.find((m) => m.id === id);
          const price = item?.sizes[0]?.price ?? 0;
          if (price > maxPrice) continue;
          validatedItems.push({ id, reason });
          if (validatedItems.length >= 4) break;
        }

        if (validatedItems.length > 0) {
          return NextResponse.json(
            {
              items: validatedItems.map((x) => x.id),
              reasons: validatedItems.map((x) => x.reason),
              reason: parsed.note || validatedItems[0].reason,
              note: parsed.note || "Here are a few that fit your mood.",
              source: "ai",
            },
            { headers: { "Cache-Control": "no-store" } }
          );
        }
      }
    } catch (err) {
      console.log("[recommend] AI call failed, using fallback:", String(err));
    }
  }

  // Fallback path
  console.log("[recommend] using fallback");
  const fb = fallbackRecommend(prompt, menu);
  return NextResponse.json(
    {
      items: fb.candidates.map((p) => p.id),
      reasons: fb.candidates.map((p) => `Good pick for "${prompt}"`),
      reason: `From "${prompt}" — here are a few that fit your mood and budget.`,
      note: "Basic search used (no AI key or AI unavailable).",
      source: "fallback",
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

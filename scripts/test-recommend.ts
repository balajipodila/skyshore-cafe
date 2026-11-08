import { menuForOutlet } from "@/lib/menu";
import type { MenuItem } from "@/lib/types";

function fallbackRecommend(prompt: string, menu: MenuItem[]): MenuItem[] {
  const text = String(prompt || "").toLowerCase();

  // Hard constraints
  const maxPriceMatch =
    text.match(/under\s*₹?\s*(\d+)/i) ||
    text.match(/below\s*₹?\s*(\d+)/i) ||
    text.match(/₹\s*(\d+)/) ||
    text.match(/under\s+(\d+)/i);
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

    // Price hard limit
    if (base > maxPrice) return false;

    // Premium: price >= 399
    if (wantsPremium && base < 399) return false;

    // Cold -> temp === "cold"
    if (wantsCold && m.temp !== "cold") return false;
    // Hot -> temp === "hot"
    if (wantsHot && m.temp !== "hot") return false;

    // Veg
    if (wantsVeg && !m.veg) return false;

    // Category strict
    if (wantsSnack && m.category !== "snack") return false;
    if (wantsMeal && m.category !== "meal") return false;
    // Category strict
    if (wantsSweet || wantsDessertStrict) {
      // For pure sweet dessert queries, restrict to dessert category only
      if (wantsSweet && m.category !== "dessert") return false;
    }
    if (wantsCoffee && !m.isCoffee) return false;

    // Spicy: spice >= 2
    if (wantsSpicy && m.spice < 2) return false;

    // Light: calories <= 200
    if (wantsLight && m.nutrition.calories > 200) return false;

    // Cheap: never premium
    if (wantsCheap && m.premium) return false;

    return true;
  });

  return candidates.slice(0, 4);
}

// Test harness
const vizagMenu = menuForOutlet("vizag-beach-road");

const cases = [
  {
    q: "cheap and cold",
    assert: (items: MenuItem[]) =>
      items.every((i) => i.temp === "cold" && (i.sizes[0]?.price ?? 999) <= 100),
  },
  {
    q: "spicy snack under 80",
    assert: (items: MenuItem[]) =>
      items.every((i) => i.category === "snack" && (i.spice ?? 0) >= 2 && (i.sizes[0]?.price ?? 999) <= 80),
  },
  {
    q: "sweet dessert",
    assert: (items: MenuItem[]) => items.every((i) => i.category === "dessert"),
  },
  {
    q: "veg meal for two",
    assert: (items: MenuItem[]) => items.every((i) => i.veg === true && i.category === "meal"),
  },
  {
    q: "something hot and light",
    assert: (items: MenuItem[]) =>
      items.every((i) => i.temp === "hot" && i.nutrition.calories <= 200),
  },
  {
    q: "premium coffee",
    assert: (items: MenuItem[]) =>
      items.every((i) => i.isCoffee === true && (i.sizes[0]?.price ?? 0) >= 399),
  },
];

let allPass = true;
for (const c of cases) {
  const results = fallbackRecommend(c.q, vizagMenu);
  const pass = results.length === 0 || c.assert(results);
  if (!pass) allPass = false;
  console.log(`Q: "${c.q}"`);
  console.log(`  path: fallback`);
  if (results.length === 0) console.log("  (no results — empty PASS)");
  results.forEach((i) =>
    console.log(
      `  ${i.id} | ${i.name} | ₹${i.sizes[0]?.price} | temp:${i.temp} | cat:${i.category} | calories:${i.nutrition.calories} | spice:${i.spice} | isCoffee:${i.isCoffee}`
    )
  );
  console.log(`  ${pass ? "PASS" : "FAIL"}`);
  console.log("");
}
console.log(allPass ? "ALL PASS" : "SOME FAIL");
if (!allPass) process.exit(1);

import combos from "@/data/combos.json";
import { menuForOutlet } from "./menu";
import type { MenuItem } from "./types";

export type Combo = (typeof combos)[number];

export function outletDateString(now = new Date(), override?: string): string {
  if (override) {
    // Allow YYYY-MM-DD override for dev testing via ?date=YYYY-MM-DD
    const match = override.match(/^\d{4}-\d{2}-\d{2}/);
    if (match) return match[0];
  }
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return parts;
}

export function getDateOverride(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("date") || undefined;
  } catch {
    return undefined;
  }
}

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

function rotate<T>(arr: readonly T[], seed: string, offset = 0): T[] {
  if (!arr.length) return [];
  const start = hashSeed(seed) % arr.length;
  const out: T[] = [];
  for (let i = 0; i < arr.length; i++) {
    out.push(arr[(start + i + offset) % arr.length]);
  }
  return out;
}

export function todaysCombos(outletId: string, dateOverride?: string): Combo[] {
  const date = outletDateString(new Date(), dateOverride ?? getDateOverride());
  return rotate(combos, `${date}:${outletId}`).slice(0, 4);
}

export function todaysSpecials(outletId: string, dateOverride?: string): MenuItem[] {
  const date = outletDateString(new Date(), dateOverride ?? getDateOverride());
  const menu = menuForOutlet(outletId);
  return rotate(menu, `${date}:${outletId}:specials`).slice(0, 3);
}

const CHEF_NOTES: Record<string, string> = {
  "sunset-sky": "It pours like the last five minutes of light — blue over orange, never mixed till the table.",
  "masala-chai": "Ginger in first, tea last, two minutes. The way the beach stall taught me.",
  "filter-coffee": "Decoction strong enough to wake a fish. That's the whole compliment.",
  "pav-bhaji": "Butter first, judgement later. Taste it before it gets cold.",
  "mango-lassi": "Alphonso, cardamom, patience. Summer in a glass.",
  "falooda": "Slow melt, rose, basil seeds — a dessert that behaves like a drink.",
  "paneer-roll": "Soft paneer, mint, no fuss. Built for a hungry walk home.",
  "skyline-platter": "Little things from every coast, on one plate, made to share.",
};

export function chefsSpecial(outletId: string, dateOverride?: string): { item: MenuItem; note: string } | null {
  const date = outletDateString(new Date(), dateOverride ?? getDateOverride());
  const menu = menuForOutlet(outletId);
  const rotated = rotate(menu, `${date}:${outletId}:chef`);
  const pick = rotated[0];
  return { item: pick, note: CHEF_NOTES[pick.id] ?? "Picked because it tastes like the sea at its best — fresh, warm and honest." };
}

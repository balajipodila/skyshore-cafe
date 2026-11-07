import { OUTLETS, type Outlet } from "./menu";

export function haversineKm(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number
): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLng / 2);
  const a =
    s1 * s1 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * s2 * s2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function nearestOutlet(lat: number, lng: number): Outlet {
  let best: Outlet = OUTLETS[0];
  let bestDist = Infinity;
  for (const o of OUTLETS) {
    const d = haversineKm(lat, lng, o.lat, o.lng);
    if (d < bestDist) {
      bestDist = d;
      best = o;
    }
  }
  return best;
}

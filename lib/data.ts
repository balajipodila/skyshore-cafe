import reviews from "@/data/reviews.json";
import { ALL_MENU, OUTLETS } from "./menu";

export const MENU = ALL_MENU;
export { OUTLETS };
export const REVIEWS = reviews;

export function formatINR(n: number) {
  return `₹${n}`;
}

export type SizeOption = { label: string; price: number };
export type Nutrition = {
  calories: number; protein: number; carbs: number; fat: number; sugar: number; fibre: number;
};
export type MenuItem = {
  id: string;
  name: string;
  category: "drink" | "snack" | "meal" | "dessert" | "combo";
  description: string;
  veg: boolean;
  sizes: SizeOption[];
  image: string;
  tags: string[];
  spice: number; // 0-3
  prepTime: number;
  popularity: number;
  nutrition: Nutrition;
  allergens: string[];
  label: "Light" | "Balanced" | "Indulgent";
  hot?: boolean;
  temp?: "hot" | "cold" | "none";
  caffeineFree?: boolean;
  premium?: boolean;
  isCoffee?: boolean;
};

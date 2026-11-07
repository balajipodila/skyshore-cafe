export type SizeOption = { label: string; price: number };
export type Nutrition = {
  calories: number; protein: number; carbs: number; fat: number; sugar: number; fibre: number;
};
export type MenuItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  veg: boolean;
  sizes: SizeOption[];
  image: string;
  tags: string[];
  spice: "none" | "mild" | "medium" | "hot";
  prepTime: number;
  popularity: number;
  nutrition: Nutrition;
  allergens: string[];
  label: "Light" | "Balanced" | "Indulgent";
  hot?: boolean;
  caffeineFree?: boolean;
  premium?: boolean;
};

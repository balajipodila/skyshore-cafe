import type { MetadataRoute } from "next";
import menu from "@/data/menu.json";
import recipes from "@/data/recipes.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://skyshore-cafe.example";
  const staticRoutes = [
    "",
    "/menu",
    "/combos",
    "/outlets",
    "/about",
    "/recipes",
    "/recipes/articles",
    "/feedback",
    "/contact",
    "/account",
    "/login",
    "/signup",
    "/dashboard",
    "/checkout",
    "/order/track",
  ];

  const menuRoutes = (menu as Array<Record<string, unknown>>).map((m) => ({
    url: `${base}/menu/${m.id as string}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const recipeRoutes = (recipes as Array<Record<string, unknown>>).map((r) => ({
    url: `${base}/recipes/${r.id as string}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const staticPages = staticRoutes.map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: r === "" ? 1 : 0.8,
  }));

  return [...staticPages, ...menuRoutes, ...recipeRoutes];
}

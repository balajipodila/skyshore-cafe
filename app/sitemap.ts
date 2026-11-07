import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://skyshore-cafe.example";
  const routes = ["", "/menu", "/combos", "/outlets", "/about", "/recipes", "/feedback", "/contact", "/account"];
  return routes.map((r) => ({ url: `${base}${r}`, lastModified: new Date() }));
}

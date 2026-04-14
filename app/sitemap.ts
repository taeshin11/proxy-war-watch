import type { MetadataRoute } from "next";
import { promises as fs } from "fs";
import path from "path";

const BASE_URL = "https://proxy-war-watch.vercel.app";
const LOCALES = ["en", "ar", "zh", "ru", "fr", "de", "es", "uk"];

type Conflict = { slug: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const filePath = path.join(process.cwd(), "public/data/conflicts.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const conflicts: Conflict[] = JSON.parse(raw);

  const staticRoutes = ["", "/about"];
  const conflictRoutes = conflicts.map((c) => `/conflict/${c.slug}`);

  const allRoutes = [...staticRoutes, ...conflictRoutes];
  const urls: MetadataRoute.Sitemap = [];

  for (const route of allRoutes) {
    for (const locale of LOCALES) {
      urls.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date("2026-04-14"),
        changeFrequency: "weekly",
        priority: route === "" ? 1 : 0.8,
      });
    }
  }

  return urls;
}

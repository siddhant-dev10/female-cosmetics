import type { MetadataRoute } from "next";
import { products } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aurae-beauty.vercel.app";
  return [{ url: siteUrl, changeFrequency: "weekly", priority: 1 }, { url: `${siteUrl}/checkout`, changeFrequency: "monthly", priority: .5 }, ...products.map((product) => ({ url: `${siteUrl}/product/${product.slug}`, changeFrequency: "weekly" as const, priority: .8 }))];
}

import type { MetadataRoute } from "next";
import { ALL_CITIES } from "@/lib/cities";
import { INTL_CITIES } from "@/lib/cities-international";
import { BLOG_POSTS } from "@/lib/blog-data";
import { CATEGORIES, getCategoryPriority } from "@/lib/categories";

const SITE_URL = "https://camiihalisi.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                                lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/cami-halisi`,               lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/blog`,                      lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/teknik-ozellikler`,         lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/referanslar`,               lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/iletisim`,                  lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/galeri`,                    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hakkimizda`,                lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  // Kategori sayfaları — src/lib/categories.ts'den otomatik
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/kategori/${cat.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: getCategoryPriority(cat.slug),
  }));

  // Şehir ve ilçe sayfaları — src/lib/cities.ts'den otomatik
  const cityPages: MetadataRoute.Sitemap = ALL_CITIES.map((city) => ({
    url: `${SITE_URL}/cami-halisi/${city.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: city.type === "il" ? 0.8 : 0.6,
  }));

  // Uluslararası sayfalar — src/lib/cities-international.ts'den otomatik
  const intlPages: MetadataRoute.Sitemap = INTL_CITIES.flatMap((city) =>
    city.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}/mosque-carpet/${city.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  // Blog yazıları — src/lib/blog-data.ts'den otomatik
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...cityPages, ...intlPages, ...blogPages];
}

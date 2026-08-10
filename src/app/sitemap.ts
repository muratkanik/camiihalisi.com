import type { MetadataRoute } from "next";
import { ALL_CITIES } from "@/lib/cities";
import { INTL_CITIES } from "@/lib/cities-international";
import { BLOG_POSTS } from "@/lib/blog-data";
import { CATEGORIES, getCategoryPriority } from "@/lib/categories";

const SITE_URL = "https://camiihalisi.com";
const LOCALES = ["tr", "en", "ar", "fr", "de", "ru"] as const;

function localizedUrl(locale: (typeof LOCALES)[number], path = ""): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return locale === "tr" ? `${SITE_URL}${normalizedPath}` : `${SITE_URL}/${locale}${normalizedPath}`;
}

// DB'den aktif keyword'leri çek (yoksa boş dizi döner)
async function getActiveKeywords(): Promise<Array<{ citySlug: string; keywordSlug: string }>> {
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const kws = await prisma.cityKeyword.findMany({
      where: { isActive: true },
      select: { citySlug: true, keywordSlug: true },
    });
    await prisma.$disconnect();
    return kws;
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                                lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/en`,                        lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/ar`,                        lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/fr`,                        lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/de`,                        lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/ru`,                        lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
  ];

  // Diller arasında tekrar eden statik sayfalar — tek yerden LOCALES üzerinden üretilir
  const repeatedStaticPaths: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> = [
    { path: "/cami-halisi",        changeFrequency: "monthly", priority: 0.9 },
    { path: "/blog",                changeFrequency: "weekly",  priority: 0.8 },
    { path: "/sss",                 changeFrequency: "monthly", priority: 0.8 },
    { path: "/karsilastirma",       changeFrequency: "monthly", priority: 0.8 },
    { path: "/teknik-ozellikler",   changeFrequency: "monthly", priority: 0.7 },
    { path: "/referanslar",         changeFrequency: "monthly", priority: 0.7 },
    { path: "/iletisim",            changeFrequency: "monthly", priority: 0.7 },
    { path: "/galeri",              changeFrequency: "monthly", priority: 0.6 },
    { path: "/hakkimizda",          changeFrequency: "monthly", priority: 0.6 },
  ];
  const repeatedStaticPages: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    repeatedStaticPaths.map(({ path, changeFrequency, priority }) => ({
      url: localizedUrl(locale, path),
      lastModified: now,
      changeFrequency,
      priority,
    }))
  );

  // Karşılaştırma sayfaları
  const comparisonSlugs = [
    "akrilik-vs-yun-cami-halisi",
    "polipropilen-vs-polyamid-cami-halisi",
    "akrilik-vs-polipropilen-cami-halisi",
    "yun-vs-polyamid-cami-halisi",
    "safli-vs-gobekli-vs-seccadeli",
  ];
  const comparisonPages: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    comparisonSlugs.map((slug) => ({
      url: localizedUrl(locale, `/karsilastirma/${slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  // Kategori sayfaları — src/lib/categories.ts'den otomatik
  const categoryPages: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    CATEGORIES.map((cat) => ({
      url: localizedUrl(locale, `/kategori/${cat.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: getCategoryPriority(cat.slug),
    }))
  );

  // Şehir ve ilçe sayfaları — src/lib/cities.ts'den otomatik
  const cityPages: MetadataRoute.Sitemap = ALL_CITIES.map((city) => ({
    url: `${SITE_URL}/cami-halisi/${city.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: city.type === "il" ? 0.8 : 0.6,
  }));

  // Şehir+keyword kombinasyon sayfaları — Supabase'den otomatik
  const activeKeywords = await getActiveKeywords();
  const keywordPages: MetadataRoute.Sitemap = activeKeywords.map(({ citySlug, keywordSlug }) => ({
    url: `${SITE_URL}/cami-halisi/${citySlug}/${keywordSlug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
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
  const blogPages: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    BLOG_POSTS.map((post) => ({
      url: localizedUrl(locale, `/blog/${post.slug}`),
      lastModified: new Date(post.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }))
  );

  return [...staticPages, ...repeatedStaticPages, ...comparisonPages, ...categoryPages, ...cityPages, ...keywordPages, ...intlPages, ...blogPages];
}

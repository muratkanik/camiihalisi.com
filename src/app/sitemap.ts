import type { MetadataRoute } from "next";
import { ALL_CITIES } from "@/lib/cities";
import { INTL_CITIES } from "@/lib/cities-international";
import { BLOG_POSTS } from "@/lib/blog-data";
import { CATEGORIES, getCategoryPriority } from "@/lib/categories";

const SITE_URL = "https://camiihalisi.com";

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
    { url: `${SITE_URL}/cami-halisi`,               lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/blog`,                      lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/sss`,                       lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/karsilastirma`,             lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/teknik-ozellikler`,         lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/referanslar`,               lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/iletisim`,                  lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/galeri`,                    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/hakkimizda`,                lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  // Karşılaştırma sayfaları
  const comparisonSlugs = [
    "akrilik-vs-yun-cami-halisi",
    "polipropilen-vs-polyamid-cami-halisi",
    "akrilik-vs-polipropilen-cami-halisi",
    "yun-vs-polyamid-cami-halisi",
    "safli-vs-gobekli-vs-seccadeli",
  ];
  const comparisonPages: MetadataRoute.Sitemap = comparisonSlugs.map((slug) => ({
    url: `${SITE_URL}/karsilastirma/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

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
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...comparisonPages, ...categoryPages, ...cityPages, ...keywordPages, ...intlPages, ...blogPages];
}

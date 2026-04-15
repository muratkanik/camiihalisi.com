import type { MetadataRoute } from "next";
import { ALL_CITIES } from "@/lib/cities";
import { INTL_CITIES } from "@/lib/cities-international";
import { BLOG_POSTS } from "@/lib/blog-data";

const SITE_URL = "https://camiihalisi.com";

const CATEGORY_SLUGS = [
  "akrilik-cami-halisi",
  "safli-akrilik-cami-halisi",
  "gobekli-akrilik-cami-halisi",
  "seccadeli-akrilik-cami-halisi",
  "yun-cami-halisi",
  "safli-yun-cami-halisi",
  "gobekli-yun-cami-halisi",
  "seccadeli-yun-cami-halisi",
  "polipropilen-cami-halisi",
  "safli-polipropilen-cami-halisi",
  "gobekli-polipropilen-cami-halisi",
  "seccadeli-polipropilen-cami-halisi",
  "polyamid-cami-halisi",
  "safli-polyamid-cami-halisi",
  "gobekli-polyamid-cami-halisi",
  "seccadeli-polyamid-cami-halisi",
  "ozel-desen-axminster-cami-halisi",
  "kaucuk-cami-halisi-altligi",
  "tredmor-berber-supreme",
  "kece-cami-halisi-altligi",
  "600-cami-halisi-kecesi",
  "1000-cami-halisi-kecesi",
  "1200-cami-halisi-kecesi",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const mainSlugs = ["akrilik-cami-halisi","yun-cami-halisi","polipropilen-cami-halisi","polyamid-cami-halisi"];

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/hakkimizda`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/referanslar`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/galeri`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/teknik-ozellikler`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/iletisim`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/cami-halisi`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((slug) => ({
    url: `${SITE_URL}/kategori/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: mainSlugs.includes(slug) ? 0.9 : 0.7,
  }));

  const cityPages: MetadataRoute.Sitemap = ALL_CITIES.map((city) => ({
    url: `${SITE_URL}/cami-halisi/${city.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: city.type === "il" ? 0.8 : 0.6,
  }));

  const intlPages: MetadataRoute.Sitemap = INTL_CITIES.flatMap((city) =>
    city.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}/mosque-carpet/${city.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...cityPages, ...intlPages, ...blogPages];
}

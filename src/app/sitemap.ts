import { MetadataRoute } from "next";

const SITE_URL = "https://camiihalisi.com";
const LOCALES = ["tr", "en", "ar", "fr"];

const CATEGORY_SLUGS = [
  "akrilik-cami-halisi",
  "yun-cami-halisi",
  "polipropilen-cami-halisi",
  "polyamid-cami-halisi",
];

const BLOG_SLUGS = [
  "cami-halisi-nasil-secilir",
  "akrilik-vs-yun-cami-halisi",
  "cami-halisi-temizligi-ve-bakimi",
  "cami-halisi-olcumlendirme-rehberi",
  "cami-halisi-fiyatlari-2024",
  "polipropilen-cami-halisi-ozellikleri",
  "yun-cami-halisi-avantajlari",
  "cami-halisi-doseme-rehberi",
  "cami-halisi-desenleri-ve-motifler",
  "cami-icin-dogru-hali-secimi",
];

const STATIC_PAGES = [
  "",
  "/hakkimizda",
  "/iletisim",
  "/blog",
  "/galeri",
  "/sss",
];

function localeUrl(path: string, locale: string): string {
  const base = locale === "tr" ? SITE_URL : `${SITE_URL}/${locale}`;
  return path ? `${base}${path}` : base;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // ── Statik sayfalar ──
  for (const page of STATIC_PAGES) {
    entries.push({
      url: localeUrl(page, "tr"),
      lastModified: new Date(),
      changeFrequency: page === "" ? "daily" : "weekly",
      priority: page === "" ? 1.0 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((loc) => [loc, localeUrl(page, loc)])
        ),
      },
    });
  }

  // ── Kategori sayfaları ──
  for (const slug of CATEGORY_SLUGS) {
    entries.push({
      url: `${SITE_URL}/kategori/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((loc) => [
            loc,
            loc === "tr"
              ? `${SITE_URL}/kategori/${slug}`
              : `${SITE_URL}/${loc}/kategori/${slug}`,
          ])
        ),
      },
    });
  }

  // ── Blog makaleleri ──
  for (const slug of BLOG_SLUGS) {
    entries.push({
      url: `${SITE_URL}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((loc) => [
            loc,
            loc === "tr"
              ? `${SITE_URL}/blog/${slug}`
              : `${SITE_URL}/${loc}/blog/${slug}`,
          ])
        ),
      },
    });
  }

  return entries;
}

import type { Metadata } from "next";

const SITE_URL = "https://camiihalisi.com";
export const LOCALES = ["tr", "en", "ar", "fr", "de", "ru"] as const;
export type SeoLocale = (typeof LOCALES)[number];

/**
 * Belirli bir yol için, locale'e göre çevrilmiş title/description ile Next.js Metadata
 * üretir. `titles`/`descriptions` en az `tr` anahtarını içermeli; eksik locale'ler
 * otomatik olarak tr'ye düşer. hreflang (alternates.languages) her zaman 6 dilin
 * tamamını içerir.
 */
export function localizedMetadata({
  path,
  locale,
  titles,
  descriptions,
  // Kök layout zaten her title'a "%s | Cami Halısı – Asil Halı" şablonunu ekliyor
  // (bkz. src/app/[locale]/layout.tsx) — burada ayrıca marka eki eklenmez.
  suffix = "",
  noindex = false,
  ogImage,
}: {
  path: string;
  locale: string;
  titles: Partial<Record<SeoLocale, string>>;
  descriptions: Partial<Record<SeoLocale, string>>;
  suffix?: string;
  noindex?: boolean;
  /** Verilirse openGraph.title/description/images de doldurulur. */
  ogImage?: string;
}): Metadata {
  const activeLocale: SeoLocale = (LOCALES as readonly string[]).includes(locale) ? (locale as SeoLocale) : "tr";
  const title = (titles[activeLocale] ?? titles.tr ?? "") + suffix;
  const description = descriptions[activeLocale] ?? descriptions.tr ?? "";

  const raw = path.startsWith("/") ? path : `/${path}`;
  const normalizedPath = raw === "/" ? "" : raw;
  const urlFor = (locale: SeoLocale) => (locale === "tr" ? `${SITE_URL}${normalizedPath}` : `${SITE_URL}/${locale}${normalizedPath}`);
  const canonical = urlFor(activeLocale);

  const languages: Record<string, string> = { "x-default": urlFor("tr") };
  for (const l of LOCALES) languages[l] = urlFor(l);

  return {
    title,
    description,
    alternates: { canonical, languages },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    ...(ogImage ? { openGraph: { title, description, images: [{ url: ogImage }] } } : {}),
  };
}

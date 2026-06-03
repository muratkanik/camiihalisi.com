import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import Navigation from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import DesenDetayClient from "@/components/blocks/DesenDetayClient";
import { SAFLI_AKRILIK_DESENLER } from "@/lib/safli-akrilik-desenler";

const SITE_URL = "https://camiihalisi.com";

const LOCALES = ["tr", "en", "ar", "fr", "de"] as const;

/* Desen galerisi gösterilecek üst kategori slug'ları */
const PARENT_SLUGS = ["safli-akrilik-cami-halisi", "akrilik-cami-halisi"];

/* ── Static Params — tüm locale × parentSlug × desen kombinasyonları ── */
export function generateStaticParams() {
  return PARENT_SLUGS.flatMap((slug) =>
    LOCALES.flatMap((locale) =>
      SAFLI_AKRILIK_DESENLER.map((d) => ({
        locale,
        slug,
        desen: d.id,
      }))
    )
  );
}

/* ── Metadata ── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; desen: string }>;
}): Promise<Metadata> {
  const { locale, slug, desen: desenId } = await params;

  const desen = SAFLI_AKRILIK_DESENLER.find((d) => d.id === desenId);
  if (!desen) return {};

  const name = locale === "en" ? desen.nameEn : locale === "ar" ? desen.nameAr : desen.name;
  const alt = locale === "en" ? desen.altTextEn : locale === "ar" ? desen.altTextAr : desen.altText;

  const titleMap: Record<string, string> = {
    tr: `${name} — Saflı Akrilik Cami Halısı Deseni | Asil Halı`,
    en: `${name} — Acrylic Mosque Carpet Pattern | Asil Halı`,
    ar: `${name} — نمط سجاد المسجد الأكريليك | أصيل حالي`,
    fr: `${name} — Motif Tapis Mosquée Acrylique | Asil Halı`,
    de: `${name} — Acryl-Moscheeteppichmuster | Asil Halı`,
  };

  const descMap: Record<string, string> = {
    tr: `${name} saflı akrilik cami halısı deseni. Renk simülatörü ile canlı önizleme. Özel sipariş üretim. Asil Halı A.Ş.`,
    en: `${name} acrylic mosque carpet pattern. Live colour preview with our simulator. Custom order production. Asil Halı A.Ş.`,
    ar: `${name} نمط سجاد مسجد أكريليك. معاينة الألوان الحية مع المحاكي. الإنتاج حسب الطلب.`,
    fr: `${name} motif de tapis de mosquée acrylique. Aperçu des couleurs en direct. Production sur commande.`,
    de: `${name} Acryl-Moscheeteppichmuster. Live-Farbvorschau mit Simulator. Sonderanfertigung.`,
  };

  return {
    title: titleMap[locale] || titleMap.tr,
    description: descMap[locale] || descMap.tr,
    alternates: {
      canonical: `${SITE_URL}/${locale}/kategori/${slug}/${desenId}`,
    },
    openGraph: {
      title: titleMap[locale] || titleMap.tr,
      description: descMap[locale] || descMap.tr,
      url: `${SITE_URL}/${locale}/kategori/${slug}/${desenId}`,
      images: [{ url: `${SITE_URL}${desen.image}`, width: 560, height: 560, alt }],
      type: "website",
    },
  };
}

/* ── Sayfa ── */
export default async function DesenDetayPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; desen: string }>;
}) {
  const { locale, slug, desen: desenId } = await params;

  setRequestLocale(locale);

  const desenIdx = SAFLI_AKRILIK_DESENLER.findIndex((d) => d.id === desenId);
  if (desenIdx === -1) notFound();

  const desen = SAFLI_AKRILIK_DESENLER[desenIdx];
  const prevDesen = desenIdx > 0 ? SAFLI_AKRILIK_DESENLER[desenIdx - 1] : null;
  const nextDesen =
    desenIdx < SAFLI_AKRILIK_DESENLER.length - 1
      ? SAFLI_AKRILIK_DESENLER[desenIdx + 1]
      : null;

  const prefix = `/${locale}`;

  const name = locale === "en" ? desen.nameEn : locale === "ar" ? desen.nameAr : desen.name;

  /* JSON-LD Structured Data */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${name} — Saflı Akrilik Cami Halısı`,
    image: `${SITE_URL}${desen.image}`,
    description: `${name} saflı akrilik cami halısı deseni. %100 akrilik iplik, Bfl-s1 yangın sınıfı.`,
    brand: { "@type": "Brand", name: "Asil Halı" },
    manufacturer: { "@type": "Organization", name: "Asil Halı A.Ş." },
    material: "Akrilik",
    category: "Cami Halısı",
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "TRY",
      seller: { "@type": "Organization", name: "Asil Halı A.Ş." },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${SITE_URL}/${locale}` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Saflı Akrilik Cami Halısı",
        item: `${SITE_URL}/${locale}/kategori/${slug}`,
      },
      { "@type": "ListItem", position: 3, name },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Navigation locale={locale} />

      <DesenDetayClient
        desen={desen}
        prevDesen={prevDesen}
        nextDesen={nextDesen}
        prefix={prefix}
        locale={locale}
        categorySlug={slug}
      />

      <Footer locale={locale} />
    </>
  );
}

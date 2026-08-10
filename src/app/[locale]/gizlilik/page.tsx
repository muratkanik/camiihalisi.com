import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import prisma from "@/lib/prisma";
import LegalPageContent from "@/components/blocks/LegalPageContent";

const SITE_URL = "https://camiihalisi.com";

const FALLBACK_TITLES: Record<string, string> = {
  tr: "Gizlilik Politikası",
  en: "Privacy Policy",
  de: "Datenschutzerklärung",
  fr: "Politique de Confidentialité",
  ar: "سياسة الخصوصية",
  ru: "Политика конфиденциальности",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  let title = FALLBACK_TITLES[locale] ?? FALLBACK_TITLES.tr;
  try {
    const row = await prisma.setting.findUnique({ where: { key: "legal_pages_data" } });
    if (row) {
      const data = JSON.parse(row.value);
      title = data?.gizlilik?.[locale]?.title ?? data?.gizlilik?.tr?.title ?? title;
    }
  } catch {
    // fallback title kullanılır
  }

  const canonical = locale === "tr" ? `${SITE_URL}/gizlilik` : `${SITE_URL}/${locale}/gizlilik`;

  return {
    title: `${title} | Asil Halı`,
    alternates: {
      canonical,
      languages: {
        tr: `${SITE_URL}/gizlilik`,
        en: `${SITE_URL}/en/gizlilik`,
        ar: `${SITE_URL}/ar/gizlilik`,
        fr: `${SITE_URL}/fr/gizlilik`,
        de: `${SITE_URL}/de/gizlilik`,
        ru: `${SITE_URL}/ru/gizlilik`,
        "x-default": `${SITE_URL}/gizlilik`,
      },
    },
    robots: { index: false, follow: true },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function GizlilikPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LegalPageContent legalKey="gizlilik" locale={locale} />;
}

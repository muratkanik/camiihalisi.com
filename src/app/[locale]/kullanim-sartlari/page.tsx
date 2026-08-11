import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import prisma from "@/lib/prisma";
import LegalPageContent from "@/components/blocks/LegalPageContent";

const SITE_URL = "https://camiihalisi.com";

const FALLBACK_TITLES: Record<string, string> = {
  tr: "Kullanım Şartları",
  en: "Terms of Use",
  de: "Nutzungsbedingungen",
  fr: "Conditions d'utilisation",
  ar: "شروط الاستخدام",
  ru: "Условия использования",
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
      title = data?.["kullanim-sartlari"]?.[locale]?.title ?? data?.["kullanim-sartlari"]?.tr?.title ?? title;
    }
  } catch {
    // fallback title kullanılır
  }

  const canonical = locale === "tr" ? `${SITE_URL}/kullanim-sartlari` : `${SITE_URL}/${locale}/kullanim-sartlari`;

  return {
    title,
    alternates: {
      canonical,
      languages: {
        tr: `${SITE_URL}/kullanim-sartlari`,
        en: `${SITE_URL}/en/kullanim-sartlari`,
        ar: `${SITE_URL}/ar/kullanim-sartlari`,
        fr: `${SITE_URL}/fr/kullanim-sartlari`,
        de: `${SITE_URL}/de/kullanim-sartlari`,
        ru: `${SITE_URL}/ru/kullanim-sartlari`,
        "x-default": `${SITE_URL}/kullanim-sartlari`,
      },
    },
    robots: { index: false, follow: true },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function KullanimSartlariPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LegalPageContent legalKey="kullanim-sartlari" locale={locale} />;
}

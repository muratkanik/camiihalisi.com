import type { Metadata } from "next";
import { setRequestLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import Navigation from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import IletisimClient from "@/components/IletisimClient";
import { DEFAULT_OFFICES } from "../admin/iletisim/types";
import { DEFAULTS as SETTINGS_DEFAULTS } from "@/lib/settings";

export const dynamic = "force-dynamic";

const SITE_URL = "https://camiihalisi.com";

export const metadata: Metadata = {
  title: "İletişim | Asil Halı Cami Halısı",
  description: "Asil Halı ile iletişime geçin. Kayseri merkez, İstanbul ofis ve Türkiye genelinde temsilciliklerimizle hizmetinizdeyiz.",
  alternates: {
    canonical: `${SITE_URL}/iletisim`,
    languages: {
      "tr": `${SITE_URL}/iletisim`,
      "en": `${SITE_URL}/en/iletisim`,
      "ar": `${SITE_URL}/ar/iletisim`,
      "fr": `${SITE_URL}/fr/iletisim`,
      "de": `${SITE_URL}/de/iletisim`,
      "x-default": `${SITE_URL}/iletisim`,
    },
  },
};

async function getContactData() {
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    try {
      const [officesRow, settingsRows] = await Promise.all([
        prisma.setting.findUnique({ where: { key: "contact_offices" } }),
        prisma.setting.findMany({
          where: { key: { in: ["phone", "email", "whatsapp_number", "whatsapp_message"] } },
        }),
      ]);

      const offices = officesRow ? JSON.parse(officesRow.value) : DEFAULT_OFFICES;
      const sm: Record<string, string> = {};
      for (const row of settingsRows) sm[row.key] = row.value;

      return {
        offices,
        settings: {
          phone: sm["phone"] ?? SETTINGS_DEFAULTS.phone,
          email: sm["email"] ?? SETTINGS_DEFAULTS.email,
          whatsappNumber: sm["whatsapp_number"] ?? SETTINGS_DEFAULTS.whatsappNumber,
          whatsappMessage: sm["whatsapp_message"] ?? SETTINGS_DEFAULTS.whatsappMessage,
        },
      };
    } finally {
      await prisma.$disconnect();
    }
  } catch {
    return {
      offices: DEFAULT_OFFICES,
      settings: {
        phone: SETTINGS_DEFAULTS.phone,
        email: SETTINGS_DEFAULTS.email,
        whatsappNumber: SETTINGS_DEFAULTS.whatsappNumber,
        whatsappMessage: SETTINGS_DEFAULTS.whatsappMessage,
      },
    };
  }
}

export default async function IletisimPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const prefix = locale === "tr" ? "" : `/${locale}`;
  const [{ offices, settings }, messages] = await Promise.all([
    getContactData(),
    getMessages(),
  ]);

  return (
    <>
      <Navigation locale={locale} />
      {/* Wrap client component with its own provider so useTranslations
          works correctly during force-dynamic static pre-rendering */}
      <NextIntlClientProvider locale={locale} messages={messages}>
        <IletisimClient settings={settings} offices={offices} prefix={prefix} />
      </NextIntlClientProvider>
      <Footer locale={locale} />
    </>
  );
}

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Navigation from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import IletisimClient from "@/components/IletisimClient";
import { DEFAULT_OFFICES } from "../admin/iletisim/types";
import { DEFAULTS as SETTINGS_DEFAULTS } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "İletişim | Asil Halı Cami Halısı",
  description: "Asil Halı ile iletişime geçin. Kayseri merkez, İstanbul ofis ve Türkiye genelinde temsilciliklerimizle hizmetinizdeyiz.",
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
  const { offices, settings } = await getContactData();

  return (
    <>
      <Navigation locale={locale} />
      <IletisimClient settings={settings} offices={offices} prefix={prefix} />
      <Footer locale={locale} />
    </>
  );
}

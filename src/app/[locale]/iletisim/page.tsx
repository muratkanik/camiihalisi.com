import type { Metadata } from "next";
import { setRequestLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import Navigation from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import IletisimClient from "@/components/IletisimClient";
import { DEFAULT_OFFICES } from "../admin/iletisim/types";
import { DEFAULTS as SETTINGS_DEFAULTS } from "@/lib/settings";
import { localizedMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

const TITLES = {
  tr: "İletişim | Asil Halı Cami Halısı",
  en: "Contact | Asil Halı Mosque Carpets",
  de: "Kontakt | Asil Halı Moscheeteppiche",
  fr: "Contact | Tapis de Mosquée Asil Halı",
  ar: "اتصل بنا | سجاد المساجد أصيل هالي",
  ru: "Контакты | Ковры для Мечетей Asil Halı",
};

const DESCRIPTIONS = {
  tr: "Asil Halı ile iletişime geçin. Kayseri merkez, İstanbul ofis ve Türkiye genelinde temsilciliklerimizle hizmetinizdeyiz.",
  en: "Get in touch with Asil Halı. We serve you from our Kayseri headquarters, Istanbul office and representatives across Turkey.",
  de: "Kontaktieren Sie Asil Halı. Wir sind für Sie da — von unserer Zentrale in Kayseri, unserem Büro in Istanbul und Vertretungen in ganz der Türkei.",
  fr: "Contactez Asil Halı. Nous vous servons depuis notre siège à Kayseri, notre bureau d'Istanbul et nos représentants dans toute la Turquie.",
  ar: "تواصل مع أصيل هالي. نخدمكم من مقرنا الرئيسي في قيصري ومكتبنا في إسطنبول وممثلينا في جميع أنحاء تركيا.",
  ru: "Свяжитесь с Asil Halı. Мы обслуживаем вас из головного офиса в Кайсери, офиса в Стамбуле и представительств по всей Турции.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata({ path: "/iletisim", locale, titles: TITLES, descriptions: DESCRIPTIONS });
}

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

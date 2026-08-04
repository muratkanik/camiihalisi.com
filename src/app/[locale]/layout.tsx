import type { Metadata } from "next";
import "../globals.css";
import Script from "next/script";
import { Inter, Cormorant_Garamond, Noto_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import WhatsAppButton from '@/components/WhatsAppButton';
import { getSettings } from "@/lib/settings";

const SITE_URL = "https://camiihalisi.com";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-noto-arabic",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    tr: "Cami Halısı | Türkiye'nin Önde Gelen Cami Halısı Uzmanı – Asil Halı",
    en: "Mosque Carpet | Turkey's Leading Mosque Carpet Expert – Asil Hali",
    ar: "سجادة مسجد | خبير سجاد المساجد الرائد في تركيا – أصيل هالي",
    fr: "Tapis de Mosquée | Expert en Tapis de Mosquée en Turquie – Asil Hali",
    de: "Moscheeteppich | Türkeis führender Moscheeteppich-Experte – Asil Hali",
  };

  const descriptions: Record<string, string> = {
    tr: "Türkiye'nin köklü cami halısı üreticisi Asil Halı. Akrilik, yün, polipropilen ve polyamid cami halıları. 50+ yıl tecrübe, 10.000+ cami referansı, Türkiye geneli teslimat.",
    en: "Turkey's leading mosque carpet manufacturer Asil Hali. Acrylic, wool, polypropylene and polyamide mosque carpets. 50+ years experience, 10,000+ mosque references.",
    ar: "أصيل هالي — الشركة الرائدة في تصنيع سجاد المساجد في تركيا. سجاد أكريليك وصوف وبولي بروبيلين وبولي أميد.",
    fr: "Asil Hali, fabricant leader de tapis de mosquée en Turquie. Tapis acrylique, laine, polypropylène et polyamide. 50+ ans d'expérience.",
    de: "Asil Hali — führender Moscheeteppich-Hersteller der Türkei. Acryl-, Woll-, Polypropylen- und Polyamid-Moscheeteppiche. 50+ Jahre Erfahrung.",
  };

  const alternates: Record<string, string> = {
    tr: SITE_URL,
    en: `${SITE_URL}/en`,
    ar: `${SITE_URL}/ar`,
    fr: `${SITE_URL}/fr`,
    de: `${SITE_URL}/de`,
  };

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: titles[locale] || titles.tr,
      template: `%s | Cami Halısı – Asil Halı`,
    },
    description: descriptions[locale] || descriptions.tr,
    keywords: [
      "cami halısı", "cami halıları", "cami halısı fiyatları",
      "akrilik cami halısı", "yün cami halısı", "polipropilen cami halısı",
      "mescit halısı", "cami halısı modelleri", "cami halısı üretimi",
      "mosque carpet", "mosque carpet turkey", "سجادة مسجد",
      "Asil Halı", "cami halısı üretici", "cami halısı toptan",
    ],
    authors: [{ name: "Asil Halı A.Ş.", url: "https://www.asilhali.com.tr" }],
    creator: "Asil Halı A.Ş.",
    publisher: "Asil Halı A.Ş.",
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: "/icon.svg",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "tr" ? "tr_TR" : locale === "en" ? "en_US" : locale === "ar" ? "ar_SA" : locale === "de" ? "de_DE" : "fr_FR",
      alternateLocale: ["tr_TR", "en_US", "ar_SA", "fr_FR", "de_DE"].filter(
        (l) => l !== (locale === "tr" ? "tr_TR" : locale === "en" ? "en_US" : locale === "ar" ? "ar_SA" : locale === "de" ? "de_DE" : "fr_FR")
      ),
      url: alternates[locale] || SITE_URL,
      siteName: "Camii Halısı | Asil Halı",
      title: titles[locale] || titles.tr,
      description: descriptions[locale] || descriptions.tr,
      images: [
        {
          url: `${SITE_URL}/images/cami-hero.png`,
          width: 1200,
          height: 630,
          alt: "Asil Halı – Cami Halısı",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale] || titles.tr,
      description: descriptions[locale] || descriptions.tr,
      images: [`${SITE_URL}/images/cami-hero.png`],
    },
    alternates: {
      canonical: alternates[locale] || SITE_URL,
      languages: alternates,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const [messages, settings] = await Promise.all([getMessages(), getSettings()]);
  const gaId = settings.googleAnalyticsId?.trim() || "G-JC88Y0R2BL";

  const isRTL = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      className={`h-full ${inter.variable} ${cormorantGaramond.variable} ${notoSansArabic.variable}`}
    >
      <head>
        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: "Asil Halı A.Ş.",
              alternateName: "Camii Halısı",
              url: "https://www.asilhali.com.tr",
              sameAs: [
                "https://camiihalisi.com",
                "https://www.asilhali.com.tr",
                "https://www.instagram.com/mosquecarpets",
                "https://www.linkedin.com/company/asil-hali",
              ],
              logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/images/cami-hero.png`,
              },
              description:
                "Türkiye'nin köklü cami halısı üreticisi. 50+ yıl tecrübe, 10.000+ cami referansı.",
              address: {
                "@type": "PostalAddress",
                addressCountry: "TR",
                addressLocality: "Kayseri",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+90-532-346-79-39",
                contactType: "customer service",
                availableLanguage: ["Turkish", "Arabic", "English"],
              },
            }),
          }}
        />

        {/* WebSite JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              url: SITE_URL,
              name: "Camii Halısı",
              description: "Cami halısı bilgi ve içerik portalı",
              publisher: { "@id": `${SITE_URL}/#organization` },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
          <WhatsAppButton />
        </NextIntlClientProvider>

        {/* Google Analytics — sadece GA ID ayarlıysa yüklenir */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from "next/navigation";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/components/blocks/HeroSection";
import StatsSection from "@/components/blocks/StatsSection";
import CategoryGrid from "@/components/blocks/CategoryGrid";
import FeatureGrid from "@/components/blocks/FeatureGrid";
import BlogPreview from "@/components/blocks/BlogPreview";
import CTASection from "@/components/blocks/CTASection";
import FAQSection from "@/components/blocks/FAQSection";

const SITE_URL = "https://camiihalisi.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: locale === "tr"
      ? "Cami Halısı | Türkiye'nin Önde Gelen Uzmanı – Asil Halı A.Ş."
      : "Mosque Carpet Turkey | Asil Hali",
    description:
      locale === "tr"
        ? "Türkiye'nin köklü cami halısı üreticisi Asil Halı. Akrilik, yün, polipropilen cami halıları. 50+ yıl tecrübe, 10.000+ cami. Özel ölçü üretim, Türkiye geneli teslimat."
        : "Turkey's leading mosque carpet manufacturer. Custom size, acrylic, wool, polypropylene mosque carpets. Nationwide delivery.",
    alternates: {
      canonical: locale === "tr" ? SITE_URL : `${SITE_URL}/${locale}`,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  // JSON-LD: BreadcrumbList için ana sayfa
  const breadcrumbLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ana Sayfa",
        item: SITE_URL,
      },
    ],
  };

  return (
    <>
      {/* Sayfa özel JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }}
      />

      <Navigation locale={locale} />

      <main id="main-content">
        {/* 1. Hero Bölümü */}
        <HeroSection />

        {/* 2. İstatistikler */}
        <StatsSection />

        {/* 3. Kategori Grid */}
        <CategoryGrid locale={locale} />

        {/* 4. Özellikler / Neden Asil Halı */}
        <FeatureGrid />

        {/* 5. CTA — Ana Siteye Yönlendirme */}
        <CTASection
          variant="green"
          title="Caminiz İçin En İyi Halıyı Seçelim"
          subtitle="50 yılı aşkın tecrübemizle, caminizin mimarisine ve bütçesine özel halı çözümü sunuyoruz. Türkiye'nin dört bir yanına teslimat ve montaj."
        />

        {/* 6. Blog Önizleme */}
        <BlogPreview locale={locale} />

        {/* 7. SSS */}
        <FAQSection />

        {/* 8. Son CTA */}
        <CTASection
          variant="cream"
          title="Fiyat Teklifi Almak İster misiniz?"
          subtitle="Asil Halı uzmanları caminizin ihtiyacını değerlendirerek size en uygun halı çözümünü ve fiyat teklifini sunar. Ücretsiz keşif ve danışmanlık hizmeti."
        />
      </main>

      <Footer locale={locale} />
    </>
  );
}

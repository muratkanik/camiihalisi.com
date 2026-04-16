import type { Metadata } from "next";
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from "next/navigation";

import Navigation from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import HeroSection from "@/components/blocks/HeroSection";
import { getSettings } from "@/lib/settings";
import ProblemSection, { type ProblemItem } from "@/components/blocks/ProblemSection";
import CategoryShowcase from "@/components/blocks/CategoryShowcase";
import TrustSection, { type Testimonial } from "@/components/blocks/TrustSection";
import FeatureGrid from "@/components/blocks/FeatureGrid";
import BlogPreview from "@/components/blocks/BlogPreview";
import CTASection from "@/components/blocks/CTASection";
import FAQSection, { type FAQItem } from "@/components/blocks/FAQSection";
import { getBlogPosts as getBlogPostsFromAdmin } from "@/app/[locale]/admin/blog/actions";
import { getTestimonials } from "@/app/[locale]/admin/yorumlar/actions";

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

  // Fetch data in parallel
  const [settings, allBlogPosts, testimonials] = await Promise.all([
    getSettings(),
    getBlogPostsFromAdmin().catch(() => []),
    getTestimonials().catch(() => []),
  ]);

  // SSS sorularını blog'dan al (category: "SSS")
  const faqItems: FAQItem[] = allBlogPosts
    .filter((p) => p.category === "SSS")
    .map((p) => ({ question: p.title, answer: p.excerpt }));

  // ProblemSection verilerini blog'dan al (category: "Faydalı Bilgiler", subcategory: "Birçok Camide Halılar Neden Erken Yıpranır?")
  const problemItems: ProblemItem[] = allBlogPosts
    .filter((p) => p.category === "Faydalı Bilgiler" && (p as any).subcategory === "Birçok Camide Halılar Neden Erken Yıpranır?")
    .map((p, i) => ({
      title: p.title,
      desc: p.excerpt,
      slug: p.slug,
      iconIndex: i,
    }));

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
        {/* 1. Hero — full-width slider with overlay */}
        <HeroSection content={{ title: settings.heroTitle, subtitle: settings.heroSubtitle }} />

        {/* 2. Problem — Neden Erken Yıpranır? (blog'dan) */}
        <ProblemSection items={problemItems} locale={locale} />

        {/* 3. Ürün Showcase — Hangi Halı Uygun? */}
        <CategoryShowcase locale={locale} />

        {/* 4. Güven & Referans — 30 Yıldır (admin'den) */}
        <TrustSection testimonials={testimonials} />

        {/* 5. Özellikler — Neden Asil Halı? */}
        <FeatureGrid />

        {/* 6. CTA — Ana Siteye Yönlendirme */}
        <CTASection
          variant="green"
          title="Caminiz İçin En İyi Halıyı Seçelim"
          subtitle="50 yılı aşkın tecrübemizle, caminizin mimarisine ve bütçesine özel halı çözümü sunuyoruz. Türkiye'nin dört bir yanına teslimat ve montaj."
        />

        {/* 7. Blog Önizleme */}
        <BlogPreview locale={locale} />

        {/* 8. SSS (blog'dan — kategori: SSS) */}
        <FAQSection faqs={faqItems.length > 0 ? faqItems : undefined} />

        {/* 9. Son CTA */}
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

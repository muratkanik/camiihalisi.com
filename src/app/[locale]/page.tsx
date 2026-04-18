import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from 'next-intl/server';
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
  const [settings, allBlogPosts, testimonials, tProblem] = await Promise.all([
    getSettings(),
    getBlogPostsFromAdmin().catch(() => []),
    getTestimonials().catch(() => []),
    getTranslations("problem"),
  ]);

  // SSS sorularını blog'dan al (category: "SSS")
  const faqItems: FAQItem[] = allBlogPosts
    .filter((p) => p.category === "SSS")
    .map((p) => ({ question: p.title, answer: p.excerpt }));

  // ProblemSection verilerini blog'dan al (category: "Faydalı Bilgiler", subcategory: "Birçok Camide Halılar Neden Erken Yıpranır?")
  // Blog çevirilerini DB'den yükle
  let blogTranslations: Record<string, Record<string, Record<string, string>>> = {};
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const row = await prisma.setting.findUnique({ where: { key: "blog_translations" } });
    await prisma.$disconnect();
    if (row) blogTranslations = JSON.parse(row.value);
  } catch { /* DB unavailable */ }

  const problemItems: ProblemItem[] = allBlogPosts
    .filter((p) => p.category === "Faydalı Bilgiler" && (p as any).subcategory === "Birçok Camide Halılar Neden Erken Yıpranır?")
    .map((p, i) => {
      const tr = locale !== "tr" ? blogTranslations[p.slug]?.[locale] : undefined;
      return {
        title: tr?.title ?? p.title,
        desc: tr?.excerpt ?? p.excerpt,
        slug: p.slug,
        iconIndex: i,
      };
    });

  // ── JSON-LD: Yapısal veriler ─────────────────────────────────────────────────

  // Organization — AI sistemleri ve Google için şirket kimliği
  const organizationLD = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Asil Halı A.Ş.",
    alternateName: ["Asil Halı", "camiihalisi.com"],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/images/logo.png`,
      width: 200,
      height: 60,
    },
    description:
      "Türkiye'nin köklü cami halısı üreticisi. 1970'ten bu yana akrilik, yün, polipropilen ve Axminster cami halıları üretmekteyiz.",
    foundingDate: "1970",
    numberOfEmployees: { "@type": "QuantitativeValue", value: "100+" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kayseri",
      addressRegion: "Kayseri",
      addressCountry: "TR",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+90-352-232-38-38",
        contactType: "customer service",
        areaServed: "TR",
        availableLanguage: "Turkish",
      },
      {
        "@type": "ContactPoint",
        telephone: "+90-532-346-79-39",
        contactType: "sales",
        contactOption: "WhatsApp",
        areaServed: "TR",
      },
    ],
    sameAs: [
      "https://www.asilhali.com.tr",
    ],
  };

  // LocalBusiness — yerel SEO için
  const localBusinessLD = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeGoodsStore"],
    "@id": `${SITE_URL}/#localbusiness`,
    name: "Asil Halı — Cami Halısı",
    url: SITE_URL,
    telephone: "+90-352-232-38-38",
    priceRange: "₺₺",
    image: `${SITE_URL}/images/panorama-cami.jpg`,
    description:
      "Türkiye genelinde 10.000+ camiye hizmet eden cami halısı üreticisi ve tedarikçisi.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kayseri Organize Sanayi Bölgesi",
      addressLocality: "Kayseri",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 38.7225,
      longitude: 35.4875,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    areaServed: {
      "@type": "Country",
      name: "Turkey",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Cami Halısı Ürün Kataloğu",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Akrilik Cami Halısı" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Yün Cami Halısı" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Polipropilen Cami Halısı" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Polyamid Cami Halısı" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Özel Desen Axminster Cami Halısı" } },
      ],
    },
  };

  // WebSite — sitelink searchbox için
  const websiteLD = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "camiihalisi.com",
    description: "Türkiye'nin cami halısı portal sitesi",
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: ["tr", "en", "ar", "fr"],
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/sss?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  // FAQPage — SSS'ten ilk 5 soru
  const faqLD = faqItems.slice(0, 5).length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.slice(0, 5).map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  } : null;

  // BreadcrumbList
  const breadcrumbLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
    ],
  };

  return (
    <>
      {/* Yapısal veriler — SEO & AI keşif */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }} />
      {faqLD && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />}

      <Navigation locale={locale} />

      <main id="main-content">
        {/* 1. Hero — full-width slider with overlay */}
        <HeroSection content={{ title: settings.heroTitle, subtitle: settings.heroSubtitle }} />

        {/* 2. Problem — Neden Erken Yıpranır? (blog'dan) */}
        <ProblemSection items={problemItems} sectionTitle={tProblem("sectionTitle")} locale={locale} />

        {/* 3. Ürün Showcase — Hangi Halı Uygun? */}
        <CategoryShowcase locale={locale} />

        {/* 4. Güven & Referans — 30 Yıldır (admin'den) */}
        <TrustSection testimonials={testimonials} />

        {/* 5. Özellikler — Neden Asil Halı? */}
        <FeatureGrid />

        {/* 6. CTA — Ana Siteye Yönlendirme */}
        <CTASection variant="green" />

        {/* 7. Blog Önizleme */}
        <BlogPreview locale={locale} />

        {/* 8. SSS (blog'dan — kategori: SSS) */}
        <FAQSection faqs={faqItems.length > 0 ? faqItems : undefined} />

        {/* 9. Son CTA */}
        <CTASection variant="cream" />
      </main>

      <Footer locale={locale} />
    </>
  );
}

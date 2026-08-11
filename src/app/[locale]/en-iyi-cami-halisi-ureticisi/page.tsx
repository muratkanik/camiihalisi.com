import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import Navigation from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import CTASection from "@/components/blocks/CTASection";
import FAQSection from "@/components/blocks/FAQSection";
import prisma from "@/lib/prisma";
import { localizedMetadata } from "@/lib/seo";

const SITE_URL = "https://camiihalisi.com";
const PATH = "/en-iyi-cami-halisi-ureticisi";

type Locale = "tr" | "en" | "de" | "fr" | "ar" | "ru";

type GuideContent = {
  metaTitle: string;
  metaDescription: string;
  title: string;
  intro: string;
  criteria: { heading: string; body: string }[];
  companyFit: { heading: string; body: string };
  faq: { q: string; a: string }[];
};

const FALLBACK_META: Record<Locale, { title: string; description: string }> = {
  tr: { title: "En İyi Cami Halısı Üreticisi Nasıl Seçilir?", description: "Cami halısı üreticisi seçim kriterleri rehberi." },
  en: { title: "How to Choose the Best Mosque Carpet Manufacturer", description: "A guide to evaluating mosque carpet manufacturers." },
  de: { title: "Wie Wählt Man den Besten Moscheeteppich-Hersteller?", description: "Ein Leitfaden zur Bewertung von Moscheeteppich-Herstellern." },
  fr: { title: "Comment Choisir le Meilleur Fabricant de Tapis de Mosquée ?", description: "Un guide pour évaluer les fabricants de tapis de mosquée." },
  ar: { title: "كيف تختار أفضل مصنع لسجاد المساجد؟", description: "دليل لتقييم مصنعي سجاد المساجد." },
  ru: { title: "Как Выбрать Лучшего Производителя Ковров для Мечетей?", description: "Руководство по оценке производителей ковров для мечетей." },
};

async function loadGuide(locale: string): Promise<GuideContent | null> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: "best_manufacturer_guide_data" } });
    if (!row) return null;
    const data = JSON.parse(row.value);
    return data[locale] ?? data.tr ?? null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const guide = await loadGuide(locale);
  const fallback = FALLBACK_META[(locale as Locale) in FALLBACK_META ? (locale as Locale) : "tr"];

  return localizedMetadata({
    path: PATH,
    locale,
    titles: { tr: guide?.metaTitle ?? fallback.title },
    descriptions: { tr: guide?.metaDescription ?? fallback.description },
  });
}

export function generateStaticParams() {
  return (["tr", "en", "ar", "fr", "de", "ru"] as const).map((locale) => ({ locale }));
}

export default async function EnIyiCamiHalisiUreticisiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const prefix = locale === "tr" ? "" : `/${locale}`;

  const guide = await loadGuide(locale);
  const fallback = FALLBACK_META[(locale as Locale) in FALLBACK_META ? (locale as Locale) : "tr"];

  const title = guide?.title ?? fallback.title;
  const intro = guide?.intro ?? fallback.description;
  const criteria = guide?.criteria ?? [];
  const companyFit = guide?.companyFit;
  const faqs = guide?.faq ?? [];

  const canonical = locale === "tr" ? `${SITE_URL}${PATH}` : `${SITE_URL}/${locale}${PATH}`;

  const breadcrumbLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: title, item: canonical },
    ],
  };

  const faqLD = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  } : null;

  const articleLD = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: intro,
    author: { "@type": "Organization", name: "Asil Halı A.Ş." },
    publisher: {
      "@type": "Organization",
      name: "Asil Halı A.Ş.",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLD) }} />
      {faqLD && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />}

      <Navigation locale={locale} />

      <main id="main-content">
        {/* Hero */}
        <section className="bg-[#0097A7] py-16 relative overflow-hidden">
          <div className="container-site relative z-10">
            <nav className="flex items-center gap-2 text-sm text-white/50 mb-6" aria-label="Breadcrumb">
              <Link href={`${prefix}/`} className="hover:text-white transition-colors">
                Ana Sayfa
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#E4B84A]">{title}</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-3xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {title}
            </h1>
            <p className="text-lg text-white/70 max-w-2xl leading-relaxed">{intro}</p>
          </div>
        </section>

        {/* Criteria */}
        <section className="section bg-[#F0FDFE]">
          <div className="container-site max-w-4xl">
            <div className="space-y-8">
              {criteria.map((c, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#B2EBF2] p-6 md:p-8">
                  <h2 className="text-xl font-bold text-[#0097A7] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {c.heading}
                  </h2>
                  <p className="text-[#4A4035] leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company fit */}
        {companyFit && (
          <section className="section bg-white">
            <div className="container-site max-w-4xl">
              <div className="bg-[#0097A7]/5 border border-[#0097A7]/20 rounded-2xl p-8">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-[#0097A7] flex-shrink-0 mt-1" aria-hidden="true" />
                  <h2 className="text-xl font-bold text-[#0097A7]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {companyFit.heading}
                  </h2>
                </div>
                <p className="text-[#4A4035] leading-relaxed">{companyFit.body}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={`${prefix}/teknik-ozellikler`} className="btn btn-outline text-sm">
                    Teknik Veri Föylerini İncele
                  </Link>
                  <Link href={`${prefix}/iletisim`} className="btn btn-primary text-sm">
                    Teklif Alın
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {faqs.length > 0 && (
          <FAQSection faqs={faqs.map((f) => ({ question: f.q, answer: f.a }))} />
        )}

        <CTASection variant="green" title="Cami Projeniz İçin Teknik Değerlendirme Talep Edin" subtitle="Asil Halı uzman ekibi, ihtiyacınıza en uygun malzeme ve modeli birlikte belirlesin." />
      </main>

      <Footer locale={locale} />
    </>
  );
}

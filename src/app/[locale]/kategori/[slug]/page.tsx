import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, ExternalLink, ChevronRight } from "lucide-react";

import Navigation from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import CTASection from "@/components/blocks/CTASection";
import FAQSection from "@/components/blocks/FAQSection";
import CategoryFiltersClient from "@/components/blocks/CategoryFiltersClient";

import DesenGalerisi from "@/components/blocks/DesenGalerisi";
import { SAFLI_AKRILIK_DESENLER } from "@/lib/safli-akrilik-desenler";
import ProductDatasheets from "@/components/blocks/ProductDatasheets";

const SITE_URL = "https://camiihalisi.com";

function kategoriTrackedUrl(slug: string): string {
  const to = `https://www.asilhali.com.tr?utm_source=camiihalisi&utm_medium=kategori&utm_campaign=${slug}`;
  return `/api/r?to=${encodeURIComponent(to)}&from=/kategori/${slug}&label=teklif-al&cat=outbound`;
}

interface CategoryBaseData {
  slug: string;
  image: string;
  heroImage: string;
  color: string;
  relatedSlugs: string[];
}

const CATEGORY_IMAGES: Record<string, string> = {
  "akrilik-cami-halisi": "/images/cami-katalog-01.png",
  "safli-akrilik-cami-halisi": "/images/cami-katalog-02.png",
  "gobekli-akrilik-cami-halisi": "/images/gobekli-cami-halisi.png",
  "seccadeli-akrilik-cami-halisi": "/images/cami-katalog-04.png",
  "yun-cami-halisi": "/images/cami-katalog-05.png",
  "safli-yun-cami-halisi": "/images/cami-katalog-06.png",
  "gobekli-yun-cami-halisi": "/images/cami-katalog-07.png",
  "seccadeli-yun-cami-halisi": "/images/cami-katalog-08.png",
  "polipropilen-cami-halisi": "/images/cami-katalog-09.png",
  "safli-polipropilen-cami-halisi": "/images/cami-katalog-10.png",
  "gobekli-polipropilen-cami-halisi": "/images/cami-katalog-11.png",
  "seccadeli-polipropilen-cami-halisi": "/images/cami-katalog-12.png",
  "polyamid-cami-halisi": "/images/cami-katalog-13.png",
  "safli-polyamid-cami-halisi": "/images/cami-katalog-14.png",
  "gobekli-polyamid-cami-halisi": "/images/cami-katalog-15.png",
  "seccadeli-polyamid-cami-halisi": "/images/cami-katalog-16.png",
  "ozel-desen-axminster-cami-halisi": "/images/cami-katalog-17.png",
  "kece-cami-halisi-altligi": "/images/cami-katalog-18.png",
};

// Common colors offered for each material type
const COMMON_COLORS = ["#0097A7", "#1B2E5E", "#8B1A1A", "#1A4E8B", "#C9972B", "#7A7A7A"];
const NATURAL_COLORS = ["#0097A7", "#1B2E5E", "#8B1A1A", "#6B4226", "#C9972B", "#F5EDD7"];


// Saflı akrilik desen galerisi gösterilecek slug'lar
const DESEN_GALERISI_SLUGS = new Set([
  "safli-akrilik-cami-halisi",
  "akrilik-cami-halisi",
]);

type CatalogDesen = "Saflı" | "Göbekli" | "Seccadeli" | "Standart" | "Özel";

interface CatalogItem {
  slug: string;
  title: string;
  image: string;
  desen: CatalogDesen;
  colors: string[];
  badge?: string;
}

const CATALOG_DATA: Record<string, CatalogItem[]> = {
  "akrilik-cami-halisi": [
    { slug: "akrilik-cami-halisi", title: "Akrilik Cami Halısı", image: "/images/cami-katalog-01.png", desen: "Standart", colors: COMMON_COLORS, badge: "En Çok Satan" },
    { slug: "safli-akrilik-cami-halisi", title: "Saflı Akrilik Cami Halısı", image: "/images/cami-katalog-02.png", desen: "Saflı", colors: COMMON_COLORS },
    { slug: "gobekli-akrilik-cami-halisi", title: "Göbekli Akrilik Cami Halısı", image: "/images/gobekli-cami-halisi.png", desen: "Göbekli", colors: COMMON_COLORS },
    { slug: "seccadeli-akrilik-cami-halisi", title: "Seccadeli Akrilik Cami Halısı", image: "/images/cami-katalog-04.png", desen: "Seccadeli", colors: COMMON_COLORS },
  ],
  "yun-cami-halisi": [
    { slug: "yun-cami-halisi", title: "Yün Cami Halısı", image: "/images/cami-katalog-05.png", desen: "Standart", colors: NATURAL_COLORS, badge: "Premium" },
    { slug: "safli-yun-cami-halisi", title: "Saflı Yün Cami Halısı", image: "/images/cami-katalog-06.png", desen: "Saflı", colors: NATURAL_COLORS },
    { slug: "gobekli-yun-cami-halisi", title: "Göbekli Yün Cami Halısı", image: "/images/cami-katalog-07.png", desen: "Göbekli", colors: NATURAL_COLORS },
    { slug: "seccadeli-yun-cami-halisi", title: "Seccadeli Yün Cami Halısı", image: "/images/cami-katalog-08.png", desen: "Seccadeli", colors: NATURAL_COLORS },
  ],
  "polipropilen-cami-halisi": [
    { slug: "polipropilen-cami-halisi", title: "Polipropilen Cami Halısı", image: "/images/cami-katalog-09.png", desen: "Standart", colors: COMMON_COLORS, badge: "Dayanıklı" },
    { slug: "safli-polipropilen-cami-halisi", title: "Saflı Polipropilen Cami Halısı", image: "/images/cami-katalog-10.png", desen: "Saflı", colors: COMMON_COLORS },
    { slug: "gobekli-polipropilen-cami-halisi", title: "Göbekli Polipropilen Cami Halısı", image: "/images/cami-katalog-11.png", desen: "Göbekli", colors: COMMON_COLORS },
    { slug: "seccadeli-polipropilen-cami-halisi", title: "Seccadeli Polipropilen Cami Halısı", image: "/images/cami-katalog-12.png", desen: "Seccadeli", colors: COMMON_COLORS },
  ],
  "polyamid-cami-halisi": [
    { slug: "polyamid-cami-halisi", title: "Polyamid Cami Halısı", image: "/images/cami-katalog-13.png", desen: "Standart", colors: COMMON_COLORS, badge: "Profesyonel" },
    { slug: "safli-polyamid-cami-halisi", title: "Saflı Polyamid Cami Halısı", image: "/images/cami-katalog-14.png", desen: "Saflı", colors: COMMON_COLORS },
    { slug: "gobekli-polyamid-cami-halisi", title: "Göbekli Polyamid Cami Halısı", image: "/images/cami-katalog-15.png", desen: "Göbekli", colors: COMMON_COLORS },
    { slug: "seccadeli-polyamid-cami-halisi", title: "Seccadeli Polyamid Cami Halısı", image: "/images/cami-katalog-16.png", desen: "Seccadeli", colors: COMMON_COLORS },
  ],
  "ozel-desen-axminster-cami-halisi": [
    { slug: "ozel-desen-axminster-cami-halisi", title: "Özel Desen Axminster Cami Halısı", image: "/images/cami-katalog-17.png", desen: "Özel", colors: [...COMMON_COLORS, ...NATURAL_COLORS], badge: "Özel Sipariş" },
  ],
};

const CATEGORIES: Record<string, CategoryBaseData> = {
  "akrilik-cami-halisi": {
    slug: "akrilik-cami-halisi",
    image: "/images/cami-1.png",
    heroImage: "/images/cami-hero.png",
    color: "#0097A7",
    relatedSlugs: ["yun-cami-halisi","polipropilen-cami-halisi","polyamid-cami-halisi"],
  },
  "yun-cami-halisi": {
    slug: "yun-cami-halisi",
    image: "/images/cami-2.png",
    heroImage: "/images/cami-hero.png",
    color: "#0097A7",
    relatedSlugs: ["akrilik-cami-halisi","polyamid-cami-halisi","polipropilen-cami-halisi"],
  },
  "polipropilen-cami-halisi": {
    slug: "polipropilen-cami-halisi",
    image: "/images/cami-3.png",
    heroImage: "/images/cami-hero.png",
    color: "#0097A7",
    relatedSlugs: ["akrilik-cami-halisi","polyamid-cami-halisi","yun-cami-halisi"],
  },
  "polyamid-cami-halisi": {
    slug: "polyamid-cami-halisi",
    image: "/images/cami-4.png",
    heroImage: "/images/cami-hero.png",
    color: "#0097A7",
    relatedSlugs: ["yun-cami-halisi","akrilik-cami-halisi","polipropilen-cami-halisi"],
  },
  "safli-akrilik-cami-halisi": {
    slug: "safli-akrilik-cami-halisi",
    image: "/images/cami-1.png",
    heroImage: "/images/cami-hero.png",
    color: "#0097A7",
    relatedSlugs: ["gobekli-akrilik-cami-halisi","seccadeli-akrilik-cami-halisi","akrilik-cami-halisi"],
  },
  "gobekli-akrilik-cami-halisi": {
    slug: "gobekli-akrilik-cami-halisi",
    image: "/images/cami-2.png",
    heroImage: "/images/cami-hero.png",
    color: "#0097A7",
    relatedSlugs: ["safli-akrilik-cami-halisi","seccadeli-akrilik-cami-halisi","akrilik-cami-halisi"],
  },
  "seccadeli-akrilik-cami-halisi": {
    slug: "seccadeli-akrilik-cami-halisi",
    image: "/images/cami-3.png",
    heroImage: "/images/cami-hero.png",
    color: "#0097A7",
    relatedSlugs: ["safli-akrilik-cami-halisi","gobekli-akrilik-cami-halisi","akrilik-cami-halisi"],
  },
  "safli-yun-cami-halisi": {
    slug: "safli-yun-cami-halisi",
    image: "/images/cami-2.png",
    heroImage: "/images/cami-hero.png",
    color: "#0097A7",
    relatedSlugs: ["gobekli-yun-cami-halisi","seccadeli-yun-cami-halisi","yun-cami-halisi"],
  },
  "gobekli-yun-cami-halisi": {
    slug: "gobekli-yun-cami-halisi",
    image: "/images/cami-2.png",
    heroImage: "/images/cami-hero.png",
    color: "#0097A7",
    relatedSlugs: ["safli-yun-cami-halisi","seccadeli-yun-cami-halisi","yun-cami-halisi"],
  },
  "seccadeli-yun-cami-halisi": {
    slug: "seccadeli-yun-cami-halisi",
    image: "/images/cami-2.png",
    heroImage: "/images/cami-hero.png",
    color: "#0097A7",
    relatedSlugs: ["safli-yun-cami-halisi","gobekli-yun-cami-halisi","yun-cami-halisi"],
  },
  "safli-polipropilen-cami-halisi": {
    slug: "safli-polipropilen-cami-halisi",
    image: "/images/cami-3.png",
    heroImage: "/images/cami-hero.png",
    color: "#0097A7",
    relatedSlugs: ["gobekli-polipropilen-cami-halisi","polipropilen-cami-halisi","akrilik-cami-halisi"],
  },
  "gobekli-polipropilen-cami-halisi": {
    slug: "gobekli-polipropilen-cami-halisi",
    image: "/images/cami-3.png",
    heroImage: "/images/cami-hero.png",
    color: "#0097A7",
    relatedSlugs: ["safli-polipropilen-cami-halisi","seccadeli-polipropilen-cami-halisi","polipropilen-cami-halisi"],
  },
  "seccadeli-polipropilen-cami-halisi": {
    slug: "seccadeli-polipropilen-cami-halisi",
    image: "/images/cami-3.png",
    heroImage: "/images/cami-hero.png",
    color: "#0097A7",
    relatedSlugs: ["safli-polipropilen-cami-halisi","gobekli-polipropilen-cami-halisi","polipropilen-cami-halisi"],
  },
  "safli-polyamid-cami-halisi": {
    slug: "safli-polyamid-cami-halisi",
    image: "/images/cami-4.png",
    heroImage: "/images/cami-hero.png",
    color: "#0097A7",
    relatedSlugs: ["gobekli-polyamid-cami-halisi","seccadeli-polyamid-cami-halisi","polyamid-cami-halisi"],
  },
  "gobekli-polyamid-cami-halisi": {
    slug: "gobekli-polyamid-cami-halisi",
    image: "/images/cami-4.png",
    heroImage: "/images/cami-hero.png",
    color: "#0097A7",
    relatedSlugs: ["safli-polyamid-cami-halisi","seccadeli-polyamid-cami-halisi","polyamid-cami-halisi"],
  },
  "seccadeli-polyamid-cami-halisi": {
    slug: "seccadeli-polyamid-cami-halisi",
    image: "/images/cami-4.png",
    heroImage: "/images/cami-hero.png",
    color: "#0097A7",
    relatedSlugs: ["safli-polyamid-cami-halisi","gobekli-polyamid-cami-halisi","polyamid-cami-halisi"],
  },
  "ozel-desen-axminster-cami-halisi": {
    slug: "ozel-desen-axminster-cami-halisi",
    image: "/images/cami-hero.png",
    heroImage: "/images/cami-hero.png",
    color: "#C9972B",
    relatedSlugs: ["yun-cami-halisi","polyamid-cami-halisi","gobekli-yun-cami-halisi"],
  },
  "kaucuk-cami-halisi-altligi": {
    slug: "kaucuk-cami-halisi-altligi",
    image: "/images/cami-5.png",
    heroImage: "/images/cami-hero.png",
    color: "#0097A7",
    relatedSlugs: ["tredmor-berber-supreme","kece-cami-halisi-altligi","akrilik-cami-halisi"],
  },
  "tredmor-berber-supreme": {
    slug: "tredmor-berber-supreme",
    image: "/images/cami-5.png",
    heroImage: "/images/cami-hero.png",
    color: "#C9972B",
    relatedSlugs: ["kaucuk-cami-halisi-altligi","kece-cami-halisi-altligi","600-cami-halisi-kecesi"],
  },
  "kece-cami-halisi-altligi": {
    slug: "kece-cami-halisi-altligi",
    image: "/images/cami-6.png",
    heroImage: "/images/cami-hero.png",
    color: "#0097A7",
    relatedSlugs: ["600-cami-halisi-kecesi","1000-cami-halisi-kecesi","1200-cami-halisi-kecesi"],
  },
  "600-cami-halisi-kecesi": {
    slug: "600-cami-halisi-kecesi",
    image: "/images/cami-6.png",
    heroImage: "/images/cami-hero.png",
    color: "#0097A7",
    relatedSlugs: ["1000-cami-halisi-kecesi","1200-cami-halisi-kecesi","kece-cami-halisi-altligi"],
  },
  "1000-cami-halisi-kecesi": {
    slug: "1000-cami-halisi-kecesi",
    image: "/images/cami-7.png",
    heroImage: "/images/cami-hero.png",
    color: "#0097A7",
    relatedSlugs: ["600-cami-halisi-kecesi","1200-cami-halisi-kecesi","kece-cami-halisi-altligi"],
  },
  "1200-cami-halisi-kecesi": {
    slug: "1200-cami-halisi-kecesi",
    image: "/images/cami-8.png",
    heroImage: "/images/cami-hero.png",
    color: "#0097A7",
    relatedSlugs: ["600-cami-halisi-kecesi","1000-cami-halisi-kecesi","kece-cami-halisi-altligi"],
  },
  "stok-cami-halisi": {
    slug: "stok-cami-halisi",
    image: "/images/cami-1.png",
    heroImage: "/images/cami-hero.png",
    color: "#0097A7",
    relatedSlugs: ["akrilik-cami-halisi","yun-cami-halisi","polipropilen-cami-halisi"],
  },
  "cami-halisi": {
    slug: "cami-halisi",
    image: "/images/cami-hero.png",
    heroImage: "/images/cami-hero.png",
    color: "#C9972B",
    relatedSlugs: [],
  },
};

const CATEGORY_NAMES: Record<string, string> = {
  "cami-halisi": "Cami Halısı Modelleri",
  "stok-cami-halisi": "Stok Cami Halısı",
  "akrilik-cami-halisi": "Akrilik Cami Halısı",
  "yun-cami-halisi": "Yün Cami Halısı",
  "polipropilen-cami-halisi": "Polipropilen Cami Halısı",
  "polyamid-cami-halisi": "Polyamid Cami Halısı",
  "safli-akrilik-cami-halisi": "Saflı Akrilik Cami Halısı",
  "gobekli-akrilik-cami-halisi": "Göbekli Akrilik Cami Halısı",
  "seccadeli-akrilik-cami-halisi": "Seccadeli Akrilik Cami Halısı",
  "safli-yun-cami-halisi": "Saflı Yün Cami Halısı",
  "gobekli-yun-cami-halisi": "Göbekli Yün Cami Halısı",
  "seccadeli-yun-cami-halisi": "Seccadeli Yün Cami Halısı",
  "safli-polipropilen-cami-halisi": "Saflı Polipropilen Cami Halısı",
  "gobekli-polipropilen-cami-halisi": "Göbekli Polipropilen Cami Halısı",
  "seccadeli-polipropilen-cami-halisi": "Seccadeli Polipropilen Cami Halısı",
  "safli-polyamid-cami-halisi": "Saflı Polyamid Cami Halısı",
  "gobekli-polyamid-cami-halisi": "Göbekli Polyamid Cami Halısı",
  "seccadeli-polyamid-cami-halisi": "Seccadeli Polyamid Cami Halısı",
  "ozel-desen-axminster-cami-halisi": "Özel Desen & Axminster",
  "kaucuk-cami-halisi-altligi": "Kauçuk Cami Halısı Altlığı",
  "tredmor-berber-supreme": "TredMOR™ Berber Supreme",
  "kece-cami-halisi-altligi": "Keçe Cami Halısı Altlığı",
  "600-cami-halisi-kecesi": "600 gr/m² Keçe Altlık",
  "1000-cami-halisi-kecesi": "1000 gr/m² Keçe Altlık",
  "1200-cami-halisi-kecesi": "1200 gr/m² Keçe Altlık",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const cat = CATEGORIES[slug];
  if (!cat) return { title: "Kategori bulunamadı" };
  const t = await getTranslations({ locale, namespace: `categoryData.${slug}` });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${SITE_URL}/kategori/${slug}`,
      languages: {
        "tr": `${SITE_URL}/kategori/${slug}`,
        "en": `${SITE_URL}/en/kategori/${slug}`,
        "ar": `${SITE_URL}/ar/kategori/${slug}`,
        "fr": `${SITE_URL}/fr/kategori/${slug}`,
        "x-default": `${SITE_URL}/kategori/${slug}`,
      },
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      images: [{ url: `${SITE_URL}${cat.image}`, width: 1200, height: 630 }],
    },
  };
}

export function generateStaticParams() {
  return Object.keys(CATEGORIES).flatMap((slug) =>
    ["tr", "en", "ar", "fr", "de", "ru"].map((locale) => ({ locale, slug }))
  );
}

export default async function KategoriPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const cat = CATEGORIES[slug];
  if (!cat) notFound();

  let dbCatalogItems: any[] = [];
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const row = await prisma.setting.findUnique({ where: { key: "catalog_items" } });
    if (row && row.value) {
      dbCatalogItems = JSON.parse(row.value);
    }
  } catch (err) {
    console.error("Failed to load catalog items:", err);
  }
  
  const t = await getTranslations({ locale, namespace: `categoryData.${slug}` });
  const tPage = await getTranslations({ locale, namespace: "categoryPage" });
  const tNames = await getTranslations({ locale, namespace: "categoryNames" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const prefix = locale === "tr" ? "" : `/${locale}`;

  // Use mapped catalog image for hero, or fallback to default
  const heroImage = CATEGORY_IMAGES[slug] || cat.heroImage;

  // JSON-LD: Product + BreadcrumbList
  const productLD = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: t("title"),
    description: t("description"),
    image: `${SITE_URL}${cat.image}`,
    brand: {
      "@type": "Brand",
      name: "Asil Halı A.Ş.",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Asil Halı A.Ş.",
      url: "https://www.asilhali.com.tr",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Asil Halı A.Ş.",
      },
      priceCurrency: "TRY",
      priceSpecification: {
        "@type": "PriceSpecification",
        description: tPage("getQuoteDesc"),
      },
    },
  };

  const breadcrumbLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tNav("home"), item: SITE_URL },
      { "@type": "ListItem", position: 2, name: tNav("products"), item: `${SITE_URL}/kategori` },
      { "@type": "ListItem", position: 3, name: t("title"), item: `${SITE_URL}/kategori/${slug}` },
    ],
  };

  const faqLD = (t.raw("faqs") as {question: string, answer: string}[]).length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: (t.raw("faqs") as {question: string, answer: string}[]).map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }} />
      {faqLD && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />}

      <Navigation locale={locale} />

      <main id="main-content">
        {/* ── Hero Bölümü ── */}
        <section className="relative h-[60vh] min-h-[400px] max-h-[600px] flex items-end overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={heroImage}
              alt={t("title")}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#003B40]/95 via-[#003B40]/50 to-transparent" />

          <div className="relative z-20 container-site pb-12 w-full">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-4" aria-label="Breadcrumb">
              <Link href={`${prefix}/`} className="hover:text-white transition-colors">{tNav("home")}</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white/60">{tNav("products")}</span>
              {slug !== "cami-halisi" && (
                <>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-[#E4B84A]">{t("shortTitle") || CATEGORY_NAMES[slug]}</span>
                </>
              )}
            </nav>

            {slug !== "cami-halisi" && (
              <span className="badge bg-[#C9972B]/20 text-[#E4B84A] border border-[#C9972B]/30 mb-3">
                {t("badge") || "Premium"}
              </span>
            )}
            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {slug === "cami-halisi" ? tPage("allModelsTitle") : t("title")}
            </h1>
            <p className="text-lg text-white/80 max-w-2xl">
              {slug === "cami-halisi" 
                ? tPage("allModelsDesc") 
                : t("description")}
            </p>
          </div>
        </section>

        {/* ── Cami Halısı Ana Sayfası (4 Kategori Gösterimi) ── */}
        {slug === "cami-halisi" ? (
          <section className="py-16 bg-[#F0FDFE]">
            <div className="container-site">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#0097A7] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {tPage("selectType")}
                </h2>
                <div className="gold-line mx-auto mb-4" />
                <p className="text-[#6B6355]">{tPage("selectTypeDesc")}</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { id: "akrilik", titleKey: "matAcrylic" as const, descKey: "matAcrylicDesc" as const, link: "akrilik-cami-halisi", img: "/images/cami-katalog-01.png" },
                  { id: "yun", titleKey: "matWool" as const, descKey: "matWoolDesc" as const, link: "yun-cami-halisi", img: "/images/cami-katalog-05.png" },
                  { id: "polipropilen", titleKey: "matPP" as const, descKey: "matPPDesc" as const, link: "polipropilen-cami-halisi", img: "/images/cami-katalog-09.png" },
                  { id: "stok", titleKey: "matStock" as const, descKey: "matStockDesc" as const, link: "stok-cami-halisi", img: "/images/cami-katalog-02.png" }
                ].map((item) => (
                  <Link key={item.id} href={`${prefix}/kategori/${item.link}`} className="group bg-white rounded-2xl border border-[#B2EBF2] overflow-hidden hover:border-[#C9972B]/40 hover:shadow-xl transition-all">
                    <div className="relative h-64 bg-slate-100 overflow-hidden">
                      <Image src={item.img} alt={tPage(item.titleKey)} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <h3 className="absolute bottom-4 left-4 right-4 text-white font-bold text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {tPage(item.titleKey)}
                      </h3>
                    </div>
                    <div className="p-5 flex items-center justify-between">
                      <p className="text-sm text-[#6B6355]">{tPage(item.descKey)}</p>
                      <div className="w-8 h-8 rounded-full bg-[#0097A7]/10 flex items-center justify-center text-[#0097A7] group-hover:bg-[#0097A7] group-hover:text-white transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* ── Ürün Çeşitleri & Filtreler ── */}
        {dbCatalogItems.filter(i => i.categorySlug === slug).length > 0 ? (
          <section className="py-12 bg-white border-b border-[#E0F7FA]">
            <div className="container-site">
              <div className="mb-8">
                <h2
                  className="text-2xl font-bold text-[#0097A7] mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {tPage("varieties", { title: t("title") })}
                </h2>
                <p className="text-sm text-[#6B6355]">
                  {tPage("varietiesSubtitle")}
                </p>
              </div>
              <CategoryFiltersClient prefix={prefix} items={dbCatalogItems.filter(i => i.categorySlug === slug)} />
            </div>
          </section>
        ) : CATALOG_DATA[slug] && (
          <section className="py-12 bg-white border-b border-[#E0F7FA]">
            <div className="container-site">
              <div className="mb-8">
                <h2
                  className="text-2xl font-bold text-[#0097A7] mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {tPage("varieties", { title: t("title") })}
                </h2>
                <p className="text-sm text-[#6B6355]">
                  {tPage("varietiesSubtitle")}
                </p>
              </div>
              <CategoryFiltersClient prefix={prefix} items={CATALOG_DATA[slug] as any} />
            </div>
          </section>
        )}

        {/* ── Saflı Akrilik Desen Galerisi ── */}
        {DESEN_GALERISI_SLUGS.has(slug) && (
          <section className="py-14 bg-[#F0FDFE] border-b border-[#E0F7FA]">
            <div className="container-site">
              <DesenGalerisi
                prefix={prefix}
                title={tPage("desenGalerisiTitle")}
                subtitle={tPage("desenGalerisiDesc")}
                categorySlug={slug}
                locale={locale}
                items={SAFLI_AKRILIK_DESENLER.map(d => ({
                  id: d.id,
                  image: d.image,
                  name: locale === "en" ? d.nameEn : locale === "ar" ? d.nameAr : d.name,
                  altText: locale === "en" ? d.altTextEn : locale === "ar" ? d.altTextAr : d.altText,
                  category: d.category,
                }))}
              />
            </div>
          </section>
        )}

        {slug === "akrilik-cami-halisi" && <ProductDatasheets locale={locale} />}

        {/* ── İçerik ── */}
        <section className="section bg-[#F0FDFE]">
          <div className="container-site">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Sol: Detay */}
              <div className="lg:col-span-2 space-y-10">
                {/* Uzun Açıklama */}
                <div>
                  <h2 className="section-title mb-4">{tPage("aboutTitle", { title: t("title") })}</h2>
                  <div className="gold-line mb-6" />
                  <div className="prose prose-sm max-w-none text-[#6B6355] leading-relaxed space-y-4">
                    {t("longDescription").trim().split("\n\n").map((para, i) => (
                      <p key={i}>{para.trim()}</p>
                    ))}
                  </div>
                </div>

                {/* Avantajlar */}
                <div>
                  <h2
                    className="text-2xl font-bold text-[#0097A7] mb-5"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {tPage("advantages")}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {(t.raw("advantages") as string[]).map((adv, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#B2EBF2]">
                        <div className="w-5 h-5 rounded-full bg-[#0097A7]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-[#0097A7]" aria-hidden="true" />
                        </div>
                        <span className="text-sm text-[#1A1A1A] leading-snug">{adv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Kullanım Alanları */}
                <div>
                  <h2
                    className="text-2xl font-bold text-[#0097A7] mb-5"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {tPage("useCases")}
                  </h2>
                  <ul className="space-y-2.5">
                    {(t.raw("useCases") as string[]).map((uc, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm text-[#6B6355]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9972B] flex-shrink-0" />
                        {uc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sağ: Teknik Özellikler + CTA */}
              <div className="space-y-6">
                {/* Teknik Kart */}
                <div className="bg-white rounded-2xl border border-[#B2EBF2] overflow-hidden">
                  <div
                    className="p-5"
                    style={{ background: `${cat.color}12`, borderBottom: `1px solid ${cat.color}20` }}
                  >
                    <h3
                      className="font-bold text-[#0097A7] text-lg"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {tPage("specs")}
                    </h3>
                  </div>
                  <div className="divide-y divide-[#E0F7FA]">
                    {(t.raw("specs") as {label: string, value: string}[]).map((spec, i) => (
                      <div key={i} className="flex items-start justify-between gap-4 px-5 py-3.5">
                        <span className="text-xs text-[#6B6355] font-medium">{spec.label}</span>
                        <span className="text-xs text-[#1A1A1A] font-semibold text-right">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Teklif CTA Kartı */}
                <div className="bg-[#0097A7] rounded-2xl p-6 text-white">
                  <h3
                    className="text-xl font-bold text-white mb-2"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {tPage("getQuote")}
                  </h3>
                  <p className="text-sm text-white/70 mb-5 leading-relaxed">
                    {tPage("getQuoteDesc")}
                  </p>
                  <a
                    href={kategoriTrackedUrl(slug)}
                    target="_blank"
                    rel="noopener"
                    className="btn btn-gold w-full justify-center text-sm"
                  >
                    {tPage("quoteBtn")}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="tel:+905323467939"
                    className="btn btn-outline w-full justify-center text-sm mt-3"
                  >
                    {tPage("callBtn")}
                  </a>
                </div>

                {/* İlgili Kategoriler */}
                <div className="bg-[#F0FDFE] rounded-2xl border border-[#B2EBF2] p-5">
                  <h3
                    className="font-bold text-[#0097A7] mb-4"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {tPage("otherCategories")}
                  </h3>
                  <div className="space-y-2">
                    {cat.relatedSlugs.map((rel) => (
                      <Link
                        key={rel}
                        href={`${prefix}/kategori/${rel}`}
                        className="flex items-center justify-between px-4 py-2.5 bg-white rounded-xl border border-[#B2EBF2] hover:border-[#C9972B]/40 hover:shadow-sm transition-all text-sm font-medium text-[#1A1A1A] hover:text-[#0097A7]"
                      >
                        {tNames(rel)}
                        <ArrowRight className="w-3.5 h-3.5 text-[#C9972B]" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SSS */}
        <FAQSection faqs={(t.raw("faqs") as {question: string, answer: string}[])} title={tPage("faqTitle", { title: t("title") })} />

        <CTASection
          variant="green"
          title={tPage("ctaTitle", { title: t("title") })}
          subtitle={tPage("ctaSubtitle")}
        />
        </>
        )}
      </main>

      <Footer locale={locale} />
    </>
  );
}

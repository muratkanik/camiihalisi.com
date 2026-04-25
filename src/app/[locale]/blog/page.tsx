import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, ChevronRight } from "lucide-react";

import Navigation from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import CTASection from "@/components/blocks/CTASection";
import { BLOG_POSTS, BLOG_CATEGORIES, loadDynamicBlogPosts, type BlogPost } from "@/lib/blog-data";
import NewBadge from "@/components/NewBadge";

export const dynamic = "force-dynamic"; // Dinamik yazılar her request'te güncel gelsin

const SITE_URL = "https://camiihalisi.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    tr: "Cami Halısı Makaleleri | Rehber, Bakım ve Teknik Bilgiler – Asil Halı",
    en: "Mosque Carpet Articles | Guides, Maintenance and Technical Info – Asil Hali",
    ar: "مقالات سجاجيد المساجد | أدلة ونصائح صيانة – أصيل هالي",
    fr: "Articles sur les Tapis de Mosquée | Guides et Conseils – Asil Hali",
    de: "Moscheeteppich Ratgeber | Pflege, Auswahl und Technik – Asil Hali",
  };
  const descs: Record<string, string> = {
    tr: "Cami halısı hakkında kapsamlı makaleler: seçim rehberi, bakım ipuçları, malzeme karşılaştırmaları.",
    en: "Comprehensive articles about mosque carpets: selection guide, maintenance tips, material comparisons.",
    ar: "مقالات شاملة حول سجاجيد المساجد: دليل الاختيار، نصائح الصيانة، مقارنات المواد.",
    fr: "Articles complets sur les tapis de mosquée: guide de sélection, conseils d'entretien, comparaisons de matériaux.",
    de: "Umfassende Ratgeber zu Moscheeteppichen: Auswahl, Pflege und Materialvergleiche.",
  };
  return {
    title: titles[locale] ?? titles.tr,
    description: descs[locale] ?? descs.tr,
    alternates: {
      canonical: locale === "tr" ? `${SITE_URL}/blog` : `${SITE_URL}/${locale}/blog`,
      languages: {
        "tr": `${SITE_URL}/blog`,
        "en": `${SITE_URL}/en/blog`,
        "ar": `${SITE_URL}/ar/blog`,
        "fr": `${SITE_URL}/fr/blog`,
        "de": `${SITE_URL}/de/blog`,
        "x-default": `${SITE_URL}/blog`,
      },
    },
  };
}

/** Load blog_translations from DB for a given locale */
async function loadBlogTranslations(locale: string): Promise<Record<string, { title?: string; excerpt?: string }>> {
  if (locale === "tr") return {};
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const row = await prisma.setting
      .findUnique({ where: { key: "blog_translations" } })
      .finally(() => prisma.$disconnect());
    if (!row) return {};
    const all = JSON.parse(row.value) as Record<string, Record<string, Record<string, string>>>;
    const result: Record<string, { title?: string; excerpt?: string }> = {};
    for (const [slug, locales] of Object.entries(all)) {
      const lt = locales[locale];
      if (lt) result[slug] = { title: lt.title, excerpt: lt.excerpt };
    }
    return result;
  } catch {
    return {};
  }
}

export default async function BlogListePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const prefix = locale === "tr" ? "" : `/${locale}`;

  const [t, blogT, translations, dynamicPosts] = await Promise.all([
    getTranslations("blog"),
    getTranslations("common"),
    loadBlogTranslations(locale),
    loadDynamicBlogPosts(),
  ]);

  const breadcrumbLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: t("title"), item: `${SITE_URL}/blog` },
    ],
  };

  // Statik + dinamik yazıları birleştir (dinamik önce, sonra statik)
  const staticPublished = BLOG_POSTS.filter((p) => (p.status ?? "published") === "published");
  const dynamicPublished = dynamicPosts.filter(
    (p) => (p.status ?? "published") === "published" && !staticPublished.some((s) => s.slug === p.slug)
  );
  const publishedPosts: BlogPost[] = [...dynamicPublished, ...staticPublished];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }} />

      <Navigation locale={locale} />

      <main id="main-content">
        {/* ── Başlık Bandı ── */}
        <section className="bg-[#0097A7] py-16 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C9972B' fill-opacity='1'%3E%3Cpath d='M30 0l7 12.1h14v14l12.1 7-12.1 7v14h-14L30 60l-7-12.1H9v-14L-3.1 27l12.1-7v-14h14z'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          />
          <div className="container-site relative z-10">
            <nav className="flex items-center gap-2 text-sm text-white/50 mb-6" aria-label="Breadcrumb">
              <Link href={`${prefix}/`} className="hover:text-white transition-colors">
                {blogT("backHome").replace("Ana Sayfaya Dön", "Ana Sayfa")}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#E4B84A]">{t("title")}</span>
            </nav>
            <span className="badge bg-[#C9972B]/20 text-[#E4B84A] border border-[#C9972B]/30 mb-4">
              {t("badge")}
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {t("sectionTitle")}
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              {t("subtitle")}
            </p>
          </div>
        </section>

        {/* ── Makale Listesi ── */}
        <section className="section bg-[#F0FDFE]">
          <div className="container-site">
            {/* Kategori Filtreleri */}
            <div className="flex flex-wrap gap-2 mb-10">
              {BLOG_CATEGORIES.map((cat) => (
                <span
                  key={cat}
                  className={`px-4 py-2 rounded-full text-sm font-medium border ${
                    cat === "Tümü"
                      ? "bg-[#0097A7] text-white border-[#0097A7]"
                      : "bg-white text-[#6B6355] border-[#B2EBF2]"
                  }`}
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedPosts.map((post) => {
                const trans = translations[post.slug];
                const displayTitle = trans?.title ?? post.title;
                const displayExcerpt = trans?.excerpt ?? post.excerpt;
                return (
                  <Link
                    key={post.slug}
                    href={`${prefix}/blog/${post.slug}`}
                    className="group card flex flex-col"
                  >
                    <div className="relative h-48 overflow-hidden bg-[#E0F7FA]">
                      <Image
                        src={post.image}
                        alt={displayTitle}
                        fill
                        sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute top-3 left-3 badge badge-gold text-xs">
                        {post.category}
                      </span>
                      {post.createdAt && (
                        <NewBadge createdAt={post.createdAt} durationMs={4 * 60 * 1000} />
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h2
                        className="font-bold text-[#1A1A1A] mb-2 leading-snug group-hover:text-[#0097A7] transition-colors"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}
                      >
                        {displayTitle}
                      </h2>
                      <p className="text-xs text-[#6B6355] leading-relaxed mb-4 flex-1">
                        {displayExcerpt}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 bg-[#E0F7FA] text-[#6B6355] rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#E0F7FA]">
                        <div className="flex items-center gap-1.5 text-xs text-[#6B6355]">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </div>
                        <span className="flex items-center gap-1 text-xs text-[#0097A7] font-semibold group-hover:text-[#C9972B] transition-colors">
                          {t("read")}
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <CTASection variant="green" />
      </main>

      <Footer locale={locale} />
    </>
  );
}

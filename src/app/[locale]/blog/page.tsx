import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Clock, ArrowRight, ChevronRight } from "lucide-react";

import Navigation from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import CTASection from "@/components/blocks/CTASection";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/blog-data";

const SITE_URL = "https://camiihalisi.com";

export const metadata: Metadata = {
  title: "Cami Halısı Makaleleri | Rehber, Bakım ve Teknik Bilgiler – Asil Halı",
  description:
    "Cami halısı hakkında kapsamlı makaleler: seçim rehberi, bakım ipuçları, malzeme karşılaştırmaları, fiyat analizi ve teknik bilgiler.",
  alternates: { canonical: `${SITE_URL}/blog` },
};

export default async function BlogListePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const prefix = locale === "tr" ? "" : `/${locale}`;

  const breadcrumbLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Makaleler", item: `${SITE_URL}/blog` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }}
      />

      <Navigation locale={locale} />

      <main id="main-content">
        {/* ── Başlık Bandı ── */}
        <section className="bg-[#006064] py-16 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C9972B' fill-opacity='1'%3E%3Cpath d='M30 0l7 12.1h14v14l12.1 7-12.1 7v14h-14L30 60l-7-12.1H9v-14L-3.1 27l12.1-7v-14h14z'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          />
          <div className="container-site relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/50 mb-6" aria-label="Breadcrumb">
              <Link href={`${prefix}/`} className="hover:text-white transition-colors">Ana Sayfa</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#E4B84A]">Makaleler</span>
            </nav>
            <span className="badge bg-[#C9972B]/20 text-[#E4B84A] border border-[#C9972B]/30 mb-4">
              Bilgi Merkezi
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Cami Halısı Rehberleri
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              Seçim rehberinden bakım ipuçlarına, teknik bilgilerden fiyat analizine kadar cami
              halısı hakkında bilmeniz gereken her şey.
            </p>
          </div>
        </section>

        {/* ── Makale Listesi ── */}
        <section className="section bg-[#F0FDFE]">
          <div className="container-site">
            {/* Kategori Filtreleri */}
            <div className="flex flex-wrap gap-2 mb-10">
              {BLOG_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                    cat === "Tümü"
                      ? "bg-[#006064] text-white border-[#006064]"
                      : "bg-white text-[#6B6355] border-[#B2EBF2] hover:border-[#C9972B]/50 hover:text-[#006064]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BLOG_POSTS.filter((post) => (post.status ?? "published") === "published").map((post) => (
                <Link
                  key={post.slug}
                  href={`${prefix}/blog/${post.slug}`}
                  className="group card flex flex-col"
                >
                  {/* Görsel */}
                  <div className="relative h-48 overflow-hidden bg-[#E0F7FA]">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute top-3 left-3 badge badge-gold text-xs">
                      {post.category}
                    </span>
                  </div>

                  {/* İçerik */}
                  <div className="p-5 flex flex-col flex-1">
                    <h2
                      className="font-bold text-[#1A1A1A] mb-2 leading-snug group-hover:text-[#006064] transition-colors"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}
                    >
                      {post.title}
                    </h2>
                    <p className="text-xs text-[#6B6355] leading-relaxed mb-4 flex-1">
                      {post.excerpt}
                    </p>

                    {/* Etiketler */}
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
                      <span className="flex items-center gap-1 text-xs text-[#006064] font-semibold group-hover:text-[#C9972B] transition-colors">
                        Oku
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <CTASection
          variant="green"
          title="Aklınızda Soru mu Var?"
          subtitle="Asil Halı uzmanları cami halısı konusunda sorularınızı yanıtlamak için hazır. Ücretsiz danışmanlık için hemen iletişime geçin."
        />
      </main>

      <Footer locale={locale} />
    </>
  );
}

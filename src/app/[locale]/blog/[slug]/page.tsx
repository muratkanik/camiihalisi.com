import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Clock, ChevronRight, ArrowLeft, Tag } from "lucide-react";

import Navigation from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import CTASection from "@/components/blocks/CTASection";
import { getBlogPost, getRelatedPosts, BLOG_POSTS } from "@/lib/blog-data";
import { loadLinkMap, applyLinks } from "@/lib/internal-links";

const SITE_URL = "https://camiihalisi.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Makale bulunamadı" };

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    authors: [{ name: post.author }],
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.metaTitle,
      description: post.metaDescription,
      images: [{ url: `${SITE_URL}${post.image}` }],
      publishedTime: post.publishedAt,
    },
  };
}

export function generateStaticParams() {
  return BLOG_POSTS.flatMap((post) =>
    ["tr", "en", "ar", "fr"].map((locale) => ({ locale, slug: post.slug }))
  );
}

// renderMarkdown is kept for future use but not called directly
function renderMarkdown(_content: string): string { return _content; }

export default async function BlogDetayPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug);
  const prefix = locale === "tr" ? "" : `/${locale}`;

  const articleLD = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: `${SITE_URL}${post.image}`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author,
      url: "https://www.asilhali.com.tr",
    },
    publisher: {
      "@type": "Organization",
      name: "Asil Halı A.Ş.",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/cami-hero.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${slug}` },
    keywords: post.tags.join(", "),
  };

  const breadcrumbLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Makaleler", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${slug}` },
    ],
  };

  // Load internal link map — auto-link keywords in content
  const linkMap = await loadLinkMap();

  const paragraphs = post.content.split('\n\n').filter(Boolean);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }} />

      <Navigation locale={locale} />

      <main id="main-content">
        {/* ── Hero ── */}
        <section className="relative h-[50vh] min-h-[360px] max-h-[500px] flex items-end overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#003B40]/95 via-[#003B40]/60 to-transparent" />
          <div className="relative z-20 container-site pb-10 w-full">
            <nav className="flex items-center gap-2 text-sm text-white/50 mb-4" aria-label="Breadcrumb">
              <Link href={`${prefix}/`} className="hover:text-white transition-colors">Ana Sayfa</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href={`${prefix}/blog`} className="hover:text-white transition-colors">Makaleler</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#E4B84A] truncate max-w-[200px]">{post.title}</span>
            </nav>
            <span className="badge bg-[#C9972B]/20 text-[#E4B84A] border border-[#C9972B]/30 mb-3">
              {post.category}
            </span>
            <h1
              className="text-3xl md:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {post.title}
            </h1>
          </div>
        </section>

        {/* ── İçerik ── */}
        <section className="section bg-[#F0FDFE]">
          <div className="container-site">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Sol: Makale */}
              <article className="lg:col-span-2">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-[#B2EBF2]">
                  <div className="flex items-center gap-1.5 text-sm text-[#6B6355]">
                    <Clock className="w-4 h-4 text-[#C9972B]" />
                    {post.readTime} okuma
                  </div>
                  <div className="text-sm text-[#6B6355]">
                    {new Date(post.publishedAt).toLocaleDateString("tr-TR", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </div>
                  <div className="text-sm text-[#6B6355]">
                    Yazan: <span className="font-medium text-[#006064]">{post.author}</span>
                  </div>
                </div>

                {/* Özet */}
                <p className="text-lg text-[#6B6355] leading-relaxed mb-8 border-l-4 border-[#C9972B] pl-4 italic">
                  {post.excerpt}
                </p>

                {/* Makale İçeriği */}
                <div className="prose-content space-y-4 text-[#4A4035] leading-relaxed">
                  {paragraphs.map((para, i) => {
                    if (para.startsWith("## ")) {
                      return (
                        <h2
                          key={i}
                          className="text-2xl font-bold text-[#006064] mt-10 mb-3 pt-6 border-t border-[#E0F7FA]"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                          {para.replace("## ", "")}
                        </h2>
                      );
                    }
                    if (para.startsWith("### ")) {
                      return (
                        <h3
                          key={i}
                          className="text-xl font-bold text-[#006064] mt-6 mb-2"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                          {para.replace("### ", "")}
                        </h3>
                      );
                    }
                    if (para.startsWith("- ") || para.includes("\n- ")) {
                      const items = para.split("\n").filter((l) => l.startsWith("- "));
                      return (
                        <ul key={i} className="space-y-2 my-4">
                          {items.map((item, j) => (
                            <li key={j} className="flex items-start gap-2.5 text-[#4A4035]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C9972B] flex-shrink-0 mt-2" />
                              <span dangerouslySetInnerHTML={{ __html: applyLinks(item.replace("- ", "").replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-[#1A1A1A]">$1</strong>'), linkMap) }} />
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    if (para.includes("| ")) {
                      const rows = para.split("\n").filter((r) => r.includes("|") && !r.includes("---"));
                      return (
                        <div key={i} className="overflow-x-auto my-6 rounded-xl border border-[#B2EBF2]">
                          <table className="w-full text-sm">
                            <tbody>
                              {rows.map((row, j) => {
                                const cells = row.split("|").filter(Boolean).map((c) => c.trim());
                                return (
                                  <tr key={j} className={j === 0 ? "bg-[#006064] text-white font-semibold" : j % 2 === 0 ? "bg-[#F0FDFE]" : "bg-white"}>
                                    {cells.map((cell, k) => (
                                      <td key={k} className="px-4 py-3 border-b border-[#E0F7FA]">{cell}</td>
                                    ))}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    }
                    if (para.startsWith("```")) {
                      const code = para.replace(/```[\w]*\n?/, "").replace(/```$/, "");
                      return (
                        <pre key={i} className="bg-[#006064] text-[#E4B84A] rounded-xl p-5 my-4 text-sm overflow-x-auto">
                          <code>{code}</code>
                        </pre>
                      );
                    }
                    if (para.match(/^\d+\./m)) {
                      const items = para.split("\n").filter((l) => l.match(/^\d+\./));
                      return (
                        <ol key={i} className="space-y-2 my-4 ml-4">
                          {items.map((item, j) => (
                            <li key={j} className="text-[#4A4035] list-decimal ml-2"
                              dangerouslySetInnerHTML={{ __html: applyLinks(item.replace(/^\d+\.\s/, "").replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-[#1A1A1A]">$1</strong>'), linkMap) }}
                            />
                          ))}
                        </ol>
                      );
                    }
                    const paraHtml = applyLinks(
                      para.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-[#1A1A1A]">$1</strong>'),
                      linkMap
                    );
                    return (
                      <p
                        key={i}
                        className="text-[#4A4035] leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: paraHtml }}
                      />
                    );
                  })}
                </div>

                {/* Etiketler */}
                <div className="mt-10 pt-6 border-t border-[#B2EBF2] flex flex-wrap gap-2">
                  <Tag className="w-4 h-4 text-[#C9972B] mt-0.5" />
                  {post.tags.map((tag) => (
                    <span key={tag} className="badge badge-green text-xs normal-case tracking-normal">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Geri dön */}
                <div className="mt-8">
                  <Link
                    href={`${prefix}/blog`}
                    className="inline-flex items-center gap-2 text-sm text-[#006064] font-medium hover:text-[#C9972B] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Tüm Makaleler
                  </Link>
                </div>
              </article>

              {/* Sağ: Sidebar */}
              <aside className="space-y-6">
                {/* CTA Kartı */}
                <div className="bg-[#006064] rounded-2xl p-6 text-white sticky top-24">
                  <h3
                    className="text-xl font-bold text-white mb-2"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Fiyat Teklifi Alın
                  </h3>
                  <p className="text-sm text-white/70 mb-5 leading-relaxed">
                    Caminize özel ücretsiz keşif ve fiyat teklifi için Asil Halı ile iletişime geçin.
                  </p>
                  <a
                    href="/api/r?to=https%3A%2F%2Fwww.asilhali.com.tr%3Futm_source%3Dcamiihalisi%26utm_medium%3Dblog-sidebar&from=blog&label=teklif-al&cat=outbound"
                    target="_blank"
                    rel="noopener"
                    className="btn btn-gold w-full justify-center text-sm"
                  >
                    asilhali.com.tr →
                  </a>
                </div>

                {/* İlgili Makaleler */}
                <div className="bg-white rounded-2xl border border-[#B2EBF2] p-5">
                  <h3
                    className="font-bold text-[#006064] mb-4"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    İlgili Makaleler
                  </h3>
                  <div className="space-y-4">
                    {related.map((rel) => (
                      <Link
                        key={rel.slug}
                        href={`${prefix}/blog/${rel.slug}`}
                        className="flex gap-3 group"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#E0F7FA]">
                          <img
                            src={rel.image}
                            alt={rel.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-medium text-[#1A1A1A] leading-snug group-hover:text-[#006064] transition-colors line-clamp-2"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                          >
                            {rel.title}
                          </p>
                          <span className="text-xs text-[#C9972B] mt-1">{rel.readTime}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Ürün Kategorileri */}
                <div className="bg-[#F0FDFE] rounded-2xl border border-[#B2EBF2] p-5">
                  <h3
                    className="font-bold text-[#006064] mb-4"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Ürün Kategorileri
                  </h3>
                  <div className="space-y-2">
                    {[
                      { slug: "akrilik-cami-halisi", label: "Akrilik Cami Halısı" },
                      { slug: "yun-cami-halisi", label: "Yün Cami Halısı" },
                      { slug: "polipropilen-cami-halisi", label: "Polipropilen Halı" },
                      { slug: "polyamid-cami-halisi", label: "Polyamid Halı" },
                    ].map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`${prefix}/kategori/${cat.slug}`}
                        className="flex items-center justify-between px-4 py-2.5 bg-white rounded-xl border border-[#B2EBF2] hover:border-[#C9972B]/40 text-sm font-medium text-[#1A1A1A] hover:text-[#006064] transition-all"
                      >
                        {cat.label}
                        <ChevronRight className="w-3.5 h-3.5 text-[#C9972B]" />
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <CTASection
          variant="green"
          title="Bu Makaleden Faydalandınız mı?"
          subtitle="Asil Halı uzmanları caminizin halı projesinde size yardımcı olmak için hazır. Ücretsiz keşif ve danışmanlık için hemen iletişime geçin."
        />
      </main>

      <Footer locale={locale} />
    </>
  );
}

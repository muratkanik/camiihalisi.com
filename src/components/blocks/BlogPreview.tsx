import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
}

const FEATURED_POSTS: BlogPost[] = [
  {
    slug: "cami-halisi-nasil-secilir",
    title: "Cami Halısı Nasıl Seçilir? Kapsamlı Rehber",
    excerpt: "Cami halısı seçerken dikkat edilmesi gereken kriterler: malzeme, desen, ölçü ve bütçe planlaması. Uzman önerileriyle doğru seçimi yapın.",
    category: "Rehber",
    readTime: "8",
    image: "/images/cami-5.png",
  },
  {
    slug: "akrilik-vs-yun-cami-halisi",
    title: "Akrilik mi Yün mü? Cami Halısı Karşılaştırması",
    excerpt: "İki popüler cami halısı türünün avantaj ve dezavantajları, fiyat-performans analizi ve hangi cami için hangisi uygun sorusunun yanıtı.",
    category: "Karşılaştırma",
    readTime: "6",
    image: "/images/cami-6.png",
  },
  {
    slug: "cami-halisi-temizligi-ve-bakimi",
    title: "Cami Halısı Temizliği ve Bakımı: Pratik Öneriler",
    excerpt: "Cami halınızın ömrünü uzatmak için yapılması ve yapılmaması gerekenler. Profesyonel temizlik önerileri ve günlük bakım ipuçları.",
    category: "Bakım",
    readTime: "5",
    image: "/images/cami-7.png",
  },
];

interface BlogPreviewProps {
  locale: string;
}

export default async function BlogPreview({ locale }: BlogPreviewProps) {
  const t = await getTranslations("blog");
  const prefix = locale === "tr" ? "" : `/${locale}`;

  return (
    <section className="section bg-white">
      <div className="container-site">
        {/* Başlık */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="badge badge-gold mb-3">{t("badge")}</span>
            <h2 className="section-title">
              {t("sectionTitle")}
            </h2>
            <div className="gold-line mt-3" />
          </div>
          <Link
            href={`${prefix}/blog`}
            className="flex items-center gap-1.5 text-[#006064] font-semibold text-sm hover:text-[#C9972B] transition-colors flex-shrink-0"
          >
            {t("allArticles")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Blog Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`${prefix}/blog/${post.slug}`}
              className="group card flex flex-col"
            >
              <div className="relative h-44 overflow-hidden bg-[#E0F7FA]">
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

              <div className="p-5 flex flex-col flex-1">
                <h3
                  className="font-bold text-[#1A1A1A] mb-2 leading-snug group-hover:text-[#006064] transition-colors"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}
                >
                  {post.title}
                </h3>
                <p className="text-xs text-[#6B6355] leading-relaxed mb-4 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#6B6355]">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    {post.readTime} {t("minRead")}
                  </div>
                  <span className="text-xs text-[#006064] font-semibold group-hover:text-[#C9972B] transition-colors">
                    {t("read")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

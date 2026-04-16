// "Birçok Camide Halılar Neden Erken Yıpranır?" — 3 koyu teal kart
// Veriler blog'dan gelir (category: "Faydalı Bilgiler", subcategory: "Birçok Camide Halılar Neden Erken Yıpranır?")
// Eğer veri yoksa varsayılan kartlar gösterilir.

import Link from "next/link";

export interface ProblemItem {
  title: string;
  desc: string;
  slug?: string;     // blog post slug for "Devamını Oku"
  iconIndex?: number; // 0,1,2 for SVG selection
}

const ICONS = [
  // 0 — Teknik / wrench
  <svg key="wrench" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>,
  // 1 — Zemin / search
  <svg key="search" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <circle cx="17.5" cy="17.5" r="3.5" />
    <path d="m21 21-1.5-1.5" />
  </svg>,
  // 2 — Montaj / shield
  <svg key="shield" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>,
];

const DEFAULT_ITEMS: ProblemItem[] = [
  { title: "Yanlış Teknik Seçim",    desc: "Doğru iplik, yoğunluk ve alt yapı seçilmezse halılar hızla deforme olur.", iconIndex: 0 },
  { title: "Eksik Zemin Analizi",    desc: "Zemin detayları ve kullanım yoğunluğu yanlış analiz edilirse çözümsüz sorunlar kaçınılmaz olur.", iconIndex: 1 },
  { title: "Kalitesiz Montaj Süreci", desc: "Düzensiz ve profesyonel olmayan montaj işlemleri halının ömrünü kısaltır.", iconIndex: 2 },
];

interface ProblemSectionProps {
  items?: ProblemItem[];
  sectionTitle?: string;
  locale?: string;
}

export default function ProblemSection({
  items,
  sectionTitle = "Birçok Camide Halılar Neden Erken Yıpranır?",
  locale = "tr",
}: ProblemSectionProps) {
  const prefix = locale === "tr" ? "" : `/${locale}`;
  const cards = (items && items.length > 0) ? items : DEFAULT_ITEMS;

  return (
    <section className="section bg-white">
      <div className="container-site">
        {/* Başlık */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0D1B1E] leading-tight">
            {sectionTitle}
          </h2>
        </div>

        {/* Kartlar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((p, i) => (
            <div
              key={i}
              className="bg-[#006064] rounded-2xl p-8 flex flex-col gap-5 hover:bg-[#00494D] transition-colors"
            >
              {/* İkon */}
              <div className="text-white/80">{ICONS[(p.iconIndex ?? i) % ICONS.length]}</div>

              {/* Başlık */}
              <h3 className="text-white font-bold text-lg leading-snug">{p.title}</h3>

              {/* Açıklama */}
              <p className="text-white/65 text-sm leading-relaxed">{p.desc}</p>

              {/* Blog linki */}
              {p.slug && (
                <Link
                  href={`${prefix}/blog/${p.slug}`}
                  className="mt-auto text-xs text-white/50 hover:text-white/80 transition-colors underline underline-offset-2"
                >
                  Devamını Oku →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

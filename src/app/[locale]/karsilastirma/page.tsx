import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { ChevronRight, ArrowRight, Scale } from "lucide-react";
import Navigation from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import CTASection from "@/components/blocks/CTASection";

const SITE_URL = "https://camiihalisi.com";

export const metadata: Metadata = {
  title: "Cami Halısı Karşılaştırma Rehberi | Hangi Tür Sizin İçin? – Asil Halı",
  description:
    "Akrilik vs Yün, Polipropilen vs Polyamid — cami halısı türlerini detaylı karşılaştırın. 40 yıllık uzman deneyimiyle doğru seçim rehberi. Asil Halı A.Ş.",
  alternates: { canonical: `${SITE_URL}/karsilastirma` },
};

const COMPARISONS = [
  {
    slug: "akrilik-vs-yun-cami-halisi",
    title: "Akrilik vs Yün Cami Halısı",
    desc: "En popüler iki seçenek: ekonomi & pratiklik mi, doğallık & uzun ömür mü?",
    a: "Akrilik",
    b: "Yün",
    image: "/images/cami-katalog-01.png",
    hot: true,
  },
  {
    slug: "polipropilen-vs-polyamid-cami-halisi",
    title: "Polipropilen vs Polyamid Cami Halısı",
    desc: "Leke tutmazlık mı, aşınma direnci mi? Sentetik liflerin iki şampiyonu.",
    a: "Polipropilen",
    b: "Polyamid",
    image: "/images/cami-katalog-09.png",
  },
  {
    slug: "akrilik-vs-polipropilen-cami-halisi",
    title: "Akrilik vs Polipropilen Cami Halısı",
    desc: "Renk canlılığı & yumuşaklık mı, su direnci & pratiklik mi?",
    a: "Akrilik",
    b: "Polipropilen",
    image: "/images/cami-katalog-05.png",
  },
  {
    slug: "yun-vs-polyamid-cami-halisi",
    title: "Yün vs Polyamid Cami Halısı",
    desc: "Doğal premium mi, yüksek teknolojili sentetik mi? Büyük projeler için.",
    a: "Yün",
    b: "Polyamid",
    image: "/images/cami-katalog-07.png",
  },
  {
    slug: "safli-vs-gobekli-vs-seccadeli",
    title: "Saflı vs Göbekli vs Seccadeli Desen",
    desc: "Üç temel cami halısı desenini karşılaştırın.",
    a: "Saflı",
    b: "Göbekli",
    image: "/images/cami-katalog-02.png",
  },
];

export default async function KarsilastirmaHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const prefix = locale === "tr" ? "" : `/${locale}`;

  return (
    <>
      <Navigation locale={locale} />
      <main id="main-content">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#1B4332] to-[#0D2418] py-16 px-4">
          <div className="container-site">
            <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
              <a href={`${prefix}/`} className="hover:text-white">Ana Sayfa</a>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#E4B84A]">Karşılaştırma Rehberi</span>
            </nav>
            <div className="flex items-start gap-4">
              <Scale className="w-10 h-10 text-[#C9972B] flex-shrink-0 mt-1" />
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Cami Halısı Karşılaştırma Rehberi
                </h1>
                <p className="text-white/70 text-lg max-w-2xl">
                  Hangi halı türü caminiz için doğru? 40 yıllık uzmanlıkla hazırlanmış tarafsız karşılaştırma rehberleri.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Karşılaştırma Kartları */}
        <section className="section bg-[#F7F3EC]">
          <div className="container-site">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {COMPARISONS.map((c) => (
                <Link
                  key={c.slug}
                  href={`${prefix}/karsilastirma/${c.slug}`}
                  className="group bg-white rounded-2xl border border-[#DDD8CE] overflow-hidden hover:border-[#C9972B]/40 hover:shadow-lg transition-all"
                >
                  <div className="relative h-44 overflow-hidden bg-[#F7F3EC]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {c.hot && (
                      <span className="absolute top-3 left-3 bg-[#C9972B] text-white text-xs font-bold px-3 py-1 rounded-full">
                        En Çok Sorulan
                      </span>
                    )}
                    {/* vs badge */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-2 flex items-center gap-3 shadow-lg border border-white">
                        <span className="font-extrabold text-[#1B4332] text-sm">{c.a}</span>
                        <span className="text-[#C9972B] font-black text-sm">VS</span>
                        <span className="font-extrabold text-[#1B4332] text-sm">{c.b}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h2 className="font-bold text-[#1A1A1A] text-base mb-2 group-hover:text-[#1B4332] transition-colors">{c.title}</h2>
                    <p className="text-sm text-[#6B6355] leading-relaxed mb-3">{c.desc}</p>
                    <div className="flex items-center gap-1 text-sm font-semibold text-[#C9972B]">
                      Detaylı Karşılaştır <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <CTASection variant="green" title="Hangi Halıyı Seçeceğinizden Emin Değil misiniz?" subtitle="Uzmanlarımız caminizin özelliklerine göre en uygun seçimi ücretsiz tavsiye eder." />
      </main>
      <Footer locale={locale} />
    </>
  );
}

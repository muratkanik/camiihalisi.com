import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import Navigation from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import { ALL_CITIES } from "@/lib/cities";
import { localizedMetadata } from "@/lib/seo";

const TITLES = {
  tr: "Türkiye Geneli Cami Halısı | İl ve İlçe Bazında Hizmet",
  en: "Mosque Carpet Across Turkey | Service by Province and District",
  de: "Moscheeteppich in Ganz der Türkei | Service nach Provinz und Bezirk",
  fr: "Tapis de Mosquée dans Toute la Turquie | Service par Province et District",
  ar: "سجاد المساجد في جميع أنحاء تركيا | خدمة حسب المحافظة والمنطقة",
  ru: "Ковры для Мечетей по Всей Турции | Услуги по Провинциям и Районам",
};

const DESCRIPTIONS = {
  tr: "Türkiye'nin 81 ilinde ve tüm ilçelerinde cami halısı tedariki, üretim ve teslimat. Şehrinize en yakın Asil Halı hizmetleri.",
  en: "Mosque carpet supply, manufacturing and delivery in all 81 provinces and districts of Turkey. Find Asil Halı service near your city.",
  de: "Moscheeteppich-Lieferung, Herstellung und Zustellung in allen 81 Provinzen und Bezirken der Türkei. Asil Halı-Service in Ihrer Nähe.",
  fr: "Fourniture, fabrication et livraison de tapis de mosquée dans les 81 provinces et districts de Turquie. Service Asil Halı près de chez vous.",
  ar: "توريد وتصنيع وتوصيل سجاد المساجد في جميع محافظات ومناطق تركيا الـ 81. خدمات أصيل هالي بالقرب من مدينتك.",
  ru: "Поставка, производство и доставка ковров для мечетей во всех 81 провинциях и районах Турции. Услуги Asil Halı рядом с вашим городом.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata({ path: "/cami-halisi", locale, titles: TITLES, descriptions: DESCRIPTIONS });
}

const PROVINCES = ALL_CITIES.filter((c) => c.type === "il");
const DISTRICTS_BY_PARENT: Record<string, typeof ALL_CITIES> = {};
ALL_CITIES.filter((c) => c.type === "ilce").forEach((d) => {
  if (d.parent) {
    if (!DISTRICTS_BY_PARENT[d.parent]) DISTRICTS_BY_PARENT[d.parent] = [];
    DISTRICTS_BY_PARENT[d.parent].push(d);
  }
});

export default async function CamiHalisiIndexPage({
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
        <section className="bg-[#0097A7] py-16">
          <div className="container-site">
            <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
              <Link href={`${prefix}/`} className="hover:text-white transition-colors">Ana Sayfa</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#E4B84A]">Türkiye Geneli Cami Halısı</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Türkiye Geneli Cami Halısı Hizmeti
            </h1>
            <p className="text-lg text-white/80 max-w-2xl">
              Türkiye'nin tüm il ve ilçelerine cami halısı üretimi, teslimatı ve montajı.
              Şehrinizi seçin, uzmanlarımız size ulaşsın.
            </p>
          </div>
        </section>

        {/* İl Listesi */}
        <section className="section bg-[#F0FDFE]">
          <div className="container-site">
            <div className="text-center mb-10">
              <span className="badge badge-gold mb-4">İl Bazında Hizmet</span>
              <h2 className="section-title">Türkiye'nin 81 İlinde Cami Halısı</h2>
              <div className="gold-line mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-16">
              {PROVINCES.map((city) => (
                <Link
                  key={city.slug}
                  href={`${prefix}/cami-halisi/${city.slug}`}
                  className="bg-white border border-[#B2EBF2] rounded-xl px-3 py-2.5 text-sm font-medium text-[#1A1A1A] hover:border-[#C9972B]/40 hover:text-[#0097A7] hover:shadow-sm transition-all text-center"
                >
                  {city.name}
                </Link>
              ))}
            </div>

            {/* İlçe Listeleri */}
            {Object.entries(DISTRICTS_BY_PARENT).map(([parent, districts]) => {
              const parentCity = ALL_CITIES.find((c) => c.slug === parent);
              if (!parentCity || districts.length === 0) return null;
              return (
                <div key={parent} className="mb-10">
                  <h2 className="text-xl font-bold text-[#0097A7] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    <Link href={`${prefix}/cami-halisi/${parent}`} className="hover:text-[#C9972B] transition-colors">
                      {parentCity.name}
                    </Link>{" "}
                    İlçeleri
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {districts.map((d) => (
                      <Link
                        key={d.slug}
                        href={`${prefix}/cami-halisi/${d.slug}`}
                        className="bg-white border border-[#B2EBF2] rounded-lg px-3 py-2 text-xs font-medium text-[#6B6355] hover:border-[#C9972B]/40 hover:text-[#0097A7] transition-all text-center"
                      >
                        {d.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}

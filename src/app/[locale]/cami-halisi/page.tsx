import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import Navigation from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import { ALL_CITIES } from "@/lib/cities";

const SITE_URL = "https://camiihalisi.com";

export const metadata: Metadata = {
  title: "Türkiye Geneli Cami Halısı | İl ve İlçe Bazında Hizmet – Asil Halı",
  description:
    "Türkiye'nin 81 ilinde ve tüm ilçelerinde cami halısı tedariki, üretim ve teslimat. Şehrinize en yakın Asil Halı hizmetleri.",
  alternates: { canonical: `${SITE_URL}/cami-halisi` },
};

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
        <section className="bg-[#1B4332] py-16">
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
        <section className="section bg-[#F7F3EC]">
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
                  className="bg-white border border-[#DDD8CE] rounded-xl px-3 py-2.5 text-sm font-medium text-[#1A1A1A] hover:border-[#C9972B]/40 hover:text-[#1B4332] hover:shadow-sm transition-all text-center"
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
                  <h2 className="text-xl font-bold text-[#1B4332] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
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
                        className="bg-white border border-[#DDD8CE] rounded-lg px-3 py-2 text-xs font-medium text-[#6B6355] hover:border-[#C9972B]/40 hover:text-[#1B4332] transition-all text-center"
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

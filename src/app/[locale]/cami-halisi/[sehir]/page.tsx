import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ExternalLink, Phone, MessageCircle, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import Navigation from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import CTASection from "@/components/blocks/CTASection";
import { ALL_CITIES, getCityBySlug } from "@/lib/cities";

const SITE_URL = "https://camiihalisi.com";
const MAIN_SITE_URL = "https://www.asilhali.com.tr?utm_source=camiihalisi&utm_medium=sehir";
const WA_URL = "https://wa.me/905323467939?text=Merhaba%2C%20cami%20hal%C4%B1s%C4%B1%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; sehir: string }>;
}): Promise<Metadata> {
  const { sehir } = await params;
  const city = getCityBySlug(sehir);
  if (!city) return { title: "Sayfa Bulunamadı" };

  const isIlce = city.type === "ilce";
  const title = `${city.name} Cami Halısı | Fiyatları, Modelleri ve Montaj – Asil Halı`;
  const desc = isIlce
    ? `${city.name} (${city.parent ? city.parent.charAt(0).toUpperCase() + city.parent.slice(1) : ""}) bölgesine cami halısı tedariki. Akrilik, yün, polipropilen seçenekleri. Özel ölçü üretim, hızlı teslimat. Asil Halı A.Ş.`
    : `${city.name} cami halısı fiyatları, modelleri ve teslimat. Akrilik, yün, polipropilen ve polyamid cami halıları. Özel ölçü üretim, ${city.name} geneli teslimat. Asil Halı A.Ş.`;

  return {
    title,
    description: desc,
    keywords: [
      `${city.name} cami halısı`,
      `${city.name} cami halıları`,
      `${city.name} mescit halısı`,
      `${city.name} cami halısı fiyatları`,
      `${city.name} cami halısı modelleri`,
      `${city.name} akrilik cami halısı`,
      `${city.name} yün cami halısı`,
      "cami halısı",
      "Asil Halı",
    ],
    alternates: {
      canonical: `${SITE_URL}/cami-halisi/${sehir}`,
    },
    openGraph: {
      title,
      description: desc,
      url: `${SITE_URL}/cami-halisi/${sehir}`,
    },
  };
}

export function generateStaticParams() {
  return ALL_CITIES.flatMap((city) =>
    ["tr"].map((locale) => ({ locale, sehir: city.slug }))
  );
}

const CARPET_TYPES = [
  { slug: "akrilik-cami-halisi", name: "Akrilik Cami Halısı", desc: "Ekonomik, solmaz renkler, 15-20 yıl ömür" },
  { slug: "yun-cami-halisi", name: "Yün Cami Halısı", desc: "Doğal yün, ısı yalıtımı, 25-30 yıl ömür" },
  { slug: "polipropilen-cami-halisi", name: "Polipropilen Cami Halısı", desc: "Neme dayanıklı, kolay temizlik" },
  { slug: "polyamid-cami-halisi", name: "Polyamid Cami Halısı", desc: "En yüksek aşınma direnci, ihale favorisi" },
  { slug: "ozel-desen-axminster-cami-halisi", name: "Özel Desen Axminster", desc: "Sınırsız renk, camiye özel tasarım" },
];

const ADVANTAGES = [
  "Özel ölçü üretim — caminizin tam ebadında",
  "Ücretsiz keşif ve tasarım danışmanlığı",
  "Türkiye genelinde hızlı teslimat",
  "5-10 yıl ürün garantisi",
  "Bfl-s1 yangın sertifikası",
  "Profesyonel döşeme ve montaj desteği",
  "10.000+ referans cami",
  "50+ yıl üretim tecrübesi",
];

export default async function SehirCamiHalisiPage({
  params,
}: {
  params: Promise<{ locale: string; sehir: string }>;
}) {
  const { locale, sehir } = await params;
  setRequestLocale(locale);

  const city = getCityBySlug(sehir);
  if (!city) notFound();

  const prefix = locale === "tr" ? "" : `/${locale}`;
  const isIlce = city.type === "ilce";
  const parentName = city.parent
    ? ALL_CITIES.find((c) => c.slug === city.parent)?.name || city.parent
    : null;

  const breadcrumbLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Şehir Sayfaları", item: `${SITE_URL}/cami-halisi` },
      { "@type": "ListItem", position: 3, name: `${city.name} Cami Halısı`, item: `${SITE_URL}/cami-halisi/${sehir}` },
    ],
  };

  const localBusinessLD = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Asil Halı A.Ş.",
    description: `${city.name} bölgesine cami halısı tedariki ve montaj hizmetleri.`,
    url: "https://www.asilhali.com.tr",
    telephone: "+90-532-555-1234",
    areaServed: {
      "@type": "City",
      name: city.name,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Cami Halısı Ürünleri",
      itemListElement: CARPET_TYPES.map((t) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Product", name: t.name },
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLD) }} />

      <Navigation locale={locale} />

      <main id="main-content">
        {/* Hero */}
        <section className="bg-[#006064] py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C9972B' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")` }} />
          <div className="container-site relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/50 mb-6" aria-label="Breadcrumb">
              <Link href={`${prefix}/`} className="hover:text-white transition-colors">Ana Sayfa</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href={`${prefix}/cami-halisi`} className="hover:text-white transition-colors">Şehir Sayfaları</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#E4B84A]">{city.name} Cami Halısı</span>
            </nav>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {city.name} Cami Halısı
                </h1>
                <p className="text-lg text-white/80 mb-6 leading-relaxed">
                  {isIlce
                    ? `${city.name}${parentName ? ` (${parentName})` : ""} bölgesindeki camilere özel ölçü cami halısı üretimi ve teslimatı. Akrilik, yün, polipropilen seçenekleri.`
                    : `${city.name} genelindeki camilere özel cami halısı çözümleri. 50+ yıl tecrübe, 10.000+ referans. Özel ölçü üretim.`
                  }
                </p>

                {/* CTA Butonları */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href={WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3 px-5 rounded-xl transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp ile Sor
                  </a>
                  <a
                    href="tel:+905323467939"
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-5 rounded-xl transition-colors border border-white/20"
                  >
                    <Phone className="w-5 h-5" />
                    Hemen Ara
                  </a>
                  <a
                    href={MAIN_SITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#C9972B] hover:bg-[#B8861F] text-[#003B40] font-bold py-3 px-5 rounded-xl transition-colors"
                  >
                    Teklif Al
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Hızlı bilgi kartı */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-[#E4B84A] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {city.name} Cami Halısı Özeti
                </h2>
                <div className="space-y-2.5 text-sm text-white/80">
                  <div className="flex justify-between">
                    <span>Teslimat Bölgesi:</span>
                    <span className="font-semibold text-white">{city.name}{parentName ? ` / ${parentName}` : ""}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Malzeme Seçenekleri:</span>
                    <span className="font-semibold text-white">4 Farklı Malzeme</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Üretim Türü:</span>
                    <span className="font-semibold text-white">Özel Ölçü</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Teslim Süresi:</span>
                    <span className="font-semibold text-white">2–6 Hafta</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Garanti:</span>
                    <span className="font-semibold text-white">5–10 Yıl</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Yangın Sınıfı:</span>
                    <span className="font-semibold text-[#E4B84A]">Bfl-s1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ürün Kategorileri */}
        <section className="section bg-[#F0FDFE]">
          <div className="container-site">
            <div className="text-center mb-10">
              <span className="badge badge-gold mb-4">{city.name} İçin Halı Seçenekleri</span>
              <h2 className="section-title mb-3">
                {city.name} Cami Halısı Çeşitleri
              </h2>
              <div className="gold-line mx-auto mb-4" />
              <p className="section-subtitle mx-auto">
                {city.name} bölgesindeki camilere uygun tüm halı malzeme ve model seçenekleri.
                Caminizin büyüklüğü ve bütçenize göre en uygun seçimi yapın.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {CARPET_TYPES.map((carpet) => (
                <Link
                  key={carpet.slug}
                  href={`${prefix}/kategori/${carpet.slug}`}
                  className="group bg-white rounded-xl border border-[#B2EBF2] p-5 hover:border-[#C9972B]/40 hover:shadow-md transition-all"
                >
                  <h3 className="font-bold text-[#006064] mb-2 group-hover:text-[#C9972B] transition-colors">
                    {city.name} {carpet.name}
                  </h3>
                  <p className="text-sm text-[#6B6355] mb-3">{carpet.desc}</p>
                  <div className="flex items-center gap-1 text-[#C9972B] text-sm font-semibold">
                    İncele <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Avantajlar */}
            <div className="bg-white rounded-2xl border border-[#B2EBF2] p-8">
              <h2 className="text-2xl font-bold text-[#006064] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {city.name} Cami Halısı İçin Neden Asil Halı?
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {ADVANTAGES.map((adv) => (
                  <div key={adv} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#006064]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#006064]" />
                    </div>
                    <span className="text-sm text-[#1A1A1A]">{adv}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SSS - Şehre Özel */}
        <section className="section bg-white">
          <div className="container-site">
            <div className="max-w-3xl mx-auto">
              <h2 className="section-title text-center mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {city.name} Cami Halısı Hakkında Sık Sorulan Sorular
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: `${city.name}'da cami halısı siparişi nasıl verilir?`,
                    a: `${city.name} için cami halısı siparişi WhatsApp, telefon veya web formundan verilebilir. Caminizin ölçülerini paylaşmanız yeterlidir; ekibimiz ücretsiz fiyat teklifi hazırlar.`,
                  },
                  {
                    q: `${city.name}'a cami halısı teslimatı kaç günde yapılır?`,
                    a: `Stok ürünlerde ${city.name}'a teslimat 3-7 iş günü içinde gerçekleşir. Özel ölçü ürünlerde üretim süresi dahil 2-6 hafta gerekebilir.`,
                  },
                  {
                    q: `${city.name} için en uygun cami halısı hangisidir?`,
                    a: `${city.name}'daki küçük cami ve mescitler için akrilik tercih edilir. Büyük camiler için yün veya polyamid önerilir. Bütçe ve kullanım yoğunluğuna göre uzmanlarımız en uygun seçimi belirler.`,
                  },
                  {
                    q: `${city.name} cami halısı fiyatları nedir?`,
                    a: `${city.name} cami halısı fiyatları malzeme türüne (akrilik 150-350 TL/m², yün 500-900 TL/m²), caminizin büyüklüğüne ve özel tasarım tercihlerinize göre değişir. Ücretsiz fiyat teklifi için iletişime geçin.`,
                  },
                ].map((faq) => (
                  <div key={faq.q} className="bg-[#F0FDFE] rounded-xl border border-[#B2EBF2] p-5">
                    <h3 className="font-semibold text-[#006064] mb-2">{faq.q}</h3>
                    <p className="text-sm text-[#6B6355] leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Diğer Şehirler */}
        <section className="section bg-[#F0FDFE]">
          <div className="container-site">
            <h2 className="text-xl font-bold text-[#006064] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Diğer Şehirlerde Cami Halısı
            </h2>
            <div className="flex flex-wrap gap-2">
              {ALL_CITIES.filter((c) => c.type === "il" && c.slug !== sehir).slice(0, 20).map((c) => (
                <Link
                  key={c.slug}
                  href={`${prefix}/cami-halisi/${c.slug}`}
                  className="text-sm bg-white border border-[#B2EBF2] text-[#6B6355] hover:text-[#006064] hover:border-[#C9972B]/40 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {c.name} Cami Halısı
                </Link>
              ))}
            </div>
          </div>
        </section>

        <CTASection
          variant="green"
          title={`${city.name} Camiiniz İçin Ücretsiz Fiyat Teklifi Alın`}
          subtitle="Asil Halı uzmanları caminizin ölçülerine ve ihtiyaçlarına göre en uygun çözümü sunar."
        />
      </main>

      <Footer locale={locale} />
    </>
  );
}

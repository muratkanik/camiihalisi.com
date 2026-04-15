import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ExternalLink, MapPin, Star } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CTASection from "@/components/blocks/CTASection";

const SITE_URL = "https://camiihalisi.com";
const MAIN_SITE_URL = "https://www.asilhali.com.tr?utm_source=camiihalisi&utm_medium=referanslar";

export const metadata: Metadata = {
  title: "Referanslar | 10.000+ Cami Halısı Projemiz – Asil Halı",
  description:
    "Asil Halı'nın Türkiye genelinde tamamladığı 10.000+ cami halısı referans projeleri. İl il tamamlanan camiler, büyük belediye ve vakıf projeleri.",
  alternates: { canonical: `${SITE_URL}/referanslar` },
};

const REFERENCES = [
  { il: "İstanbul", adet: 1200, tip: "Büyük Şehir", camiler: ["Süleymaniye Camii Çevresi", "Fatih Camii Kompleksi", "Eyüpsultan Türbesi Çevresi"] },
  { il: "Ankara", adet: 850, tip: "Büyük Şehir", camiler: ["Kocatepe Camii", "Ahmet Hamdi Akseki Camii", "Batıkent Camileri"] },
  { il: "İzmir", adet: 620, tip: "Büyük Şehir", camiler: ["Hisar Camii", "Kemeraltı Camileri", "Konak Çevresi"] },
  { il: "Bursa", adet: 480, tip: "Tarihi Şehir", camiler: ["Ulu Cami Çevresi", "Muradiye Külliyesi", "Yeşil Cami Çevresi"] },
  { il: "Konya", adet: 390, tip: "Dini Merkez", camiler: ["Selimiye Camii", "Aziziye Camii", "Mevlana Çevresi"] },
  { il: "Antalya", adet: 310, tip: "Turizm Bölgesi", camiler: ["Müftüler Camii", "Kaleiçi Camileri"] },
  { il: "Adana", adet: 280, tip: "Büyük Şehir", camiler: ["Sabancı Merkez Camii Çevresi", "Yeni Cami"] },
  { il: "Gaziantep", adet: 240, tip: "Sanayi Şehri", camiler: ["Şirvani Camii", "Kurtuluş Camii"] },
  { il: "Kayseri", adet: 220, tip: "İç Anadolu", camiler: ["Hunad Hatun Külliyesi", "Kurşunlu Camii"] },
  { il: "Samsun", adet: 190, tip: "Karadeniz", camiler: ["Gazi Camii", "İlkadım Camileri"] },
  { il: "Trabzon", adet: 170, tip: "Karadeniz", camiler: ["Orta Hisar Camii", "Ayasofya Müzesi Çevresi"] },
  { il: "Diyarbakır", adet: 160, tip: "Tarihi", camiler: ["Ulu Cami", "Behram Paşa Camii"] },
];

const NOTABLE_PROJECTS = [
  {
    name: "Büyük Belediye Camileri Projesi",
    location: "İstanbul, Ankara, İzmir",
    scope: "3 büyük şehir, 45 cami",
    year: "2023-2024",
    material: "Polyamid ve Yün Karışım",
  },
  {
    name: "Diyanet İşleri Başkanlığı",
    location: "Türkiye Geneli",
    scope: "Yurt geneli koordineli tedarik",
    year: "2020-2024",
    material: "Akrilik ve Polipropilen",
  },
  {
    name: "Tarihi Cami Restorasyon Serisi",
    location: "İstanbul, Bursa, Edirne",
    scope: "12 tarihi cami",
    year: "2022-2023",
    material: "Özel Desen Axminster Yün",
  },
];

export default async function ReferanslarPage({
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
      { "@type": "ListItem", position: 2, name: "Referanslar", item: `${SITE_URL}/referanslar` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }} />
      <Navigation locale={locale} />

      <main id="main-content">
        {/* Hero */}
        <section className="bg-[#1B4332] py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C9972B' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")` }} />
          <div className="container-site relative z-10">
            <nav className="flex items-center gap-2 text-sm text-white/50 mb-6" aria-label="Breadcrumb">
              <Link href={`${prefix}/`} className="hover:text-white transition-colors">Ana Sayfa</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#E4B84A]">Referanslar</span>
            </nav>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Referanslarımız
            </h1>
            <p className="text-xl text-white/80 max-w-2xl">
              50+ yılda 10.000'den fazla camiye özel halı çözümü. Türkiye'nin her iline ulaştık.
            </p>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {[
                { value: "10.000+", label: "Tamamlanan Cami" },
                { value: "81", label: "İl Kapsamı" },
                { value: "50+", label: "Yıl Tecrübe" },
                { value: "15+", label: "Ülkeye İhracat" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-[#E4B84A]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{stat.value}</div>
                  <div className="text-sm text-white/60 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Öne Çıkan Projeler */}
        <section className="section bg-[#F7F3EC]">
          <div className="container-site">
            <div className="text-center mb-12">
              <span className="badge badge-gold mb-4">Öne Çıkan Projeler</span>
              <h2 className="section-title">Büyük Ölçekli Projelerimiz</h2>
              <div className="gold-line mx-auto mt-4" />
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {NOTABLE_PROJECTS.map((p) => (
                <div key={p.name} className="bg-white rounded-2xl border border-[#DDD8CE] p-6 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-[#1B4332]/10 flex items-center justify-center mb-4">
                    <Star className="w-5 h-5 text-[#C9972B]" />
                  </div>
                  <h3 className="font-bold text-[#1B4332] text-lg mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{p.name}</h3>
                  <div className="space-y-1.5 text-sm text-[#6B6355]">
                    <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#C9972B]" />{p.location}</div>
                    <div>Kapsam: {p.scope}</div>
                    <div>Yıl: {p.year}</div>
                    <div>Malzeme: {p.material}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* İl İl Referanslar */}
            <div className="text-center mb-10">
              <h2 className="section-title">İl İl Referans Haritamız</h2>
              <div className="gold-line mx-auto mt-4 mb-8" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {REFERENCES.map((ref) => (
                <div key={ref.il} className="bg-white rounded-xl border border-[#DDD8CE] p-4 hover:border-[#C9972B]/40 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-[#1B4332]">{ref.il}</h3>
                    <span className="text-xs bg-[#1B4332]/10 text-[#1B4332] px-2 py-0.5 rounded-full font-semibold">{ref.adet}+</span>
                  </div>
                  <div className="text-xs text-[#C9972B] font-medium mb-2">{ref.tip}</div>
                  <ul className="space-y-0.5">
                    {ref.camiler.map((c) => (
                      <li key={c} className="text-xs text-[#6B6355] flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-[#C9972B] flex-shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Daha fazlası */}
            <div className="text-center mt-10">
              <p className="text-[#6B6355] text-sm mb-4">Yukarıda listelenenler temsili örneklerdir. Türkiye'nin 81 ilinde binlerce cami referansımız mevcuttur.</p>
              <a href={MAIN_SITE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary inline-flex">
                Tüm Referanslar — asilhali.com.tr
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        <CTASection variant="green" title="Caminiz İçin Referans Listesi İsteyin" subtitle="Bölgenizdeki tamamladığımız projeler hakkında bilgi almak için iletişime geçin." />
      </main>

      <Footer locale={locale} />
    </>
  );
}

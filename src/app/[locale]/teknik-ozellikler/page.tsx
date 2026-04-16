import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import Navigation from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import CTASection from "@/components/blocks/CTASection";

const SITE_URL = "https://camiihalisi.com";
const MAIN_SITE_URL = "https://www.asilhali.com.tr?utm_source=camiihalisi&utm_medium=teknik";

export const metadata: Metadata = {
  title: "Teknik Özellikler | Cami Halısı Standartları ve Sertifikalar – Asil Halı",
  description:
    "Cami halısı teknik özellikleri, yangın sınıfı standartları, renk haslığı testleri, Bfl-s1 belgesi ve EN 13501-1 normu. Asil Halı teknik dökümanları.",
  alternates: { canonical: `${SITE_URL}/teknik-ozellikler` },
};

const SPECS_TABLE = [
  { ozellik: "Yangın Sınıfı", deger: "Bfl-s1 (EN 13501-1)", aciklama: "AB yangın yönetmeliği ibadet yerleri standardı" },
  { ozellik: "Renk Haslığı", deger: "ISO 105-B02 (≥5)", aciklama: "Güneş ışığına karşı renk kalıcılığı testi" },
  { ozellik: "Sürtme Renk Haslığı", deger: "ISO 105-X12 (≥4)", aciklama: "Sürtünmeye karşı renk dayanıklılığı" },
  { ozellik: "Hav Ağırlığı", deger: "1.800–3.200 gr/m²", aciklama: "Malzeme türüne göre değişir" },
  { ozellik: "Bağ Yoğunluğu", deger: "180.000–500.000/m²", aciklama: "Yüksek bağ yoğunluğu daha dayanıklı dokuma" },
  { ozellik: "Hav Yüksekliği", deger: "6–12 mm", aciklama: "Cami kullanımı için ideal aralık" },
  { ozellik: "Statik Elektrik", deger: "EN 1815 (≤2 kV)", aciklama: "İnsan vücuduna iletilen maksimum voltaj" },
  { ozellik: "Isıl Direnç", deger: "EN ISO 8302", aciklama: "Zemin ısı yalıtım katsayısı" },
  { ozellik: "Aşınma Direnci", deger: "EN ISO 9073-4", aciklama: "Martindale aşınma testi" },
  { ozellik: "Gürültü Azaltma", deger: "EN ISO 354", aciklama: "Ses yutma katsayısı" },
];

const MATERIAL_SPECS = [
  {
    malzeme: "Akrilik",
    hav: "6–10 mm",
    agirlik: "1.800–2.400 gr/m²",
    omur: "15–20 yıl",
    yangin: "Bfl-s1",
    garanti: "5 yıl",
  },
  {
    malzeme: "Yün",
    hav: "8–12 mm",
    agirlik: "2.400–3.200 gr/m²",
    omur: "25–30 yıl",
    yangin: "Bfl-s1",
    garanti: "10 yıl",
  },
  {
    malzeme: "Polipropilen",
    hav: "6–8 mm",
    agirlik: "1.600–2.200 gr/m²",
    omur: "10–15 yıl",
    yangin: "Bfl-s1",
    garanti: "5 yıl",
  },
  {
    malzeme: "Polyamid",
    hav: "6–10 mm",
    agirlik: "2.000–2.800 gr/m²",
    omur: "20–25 yıl",
    yangin: "Bfl-s1",
    garanti: "7 yıl",
  },
];

const CERTS = [
  { ad: "EN 13501-1", konu: "Yapı Malzemeleri Yangın Sınıflandırması", sinif: "Bfl-s1" },
  { ad: "ISO 105-B02", konu: "Renk Haslığı – Işığa Karşı", sinif: "≥5/8" },
  { ad: "ISO 105-X12", konu: "Renk Haslığı – Sürtünmeye Karşı", sinif: "≥4/5" },
  { ad: "EN 1307", konu: "Tekstil Zemin Kaplamaları Sınıflandırması", sinif: "Sınıf 32+" },
  { ad: "EN 1815", konu: "Statik Elektrik Değerlendirmesi", sinif: "≤2 kV" },
  { ad: "Oeko-Tex Standard 100", konu: "İnsan Sağlığına Zararsızlık", sinif: "Sertifikalı" },
];

export default async function TeknikOzelliklerPage({
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
      { "@type": "ListItem", position: 2, name: "Teknik Özellikler", item: `${SITE_URL}/teknik-ozellikler` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }} />
      <Navigation locale={locale} />

      <main id="main-content">
        {/* Hero */}
        <section className="bg-[#006064] py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C9972B' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")` }} />
          <div className="container-site relative z-10">
            <nav className="flex items-center gap-2 text-sm text-white/50 mb-6" aria-label="Breadcrumb">
              <Link href={`${prefix}/`} className="hover:text-white transition-colors">Ana Sayfa</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#E4B84A]">Teknik Özellikler</span>
            </nav>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Teknik Özellikler
            </h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Cami halısı seçiminde bilmeniz gereken tüm teknik standartlar, sertifikalar ve malzeme karşılaştırmaları.
            </p>
          </div>
        </section>

        {/* Genel Teknik Özellikler */}
        <section className="section bg-[#F0FDFE]">
          <div className="container-site">
            <div className="text-center mb-12">
              <span className="badge badge-gold mb-4">Standartlar & Normlar</span>
              <h2 className="section-title">Teknik Özellikler Tablosu</h2>
              <div className="gold-line mx-auto mt-4" />
            </div>
            <div className="overflow-x-auto rounded-2xl border border-[#B2EBF2] bg-white mb-16">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#006064] text-white">
                    <th className="text-left px-5 py-3.5 font-semibold">Özellik</th>
                    <th className="text-left px-5 py-3.5 font-semibold">Değer / Standart</th>
                    <th className="text-left px-5 py-3.5 font-semibold hidden md:table-cell">Açıklama</th>
                  </tr>
                </thead>
                <tbody>
                  {SPECS_TABLE.map((row, i) => (
                    <tr key={row.ozellik} className={i % 2 === 0 ? "bg-white" : "bg-[#F0FDFE]"}>
                      <td className="px-5 py-3.5 font-medium text-[#006064]">{row.ozellik}</td>
                      <td className="px-5 py-3.5 font-semibold text-[#C9972B]">{row.deger}</td>
                      <td className="px-5 py-3.5 text-[#6B6355] hidden md:table-cell">{row.aciklama}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Malzeme Karşılaştırması */}
            <div className="text-center mb-10">
              <h2 className="section-title">Malzeme Karşılaştırması</h2>
              <div className="gold-line mx-auto mt-4" />
            </div>
            <div className="overflow-x-auto rounded-2xl border border-[#B2EBF2] bg-white mb-16">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#006064] text-white">
                    <th className="text-left px-5 py-3.5 font-semibold">Malzeme</th>
                    <th className="text-left px-5 py-3.5 font-semibold">Hav Yüksekliği</th>
                    <th className="text-left px-5 py-3.5 font-semibold">Ağırlık</th>
                    <th className="text-left px-5 py-3.5 font-semibold">Kullanım Ömrü</th>
                    <th className="text-left px-5 py-3.5 font-semibold">Yangın</th>
                    <th className="text-left px-5 py-3.5 font-semibold">Garanti</th>
                  </tr>
                </thead>
                <tbody>
                  {MATERIAL_SPECS.map((m, i) => (
                    <tr key={m.malzeme} className={i % 2 === 0 ? "bg-white" : "bg-[#F0FDFE]"}>
                      <td className="px-5 py-3.5 font-bold text-[#006064]">
                        <Link href={`${prefix}/kategori/${m.malzeme.toLowerCase().replace("ü", "u").replace("ı", "i")}-cami-halisi`} className="hover:text-[#C9972B] transition-colors">
                          {m.malzeme}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-[#6B6355]">{m.hav}</td>
                      <td className="px-5 py-3.5 text-[#6B6355]">{m.agirlik}</td>
                      <td className="px-5 py-3.5 font-semibold text-[#006064]">{m.omur}</td>
                      <td className="px-5 py-3.5 text-[#C9972B] font-medium">{m.yangin}</td>
                      <td className="px-5 py-3.5 text-[#6B6355]">{m.garanti}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sertifikalar */}
            <div className="text-center mb-10">
              <h2 className="section-title">Sertifikalar ve Belgeler</h2>
              <div className="gold-line mx-auto mt-4" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
              {CERTS.map((cert) => (
                <div key={cert.ad} className="bg-white rounded-xl border border-[#B2EBF2] p-5 hover:border-[#C9972B]/40 transition-colors">
                  <div className="text-xs font-bold text-[#C9972B] uppercase tracking-widest mb-1">{cert.ad}</div>
                  <div className="font-semibold text-[#006064] text-sm mb-1">{cert.konu}</div>
                  <div className="text-xs text-[#6B6355]">Sınıf / Sonuç: <span className="font-bold text-[#006064]">{cert.sinif}</span></div>
                </div>
              ))}
            </div>

            {/* Bfl-s1 açıklaması */}
            <div className="bg-[#006064]/5 border border-[#006064]/20 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-[#006064] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Bfl-s1 Yangın Sınıfı Nedir?
              </h3>
              <p className="text-sm text-[#6B6355] leading-relaxed mb-4">
                Bfl-s1, Avrupa Birliği yapı malzemeleri yangın sınıflandırma standardı EN 13501-1 kapsamında zemin kaplamaları için en yüksek güvenlik sınıfıdır. Bu sınıf şu anlama gelir:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-[#C9972B] font-bold flex-shrink-0">B:</span>
                  <span className="text-[#6B6355]">Alev yayılımını sınırlar; yangına katılım düşüktür</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#C9972B] font-bold flex-shrink-0">fl:</span>
                  <span className="text-[#6B6355]">Zemin kaplama (flooring) kategorisi</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#C9972B] font-bold flex-shrink-0">s1:</span>
                  <span className="text-[#6B6355]">Duman üretimi en düşük seviye — tahliye güvenliği</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#C9972B] font-bold flex-shrink-0">Zorunluluk:</span>
                  <span className="text-[#6B6355]">İbadet yerleri, okullar ve kamu binaları için zorunludur</span>
                </div>
              </div>
              <div className="mt-6">
                <a href={MAIN_SITE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary text-sm inline-flex">
                  Teknik Belge Talep Et — asilhali.com.tr
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <CTASection variant="green" title="İhale İçin Teknik Döküman Talep Edin" subtitle="Fiyat teklifi, teknik şartname ve sertifikaların tamamı için Asil Halı uzmanlarıyla iletişime geçin." />
      </main>

      <Footer locale={locale} />
    </>
  );
}

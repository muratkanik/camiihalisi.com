import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { ChevronRight, ExternalLink, Award, Users, Globe, Factory } from "lucide-react";

import Navigation from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import CTASection from "@/components/blocks/CTASection";

const SITE_URL = "https://camiihalisi.com";
const MAIN_SITE_URL = "https://www.asilhali.com.tr?utm_source=camiihalisi&utm_medium=hakkimizda";

export const metadata: Metadata = {
  title: "Hakkımızda | Asil Halı A.Ş. – 1940'tan Bu Yana Cami Halısı Ustası",
  description:
    "Asil Halı A.Ş., 1940'tan bu yana Kayseri'de cami halısı üretmektedir. 80+ yıl tecrübe, 10.000+ cami referansı. Tarihimiz, değerlerimiz ve misyonumuz hakkında bilgi alın.",
  alternates: { canonical: `${SITE_URL}/hakkimizda` },
};

const MILESTONES = [
  { year: "1940", text: "Asil Halı, Kayseri'de kuruluş. El tezgahlarıyla başlayan ustalık yolculuğu." },
  { year: "1960", text: "Kayseri fabrikasında ilk mekanik tezgahlar. Üretim kapasitesi hızla artıyor." },
  { year: "1980", text: "Cami halısı özel üretimine odaklanıldı. Türkiye'nin önde gelen üreticilerinden biri olundu." },
  { year: "1995", text: "ISO 9001 kalite sertifikası alındı. Orta Doğu'ya ihracat başladı." },
  { year: "2005", text: "Modern fabrika tesisine taşındı. Yıllık 500.000 m² üretim kapasitesi." },
  { year: "2015", text: "Solution Dyed Nylon teknolojisiyle polyamid serisini piyasaya sundu." },
  { year: "2024", text: "10.000+ cami referansı. Türkiye'nin 81 ilinde ve uluslararası projelerde teslimat." },
];

const VALUES = [
  {
    icon: Award,
    title: "Kalite",
    desc: "Her ürün, ISO sertifikalı üretim sürecinden geçer. Müşteriye sunulan her halı, cami ortamının gerektirdiği standartları karşılar.",
  },
  {
    icon: Users,
    title: "Güven",
    desc: "50 yıldır binlerce cami yöneticisi ve müteahhidiyle kurduğumuz güven ilişkisi, en büyük referansımızdır.",
  },
  {
    icon: Globe,
    title: "Erişim",
    desc: "Türkiye'nin 81 ilinde ve 15 ülkede teslimat. Her büyüklükte projeye, her bütçeye çözüm sunuyoruz.",
  },
  {
    icon: Factory,
    title: "Yerlilik",
    desc: "Tüm üretimimiz Türkiye'de gerçekleşir. Yerli istihdama ve ekonomiye katkı sağlamak önceliğimizdir.",
  },
];

export default async function HakkimizdaPage({
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
        {/* ── Hero ── */}
        <section className="bg-[#1B4332] py-20 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0l8 13.9h16v16L77.1 40 64 46.1v16H48L40 80 32 62.1H16v-16L2.9 40 16 33.9v-16h16z' fill='%23C9972B' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: "80px 80px",
            }}
          />
          <div className="container-site relative z-10">
            <nav className="flex items-center gap-2 text-sm text-white/50 mb-6" aria-label="Breadcrumb">
              <Link href={`${prefix}/`} className="hover:text-white transition-colors">Ana Sayfa</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#E4B84A]">Hakkımızda</span>
            </nav>
            <span className="badge bg-[#C9972B]/20 text-[#E4B84A] border border-[#C9972B]/30 mb-4">
              Asil Halı A.Ş.
            </span>
            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-4 max-w-3xl"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              1940'tan Bu Yana Türkiye'nin Cami Halısı Ustası
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              Kayseri'den dünyaya; 80 yılı aşkın ustalık, 10.000'i aşkın cami referansıyla ibadethane zeminlerinde.
            </p>
          </div>
        </section>

        {/* ── Misyon ── */}
        <section className="section bg-[#F7F3EC] geometric-overlay">
          <div className="container-site relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="badge badge-gold mb-4">Misyonumuz</span>
                <h2 className="section-title mb-4">
                  Cami, Sıradan Bir Mekan Değildir
                </h2>
                <div className="gold-line mb-6" />
                <div className="space-y-4 text-[#4A4035] leading-relaxed">
                  <p>
                    Cami, Müslümanların Allah'a yaklaşmak için bir araya geldiği, manevi huzurun yaşandığı mübarek bir mekandır. Bu mekânın zemine serilen halısı, yalnızca bir döşeme ürünü değil; ibadetin bir parçasıdır.
                  </p>
                  <p>
                    Asil Halı olarak biz, bu bilincin sorumluluğuyla üretiyoruz. Her iğne, her düğüm, her desen; camiye yaraşır kalite ve özenle işlenir. Müşterilerimize ürün değil; güven, huzur ve uzun soluklu bir ortaklık sunuyoruz.
                  </p>
                  <p>
                    50 yılı aşkın deneyimimiz bize şunu öğretti: En iyi cami halısı, sadece dayanıklı veya güzel olan değil; cami cemaatinin her gün üzerinde secdeye kapandığında huzur hissettiği olandır.
                  </p>
                </div>
                <a
                  href={MAIN_SITE_URL}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-primary mt-8 inline-flex"
                >
                  Resmi Siteyi Ziyaret Et
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Görsel */}
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/images/hd-foto-01.jpg"
                    alt="Asil Halı tamamlanan cami projesi"
                    className="w-full h-80 object-cover"
                  />
                </div>
                {/* Üzerine bindirme kutusu */}
                <div className="absolute -bottom-6 -left-6 bg-[#C9972B] text-[#1A1A1A] rounded-2xl p-5 shadow-xl">
                  <div
                    className="text-4xl font-bold"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    80+
                  </div>
                  <div className="text-sm font-semibold">Yıl Tecrübe</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Değerlerimiz ── */}
        <section className="section bg-white">
          <div className="container-site">
            <div className="text-center mb-12">
              <span className="badge badge-green mb-4">Değerlerimiz</span>
              <h2 className="section-title mb-3">Bizi Biz Yapan İlkeler</h2>
              <div className="gold-line mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div key={i} className="p-6 rounded-2xl bg-[#F7F3EC] border border-[#DDD8CE] text-center">
                    <div className="w-12 h-12 rounded-xl bg-[#1B4332]/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-[#1B4332]" />
                    </div>
                    <h3
                      className="font-bold text-[#1A1A1A] mb-2"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}
                    >
                      {v.title}
                    </h3>
                    <p className="text-sm text-[#6B6355] leading-relaxed">{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Tarihsel Yol Haritası ── */}
        <section className="section bg-[#F7F3EC]">
          <div className="container-site">
            <div className="text-center mb-12">
              <span className="badge badge-gold mb-4">Tarihimiz</span>
              <h2 className="section-title mb-3">Yarım Asırlık Yolculuk</h2>
              <div className="gold-line mx-auto" />
            </div>
            <div className="relative max-w-3xl mx-auto">
              {/* Dikey çizgi */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#C9972B] to-[#1B4332]" />
              <div className="space-y-8">
                {MILESTONES.map((m, i) => (
                  <div key={i} className="flex gap-8 items-start relative">
                    {/* Yıl dairesi */}
                    <div className="w-16 h-16 rounded-full bg-[#1B4332] border-4 border-[#C9972B] flex items-center justify-center flex-shrink-0 z-10">
                      <span className="text-xs font-bold text-[#E4B84A] leading-tight text-center">
                        {m.year}
                      </span>
                    </div>
                    {/* İçerik */}
                    <div className="flex-1 bg-white rounded-xl border border-[#DDD8CE] p-5 shadow-sm">
                      <p className="text-sm text-[#4A4035] leading-relaxed">{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Fotoğraf Galerisi ── */}
        <section className="section bg-white">
          <div className="container-site">
            <div className="text-center mb-10">
              <span className="badge badge-gold mb-4">Projelerimizden</span>
              <h2 className="section-title mb-3">Tamamlanan Cami Halısı Projeleri</h2>
              <div className="gold-line mx-auto" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                "/images/hd-foto-02.jpg", "/images/hd-foto-03.jpg", "/images/hd-foto-04.jpg", "/images/hd-foto-05.jpg",
                "/images/hd-foto-06.jpg", "/images/hd-foto-07.jpg", "/images/hd-foto-08.jpg", "/images/hd-foto-09.jpg",
                "/images/hd-foto-10.jpg", "/images/hd-foto-11.jpg", "/images/referans-bilecik.jpg", "/images/referans-esentepe.jpg",
              ].map((src, i) => (
                <div key={i} className="rounded-xl overflow-hidden aspect-square group">
                  <img
                    src={src}
                    alt={`Tamamlanan cami halısı projesi ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <a href={`${prefix}/galeri`} className="btn btn-gold">
                Tüm Fotoğraf Galerisini Gör
              </a>
            </div>
          </div>
        </section>

        {/* ── Bu Site Hakkında ── */}
        <section className="section-sm bg-[#1B4332]/5 border-y border-[#DDD8CE]">
          <div className="container-site">
            <div className="max-w-2xl mx-auto text-center">
              <h2
                className="text-2xl font-bold text-[#1B4332] mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Bu Site Hakkında
              </h2>
              <p className="text-sm text-[#6B6355] leading-relaxed mb-4">
                camiihalisi.com, Asil Halı A.Ş.'nin bilgi ve içerik portalıdır. Cami halısı hakkında kapsamlı rehberler, teknik bilgiler ve makale içerikleri sunmaktadır. Alış veriş, sipariş ve teklif almak için lütfen resmi sitemizi ziyaret edin.
              </p>
              <a
                href={MAIN_SITE_URL}
                target="_blank"
                rel="noopener"
                className="btn btn-primary"
              >
                www.asilhali.com.tr
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        <CTASection
          variant="green"
          title="Caminizin Halı Projesinde Yanınızdayız"
          subtitle="50 yılı aşkın deneyimimiz ve 10.000'i aşkın cami referansımızla, caminizin büyüklüğü ne olursa olsun en iyi çözümü sunuyoruz."
        />
      </main>

      <Footer locale={locale} />
    </>
  );
}

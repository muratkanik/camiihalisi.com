import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { ChevronRight, MessageCircleQuestion, Search } from "lucide-react";
import Navigation from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import CTASection from "@/components/blocks/CTASection";

const SITE_URL = "https://camiihalisi.com";

export const metadata: Metadata = {
  title: "Cami Halısı Hakkında Sık Sorulan Sorular | Asil Halı Uzman Rehberi",
  description:
    "Cami halısı seçimi, fiyatları, bakımı ve özellikleri hakkında 50+ soru ve uzman cevabı. Akrilik mi yün mü? Kaç yıl dayanır? Nasıl temizlenir? Asil Halı A.Ş.",
  alternates: { canonical: `${SITE_URL}/sss` },
  openGraph: {
    title: "Cami Halısı SSS | Asil Halı Uzman Rehberi",
    description: "Cami halısı hakkında merak ettiğiniz her şey — 50+ soru, uzman cevapları.",
    images: [{ url: `${SITE_URL}/images/cami-hero.png` }],
  },
};

interface Soru {
  soru: string;
  cevap: string;
  link?: { href: string; label: string };
}

interface Kategori {
  baslik: string;
  icon: string;
  sorular: Soru[];
}

const SSS_KATEGORILER: Kategori[] = [
  {
    baslik: "Cami Halısı Seçimi",
    icon: "🔍",
    sorular: [
      {
        soru: "Cami için en iyi halı türü hangisi?",
        cevap:
          "En iyi cami halısı türü, caminin büyüklüğü, kullanım yoğunluğu ve bütçesine göre değişir. Ekonomik ve geniş camiler için akrilik; uzun ömür ve doğallık arayanlar için yün; yüksek trafik alanları için polipropilen; büyük prestijli projeler için polyamid; tamamen özel desen isteyenler için Axminster tercih edilir. Asil Halı uzmanları, caminizin özelliklerine göre ücretsiz danışmanlık verir.",
        link: { href: "/kategori/akrilik-cami-halisi", label: "Halı türlerini karşılaştır" },
      },
      {
        soru: "Akrilik mi yün mü daha iyi cami halısı?",
        cevap:
          "Akrilik: daha ekonomik, kolay bakımlı, canlı renkler, 15-20 yıl ömür. Yün: doğal lif, ısı yalıtımı, 25-30 yıl ömür, daha pahalı. Bütçe kısıtlı veya orta boy camiler için akrilik, prestijli büyük camiler için yün önerilir. Uzun vadede hesaplandığında yünün m² maliyeti akriliğe yakın veya daha avantajlı olabilir.",
        link: { href: "/karsilastirma/akrilik-vs-yun-cami-halisi", label: "Detaylı karşılaştırma" },
      },
      {
        soru: "Cami halısı seçerken nelere dikkat edilmeli?",
        cevap:
          "1) Lif türü (akrilik/yün/polipropilen/polyamid), 2) Bağ yoğunluğu (min 180.000 düğüm/m²), 3) Hav yüksekliği (6-10 mm), 4) Yangın sertifikası (EN 13501-1 Bfl-s1 zorunlu), 5) Garanti süresi, 6) Üretici referansları. Cami için özel olarak tasarlanmış, namaz sırasında kaymayan ve kolay temizlenebilen halılar tercih edilmeli.",
      },
      {
        soru: "Cami halısının metrekaresi kaç liraya mal olur?",
        cevap:
          "Fiyat; lif türü, desen karmaşıklığı, bağ yoğunluğu ve sipariş miktarına göre değişir. Genel aralık: akrilik 300-800 TL/m², polipropilen 250-600 TL/m², polyamid 500-1.200 TL/m², yün 800-2.500 TL/m², Axminster (özel) 1.500 TL/m² üzeri. Büyük siparişlerde birim fiyat düşer. Asil Halı'dan ölçü vererek ücretsiz fiyat teklifi alabilirsiniz.",
      },
      {
        soru: "Saflı, göbekli ve seccadeli halı farkı nedir?",
        cevap:
          "Saflı: Namaz sırasında cemaatin hizalanmasını kolaylaştıran yatay çizgiler içerir. Her safın genişliği 60-65 cm'dir. Göbekli: Namaz alanının merkezinde dekoratif bir göbek motifi bulunur. Seccadeli: Halı üzerine bireysel namazlık (seccade) motifleri işlenmiştir; her cemaat üyesi kendi alanını belirleyebilir. Üçü de tüm lif türlerinde üretilebilir.",
      },
      {
        soru: "Minimum sipariş miktarı var mı?",
        cevap:
          "Hayır, Asil Halı'nın minimum sipariş miktarı yoktur. Küçük bir mescit için 10 m² veya büyük bir külliye için 5.000 m² sipariş verilebilir. Özel desen Axminster üretimi için genellikle 50 m² minimum gereklidir.",
      },
    ],
  },
  {
    baslik: "Teknik Özellikler",
    icon: "⚙️",
    sorular: [
      {
        soru: "Cami halısında bağ yoğunluğu ne anlama gelir?",
        cevap:
          "Bağ yoğunluğu, 1 m²'deki düğüm sayısıdır. Kalite için minimum 180.000 düğüm/m² önerilir. 350.000+ düğüm/m² premium kaliteyi gösterir. Yüksek yoğunluk; daha dayanıklı, daha detaylı desen ve daha uzun ömür anlamına gelir. Asil Halı ürünleri 180.000 ile 500.000 düğüm/m² arasında üretilmektedir.",
        link: { href: "/teknik-ozellikler", label: "Teknik özellikler tablosu" },
      },
      {
        soru: "Cami halısının yangın sertifikası gerekli mi?",
        cevap:
          "Evet, Türkiye'de kamu yapıları ve camiler için EN 13501-1 standardı kapsamında Bfl-s1 yangın sınıfı zorunludur. Bu sınıf, halının alev yaymasını sınırlayan en yüksek güvenlik standardıdır. Asil Halı tüm ürünleri bu sertifikaya sahiptir ve ihale şartnamelerinde belirtilen gereksinimleri karşılar.",
      },
      {
        soru: "Hav yüksekliği ne olmalı?",
        cevap:
          "Cami halıları için ideal hav yüksekliği 6-10 mm'dir. 6 mm: yoğun trafik, kolay temizlik. 8-10 mm: konfor odaklı, daha yumuşak yüzey (yün için 8-14 mm). 12 mm üzeri: dekoratif, düşük trafik alanları. Uzun namaz sürelerinde diz ve bacak konforunu artırmak için en az 7 mm önerilir.",
      },
      {
        soru: "Cami halısı ağırlığı ne olmalı?",
        cevap:
          "Ağırlık (gr/m²) halının yoğunluğunu ve dayanıklılığını gösterir. Önerilen minimum: akrilik 1.800 gr/m², polipropilen 1.500 gr/m², polyamid 1.800 gr/m², yün 2.200 gr/m². Bu değerlerin altındaki halılar hızla aşınır ve şeklini kaybeder.",
      },
      {
        soru: "Solution Dyed Nylon (SDN) teknolojisi nedir?",
        cevap:
          "SDN, boyayı lif yüzeyine değil içine işleyen ileri bir boyama teknolojisidir. Klasik boyamaya kıyasla: UV'ye %5-10 kat daha dirençli, kimyasal soluculardan etkilenmez, çamaşır suyu ile temizlenebilir. Özellikle polyamid cami halılarında kullanılır ve 20+ yıl renk garantisi sağlar.",
        link: { href: "/kategori/polyamid-cami-halisi", label: "Polyamid koleksiyonu" },
      },
    ],
  },
  {
    baslik: "Bakım ve Temizlik",
    icon: "🧹",
    sorular: [
      {
        soru: "Cami halısı nasıl temizlenir?",
        cevap:
          "Günlük: Toz üfleme veya elektrikli süpürge (düşük güç, halı yönünde). Haftalık: Nemli bez silme. Aylık: Profesyonel halı temizleme makinesi. Yıllık: Kuru temizleme veya yıkama servisi. Yün halılar için sadece soğuk su ve pH nötr deterjan kullanın. Polipropilen ve akrilik halılar çamaşır suyuyla bile silinebilir.",
      },
      {
        soru: "Cami halısı ne zaman değiştirilmeli?",
        cevap:
          "Değiştirme işaretleri: Hav yüksekliğinin yarıya düşmesi, desenin belirgin biçimde solması, yıkamayla geçmeyen leke ve koku, alt tabanın ayrışması veya ayakta hissedilen sertleşme. Akrilik: 15-20 yıl, polipropilen: 15-20 yıl, polyamid: 20-25 yıl, yün: 25-30+ yıl.",
      },
      {
        soru: "Cami halısındaki leke nasıl çıkarılır?",
        cevap:
          "Acil: Sıvıyı hemen kağıt havluyla emerek temizleyin, ovuşturmayın. Yağ lekesi: az miktarda sıvı deterjan + soğuk su. Çay/kahve: soğuk su + beyaz sirke karışımı. Kan: soğuk tuzlu su (ılık su kullanmayın). Mürekkep: izopropil alkol. Tüm işlemlerde halı yönünde hareket edin.",
      },
      {
        soru: "Cami halısı altına ne döşenmeli?",
        cevap:
          "Altlık döşemek halının ömrünü %30-40 uzatır ve kaymasını önler. Seçenekler: 1) Kauçuk altlık — kaymaz, nem bariyeri. 2) 600 gr/m² keçe — ekonomik, temel yalıtım. 3) 1000 gr/m² keçe — standart projeler. 4) 1200 gr/m² keçe — büyük prestijli camiler, maksimum ses ve ısı yalıtımı. 5) TredMOR™ Berber Supreme — premium kaymaz altlık.",
        link: { href: "/kategori/kece-cami-halisi-altligi", label: "Altlık seçenekleri" },
      },
    ],
  },
  {
    baslik: "Sipariş ve Üretim",
    icon: "📦",
    sorular: [
      {
        soru: "Cami halısı ne kadar sürede teslim edilir?",
        cevap:
          "Stok ürünler: 3-7 iş günü. Özel ölçü standart desen: 3-6 hafta. Özel desen (Axminster vb.): 6-10 hafta. Büyük projeler (1.000 m² üzeri): 8-12 hafta. Teslimat Türkiye genelinde yapılmakta, uluslararası projeler için ayrı görüşme yapılmaktadır.",
      },
      {
        soru: "Özel ölçü ve özel desen yaptırabilir miyim?",
        cevap:
          "Evet. Asil Halı'nın tüm ürünleri özel ölçüde üretilir. Özel desen için: caminizin fotoğrafı, ölçüleri ve desen tercihlerinizi paylaşın. Ücretsiz 3D görselleştirme hazırlanır, onayınızın ardından üretime geçilir. Şehrin tarihi veya kültürel motiflerini halıya işlemek de mümkündür.",
      },
      {
        soru: "Toplu sipariş indirimi var mı?",
        cevap:
          "Evet. 500 m² üzeri siparişlerde %5-10, 1.000 m² üzeri siparişlerde %10-15, 5.000 m² üzeri büyük projelerde %15-20'ye kadar fiyat avantajı sağlanabilir. Belediye, vakıf ve Diyanet projeleri için özel proje fiyatlaması mevcuttur.",
      },
      {
        soru: "İhale şartnamelerine uygun üretim yapılıyor mu?",
        cevap:
          "Evet. Asil Halı; TSE, EN 1307, EN 13501-1 (yangın), EN ISO 10361 (aşınma) ve Kamu İhale Kanunu şartnamelerine uygun belgeleri sunmaktadır. İhale teknik şartnamelerinin hazırlanmasında ücretsiz teknik destek verilmektedir.",
      },
      {
        soru: "Kurulum ve montaj hizmeti var mı?",
        cevap:
          "Evet, talep üzerine Türkiye genelinde kurulum hizmeti verilmektedir. Kurulum ekibi; eski halı söküm, zemin hazırlık, yeni halı döşeme ve kenar işlemlerini kapsar. Büyük projelerde montaj ücretsizdir.",
      },
    ],
  },
  {
    baslik: "Yün Cami Halısı",
    icon: "🐑",
    sorular: [
      {
        soru: "Yün cami halısının avantajları nelerdir?",
        cevap:
          "1) %100 doğal lif, çevre dostu. 2) Doğal ısı ve nem yönetimi — cami ortamını konforlu tutar. 3) 25-30 yıl kullanım ömrü. 4) Doğal kir ve leke direnci. 5) Statik elektriği tutmaz. 6) Yangına karşı doğal direnç. 7) Hipoalerjenik. 8) Yıllar geçtikçe patina kazanan estetik görünüm.",
        link: { href: "/kategori/yun-cami-halisi", label: "Yün halı koleksiyonu" },
      },
      {
        soru: "Yün cami halısı nem çeker mi?",
        cevap:
          "Yün doğal nem yönetimi sağlar; havadan nemi alır ve bırakır. Ancak ıslak zemine konulmamalıdır. Camide taban nem yalıtımı yapılması önerilir. Yüksek nemli ortamlarda (bodrum kata yakın, kıyı şehirleri) polipropilen veya polyamid daha uygun olabilir.",
      },
    ],
  },
  {
    baslik: "Akrilik Cami Halısı",
    icon: "✨",
    sorular: [
      {
        soru: "Akrilik cami halısı kaç yıl dayanır?",
        cevap:
          "Kaliteli akrilik cami halısı, düzenli bakım ve yılda 1-2 kez profesyonel yıkama ile 15-20 yıl sorunsuz kullanılabilir. Asil Halı akrilik serisi 5 yıl garantilidir. Erken değişimin başlıca nedenleri: düşük bağ yoğunluğu (<150.000 düğüm/m²), altlık kullanılmaması ve yanlış temizlik yöntemleridir.",
        link: { href: "/kategori/akrilik-cami-halisi", label: "Akrilik koleksiyon" },
      },
      {
        soru: "Akrilik halı UV'den solar mı?",
        cevap:
          "Kaliteli akrilik halılar, UV dayanımlı pigmentlerle üretilir ve doğrudan güneş alan mekanlarda bile 15+ yıl renk stabilitesi sağlar. Ancak ucuz akrilik ürünler 3-5 yılda belirgin solar. Asil Halı akrilik serisi, Türkiye iklimine özel UV dirençli liflerden üretilmektedir.",
      },
    ],
  },
  {
    baslik: "Polipropilen & Polyamid",
    icon: "🏗️",
    sorular: [
      {
        soru: "Polipropilen cami halısının faydaları nelerdir?",
        cevap:
          "Polipropilen (PP): su tutmaz, leke tutmaz yüzey, kolay temizlik, UV'ye dayanıklı, hafif yapı, ekonomik bakım maliyeti. İç ve dış mekan (avlu, teras) kullanımına uygundur. Nem problemi olan zemin altları için idealdir. Hızlı kuruma özelliği büyük avantajdır.",
        link: { href: "/kategori/polipropilen-cami-halisi", label: "Polipropilen koleksiyon" },
      },
      {
        soru: "Polyamid halı neden daha pahalı?",
        cevap:
          "Polyamid (naylon): en yüksek aşınma direnci, en canlı ve kalıcı renkler (Solution Dyed teknolojisi), 20-25 yıl ömür. Hammadde maliyeti akrilik veya polipropilenden yüksektir. Ancak uzun vadede hesaplandığında, daha seyrek değişim gerektirdiği için toplam sahip olma maliyeti benzerdir.",
        link: { href: "/kategori/polyamid-cami-halisi", label: "Polyamid koleksiyon" },
      },
    ],
  },
  {
    baslik: "Bölge ve Nakliye",
    icon: "🚚",
    sorular: [
      {
        soru: "Türkiye geneline teslimat yapılıyor mu?",
        cevap:
          "Evet. Asil Halı, 81 il ve tüm ilçelere teslimat yapmaktadır. Büyük şehirlerde (İstanbul, Ankara, İzmir, Bursa, Kayseri) doğrudan nakliye; diğer illere kargo veya nakliye firmaları aracılığıyla teslimat sağlanmaktadır. Büyük projeler için ücretsiz nakliye imkânı mevcuttur.",
      },
      {
        soru: "Yurt dışı ihracat yapılıyor mu?",
        cevap:
          "Evet. Asil Halı, Almanya, Hollanda, Fransa, Belçika (Avrupa Müslüman toplulukları), Körfez ülkeleri (BAE, Suudi Arabistan, Katar), Kuzey Afrika ve Amerika (New York ofisi) başta olmak üzere 30+ ülkeye ihracat yapmaktadır. İletişim: +1 (212) 390-0506 (New York).",
        link: { href: "/iletisim", label: "Yurt dışı iletişim bilgileri" },
      },
    ],
  },
];

export default async function SSSPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const prefix = locale === "tr" ? "" : `/${locale}`;

  const totalSorular = SSS_KATEGORILER.reduce((acc, k) => acc + k.sorular.length, 0);

  // JSON-LD: FAQPage schema — LLM'ler ve Google için kritik
  const faqLD = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SSS_KATEGORILER.flatMap((kat) =>
      kat.sorular.map((s) => ({
        "@type": "Question",
        name: s.soru,
        acceptedAnswer: {
          "@type": "Answer",
          text: s.cevap,
        },
      }))
    ),
  };

  const breadcrumbLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://camiihalisi.com" },
      { "@type": "ListItem", position: 2, name: "Sık Sorulan Sorular", item: "https://camiihalisi.com/sss" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }} />

      <Navigation locale={locale} />

      <main id="main-content">
        {/* Hero */}
        <section className="bg-[#1B4332] py-16 px-4">
          <div className="container-site">
            <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
              <a href={`${prefix}/`} className="hover:text-white transition-colors">Ana Sayfa</a>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#E4B84A]">Sık Sorulan Sorular</span>
            </nav>
            <div className="flex items-start gap-4">
              <MessageCircleQuestion className="w-10 h-10 text-[#C9972B] flex-shrink-0 mt-1" />
              <div>
                <h1
                  className="text-4xl md:text-5xl font-bold text-white mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Cami Halısı — Sık Sorulan Sorular
                </h1>
                <p className="text-white/70 text-lg max-w-2xl">
                  {totalSorular}+ soru ve Asil Halı uzmanlarının kapsamlı cevapları. 40 yıllık deneyimle hazırlanan rehber.
                </p>
              </div>
            </div>

            {/* Hızlı Kategori Linkleri */}
            <div className="mt-8 flex flex-wrap gap-2">
              {SSS_KATEGORILER.map((kat) => (
                <a
                  key={kat.baslik}
                  href={`#${kat.baslik.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
                  className="px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-medium hover:bg-white/20 transition-all"
                >
                  {kat.icon} {kat.baslik}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* İçerik */}
        <section className="section bg-[#F7F3EC]">
          <div className="container-site">
            <div className="max-w-4xl mx-auto space-y-16">
              {SSS_KATEGORILER.map((kat) => (
                <div
                  key={kat.baslik}
                  id={kat.baslik.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}
                  className="scroll-mt-8"
                >
                  <h2
                    className="text-2xl font-bold text-[#1B4332] mb-2 flex items-center gap-3"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    <span className="text-2xl">{kat.icon}</span>
                    {kat.baslik}
                  </h2>
                  <div className="gold-line mb-6" />

                  <div className="space-y-4">
                    {kat.sorular.map((item, i) => (
                      <details key={i} className="group bg-white rounded-2xl border border-[#DDD8CE] overflow-hidden">
                        <summary className="flex items-start justify-between gap-4 px-6 py-5 cursor-pointer hover:bg-[#F7F3EC]/50 transition-all list-none">
                          <h3 className="font-semibold text-[#1A1A1A] text-base leading-snug pr-4">
                            {item.soru}
                          </h3>
                          <div className="w-6 h-6 rounded-full bg-[#1B4332]/10 flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform group-open:rotate-180">
                            <svg className="w-3 h-3 text-[#1B4332]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </summary>
                        <div className="px-6 pb-5 border-t border-[#EDE8DF]">
                          <p className="text-[#4A4035] leading-relaxed pt-4 text-sm">{item.cevap}</p>
                          {item.link && (
                            <Link
                              href={`${prefix}${item.link.href}`}
                              className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-[#1B4332] hover:text-[#C9972B] transition-colors"
                            >
                              {item.link.label}
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Cevap Bulamadın mı? */}
            <div className="mt-16 max-w-4xl mx-auto bg-[#1B4332] rounded-3xl p-8 text-center text-white">
              <Search className="w-10 h-10 text-[#C9972B] mx-auto mb-4" />
              <h2
                className="text-2xl font-bold mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Sorunuzun Cevabını Bulamadınız mı?
              </h2>
              <p className="text-white/70 mb-6 max-w-lg mx-auto">
                40 yıllık deneyimimizle caminiz için en uygun çözümü birlikte bulalım. Ücretsiz danışmanlık için ulaşın.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="tel:+905323467939" className="btn btn-gold">
                  Hemen Arayın
                </a>
                <a
                  href="https://wa.me/905323467939?text=Cami halısı hakkında bilgi almak istiyorum."
                  target="_blank"
                  rel="noopener"
                  className="btn btn-outline"
                >
                  WhatsApp ile Yazın
                </a>
              </div>
            </div>
          </div>
        </section>

        <CTASection
          variant="gold"
          title="Cami Halısı Siparişi İçin Ücretsiz Teklif Alın"
          subtitle="Ölçü, desen ve bütçenize göre kişiselleştirilmiş fiyat teklifi. 24 saat içinde dönüş."
        />
      </main>

      <Footer locale={locale} />
    </>
  );
}

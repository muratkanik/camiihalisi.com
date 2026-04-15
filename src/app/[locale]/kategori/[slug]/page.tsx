import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, ExternalLink, ChevronRight } from "lucide-react";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CTASection from "@/components/blocks/CTASection";
import FAQSection from "@/components/blocks/FAQSection";

const SITE_URL = "https://camiihalisi.com";
const MAIN_SITE_URL = "https://www.asilhali.com.tr?utm_source=camiihalisi&utm_medium=kategori&utm_campaign=";

interface CategoryData {
  slug: string;
  title: string;
  shortTitle: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  longDescription: string;
  image: string;
  heroImage: string;
  badge: string;
  color: string;
  advantages: string[];
  specs: Array<{ label: string; value: string }>;
  useCases: string[];
  faqs: Array<{ question: string; answer: string }>;
  relatedSlugs: string[];
}

const CATEGORIES: Record<string, CategoryData> = {
  "akrilik-cami-halisi": {
    slug: "akrilik-cami-halisi",
    title: "Akrilik Cami Halısı",
    shortTitle: "Akrilik Halı",
    metaTitle: "Akrilik Cami Halısı | Fiyatları, Çeşitleri ve Özellikleri – Asil Halı",
    metaDescription:
      "Akrilik cami halısı fiyatları, çeşitleri ve özellikleri. Solmaz renk, yumuşak doku, ekonomik fiyat. Özel ölçü üretim, Türkiye geneli teslimat. Asil Halı A.Ş.",
    description:
      "Parlak renkleri, yumuşak dokusu ve ekonomik fiyatıyla Türkiye'de en çok tercih edilen cami halısı türü.",
    longDescription: `
Akrilik cami halısı, sentetik liflerin içinde en yüksek kalite-fiyat oranını sunan tercih olup Türkiye'deki camilerin büyük çoğunluğunda kullanılmaktadır. Yüksek UV direnci sayesinde uzun yıllar solmayan canlı renkler korunur. Caminin genel havasına uygun, özel desen tasarımıyla üretilir.

Akrilik liflerin gözenekli yapısı, cami ortamında oluşabilecek nemi emer ve buharlaştırarak sağlıklı bir zemin sağlar. Günlük cemaat yoğunluğuna dayanacak şekilde üretilen akrilik halılar, düzenli bakım ile 15-20 yıl sorunsuz kullanılabilir.

Asil Halı'nın akrilik serisi; mihrap önünden saf aralarına, merdivenlerden koridor kenarlarına kadar tüm cami alanlarına uygun özel kesim seçenekleriyle sunulmaktadır.
    `,
    image: "/images/cami-1.png",
    heroImage: "/images/cami-hero.png",
    badge: "En Çok Satan",
    color: "#1B4332",
    advantages: [
      "Uzun yıllar solmayan UV dirençli renkler",
      "Yumuşak ve konforlu doku — uzun ibadet seansları için ideal",
      "Nem emici ve hızlı kuruyan yapı",
      "Ekonomik fiyat-performans oranı",
      "Özel desen ve renk seçeneği",
      "Kolay temizlik ve bakım",
      "15-20 yıl kullanım ömrü",
      "Alevlenmeye karşı sertifikalı",
    ],
    specs: [
      { label: "Lif Türü", value: "Akrilik (100%)" },
      { label: "Dokuma Yöntemi", value: "Makine Dokuması" },
      { label: "Hav Yüksekliği", value: "6-10 mm" },
      { label: "Ağırlık", value: "1.800-2.400 gr/m²" },
      { label: "Bağ Yoğunluğu", value: "180.000-350.000 düğüm/m²" },
      { label: "Yangın Sınıfı", value: "Bfl-s1 (EN 13501-1)" },
      { label: "Garanti", value: "5 Yıl" },
      { label: "Üretim Yeri", value: "Türkiye" },
    ],
    useCases: [
      "Küçük ve orta boy mahalle camileri",
      "Belediye ve vakıf camileri",
      "Okul ve üniversite mescitleri",
      "Alış veriş merkezi ve iş yeri mescitleri",
      "Yurt ve öğrenci evi mescitleri",
    ],
    faqs: [
      {
        question: "Akrilik cami halısının ömrü ne kadardır?",
        answer:
          "Kaliteli akrilik cami halısı, düzenli temizlik ve bakımla 15-20 yıl sorunsuz kullanılabilir. Asil Halı ürünleri 5 yıl garantilidir.",
      },
      {
        question: "Akrilik halı mı yün halı mı daha iyi?",
        answer:
          "Bütçe ve kullanım yoğunluğuna göre değişir. Akrilik daha ekonomik ve kolay bakımlıdır; yün ise daha doğal ve uzun ömürlüdür. Her ikisi de cami için uygundur.",
      },
      {
        question: "Özel desen yaptırabilir miyim?",
        answer:
          "Evet. Caminizin mimarisine veya bölgesel geleneğe uygun özel desen tasarımı ücretsiz olarak hazırlanır, onayınızın ardından üretime geçilir.",
      },
      {
        question: "Minimum sipariş miktarı nedir?",
        answer:
          "Minimum sipariş miktarı yoktur. Küçük bir mescit için 10 m² veya büyük bir cami için 5.000 m² sipariş verilebilir.",
      },
    ],
    relatedSlugs: ["yun-cami-halisi", "polipropilen-cami-halisi", "polyamid-cami-halisi"],
  },

  "yun-cami-halisi": {
    slug: "yun-cami-halisi",
    title: "Yün Cami Halısı",
    shortTitle: "Yün Halı",
    metaTitle: "Yün Cami Halısı | Doğal, Dayanıklı, Premium Kalite – Asil Halı",
    metaDescription:
      "Yün cami halısı: doğal lif, uzun ömür, ısı yalıtımı ve doğal nem yönetimi. Premium kalite, özel ölçü üretim. Asil Halı A.Ş. – Türkiye geneli teslimat.",
    description:
      "Doğal yünün sıcaklığı, dayanıklılığı ve neme karşı doğal direnciyle ibadethaneye özel lüks deneyim.",
    longDescription: `
Yün cami halısı, binlerce yıllık gelenekte köklü bir yere sahiptir. Doğal protein lifleri sayesinde yün; ısıyı dengeler, nemi yönetir ve cami ortamının hijyenine katkı sağlar. Sentetik liflere kıyasla çok daha uzun ömürlü olan yün halılar, 25-30 yıl veya daha fazla kullanılabilir.

Yünün doğal kir itici özelliği, yoğun kullanımda bile halının görünümünü uzun süre korur. Üstelik yün, statik elektriği tutmadığı için toz birikmesini önler; bu da ibadet ortamının temizliğine doğrudan katkıda bulunur.

Asil Halı'nın yün serisi; New Zealand ve Türk yününden seçilen en kaliteli hammaddelerle, geleneksel İslami desenlerle üretilmektedir. Büyük camilerin prestijli alanları, mihrap önleri ve imam namaz yerleri için özellikle tavsiye edilir.
    `,
    image: "/images/cami-2.png",
    heroImage: "/images/cami-hero.png",
    badge: "Premium",
    color: "#2D6A4F",
    advantages: [
      "%100 doğal yün, çevre dostu üretim",
      "Doğal ısı ve nem yönetimi",
      "25-30 yıl uzun kullanım ömrü",
      "Doğal kir ve leke direnci",
      "Statik elektriği tutmaz, toz biriktirmez",
      "Yangına karşı doğal direnç",
      "Hipoalerjenik — alerjik reaksiyon riski düşük",
      "Yıllar geçtikçe patina kazanan doku",
    ],
    specs: [
      { label: "Lif Türü", value: "Yün (80-100%)" },
      { label: "Dokuma Yöntemi", value: "El ve Makine Dokuması" },
      { label: "Hav Yüksekliği", value: "8-14 mm" },
      { label: "Ağırlık", value: "2.200-3.500 gr/m²" },
      { label: "Bağ Yoğunluğu", value: "200.000-500.000 düğüm/m²" },
      { label: "Yangın Sınıfı", value: "Bfl-s1 (EN 13501-1)" },
      { label: "Garanti", value: "10 Yıl" },
      { label: "Üretim Yeri", value: "Türkiye" },
    ],
    useCases: [
      "Büyük ve prestijli cami projeleri",
      "Külliye ve tarihi cami restorasyonları",
      "İmam namaz ve mihrap alanları",
      "VIP toplantı salonları ve dini merasim alanları",
      "Yurt dışı ihracat projeleri",
    ],
    faqs: [
      {
        question: "Yün cami halısı nasıl temizlenir?",
        answer:
          "Yün halılar profesyonel kuru temizleme veya soğuk su ile yıkama ile temizlenir. Sıcak su ve ağır deterjanlardan kaçınılmalıdır. Yılda 1-2 kez profesyonel bakım önerilir.",
      },
      {
        question: "Yün halı nem çeker mi?",
        answer:
          "Yün doğal nem yönetimi sağlar; havadan nemi alır ve bırakır, ancak ıslak zemine konmamalıdır. Camide taban nem yalıtımı yapılması önerilir.",
      },
      {
        question: "Yün halının fiyatı akrilikten neden yüksek?",
        answer:
          "Doğal yün hammaddesi daha pahalıdır ve işlenme süreci daha uzundur. Ancak 2-3 kat daha uzun ömrü hesaba katıldığında, uzun vadede daha ekonomik olur.",
      },
    ],
    relatedSlugs: ["akrilik-cami-halisi", "polyamid-cami-halisi", "polipropilen-cami-halisi"],
  },

  "polipropilen-cami-halisi": {
    slug: "polipropilen-cami-halisi",
    title: "Polipropilen Cami Halısı",
    shortTitle: "Polipropilen Halı",
    metaTitle: "Polipropilen Cami Halısı | Dayanıklı, Kolay Temizlik – Asil Halı",
    metaDescription:
      "Polipropilen cami halısı: leke tutmaz, kolay temizlenir, yüksek trafik alanları için ideal. Modern teknoloji, ekonomik fiyat. Asil Halı A.Ş.",
    description:
      "Yüksek trafik alanları için üretilmiş, kolay temizlenen ve leke tutmayan modern polipropilen teknoloji.",
    longDescription: `
Polipropilen (PP) cami halısı, sentetik liflerin içinde en yüksek kimyasal dirence sahip olanıdır. Nem ve su tutmayan yapısı sayesinde leke riski minimumdur; sıvılar yüzeyden kolaylıkla temizlenir. Bu özelliği, çok sayıda cemaatin kullandığı yoğun trafik camilerinde büyük avantaj sağlar.

Polipropilen halılar UV ışınlarına karşı da dayanıklıdır; renk solması minimum düzeydedir. Hafif yapısı sayesinde kurulum ve taşıma kolaylığı sağlar. Isıya ve güneş ışığına karşı dirençli olduğu için açık avlu, teras ve dış mekan kullanım alanları için de uygundur.

Asil Halı'nın polipropilen serisi, özellikle büyük şehirlerdeki kalabalık camilerde ve sürekli kullanım gerektiren alanlarda üstün performans göstermektedir.
    `,
    image: "/images/cami-3.png",
    heroImage: "/images/cami-hero.png",
    badge: "Dayanıklı",
    color: "#1B4332",
    advantages: [
      "Su ve neme karşı üstün direnç",
      "Leke tutmaz yüzey — kolay temizlik",
      "Yüksek aşınma direnci",
      "UV'ye dayanıklı, solmaz renkler",
      "Hafif yapı — kolay kurulum",
      "İç ve dış mekan kullanımına uygun",
      "Ekonomik uzun vadeli bakım maliyeti",
      "Hızlı kuruma özelliği",
    ],
    specs: [
      { label: "Lif Türü", value: "Polipropilen (PP) 100%" },
      { label: "Dokuma Yöntemi", value: "Makine Dokuması (BCF)" },
      { label: "Hav Yüksekliği", value: "5-8 mm" },
      { label: "Ağırlık", value: "1.500-2.000 gr/m²" },
      { label: "Su Geçirmezlik", value: "Yüksek (Hidrofobik)" },
      { label: "Yangın Sınıfı", value: "Bfl-s1 (EN 13501-1)" },
      { label: "Garanti", value: "5 Yıl" },
      { label: "Üretim Yeri", value: "Türkiye" },
    ],
    useCases: [
      "Yüksek yoğunluklu şehir camileri",
      "Cami girişleri ve koridorlar",
      "Cami avlusu ve dış mekan alanları",
      "Kışlık cami alanları ve ısıtmalı zeminler",
      "Bütçe kısıtlı büyük alanlar",
    ],
    faqs: [
      {
        question: "Polipropilen halı ısıya dayanıklı mıdır?",
        answer:
          "Standart cami sıcaklıklarında (–20°C ile +40°C) sorunsuz kullanılır. Radyant ısıtma sistemleri için özel alt taban önerilir.",
      },
      {
        question: "Polipropilen cami halısı nasıl temizlenir?",
        answer:
          "Su ve hafif deterjanla kolayca temizlenir. Buhar makinesiyle yıkamaya uygundur. Endüstriyel temizlik makineleriyle de kullanılabilir.",
      },
    ],
    relatedSlugs: ["akrilik-cami-halisi", "polyamid-cami-halisi", "yun-cami-halisi"],
  },

  "polyamid-cami-halisi": {
    slug: "polyamid-cami-halisi",
    title: "Polyamid Cami Halısı",
    shortTitle: "Polyamid Halı",
    metaTitle: "Polyamid Cami Halısı | En Yüksek Aşınma Direnci – Asil Halı",
    metaDescription:
      "Polyamid (naylon) cami halısı: en yüksek aşınma direnci, canlı renkler, büyük cami projeleri için profesyonel çözüm. Asil Halı A.Ş.",
    description:
      "Sentetik liflerin en kalitelisi. Yüksek aşınma direnci ve canlı renklerle büyük camilerin tercihi.",
    longDescription: `
Polyamid (naylon) cami halısı, sentetik halı liflerinin içinde en yüksek aşınma direncine sahip olanıdır. Özellikle on binlerce kişinin haftalık olarak kullandığı büyük camilerde, bu özellik belirleyici öneme sahiptir. Polyamid lifler, yoğun baskı altında şeklini ve görünümünü uzun yıllar korur.

Boyama sürecindeki üstün renk tutma kapasitesi sayesinde polyamid halılar, en canlı ve derin renk tonlarını yıllarca muhafaza eder. İslami mimarinin görkemli desenlerini en iyi yansıtan halı türü olarak büyük cami projelerinde profesyonellerin tercihidir.

Asil Halı polyamid serisi; Solution Dyed Nylon (SDN) teknolojiyle üretilerek renk haslığı garanti altına alınmıştır. Büyük cami ihale projeleri ve uluslararası projelerde yaygın olarak kullanılmaktadır.
    `,
    image: "/images/cami-4.png",
    heroImage: "/images/cami-hero.png",
    badge: "Profesyonel",
    color: "#2D6A4F",
    advantages: [
      "En yüksek aşınma direnci — milyonlarca adım",
      "Solution Dyed teknolojisi ile solmaz renkler",
      "Derin ve canlı desen kalitesi",
      "Antistatic özellik — bakım kolaylığı",
      "Kimyasal ve deterjan direnci",
      "Ağır trafik sertifikasyonu",
      "İhale ve büyük proje uyumlu",
      "Uluslararası ihracat kalitesi",
    ],
    specs: [
      { label: "Lif Türü", value: "Polyamid / Naylon (PA6 veya PA6.6)" },
      { label: "Dokuma Yöntemi", value: "Solution Dyed BCF" },
      { label: "Hav Yüksekliği", value: "6-12 mm" },
      { label: "Ağırlık", value: "2.000-3.200 gr/m²" },
      { label: "Bağ Yoğunluğu", value: "250.000-600.000 düğüm/m²" },
      { label: "Yangın Sınıfı", value: "Bfl-s1 (EN 13501-1)" },
      { label: "Garanti", value: "10 Yıl" },
      { label: "Üretim Yeri", value: "Türkiye" },
    ],
    useCases: [
      "Büyük şehir camileri (Cuma ve bayram namazı kalabalığı)",
      "Diyanet İşleri ve vakıf büyük projeleri",
      "Uluslararası ihracat projeleri",
      "Havalimanı ve otel mescitleri",
      "Büyük külliye projeleri",
    ],
    faqs: [
      {
        question: "Polyamid ile polipropilen arasındaki fark nedir?",
        answer:
          "Polyamid daha yüksek aşınma direncine ve daha canlı renk tutma kapasitesine sahiptir; ancak fiyatı daha yüksektir. Polipropilen ise neme karşı daha dirençlidir ve daha ekonomiktir.",
      },
      {
        question: "Solution Dyed Nylon nedir?",
        answer:
          "Rengin lifin içine işlendiği üretim yöntemidir. Klasik boyamadan farklı olarak, renk yüzeyde değil lifin içindedir. Bu sayede UV, kimyasal ve mekanik etkilere karşı üstün renk haslığı sağlanır.",
      },
    ],
    relatedSlugs: ["yun-cami-halisi", "akrilik-cami-halisi", "polipropilen-cami-halisi"],
  },
};

const CATEGORY_NAMES: Record<string, string> = {
  "akrilik-cami-halisi": "Akrilik Cami Halısı",
  "yun-cami-halisi": "Yün Cami Halısı",
  "polipropilen-cami-halisi": "Polipropilen Cami Halısı",
  "polyamid-cami-halisi": "Polyamid Cami Halısı",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES[slug];
  if (!cat) return { title: "Kategori bulunamadı" };

  return {
    title: cat.metaTitle,
    description: cat.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/kategori/${slug}`,
    },
    openGraph: {
      title: cat.metaTitle,
      description: cat.metaDescription,
      images: [{ url: `${SITE_URL}${cat.image}`, width: 1200, height: 630 }],
    },
  };
}

export function generateStaticParams() {
  return Object.keys(CATEGORIES).flatMap((slug) =>
    ["tr", "en", "ar", "fr"].map((locale) => ({ locale, slug }))
  );
}

export default async function KategoriPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const cat = CATEGORIES[slug];
  if (!cat) notFound();

  const prefix = locale === "tr" ? "" : `/${locale}`;

  // JSON-LD: Product + BreadcrumbList
  const productLD = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: cat.title,
    description: cat.description,
    image: `${SITE_URL}${cat.image}`,
    brand: {
      "@type": "Brand",
      name: "Asil Halı A.Ş.",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Asil Halı A.Ş.",
      url: "https://www.asilhali.com.tr",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Asil Halı A.Ş.",
      },
      priceCurrency: "TRY",
      priceSpecification: {
        "@type": "PriceSpecification",
        description: "Fiyat teklifi için iletişime geçin",
      },
    },
  };

  const breadcrumbLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Kategoriler", item: `${SITE_URL}/kategori` },
      { "@type": "ListItem", position: 3, name: cat.title, item: `${SITE_URL}/kategori/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }} />

      <Navigation locale={locale} />

      <main id="main-content">
        {/* ── Hero Bölümü ── */}
        <section className="relative h-[60vh] min-h-[400px] max-h-[600px] flex items-end overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={cat.heroImage}
              alt={cat.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0D2418]/95 via-[#0D2418]/50 to-transparent" />

          <div className="relative z-20 container-site pb-12 w-full">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-4" aria-label="Breadcrumb">
              <Link href={`${prefix}/`} className="hover:text-white transition-colors">Ana Sayfa</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white/60">Ürünler</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#E4B84A]">{cat.shortTitle}</span>
            </nav>

            <span className="badge bg-[#C9972B]/20 text-[#E4B84A] border border-[#C9972B]/30 mb-3">
              {cat.badge}
            </span>
            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {cat.title}
            </h1>
            <p className="text-lg text-white/80 max-w-2xl">
              {cat.description}
            </p>
          </div>
        </section>

        {/* ── İçerik ── */}
        <section className="section bg-[#F7F3EC]">
          <div className="container-site">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Sol: Detay */}
              <div className="lg:col-span-2 space-y-10">
                {/* Uzun Açıklama */}
                <div>
                  <h2 className="section-title mb-4">{cat.title} Hakkında</h2>
                  <div className="gold-line mb-6" />
                  <div className="prose prose-sm max-w-none text-[#6B6355] leading-relaxed space-y-4">
                    {cat.longDescription.trim().split("\n\n").map((para, i) => (
                      <p key={i}>{para.trim()}</p>
                    ))}
                  </div>
                </div>

                {/* Avantajlar */}
                <div>
                  <h2
                    className="text-2xl font-bold text-[#1B4332] mb-5"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Avantajlar ve Özellikler
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {cat.advantages.map((adv, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#DDD8CE]">
                        <div className="w-5 h-5 rounded-full bg-[#1B4332]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-[#1B4332]" aria-hidden="true" />
                        </div>
                        <span className="text-sm text-[#1A1A1A] leading-snug">{adv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Kullanım Alanları */}
                <div>
                  <h2
                    className="text-2xl font-bold text-[#1B4332] mb-5"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Kullanım Alanları
                  </h2>
                  <ul className="space-y-2.5">
                    {cat.useCases.map((uc, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm text-[#6B6355]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9972B] flex-shrink-0" />
                        {uc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sağ: Teknik Özellikler + CTA */}
              <div className="space-y-6">
                {/* Teknik Kart */}
                <div className="bg-white rounded-2xl border border-[#DDD8CE] overflow-hidden">
                  <div
                    className="p-5"
                    style={{ background: `${cat.color}12`, borderBottom: `1px solid ${cat.color}20` }}
                  >
                    <h3
                      className="font-bold text-[#1B4332] text-lg"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      Teknik Özellikler
                    </h3>
                  </div>
                  <div className="divide-y divide-[#EDE8DF]">
                    {cat.specs.map((spec, i) => (
                      <div key={i} className="flex items-start justify-between gap-4 px-5 py-3.5">
                        <span className="text-xs text-[#6B6355] font-medium">{spec.label}</span>
                        <span className="text-xs text-[#1A1A1A] font-semibold text-right">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Teklif CTA Kartı */}
                <div className="bg-[#1B4332] rounded-2xl p-6 text-white">
                  <h3
                    className="text-xl font-bold text-white mb-2"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Fiyat Teklifi Alın
                  </h3>
                  <p className="text-sm text-white/70 mb-5 leading-relaxed">
                    Caminizin ölçülerine göre ücretsiz fiyat teklifi ve danışmanlık hizmeti.
                  </p>
                  <a
                    href={`${MAIN_SITE_URL}${slug}`}
                    target="_blank"
                    rel="noopener"
                    className="btn btn-gold w-full justify-center text-sm"
                  >
                    Teklif Al — asilhali.com.tr
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="tel:+902125551234"
                    className="btn btn-outline w-full justify-center text-sm mt-3"
                  >
                    Hemen Arayın
                  </a>
                </div>

                {/* İlgili Kategoriler */}
                <div className="bg-[#F7F3EC] rounded-2xl border border-[#DDD8CE] p-5">
                  <h3
                    className="font-bold text-[#1B4332] mb-4"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Diğer Kategoriler
                  </h3>
                  <div className="space-y-2">
                    {cat.relatedSlugs.map((rel) => (
                      <Link
                        key={rel}
                        href={`${prefix}/kategori/${rel}`}
                        className="flex items-center justify-between px-4 py-2.5 bg-white rounded-xl border border-[#DDD8CE] hover:border-[#C9972B]/40 hover:shadow-sm transition-all text-sm font-medium text-[#1A1A1A] hover:text-[#1B4332]"
                      >
                        {CATEGORY_NAMES[rel]}
                        <ArrowRight className="w-3.5 h-3.5 text-[#C9972B]" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SSS */}
        <FAQSection faqs={cat.faqs} title={`${cat.title} — Sık Sorulan Sorular`} />

        {/* CTA */}
        <CTASection
          variant="green"
          title={`${cat.title} Siparişi İçin Hemen İletişime Geçin`}
          subtitle="Asil Halı uzmanları caminizin ölçülerine ve ihtiyaçlarına göre en uygun çözümü sunmak için hazır."
        />
      </main>

      <Footer locale={locale} />
    </>
  );
}

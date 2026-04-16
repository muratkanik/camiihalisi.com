import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { ChevronRight, Check, X, Minus } from "lucide-react";
import Navigation from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import CTASection from "@/components/blocks/CTASection";

const SITE_URL = "https://camiihalisi.com";

type Score = 1 | 2 | 3 | 4 | 5;
type Verdict = "a" | "b" | "tie";

interface ComparisonRow {
  kriter: string;
  aScore: Score;
  bScore: Score;
  aAciklama: string;
  bAciklama: string;
}

interface ComparisonData {
  slug: string;
  title: string;
  metaTitle: string;
  metaDesc: string;
  a: { isim: string; slug: string; image: string; renk: string };
  b: { isim: string; slug: string; image: string; renk: string };
  ozet: string;
  kriterler: ComparisonRow[];
  sonuc: { verdict: Verdict; mesaj: string; aKim: string; bKim: string };
  sss: Array<{ soru: string; cevap: string }>;
}

const COMPARISONS: Record<string, ComparisonData> = {
  "akrilik-vs-yun-cami-halisi": {
    slug: "akrilik-vs-yun-cami-halisi",
    title: "Akrilik vs Yün Cami Halısı: Hangisi Daha İyi?",
    metaTitle: "Akrilik vs Yün Cami Halısı Karşılaştırması 2025 | Asil Halı",
    metaDesc: "Akrilik mi yün mü cami halısı? Fiyat, ömür, bakım, desen, yangın güvenliği — tüm kriterlerde tarafsız karşılaştırma. Uzman tavsiyeleri ile.",
    a: { isim: "Akrilik", slug: "akrilik-cami-halisi", image: "/images/cami-katalog-01.png", renk: "#1B4332" },
    b: { isim: "Yün", slug: "yun-cami-halisi", image: "/images/cami-katalog-05.png", renk: "#2D6A4F" },
    ozet: "Akrilik ve yün, Türkiye'deki camilerde en yaygın kullanılan iki halı türüdür. Akrilik; ekonomik fiyatı, canlı renkleri ve kolay bakımıyla geniş kitlelere hitap ederken, yün; doğal yapısı, uzun ömrü ve ısı yalıtımıyla prestijli projelerin tercihi olmaya devam etmektedir.",
    kriterler: [
      { kriter: "Fiyat (m²)", aScore: 5, bScore: 2, aAciklama: "Yüne göre 2-4 kat daha ekonomik; geniş bütçe aralığı", bAciklama: "Hammadde ve işleme maliyeti yüksek; premium segment" },
      { kriter: "Kullanım Ömrü", aScore: 3, bScore: 5, aAciklama: "Düzenli bakımla 15-20 yıl", bAciklama: "25-30 yıl ve üzeri; kaliteli yün yarım asır dayanabilir" },
      { kriter: "Renk Canlılığı", aScore: 5, bScore: 4, aAciklama: "Parlak ve canlı; UV'ye dayanıklı pigmentler", bAciklama: "Doğal ve zengin tonlar; UV'de hafif matlaşma olabilir" },
      { kriter: "Bakım Kolaylığı", aScore: 5, bScore: 3, aAciklama: "Kolay temizlenir; makine yıkaması mümkün", bAciklama: "Soğuk su, pH nötr deterjan gerektirir; özel bakım" },
      { kriter: "Yumuşaklık & Konfor", aScore: 4, bScore: 5, aAciklama: "Orta düzey yumuşaklık; kaliteli akrilikte iyi konfor", bAciklama: "Doğal yünün eşsiz yumuşaklığı; uzun namazda konfor" },
      { kriter: "Isı Yalıtımı", aScore: 3, bScore: 5, aAciklama: "Orta düzey; zemin soğukluğunu kısmen engeller", bAciklama: "Üstün doğal ısı yalıtımı; kış aylarında büyük avantaj" },
      { kriter: "Nem Yönetimi", aScore: 3, bScore: 5, aAciklama: "Orta düzey; kuruma hızlı", bAciklama: "Doğal nem emip bırakır; ancak ıslak zemine konulmamalı" },
      { kriter: "Yangın Güvenliği", aScore: 4, bScore: 5, aAciklama: "EN 13501-1 Bfl-s1 sertifikalı", bAciklama: "Doğal yangın direnci + sertifika; güvenlik avantajı" },
      { kriter: "Çevre Dostu", aScore: 2, bScore: 5, aAciklama: "Sentetik; geri dönüşüm sınırlı", bAciklama: "%100 doğal lif; biyobozunur" },
      { kriter: "Desen Seçeneği", aScore: 5, bScore: 5, aAciklama: "Saflı, göbekli, seccadeli; sınırsız renk", bAciklama: "Saflı, göbekli, seccadeli; geleneksel İslami desenler" },
    ],
    sonuc: {
      verdict: "tie",
      mesaj: "Her iki seçenek de güçlü avantajlara sahip. Bütçe önceliğinizse akrilik, uzun vadeli yatırım ve doğallık istiyorsanız yün doğru tercihtir.",
      aKim: "Orta ve küçük boy camiler, sınırlı bütçe, kolay bakım isteyenler",
      bKim: "Büyük prestijli camiler, uzun vadeli yatırım, doğal lif önceliği",
    },
    sss: [
      { soru: "Akrilik mi yün mü daha pahalı?", cevap: "Yün akrilikten 2-4 kat daha pahalıdır. Ancak yün 25-30 yıl dayanırken akrilik 15-20 yıl dayanır. Uzun vadede hesaplandığında yünün m² başına yıllık maliyeti akriliklere yakın veya daha düşük olabilir." },
      { soru: "Yün halı küçük camiler için uygun mu?", cevap: "Teknik olarak uygun, ancak maliyet açısından genellikle büyük ve prestijli camiler için önerilir. 200 m² altı camiler için akrilik daha iyi bir maliyet-fayda oranı sunar." },
      { soru: "Akrilik halı gerçekten 15-20 yıl dayanır mı?", cevap: "Kaliteli akrilik (min. 180.000 düğüm/m²), doğru altlık ve yılda 1-2 profesyonel yıkama ile 15-20 yıl dayanır. Ucuz akrilik ürünler 5-7 yılda eskiyebilir." },
    ],
  },

  "polipropilen-vs-polyamid-cami-halisi": {
    slug: "polipropilen-vs-polyamid-cami-halisi",
    title: "Polipropilen vs Polyamid Cami Halısı: Detaylı Karşılaştırma",
    metaTitle: "Polipropilen vs Polyamid Cami Halısı 2025 | Asil Halı",
    metaDesc: "Polipropilen mi polyamid mi? Leke tutmazlık, aşınma direnci, renk kalıcılığı — tüm kriterlerde uzman karşılaştırması. Caminiz için doğru seçim.",
    a: { isim: "Polipropilen", slug: "polipropilen-cami-halisi", image: "/images/cami-katalog-09.png", renk: "#1B4332" },
    b: { isim: "Polyamid", slug: "polyamid-cami-halisi", image: "/images/cami-katalog-13.png", renk: "#0D2418" },
    ozet: "Polipropilen ve polyamid, modern cami projelerinin iki önemli sentetik lif seçeneğidir. Polipropilen su ve leke direnciyle, polyamid ise üstün aşınma direnci ve renk kalıcılığıyla öne çıkar.",
    kriterler: [
      { kriter: "Fiyat (m²)", aScore: 4, bScore: 2, aAciklama: "Ekonomik; geniş proje bütçelerine uygun", bAciklama: "Yüksek hammadde maliyeti; premium fiyat aralığı" },
      { kriter: "Aşınma Direnci", aScore: 3, bScore: 5, aAciklama: "İyi; standart yoğunluklu camiler için yeterli", bAciklama: "Sentetik lifler arasında en yüksek aşınma direnci" },
      { kriter: "Renk Kalıcılığı", aScore: 4, bScore: 5, aAciklama: "İyi UV direnci; zamanla hafif solabilir", bAciklama: "SDN teknolojisi ile 20+ yıl renk garantisi" },
      { kriter: "Su & Leke Direnci", aScore: 5, bScore: 4, aAciklama: "Hidrofobik yapı; sıvı yüzeyde kalır", bAciklama: "İyi leke direnci; SDN ile kimyasal dayanım yüksek" },
      { kriter: "Kullanım Ömrü", aScore: 3, bScore: 5, aAciklama: "15-20 yıl standart kullanım", bAciklama: "20-25 yıl; ihale projelerinin tercihi" },
      { kriter: "Dış Mekan Kullanımı", aScore: 5, bScore: 3, aAciklama: "Avlu ve açık teras için ideal; UV ve neme dayanıklı", bAciklama: "İç mekan için optimize; dış mekanda sınırlı" },
      { kriter: "Desen Kalitesi", aScore: 3, bScore: 5, aAciklama: "Orta düzey desen detayı", bAciklama: "En yüksek desen netliği; SDN ile derin renkler" },
    ],
    sonuc: {
      verdict: "b",
      mesaj: "Uzun vadeli proje ve en yüksek kalite için polyamid; dış mekan, nemli alan veya bütçe kısıtlı projeler için polipropilen önerilir.",
      aKim: "Dış mekan & avlu, yüksek trafik + nem sorunu, bütçe odaklı büyük projeler",
      bKim: "Büyük şehir camileri, ihale projeleri, maximum kalite & uzun ömür",
    },
    sss: [
      { soru: "Polipropilen halı dışarıda kullanılabilir mi?", cevap: "Evet. Polipropilen, UV'ye ve neme karşı yüksek direnciyle cami avlusu, teras ve açık alanlar için idealdir. Polyamid bu amaçla önerilmez." },
      { soru: "SDN (Solution Dyed Nylon) nedir?", cevap: "Boyayı lifin dışına değil içine işleyen teknoloji. Klasik boyamadan çok daha dayanıklı; UV, kimyasal ve mekanik etkilere karşı üstün renk kalıcılığı sağlar. Polyamid cami halılarında kullanılır." },
    ],
  },

  "akrilik-vs-polipropilen-cami-halisi": {
    slug: "akrilik-vs-polipropilen-cami-halisi",
    title: "Akrilik vs Polipropilen Cami Halısı Karşılaştırması",
    metaTitle: "Akrilik vs Polipropilen Cami Halısı | Asil Halı",
    metaDesc: "Akrilik mi polipropilen mi? Renk, konfor, su direnci, fiyat — cami halısı seçiminde iki popüler seçeneğin kapsamlı karşılaştırması.",
    a: { isim: "Akrilik", slug: "akrilik-cami-halisi", image: "/images/cami-katalog-01.png", renk: "#1B4332" },
    b: { isim: "Polipropilen", slug: "polipropilen-cami-halisi", image: "/images/cami-katalog-09.png", renk: "#2D6A4F" },
    ozet: "Akrilik ve polipropilen, orta bütçeli cami projelerinin iki favorisidir. Akrilik daha parlak renk ve yumuşak dokusuyla öne çıkarken, polipropilen su ve leke direnciyle pratik bir seçenek sunar.",
    kriterler: [
      { kriter: "Renk Canlılığı", aScore: 5, bScore: 3, aAciklama: "Parlak, canlı renkler; yüne yakın görünüm", bAciklama: "Orta düzey renk; UV'de hafif solar" },
      { kriter: "Su & Leke Direnci", aScore: 3, bScore: 5, aAciklama: "Orta düzey; nemli ortamlarda dikkat", bAciklama: "Hidrofobik; sıvı yüzeyde kalır, kolay silinir" },
      { kriter: "Yumuşaklık", aScore: 5, bScore: 3, aAciklama: "Yumuşak doku; uzun namazda konfor", bAciklama: "Daha sert his; daha az konforlu" },
      { kriter: "Dış Mekan", aScore: 2, bScore: 5, aAciklama: "İç mekan için tasarlanmış", bAciklama: "Avlu ve açık alan için ideal" },
      { kriter: "Fiyat", aScore: 4, bScore: 4, aAciklama: "Benzer fiyat aralığı; biraz daha pahalı", bAciklama: "Benzer fiyat aralığı; biraz daha ekonomik" },
      { kriter: "Kullanım Ömrü", aScore: 4, bScore: 4, aAciklama: "15-20 yıl", bAciklama: "15-20 yıl" },
    ],
    sonuc: {
      verdict: "tie",
      mesaj: "İç mekan için akrilik daha konforlu; nemli ortam veya dış mekan için polipropilen daha uygun. Desen rengi önemliyse akrilik tercih edin.",
      aKim: "İç mekan, konfor önceliği, canlı renkler",
      bKim: "Dış mekan, nemli ortam, leke tutmazlık önceliği",
    },
    sss: [
      { soru: "Akrilik ve polipropilen fiyatları benzer mi?", cevap: "Evet, iki tür genellikle benzer fiyat aralığındadır. Fiyat farkı, bağ yoğunluğu ve desen karmaşıklığına göre değişir." },
    ],
  },

  "yun-vs-polyamid-cami-halisi": {
    slug: "yun-vs-polyamid-cami-halisi",
    title: "Yün vs Polyamid Cami Halısı: Premium Seçenekler",
    metaTitle: "Yün vs Polyamid Cami Halısı Karşılaştırması | Asil Halı",
    metaDesc: "Doğal yün mü sentetik polyamid mi? Büyük prestijli cami projeleri için iki premium seçeneğin tarafsız karşılaştırması.",
    a: { isim: "Yün", slug: "yun-cami-halisi", image: "/images/cami-katalog-05.png", renk: "#2D6A4F" },
    b: { isim: "Polyamid", slug: "polyamid-cami-halisi", image: "/images/cami-katalog-13.png", renk: "#0D2418" },
    ozet: "Yün ve polyamid, büyük ve prestijli cami projelerinin iki premium seçeneğidir. Yün doğalllığı ve geleneksel değerleriyle, polyamid ise teknolojik üstünlüğü ve renk kalıcılığıyla öne çıkar.",
    kriterler: [
      { kriter: "Doğallık & Prestij", aScore: 5, bScore: 2, aAciklama: "Binlerce yıllık gelenek; doğal ve organik", bAciklama: "Sentetik; modern teknoloji, geleneksel değil" },
      { kriter: "Renk Kalıcılığı", aScore: 4, bScore: 5, aAciklama: "İyi; zamanla hafif doğal matlık", bAciklama: "SDN teknolojisi ile 20+ yıl garanti" },
      { kriter: "Aşınma Direnci", aScore: 4, bScore: 5, aAciklama: "Doğal lif direnci; yüksek kalitede mükemmel", bAciklama: "Sentetik lifler arasında en yüksek aşınma direnci" },
      { kriter: "Isı & Nem Yönetimi", aScore: 5, bScore: 3, aAciklama: "Doğal ısı regülasyonu; eşsiz nem yönetimi", bAciklama: "Orta düzey; ısı yalıtımı sınırlı" },
      { kriter: "Kullanım Ömrü", aScore: 5, bScore: 5, aAciklama: "25-30+ yıl; kaliteli yün yarım asır", bAciklama: "20-25 yıl; ihale garantileri" },
      { kriter: "Çevre Dostu", aScore: 5, bScore: 2, aAciklama: "%100 doğal, biyobozunur", bAciklama: "Sentetik; geri dönüşüm sınırlı" },
      { kriter: "Bakım", aScore: 3, bScore: 4, aAciklama: "Özel bakım gerektirir; soğuk su, pH nötr", bAciklama: "Daha kolay; SDN ile kimyasal dayanım" },
      { kriter: "Fiyat", aScore: 2, bScore: 3, aAciklama: "En pahalı seçenek", bAciklama: "Pahalı ama yünden biraz daha ekonomik" },
    ],
    sonuc: {
      verdict: "tie",
      mesaj: "Tarihi ve prestijli camiler için yün; ihale projeleri ve teknoloji önceliği için polyamid önerilir. Her ikisi de uzun vadede ekonomiktir.",
      aKim: "Tarihi cami restorasyonları, doğallık önceliği, geleneksel değerler",
      bKim: "İhale projeleri, büyük şehir camileri, renk garantisi önceliği",
    },
    sss: [
      { soru: "Büyük şehir camisi için yün mü polyamid mi?", cevap: "Büyük şehir camilerinin yoğun trafiği için her iki seçenek de uygundur. İhale şartnameleri varsa polyamid sertifika avantajı sunar; tarihî veya restore edilen camiler için yün daha uygun görünür." },
    ],
  },

  "safli-vs-gobekli-vs-seccadeli": {
    slug: "safli-vs-gobekli-vs-seccadeli",
    title: "Saflı vs Göbekli vs Seccadeli Cami Halısı Desenleri",
    metaTitle: "Saflı, Göbekli, Seccadeli Cami Halısı Desen Karşılaştırması | Asil Halı",
    metaDesc: "Saflı mı göbekli mi seccadeli mi? Üç temel cami halısı deseninin detaylı karşılaştırması. Hangi desen caminize uygun? Asil Halı uzmanları anlatıyor.",
    a: { isim: "Saflı", slug: "safli-akrilik-cami-halisi", image: "/images/cami-katalog-02.png", renk: "#1B4332" },
    b: { isim: "Göbekli", slug: "gobekli-akrilik-cami-halisi", image: "/images/cami-katalog-03.png", renk: "#2D6A4F" },
    ozet: "Saflı, göbekli ve seccadeli; Türkiye'deki camilerde en yaygın üç desen türüdür. Her biri farklı ihtiyaçlara ve cami mimarilerine hitap eder.",
    kriterler: [
      { kriter: "Namaz Hizalaması", aScore: 5, bScore: 3, aAciklama: "Saf çizgileri cemaati mükemmel hizalar", bAciklama: "Görsel merkez sağlar; saf çizgisi yok" },
      { kriter: "Estetik Etki", aScore: 4, bScore: 5, aAciklama: "Sade ve düzenli; geleneksel görünüm", bAciklama: "Dekoratif göbek; görsel zenginlik" },
      { kriter: "Büyük Camiler", aScore: 5, bScore: 5, aAciklama: "Tüm büyüklüklerde ideal", bAciklama: "Yüksek tavanlı büyük alanlarda çarpıcı" },
      { kriter: "Küçük Camiler", aScore: 4, bScore: 3, aAciklama: "Küçük alanlarda da düzenli görünüm", bAciklama: "Küçük alanlarda göbek orantısız görünebilir" },
      { kriter: "Bireysel Alan Belirleme", aScore: 2, bScore: 2, aAciklama: "Saf belirler ama bireysel alan yok", bAciklama: "Bireysel alan belirlenmez" },
      { kriter: "Temizlik Kolaylığı", aScore: 5, bScore: 4, aAciklama: "Düz çizgiler; leke tespiti kolay", bAciklama: "Merkez motif kir gizler; avantajlı" },
    ],
    sonuc: {
      verdict: "tie",
      mesaj: "Namaz düzeni öncelikliyse saflı; görsel etki önemliyse göbekli; cemaatin kendi namazlık alanını belirlemesi isteniyorsa seccadeli tercih edilmeli.",
      aKim: "Namaz hizalaması önceliği, sade estetik, tüm cami büyüklükleri",
      bKim: "Dekoratif etki, büyük ve yüksek tavanlı camiler, prestijli projeler",
    },
    sss: [
      { soru: "Seccadeli halı gerçekten her cemaatin yerini belirler mi?", cevap: "Evet, seccadeli halılarda her namaz pozisyonu için bireysel namazlık motifi işlenir. Bu sayede cemaat kendi alanını kolaylıkla görebilir. Okul mescitleri ve yurt camilerinde özellikle tercih edilir." },
      { soru: "Göbekli halı küçük camide nasıl görünür?", cevap: "Göbek motifleri büyük alanlarda etkileyiciyken, küçük alanlarda (50 m² altı) orantısız görünebilir. Bu durumda saflı veya seccadeli desen daha uygun olabilir." },
    ],
  },
};

function ScoreBar({ score, color }: { score: Score; color: string }) {
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-2 w-5 rounded-full"
          style={{ background: i <= score ? color : "#E5E7EB" }}
        />
      ))}
      <span className="text-xs font-bold ml-1" style={{ color }}>{score}/5</span>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = COMPARISONS[slug];
  if (!c) return { title: "Karşılaştırma bulunamadı" };
  return {
    title: c.metaTitle,
    description: c.metaDesc,
    alternates: { canonical: `${SITE_URL}/karsilastirma/${slug}` },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDesc,
      images: [{ url: `${SITE_URL}${c.a.image}` }],
    },
  };
}

export function generateStaticParams() {
  return Object.keys(COMPARISONS).flatMap((slug) =>
    ["tr"].map((locale) => ({ locale, slug }))
  );
}

export default async function KarsilastirmaPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const c = COMPARISONS[slug];
  if (!c) notFound();

  const prefix = locale === "tr" ? "" : `/${locale}`;

  // JSON-LD
  const faqLD = c.sss.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.sss.map((s) => ({
      "@type": "Question",
      name: s.soru,
      acceptedAnswer: { "@type": "Answer", text: s.cevap },
    })),
  } : null;

  const verdictScore = (() => {
    if (c.sonuc.verdict === "a") return { winner: c.a.isim, color: c.a.renk };
    if (c.sonuc.verdict === "b") return { winner: c.b.isim, color: c.b.renk };
    return null;
  })();

  return (
    <>
      {faqLD && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }} />}

      <Navigation locale={locale} />
      <main id="main-content">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#1B4332] to-[#0D2418] py-14 px-4">
          <div className="container-site">
            <nav className="flex items-center gap-2 text-sm text-white/50 mb-6 flex-wrap">
              <a href={`${prefix}/`} className="hover:text-white">Ana Sayfa</a>
              <ChevronRight className="w-3.5 h-3.5" />
              <a href={`${prefix}/karsilastirma`} className="hover:text-white">Karşılaştırma</a>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#E4B84A]">{c.a.isim} vs {c.b.isim}</span>
            </nav>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {c.title}
            </h1>
            <p className="text-white/70 text-lg max-w-2xl">{c.ozet}</p>

            {/* Karşılaştırma Görseli */}
            <div className="mt-8 flex items-center gap-4 max-w-md">
              <div className="flex-1 rounded-2xl overflow-hidden border-2 border-white/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.a.image} alt={c.a.isim} className="w-full aspect-video object-cover" />
                <div className="px-3 py-2 text-center" style={{ background: c.a.renk }}>
                  <p className="text-white font-bold text-sm">{c.a.isim}</p>
                </div>
              </div>
              <div className="text-white/60 font-black text-2xl">VS</div>
              <div className="flex-1 rounded-2xl overflow-hidden border-2 border-white/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.b.image} alt={c.b.isim} className="w-full aspect-video object-cover" />
                <div className="px-3 py-2 text-center" style={{ background: c.b.renk }}>
                  <p className="text-white font-bold text-sm">{c.b.isim}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Karşılaştırma Tablosu */}
        <section className="section bg-[#F7F3EC]">
          <div className="container-site max-w-4xl">
            <h2 className="text-2xl font-bold text-[#1B4332] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Kriter Bazlı Karşılaştırma
            </h2>

            <div className="bg-white rounded-2xl border border-[#DDD8CE] overflow-hidden mb-10">
              {/* Header */}
              <div className="grid grid-cols-3 bg-[#1B4332] text-white text-sm font-bold">
                <div className="px-4 py-3">Kriter</div>
                <div className="px-4 py-3 border-l border-white/10">{c.a.isim}</div>
                <div className="px-4 py-3 border-l border-white/10">{c.b.isim}</div>
              </div>

              {c.kriterler.map((row, i) => {
                const aWins = row.aScore > row.bScore;
                const bWins = row.bScore > row.aScore;
                return (
                  <div key={i} className={`grid grid-cols-3 border-b border-[#EDE8DF] ${i % 2 === 0 ? "bg-white" : "bg-[#F7F3EC]/50"}`}>
                    <div className="px-4 py-4 font-semibold text-sm text-[#1A1A1A] flex items-center gap-2">
                      {row.kriter}
                    </div>
                    <div className={`px-4 py-4 border-l border-[#EDE8DF] ${aWins ? "bg-emerald-50/50" : ""}`}>
                      <ScoreBar score={row.aScore} color={c.a.renk} />
                      <p className="text-xs text-[#6B6355] mt-1.5 leading-snug">{row.aAciklama}</p>
                      {aWins && <span className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-0.5"><Check className="w-3 h-3" /> Avantajlı</span>}
                    </div>
                    <div className={`px-4 py-4 border-l border-[#EDE8DF] ${bWins ? "bg-emerald-50/50" : ""}`}>
                      <ScoreBar score={row.bScore} color={c.b.renk} />
                      <p className="text-xs text-[#6B6355] mt-1.5 leading-snug">{row.bAciklama}</p>
                      {bWins && <span className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-0.5"><Check className="w-3 h-3" /> Avantajlı</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sonuç */}
            <div className="bg-[#1B4332] rounded-2xl p-8 text-white mb-10">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Sonuç: {verdictScore ? `${verdictScore.winner} Kazanıyor` : "Berabere — İkisi de Güçlü"}
              </h2>
              <p className="text-white/80 mb-6 leading-relaxed">{c.sonuc.mesaj}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-[#E4B84A] font-bold text-sm mb-2">{c.a.isim} Kimler İçin?</p>
                  <p className="text-white/80 text-sm leading-relaxed">{c.sonuc.aKim}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-[#E4B84A] font-bold text-sm mb-2">{c.b.isim} Kimler İçin?</p>
                  <p className="text-white/80 text-sm leading-relaxed">{c.sonuc.bKim}</p>
                </div>
              </div>
            </div>

            {/* İlgili sayfalar */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href={`${prefix}/kategori/${c.a.slug}`} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#DDD8CE] bg-white text-[#1A1A1A] text-sm font-semibold hover:border-[#C9972B]/50 hover:shadow-sm transition-all">
                {c.a.isim} Koleksiyonu <ChevronRight className="w-3.5 h-3.5 text-[#C9972B]" />
              </Link>
              <Link href={`${prefix}/kategori/${c.b.slug}`} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#DDD8CE] bg-white text-[#1A1A1A] text-sm font-semibold hover:border-[#C9972B]/50 hover:shadow-sm transition-all">
                {c.b.isim} Koleksiyonu <ChevronRight className="w-3.5 h-3.5 text-[#C9972B]" />
              </Link>
              <Link href={`${prefix}/sss`} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#DDD8CE] bg-white text-[#1A1A1A] text-sm font-semibold hover:border-[#C9972B]/50 hover:shadow-sm transition-all">
                Tüm SSS <ChevronRight className="w-3.5 h-3.5 text-[#C9972B]" />
              </Link>
            </div>

            {/* SSS */}
            {c.sss.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#1B4332] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Sık Sorulan Sorular
                </h2>
                <div className="space-y-4">
                  {c.sss.map((s, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-[#DDD8CE] p-5">
                      <h3 className="font-bold text-[#1A1A1A] mb-2">{s.soru}</h3>
                      <p className="text-sm text-[#4A4035] leading-relaxed">{s.cevap}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <CTASection variant="green" title="Ücretsiz Teklif Alın" subtitle="Hangi türü seçeceğinizden emin değil misiniz? Uzmanlarımız size özel öneri sunar." />
      </main>
      <Footer locale={locale} />
    </>
  );
}

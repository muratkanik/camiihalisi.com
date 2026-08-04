import prisma from "@/lib/prisma";
import AcrylicDatasheetCard from "./AcrylicDatasheetCard";

type Locale = "tr" | "en" | "ar" | "fr" | "de";
type LocalizedText = Record<Locale, string>;

type Product = {
  code: string;
  pileHeight: string;
  pitch: string;
  points: string;
  weight: string;
  pdf: string;
};

type CommonData = {
  manufacturingMethod: LocalizedText;
  manufacturingTechnology: LocalizedText;
  pileYarn: LocalizedText;
  weavingSystem: LocalizedText;
  weavingWidth: string;
  row: string;
  backing: LocalizedText;
  yarnCount: string;
  warpYarn: LocalizedText;
  tolerance: LocalizedText;
  description: LocalizedText;
  performanceFeatures: LocalizedText[];
  usage: {
    underlay: LocalizedText;
    vacuum: LocalizedText;
    serviceLife: LocalizedText;
    warranty: LocalizedText;
  };
};

// DB satırı (Setting.key = "akrilik_datasheets_data") boşsa kullanılacak yedek veri.
// bkz. prisma/seed-akrilik-datasheets.ts
const FALLBACK_PRODUCTS: Product[] = [
  { code: "3000", pileHeight: "13 mm", pitch: "400 / m", points: "505.000 / m²", weight: "3.000 g / m²", pdf: "asil-hali-akrilik-cami-halisi-3000-teknik-veri-foyu.pdf" },
  { code: "3300", pileHeight: "14 mm", pitch: "676 / m", points: "567.800 / m²", weight: "3.300 g / m²", pdf: "asil-hali-akrilik-cami-halisi-3300-teknik-veri-foyu.pdf" },
  { code: "3465", pileHeight: "13 mm", pitch: "400 / m", points: "582.000 / m²", weight: "3.465 g / m²", pdf: "asil-hali-akrilik-cami-halisi-3465-teknik-veri-foyu.pdf" },
  { code: "3588", pileHeight: "14 mm", pitch: "400 / m", points: "637.140 / m²", weight: "3.588 g / m²", pdf: "asil-hali-akrilik-cami-halisi-3588-teknik-veri-foyu.pdf" },
  { code: "3600", pileHeight: "14 mm", pitch: "400 / m", points: "637.140 / m²", weight: "3.600 g / m²", pdf: "asil-hali-akrilik-cami-halisi-3600-teknik-veri-foyu.pdf" },
  { code: "3844", pileHeight: "14 mm", pitch: "400 / m", points: "688.800 / m²", weight: "3.844 g / m²", pdf: "asil-hali-akrilik-cami-halisi-3844-teknik-veri-foyu.pdf" },
  { code: "4100", pileHeight: "14 mm", pitch: "458 / m", points: "787.200 / m²", weight: "4.100 g / m²", pdf: "asil-hali-akrilik-cami-halisi-4100-teknik-veri-foyu.pdf" },
  { code: "4356", pileHeight: "15 mm", pitch: "503 / m", points: "865.100 / m²", weight: "4.356 g / m²", pdf: "asil-hali-akrilik-cami-halisi-4356-teknik-veri-foyu.pdf" },
  { code: "4600", pileHeight: "14 mm", pitch: "600 / m", points: "1.008.000 / m²", weight: "4.600 g / m²", pdf: "asil-hali-akrilik-cami-halisi-4600-teknik-veri-foyu.pdf" },
  { code: "4715", pileHeight: "15 mm", pitch: "600 / m", points: "1.033.200 / m²", weight: "4.715 g / m²", pdf: "asil-hali-akrilik-cami-halisi-4715-teknik-veri-foyu.pdf" },
  { code: "4950", pileHeight: "16 mm", pitch: "600 / m", points: "1.076.000 / m²", weight: "4.950 g / m²", pdf: "asil-hali-akrilik-cami-halisi-4950-teknik-veri-foyu.pdf" },
  { code: "5125", pileHeight: "16 mm", pitch: "650 / m", points: "1.101.875 / m²", weight: "5.125 g / m²", pdf: "asil-hali-akrilik-cami-halisi-5125-teknik-veri-foyu.pdf" },
  { code: "5380", pileHeight: "16 mm", pitch: "675 / m", points: "1.119.300 / m²", weight: "5.380 g / m²", pdf: "asil-hali-akrilik-cami-halisi-5380-teknik-veri-foyu.pdf" },
  { code: "5535", pileHeight: "16 mm", pitch: "700 / m", points: "1.205.400 / m²", weight: "5.535 g / m²", pdf: "asil-hali-akrilik-cami-halisi-5535-teknik-veri-foyu.pdf" },
];

const FALLBACK_COMMON: CommonData = {
  manufacturingMethod: { tr: "Wilton Çift Karşılıklı Dokuma Teknolojisi", en: "Wilton Face-to-Face Weaving Technology", de: "Wilton-Doppelgesicht-Webtechnologie", fr: "Technologie de tissage Wilton face à face", ar: "تقنية نسج ويلتون وجهًا لوجه" },
  manufacturingTechnology: { tr: "Van de Wiele Elektronik Jakarlı Dokuma Sistemi", en: "Van de Wiele Electronic Jacquard Weaving System", de: "Van de Wiele Elektronisches Jacquard-Websystem", fr: "Système de tissage Jacquard électronique Van de Wiele", ar: "نظام نسج جاكار إلكتروني من فان دي ويله" },
  pileYarn: { tr: "%100 Birinci Kalite Akrilik", en: "100% First Quality Acrylic", de: "100% Acryl erster Qualität", fr: "100% acrylique de première qualité", ar: "100% أكريليك من الدرجة الأولى" },
  weavingSystem: { tr: "1/1 Yüksek Yoğunluklu Dokuma Sistemi", en: "1/1 High-Density Weaving System", de: "1/1 Hochdichtes Websystem", fr: "Système de tissage haute densité 1/1", ar: "نظام نسج عالي الكثافة 1/1" },
  weavingWidth: "400 cm",
  row: "420 / m",
  backing: { tr: "%100 Premium Kalite Jüt", en: "100% Premium Grade Jute", de: "100% Jute in Premiumqualität", fr: "100% jute de qualité premium", ar: "100% خيش فاخر" },
  yarnCount: "15/3",
  warpYarn: { tr: "Pamuk", en: "Cotton", de: "Baumwolle", fr: "Coton", ar: "قطن" },
  tolerance: { tr: "Tüm ölçüm değerlerinde ±%5 üretim toleransı uygulanır.", en: "A ±5% manufacturing tolerance applies to all measurement values.", de: "Für alle Messwerte gilt eine Fertigungstoleranz von ±5%.", fr: "Une tolérance de fabrication de ±5% s'applique à toutes les valeurs mesurées.", ar: "يتم تطبيق هامش تصنيع ±5% على جميع القيم القياسية." },
  description: {
    tr: "Premium kalite %100 akrilik hav ipliği kullanılarak üretilen bu Wilton dokuma cami halısı, gelişmiş dokuma teknolojisini üstün işçilik ile birleştirerek yüksek dayanıklılık, konfor ve boyutsal stabilite sunmaktadır.\n\nYoğun ziyaretçi trafiğine sahip ibadet alanları için geliştirilen ürün, kullanım ömrü boyunca estetik görünümünü koruyacak şekilde tasarlanmıştır. Camiler, mescitler, namaz salonları ve diğer dini yapılarda kalite, dayanıklılık ve görsel bütünlüğün ön planda olduğu projeler için ideal bir zemin kaplama çözümüdür.",
    en: "Manufactured with premium-grade 100% acrylic pile yarn, this Wilton woven mosque carpet combines advanced weaving technology with exceptional craftsmanship to deliver outstanding durability, comfort, and dimensional stability.\n\nDeveloped for high-traffic worship environments, the carpet provides long-lasting aesthetic appearance, excellent walking comfort, and reliable performance throughout its service life. It is suitable for mosques, masjids, prayer halls, and other religious buildings where quality, durability, and visual elegance are essential.",
    de: "Dieser Wilton-gewebte Moscheeteppich wird aus erstklassigem 100% Acryl-Polgarn gefertigt und vereint fortschrittliche Webtechnologie mit hervorragender Verarbeitung für außergewöhnliche Haltbarkeit, Komfort und Formstabilität.\n\nEntwickelt für stark frequentierte Gebetsräume, bewahrt der Teppich sein ästhetisches Erscheinungsbild über die gesamte Nutzungsdauer. Er ist ideal für Moscheen, Gebetsräume und andere religiöse Gebäude, in denen Qualität, Haltbarkeit und visuelle Eleganz im Vordergrund stehen.",
    fr: "Fabriqué avec un fil de velours 100% acrylique de qualité premium, ce tapis de mosquée tissé Wilton allie une technologie de tissage avancée à un savoir-faire exceptionnel pour offrir une durabilité, un confort et une stabilité dimensionnelle remarquables.\n\nConçu pour les lieux de culte à fort trafic, il conserve son aspect esthétique tout au long de sa durée de vie. Il convient parfaitement aux mosquées, masjids, salles de prière et autres édifices religieux où qualité, durabilité et élégance visuelle sont essentielles.",
    ar: "صُنعت هذه السجادة المنسوجة بتقنية ويلتون من خيوط الوبر الأكريليكية الفاخرة بنسبة 100%، وتجمع بين تقنية النسج المتطورة والحرفية الاستثنائية لتوفر متانة فائقة وراحة واستقرارًا في الأبعاد.\n\nصُممت خصيصًا لأماكن العبادة ذات الحركة الكثيفة، وتحافظ على مظهرها الجمالي طوال عمرها الافتراضي. وهي مثالية للمساجد والمصليات وقاعات الصلاة وغيرها من المباني الدينية التي تُعطى فيها الأولوية للجودة والمتانة والأناقة البصرية.",
  },
  performanceFeatures: [
    { tr: "Işığa ve Solmaya Karşı Dayanıklı", en: "Light Resistant", de: "Lichtbeständig", fr: "Résistant à la lumière", ar: "مقاوم للضوء والبهتان" },
    { tr: "Bakteri Gelişimine Karşı Dayanıklı", en: "Anti-Bacterial", de: "Antibakteriell", fr: "Antibactérien", ar: "مقاوم لنمو البكتيريا" },
    { tr: "Koku Oluşumuna Karşı Dayanıklı", en: "Odor Resistant", de: "Geruchsresistent", fr: "Résistant aux odeurs", ar: "مقاوم لتكون الروائح" },
    { tr: "Antistatik Özellikli", en: "Anti-Static", de: "Antistatisch", fr: "Antistatique", ar: "خاصية مضادة للكهرباء الساكنة" },
  ],
  usage: {
    underlay: { tr: "Altlık ile Kullanıma Uygundur", en: "Suitable for Use with Underlay", de: "Geeignet für die Verwendung mit Unterlage", fr: "Adapté à l'utilisation avec sous-couche", ar: "مناسب للاستخدام مع الطبقة السفلية" },
    vacuum: { tr: "Düzenli Vakumlu Temizliğe Uygundur", en: "Suitable for Frequent Vacuuming", de: "Geeignet für häufiges Staubsaugen", fr: "Adapté à un aspirateur fréquent", ar: "مناسب للتنظيف المتكرر بالمكنسة الكهربائية" },
    serviceLife: { tr: "Kullanım Ömrü: 30 Yıl", en: "Service Life: 30 Years", de: "Nutzungsdauer: 30 Jahre", fr: "Durée de vie : 30 ans", ar: "العمر الافتراضي: 30 عامًا" },
    warranty: { tr: "Ürün Garantisi: Türkiye Mevzuatına Uygun Olarak 2 Yıl", en: "Product Warranty: 2 Years (in accordance with Turkish legislation)", de: "Produktgarantie: 2 Jahre (gemäß türkischer Gesetzgebung)", fr: "Garantie produit : 2 ans (conformément à la législation turque)", ar: "ضمان المنتج: عامان (وفقًا للتشريعات التركية)" },
  },
};

const COPY: Record<Locale, {
  eyebrow: string;
  title: string;
  description: string;
  code: string;
  height: string;
  pitch: string;
  points: string;
  weight: string;
  row: string;
  weavingWidth: string;
  manufacturingMethod: string;
  manufacturingTechnology: string;
  pileYarn: string;
  weavingSystem: string;
  backing: string;
  yarnCount: string;
  warpYarn: string;
  download: string;
  tabSpecs: string;
  tabDescription: string;
  tabPerformance: string;
  note: string;
}> = {
  tr: {
    eyebrow: "Teknik dokümanlar",
    title: "Teknik Veri Föyleri",
    description: "Akrilik cami halısı kalite ve model kodlarına göre teknik özellikleri karşılaştırın. Her kartta üretim yöntemi, dokuma değerleri, ürün açıklaması, performans özellikleri ve kullanım bilgileri yer alır.",
    code: "Kalite / model kodu",
    height: "Hav yüksekliği",
    pitch: "Atkı sayısı",
    points: "İlme ucu",
    weight: "Toplam ağırlık",
    row: "Tarak sayısı",
    weavingWidth: "Dokuma genişliği",
    manufacturingMethod: "Üretim metodu",
    manufacturingTechnology: "Üretim teknolojisi",
    pileYarn: "Hav ipliği",
    weavingSystem: "Dokuma sistemi",
    backing: "Taban",
    yarnCount: "İplik numarası",
    warpYarn: "Çözgü ipliği",
    download: "PDF föyü indir",
    tabSpecs: "Teknik Veriler",
    tabDescription: "Ürün Açıklaması",
    tabPerformance: "Performans & Kullanım",
    note: "Projeye uygun kalite seçimi için teknik ekibimizden destek alabilirsiniz.",
  },
  en: {
    eyebrow: "Technical documents",
    title: "Technical Data Sheets",
    description: "Compare acrylic mosque carpet specifications by quality and model code. Each card includes manufacturing method, weaving values, product description, performance features, and usage information.",
    code: "Quality / model code",
    height: "Pile height",
    pitch: "Pitch",
    points: "Points",
    weight: "Total weight",
    row: "Row",
    weavingWidth: "Weaving width",
    manufacturingMethod: "Manufacturing method",
    manufacturingTechnology: "Manufacturing technology",
    pileYarn: "Pile yarn",
    weavingSystem: "Weaving system",
    backing: "Backing",
    yarnCount: "Yarn count",
    warpYarn: "Warp yarn",
    download: "Download PDF sheet",
    tabSpecs: "Technical Data",
    tabDescription: "Product Description",
    tabPerformance: "Performance & Use",
    note: "Contact our technical team for project-specific quality guidance.",
  },
  de: {
    eyebrow: "Technische Dokumente",
    title: "Technische Datenblätter",
    description: "Vergleichen Sie die technischen Eigenschaften nach Qualitäts- und Modellcode.",
    code: "Qualitäts- / Modellcode",
    height: "Polhöhe",
    pitch: "Schussdichte",
    points: "Noppen",
    weight: "Gesamtgewicht",
    row: "Kettdichte",
    weavingWidth: "Webbreite",
    manufacturingMethod: "Herstellungsmethode",
    manufacturingTechnology: "Herstellungstechnologie",
    pileYarn: "Polgarn",
    weavingSystem: "Websystem",
    backing: "Rücken",
    yarnCount: "Garnnummer",
    warpYarn: "Kettgarn",
    download: "PDF-Datenblatt herunterladen",
    tabSpecs: "Technische Daten",
    tabDescription: "Produktbeschreibung",
    tabPerformance: "Leistung & Nutzung",
    note: "Kontaktieren Sie unser technisches Team für projektspezifische Beratung.",
  },
  fr: {
    eyebrow: "Documents techniques",
    title: "Fiches Techniques",
    description: "Comparez les caractéristiques techniques par code qualité et modèle.",
    code: "Code qualité / modèle",
    height: "Hauteur de velours",
    pitch: "Trame",
    points: "Points",
    weight: "Poids total",
    row: "Densité de chaîne",
    weavingWidth: "Largeur de tissage",
    manufacturingMethod: "Méthode de fabrication",
    manufacturingTechnology: "Technologie de fabrication",
    pileYarn: "Fil de velours",
    weavingSystem: "Système de tissage",
    backing: "Dossier",
    yarnCount: "Numéro de fil",
    warpYarn: "Fil de chaîne",
    download: "Télécharger la fiche PDF",
    tabSpecs: "Données Techniques",
    tabDescription: "Description du Produit",
    tabPerformance: "Performance & Usage",
    note: "Contactez notre équipe technique pour des conseils spécifiques au projet.",
  },
  ar: {
    eyebrow: "الوثائق الفنية",
    title: "النشرات الفنية",
    description: "قارن المواصفات الفنية حسب رمز الجودة والطراز.",
    code: "رمز الجودة / الطراز",
    height: "ارتفاع الوبر",
    pitch: "عدد اللحمة",
    points: "عدد العقد",
    weight: "الوزن الإجمالي",
    row: "كثافة السداء",
    weavingWidth: "عرض النسج",
    manufacturingMethod: "طريقة التصنيع",
    manufacturingTechnology: "تقنية التصنيع",
    pileYarn: "خيط الوبر",
    weavingSystem: "نظام النسج",
    backing: "القاعدة",
    yarnCount: "رقم الخيط",
    warpYarn: "خيط السداء",
    download: "تحميل ورقة PDF",
    tabSpecs: "البيانات الفنية",
    tabDescription: "وصف المنتج",
    tabPerformance: "الأداء والاستخدام",
    note: "تواصل مع فريقنا الفني للحصول على إرشادات خاصة بمشروعك.",
  },
};

const SITE_URL = "https://camiihalisi.com";

function buildProductsJsonLd(products: Product[], common: CommonData, locale: Locale, copy: (typeof COPY)[Locale]) {
  return {
    "@context": "https://schema.org",
    "@graph": products.map((p) => ({
      "@type": "Product",
      "@id": `${SITE_URL}/kategori/akrilik-cami-halisi#akrilik-${p.code}`,
      name: `Akrilik Cami Halısı ${p.code}`,
      sku: p.code,
      category: "Cami Halısı > Akrilik Cami Halısı",
      material: common.pileYarn[locale],
      brand: { "@type": "Brand", name: "Asil Halı" },
      manufacturer: { "@type": "Organization", name: "Asil Halı A.Ş.", url: "https://www.asilhali.com.tr" },
      url: `${SITE_URL}/kategori/akrilik-cami-halisi#teknik-veri-foyleri`,
      additionalProperty: [
        { "@type": "PropertyValue", name: copy.height, value: p.pileHeight },
        { "@type": "PropertyValue", name: copy.pitch, value: p.pitch },
        { "@type": "PropertyValue", name: copy.points, value: p.points },
        { "@type": "PropertyValue", name: copy.weight, value: p.weight },
        { "@type": "PropertyValue", name: copy.row, value: common.row },
        { "@type": "PropertyValue", name: copy.weavingWidth, value: common.weavingWidth },
        { "@type": "PropertyValue", name: copy.yarnCount, value: common.yarnCount },
        { "@type": "PropertyValue", name: copy.warpYarn, value: common.warpYarn[locale] },
        { "@type": "PropertyValue", name: copy.backing, value: common.backing[locale] },
        { "@type": "PropertyValue", name: copy.weavingSystem, value: common.weavingSystem[locale] },
        { "@type": "PropertyValue", name: copy.manufacturingMethod, value: common.manufacturingMethod[locale] },
        { "@type": "PropertyValue", name: copy.manufacturingTechnology, value: common.manufacturingTechnology[locale] },
      ],
    })),
  };
}

export default async function ProductDatasheets({ locale }: { locale: string }) {
  const activeLocale: Locale = (locale as Locale) in COPY ? (locale as Locale) : "tr";
  const copy = COPY[activeLocale];

  let products: Product[] = FALLBACK_PRODUCTS;
  let common: CommonData = FALLBACK_COMMON;

  try {
    const row = await prisma.setting.findUnique({ where: { key: "akrilik_datasheets_data" } });
    if (row) {
      const parsed = JSON.parse(row.value);
      if (Array.isArray(parsed.products) && parsed.products.length > 0) products = parsed.products;
      if (parsed.common) common = parsed.common;
    }
  } catch (e) {
    console.error(e);
  }

  return (
    <section id="teknik-veri-foyleri" className="py-14 bg-white border-b border-[#E0F7FA]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductsJsonLd(products, common, activeLocale, copy)) }}
      />
      <div className="container-site">
        <div className="max-w-3xl mb-8">
          <span className="badge badge-gold mb-4">{copy.eyebrow}</span>
          <h2 className="section-title mb-3">{copy.title}</h2>
          <div className="gold-line mb-4" />
          <p className="text-[#6B6355] leading-relaxed">{copy.description}</p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((product) => (
            <AcrylicDatasheetCard
              key={product.code}
              product={product}
              common={common}
              locale={activeLocale}
              labels={{
                code: copy.code,
                height: copy.height,
                pitch: copy.pitch,
                points: copy.points,
                weight: copy.weight,
                row: copy.row,
                weavingWidth: copy.weavingWidth,
                manufacturingMethod: copy.manufacturingMethod,
                manufacturingTechnology: copy.manufacturingTechnology,
                pileYarn: copy.pileYarn,
                weavingSystem: copy.weavingSystem,
                backing: copy.backing,
                yarnCount: copy.yarnCount,
                warpYarn: copy.warpYarn,
                download: copy.download,
              }}
              tabs={{
                specs: copy.tabSpecs,
                description: copy.tabDescription,
                performance: copy.tabPerformance,
              }}
            />
          ))}
        </div>

        <p className="mt-6 text-xs text-[#6B6355] leading-relaxed max-w-4xl">{copy.note}</p>
      </div>
    </section>
  );
}

/**
 * prisma/seed-akrilik-datasheets.ts
 * Akrilik cami halısı teknik veri föylerini (master-content/DataSheet/akrilik yeni datasheet/*.pdf)
 * Setting tablosuna "akrilik_datasheets_data" anahtarıyla JSON olarak aktarır.
 *
 * Çalıştırma:
 *   npx tsx prisma/seed-akrilik-datasheets.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const KEY = "akrilik_datasheets_data";

const PRODUCTS = [
  { code: "3465", pileHeight: "13 mm", pitch: "400 / m", points: "582.000 / m²", weight: "3.465 g / m²", pdf: "asil-hali-akrilik-cami-halisi-3465-teknik-veri-foyu.pdf" },
  { code: "3588", pileHeight: "14 mm", pitch: "400 / m", points: "637.140 / m²", weight: "3.588 g / m²", pdf: "asil-hali-akrilik-cami-halisi-3588-teknik-veri-foyu.pdf" },
  { code: "3844", pileHeight: "14 mm", pitch: "400 / m", points: "688.800 / m²", weight: "3.844 g / m²", pdf: "asil-hali-akrilik-cami-halisi-3844-teknik-veri-foyu.pdf" },
  { code: "4100", pileHeight: "14 mm", pitch: "458 / m", points: "787.200 / m²", weight: "4.100 g / m²", pdf: "asil-hali-akrilik-cami-halisi-4100-teknik-veri-foyu.pdf" },
  { code: "4356", pileHeight: "15 mm", pitch: "503 / m", points: "865.100 / m²", weight: "4.356 g / m²", pdf: "asil-hali-akrilik-cami-halisi-4356-teknik-veri-foyu.pdf" },
  { code: "4715", pileHeight: "15 mm", pitch: "600 / m", points: "1.033.200 / m²", weight: "4.715 g / m²", pdf: "asil-hali-akrilik-cami-halisi-4715-teknik-veri-foyu.pdf" },
  { code: "4950", pileHeight: "16 mm", pitch: "600 / m", points: "1.076.000 / m²", weight: "4.950 g / m²", pdf: "asil-hali-akrilik-cami-halisi-4950-teknik-veri-foyu.pdf" },
  { code: "5125", pileHeight: "16 mm", pitch: "650 / m", points: "1.101.875 / m²", weight: "5.125 g / m²", pdf: "asil-hali-akrilik-cami-halisi-5125-teknik-veri-foyu.pdf" },
  { code: "5380", pileHeight: "16 mm", pitch: "675 / m", points: "1.119.300 / m²", weight: "5.380 g / m²", pdf: "asil-hali-akrilik-cami-halisi-5380-teknik-veri-foyu.pdf" },
  { code: "5535", pileHeight: "16 mm", pitch: "700 / m", points: "1.205.400 / m²", weight: "5.535 g / m²", pdf: "asil-hali-akrilik-cami-halisi-5535-teknik-veri-foyu.pdf" },
];

// PDF/XLSX föylerinde tüm kod varyantları için ortak olan alanlar.
const COMMON = {
  manufacturingMethod: {
    tr: "Wilton Çift Karşılıklı Dokuma Teknolojisi",
    en: "Wilton Face-to-Face Weaving Technology",
    de: "Wilton-Doppelgesicht-Webtechnologie",
    fr: "Technologie de tissage Wilton face à face",
    ar: "تقنية نسج ويلتون وجهًا لوجه",
  },
  manufacturingTechnology: {
    tr: "Van de Wiele Elektronik Jakarlı Dokuma Sistemi",
    en: "Van de Wiele Electronic Jacquard Weaving System",
    de: "Van de Wiele Elektronisches Jacquard-Websystem",
    fr: "Système de tissage Jacquard électronique Van de Wiele",
    ar: "نظام نسج جاكار إلكتروني من فان دي ويله",
  },
  pileYarn: {
    tr: "%100 Birinci Kalite Akrilik",
    en: "100% First Quality Acrylic",
    de: "100% Acryl erster Qualität",
    fr: "100% acrylique de première qualité",
    ar: "100% أكريليك من الدرجة الأولى",
  },
  weavingSystem: {
    tr: "1/1 Yüksek Yoğunluklu Dokuma Sistemi",
    en: "1/1 High-Density Weaving System",
    de: "1/1 Hochdichtes Websystem",
    fr: "Système de tissage haute densité 1/1",
    ar: "نظام نسج عالي الكثافة 1/1",
  },
  weavingWidth: "400 cm",
  row: "420 / m",
  backing: {
    tr: "%100 Premium Kalite Jüt",
    en: "100% Premium Grade Jute",
    de: "100% Jute in Premiumqualität",
    fr: "100% jute de qualité premium",
    ar: "100% خيش فاخر",
  },
  yarnCount: "15/3",
  warpYarn: {
    tr: "Pamuk",
    en: "Cotton",
    de: "Baumwolle",
    fr: "Coton",
    ar: "قطن",
  },
  tolerance: {
    tr: "Tüm ölçüm değerlerinde ±%5 üretim toleransı uygulanır.",
    en: "A ±5% manufacturing tolerance applies to all measurement values.",
    de: "Für alle Messwerte gilt eine Fertigungstoleranz von ±5%.",
    fr: "Une tolérance de fabrication de ±5% s'applique à toutes les valeurs mesurées.",
    ar: "يتم تطبيق هامش تصنيع ±5% على جميع القيم القياسية.",
  },
  description: {
    tr: "Premium kalite %100 akrilik hav ipliği kullanılarak üretilen bu Wilton dokuma cami halısı, gelişmiş dokuma teknolojisini üstün işçilik ile birleştirerek yüksek dayanıklılık, konfor ve boyutsal stabilite sunmaktadır.\n\nYoğun ziyaretçi trafiğine sahip ibadet alanları için geliştirilen ürün, kullanım ömrü boyunca estetik görünümünü koruyacak şekilde tasarlanmıştır. Camiler, mescitler, namaz salonları ve diğer dini yapılarda kalite, dayanıklılık ve görsel bütünlüğün ön planda olduğu projeler için ideal bir zemin kaplama çözümüdür.",
    en: "Manufactured with premium-grade 100% acrylic pile yarn, this Wilton woven mosque carpet combines advanced weaving technology with exceptional craftsmanship to deliver outstanding durability, comfort, and dimensional stability.\n\nDeveloped for high-traffic worship environments, the carpet provides long-lasting aesthetic appearance, excellent walking comfort, and reliable performance throughout its service life. It is suitable for mosques, masjids, prayer halls, and other religious buildings where quality, durability, and visual elegance are essential.",
    de: "Dieser Wilton-gewebte Moscheeteppich wird aus erstklassigem 100% Acryl-Polgarn gefertigt und vereint fortschrittliche Webtechnologie mit hervorragender Verarbeitung für außergewöhnliche Haltbarkeit, Komfort und Formstabilität.\n\nEntwickelt für stark frequentierte Gebetsräume, bewahrt der Teppich sein ästhetisches Erscheinungsbild über die gesamte Nutzungsdauer. Er ist ideal für Moscheen, Gebetsräume und andere religiöse Gebäude, in denen Qualität, Haltbarkeit und visuelle Eleganz im Vordergrund stehen.",
    fr: "Fabriqué avec un fil de velours 100% acrylique de qualité premium, ce tapis de mosquée tissé Wilton allie une technologie de tissage avancée à un savoir-faire exceptionnel pour offrir une durabilité, un confort et une stabilité dimensionnelle remarquables.\n\nConçu pour les lieux de culte à fort trafic, il conserve son aspect esthétique tout au long de sa durée de vie. Il convient parfaitement aux mosquées, masjids, salles de prière et autres édifices religieux où qualité, durabilité et élégance visuelle sont essentielles.",
    ar: "صُنعت هذه السجادة المنسوجة بتقنية ويلتون من خيوط الوبر الأكريليكية الفاخرة بنسبة 100%، وتجمع بين تقنية النسج المتطورة والحرفية الاستثنائية لتوفر متانة فائقة وراحة واستقرارًا في الأبعاد.\n\nصُممت خصيصًا لأماكن العبادة ذات الحركة الكثيفة، وتحافظ على مظهرها الجمالي طوال عمرها الافتراضي. وهي مثالية للمساجد والمصليات وقاعات الصلاة وغيرها من المباني الدينية التي تُعطى فيها الأولوية للجودة والمتانة والأناقة البصرية.",
  },
  performanceFeatures: [
    {
      tr: "Işığa ve Solmaya Karşı Dayanıklı",
      en: "Light Resistant",
      de: "Lichtbeständig",
      fr: "Résistant à la lumière",
      ar: "مقاوم للضوء والبهتان",
    },
    {
      tr: "Bakteri Gelişimine Karşı Dayanıklı",
      en: "Anti-Bacterial",
      de: "Antibakteriell",
      fr: "Antibactérien",
      ar: "مقاوم لنمو البكتيريا",
    },
    {
      tr: "Koku Oluşumuna Karşı Dayanıklı",
      en: "Odor Resistant",
      de: "Geruchsresistent",
      fr: "Résistant aux odeurs",
      ar: "مقاوم لتكون الروائح",
    },
    {
      tr: "Antistatik Özellikli",
      en: "Anti-Static",
      de: "Antistatisch",
      fr: "Antistatique",
      ar: "خاصية مضادة للكهرباء الساكنة",
    },
  ],
  usage: {
    underlay: {
      tr: "Altlık ile Kullanıma Uygundur",
      en: "Suitable for Use with Underlay",
      de: "Geeignet für die Verwendung mit Unterlage",
      fr: "Adapté à l'utilisation avec sous-couche",
      ar: "مناسب للاستخدام مع الطبقة السفلية",
    },
    vacuum: {
      tr: "Düzenli Vakumlu Temizliğe Uygundur",
      en: "Suitable for Frequent Vacuuming",
      de: "Geeignet für häufiges Staubsaugen",
      fr: "Adapté à un aspirateur fréquent",
      ar: "مناسب للتنظيف المتكرر بالمكنسة الكهربائية",
    },
    serviceLife: {
      tr: "Kullanım Ömrü: 30 Yıl",
      en: "Service Life: 30 Years",
      de: "Nutzungsdauer: 30 Jahre",
      fr: "Durée de vie : 30 ans",
      ar: "العمر الافتراضي: 30 عامًا",
    },
    warranty: {
      tr: "Ürün Garantisi: Türkiye Mevzuatına Uygun Olarak 2 Yıl",
      en: "Product Warranty: 2 Years (in accordance with Turkish legislation)",
      de: "Produktgarantie: 2 Jahre (gemäß türkischer Gesetzgebung)",
      fr: "Garantie produit : 2 ans (conformément à la législation turque)",
      ar: "ضمان المنتج: عامان (وفقًا للتشريعات التركية)",
    },
  },
};

async function main() {
  const data = { products: PRODUCTS, common: COMMON };
  const value = JSON.stringify(data);

  const existing = await prisma.setting.findUnique({ where: { key: KEY } });
  if (existing) {
    await prisma.setting.update({ where: { key: KEY }, data: { value } });
    console.log(`"${KEY}" güncellendi (${PRODUCTS.length} ürün).`);
  } else {
    await prisma.setting.create({ data: { key: KEY, value } });
    console.log(`"${KEY}" oluşturuldu (${PRODUCTS.length} ürün).`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/**
 * İçerik Takvimi — camiihalisi.com
 * Öncelikli hedef keyword'ler ve içerik türleri.
 * Motor her gün bu listeden bir sonraki kapsanmamış keyword'ü seçer.
 */

export type ContentType = "new_blog" | "improve" | "sss" | "city_content";

export interface CalendarEntry {
  keyword: string;             // Ana hedef keyword
  slug: string;                // URL slug (blog yazısı için)
  category: string;            // Blog kategorisi
  type: ContentType;
  priority: number;            // 1 = en yüksek öncelik
  targetWordCount: number;
  searchIntent: "informational" | "commercial" | "navigational" | "transactional";
  notes?: string;
}

export const CONTENT_CALENDAR: CalendarEntry[] = [
  // ── Ticari Amaç — Yüksek Dönüşüm ────────────────────────────────────────────
  {
    keyword: "cami halısı fiyatları 2025",
    slug: "cami-halisi-fiyatlari-2025",
    category: "Rehber",
    type: "new_blog",
    priority: 1,
    targetWordCount: 1200,
    searchIntent: "commercial",
    notes: "Akrilik, yün, polipropilen fiyat karşılaştırması + m² hesaplaması",
  },
  {
    keyword: "cami halısı satın alma rehberi",
    slug: "cami-halisi-satin-alma-rehberi",
    category: "Rehber",
    type: "new_blog",
    priority: 2,
    targetWordCount: 1500,
    searchIntent: "commercial",
    notes: "Adım adım rehber: ölçüm, tür seçimi, fiyat, sipariş",
  },
  {
    keyword: "toptan cami halısı",
    slug: "toptan-cami-halisi",
    category: "Rehber",
    type: "new_blog",
    priority: 3,
    targetWordCount: 1000,
    searchIntent: "commercial",
    notes: "Kurumsal/vakıf alıcıları için toptan sipariş rehberi",
  },

  // ── Bilgilendirme — SEO Yoğunluğu ─────────────────────────────────────────
  {
    keyword: "cami halısı seçerken dikkat edilmesi gerekenler",
    slug: "cami-halisi-secerken-dikkat-edilmesi-gerekenler",
    category: "Rehber",
    type: "new_blog",
    priority: 4,
    targetWordCount: 1400,
    searchIntent: "informational",
    notes: "Zemin, trafik yoğunluğu, malzeme, bütçe — 8 kriter",
  },
  {
    keyword: "cami halısı özellikleri neler olmalı",
    slug: "cami-halisi-ozellikleri-neler-olmali",
    category: "Teknik",
    type: "new_blog",
    priority: 5,
    targetWordCount: 1200,
    searchIntent: "informational",
  },
  {
    keyword: "cami halısı türleri ve özellikleri",
    slug: "cami-halisi-turleri-ve-ozellikleri",
    category: "Rehber",
    type: "new_blog",
    priority: 6,
    targetWordCount: 1600,
    searchIntent: "informational",
    notes: "5 tür karşılaştırması: akrilik, yün, polipropilen, polyamid, axminster",
  },
  {
    keyword: "cami halısı renk seçimi nasıl yapılır",
    slug: "cami-halisi-renk-secimi-nasil-yapilir",
    category: "Rehber",
    type: "new_blog",
    priority: 7,
    targetWordCount: 900,
    searchIntent: "informational",
  },
  {
    keyword: "cami halısı kaç yılda bir değiştirilmeli",
    slug: "cami-halisi-kac-yilda-bir-degistirilmeli",
    category: "Bakım",
    type: "new_blog",
    priority: 8,
    targetWordCount: 900,
    searchIntent: "informational",
  },
  {
    keyword: "cami halısı nasıl temizlenir adım adım",
    slug: "cami-halisi-nasil-temizlenir-adim-adim",
    category: "Bakım",
    type: "new_blog",
    priority: 9,
    targetWordCount: 1000,
    searchIntent: "informational",
  },
  {
    keyword: "cami halısı ölçüsü nasıl alınır",
    slug: "cami-halisi-olcusu-nasil-alinir",
    category: "Teknik",
    type: "new_blog",
    priority: 10,
    targetWordCount: 800,
    searchIntent: "informational",
  },

  // ── Ürün Odaklı ──────────────────────────────────────────────────────────────
  {
    keyword: "akrilik cami halısı özellikleri ve avantajları",
    slug: "akrilik-cami-halisi-ozellikleri-ve-avantajlari",
    category: "Malzeme",
    type: "new_blog",
    priority: 11,
    targetWordCount: 1100,
    searchIntent: "informational",
  },
  {
    keyword: "yün cami halısı neden tercih edilmeli",
    slug: "yun-cami-halisi-neden-tercih-edilmeli",
    category: "Malzeme",
    type: "new_blog",
    priority: 12,
    targetWordCount: 1000,
    searchIntent: "informational",
  },
  {
    keyword: "polipropilen cami halısı avantajları",
    slug: "polipropilen-cami-halisi-avantajlari",
    category: "Malzeme",
    type: "new_blog",
    priority: 13,
    targetWordCount: 900,
    searchIntent: "informational",
  },
  {
    keyword: "polyamid cami halısı dayanıklılık testi",
    slug: "polyamid-cami-halisi-dayaniklilik",
    category: "Malzeme",
    type: "new_blog",
    priority: 14,
    targetWordCount: 900,
    searchIntent: "informational",
  },
  {
    keyword: "özel desen cami halısı nasıl yaptırılır",
    slug: "ozel-desen-cami-halisi-nasil-yapttirilir",
    category: "Proje",
    type: "new_blog",
    priority: 15,
    targetWordCount: 1000,
    searchIntent: "commercial",
    notes: "Axminster özel tasarım süreci, 3D görselleştirme",
  },

  // ── Montaj & Teknik ───────────────────────────────────────────────────────────
  {
    keyword: "cami halısı montajı nasıl yapılır",
    slug: "cami-halisi-montaji-nasil-yapilir",
    category: "Teknik",
    type: "new_blog",
    priority: 16,
    targetWordCount: 1000,
    searchIntent: "informational",
  },
  {
    keyword: "cami halısı altlığı şart mı",
    slug: "cami-halisi-altligi-sart-mi",
    category: "Teknik",
    type: "new_blog",
    priority: 17,
    targetWordCount: 800,
    searchIntent: "informational",
    notes: "Keçe vs kauçuk altlık karşılaştırması",
  },
  {
    keyword: "cami halısı zemin hazırlığı",
    slug: "cami-halisi-zemin-hazirligi",
    category: "Teknik",
    type: "new_blog",
    priority: 18,
    targetWordCount: 900,
    searchIntent: "informational",
  },
  {
    keyword: "nem sorunu olan camide halı seçimi",
    slug: "nem-sorunu-olan-camide-hali-secimi",
    category: "Teknik",
    type: "new_blog",
    priority: 19,
    targetWordCount: 800,
    searchIntent: "informational",
  },

  // ── Proje & Referans ──────────────────────────────────────────────────────────
  {
    keyword: "büyük cami halısı projesi nasıl planlanır",
    slug: "buyuk-cami-halisi-projesi-nasil-planlanir",
    category: "Proje",
    type: "new_blog",
    priority: 20,
    targetWordCount: 1200,
    searchIntent: "informational",
  },
  {
    keyword: "cami halısı yenileme projesi",
    slug: "cami-halisi-yenileme-projesi",
    category: "Proje",
    type: "new_blog",
    priority: 21,
    targetWordCount: 1000,
    searchIntent: "informational",
  },

  // ── Şehir Odaklı ─────────────────────────────────────────────────────────────
  {
    keyword: "istanbul cami halısı fiyatları",
    slug: "istanbul-cami-halisi-fiyatlari",
    category: "Rehber",
    type: "new_blog",
    priority: 22,
    targetWordCount: 900,
    searchIntent: "commercial",
  },
  {
    keyword: "ankara cami halısı fiyatları",
    slug: "ankara-cami-halisi-fiyatlari",
    category: "Rehber",
    type: "new_blog",
    priority: 23,
    targetWordCount: 900,
    searchIntent: "commercial",
  },
  {
    keyword: "izmir cami halısı",
    slug: "izmir-cami-halisi",
    category: "Rehber",
    type: "new_blog",
    priority: 24,
    targetWordCount: 900,
    searchIntent: "commercial",
  },

  // ── SSS İçerikleri ────────────────────────────────────────────────────────────
  {
    keyword: "cami halısı antibakteriyel mi olmalı",
    slug: "cami-halisi-antibakteriyel-mi-olmali",
    category: "SSS",
    type: "sss",
    priority: 25,
    targetWordCount: 300,
    searchIntent: "informational",
  },
  {
    keyword: "cami halısı güneş görmeli mi",
    slug: "cami-halisi-gunes-gormeli-mi",
    category: "SSS",
    type: "sss",
    priority: 26,
    targetWordCount: 300,
    searchIntent: "informational",
  },
  {
    keyword: "cami halısı kokusu nasıl giderilir",
    slug: "cami-halisi-kokusu-nasil-giderilir",
    category: "SSS",
    type: "sss",
    priority: 27,
    targetWordCount: 300,
    searchIntent: "informational",
  },

  // ── Mevsimsel / Trend ─────────────────────────────────────────────────────────
  {
    keyword: "ramazan için cami halısı yenileme",
    slug: "ramazan-icin-cami-halisi-yenileme",
    category: "Proje",
    type: "new_blog",
    priority: 28,
    targetWordCount: 800,
    searchIntent: "commercial",
    notes: "Sezonsal trend, ramazan öncesi kampanya",
  },
  {
    keyword: "cami halısı 2025 modelleri",
    slug: "cami-halisi-2025-modelleri",
    category: "Rehber",
    type: "new_blog",
    priority: 29,
    targetWordCount: 1000,
    searchIntent: "informational",
  },
];

/** Tüm mevcut slug'larla karşılaştırıp ilk kapsanmamış entry'yi döner */
export function getNextTarget(existingSlugs: string[]): CalendarEntry | null {
  const sorted = [...CONTENT_CALENDAR].sort((a, b) => a.priority - b.priority);
  return sorted.find((e) => !existingSlugs.includes(e.slug)) ?? null;
}

export const SEO_IMPROVE_THRESHOLD = 80; // Bu puanın altındaki makaleler iyileştirilir

/** SEO skoru < threshold olan en kritik entry'yi döner */
export function getLowScoreTarget(
  scoreMap: Record<string, number>,
  existingSlugs: string[],
  threshold = SEO_IMPROVE_THRESHOLD
): CalendarEntry | null {
  const covered = CONTENT_CALENDAR.filter((e) => existingSlugs.includes(e.slug));
  if (covered.length === 0) return null;
  // Threshold altındaki makaleleri önceliğe göre sırala
  const belowThreshold = covered
    .filter((e) => (scoreMap[e.slug] ?? 0) < threshold)
    .sort((a, b) => {
      const scoreDiff = (scoreMap[a.slug] ?? 0) - (scoreMap[b.slug] ?? 0);
      return scoreDiff !== 0 ? scoreDiff : a.priority - b.priority;
    });
  if (belowThreshold.length > 0) return belowThreshold[0];
  // Hepsi threshold üzerindeyse en düşük skorluyu döndür
  return covered.reduce((worst, entry) => {
    const s = scoreMap[entry.slug] ?? 0;
    const ws = scoreMap[worst.slug] ?? 0;
    return s < ws ? entry : worst;
  });
}

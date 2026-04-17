/**
 * Internal Linking System
 * Maps keywords to URLs and applies auto-linking in content.
 * Data stored in Setting table with key "internal_links".
 */

export type LinkMap = Record<string, string>; // keyword → url

/**
 * Apply internal links to a plain-text paragraph.
 * - Only links the FIRST occurrence of each keyword per call (per paragraph).
 * - Case-insensitive matching, preserves original casing in display.
 * - Returns HTML string with <a> tags inserted.
 * - Does not link inside existing <a> tags.
 */
export function applyLinks(text: string, links: LinkMap): string {
  if (!text || Object.keys(links).length === 0) return text;

  // Sort keywords longest-first to avoid partial matches
  const keywords = Object.keys(links).sort((a, b) => b.length - a.length);

  let result = text;

  for (const kw of keywords) {
    const url = links[kw];
    if (!url) continue;

    // Match the keyword (whole word preferred, case-insensitive)
    // Only replace first occurrence (not inside existing <a> tags)
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?<!<[^>]*)\\b(${escaped})\\b`, "i");

    result = result.replace(regex, (match) => {
      return `<a href="${url}" class="text-[#006064] underline underline-offset-2 decoration-[#C9972B]/60 hover:decoration-[#C9972B] font-medium transition-colors" title="${kw}">${match}</a>`;
    });
  }

  return result;
}

/**
 * Load link map from Prisma Setting table.
 */
export async function loadLinkMap(): Promise<LinkMap> {
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    try {
      const setting = await prisma.setting.findUnique({
        where: { key: "internal_links" },
      });
      if (!setting) return {};
      return JSON.parse(setting.value) as LinkMap;
    } finally {
      await prisma.$disconnect();
    }
  } catch {
    return {};
  }
}

/**
 * Save link map to Prisma Setting table.
 */
export async function saveLinkMap(map: LinkMap): Promise<void> {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  try {
    await prisma.setting.upsert({
      where: { key: "internal_links" },
      update: { value: JSON.stringify(map) },
      create: { key: "internal_links", value: JSON.stringify(map) },
    });
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Default link map — 70+ keyword → URL eşleşmesi.
 * Kategori, karşılaştırma, şehir, teknik terim ve blog içerikleri dahil.
 */
export const DEFAULT_LINK_MAP: LinkMap = {
  // ── Malzeme / Ürün Türleri ──────────────────────────────────────────────────
  "akrilik cami halısı":            "/kategori/akrilik-cami-halisi",
  "yün cami halısı":                "/kategori/yun-cami-halisi",
  "polipropilen cami halısı":       "/kategori/polipropilen-cami-halisi",
  "polyamid cami halısı":           "/kategori/polyamid-cami-halisi",
  "axminster cami halısı":          "/kategori/ozel-desen-axminster-cami-halisi",
  "özel desen cami halısı":         "/kategori/ozel-desen-axminster-cami-halisi",
  "özel desen axminster":           "/kategori/ozel-desen-axminster-cami-halisi",

  // ── Desen Türleri ───────────────────────────────────────────────────────────
  "saflı cami halısı":              "/kategori/safli-akrilik-cami-halisi",
  "göbekli cami halısı":            "/kategori/gobekli-akrilik-cami-halisi",
  "seccadeli cami halısı":          "/kategori/seccadeli-akrilik-cami-halisi",
  "mihrap desenli cami halısı":     "/kategori/gobekli-akrilik-cami-halisi",
  "göbek desenli cami halısı":      "/kategori/gobekli-akrilik-cami-halisi",

  // ── Aksesuar ────────────────────────────────────────────────────────────────
  "keçe cami halısı altlığı":       "/kategori/kece-cami-halisi-altligi",
  "kauçuk cami halısı altlığı":     "/kategori/kaucuk-cami-halisi-altligi",
  "cami halısı altlığı":            "/kategori/kece-cami-halisi-altligi",

  // ── Fiyat / Satın Alma Amacı ────────────────────────────────────────────────
  "cami halısı fiyatları":          "/kategori/akrilik-cami-halisi",
  "cami halısı fiyatı":             "/kategori/akrilik-cami-halisi",
  "cami halısı fiyat":              "/kategori/akrilik-cami-halisi",
  "ucuz cami halısı":               "/kategori/akrilik-cami-halisi",
  "ekonomik cami halısı":           "/kategori/akrilik-cami-halisi",
  "kaliteli cami halısı":           "/kategori/yun-cami-halisi",
  "cami halısı teklif":             "/iletisim",
  "cami halısı siparişi":           "/iletisim",
  "cami halısı montajı":            "/iletisim",

  // ── Genel Araştırma Amacı ───────────────────────────────────────────────────
  "cami halısı modelleri":          "/",
  "cami halısı çeşitleri":          "/",
  "cami halısı seçimi":             "/sss",
  "cami halısı seçerken":           "/sss",
  "cami halısı hesaplama":          "/sss",
  "cami halısı ölçüleri":          "/sss",
  "cami halısı teknik özellikleri": "/teknik-ozellikler",
  "sık sorulan sorular":            "/sss",

  // ── Teknik Özellik Terimleri ────────────────────────────────────────────────
  "antibakteriyel cami halısı":     "/sss",
  "ısı yalıtımlı cami halısı":      "/kategori/yun-cami-halisi",
  "neme dayanıklı cami halısı":     "/kategori/polipropilen-cami-halisi",
  "alev almaz cami halısı":         "/sss",
  "su geçirmez cami halısı":        "/kategori/polipropilen-cami-halisi",

  // ── Bakım / Temizlik ────────────────────────────────────────────────────────
  "cami halısı bakımı":             "/blog/bakim-plani-olmayan-cami-halilarinda-olusabilecek-riskler",
  "cami halısı temizliği":          "/blog/bakim-plani-olmayan-cami-halilarinda-olusabilecek-riskler",
  "cami halısı yıkama":             "/blog/bakim-plani-olmayan-cami-halilarinda-olusabilecek-riskler",
  "cami halısı yıpranma":           "/blog/yanlis-teknik-secim-neden-hali-yipratiyor",
  "yanlış teknik seçim":            "/blog/yanlis-teknik-secim-neden-hali-yipratiyor",
  "zemin analizi":                  "/blog/eksik-zemin-analizi-cami-halisini-nasil-etkiler",
  "cami halısı montaj":             "/blog/kalitesiz-montaj-sureci-hali-omrunu-kisaltiyor",

  // ── Karşılaştırma ───────────────────────────────────────────────────────────
  "akrilik mi yün mü":              "/karsilastirma/akrilik-vs-yun-cami-halisi",
  "akrilik vs yün":                 "/karsilastirma/akrilik-vs-yun-cami-halisi",
  "polipropilen vs polyamid":       "/karsilastirma/polipropilen-vs-polyamid-cami-halisi",
  "saflı mı göbekli mi":            "/karsilastirma/safli-vs-gobekli-vs-seccadeli",
  "cami halısı karşılaştırma":      "/karsilastirma",

  // ── Şehir Bazlı (Büyük İller) ──────────────────────────────────────────────
  "istanbul cami halısı":           "/cami-halisi/istanbul",
  "ankara cami halısı":             "/cami-halisi/ankara",
  "izmir cami halısı":              "/cami-halisi/izmir",
  "bursa cami halısı":              "/cami-halisi/bursa",
  "antalya cami halısı":            "/cami-halisi/antalya",
  "konya cami halısı":              "/cami-halisi/konya",
  "kayseri cami halısı":            "/cami-halisi/kayseri",
  "adana cami halısı":              "/cami-halisi/adana",
  "gaziantep cami halısı":          "/cami-halisi/gaziantep",
  "trabzon cami halısı":            "/cami-halisi/trabzon",
  "samsun cami halısı":             "/cami-halisi/samsun",
  "kocaeli cami halısı":            "/cami-halisi/kocaeli",
  "diyarbakır cami halısı":         "/cami-halisi/diyarbakir",
  "eskişehir cami halısı":          "/cami-halisi/eskisehir",
  "mersin cami halısı":             "/cami-halisi/mersin",
  "şanlıurfa cami halısı":          "/cami-halisi/sanliurfa",
  "denizli cami halısı":            "/cami-halisi/denizli",
  "malatya cami halısı":            "/cami-halisi/malatya",
  "hatay cami halısı":              "/cami-halisi/hatay",
  "manisa cami halısı":             "/cami-halisi/manisa",
};

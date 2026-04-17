/**
 * Merkezi kategori kaynağı — sitemap ve diğer dosyalar buradan import eder.
 * Yeni kategori eklendiğinde sadece bu dosyayı güncellemek yeterlidir.
 */

export interface CategoryMeta {
  slug: string;
  label: string;
  priority: "high" | "medium" | "low";
}

export const CATEGORIES: CategoryMeta[] = [
  // ── Ana Kategoriler ──
  { slug: "akrilik-cami-halisi",             label: "Akrilik Cami Halısı",               priority: "high" },
  { slug: "yun-cami-halisi",                 label: "Yün Cami Halısı",                   priority: "high" },
  { slug: "polipropilen-cami-halisi",        label: "Polipropilen Cami Halısı",          priority: "high" },
  { slug: "polyamid-cami-halisi",            label: "Polyamid Cami Halısı",              priority: "high" },

  // ── Akrilik Alt Kategoriler ──
  { slug: "safli-akrilik-cami-halisi",       label: "Saflı Akrilik Cami Halısı",         priority: "medium" },
  { slug: "gobekli-akrilik-cami-halisi",     label: "Göbekli Akrilik Cami Halısı",       priority: "medium" },
  { slug: "seccadeli-akrilik-cami-halisi",   label: "Seccadeli Akrilik Cami Halısı",     priority: "medium" },

  // ── Yün Alt Kategoriler ──
  { slug: "safli-yun-cami-halisi",           label: "Saflı Yün Cami Halısı",             priority: "medium" },
  { slug: "gobekli-yun-cami-halisi",         label: "Göbekli Yün Cami Halısı",           priority: "medium" },
  { slug: "seccadeli-yun-cami-halisi",       label: "Seccadeli Yün Cami Halısı",         priority: "medium" },

  // ── Polipropilen Alt Kategoriler ──
  { slug: "safli-polipropilen-cami-halisi",  label: "Saflı Polipropilen Cami Halısı",    priority: "medium" },
  { slug: "gobekli-polipropilen-cami-halisi",label: "Göbekli Polipropilen Cami Halısı",  priority: "medium" },
  { slug: "seccadeli-polipropilen-cami-halisi",label:"Seccadeli Polipropilen Cami Halısı",priority:"medium"},

  // ── Polyamid Alt Kategoriler ──
  { slug: "safli-polyamid-cami-halisi",      label: "Saflı Polyamid Cami Halısı",        priority: "medium" },
  { slug: "gobekli-polyamid-cami-halisi",    label: "Göbekli Polyamid Cami Halısı",      priority: "medium" },
  { slug: "seccadeli-polyamid-cami-halisi",  label: "Seccadeli Polyamid Cami Halısı",    priority: "medium" },

  // ── Özel Koleksiyonlar ──
  { slug: "ozel-desen-axminster-cami-halisi",label: "Özel Desen Axminster",              priority: "medium" },

  // ── Halı Altı Malzemeleri ──
  { slug: "kaucuk-cami-halisi-altligi",      label: "Kauçuk Cami Halısı Altlığı",        priority: "low" },
  { slug: "tredmor-berber-supreme",          label: "TredMOR™ Berber Supreme",           priority: "low" },
  { slug: "kece-cami-halisi-altligi",        label: "Keçe Cami Halısı Altlığı",          priority: "low" },
  { slug: "600-cami-halisi-kecesi",          label: "600 gr/m² Cami Halısı Keçesi",      priority: "low" },
  { slug: "1000-cami-halisi-kecesi",         label: "1000 gr/m² Cami Halısı Keçesi",     priority: "low" },
  { slug: "1200-cami-halisi-kecesi",         label: "1200 gr/m² Cami Halısı Keçesi",     priority: "low" },
];

/** Sadece slug listesi — sitemap için */
export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

/** Önceliğe göre sitemap priority değeri */
export function getCategoryPriority(slug: string): number {
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return 0.6;
  return cat.priority === "high" ? 0.9 : cat.priority === "medium" ? 0.7 : 0.6;
}

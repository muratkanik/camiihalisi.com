/**
 * Google Drive'dan gelen görsel dosya adları → SEO alt metin haritası
 * Müşteri (desen@asilhali.com.tr) tarafından gönderilen TR Cami Görselleri klasöründen
 */
export const IMAGE_ALT_MAP: Record<string, string> = {
  // tr1 klasörü
  "akrilik_cami_halilari":              "Akrilik Cami Halıları — Renkli ve Dayanıklı",
  "akrilik_cami_halisi":                "Akrilik Cami Halısı — Ekonomik ve Kaliteli",
  "akrilik_hali":                       "Akrilik Halı — Cami İçin Uygun Seçim",
  "mihrap_desenli_cami_halilari":       "Mihrap Desenli Cami Halıları — İslami Motifler",
  "gobekli_cami_halisi":                "Göbekli Cami Halısı — Merkezi Göbek Motifli",
  "gobek_desenli_cami_halisi":          "Göbek Desenli Cami Halısı — Özel Tasarım",
  "gobek_motifli_cami_halisi":          "Göbek Motifli Cami Halısı — Geometrik Desen",
  "motifli_cami_halisi":                "Motifli Cami Halısı — İslami Arabesk Desenli",
  "motifli_cami_halilari":              "Motifli Cami Halıları — Geleneksel Doku",
  "saf_desenli_cami_halilari":          "Saflı (Saf Çizgili) Cami Halıları — Namaz Safları",
  "modern_cami_halisi":                 "Modern Cami Halısı — Çağdaş Tasarım",
  "geleneksel_cami_halisi":             "Geleneksel Cami Halısı — Klasik Osmanlı Deseni",
  "cami_halisi":                        "Cami Halısı — Kaliteli Türk Yapımı",
  "cami_halisi_modelleri":              "Cami Halısı Modelleri — Geniş Çeşit",
  "medine_desenli_cami_halilari":       "Medine Desenli Cami Halıları — Kutsal Şehir İlhamı",
  "bordo_cami_halisi":                  "Bordo Cami Halısı — Derin Kırmızı Ton",
  "bordo_desenli_cami_halilari":        "Bordo Desenli Cami Halıları — Klasik Renk",
  "yun_gobek_cami_halisi":              "Yün Göbekli Cami Halısı — %100 Doğal Yün",
  "yun_gobekli_cami_halisi":            "Yün Göbekli Cami Halısı — Premium Kalite",
  "bej_gobekli_cami_halisi":            "Bej Göbekli Cami Halısı — Nötr Ton Göbek Desen",
};

/**
 * Türkçe görsel dosya adını (alt çizgili) → temiz alt metne çevirir.
 * Örn: "akrilik_cami_halisi kopyası" → "Akrilik Cami Halısı"
 */
export function fileNameToAlt(filename: string): string {
  const clean = filename
    .replace(/\s*kopyası\s*\d*\s*/gi, "")
    .replace(/\.[^.]+$/, "")
    .replace(/_/g, " ")
    .trim();

  const key = clean.toLowerCase().replace(/\s+/g, "_");
  if (IMAGE_ALT_MAP[key]) return IMAGE_ALT_MAP[key];

  // Fallback: baş harfleri büyüt
  return clean.replace(/\b\w/g, (c) => c.toLocaleUpperCase("tr"));
}

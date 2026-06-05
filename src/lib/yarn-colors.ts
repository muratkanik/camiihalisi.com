/**
 * Asil Halı İplik Renk Kataloğu
 * ──────────────────────────────
 * master docs/butun_renkler.bmp dosyasından çıkarılmış gerçek üretim iplik renkleri.
 * Her renk, iplik kodu ve hex değeri ile tanımlıdır.
 */

export interface YarnColor {
  /** Üretim iplik kodu (ör: "1014") */
  code: string;
  /** Hex renk değeri (ör: "#00506F") */
  hex: string;
  /** Türkçe renk adı */
  name: string;
  /** İngilizce renk adı */
  nameEn: string;
}

export const YARN_COLORS: YarnColor[] = [
  // ── Maviler & Petrol Tonları ──
  { code: "1014", hex: "#00506F", name: "Koyu Petrol", nameEn: "Dark Petrol" },
  { code: "1010", hex: "#000040", name: "Gece Mavisi", nameEn: "Navy Blue" },
  { code: "1027", hex: "#107882", name: "Deniz Mavisi", nameEn: "Sea Blue" },
  { code: "1076", hex: "#316677", name: "Çelik Mavisi", nameEn: "Steel Blue" },
  { code: "1064", hex: "#004D6C", name: "Petrol Mavisi", nameEn: "Petrol Blue" },
  { code: "1099", hex: "#005077", name: "Okyanus Mavisi", nameEn: "Ocean Blue" },
  { code: "1074", hex: "#3F747F", name: "Açık Çini", nameEn: "Light Teal" },
  { code: "1107", hex: "#4A8794", name: "Turkuaz", nameEn: "Turquoise" },
  { code: "1100", hex: "#008B92", name: "Koyu Turkuaz", nameEn: "Dark Turquoise" },
  { code: "1105", hex: "#B4DFEF", name: "Buz Mavisi", nameEn: "Ice Blue" },
  { code: "1073", hex: "#294858", name: "Gri Mavi", nameEn: "Grey Blue" },
  { code: "1032", hex: "#2D4D5E", name: "Koyu Gri Mavi", nameEn: "Dark Grey Blue" },

  // ── Turkuaz & Yeşil-Mavi ──
  { code: "1028", hex: "#00B0A8", name: "Çini", nameEn: "Teal" },

  // ── Yeşiller ──
  { code: "1083", hex: "#0C3719", name: "Koyu Yeşil", nameEn: "Dark Green" },
  { code: "1093", hex: "#435429", name: "Zeytin Yeşili", nameEn: "Olive Green" },
  { code: "1029", hex: "#2F3D2C", name: "Orman Yeşili", nameEn: "Forest Green" },
  { code: "1044", hex: "#3D4F23", name: "Çimen Yeşili", nameEn: "Grass Green" },
  { code: "1052", hex: "#00422F", name: "Koyu Zümrüt", nameEn: "Dark Emerald" },
  { code: "1079", hex: "#5C745C", name: "Adaçayı", nameEn: "Sage" },
  { code: "1101", hex: "#4A5D3B", name: "Haki Yeşil", nameEn: "Khaki Green" },

  // ── Kırmızılar & Bordo Tonları ──
  { code: "1015", hex: "#6B0D12", name: "Koyu Bordo", nameEn: "Dark Burgundy" },
  { code: "1006", hex: "#7D2612", name: "Kiremit", nameEn: "Brick Red" },
  { code: "1080", hex: "#740D12", name: "Bordo", nameEn: "Burgundy" },
  { code: "1082", hex: "#7D1B13", name: "Koyu Kırmızı", nameEn: "Dark Red" },
  { code: "1031", hex: "#4D131A", name: "Şarap", nameEn: "Wine" },

  // ── Kahverengiler ──
  { code: "1026", hex: "#AF862C", name: "Hardal Kahve", nameEn: "Mustard Brown" },
  { code: "1062", hex: "#4E3226", name: "Koyu Kahve", nameEn: "Dark Brown" },
  { code: "1004", hex: "#7B614B", name: "Kahve", nameEn: "Brown" },

  // ── Bej & Krem Tonları ──
  { code: "1020", hex: "#E6D8C9", name: "Bej", nameEn: "Beige" },
  { code: "1019", hex: "#C8B59C", name: "Kum", nameEn: "Sand" },
  { code: "1078", hex: "#ECE3D4", name: "Krem", nameEn: "Cream" },
  { code: "1087", hex: "#FFF1E9", name: "Açık Krem", nameEn: "Light Cream" },
  { code: "1091", hex: "#D2BA9B", name: "Açık Bej", nameEn: "Light Beige" },
  { code: "1090", hex: "#C3AD90", name: "Bal", nameEn: "Honey" },
  { code: "1077", hex: "#D6B789", name: "Altın Bej", nameEn: "Golden Beige" },

  // ── Hardal & Zeytin ──
  { code: "1041", hex: "#BF9759", name: "Hardal", nameEn: "Mustard" },
  { code: "2943", hex: "#957C55", name: "Koyu Hardal", nameEn: "Dark Mustard" },
  { code: "1094", hex: "#65602E", name: "Zeytin", nameEn: "Olive" },
  { code: "1092", hex: "#937B54", name: "Devetüyü", nameEn: "Camel" },

  // ── Griler ──
  { code: "1039", hex: "#606058", name: "Koyu Gri", nameEn: "Dark Grey" },
  { code: "1102", hex: "#707070", name: "Gri", nameEn: "Grey" },
  { code: "1072", hex: "#B5B5B5", name: "Açık Gri", nameEn: "Light Grey" },

  // ── Siyah & Beyaz ──
  { code: "1016", hex: "#000000", name: "Siyah", nameEn: "Black" },
  { code: "1081", hex: "#FFFFFF", name: "Beyaz", nameEn: "White" },

  // ── Özel Tonlar ──
  { code: "1086", hex: "#684890", name: "Mor", nameEn: "Purple" },
  { code: "1046", hex: "#5DB289", name: "Nefti", nameEn: "Jade" },
];

/** İplik koduna göre hızlı arama */
export const YARN_COLOR_MAP = new Map(YARN_COLORS.map(c => [c.code, c]));

/** Hex değerine göre en yakın iplik rengini bul */
export function findClosestYarnColor(hex: string): YarnColor | null {
  const r1 = parseInt(hex.slice(1, 3), 16);
  const g1 = parseInt(hex.slice(3, 5), 16);
  const b1 = parseInt(hex.slice(5, 7), 16);

  let closest: YarnColor | null = null;
  let minDist = Infinity;

  for (const yc of YARN_COLORS) {
    const r2 = parseInt(yc.hex.slice(1, 3), 16);
    const g2 = parseInt(yc.hex.slice(3, 5), 16);
    const b2 = parseInt(yc.hex.slice(5, 7), 16);
    const dist = Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
    if (dist < minDist) {
      minDist = dist;
      closest = yc;
    }
  }
  return closest;
}

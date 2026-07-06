export interface YarnColor {
  id: string;
  code: string;
  name_tr: string;
  name_en: string;
  hex: string;
  category?: string;
  available: boolean;
  sortOrder: number;
}

export const YARN_PALETTE: YarnColor[] = [
  // ── Maviler & Petrol Tonları ──
  { id: "1014", code: "1014", hex: "#00506F", name_tr: "Koyu Petrol", name_en: "Dark Petrol", category: "Maviler", available: true, sortOrder: 10 },
  { id: "1010", code: "1010", hex: "#000040", name_tr: "Gece Mavisi", name_en: "Navy Blue", category: "Maviler", available: true, sortOrder: 20 },
  { id: "1027", code: "1027", hex: "#107882", name_tr: "Deniz Mavisi", name_en: "Sea Blue", category: "Maviler", available: true, sortOrder: 30 },
  { id: "1076", code: "1076", hex: "#316677", name_tr: "Çelik Mavisi", name_en: "Steel Blue", category: "Maviler", available: true, sortOrder: 40 },
  { id: "1064", code: "1064", hex: "#004D6C", name_tr: "Petrol Mavisi", name_en: "Petrol Blue", category: "Maviler", available: true, sortOrder: 50 },
  { id: "1099", code: "1099", hex: "#005077", name_tr: "Okyanus Mavisi", name_en: "Ocean Blue", category: "Maviler", available: true, sortOrder: 60 },
  { id: "1074", code: "1074", hex: "#3F747F", name_tr: "Açık Çini", name_en: "Light Teal", category: "Maviler", available: true, sortOrder: 70 },
  { id: "1107", code: "1107", hex: "#4A8794", name_tr: "Turkuaz", name_en: "Turquoise", category: "Maviler", available: true, sortOrder: 80 },
  { id: "1100", code: "1100", hex: "#008B92", name_tr: "Koyu Turkuaz", name_en: "Dark Turquoise", category: "Maviler", available: true, sortOrder: 90 },
  { id: "1105", code: "1105", hex: "#B4DFEF", name_tr: "Buz Mavisi", name_en: "Ice Blue", category: "Maviler", available: true, sortOrder: 100 },
  { id: "1073", code: "1073", hex: "#294858", name_tr: "Gri Mavi", name_en: "Grey Blue", category: "Maviler", available: true, sortOrder: 110 },
  { id: "1032", code: "1032", hex: "#2D4D5E", name_tr: "Koyu Gri Mavi", name_en: "Dark Grey Blue", category: "Maviler", available: true, sortOrder: 120 },

  // ── Turkuaz & Yeşil-Mavi ──
  { id: "1028", code: "1028", hex: "#00B0A8", name_tr: "Çini", name_en: "Teal", category: "Turkuaz", available: true, sortOrder: 130 },

  // ── Yeşiller ──
  { id: "1083", code: "1083", hex: "#0C3719", name_tr: "Koyu Yeşil", name_en: "Dark Green", category: "Yeşiller", available: true, sortOrder: 140 },
  { id: "1093", code: "1093", hex: "#435429", name_tr: "Zeytin Yeşili", name_en: "Olive Green", category: "Yeşiller", available: true, sortOrder: 150 },
  { id: "1029", code: "1029", hex: "#2F3D2C", name_tr: "Orman Yeşili", name_en: "Forest Green", category: "Yeşiller", available: true, sortOrder: 160 },
  { id: "1044", code: "1044", hex: "#3D4F23", name_tr: "Çimen Yeşili", name_en: "Grass Green", category: "Yeşiller", available: true, sortOrder: 170 },
  { id: "1052", code: "1052", hex: "#00422F", name_tr: "Koyu Zümrüt", name_en: "Dark Emerald", category: "Yeşiller", available: true, sortOrder: 180 },
  { id: "1079", code: "1079", hex: "#5C745C", name_tr: "Adaçayı", name_en: "Sage", category: "Yeşiller", available: true, sortOrder: 190 },
  { id: "1101", code: "1101", hex: "#4A5D3B", name_tr: "Haki Yeşil", name_en: "Khaki Green", category: "Yeşiller", available: true, sortOrder: 200 },

  // ── Kırmızılar & Bordo Tonları ──
  { id: "1015", code: "1015", hex: "#6B0D12", name_tr: "Koyu Bordo", name_en: "Dark Burgundy", category: "Kırmızılar", available: true, sortOrder: 210 },
  { id: "1006", code: "1006", hex: "#7D2612", name_tr: "Kiremit", name_en: "Brick Red", category: "Kırmızılar", available: true, sortOrder: 220 },
  { id: "1080", code: "1080", hex: "#740D12", name_tr: "Bordo", name_en: "Burgundy", category: "Kırmızılar", available: true, sortOrder: 230 },
  { id: "1082", code: "1082", hex: "#7D1B13", name_tr: "Koyu Kırmızı", name_en: "Dark Red", category: "Kırmızılar", available: true, sortOrder: 240 },
  { id: "1031", code: "1031", hex: "#4D131A", name_tr: "Şarap", name_en: "Wine", category: "Kırmızılar", available: true, sortOrder: 250 },

  // ── Kahverengiler ──
  { id: "1026", code: "1026", hex: "#AF862C", name_tr: "Hardal Kahve", name_en: "Mustard Brown", category: "Kahverengiler", available: true, sortOrder: 260 },
  { id: "1062", code: "1062", hex: "#4E3226", name_tr: "Koyu Kahve", name_en: "Dark Brown", category: "Kahverengiler", available: true, sortOrder: 270 },
  { id: "1004", code: "1004", hex: "#7B614B", name_tr: "Kahve", name_en: "Brown", category: "Kahverengiler", available: true, sortOrder: 280 },

  // ── Bej & Krem Tonları ──
  { id: "1020", code: "1020", hex: "#E6D8C9", name_tr: "Bej", name_en: "Beige", category: "Bej & Krem", available: true, sortOrder: 290 },
  { id: "1019", code: "1019", hex: "#C8B59C", name_tr: "Kum", name_en: "Sand", category: "Bej & Krem", available: true, sortOrder: 300 },
  { id: "1078", code: "1078", hex: "#ECE3D4", name_tr: "Krem", name_en: "Cream", category: "Bej & Krem", available: true, sortOrder: 310 },
  { id: "1087", code: "1087", hex: "#FFF1E9", name_tr: "Açık Krem", name_en: "Light Cream", category: "Bej & Krem", available: true, sortOrder: 320 },
  { id: "1091", code: "1091", hex: "#D2BA9B", name_tr: "Açık Bej", name_en: "Light Beige", category: "Bej & Krem", available: true, sortOrder: 330 },
  { id: "1090", code: "1090", hex: "#C3AD90", name_tr: "Bal", name_en: "Honey", category: "Bej & Krem", available: true, sortOrder: 340 },
  { id: "1077", code: "1077", hex: "#D6B789", name_tr: "Altın Bej", name_en: "Golden Beige", category: "Bej & Krem", available: true, sortOrder: 350 },

  // ── Hardal & Zeytin ──
  { id: "1041", code: "1041", hex: "#BF9759", name_tr: "Hardal", name_en: "Mustard", category: "Hardal & Zeytin", available: true, sortOrder: 360 },
  { id: "2943", code: "2943", hex: "#957C55", name_tr: "Koyu Hardal", name_en: "Dark Mustard", category: "Hardal & Zeytin", available: true, sortOrder: 370 },
  { id: "1094", code: "1094", hex: "#65602E", name_tr: "Zeytin", name_en: "Olive", category: "Hardal & Zeytin", available: true, sortOrder: 380 },
  { id: "1092", code: "1092", hex: "#937B54", name_tr: "Devetüyü", name_en: "Camel", category: "Hardal & Zeytin", available: true, sortOrder: 390 },

  // ── Griler ──
  { id: "1039", code: "1039", hex: "#606058", name_tr: "Koyu Gri", name_en: "Dark Grey", category: "Griler", available: true, sortOrder: 400 },
  { id: "1102", code: "1102", hex: "#707070", name_tr: "Gri", name_en: "Grey", category: "Griler", available: true, sortOrder: 410 },
  { id: "1072", code: "1072", hex: "#B5B5B5", name_tr: "Açık Gri", name_en: "Light Grey", category: "Griler", available: true, sortOrder: 420 },

  // ── Siyah & Beyaz ──
  { id: "1016", code: "1016", hex: "#000000", name_tr: "Siyah", name_en: "Black", category: "Temel Renkler", available: true, sortOrder: 430 },
  { id: "1081", code: "1081", hex: "#FFFFFF", name_tr: "Beyaz", name_en: "White", category: "Temel Renkler", available: true, sortOrder: 440 },

  // ── Özel Tonlar ──
  { id: "1086", code: "1086", hex: "#684890", name_tr: "Mor", name_en: "Purple", category: "Özel Tonlar", available: true, sortOrder: 450 },
  { id: "1046", code: "1046", hex: "#5DB289", name_tr: "Nefti", name_en: "Jade", category: "Özel Tonlar", available: true, sortOrder: 460 },
];

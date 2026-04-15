// Turkish cities and major districts for SEO pages
// URL slugs use ASCII-only (no Turkish characters)

export interface CityData {
  slug: string;        // ASCII URL-safe slug (e.g., "istanbul")
  name: string;        // Display name with Turkish chars (e.g., "İstanbul")
  type: "il" | "ilce";
  parent?: string;     // Parent province slug (for districts)
  population?: string; // Approx population tier for content variation
}

// Turkish character mapping for slug generation
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/İ/g, "i")
    .replace(/Ğ/g, "g")
    .replace(/Ü/g, "u")
    .replace(/Ş/g, "s")
    .replace(/Ö/g, "o")
    .replace(/Ç/g, "c")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export const CITIES: CityData[] = [
  // ── 81 İl (tam liste, ASCII slug'lar) ──
  { slug: "istanbul",       name: "İstanbul",       type: "il", population: "buyuk" },
  { slug: "ankara",         name: "Ankara",         type: "il", population: "buyuk" },
  { slug: "izmir",          name: "İzmir",          type: "il", population: "buyuk" },
  { slug: "bursa",          name: "Bursa",          type: "il", population: "buyuk" },
  { slug: "antalya",        name: "Antalya",        type: "il", population: "buyuk" },
  { slug: "adana",          name: "Adana",          type: "il", population: "buyuk" },
  { slug: "konya",          name: "Konya",          type: "il", population: "buyuk" },
  { slug: "gaziantep",      name: "Gaziantep",      type: "il", population: "orta" },
  { slug: "mersin",         name: "Mersin",         type: "il", population: "orta" },
  { slug: "kayseri",        name: "Kayseri",        type: "il", population: "orta" },
  { slug: "kocaeli",        name: "Kocaeli",        type: "il", population: "buyuk" },
  { slug: "eskisehir",      name: "Eskişehir",      type: "il", population: "orta" },
  { slug: "diyarbakir",     name: "Diyarbakır",     type: "il", population: "orta" },
  { slug: "denizli",        name: "Denizli",        type: "il", population: "orta" },
  { slug: "samsun",         name: "Samsun",         type: "il", population: "orta" },
  { slug: "sanliurfa",      name: "Şanlıurfa",      type: "il", population: "orta" },
  { slug: "malatya",        name: "Malatya",        type: "il", population: "orta" },
  { slug: "trabzon",        name: "Trabzon",        type: "il", population: "orta" },
  { slug: "tekirdag",       name: "Tekirdağ",       type: "il", population: "orta" },
  { slug: "manisa",         name: "Manisa",         type: "il", population: "orta" },
  { slug: "balikesir",      name: "Balıkesir",      type: "il", population: "orta" },
  { slug: "aydin",          name: "Aydın",          type: "il", population: "orta" },
  { slug: "kahramanmaras",  name: "Kahramanmaraş",  type: "il", population: "orta" },
  { slug: "hatay",          name: "Hatay",          type: "il", population: "orta" },
  { slug: "sakarya",        name: "Sakarya",        type: "il", population: "orta" },
  { slug: "mugla",          name: "Muğla",          type: "il", population: "orta" },
  { slug: "van",            name: "Van",            type: "il", population: "kucuk" },
  { slug: "erzurum",        name: "Erzurum",        type: "il", population: "kucuk" },
  { slug: "afyonkarahisar", name: "Afyonkarahisar", type: "il", population: "kucuk" },
  { slug: "kirikkale",      name: "Kırıkkale",      type: "il", population: "kucuk" },
  { slug: "kutahya",        name: "Kütahya",        type: "il", population: "kucuk" },
  { slug: "sivas",          name: "Sivas",          type: "il", population: "kucuk" },
  { slug: "zonguldak",      name: "Zonguldak",      type: "il", population: "kucuk" },
  { slug: "bolu",           name: "Bolu",           type: "il", population: "kucuk" },
  { slug: "canakkale",      name: "Çanakkale",      type: "il", population: "kucuk" },
  { slug: "burdur",         name: "Burdur",         type: "il", population: "kucuk" },
  { slug: "isparta",        name: "Isparta",        type: "il", population: "kucuk" },
  { slug: "nigde",          name: "Niğde",          type: "il", population: "kucuk" },
  { slug: "aksaray",        name: "Aksaray",        type: "il", population: "kucuk" },
  { slug: "nevsehir",       name: "Nevşehir",       type: "il", population: "kucuk" },
  { slug: "corum",          name: "Çorum",          type: "il", population: "kucuk" },
  { slug: "kirsehir",       name: "Kırşehir",       type: "il", population: "kucuk" },
  { slug: "yozgat",         name: "Yozgat",         type: "il", population: "kucuk" },
  { slug: "tokat",          name: "Tokat",          type: "il", population: "kucuk" },
  { slug: "ordu",           name: "Ordu",           type: "il", population: "kucuk" },
  { slug: "giresun",        name: "Giresun",        type: "il", population: "kucuk" },
  { slug: "rize",           name: "Rize",           type: "il", population: "kucuk" },
  { slug: "artvin",         name: "Artvin",         type: "il", population: "kucuk" },
  { slug: "gumushane",      name: "Gümüşhane",      type: "il", population: "kucuk" },
  { slug: "kastamonu",      name: "Kastamonu",      type: "il", population: "kucuk" },
  { slug: "sinop",          name: "Sinop",          type: "il", population: "kucuk" },
  { slug: "karabuk",        name: "Karabük",        type: "il", population: "kucuk" },
  { slug: "bartin",         name: "Bartın",         type: "il", population: "kucuk" },
  { slug: "amasya",         name: "Amasya",         type: "il", population: "kucuk" },
  { slug: "usak",           name: "Uşak",           type: "il", population: "kucuk" },
  { slug: "erzincan",       name: "Erzincan",       type: "il", population: "kucuk" },
  { slug: "agri",           name: "Ağrı",           type: "il", population: "kucuk" },
  { slug: "kars",           name: "Kars",           type: "il", population: "kucuk" },
  { slug: "igdir",          name: "Iğdır",          type: "il", population: "kucuk" },
  { slug: "ardahan",        name: "Ardahan",        type: "il", population: "kucuk" },
  { slug: "hakkari",        name: "Hakkari",        type: "il", population: "kucuk" },
  { slug: "siirt",          name: "Siirt",          type: "il", population: "kucuk" },
  { slug: "mardin",         name: "Mardin",         type: "il", population: "kucuk" },
  { slug: "batman",         name: "Batman",         type: "il", population: "kucuk" },
  { slug: "sirnak",         name: "Şırnak",         type: "il", population: "kucuk" },
  { slug: "bitlis",         name: "Bitlis",         type: "il", population: "kucuk" },
  { slug: "mus",            name: "Muş",            type: "il", population: "kucuk" },
  { slug: "bingol",         name: "Bingöl",         type: "il", population: "kucuk" },
  { slug: "elazig",         name: "Elazığ",         type: "il", population: "kucuk" },
  { slug: "adiyaman",       name: "Adıyaman",       type: "il", population: "kucuk" },
  { slug: "osmaniye",       name: "Osmaniye",       type: "il", population: "kucuk" },
  { slug: "kilis",          name: "Kilis",          type: "il", population: "kucuk" },
  { slug: "edirne",         name: "Edirne",         type: "il", population: "kucuk" },
  // ── Eksik iller eklendi ──
  { slug: "bilecik",        name: "Bilecik",        type: "il", population: "kucuk" },
  { slug: "cankiri",        name: "Çankırı",        type: "il", population: "kucuk" },
  { slug: "duzce",          name: "Düzce",          type: "il", population: "kucuk" },
  { slug: "karaman",        name: "Karaman",        type: "il", population: "kucuk" },
  { slug: "kirklareli",     name: "Kırklareli",     type: "il", population: "kucuk" },
  { slug: "tunceli",        name: "Tunceli",        type: "il", population: "kucuk" },
  { slug: "yalova",         name: "Yalova",         type: "il", population: "kucuk" },
  { slug: "bayburt",        name: "Bayburt",        type: "il", population: "kucuk" },

  // ── İstanbul İlçeleri ──
  { slug: "kadikoy",        name: "Kadıköy",        type: "ilce", parent: "istanbul" },
  { slug: "besiktas",       name: "Beşiktaş",       type: "ilce", parent: "istanbul" },
  { slug: "sisli",          name: "Şişli",          type: "ilce", parent: "istanbul" },
  { slug: "uskudar",        name: "Üsküdar",        type: "ilce", parent: "istanbul" },
  { slug: "fatih",          name: "Fatih",          type: "ilce", parent: "istanbul" },
  { slug: "eyupsultan",     name: "Eyüpsultan",     type: "ilce", parent: "istanbul" },
  { slug: "umraniye",       name: "Ümraniye",       type: "ilce", parent: "istanbul" },
  { slug: "maltepe",        name: "Maltepe",        type: "ilce", parent: "istanbul" },
  { slug: "kartal",         name: "Kartal",         type: "ilce", parent: "istanbul" },
  { slug: "pendik",         name: "Pendik",         type: "ilce", parent: "istanbul" },
  { slug: "tuzla",          name: "Tuzla",          type: "ilce", parent: "istanbul" },
  { slug: "sancaktepe",     name: "Sancaktepe",     type: "ilce", parent: "istanbul" },
  { slug: "sultanbeyli",    name: "Sultanbeyli",    type: "ilce", parent: "istanbul" },
  { slug: "esenyurt",       name: "Esenyurt",       type: "ilce", parent: "istanbul" },
  { slug: "bahcelievler",   name: "Bahçelievler",   type: "ilce", parent: "istanbul" },
  { slug: "bayrampasa",     name: "Bayrampaşa",     type: "ilce", parent: "istanbul" },
  { slug: "bagcilar",       name: "Bağcılar",       type: "ilce", parent: "istanbul" },
  { slug: "gungoren",       name: "Güngören",       type: "ilce", parent: "istanbul" },
  { slug: "zeytinburnu",    name: "Zeytinburnu",    type: "ilce", parent: "istanbul" },
  { slug: "bakirkoy",       name: "Bakırköy",       type: "ilce", parent: "istanbul" },
  { slug: "kucukcekmece",   name: "Küçükçekmece",   type: "ilce", parent: "istanbul" },
  { slug: "buyukcekmece",   name: "Büyükçekmece",   type: "ilce", parent: "istanbul" },
  { slug: "avcilar",        name: "Avcılar",        type: "ilce", parent: "istanbul" },
  { slug: "beylikduzu",     name: "Beylikdüzü",     type: "ilce", parent: "istanbul" },
  { slug: "basaksehir",     name: "Başakşehir",     type: "ilce", parent: "istanbul" },
  { slug: "sultangazi",     name: "Sultangazi",     type: "ilce", parent: "istanbul" },
  { slug: "gaziosmanpasa",  name: "Gaziosmanpaşa",  type: "ilce", parent: "istanbul" },
  { slug: "esenler",        name: "Esenler",        type: "ilce", parent: "istanbul" },
  { slug: "arnavutkoy",     name: "Arnavutköy",     type: "ilce", parent: "istanbul" },
  { slug: "beyoglu",        name: "Beyoğlu",        type: "ilce", parent: "istanbul" },
  { slug: "sariyer",        name: "Sarıyer",        type: "ilce", parent: "istanbul" },
  { slug: "kagithane",      name: "Kağıthane",      type: "ilce", parent: "istanbul" },
  { slug: "beykoz",         name: "Beykoz",         type: "ilce", parent: "istanbul" },
  { slug: "cekmekoy",       name: "Çekmeköy",       type: "ilce", parent: "istanbul" },
  { slug: "adalar",         name: "Adalar",         type: "ilce", parent: "istanbul" },
  { slug: "catalca",        name: "Çatalca",        type: "ilce", parent: "istanbul" },
  { slug: "silivri",        name: "Silivri",        type: "ilce", parent: "istanbul" },

  // ── Ankara İlçeleri ──
  { slug: "cankaya",        name: "Çankaya",        type: "ilce", parent: "ankara" },
  { slug: "mamak",          name: "Mamak",          type: "ilce", parent: "ankara" },
  { slug: "altindag",       name: "Altındağ",       type: "ilce", parent: "ankara" },
  { slug: "kecioren",       name: "Keçiören",       type: "ilce", parent: "ankara" },
  { slug: "yenimahalle",    name: "Yenimahalle",    type: "ilce", parent: "ankara" },
  { slug: "etimesgut",      name: "Etimesgut",      type: "ilce", parent: "ankara" },
  { slug: "sincan",         name: "Sincan",         type: "ilce", parent: "ankara" },
  { slug: "pursaklar",      name: "Pursaklar",      type: "ilce", parent: "ankara" },
  { slug: "golbasi",        name: "Gölbaşı",        type: "ilce", parent: "ankara" },

  // ── İzmir İlçeleri ──
  { slug: "konak",          name: "Konak",          type: "ilce", parent: "izmir" },
  { slug: "bornova",        name: "Bornova",        type: "ilce", parent: "izmir" },
  { slug: "karsiyaka",      name: "Karşıyaka",      type: "ilce", parent: "izmir" },
  { slug: "buca",           name: "Buca",           type: "ilce", parent: "izmir" },
  { slug: "cigli",          name: "Çiğli",          type: "ilce", parent: "izmir" },
  { slug: "gaziemir",       name: "Gaziemir",       type: "ilce", parent: "izmir" },
  { slug: "bayrakli",       name: "Bayraklı",       type: "ilce", parent: "izmir" },

  // ── Bursa İlçeleri ──
  { slug: "osmangazi",      name: "Osmangazi",      type: "ilce", parent: "bursa" },
  { slug: "yildirim",       name: "Yıldırım",       type: "ilce", parent: "bursa" },
  { slug: "nilufer",        name: "Nilüfer",        type: "ilce", parent: "bursa" },
  { slug: "mudanya",        name: "Mudanya",        type: "ilce", parent: "bursa" },
  { slug: "inegol",         name: "İnegöl",         type: "ilce", parent: "bursa" },

  // ── Antalya İlçeleri ──
  { slug: "kepez",          name: "Kepez",          type: "ilce", parent: "antalya" },
  { slug: "muratpasa",      name: "Muratpaşa",      type: "ilce", parent: "antalya" },
  { slug: "konyaalti",      name: "Konyaaltı",      type: "ilce", parent: "antalya" },
  { slug: "dosemealti",     name: "Döşemealtı",     type: "ilce", parent: "antalya" },
  { slug: "alanya",         name: "Alanya",         type: "ilce", parent: "antalya" },

  // ── Diğer İlçeler ──
  { slug: "biga",           name: "Biga",           type: "ilce", parent: "canakkale" },
];

// Deduplicate by slug (ASCII slugs only, no Turkish chars in slug)
const seen = new Set<string>();
export const ALL_CITIES = CITIES.filter((c) => {
  if (seen.has(c.slug)) return false;
  seen.add(c.slug);
  return true;
});

export function getCityBySlug(slug: string): CityData | undefined {
  return ALL_CITIES.find((c) => c.slug === slug);
}

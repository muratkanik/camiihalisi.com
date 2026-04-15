// Turkish cities and major districts for SEO pages
// URL slugs use ASCII-only (no Turkish characters)

export interface CityData {
  slug: string;        // ASCII URL-safe slug (e.g., "istanbul")
  name: string;        // Display name with Turkish chars (e.g., "İstanbul")
  type: "il" | "ilce";
  parent?: string;     // Parent province slug (for districts)
  population?: string; // Approx population tier for content variation
}

export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/İ/g, "i").replace(/Ğ/g, "g").replace(/Ü/g, "u")
    .replace(/Ş/g, "s").replace(/Ö/g, "o").replace(/Ç/g, "c")
    .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export const CITIES: CityData[] = [
  // ════════════════════════════════════════════════════════
  // 81 İL
  // ════════════════════════════════════════════════════════
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
  { slug: "bilecik",        name: "Bilecik",        type: "il", population: "kucuk" },
  { slug: "cankiri",        name: "Çankırı",        type: "il", population: "kucuk" },
  { slug: "duzce",          name: "Düzce",          type: "il", population: "kucuk" },
  { slug: "karaman",        name: "Karaman",        type: "il", population: "kucuk" },
  { slug: "kirklareli",     name: "Kırklareli",     type: "il", population: "kucuk" },
  { slug: "tunceli",        name: "Tunceli",        type: "il", population: "kucuk" },
  { slug: "yalova",         name: "Yalova",         type: "il", population: "kucuk" },
  { slug: "bayburt",        name: "Bayburt",        type: "il", population: "kucuk" },

  // ════════════════════════════════════════════════════════
  // İSTANBUL İLÇELERİ (39 ilçe)
  // ════════════════════════════════════════════════════════
  { slug: "adalar",         name: "Adalar",         type: "ilce", parent: "istanbul" },
  { slug: "arnavutkoy",     name: "Arnavutköy",     type: "ilce", parent: "istanbul" },
  { slug: "atasehir",       name: "Ataşehir",       type: "ilce", parent: "istanbul" },
  { slug: "avcilar",        name: "Avcılar",        type: "ilce", parent: "istanbul" },
  { slug: "bagcilar",       name: "Bağcılar",       type: "ilce", parent: "istanbul" },
  { slug: "bahcelievler",   name: "Bahçelievler",   type: "ilce", parent: "istanbul" },
  { slug: "bakirkoy",       name: "Bakırköy",       type: "ilce", parent: "istanbul" },
  { slug: "basaksehir",     name: "Başakşehir",     type: "ilce", parent: "istanbul" },
  { slug: "bayrampasa",     name: "Bayrampaşa",     type: "ilce", parent: "istanbul" },
  { slug: "besiktas",       name: "Beşiktaş",       type: "ilce", parent: "istanbul" },
  { slug: "beykoz",         name: "Beykoz",         type: "ilce", parent: "istanbul" },
  { slug: "beylikduzu",     name: "Beylikdüzü",     type: "ilce", parent: "istanbul" },
  { slug: "beyoglu",        name: "Beyoğlu",        type: "ilce", parent: "istanbul" },
  { slug: "buyukcekmece",   name: "Büyükçekmece",   type: "ilce", parent: "istanbul" },
  { slug: "catalca",        name: "Çatalca",        type: "ilce", parent: "istanbul" },
  { slug: "cekmekoy",       name: "Çekmeköy",       type: "ilce", parent: "istanbul" },
  { slug: "esenler",        name: "Esenler",        type: "ilce", parent: "istanbul" },
  { slug: "esenyurt",       name: "Esenyurt",       type: "ilce", parent: "istanbul" },
  { slug: "eyupsultan",     name: "Eyüpsultan",     type: "ilce", parent: "istanbul" },
  { slug: "fatih",          name: "Fatih",          type: "ilce", parent: "istanbul" },
  { slug: "gaziosmanpasa",  name: "Gaziosmanpaşa",  type: "ilce", parent: "istanbul" },
  { slug: "gungoren",       name: "Güngören",       type: "ilce", parent: "istanbul" },
  { slug: "kadikoy",        name: "Kadıköy",        type: "ilce", parent: "istanbul" },
  { slug: "kagithane",      name: "Kağıthane",      type: "ilce", parent: "istanbul" },
  { slug: "kartal",         name: "Kartal",         type: "ilce", parent: "istanbul" },
  { slug: "kucukcekmece",   name: "Küçükçekmece",   type: "ilce", parent: "istanbul" },
  { slug: "maltepe",        name: "Maltepe",        type: "ilce", parent: "istanbul" },
  { slug: "pendik",         name: "Pendik",         type: "ilce", parent: "istanbul" },
  { slug: "sancaktepe",     name: "Sancaktepe",     type: "ilce", parent: "istanbul" },
  { slug: "sariyer",        name: "Sarıyer",        type: "ilce", parent: "istanbul" },
  { slug: "silivri",        name: "Silivri",        type: "ilce", parent: "istanbul" },
  { slug: "sisli",          name: "Şişli",          type: "ilce", parent: "istanbul" },
  { slug: "sultanbeyli",    name: "Sultanbeyli",    type: "ilce", parent: "istanbul" },
  { slug: "sultangazi",     name: "Sultangazi",     type: "ilce", parent: "istanbul" },
  { slug: "tuzla",          name: "Tuzla",          type: "ilce", parent: "istanbul" },
  { slug: "umraniye",       name: "Ümraniye",       type: "ilce", parent: "istanbul" },
  { slug: "uskudar",        name: "Üsküdar",        type: "ilce", parent: "istanbul" },
  { slug: "zeytinburnu",    name: "Zeytinburnu",    type: "ilce", parent: "istanbul" },

  // ════════════════════════════════════════════════════════
  // ANKARA İLÇELERİ (25 ilçe)
  // ════════════════════════════════════════════════════════
  { slug: "akyurt",         name: "Akyurt",         type: "ilce", parent: "ankara" },
  { slug: "altindag",       name: "Altındağ",       type: "ilce", parent: "ankara" },
  { slug: "ayash",          name: "Ayaş",           type: "ilce", parent: "ankara" },
  { slug: "bala",           name: "Bala",           type: "ilce", parent: "ankara" },
  { slug: "beypazari",      name: "Beypazarı",      type: "ilce", parent: "ankara" },
  { slug: "camlidere",      name: "Çamlıdere",      type: "ilce", parent: "ankara" },
  { slug: "cankaya",        name: "Çankaya",        type: "ilce", parent: "ankara" },
  { slug: "cubuk",          name: "Çubuk",          type: "ilce", parent: "ankara" },
  { slug: "elmadag",        name: "Elmadağ",        type: "ilce", parent: "ankara" },
  { slug: "etimesgut",      name: "Etimesgut",      type: "ilce", parent: "ankara" },
  { slug: "evren",          name: "Evren",          type: "ilce", parent: "ankara" },
  { slug: "golbasi",        name: "Gölbaşı",        type: "ilce", parent: "ankara" },
  { slug: "gudul",          name: "Güdül",          type: "ilce", parent: "ankara" },
  { slug: "haymana",        name: "Haymana",        type: "ilce", parent: "ankara" },
  { slug: "kahramankazan",  name: "Kahramankazan",  type: "ilce", parent: "ankara" },
  { slug: "kalecik",        name: "Kalecik",        type: "ilce", parent: "ankara" },
  { slug: "kecioren",       name: "Keçiören",       type: "ilce", parent: "ankara" },
  { slug: "kizilcahamam",   name: "Kızılcahamam",   type: "ilce", parent: "ankara" },
  { slug: "mamak",          name: "Mamak",          type: "ilce", parent: "ankara" },
  { slug: "nallihan",       name: "Nallıhan",       type: "ilce", parent: "ankara" },
  { slug: "polatli",        name: "Polatlı",        type: "ilce", parent: "ankara" },
  { slug: "pursaklar",      name: "Pursaklar",      type: "ilce", parent: "ankara" },
  { slug: "sincan",         name: "Sincan",         type: "ilce", parent: "ankara" },
  { slug: "sereflikochisar",name: "Şereflikoçhisar",type: "ilce", parent: "ankara" },
  { slug: "yenimahalle",    name: "Yenimahalle",    type: "ilce", parent: "ankara" },

  // ════════════════════════════════════════════════════════
  // İZMİR İLÇELERİ
  // ════════════════════════════════════════════════════════
  { slug: "aliaga",         name: "Aliağa",         type: "ilce", parent: "izmir" },
  { slug: "balcova",        name: "Balçova",        type: "ilce", parent: "izmir" },
  { slug: "bayindir",       name: "Bayındır",       type: "ilce", parent: "izmir" },
  { slug: "bayrakli",       name: "Bayraklı",       type: "ilce", parent: "izmir" },
  { slug: "bergama",        name: "Bergama",        type: "ilce", parent: "izmir" },
  { slug: "bornova",        name: "Bornova",        type: "ilce", parent: "izmir" },
  { slug: "buca",           name: "Buca",           type: "ilce", parent: "izmir" },
  { slug: "cesme",          name: "Çeşme",          type: "ilce", parent: "izmir" },
  { slug: "cigli",          name: "Çiğli",          type: "ilce", parent: "izmir" },
  { slug: "dikili",         name: "Dikili",         type: "ilce", parent: "izmir" },
  { slug: "foca",           name: "Foça",           type: "ilce", parent: "izmir" },
  { slug: "gaziemir",       name: "Gaziemir",       type: "ilce", parent: "izmir" },
  { slug: "guzelbahce",     name: "Güzelbahçe",     type: "ilce", parent: "izmir" },
  { slug: "karabaglar",     name: "Karabağlar",     type: "ilce", parent: "izmir" },
  { slug: "karsiyaka",      name: "Karşıyaka",      type: "ilce", parent: "izmir" },
  { slug: "kemalpasa",      name: "Kemalpaşa",      type: "ilce", parent: "izmir" },
  { slug: "kinik",          name: "Kınık",          type: "ilce", parent: "izmir" },
  { slug: "kiraz",          name: "Kiraz",          type: "ilce", parent: "izmir" },
  { slug: "konak",          name: "Konak",          type: "ilce", parent: "izmir" },
  { slug: "menderes",       name: "Menderes",       type: "ilce", parent: "izmir" },
  { slug: "menemen",        name: "Menemen",        type: "ilce", parent: "izmir" },
  { slug: "narlidere",      name: "Narlıdere",      type: "ilce", parent: "izmir" },
  { slug: "odemis",         name: "Ödemiş",         type: "ilce", parent: "izmir" },
  { slug: "selcuk",         name: "Selçuk",         type: "ilce", parent: "izmir" },
  { slug: "seferihisar",    name: "Seferihisar",    type: "ilce", parent: "izmir" },
  { slug: "tire",           name: "Tire",           type: "ilce", parent: "izmir" },
  { slug: "torbali",        name: "Torbalı",        type: "ilce", parent: "izmir" },
  { slug: "urla",           name: "Urla",           type: "ilce", parent: "izmir" },

  // ════════════════════════════════════════════════════════
  // BURSA İLÇELERİ
  // ════════════════════════════════════════════════════════
  { slug: "buyukorhan",     name: "Büyükorhan",     type: "ilce", parent: "bursa" },
  { slug: "gemlik",         name: "Gemlik",         type: "ilce", parent: "bursa" },
  { slug: "gursu",          name: "Gürsu",          type: "ilce", parent: "bursa" },
  { slug: "harmancik",      name: "Harmancık",      type: "ilce", parent: "bursa" },
  { slug: "inegol",         name: "İnegöl",         type: "ilce", parent: "bursa" },
  { slug: "iznik",          name: "İznik",          type: "ilce", parent: "bursa" },
  { slug: "karacabey",      name: "Karacabey",      type: "ilce", parent: "bursa" },
  { slug: "keles",          name: "Keles",          type: "ilce", parent: "bursa" },
  { slug: "kestel",         name: "Kestel",         type: "ilce", parent: "bursa" },
  { slug: "mudanya",        name: "Mudanya",        type: "ilce", parent: "bursa" },
  { slug: "mustafakemalpasa",name:"Mustafakemalpaşa",type:"ilce", parent: "bursa" },
  { slug: "nilufer",        name: "Nilüfer",        type: "ilce", parent: "bursa" },
  { slug: "orhaneli",       name: "Orhaneli",       type: "ilce", parent: "bursa" },
  { slug: "orhangazi",      name: "Orhangazi",      type: "ilce", parent: "bursa" },
  { slug: "osmangazi",      name: "Osmangazi",      type: "ilce", parent: "bursa" },
  { slug: "yenisehir-bursa",name: "Yenişehir",      type: "ilce", parent: "bursa" },
  { slug: "yildirim",       name: "Yıldırım",       type: "ilce", parent: "bursa" },

  // ════════════════════════════════════════════════════════
  // ANTALYA İLÇELERİ
  // ════════════════════════════════════════════════════════
  { slug: "akseki",         name: "Akseki",         type: "ilce", parent: "antalya" },
  { slug: "aksu",           name: "Aksu",           type: "ilce", parent: "antalya" },
  { slug: "alanya",         name: "Alanya",         type: "ilce", parent: "antalya" },
  { slug: "demre",          name: "Demre",          type: "ilce", parent: "antalya" },
  { slug: "dosemealti",     name: "Döşemealtı",     type: "ilce", parent: "antalya" },
  { slug: "elmali",         name: "Elmalı",         type: "ilce", parent: "antalya" },
  { slug: "finike",         name: "Finike",         type: "ilce", parent: "antalya" },
  { slug: "gazipasa",       name: "Gazipaşa",       type: "ilce", parent: "antalya" },
  { slug: "gundogmus",      name: "Gündoğmuş",      type: "ilce", parent: "antalya" },
  { slug: "ibradı",         name: "İbradı",         type: "ilce", parent: "antalya" },
  { slug: "kas",            name: "Kaş",            type: "ilce", parent: "antalya" },
  { slug: "kemer",          name: "Kemer",          type: "ilce", parent: "antalya" },
  { slug: "kepez",          name: "Kepez",          type: "ilce", parent: "antalya" },
  { slug: "konyaalti",      name: "Konyaaltı",      type: "ilce", parent: "antalya" },
  { slug: "korkuteli",      name: "Korkuteli",      type: "ilce", parent: "antalya" },
  { slug: "kumluca",        name: "Kumluca",        type: "ilce", parent: "antalya" },
  { slug: "manavgat",       name: "Manavgat",       type: "ilce", parent: "antalya" },
  { slug: "muratpasa",      name: "Muratpaşa",      type: "ilce", parent: "antalya" },
  { slug: "serik",          name: "Serik",          type: "ilce", parent: "antalya" },

  // ════════════════════════════════════════════════════════
  // ADANA İLÇELERİ
  // ════════════════════════════════════════════════════════
  { slug: "aladag",         name: "Aladağ",         type: "ilce", parent: "adana" },
  { slug: "ceyhan",         name: "Ceyhan",         type: "ilce", parent: "adana" },
  { slug: "cukurova",       name: "Çukurova",       type: "ilce", parent: "adana" },
  { slug: "feke",           name: "Feke",           type: "ilce", parent: "adana" },
  { slug: "imamoglu",       name: "İmamoğlu",       type: "ilce", parent: "adana" },
  { slug: "karaisali",      name: "Karaisalı",      type: "ilce", parent: "adana" },
  { slug: "karatas",        name: "Karataş",        type: "ilce", parent: "adana" },
  { slug: "kozan",          name: "Kozan",          type: "ilce", parent: "adana" },
  { slug: "pozanti",        name: "Pozantı",        type: "ilce", parent: "adana" },
  { slug: "saimbeyli",      name: "Saimbeyli",      type: "ilce", parent: "adana" },
  { slug: "saricam",        name: "Sarıçam",        type: "ilce", parent: "adana" },
  { slug: "seyhan",         name: "Seyhan",         type: "ilce", parent: "adana" },
  { slug: "tufanbeyli",     name: "Tufanbeyli",     type: "ilce", parent: "adana" },
  { slug: "yumurtalik",     name: "Yumurtalık",     type: "ilce", parent: "adana" },
  { slug: "yuregir",        name: "Yüreğir",        type: "ilce", parent: "adana" },

  // ════════════════════════════════════════════════════════
  // KONYA İLÇELERİ (en önemli cami halısı pazarı)
  // ════════════════════════════════════════════════════════
  { slug: "aksehir",        name: "Akşehir",        type: "ilce", parent: "konya" },
  { slug: "altinekin",      name: "Altınekin",      type: "ilce", parent: "konya" },
  { slug: "beysehir",       name: "Beyşehir",       type: "ilce", parent: "konya" },
  { slug: "bozkir",         name: "Bozkır",         type: "ilce", parent: "konya" },
  { slug: "cihanbeyli",     name: "Cihanbeyli",     type: "ilce", parent: "konya" },
  { slug: "cumra",          name: "Çumra",          type: "ilce", parent: "konya" },
  { slug: "derbent",        name: "Derbent",        type: "ilce", parent: "konya" },
  { slug: "derebucak",      name: "Derebucak",      type: "ilce", parent: "konya" },
  { slug: "doganhisar",     name: "Doğanhisar",     type: "ilce", parent: "konya" },
  { slug: "emirgazi",       name: "Emirgazi",       type: "ilce", parent: "konya" },
  { slug: "eregli",         name: "Ereğli",         type: "ilce", parent: "konya" },
  { slug: "guneysinir",     name: "Güneysınır",     type: "ilce", parent: "konya" },
  { slug: "hadim",          name: "Hadim",          type: "ilce", parent: "konya" },
  { slug: "halkapinar",     name: "Halkapınar",     type: "ilce", parent: "konya" },
  { slug: "huyuk",          name: "Hüyük",          type: "ilce", parent: "konya" },
  { slug: "ilgin",          name: "Ilgın",          type: "ilce", parent: "konya" },
  { slug: "kadinhani",      name: "Kadınhanı",      type: "ilce", parent: "konya" },
  { slug: "karapinar",      name: "Karapınar",      type: "ilce", parent: "konya" },
  { slug: "karatay",        name: "Karatay",        type: "ilce", parent: "konya" },
  { slug: "meram",          name: "Meram",          type: "ilce", parent: "konya" },
  { slug: "sarayonu",       name: "Sarayönü",       type: "ilce", parent: "konya" },
  { slug: "selcuklu",       name: "Selçuklu",       type: "ilce", parent: "konya" },
  { slug: "seydisehir",     name: "Seydişehir",     type: "ilce", parent: "konya" },
  { slug: "taşkent",        name: "Taşkent",        type: "ilce", parent: "konya" },
  { slug: "tuzlukcu",       name: "Tuzlukçu",       type: "ilce", parent: "konya" },
  { slug: "yalihuyuk",      name: "Yalıhüyük",      type: "ilce", parent: "konya" },
  { slug: "yunak",          name: "Yunak",          type: "ilce", parent: "konya" },

  // ════════════════════════════════════════════════════════
  // GAZİANTEP İLÇELERİ
  // ════════════════════════════════════════════════════════
  { slug: "araban",         name: "Araban",         type: "ilce", parent: "gaziantep" },
  { slug: "islahiye",       name: "İslahiye",       type: "ilce", parent: "gaziantep" },
  { slug: "karkamis",       name: "Karkamış",       type: "ilce", parent: "gaziantep" },
  { slug: "nizip",          name: "Nizip",          type: "ilce", parent: "gaziantep" },
  { slug: "nurdagi",        name: "Nurdağı",        type: "ilce", parent: "gaziantep" },
  { slug: "oguzeli",        name: "Oğuzeli",        type: "ilce", parent: "gaziantep" },
  { slug: "sahinbey",       name: "Şahinbey",       type: "ilce", parent: "gaziantep" },
  { slug: "sehitkamil",     name: "Şehitkamil",     type: "ilce", parent: "gaziantep" },
  { slug: "yavuzeli",       name: "Yavuzeli",       type: "ilce", parent: "gaziantep" },

  // ════════════════════════════════════════════════════════
  // MERSİN İLÇELERİ
  // ════════════════════════════════════════════════════════
  { slug: "akdeniz",        name: "Akdeniz",        type: "ilce", parent: "mersin" },
  { slug: "anamur",         name: "Anamur",         type: "ilce", parent: "mersin" },
  { slug: "aydincik",       name: "Aydıncık",       type: "ilce", parent: "mersin" },
  { slug: "bozyazi",        name: "Bozyazı",        type: "ilce", parent: "mersin" },
  { slug: "camliyayla",     name: "Çamlıyayla",     type: "ilce", parent: "mersin" },
  { slug: "erdemli",        name: "Erdemli",        type: "ilce", parent: "mersin" },
  { slug: "gulnar",         name: "Gülnar",         type: "ilce", parent: "mersin" },
  { slug: "mezitli",        name: "Mezitli",        type: "ilce", parent: "mersin" },
  { slug: "mut",            name: "Mut",            type: "ilce", parent: "mersin" },
  { slug: "silifke",        name: "Silifke",        type: "ilce", parent: "mersin" },
  { slug: "tarsus",         name: "Tarsus",         type: "ilce", parent: "mersin" },
  { slug: "toroslar",       name: "Toroslar",       type: "ilce", parent: "mersin" },
  { slug: "yenisehir-mersin",name:"Yenişehir",      type: "ilce", parent: "mersin" },

  // ════════════════════════════════════════════════════════
  // KAYSERİ İLÇELERİ
  // ════════════════════════════════════════════════════════
  { slug: "akkisla",        name: "Akkışla",        type: "ilce", parent: "kayseri" },
  { slug: "bunyan",         name: "Bünyan",         type: "ilce", parent: "kayseri" },
  { slug: "develi",         name: "Develi",         type: "ilce", parent: "kayseri" },
  { slug: "felahiye",       name: "Felahiye",       type: "ilce", parent: "kayseri" },
  { slug: "hacilar",        name: "Hacılar",        type: "ilce", parent: "kayseri" },
  { slug: "incesu",         name: "İncesu",         type: "ilce", parent: "kayseri" },
  { slug: "kocasinan",      name: "Kocasinan",      type: "ilce", parent: "kayseri" },
  { slug: "melikgazi",      name: "Melikgazi",      type: "ilce", parent: "kayseri" },
  { slug: "ozvatan",        name: "Özvatan",        type: "ilce", parent: "kayseri" },
  { slug: "pinarbasikayseri",name:"Pınarbaşı",      type: "ilce", parent: "kayseri" },
  { slug: "sarioglan",      name: "Sarıoğlan",      type: "ilce", parent: "kayseri" },
  { slug: "sariz",          name: "Sarız",          type: "ilce", parent: "kayseri" },
  { slug: "talas",          name: "Talas",          type: "ilce", parent: "kayseri" },
  { slug: "tomarza",        name: "Tomarza",        type: "ilce", parent: "kayseri" },
  { slug: "yahyali",        name: "Yahyalı",        type: "ilce", parent: "kayseri" },
  { slug: "yesilhisar",     name: "Yeşilhisar",     type: "ilce", parent: "kayseri" },

  // ════════════════════════════════════════════════════════
  // KOCAELİ İLÇELERİ
  // ════════════════════════════════════════════════════════
  { slug: "basiskele",      name: "Başiskele",      type: "ilce", parent: "kocaeli" },
  { slug: "cayirova",       name: "Çayırova",       type: "ilce", parent: "kocaeli" },
  { slug: "darica",         name: "Darıca",         type: "ilce", parent: "kocaeli" },
  { slug: "derince",        name: "Derince",        type: "ilce", parent: "kocaeli" },
  { slug: "dilovasi",       name: "Dilovası",       type: "ilce", parent: "kocaeli" },
  { slug: "gebze",          name: "Gebze",          type: "ilce", parent: "kocaeli" },
  { slug: "golcuk",         name: "Gölcük",         type: "ilce", parent: "kocaeli" },
  { slug: "izmit",          name: "İzmit",          type: "ilce", parent: "kocaeli" },
  { slug: "kandira",        name: "Kandıra",        type: "ilce", parent: "kocaeli" },
  { slug: "karamursel",     name: "Karamürsel",     type: "ilce", parent: "kocaeli" },
  { slug: "kartepe",        name: "Kartepe",        type: "ilce", parent: "kocaeli" },
  { slug: "korfez",         name: "Körfez",         type: "ilce", parent: "kocaeli" },

  // ════════════════════════════════════════════════════════
  // SAMSUN İLÇELERİ
  // ════════════════════════════════════════════════════════
  { slug: "19-mayis",       name: "19 Mayıs",       type: "ilce", parent: "samsun" },
  { slug: "alacam",         name: "Alaçam",         type: "ilce", parent: "samsun" },
  { slug: "asarcik",        name: "Asarcık",        type: "ilce", parent: "samsun" },
  { slug: "atakum",         name: "Atakum",         type: "ilce", parent: "samsun" },
  { slug: "ayvacik-samsun", name: "Ayvacık",        type: "ilce", parent: "samsun" },
  { slug: "bafra",          name: "Bafra",          type: "ilce", parent: "samsun" },
  { slug: "canik",          name: "Canik",          type: "ilce", parent: "samsun" },
  { slug: "carsamba",       name: "Çarşamba",       type: "ilce", parent: "samsun" },
  { slug: "havza",          name: "Havza",          type: "ilce", parent: "samsun" },
  { slug: "ilkadim",        name: "İlkadım",        type: "ilce", parent: "samsun" },
  { slug: "kavak",          name: "Kavak",          type: "ilce", parent: "samsun" },
  { slug: "ladik",          name: "Ladik",          type: "ilce", parent: "samsun" },
  { slug: "salipazari",     name: "Salıpazarı",     type: "ilce", parent: "samsun" },
  { slug: "terme",          name: "Terme",          type: "ilce", parent: "samsun" },
  { slug: "tekkeköy",       name: "Tekkeköy",       type: "ilce", parent: "samsun" },
  { slug: "vezirkopru",     name: "Vezirköprü",     type: "ilce", parent: "samsun" },
  { slug: "yakakent",       name: "Yakakent",       type: "ilce", parent: "samsun" },

  // ════════════════════════════════════════════════════════
  // HATAY İLÇELERİ
  // ════════════════════════════════════════════════════════
  { slug: "altinozü",       name: "Altınözü",       type: "ilce", parent: "hatay" },
  { slug: "antakya",        name: "Antakya",        type: "ilce", parent: "hatay" },
  { slug: "belen",          name: "Belen",          type: "ilce", parent: "hatay" },
  { slug: "defne",          name: "Defne",          type: "ilce", parent: "hatay" },
  { slug: "dortyol",        name: "Dörtyol",        type: "ilce", parent: "hatay" },
  { slug: "erzin",          name: "Erzin",          type: "ilce", parent: "hatay" },
  { slug: "hassa",          name: "Hassa",          type: "ilce", parent: "hatay" },
  { slug: "iskenderun",     name: "İskenderun",     type: "ilce", parent: "hatay" },
  { slug: "kirikhan",       name: "Kırıkhan",       type: "ilce", parent: "hatay" },
  { slug: "kumlu",          name: "Kumlu",          type: "ilce", parent: "hatay" },
  { slug: "payas",          name: "Payas",          type: "ilce", parent: "hatay" },
  { slug: "reyhanli",       name: "Reyhanlı",       type: "ilce", parent: "hatay" },
  { slug: "samandagi",      name: "Samandağı",      type: "ilce", parent: "hatay" },
  { slug: "yayladagi",      name: "Yayladağı",      type: "ilce", parent: "hatay" },

  // ════════════════════════════════════════════════════════
  // TRABZON İLÇELERİ
  // ════════════════════════════════════════════════════════
  { slug: "akcaabat",       name: "Akçaabat",       type: "ilce", parent: "trabzon" },
  { slug: "arsin",          name: "Arsin",          type: "ilce", parent: "trabzon" },
  { slug: "besikduzu",      name: "Beşikdüzü",      type: "ilce", parent: "trabzon" },
  { slug: "caykara",        name: "Çaykara",        type: "ilce", parent: "trabzon" },
  { slug: "of",             name: "Of",             type: "ilce", parent: "trabzon" },
  { slug: "ortahisar",      name: "Ortahisar",      type: "ilce", parent: "trabzon" },
  { slug: "tonya",          name: "Tonya",          type: "ilce", parent: "trabzon" },
  { slug: "vakfikebir",     name: "Vakfıkebir",     type: "ilce", parent: "trabzon" },
  { slug: "yomra",          name: "Yomra",          type: "ilce", parent: "trabzon" },

  // ════════════════════════════════════════════════════════
  // DİYARBAKIR İLÇELERİ
  // ════════════════════════════════════════════════════════
  { slug: "baglar",         name: "Bağlar",         type: "ilce", parent: "diyarbakir" },
  { slug: "bismil",         name: "Bismil",         type: "ilce", parent: "diyarbakir" },
  { slug: "cermik",         name: "Çermik",         type: "ilce", parent: "diyarbakir" },
  { slug: "dicle",          name: "Dicle",          type: "ilce", parent: "diyarbakir" },
  { slug: "egil",           name: "Eğil",           type: "ilce", parent: "diyarbakir" },
  { slug: "ergani",         name: "Ergani",         type: "ilce", parent: "diyarbakir" },
  { slug: "hazro",          name: "Hazro",          type: "ilce", parent: "diyarbakir" },
  { slug: "kayapinar",      name: "Kayapınar",      type: "ilce", parent: "diyarbakir" },
  { slug: "kocakoy",        name: "Kocaköy",        type: "ilce", parent: "diyarbakir" },
  { slug: "kulp",           name: "Kulp",           type: "ilce", parent: "diyarbakir" },
  { slug: "lice",           name: "Lice",           type: "ilce", parent: "diyarbakir" },
  { slug: "silvan",         name: "Silvan",         type: "ilce", parent: "diyarbakir" },
  { slug: "sur",            name: "Sur",            type: "ilce", parent: "diyarbakir" },
  { slug: "yenisehir-diyarbakir",name:"Yenişehir",  type: "ilce", parent: "diyarbakir" },

  // ════════════════════════════════════════════════════════
  // SAKARYA İLÇELERİ
  // ════════════════════════════════════════════════════════
  { slug: "adapazari",      name: "Adapazarı",      type: "ilce", parent: "sakarya" },
  { slug: "akyazi",         name: "Akyazı",         type: "ilce", parent: "sakarya" },
  { slug: "erenler",        name: "Erenler",        type: "ilce", parent: "sakarya" },
  { slug: "ferizli",        name: "Ferizli",        type: "ilce", parent: "sakarya" },
  { slug: "geyve",          name: "Geyve",          type: "ilce", parent: "sakarya" },
  { slug: "hendek",         name: "Hendek",         type: "ilce", parent: "sakarya" },
  { slug: "karapurcek",     name: "Karapürçek",     type: "ilce", parent: "sakarya" },
  { slug: "karasu",         name: "Karasu",         type: "ilce", parent: "sakarya" },
  { slug: "kaynarca",       name: "Kaynarca",       type: "ilce", parent: "sakarya" },
  { slug: "kocaali",        name: "Kocaali",        type: "ilce", parent: "sakarya" },
  { slug: "mithatpasa",     name: "Mithatpaşa",     type: "ilce", parent: "sakarya" },
  { slug: "pamukova",       name: "Pamukova",       type: "ilce", parent: "sakarya" },
  { slug: "sapanca",        name: "Sapanca",        type: "ilce", parent: "sakarya" },
  { slug: "serdivan",       name: "Serdivan",       type: "ilce", parent: "sakarya" },
  { slug: "sogutlu",        name: "Söğütlü",        type: "ilce", parent: "sakarya" },
  { slug: "tarakli",        name: "Taraklı",        type: "ilce", parent: "sakarya" },

  // ════════════════════════════════════════════════════════
  // MUĞLA İLÇELERİ
  // ════════════════════════════════════════════════════════
  { slug: "bodrum",         name: "Bodrum",         type: "ilce", parent: "mugla" },
  { slug: "dalaman",        name: "Dalaman",        type: "ilce", parent: "mugla" },
  { slug: "datca",          name: "Datça",          type: "ilce", parent: "mugla" },
  { slug: "fethiye",        name: "Fethiye",        type: "ilce", parent: "mugla" },
  { slug: "kavaklidere",    name: "Kavaklidere",    type: "ilce", parent: "mugla" },
  { slug: "koyceğiz",       name: "Köyceğiz",       type: "ilce", parent: "mugla" },
  { slug: "marmaris",       name: "Marmaris",       type: "ilce", parent: "mugla" },
  { slug: "mentese",        name: "Menteşe",        type: "ilce", parent: "mugla" },
  { slug: "milas",          name: "Milas",          type: "ilce", parent: "mugla" },
  { slug: "ortaca",         name: "Ortaca",         type: "ilce", parent: "mugla" },
  { slug: "seydikemer",     name: "Seydikemer",     type: "ilce", parent: "mugla" },
  { slug: "ula",            name: "Ula",            type: "ilce", parent: "mugla" },
  { slug: "yatagan",        name: "Yatağan",        type: "ilce", parent: "mugla" },

  // ════════════════════════════════════════════════════════
  // MANİSA İLÇELERİ
  // ════════════════════════════════════════════════════════
  { slug: "akhisar",        name: "Akhisar",        type: "ilce", parent: "manisa" },
  { slug: "alasehir",       name: "Alaşehir",       type: "ilce", parent: "manisa" },
  { slug: "demirci",        name: "Demirci",        type: "ilce", parent: "manisa" },
  { slug: "golmarmara",     name: "Gölmarmara",     type: "ilce", parent: "manisa" },
  { slug: "gordes",         name: "Gördes",         type: "ilce", parent: "manisa" },
  { slug: "kirkagac",       name: "Kırkağaç",       type: "ilce", parent: "manisa" },
  { slug: "kogani",         name: "Köprübaşı",      type: "ilce", parent: "manisa" },
  { slug: "kula",           name: "Kula",           type: "ilce", parent: "manisa" },
  { slug: "salihli",        name: "Salihli",        type: "ilce", parent: "manisa" },
  { slug: "sarıgol",        name: "Sarıgöl",        type: "ilce", parent: "manisa" },
  { slug: "saruhanli",      name: "Saruhanlı",      type: "ilce", parent: "manisa" },
  { slug: "selendi",        name: "Selendi",        type: "ilce", parent: "manisa" },
  { slug: "soma",           name: "Soma",           type: "ilce", parent: "manisa" },
  { slug: "turgutlu",       name: "Turgutlu",       type: "ilce", parent: "manisa" },
  { slug: "yunusemre",      name: "Yunusemre",      type: "ilce", parent: "manisa" },

  // ════════════════════════════════════════════════════════
  // AYDIN İLÇELERİ
  // ════════════════════════════════════════════════════════
  { slug: "bozdogan",       name: "Bozdoğan",       type: "ilce", parent: "aydin" },
  { slug: "buharkent",      name: "Buharkent",      type: "ilce", parent: "aydin" },
  { slug: "cine",           name: "Çine",           type: "ilce", parent: "aydin" },
  { slug: "didim",          name: "Didim",          type: "ilce", parent: "aydin" },
  { slug: "efeler",         name: "Efeler",         type: "ilce", parent: "aydin" },
  { slug: "germencik",      name: "Germencik",      type: "ilce", parent: "aydin" },
  { slug: "incirliova",     name: "İncirliova",     type: "ilce", parent: "aydin" },
  { slug: "karacasu",       name: "Karacasu",       type: "ilce", parent: "aydin" },
  { slug: "karpuzlu",       name: "Karpuzlu",       type: "ilce", parent: "aydin" },
  { slug: "kocarli",        name: "Koçarlı",        type: "ilce", parent: "aydin" },
  { slug: "köşk",           name: "Köşk",           type: "ilce", parent: "aydin" },
  { slug: "kusadasi",       name: "Kuşadası",       type: "ilce", parent: "aydin" },
  { slug: "kuyucak",        name: "Kuyucak",        type: "ilce", parent: "aydin" },
  { slug: "nazilli",        name: "Nazilli",        type: "ilce", parent: "aydin" },
  { slug: "soke",           name: "Söke",           type: "ilce", parent: "aydin" },
  { slug: "sultanhisar",    name: "Sultanhisar",    type: "ilce", parent: "aydin" },
  { slug: "yenipazar",      name: "Yenipazar",      type: "ilce", parent: "aydin" },

  // ════════════════════════════════════════════════════════
  // TEKİRDAĞ İLÇELERİ
  // ════════════════════════════════════════════════════════
  { slug: "cerkezkoy",      name: "Çerkezköy",      type: "ilce", parent: "tekirdag" },
  { slug: "corlu",          name: "Çorlu",          type: "ilce", parent: "tekirdag" },
  { slug: "ergene",         name: "Ergene",         type: "ilce", parent: "tekirdag" },
  { slug: "hayrabolu",      name: "Hayrabolu",      type: "ilce", parent: "tekirdag" },
  { slug: "kapakli",        name: "Kapaklı",        type: "ilce", parent: "tekirdag" },
  { slug: "malkara",        name: "Malkara",        type: "ilce", parent: "tekirdag" },
  { slug: "marmaraereglisi",name: "Marmaraereğlisi",type: "ilce", parent: "tekirdag" },
  { slug: "muratli",        name: "Muratlı",        type: "ilce", parent: "tekirdag" },
  { slug: "saray-tekirdag", name: "Saray",          type: "ilce", parent: "tekirdag" },
  { slug: "sarkoy",         name: "Şarköy",         type: "ilce", parent: "tekirdag" },
  { slug: "suleymanpasa",   name: "Süleymanpaşa",   type: "ilce", parent: "tekirdag" },

  // ════════════════════════════════════════════════════════
  // DENİZLİ İLÇELERİ
  // ════════════════════════════════════════════════════════
  { slug: "acipayam",       name: "Acıpayam",       type: "ilce", parent: "denizli" },
  { slug: "babadag",        name: "Babadağ",        type: "ilce", parent: "denizli" },
  { slug: "baklan",         name: "Baklan",         type: "ilce", parent: "denizli" },
  { slug: "bekilli",        name: "Bekilli",        type: "ilce", parent: "denizli" },
  { slug: "beyagac",        name: "Beyağaç",        type: "ilce", parent: "denizli" },
  { slug: "bozkurt",        name: "Bozkurt",        type: "ilce", parent: "denizli" },
  { slug: "buldan",         name: "Buldan",         type: "ilce", parent: "denizli" },
  { slug: "cal",            name: "Çal",            type: "ilce", parent: "denizli" },
  { slug: "cameli",         name: "Çameli",         type: "ilce", parent: "denizli" },
  { slug: "cardak-denizli", name: "Çardak",         type: "ilce", parent: "denizli" },
  { slug: "civril",         name: "Çivril",         type: "ilce", parent: "denizli" },
  { slug: "guney-denizli",  name: "Güney",          type: "ilce", parent: "denizli" },
  { slug: "honaz",          name: "Honaz",          type: "ilce", parent: "denizli" },
  { slug: "kale-denizli",   name: "Kale",           type: "ilce", parent: "denizli" },
  { slug: "merkezefendi",   name: "Merkezefendi",   type: "ilce", parent: "denizli" },
  { slug: "pamukkale",      name: "Pamukkale",      type: "ilce", parent: "denizli" },
  { slug: "saraykoy",       name: "Sarayköy",       type: "ilce", parent: "denizli" },
  { slug: "serinhisar",     name: "Serinhisar",     type: "ilce", parent: "denizli" },
  { slug: "tavas",          name: "Tavas",          type: "ilce", parent: "denizli" },

  // ════════════════════════════════════════════════════════
  // ŞANLIURFA İLÇELERİ
  // ════════════════════════════════════════════════════════
  { slug: "akcakale",       name: "Akçakale",       type: "ilce", parent: "sanliurfa" },
  { slug: "birecik",        name: "Birecik",        type: "ilce", parent: "sanliurfa" },
  { slug: "bozova",         name: "Bozova",         type: "ilce", parent: "sanliurfa" },
  { slug: "ceylanpinar",    name: "Ceylanpınar",    type: "ilce", parent: "sanliurfa" },
  { slug: "eyyubiye",       name: "Eyyübiye",       type: "ilce", parent: "sanliurfa" },
  { slug: "halfeti",        name: "Halfeti",        type: "ilce", parent: "sanliurfa" },
  { slug: "haliliye",       name: "Haliliye",       type: "ilce", parent: "sanliurfa" },
  { slug: "harran",         name: "Harran",         type: "ilce", parent: "sanliurfa" },
  { slug: "hilvan",         name: "Hilvan",         type: "ilce", parent: "sanliurfa" },
  { slug: "karakopru",      name: "Karaköprü",      type: "ilce", parent: "sanliurfa" },
  { slug: "siverek",        name: "Siverek",        type: "ilce", parent: "sanliurfa" },
  { slug: "suruc",          name: "Suruç",          type: "ilce", parent: "sanliurfa" },
  { slug: "viransehir",     name: "Viranşehir",     type: "ilce", parent: "sanliurfa" },

  // ════════════════════════════════════════════════════════
  // ESKİŞEHİR İLÇELERİ
  // ════════════════════════════════════════════════════════
  { slug: "alpu",           name: "Alpu",           type: "ilce", parent: "eskisehir" },
  { slug: "beylikova",      name: "Beylikova",      type: "ilce", parent: "eskisehir" },
  { slug: "cifteler",       name: "Çifteler",       type: "ilce", parent: "eskisehir" },
  { slug: "gunyuzu",        name: "Günyüzü",        type: "ilce", parent: "eskisehir" },
  { slug: "han",            name: "Han",            type: "ilce", parent: "eskisehir" },
  { slug: "inonu",          name: "İnönü",          type: "ilce", parent: "eskisehir" },
  { slug: "mahmudiye",      name: "Mahmudiye",      type: "ilce", parent: "eskisehir" },
  { slug: "mihalgazi",      name: "Mihalgazi",      type: "ilce", parent: "eskisehir" },
  { slug: "mihaliccik",     name: "Mihalıçcık",     type: "ilce", parent: "eskisehir" },
  { slug: "odunpazari",     name: "Odunpazarı",     type: "ilce", parent: "eskisehir" },
  { slug: "saricakaya",     name: "Sarıcakaya",     type: "ilce", parent: "eskisehir" },
  { slug: "seyitgazi",      name: "Seyitgazi",      type: "ilce", parent: "eskisehir" },
  { slug: "sivrihisar",     name: "Sivrihisar",     type: "ilce", parent: "eskisehir" },
  { slug: "tepebasi",       name: "Tepebaşı",       type: "ilce", parent: "eskisehir" },

  // ════════════════════════════════════════════════════════
  // ERZURUM İLÇELERİ
  // ════════════════════════════════════════════════════════
  { slug: "aziziye",        name: "Aziziye",        type: "ilce", parent: "erzurum" },
  { slug: "palandoken",     name: "Palandöken",     type: "ilce", parent: "erzurum" },
  { slug: "yakutiye",       name: "Yakutiye",       type: "ilce", parent: "erzurum" },
  { slug: "oltu",           name: "Oltu",           type: "ilce", parent: "erzurum" },
  { slug: "olur",           name: "Olur",           type: "ilce", parent: "erzurum" },
  { slug: "ispir",          name: "İspir",          type: "ilce", parent: "erzurum" },
  { slug: "hinis",          name: "Hınıs",          type: "ilce", parent: "erzurum" },

  // ════════════════════════════════════════════════════════
  // MALATYA İLÇELERİ
  // ════════════════════════════════════════════════════════
  { slug: "akçadağ",        name: "Akçadağ",        type: "ilce", parent: "malatya" },
  { slug: "arguvan",        name: "Arguvan",        type: "ilce", parent: "malatya" },
  { slug: "battalgazi",     name: "Battalgazi",     type: "ilce", parent: "malatya" },
  { slug: "darende",        name: "Darende",        type: "ilce", parent: "malatya" },
  { slug: "dogansehir",     name: "Doğanşehir",     type: "ilce", parent: "malatya" },
  { slug: "doganyol",       name: "Doğanyol",       type: "ilce", parent: "malatya" },
  { slug: "hekimhan",       name: "Hekimhan",       type: "ilce", parent: "malatya" },
  { slug: "kuluncak",       name: "Kuluncak",       type: "ilce", parent: "malatya" },
  { slug: "poturge",        name: "Pötürge",        type: "ilce", parent: "malatya" },
  { slug: "yazihan",        name: "Yazıhan",        type: "ilce", parent: "malatya" },
  { slug: "yesilyurt",      name: "Yeşilyurt",      type: "ilce", parent: "malatya" },
];

// Deduplicate by slug
const seen = new Set<string>();
export const ALL_CITIES = CITIES.filter((c) => {
  if (seen.has(c.slug)) return false;
  seen.add(c.slug);
  return true;
});

export function getCityBySlug(slug: string): CityData | undefined {
  return ALL_CITIES.find((c) => c.slug === slug);
}

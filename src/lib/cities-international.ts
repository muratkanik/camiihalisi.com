// International cities for EN and AR locale mosque carpet SEO pages

export interface IntlCityData {
  slug: string;
  name: string;         // English name
  nameAr?: string;      // Arabic name
  country: string;      // Country name in English
  countryAr?: string;   // Country name in Arabic
  countrySlug: string;  // Country code
  locales: string[];    // Which locales to generate for
}

export const INTL_CITIES: IntlCityData[] = [
  // ── United Kingdom ──
  { slug: "london", name: "London", country: "United Kingdom", countrySlug: "uk", locales: ["en"] },
  { slug: "birmingham", name: "Birmingham", country: "United Kingdom", countrySlug: "uk", locales: ["en"] },
  { slug: "manchester", name: "Manchester", country: "United Kingdom", countrySlug: "uk", locales: ["en"] },
  { slug: "bradford", name: "Bradford", country: "United Kingdom", countrySlug: "uk", locales: ["en"] },
  { slug: "leeds", name: "Leeds", country: "United Kingdom", countrySlug: "uk", locales: ["en"] },
  { slug: "luton", name: "Luton", country: "United Kingdom", countrySlug: "uk", locales: ["en"] },

  // ── United States ──
  { slug: "new-york", name: "New York", country: "United States", countrySlug: "us", locales: ["en"] },
  { slug: "los-angeles", name: "Los Angeles", country: "United States", countrySlug: "us", locales: ["en"] },
  { slug: "chicago", name: "Chicago", country: "United States", countrySlug: "us", locales: ["en"] },
  { slug: "houston", name: "Houston", country: "United States", countrySlug: "us", locales: ["en"] },
  { slug: "dearborn", name: "Dearborn", country: "United States", countrySlug: "us", locales: ["en"] },

  // ── Germany ──
  { slug: "berlin", name: "Berlin", country: "Germany", countrySlug: "de", locales: ["en"] },
  { slug: "cologne", name: "Cologne", country: "Germany", countrySlug: "de", locales: ["en"] },
  { slug: "frankfurt", name: "Frankfurt", country: "Germany", countrySlug: "de", locales: ["en"] },
  { slug: "hamburg", name: "Hamburg", country: "Germany", countrySlug: "de", locales: ["en"] },

  // ── France ──
  { slug: "paris", name: "Paris", country: "France", countrySlug: "fr", locales: ["en", "fr"] },
  { slug: "marseille", name: "Marseille", country: "France", countrySlug: "fr", locales: ["en", "fr"] },
  { slug: "lyon", name: "Lyon", country: "France", countrySlug: "fr", locales: ["en", "fr"] },

  // ── Netherlands ──
  { slug: "amsterdam", name: "Amsterdam", country: "Netherlands", countrySlug: "nl", locales: ["en"] },
  { slug: "rotterdam", name: "Rotterdam", country: "Netherlands", countrySlug: "nl", locales: ["en"] },

  // ── Belgium ──
  { slug: "brussels", name: "Brussels", country: "Belgium", countrySlug: "be", locales: ["en", "fr"] },
  { slug: "antwerp", name: "Antwerp", country: "Belgium", countrySlug: "be", locales: ["en"] },

  // ── Saudi Arabia ──
  { slug: "riyadh", name: "Riyadh", nameAr: "الرياض", country: "Saudi Arabia", countryAr: "المملكة العربية السعودية", countrySlug: "sa", locales: ["en", "ar"] },
  { slug: "jeddah", name: "Jeddah", nameAr: "جدة", country: "Saudi Arabia", countryAr: "المملكة العربية السعودية", countrySlug: "sa", locales: ["en", "ar"] },
  { slug: "mecca", name: "Mecca", nameAr: "مكة المكرمة", country: "Saudi Arabia", countryAr: "المملكة العربية السعودية", countrySlug: "sa", locales: ["en", "ar"] },
  { slug: "medina", name: "Medina", nameAr: "المدينة المنورة", country: "Saudi Arabia", countryAr: "المملكة العربية السعودية", countrySlug: "sa", locales: ["en", "ar"] },

  // ── UAE ──
  { slug: "dubai", name: "Dubai", nameAr: "دبي", country: "United Arab Emirates", countryAr: "الإمارات العربية المتحدة", countrySlug: "ae", locales: ["en", "ar"] },
  { slug: "abu-dhabi", name: "Abu Dhabi", nameAr: "أبو ظبي", country: "United Arab Emirates", countryAr: "الإمارات العربية المتحدة", countrySlug: "ae", locales: ["en", "ar"] },
  { slug: "sharjah", name: "Sharjah", nameAr: "الشارقة", country: "United Arab Emirates", countryAr: "الإمارات العربية المتحدة", countrySlug: "ae", locales: ["en", "ar"] },

  // ── Kuwait ──
  { slug: "kuwait-city", name: "Kuwait City", nameAr: "مدينة الكويت", country: "Kuwait", countryAr: "الكويت", countrySlug: "kw", locales: ["en", "ar"] },

  // ── Qatar ──
  { slug: "doha", name: "Doha", nameAr: "الدوحة", country: "Qatar", countryAr: "قطر", countrySlug: "qa", locales: ["en", "ar"] },

  // ── Bahrain ──
  { slug: "manama", name: "Manama", nameAr: "المنامة", country: "Bahrain", countryAr: "البحرين", countrySlug: "bh", locales: ["en", "ar"] },

  // ── Oman ──
  { slug: "muscat", name: "Muscat", nameAr: "مسقط", country: "Oman", countryAr: "عُمان", countrySlug: "om", locales: ["en", "ar"] },

  // ── Jordan ──
  { slug: "amman", name: "Amman", nameAr: "عمّان", country: "Jordan", countryAr: "الأردن", countrySlug: "jo", locales: ["en", "ar"] },

  // ── Egypt ──
  { slug: "cairo", name: "Cairo", nameAr: "القاهرة", country: "Egypt", countryAr: "مصر", countrySlug: "eg", locales: ["en", "ar"] },
  { slug: "alexandria", name: "Alexandria", nameAr: "الإسكندرية", country: "Egypt", countryAr: "مصر", countrySlug: "eg", locales: ["en", "ar"] },

  // ── Morocco ──
  { slug: "casablanca", name: "Casablanca", nameAr: "الدار البيضاء", country: "Morocco", countryAr: "المغرب", countrySlug: "ma", locales: ["en", "ar"] },
  { slug: "rabat", name: "Rabat", nameAr: "الرباط", country: "Morocco", countryAr: "المغرب", countrySlug: "ma", locales: ["en", "ar"] },

  // ── Malaysia ──
  { slug: "kuala-lumpur", name: "Kuala Lumpur", country: "Malaysia", countrySlug: "my", locales: ["en"] },

  // ── Indonesia ──
  { slug: "jakarta", name: "Jakarta", country: "Indonesia", countrySlug: "id", locales: ["en"] },
];

export function getIntlCitiesForLocale(locale: string): IntlCityData[] {
  return INTL_CITIES.filter((c) => c.locales.includes(locale));
}

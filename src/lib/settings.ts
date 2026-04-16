/**
 * Site Settings — DB-backed with hardcoded fallbacks
 * All components should call getSettings() instead of hardcoding values.
 */

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  whatsappNumber: string;   // digits only, e.g. "905323467939"
  phone: string;            // display format, e.g. "+90 532 346 79 39"
  email: string;
  address: string;
  instagramUrl: string;
  linkedinUrl: string;
  facebookUrl: string;
  mainSiteUrl: string;
  whatsappMessage: string;
}

const DEFAULTS: SiteSettings = {
  heroTitle: "Cami Halısında Türkiye'nin Güvenilir Adresi",
  heroSubtitle:
    "Türkiye'nin köklü halı ustalarından, ibadethanenize özel üretim. 50 yılı aşkın tecrübe, binlerce cami referansı.",
  whatsappNumber: "905323467939",
  phone: "+90 532 346 79 39",
  email: "info@asilhali.com.tr",
  address: "Kayseri, Türkiye",
  instagramUrl: "https://www.instagram.com/asilcarpet/",
  linkedinUrl: "https://www.linkedin.com/company/asil-hali",
  facebookUrl: "",
  mainSiteUrl: "https://www.asilhali.com.tr",
  whatsappMessage:
    "Merhaba%2C%20cami%20hal%C4%B1s%C4%B1%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.",
};

// Key mapping: DB key → SiteSettings field
const KEY_MAP: Record<string, keyof SiteSettings> = {
  hero_title: "heroTitle",
  hero_subtitle: "heroSubtitle",
  whatsapp_number: "whatsappNumber",
  phone: "phone",
  email: "email",
  address: "address",
  instagram_url: "instagramUrl",
  linkedin_url: "linkedinUrl",
  facebook_url: "facebookUrl",
  main_site_url: "mainSiteUrl",
  whatsapp_message: "whatsappMessage",
};

export const ALL_SETTING_KEYS = Object.keys(KEY_MAP);

let cached: SiteSettings | null = null;
let cacheTime = 0;
const CACHE_TTL = 60_000; // 1 minute

export async function getSettings(): Promise<SiteSettings> {
  const now = Date.now();
  if (cached && now - cacheTime < CACHE_TTL) return cached;

  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const rows = await prisma.setting.findMany({
      where: { key: { in: ALL_SETTING_KEYS } },
    });
    await prisma.$disconnect();

    const settings: SiteSettings = { ...DEFAULTS };
    for (const row of rows) {
      const field = KEY_MAP[row.key];
      if (field) (settings as any)[field] = row.value;
    }

    cached = settings;
    cacheTime = now;
    return settings;
  } catch {
    // DB unavailable — return defaults silently
    return DEFAULTS;
  }
}

/** Build a wa.me URL from stored settings */
export function buildWaUrl(settings: SiteSettings, source = "site"): string {
  return `https://wa.me/${settings.whatsappNumber}?text=${settings.whatsappMessage}`;
}

/** Build main site URL with UTM */
export function buildMainSiteUrl(
  settings: SiteSettings,
  medium = "footer",
  campaign = "site"
): string {
  return `${settings.mainSiteUrl}?utm_source=camiihalisi&utm_medium=${medium}&utm_campaign=${campaign}`;
}

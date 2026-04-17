import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

/**
 * DB override'larını dosya mesajlarının üzerine uygular.
 * Overrides shape: { [namespace]: { [locale]: { [flatKey]: string } } }
 */
function applyOverrides(
  messages: Record<string, unknown>,
  overrides: Record<string, Record<string, Record<string, string>>>,
  locale: string
): Record<string, unknown> {
  const result = JSON.parse(JSON.stringify(messages)) as Record<string, unknown>;

  for (const [ns, localeMap] of Object.entries(overrides)) {
    const keyMap = localeMap[locale];
    if (!keyMap) continue;

    for (const [flatKey, value] of Object.entries(keyMap)) {
      const parts = [ns, ...flatKey.split(".")];
      let obj = result as Record<string, unknown>;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (typeof obj[part] !== "object" || obj[part] === null) {
          obj[part] = {};
        }
        obj = obj[part] as Record<string, unknown>;
      }
      obj[parts[parts.length - 1]] = value;
    }
  }

  return result;
}

// In-memory cache for DB overrides — keyed by locale, expires after 2 minutes
const overrideCache: Map<string, { messages: Record<string, unknown>; ts: number }> = new Map();
const CACHE_TTL = 120_000; // 2 minutes

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const fileMessages = (await import(`../../messages/${locale}.json`)).default as Record<string, unknown>;

  // Check cache
  const cached = overrideCache.get(locale);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return { locale, messages: cached.messages };
  }

  // Fetch DB overrides and merge
  let messages = fileMessages;
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const row = await prisma.setting.findUnique({ where: { key: "ui_translation_overrides" } });
    await prisma.$disconnect();
    if (row) {
      const overrides = JSON.parse(row.value) as Record<string, Record<string, Record<string, string>>>;
      messages = applyOverrides(fileMessages, overrides, locale);
    }
  } catch {
    // DB erişim hatası — dosya mesajlarını kullan
  }

  overrideCache.set(locale, { messages, ts: Date.now() });

  return {
    locale,
    messages,
  };
});

import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

/**
 * DB override'larını dosya mesajlarının üzerine uygular.
 * Overrides shape: { [namespace]: { [locale]: { [flatKey]: string } } }
 * flatKey "blog.categories.all" gibi noktalı yol olabilir.
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
      // Set deeply nested value using dot-notation path
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

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const fileMessages = (await import(`../../messages/${locale}.json`)).default as Record<string, unknown>;

  // DB override'larını uygula (hata olursa görmezden gel)
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

  return {
    locale,
    messages,
  };
});

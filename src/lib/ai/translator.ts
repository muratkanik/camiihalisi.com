import { aiComplete } from "@/lib/ai/complete";

export async function handleAIGenerateTranslations(contentTR: any, targetLanguages: string[]) {
  const translations: any = {};

  for (const lang of targetLanguages) {
    const prompt = `Translate the following JSON content strictly into ${lang}. Keep the exact JSON structure and keys, only translate the values.\n\n${JSON.stringify(contentTR, null, 2)}`;

    try {
      const { content: raw } = await aiComplete({
        messages: [{ role: "user", content: prompt }],
        json: true,
      });
      translations[lang] = JSON.parse(raw);
    } catch {
      translations[lang] = null;
    }
  }

  return translations;
}

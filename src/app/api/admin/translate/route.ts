/**
 * POST /api/admin/translate
 * AI destekli çeviri — TR içeriğini hedef dillere çevirir.
 *
 * Body: { namespace: string, content: Record<string, string>, targetLocales: string[] }
 * Response: { [locale]: Record<string, string> }
 */
import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { aiComplete } from "@/lib/ai/complete";

function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  return false;
}

async function isAdminCookie(): Promise<boolean> {
  return isAdminAuthenticated();
}

const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  de: "German",
  ar: "Arabic",
  fr: "French",
  tr: "Turkish",
  ru: "Russian",
};

export async function POST(req: NextRequest) {
  if (!isAuthorized(req) && !(await isAdminCookie())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  if (!process.env.XAI_API_KEY && !process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "XAI_API_KEY veya OPENROUTER_API_KEY tanımlı değil" }, { status: 500 });
  }

  let body: { namespace?: string; content?: Record<string, string>; targetLocales?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON gövdesi" }, { status: 400 });
  }

  const { namespace = "unknown", content, targetLocales = ["en", "ar", "fr"] } = body;

  if (!content || typeof content !== "object") {
    return NextResponse.json({ error: "content alanı gerekli" }, { status: 400 });
  }

  const results: Record<string, Record<string, string>> = {};

  for (const locale of targetLocales) {
    const langName = LOCALE_NAMES[locale] ?? locale;
    const prompt = [
      `You are a professional UI translator for a Turkish mosque carpet company website.`,
      `Translate the following JSON key-value pairs from Turkish to ${langName}.`,
      `Rules:`,
      `- Keep the exact same JSON keys`,
      `- Only translate the values, never the keys`,
      `- Preserve any special characters, punctuation, and formatting (e.g., "→", "+", "%")`,
      `- Use formal, professional language appropriate for a B2B website`,
      `- For Arabic, use Modern Standard Arabic (MSA)`,
      `- Section: "${namespace}"`,
      ``,
      `Input JSON:`,
      JSON.stringify(content, null, 2),
    ].join("\n");

    try {
      const { content: raw } = await aiComplete({
        messages: [{ role: "user", content: prompt }],
        json: true,
        temperature: 0.2,
      });
      try {
        results[locale] = JSON.parse(raw);
      } catch {
        results[locale] = { _error: "JSON parse hatası" };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      results[locale] = { _error: msg };
    }
  }

  return NextResponse.json(results);
}

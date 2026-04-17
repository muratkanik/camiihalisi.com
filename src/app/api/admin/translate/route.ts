/**
 * POST /api/admin/translate
 * AI destekli çeviri — TR içeriğini hedef dillere çevirir.
 *
 * Body: { namespace: string, content: Record<string, string>, targetLocales: string[] }
 * Response: { [locale]: Record<string, string> }
 */
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  return false;
}

async function isAdminCookie(): Promise<boolean> {
  const cookieStore = await cookies();
  return !!cookieStore.get("auth_token")?.value;
}

const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  ar: "Arabic",
  fr: "French",
  tr: "Turkish",
};

export async function POST(req: NextRequest) {
  if (!isAuthorized(req) && !(await isAdminCookie())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const xaiKey = process.env.XAI_API_KEY;
  if (!xaiKey) {
    return NextResponse.json({ error: "XAI_API_KEY tanımlı değil" }, { status: 500 });
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
      const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${xaiKey}`,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          model: "grok-3",
          response_format: { type: "json_object" },
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        results[locale] = { _error: `Grok API hatası: ${response.status} — ${errText.slice(0, 200)}` };
        continue;
      }

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content ?? "{}";
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

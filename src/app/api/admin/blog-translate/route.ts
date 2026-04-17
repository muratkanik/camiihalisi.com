/**
 * POST /api/admin/blog-translate
 *
 * Blog yazısını hedef dile çevirir ve DB'ye kaydeder.
 * Body: { slug: string, targetLocale: "en"|"ar"|"fr", fields: { title, excerpt, content, metaTitle, metaDescription } }
 * Returns: { ok: true, translation: { title, excerpt, content, metaTitle, metaDescription } }
 */
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  ar: "Arabic (Modern Standard Arabic, MSA)",
  fr: "French",
};

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return !!cookieStore.get("auth_token")?.value;
}

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const xaiKey = process.env.XAI_API_KEY;
  if (!xaiKey) {
    return NextResponse.json({ error: "XAI_API_KEY tanımlı değil" }, { status: 500 });
  }

  let body: {
    slug?: string;
    targetLocale?: string;
    fields?: { title?: string; excerpt?: string; content?: string; metaTitle?: string; metaDescription?: string };
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON" }, { status: 400 });
  }

  const { slug, targetLocale, fields } = body;
  if (!slug || !targetLocale || !fields) {
    return NextResponse.json({ error: "slug, targetLocale ve fields gerekli" }, { status: 400 });
  }

  const langName = LOCALE_NAMES[targetLocale];
  if (!langName) {
    return NextResponse.json({ error: `Desteklenmeyen dil: ${targetLocale}` }, { status: 400 });
  }

  // Translate with Grok-3
  const prompt = [
    `You are a professional content translator for a Turkish mosque carpet company website.`,
    `Translate the following JSON fields from Turkish to ${langName}.`,
    ``,
    `Rules:`,
    `- Translate ALL text values to ${langName}`,
    `- Keep JSON structure and keys exactly as-is`,
    `- Preserve markdown formatting (## headings, ** bold, etc.)`,
    `- Maintain SEO quality — keep keywords natural in the target language`,
    `- For Arabic, use right-to-left appropriate phrasing`,
    `- Keep brand name "Asil Halı" unchanged`,
    `- Keep URLs, numbers, and technical terms unchanged`,
    ``,
    `Content to translate:`,
    JSON.stringify(fields, null, 2),
  ].join("\n");

  try {
    const grokRes = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${xaiKey}`,
      },
      body: JSON.stringify({
        model: "grok-3",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
    });

    if (!grokRes.ok) {
      const errText = await grokRes.text();
      return NextResponse.json(
        { error: `Grok API hatası: ${grokRes.status} — ${errText.slice(0, 200)}` },
        { status: 500 }
      );
    }

    const data = await grokRes.json();
    let raw = data.choices?.[0]?.message?.content ?? "{}";

    // Strip code fence if present
    const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match) raw = match[1];

    let translation: Record<string, string>;
    try {
      translation = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "AI geçersiz JSON döndürdü" }, { status: 500 });
    }

    // Save to DB
    const prisma = await getPrisma();
    try {
      const row = await prisma.setting.findUnique({ where: { key: "blog_translations" } });
      const existing: Record<string, Record<string, Record<string, string>>> = row
        ? JSON.parse(row.value)
        : {};

      if (!existing[slug]) existing[slug] = {};
      existing[slug][targetLocale] = { ...(existing[slug][targetLocale] ?? {}), ...translation };

      await prisma.setting.upsert({
        where: { key: "blog_translations" },
        create: { key: "blog_translations", value: JSON.stringify(existing) },
        update: { value: JSON.stringify(existing) },
      });
    } finally {
      await prisma.$disconnect();
    }

    return NextResponse.json({ ok: true, translation });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  const prisma = await getPrisma();
  try {
    const row = await prisma.setting.findUnique({ where: { key: "blog_translations" } });
    const all: Record<string, Record<string, Record<string, string>>> = row
      ? JSON.parse(row.value)
      : {};

    if (slug) {
      return NextResponse.json(all[slug] ?? {});
    }
    return NextResponse.json(all);
  } finally {
    await prisma.$disconnect();
  }
}

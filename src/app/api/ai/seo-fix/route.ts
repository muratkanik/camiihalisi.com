/**
 * POST /api/ai/seo-fix
 * Analyzes SEO issues and returns AI-generated fixes for all problematic fields.
 * Body: { keyword, title, metaTitle, metaDescription, content, issues[] }
 * Returns: { fix: { title?, metaTitle?, metaDescription?, contentAddition? } }
 */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  if (!cookieStore.get("auth_token")?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const xaiKey = process.env.XAI_API_KEY;
  if (!xaiKey) return NextResponse.json({ error: "XAI_API_KEY tanımlı değil" }, { status: 500 });

  const { keyword, title, metaTitle, metaDescription, content, issues } = await req.json();
  if (!issues?.length) return NextResponse.json({ fix: {} });

  const issueList = (issues as { field: string; problem: string }[])
    .map((i) => `- ${i.field}: ${i.problem}`)
    .join("\n");

  const wordCount = content?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  const contentSnippet = content?.slice(-600) ?? "";

  const allKeywords = keyword.split(",").map((k: string) => k.trim()).filter(Boolean);
  const primaryKeyword = allKeywords[0] || "";
  const secondaryKeywords = allKeywords.slice(1);

  const prompt = `Sen bir Türk cami halısı e-ticaret sitesi için SEO uzmanısın.

Ana anahtar kelime: "${primaryKeyword}"
${secondaryKeywords.length > 0 ? `Ek (İkincil) anahtar kelimeler: "${secondaryKeywords.join(", ")}"\n` : ""}
Mevcut başlık: "${title}"
Mevcut meta başlık: "${metaTitle || "(boş)"}"
Mevcut meta açıklama: "${metaDescription}"
İçerik kelime sayısı: ${wordCount}
İçerik sonu (son 600 karakter):
${contentSnippet}

Aşağıdaki SEO sorunlarını düzelt:
${issueList}

SADECE aşağıdaki JSON formatında yanıt ver. Sorun olmayan alanları dahil etme:
{
  "title": "düzeltilmiş başlık (45-65 karakter, anahtar kelimeyle başlasın)",
  "metaTitle": "düzeltilmiş meta başlık",
  "metaDescription": "düzeltilmiş meta açıklama (130-165 karakter)",
  "contentAddition": "içeriğe eklenecek yeni paragraflar (anahtar kelime yoğunluğu yüksekse eş anlamlılar kullan)"
}

Kurallar:
- Tüm metinler Türkçe olsun
- Başlık mutlaka "${primaryKeyword}" ile başlasın ve 45-65 karakter olsun
- Meta açıklama 130-165 karakter olsun ve anahtar kelimeyi (varsa ek anahtar kelimeleri de) içersin
- İçeriğe eklenecek yeni paragraflarda (contentAddition) tüm anahtar kelimeleri doğal ve okunaklı bir şekilde kullan
- "Asil Halı" marka adını değiştirme
- Doğal, bilgilendirici, ikna edici ton`;

  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${xaiKey}` },
      body: JSON.stringify({
        model: "grok-3",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) return NextResponse.json({ error: `AI hatası: ${res.status}` }, { status: 500 });

    const data = await res.json();
    let raw = data.choices?.[0]?.message?.content ?? "{}";
    const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match) raw = match[1];

    const fix = JSON.parse(raw);
    return NextResponse.json({ fix });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Hata" }, { status: 500 });
  }
}

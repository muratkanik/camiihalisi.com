import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  if (!cookieStore.get("auth_token")?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const xaiKey = process.env.XAI_API_KEY;
  if (!xaiKey) return NextResponse.json({ error: "XAI_API_KEY tanımlı değil" }, { status: 500 });

  const { keyword, analysis } = await req.json();
  if (!keyword?.trim()) return NextResponse.json({ error: "Anahtar kelime gerekli" }, { status: 400 });

  const prompt = `Sen camiihalisi.com için uzman bir içerik yazarı ve SEO uzmanısın. Türkiye'nin önde gelen cami halısı üreticisi Asil Halı adına yazı yazıyorsun.

Anahtar kelime: "${keyword}"

Rakip analizi özeti:
${analysis ? analysis.slice(0, 2000) : ""}

Bu anahtar kelimede Google'da ilk sayfada yer alacak kapsamlı bir blog yazısı yaz. Yazı şu özelliklere SAHİP OLMALI:
- En az 1000 kelime
- SEO uyumlu H2, H3 başlıklar
- Anahtar kelime %0.8-2% yoğunlukta
- Pratik, güvenilir, otoriter ton
- Asil Halı'nın uzmanlığını öne çıkar
- Okuyucuya gerçek değer katan içerik
- Türkçe, profesyonel, akıcı dil

SADECE aşağıdaki JSON formatında yanıt ver, başka metin ekleme:
{
  "title": "Başlık (55-65 karakter, anahtar kelime başta)",
  "metaTitle": "Meta başlık (55-65 karakter)",
  "metaDescription": "Meta açıklama (130-160 karakter, anahtar kelime içinde)",
  "excerpt": "Özet paragraf (150-200 kelime)",
  "content": "Tam içerik (H2/H3 başlıklarla, en az 1000 kelime, anahtar kelimeyi doğal kullan)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "category": "Rehber",
  "readTime": "5 dk",
  "seoKeyword": "${keyword}"
}`;

  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${xaiKey}`,
      },
      body: JSON.stringify({
        model: "grok-3",
        messages: [
          {
            role: "system",
            content: "Sen camiihalisi.com için blog içerikleri üreten uzman bir SEO içerik yazarısın. Her zaman SADECE geçerli JSON formatında yanıt verirsin, başka metin eklemezsin.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `AI hatası: ${response.status} — ${err}` }, { status: 500 });
    }

    const data = await response.json();
    let raw = data.choices?.[0]?.message?.content ?? "";

    // Extract JSON from response (AI sometimes wraps in ```json```)
    const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/) || raw.match(/```\s*([\s\S]*?)\s*```/);
    if (jsonMatch) raw = jsonMatch[1];
    // Also try to find first { ... } block
    const firstBrace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      raw = raw.slice(firstBrace, lastBrace + 1);
    }

    let blogData;
    try {
      blogData = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "AI geçersiz JSON döndürdü", raw }, { status: 500 });
    }

    return NextResponse.json({ blog: blogData });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Hata" }, { status: 500 });
  }
}

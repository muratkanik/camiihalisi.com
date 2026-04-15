import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  if (!cookieStore.get("auth_token")?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const xaiKey = process.env.XAI_API_KEY;
  if (!xaiKey) return NextResponse.json({ error: "XAI_API_KEY tanımlı değil" }, { status: 500 });

  const { keyword, currentContent, targetWords = 800 } = await req.json();
  if (!currentContent?.trim()) return NextResponse.json({ error: "İçerik gerekli" }, { status: 400 });

  const currentWordCount = currentContent.trim().split(/\s+/).length;
  const wordsNeeded = Math.max(200, targetWords - currentWordCount);

  const prompt = `Aşağıdaki cami halısı blog yazısını genişlet. Yazıya doğal bir şekilde devam eden, SEO uyumlu ek içerik yaz.

Ana anahtar kelime: "${keyword || "cami halısı"}"
Mevcut kelime sayısı: ${currentWordCount}
Eklenecek yaklaşık kelime: ${wordsNeeded}

Mevcut içerik (son bölüm):
${currentContent.slice(-500)}

SADECE eklenecek yeni paragrafları yaz. Mevcut içeriği tekrar yazma. H2/H3 başlıklar ekleyebilirsin. Türkçe, akıcı, bilgilendirici ton. Anahtar kelimeyi doğal kullan.`;

  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${xaiKey}`,
      },
      body: JSON.stringify({
        model: "grok-3",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: `AI hatası: ${response.status}` }, { status: 500 });
    }

    const data = await response.json();
    const addition = data.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ addition });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Hata" }, { status: 500 });
  }
}

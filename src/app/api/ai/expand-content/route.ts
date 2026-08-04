import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const xaiKey = process.env.XAI_API_KEY;
  if (!xaiKey) return NextResponse.json({ error: "XAI_API_KEY tanımlı değil" }, { status: 500 });

  const { keyword, currentContent = "", targetWords = 800, mode = "expand", field = "desc" } = await req.json();

  let prompt = "";

  if (mode === "generate-all") {
    prompt = `Sen bir SEO uzmanı ve profesyonel metin yazarısın. Konumuz: "${keyword || "cami halısı"}".
Lütfen bu kategori sayfası için aşağıdaki 3 içeriği üret ve SADECE JSON formatında döndür. Markdown kullanma, sadece saf JSON döndür.
Format:
{
  "description": "Kısa ve vurucu açıklama (yaklaşık 30 kelime)",
  "longDescription": "Detaylı, bilgilendirici, alt başlıklar içeren uzun SEO metni (yaklaşık 200 kelime)",
  "metaDescription": "Google arama sonuçlarında çıkacak 150-160 karakterlik meta açıklama."
}
Dikkat: Sadece geçerli JSON çıktısı ver, başka hiçbir metin ekleme.`;
  } else if (!currentContent.trim()) {
    // İçerik boşsa sıfırdan üret
    prompt = `Aşağıdaki konu için ${targetWords} kelimelik, SEO uyumlu, profesyonel bir içerik yaz:
Konu: "${keyword || "cami halısı"}"
İçerik Türü: ${field === "metaDescription" ? "150-160 karakterlik SEO Meta Açıklaması" : (field === "desc" ? "Kısa ve vurucu kategori açıklaması" : "Uzun ve detaylı, alt başlıklı kategori metni")}.`;
  } else {
    // Genişletme modu
    const currentWordCount = currentContent.trim().split(/\s+/).length;
    const wordsNeeded = Math.max(50, targetWords - currentWordCount);

    prompt = `Aşağıdaki ${field === "metaDescription" ? "meta açıklamayı" : "blog yazısını"} genişlet. Yazıya doğal bir şekilde devam eden, SEO uyumlu ek içerik yaz.

Anahtar kelime: "${keyword || "cami halısı"}"
İstenilen ek kelime: ${wordsNeeded}

Mevcut içerik (son bölüm):
${currentContent.slice(-500)}

SADECE eklenecek yeni kısmı yaz. Mevcut içeriği tekrar yazma.`;
  }

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
    const result = data.choices?.[0]?.message?.content ?? "";

    if (mode === "generate-all") {
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : result);
        return NextResponse.json(parsed);
      } catch (err) {
        return NextResponse.json({ error: "JSON parse hatası: " + result }, { status: 500 });
      }
    }

    return NextResponse.json({ addition: result });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Hata" }, { status: 500 });
  }
}

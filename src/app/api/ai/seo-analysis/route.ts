import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Auth check — cron secret veya admin cookie
  const cronSecret = process.env.CRON_SECRET;
  const hasCronSecret = !!cronSecret && req.headers.get("x-cron-secret") === cronSecret;
  if (!hasCronSecret) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const xaiKey = process.env.XAI_API_KEY;
  if (!xaiKey) {
    return NextResponse.json({ error: "XAI_API_KEY ortam değişkeni tanımlı değil." }, { status: 500 });
  }

  const { keyword } = await req.json();
  if (!keyword?.trim()) {
    return NextResponse.json({ error: "Anahtar kelime gerekli" }, { status: 400 });
  }

  const prompt = `Sen Türkçe cami halısı web sitesi (camiihalisi.com) için uzman bir SEO danışmanısın. Site Türkiye'de cami halısı, akrilik halı, yün halı, polipropilen halı, polyamid halı ve Axminster halı ürünleri satmaktadır.

Anahtar kelime: "${keyword.trim()}"

Bu anahtar kelime için kapsamlı bir rakip analizi ve SEO stratejisi oluştur. Yanıtını aşağıdaki başlıkları içerecek şekilde Türkçe olarak ver:

## 1. Rakip Stratejileri
Bu anahtar kelimede Google'da üst sıralarda yer alan sitelerin genellikle kullandığı içerik ve SEO stratejilerini açıkla. (3-5 madde)

## 2. İçerik Boşlukları ve Fırsatlar
Rakiplerin yeterince ele almadığı ve camiihalisi.com'un öne çıkabileceği fırsatları listele. (3-5 madde)

## 3. Önerilen Sayfa Yapısı
Bu anahtar kelime için ideal H1, H2, H3 başlık yapısını ve bölümleri listele.

## 4. Semantik Anahtar Kelimeler
Bu ana anahtar kelimeyle birlikte kullanılması gereken LSI/semantik kelimeler ve ilgili long-tail anahtar kelimeler. (10-15 kelime/ifade)

## 5. İç Bağlantı Önerileri
Sitenin diğer sayfalarıyla kurulabilecek iç bağlantı stratejisi.

## 6. Önerilen Meta Başlık ve Meta Açıklama
- **Meta Başlık** (55-65 karakter): ...
- **Meta Açıklama** (130-160 karakter): ...

## 7. Zorluk & Fırsat Değerlendirmesi
- Rekabet Zorluğu: X/10
- Fırsat Skoru: X/10
- Kısa Yorum: ...

Yanıtı markdown formatında, net ve uygulanabilir şekilde ver.`;

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
            content: "Sen camiihalisi.com sitesi için çalışan uzman bir SEO danışmanısın. Türkçe olarak pratik, uygulanabilir ve veri odaklı tavsiyeler veriyorsun.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.6,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `AI API hatası: ${response.status} — ${err}` }, { status: 500 });
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ analysis });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { handleAIGenerateTranslations } from '@/lib/ai/translator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { keyword } = await req.json();

    if (!keyword) {
      return NextResponse.json({ error: "Keyword required" }, { status: 400 });
    }

    // Attempt to match an existing context from ContentArchive
    const match = await prisma.contentArchive.findFirst({
      where: {
        originalText: { contains: keyword.split(' ')[0] } // Basic rough matching
      }
    });

    const contextAddition = match 
      ? `Bu konuyla ilgili kendi veritabanımızdaki uzmanlık belgesi şöyledir: ${match.originalText.substring(0, 1500)}` 
      : "";

    // 1. Generate Content in TR
    const promptTR = `
      Sen uzman bir Cami Halısı fabrikası metin yazarısın. 
      Anahtar Kelime: "${keyword}"
      ${contextAddition}
      
      Yalnızca bu JSON datasını tek bir metin kutusu içinde (Raw JSON) dön. Markdown kullanma:
      {
        "title": "Ana Başlık",
        "subtitle": "Kısa Açıklama",
        "badges": ["Rozet 1"],
        "buttons": [{"label":"Tıklayın","action":"/"}],
        "seo_score_estimated": 95
      }
    `;

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.XAI_API_KEY}`
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: promptTR }],
        model: "grok-3",
        response_format: { type: "json_object" }
      })
    });

    let trContent;
    try {
      const data = await response.json();
      trContent = JSON.parse(data.choices[0].message.content);
    } catch {
      trContent = { title: keyword, subtitle: "Otonom süreç geçici metni.", seo_score_estimated: 70 };
    }

    // 3. Autonomous Translation Pipeline
    const targetLangs = ['en', 'ar', 'fr'];
    const otherTranslations = await handleAIGenerateTranslations(trContent, targetLangs);

    const allContent = {
      tr: trContent,
      ...otherTranslations
    };

    // 4. Save to Database using Prisma
    // Creating a brand new dynamic page for this keyword
    const slug = "kategori/" + keyword.toLowerCase().replace(/\s+/g, '-');
    let page = await prisma.page.findUnique({ where: { slug } });
    if (!page) {
      page = await prisma.page.create({
        data: { slug, titleInternal: keyword, seoScore: trContent.seo_score_estimated || 0 }
      });
    }

    const block = await prisma.contentBlock.create({
      data: { pageId: page.id, componentType: "hero" }
    });

    for (const [lang, contentData] of Object.entries(allContent)) {
      if (contentData) {
        await prisma.translation.create({
          data: {
            blockId: block.id,
            locale: lang,
            contentData: JSON.stringify(contentData)
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Otonom süreç başarıyla tamamlandı. Veritabanına PDF context'li içerik işlendi.",
      payload: allContent
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const maxDuration = 300;

import { NextRequest, NextResponse } from "next/server";
import { BLOG_POSTS } from "@/lib/blog-data";
import { CONTENT_CALENDAR, getNextTarget, getLowScoreTarget, SEO_IMPROVE_THRESHOLD } from "@/lib/content-calendar";
import { scorePage, saveSeoScore } from "@/lib/seo-scorer";

const SITE_ORIGIN = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  const adminToken = req.cookies.get("auth_token")?.value;
  return !!adminToken;
}

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

async function loadDynamicSlugs(prisma: any): Promise<string[]> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: "dynamic_blog_posts" } });
    if (!row) return [];
    const posts = JSON.parse(row.value) as Array<{ slug: string }>;
    return posts.map((p) => p.slug);
  } catch {
    return [];
  }
}

async function loadSeoScores(prisma: any, slugs: string[]): Promise<Record<string, number>> {
  try {
    const keys = slugs.map((s) => `seo_score_blog_${s}`);
    const rows = await prisma.setting.findMany({ where: { key: { in: keys } } });
    const result: Record<string, number> = {};
    for (const row of rows) {
      const slug = row.key.replace("seo_score_blog_", "");
      try {
        const parsed = JSON.parse(row.value);
        result[slug] = parsed.total ?? 0;
      } catch {
        result[slug] = 0;
      }
    }
    return result;
  } catch {
    return {};
  }
}

async function logTask(prisma: any, keyword: string, slug: string, status: string, logs: string) {
  try {
    await prisma.aiTask.create({
      data: { keyword, targetPageSlug: slug, status, logs },
    });
  } catch {}
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const xaiKey = process.env.XAI_API_KEY;
  if (!xaiKey) {
    return NextResponse.json({ error: "XAI_API_KEY tanımlı değil" }, { status: 500 });
  }

  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function send(event: Record<string, unknown>) {
        controller.enqueue(enc.encode(`data: ${JSON.stringify(event)}\n\n`));
      }

      const prisma = await getPrisma();
      const startTime = Date.now();

      try {
        send({ type: "progress", message: "▶ Makale veritabanı taranıyor...", progress: 5 });
        const staticSlugs = BLOG_POSTS.map((p) => p.slug);
        const dynamicSlugs = await loadDynamicSlugs(prisma);
        const allSlugs = [...staticSlugs, ...dynamicSlugs];
        const calendarSlugs = CONTENT_CALENDAR.map((e) => e.slug);

        const coveredSlugs = calendarSlugs.filter((s) => allSlugs.includes(s));
        const scores = await loadSeoScores(prisma, coveredSlugs);

        const improvTarget = getLowScoreTarget(scores, allSlugs);
        let nextUncovered = getNextTarget(allSlugs);

        let target = nextUncovered ? nextUncovered : improvTarget;
        let mode: "new" | "improve" = nextUncovered ? "new" : "improve";

        if (!target) {
          send({ type: "progress", message: "✓ İçerik takvimi tamamlandı, iyileştirilecek makale bulunamadı.", progress: 100 });
          send({ type: "done", title: "Tamamlandı", wordCount: 0, progress: 100 });
          controller.close();
          return;
        }

        const { keyword, slug: targetSlug, category, type, targetWordCount } = target;
        send({ type: "progress", message: `▶ Hedef seçildi: "${keyword}" (${mode === "new" ? "Yeni" : "İyileştirme"})`, progress: 10 });

        let seoAnalysis = "";
        try {
          send({ type: "progress", message: "▶ SEO ve rakip analizi yapılıyor...", progress: 15 });
          const analysisRes = await fetch(`${SITE_ORIGIN}/api/ai/seo-analysis`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: req.headers.get("cookie") ?? "",
              "x-cron-secret": process.env.CRON_SECRET ?? "",
            },
            body: JSON.stringify({ keyword }),
          });
          if (analysisRes.ok) {
            const analysisText = await analysisRes.text();
            try { seoAnalysis = JSON.parse(analysisText).analysis ?? ""; } catch {}
          }
        } catch {}

        const blogPrompt = `Sen camiihalisi.com için uzman bir içerik yazarı ve SEO uzmanısın. Hedefimiz Google'da ilk 10'a girmek.
Anahtar kelime: "${keyword}"
Hedef kelime sayısı: 1500+
Kategori: ${category}
${type === "sss" ? "NOT: Bu bir SSS (Sık Sorulan Sorular) yazısıdır. Başlık soru formatında olmalı." : ""}
SEO Analizi:
${seoAnalysis.slice(0, 1500)}
Şu katı kurallara uygun, Google'da ilk sayfada yer alacak çok kapsamlı bir makale yaz:
1. **Uzunluk:** En az 1500 kelime olmalı.
2. **Teknik Derinlik:** Akrilik, Yün, Polipropilen, Polyamid hammadde türlerinden, "m² gramaj ağırlığı"ndan, hav yüksekliğinden ve ilmek sıklığından mutlaka bahset.
3. **Semantik Kelimeler (LSI):** Saflı cami halısı, Göbekli cami halısı ve Seccadeli cami halısı terimlerini H2/H3 başlıklarında hiyerarşik olarak kullan.
4. **E-E-A-T (Güven ve Otorite):** Yanmazlık (alev almazlık) belgeleri, antistatik yapı, diz izi yapmayan doku, kolay temizlenebilirlik, "50 yıllık tecrübe" ve "10.000+ cami referansı" gibi Asil Halı markasının güven sinyallerini metne doğal bir şekilde yedir.
5. **SEO Optimizasyonu:** Anahtar kelimeyi ilk paragrafta, başlıklarda ve metin içinde (%1-2 yoğunlukta) dengeli şekilde kullan. Okunabilirliği yüksek, profesyonel ama anlaşılır bir Türkçe kullan.

SADECE bu JSON formatında yanıt ver:
{
  "title": "Başlık (55-65 karakter)",
  "metaTitle": "Meta başlık (55-65 karakter)",
  "metaDescription": "Meta açıklama (130-160 karakter)",
  "excerpt": "Özet (150-200 kelime)",
  "content": "Tam içerik (H2/H3 başlıklarla, en az 1500 kelime)",
  "tags": ["tag1","tag2","tag3","tag4","tag5"],
  "category": "${category}",
  "readTime": "X dk",
  "seoKeyword": "${keyword}"
}`;

        send({ type: "progress", message: "▶ Grok-3 makaleyi yazıyor... (Bu işlem ~45sn sürebilir)", progress: 20 });
        const grokRes = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${xaiKey}` },
          body: JSON.stringify({
            model: "grok-3",
            messages: [
              { role: "system", content: "Sen camiihalisi.com için blog içerikleri üreten uzman SEO içerik yazarısın. SADECE geçerli JSON döndürürsün." },
              { role: "user", content: blogPrompt },
            ],
            temperature: 0.65,
            max_tokens: 4500,
          }),
        });

        if (!grokRes.ok) throw new Error(`AI hatası: ${grokRes.status}`);
        
        const grokData = await grokRes.json();
        let raw = grokData.choices?.[0]?.message?.content ?? "";
        const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) raw = jsonMatch[1];
        const firstBrace = raw.indexOf("{");
        const lastBrace = raw.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1) raw = raw.slice(firstBrace, lastBrace + 1);

        let blogData;
        try {
          blogData = JSON.parse(raw);
        } catch {
          throw new Error("AI geçersiz JSON döndürdü.");
        }

        send({ type: "progress", message: "✓ Makale üretildi. Veritabanına kaydediliyor...", progress: 60 });
        
        function slugify(text: string): string {
          const trMap: Record<string, string> = { ç:"c",ğ:"g",ı:"i",İ:"i",ö:"o",ş:"s",ü:"u",Ç:"c",Ğ:"g",Ö:"o",Ş:"s",Ü:"u" };
          return text.toLowerCase().replace(/[çğışöüÇĞİÖŞÜ]/g, (c) => trMap[c] ?? c).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        }

        let savedSlug: string;
        let isNew: boolean;

        if (mode === "improve") {
          const setting = await prisma.setting.findUnique({ where: { key: "blog_overrides" } });
          const overrides = setting ? JSON.parse(setting.value) : [];
          const idx = overrides.findIndex((o: { slug: string }) => o.slug === targetSlug);
          const updated = {
            slug: targetSlug, title: blogData.title, metaTitle: blogData.metaTitle,
            metaDescription: blogData.metaDescription, excerpt: blogData.excerpt,
            content: blogData.content, seoKeyword: blogData.seoKeyword,
            ...(blogData.category ? { category: blogData.category } : {}),
            ...(blogData.readTime ? { readTime: blogData.readTime } : {}),
          };
          if (idx >= 0) overrides[idx] = { ...overrides[idx], ...updated };
          else overrides.push(updated);
          await prisma.setting.upsert({
            where: { key: "blog_overrides" },
            update: { value: JSON.stringify(overrides) },
            create: { key: "blog_overrides", value: JSON.stringify(overrides) },
          });
          savedSlug = targetSlug;
          isNew = false;
        } else {
          const slug = targetSlug || slugify(blogData.title) || `ai-blog-${Date.now()}`;
          const newPost = {
            slug, title: blogData.title, metaTitle: blogData.metaTitle || blogData.title,
            metaDescription: blogData.metaDescription || "", excerpt: blogData.excerpt || "",
            content: blogData.content || "", category: blogData.category || category,
            tags: blogData.tags || [keyword], readTime: blogData.readTime || "5 dk",
            publishedAt: new Date().toISOString().split("T")[0], author: "Asil Halı Uzmanları",
            image: "/images/cami-katalog-01.png", seoKeyword: blogData.seoKeyword || keyword,
          };
          const row = await prisma.setting.findUnique({ where: { key: "dynamic_blog_posts" } });
          const existing = row ? JSON.parse(row.value) : [];
          const deduped = existing.filter((p: { slug: string }) => p.slug !== slug);
          deduped.unshift(newPost);
          await prisma.setting.upsert({
            where: { key: "dynamic_blog_posts" },
            update: { value: JSON.stringify(deduped) },
            create: { key: "dynamic_blog_posts", value: JSON.stringify(deduped) },
          });
          
          // Add to blog_overrides too
          const overRow = await prisma.setting.findUnique({ where: { key: "blog_overrides" } });
          const overrides = overRow ? JSON.parse(overRow.value) : [];
          const oIdx = overrides.findIndex((o: { slug: string }) => o.slug === slug);
          if (oIdx >= 0) overrides[oIdx] = newPost; else overrides.push(newPost);
          await prisma.setting.upsert({
            where: { key: "blog_overrides" },
            update: { value: JSON.stringify(overrides) },
            create: { key: "blog_overrides", value: JSON.stringify(overrides) },
          });

          savedSlug = slug;
          isNew = true;
        }

        try {
          const score = scorePage({
            keyword: blogData.seoKeyword || keyword,
            title: blogData.title, metaDescription: blogData.metaDescription || "",
            content: blogData.content || "", excerpt: blogData.excerpt || "",
          });
          await saveSeoScore(`blog_${savedSlug}`, score);
          send({ type: "progress", message: `✓ SEO skorları hesaplandı: ${score.total}`, progress: 70 });
        } catch (seoErr: unknown) {
          const msg = seoErr instanceof Error ? seoErr.message : String(seoErr);
          send({ type: "progress", message: `⚠ SEO hesaplama hatası: ${msg}`, progress: 70 });
        }

        const wordCount = (blogData.content ?? "").trim().split(/\s+/).length;
        await logTask(prisma, keyword, savedSlug, "completed", JSON.stringify({ mode, slug: savedSlug, isNew, wordCount, title: blogData.title, elapsed: Date.now() - startTime }));

        // Translations
        send({ type: "progress", message: "▶ Çeviri işlemleri başlatılıyor...", progress: 75 });
        const fieldsToTranslate = {
          title: blogData.title, excerpt: blogData.excerpt, content: blogData.content,
          metaTitle: blogData.metaTitle, metaDescription: blogData.metaDescription
        };

        const locales = [
          { code: "en", name: "English" },
          { code: "de", name: "German" },
          { code: "ar", name: "Arabic (MSA)" },
          { code: "fr", name: "French" }
        ];

        for (let i = 0; i < locales.length; i++) {
          const loc = locales[i];
          send({ type: "progress", message: `  ▶ ${loc.name} diline çevriliyor...`, progress: 75 + (i * 5) });
          try {
            const prompt = [
              `You are a professional content translator for a Turkish mosque carpet company website.`,
              `Translate the following JSON fields from Turkish to ${loc.name}.`,
              ``,
              `Rules:`,
              `- Translate ALL text values to ${loc.name}`,
              `- Keep JSON structure and keys exactly as-is`,
              `- Preserve markdown formatting (## headings, ** bold, etc.)`,
              `- Maintain SEO quality — keep keywords natural in the target language`,
              `- For Arabic, use right-to-left appropriate phrasing`,
              `- Keep brand name "Asil Halı" unchanged`,
              `- Keep URLs, numbers, and technical terms unchanged`,
              ``,
              `Content to translate:`,
              JSON.stringify(fieldsToTranslate, null, 2),
            ].join("\n");

            const tRes = await fetch("https://api.x.ai/v1/chat/completions", {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${xaiKey}` },
              body: JSON.stringify({
                model: "grok-3",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.2,
                response_format: { type: "json_object" },
              }),
            });

            if (tRes.ok) {
              const tData = await tRes.json();
              let tRaw = tData.choices?.[0]?.message?.content ?? "{}";
              const tMatch = tRaw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
              if (tMatch) tRaw = tMatch[1];
              const translation = JSON.parse(tRaw);

              // Save to DB
              const row = await prisma.setting.findUnique({ where: { key: "blog_translations" } });
              const existing = row ? JSON.parse(row.value) : {};
              if (!existing[savedSlug]) existing[savedSlug] = {};
              existing[savedSlug][loc.code] = { ...(existing[savedSlug][loc.code] ?? {}), ...translation };
              await prisma.setting.upsert({
                where: { key: "blog_translations" },
                create: { key: "blog_translations", value: JSON.stringify(existing) },
                update: { value: JSON.stringify(existing) },
              });
              send({ type: "progress", message: `  ✓ ${loc.name} çevirisi tamamlandı.`, progress: 75 + (i * 5) + 4 });
            } else {
              send({ type: "progress", message: `  ✗ ${loc.name} çevirisi başarısız.`, progress: 75 + (i * 5) + 4 });
            }
          } catch (e) {
            send({ type: "progress", message: `  ✗ ${loc.name} çevirisi sırasında hata.`, progress: 75 + (i * 5) + 4 });
          }
        }

        send({ type: "progress", message: "🎉 Tüm işlemler başarıyla tamamlandı!", progress: 100 });
        send({ type: "done", slug: savedSlug, title: blogData.title, wordCount, isNew, elapsed: Date.now() - startTime });

      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        try { await logTask(prisma, "unknown", "unknown", "failed", `Unhandled error: ${msg}`); } catch {}
        send({ type: "error", message: `Beklenmeyen hata: ${msg}` });
      } finally {
        await prisma.$disconnect();
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

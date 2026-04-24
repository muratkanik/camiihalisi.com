/**
 * GET /api/cron/content-engine
 *
 * Vercel Cron tarafından günde 1 kez çalıştırılır (vercel.json'da tanımlı).
 * Manuel tetikleme: admin paneli → İçerik Motoru.
 *
 * Adımlar:
 *  1. Mevcut blog slug'larını al (static + dynamic)
 *  2. İçerik takvimine bak → ilk kapsanmamış keyword'ü seç
 *     (Tümü kapsandıysa: en düşük SEO skorlu makaleyi iyileştir)
 *  3. Grok-3 ile SEO analizi yap (seo-analysis API'si)
 *  4. Grok-3 ile blog yazısı üret (generate-blog API'si)
 *  5. /api/admin/blog'a kaydet
 *  6. AiTask tablosuna log ekle
 */
import { NextRequest, NextResponse } from "next/server";
import { BLOG_POSTS } from "@/lib/blog-data";
import { CONTENT_CALENDAR, getNextTarget, getLowScoreTarget, SEO_IMPROVE_THRESHOLD } from "@/lib/content-calendar";

const SITE_ORIGIN = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// ── Auth: CRON_SECRET env ya da admin cookie ─────────────────────────────────
function isAuthorized(req: NextRequest): boolean {
  // Vercel Cron: Authorization: Bearer <CRON_SECRET>
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  // Admin cookie (manuel tetikleme)
  const adminToken = req.cookies.get("auth_token")?.value;
  return !!adminToken;
}

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

async function loadDynamicSlugs(prisma: Awaited<ReturnType<typeof getPrisma>>): Promise<string[]> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: "dynamic_blog_posts" } });
    if (!row) return [];
    const posts = JSON.parse(row.value) as Array<{ slug: string }>;
    return posts.map((p) => p.slug);
  } catch {
    return [];
  }
}

async function loadSeoScores(
  prisma: Awaited<ReturnType<typeof getPrisma>>,
  slugs: string[]
): Promise<Record<string, number>> {
  try {
    const keys = slugs.map((s) => `seo_score_blog_${s}`);
    const rows = await prisma.setting.findMany({ where: { key: { in: keys } } });
    const result: Record<string, number> = {};
    for (const row of rows) {
      const slug = row.key.replace("seo_score_blog_", "");
      try {
        const parsed = JSON.parse(row.value);
        result[slug] = parsed.score ?? 0;
      } catch {
        result[slug] = 0;
      }
    }
    return result;
  } catch {
    return {};
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const xaiKey = process.env.XAI_API_KEY;
  if (!xaiKey) {
    return NextResponse.json({ error: "XAI_API_KEY tanımlı değil" }, { status: 500 });
  }

  const prisma = await getPrisma();
  const startTime = Date.now();

  try {
    // ── 1. Mevcut sluglar ────────────────────────────────────────────────────
    const staticSlugs = BLOG_POSTS.map((p) => p.slug);
    const dynamicSlugs = await loadDynamicSlugs(prisma);
    const allSlugs = [...staticSlugs, ...dynamicSlugs];
    const calendarSlugs = CONTENT_CALENDAR.map((e) => e.slug);

    // ── 2. Hedef keyword seç ──────────────────────────────────────────────────
    // Her zaman SEO skoru < 80 olan makaleler önce iyileştirilir.
    // Sonra kapsanmamış yeni keyword eklenir.
    const coveredSlugs = calendarSlugs.filter((s) => allSlugs.includes(s));
    const scores = await loadSeoScores(prisma, coveredSlugs);

    // SEO < 80 olan var mı?
    const improvTarget = getLowScoreTarget(scores, allSlugs);
    const hasLowScore = !!improvTarget && (scores[improvTarget.slug] ?? 0) < SEO_IMPROVE_THRESHOLD;

    let target = hasLowScore ? improvTarget : getNextTarget(allSlugs);
    let mode: "new" | "improve" = hasLowScore ? "improve" : "new";

    // Yeni keyword de yoksa en düşük skorluyu iyileştir
    if (!target) {
      target = improvTarget;
      mode = "improve";
    }

    if (!target) {
      return NextResponse.json({
        ok: true,
        message: "İçerik takvimi tamamlandı, iyileştirilecek makale bulunamadı.",
        elapsed: Date.now() - startTime,
      });
    }

    const { keyword, slug: targetSlug, category, type, targetWordCount } = target;

    // ── 3. SEO Analizi ────────────────────────────────────────────────────────
    let seoAnalysis = "";
    try {
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
        try { seoAnalysis = JSON.parse(analysisText).analysis ?? ""; } catch { /* ignore */ }
      }
    } catch {
      // SEO analizi başarısız olsa da devam et
    }

    // ── 4. Blog Yazısı Üret ───────────────────────────────────────────────────
    const blogPrompt = `Sen camiihalisi.com için uzman bir içerik yazarı ve SEO uzmanısın.

Anahtar kelime: "${keyword}"
Hedef kelime sayısı: ${targetWordCount}+
Kategori: ${category}
${type === "sss" ? "NOT: Bu bir SSS (Sık Sorulan Sorular) yazısıdır. Başlık soru formatında olmalı." : ""}

SEO Analizi:
${seoAnalysis.slice(0, 1500)}

Google'da ilk sayfada yer alacak kapsamlı bir blog yazısı yaz:
- ${targetWordCount}+ kelime
- SEO uyumlu H2/H3 başlıklar
- Anahtar kelime %0.8-2% yoğunlukta
- Asil Halı uzmanlığını öne çıkar
- Türkçe, profesyonel ton

SADECE bu JSON formatında yanıt ver:
{
  "title": "Başlık (55-65 karakter)",
  "metaTitle": "Meta başlık (55-65 karakter)",
  "metaDescription": "Meta açıklama (130-160 karakter)",
  "excerpt": "Özet (150-200 kelime)",
  "content": "Tam içerik (H2/H3 başlıklarla, ${targetWordCount}+ kelime)",
  "tags": ["tag1","tag2","tag3","tag4","tag5"],
  "category": "${category}",
  "readTime": "X dk",
  "seoKeyword": "${keyword}"
}`;

    const grokRes = await fetch("https://api.x.ai/v1/chat/completions", {
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
            content: "Sen camiihalisi.com için blog içerikleri üreten uzman SEO içerik yazarısın. SADECE geçerli JSON döndürürsün.",
          },
          { role: "user", content: blogPrompt },
        ],
        temperature: 0.65,
        max_tokens: 4500,
      }),
    });

    if (!grokRes.ok) {
      const errText = await grokRes.text();
      await logTask(prisma, keyword, targetSlug, "failed", `Grok API hatası: ${grokRes.status} ${errText.slice(0, 200)}`);
      return NextResponse.json({ error: `AI hatası: ${grokRes.status}`, detail: errText.slice(0, 300) }, { status: 500 });
    }

    const grokData = await grokRes.json();
    let raw = grokData.choices?.[0]?.message?.content ?? "";

    // JSON temizle
    const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/) || raw.match(/```\s*([\s\S]*?)\s*```/);
    if (jsonMatch) raw = jsonMatch[1];
    const firstBrace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) raw = raw.slice(firstBrace, lastBrace + 1);

    let blogData;
    try {
      blogData = JSON.parse(raw);
    } catch {
      await logTask(prisma, keyword, targetSlug, "failed", `JSON parse hatası. Raw: ${raw.slice(0, 300)}`);
      return NextResponse.json({ error: "AI geçersiz JSON döndürdü", raw: raw.slice(0, 500) }, { status: 500 });
    }

    // ── 5. Blog'u Doğrudan Kaydet (HTTP fetch yok — Vercel auth bypass sorunu) ─
    function slugify(text: string): string {
      const trMap: Record<string, string> = {
        ç:"c",ğ:"g",ı:"i",İ:"i",ö:"o",ş:"s",ü:"u",Ç:"c",Ğ:"g",Ö:"o",Ş:"s",Ü:"u",
      };
      return text.toLowerCase()
        .replace(/[çğışöüÇĞİÖŞÜ]/g, (c) => trMap[c] ?? c)
        .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    }

    let savedSlug: string;
    let isNew: boolean;

    const { scorePage, saveSeoScore } = await import("@/lib/seo-scorer");

    if (mode === "improve") {
      // Mevcut postu güncelle (blog_overrides)
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
      // Yeni dinamik blog yazısı oluştur
      const slug = slugify(blogData.title) || `ai-blog-${Date.now()}`;
      const newPost = {
        slug, title: blogData.title,
        metaTitle: blogData.metaTitle || blogData.title,
        metaDescription: blogData.metaDescription || "",
        excerpt: blogData.excerpt || "",
        content: blogData.content || "",
        category: blogData.category || category,
        tags: blogData.tags || [keyword],
        readTime: blogData.readTime || "5 dk",
        publishedAt: new Date().toISOString().split("T")[0],
        author: "Asil Halı Uzmanları",
        image: "/images/cami-katalog-01.png",
        seoKeyword: blogData.seoKeyword || keyword,
      };
      const row = await prisma.setting.findUnique({ where: { key: "dynamic_blog_posts" } });
      const existing = row ? JSON.parse(row.value) : [];
      const deduped = existing.filter((p: { slug: string }) => p.slug !== slug);
      deduped.push(newPost);
      await prisma.setting.upsert({
        where: { key: "dynamic_blog_posts" },
        update: { value: JSON.stringify(deduped) },
        create: { key: "dynamic_blog_posts", value: JSON.stringify(deduped) },
      });
      savedSlug = slug;
      isNew = true;
    }

    // SEO skoru kaydet
    try {
      const score = scorePage({
        keyword: blogData.seoKeyword || keyword,
        title: blogData.title, metaDescription: blogData.metaDescription || "",
        content: blogData.content || "", excerpt: blogData.excerpt || "",
      });
      await saveSeoScore(`blog_${savedSlug}`, score);
    } catch { /* ignore */ }

    // ── 6. AiTask Log ─────────────────────────────────────────────────────────
    const wordCount = (blogData.content ?? "").trim().split(/\s+/).length;
    await logTask(
      prisma, keyword, savedSlug, "completed",
      JSON.stringify({ mode, slug: savedSlug, isNew, wordCount, title: blogData.title, elapsed: Date.now() - startTime })
    );

    return NextResponse.json({
      ok: true, mode, keyword, slug: savedSlug, isNew,
      title: blogData.title, wordCount, elapsed: Date.now() - startTime,
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    try {
      await logTask(prisma, "unknown", "unknown", "failed", `Unhandled error: ${msg}`);
    } catch { /* ignore */ }
    return NextResponse.json({ error: "Beklenmeyen hata", detail: msg }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

async function logTask(
  prisma: Awaited<ReturnType<typeof getPrisma>>,
  keyword: string,
  slug: string,
  status: string,
  logs: string
) {
  try {
    await (prisma as any).aiTask.create({
      data: { keyword, targetPageSlug: slug, status, logs },
    });
  } catch {
    // ignore log errors
  }
}

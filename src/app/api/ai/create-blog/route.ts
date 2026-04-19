/**
 * POST /api/ai/create-blog
 *
 * Streams blog post generation progress via Server-Sent Events (SSE).
 * Grok-3 ile yeni blog yazısı üretir, DB'ye kaydeder, progress akışı gönderir.
 *
 * Event types:
 *   { type: "progress", message: string, progress: number }
 *   { type: "token",    word_count: number }        ← her ~50 token'da bir
 *   { type: "done",     slug: string, title: string, wordCount: number }
 *   { type: "error",    message: string }
 */
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

function slugify(text: string): string {
  const trMap: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", Ö: "o", Ş: "s", Ü: "u",
  };
  return text
    .toLowerCase()
    .replace(/[çğışöüÇĞİÖŞÜ]/g, (c) => trMap[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return !!cookieStore.get("auth_token")?.value;
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return new Response(
      `data: ${JSON.stringify({ type: "error", message: "Yetkisiz erişim" })}\n\n`,
      { status: 401, headers: { "Content-Type": "text/event-stream" } }
    );
  }

  const xaiKey = process.env.XAI_API_KEY;
  if (!xaiKey) {
    return new Response(
      `data: ${JSON.stringify({ type: "error", message: "XAI_API_KEY tanımlı değil" })}\n\n`,
      { status: 500, headers: { "Content-Type": "text/event-stream" } }
    );
  }

  let body: { title?: string; keyword?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(
      `data: ${JSON.stringify({ type: "error", message: "Geçersiz JSON" })}\n\n`,
      { status: 400, headers: { "Content-Type": "text/event-stream" } }
    );
  }

  const { title = "", keyword = "" } = body;
  if (!title.trim()) {
    return new Response(
      `data: ${JSON.stringify({ type: "error", message: "Başlık gerekli" })}\n\n`,
      { status: 400, headers: { "Content-Type": "text/event-stream" } }
    );
  }

  const enc = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function send(event: Record<string, unknown>) {
        controller.enqueue(enc.encode(`data: ${JSON.stringify(event)}\n\n`));
      }

      try {
        send({ type: "progress", message: "🔍 Konu analiz ediliyor...", progress: 5 });
        await delay(400);

        send({ type: "progress", message: "📐 İçerik yapısı oluşturuluyor...", progress: 10 });
        await delay(300);

        const kw = keyword.trim() || title.trim();
        const prompt = buildPrompt(title.trim(), kw);

        send({ type: "progress", message: "🤖 Grok-3 yazıyor... (bu 30-60 saniye sürebilir)", progress: 15 });

        // ── Grok-3 Streaming ────────────────────────────────────────────────
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
                content:
                  "Sen camiihalisi.com için blog içerikleri üreten uzman bir SEO içerik yazarısın. Her zaman SADECE geçerli JSON formatında yanıt verirsin, başka metin eklemezsin.",
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 5000,
            stream: true,
          }),
        });

        if (!grokRes.ok) {
          const errText = await grokRes.text();
          send({ type: "error", message: `Grok API hatası: ${grokRes.status} — ${errText.slice(0, 200)}` });
          controller.close();
          return;
        }

        // Read streaming response
        let rawContent = "";
        let tokenCount = 0;
        const reader = grokRes.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content ?? "";
              if (delta) {
                rawContent += delta;
                tokenCount += delta.split(/\s+/).filter(Boolean).length;
                // Send token progress every ~80 tokens
                if (tokenCount % 80 < delta.split(/\s+/).length) {
                  const progress = Math.min(80, 15 + Math.floor(tokenCount / 15));
                  send({ type: "token", word_count: tokenCount, progress });
                }
              }
            } catch {
              // skip malformed lines
            }
          }
        }

        send({ type: "progress", message: `✅ ${tokenCount} kelime üretildi. Ayrıştırılıyor...`, progress: 82 });
        await delay(200);

        // ── Parse JSON ───────────────────────────────────────────────────────
        let raw = rawContent;
        const jsonMatch =
          raw.match(/```json\s*([\s\S]*?)\s*```/) ||
          raw.match(/```\s*([\s\S]*?)\s*```/);
        if (jsonMatch) raw = jsonMatch[1];
        const firstBrace = raw.indexOf("{");
        const lastBrace = raw.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1) {
          raw = raw.slice(firstBrace, lastBrace + 1);
        }

        let blogData: Record<string, unknown>;
        try {
          blogData = JSON.parse(raw);
        } catch {
          send({ type: "error", message: "AI geçersiz JSON döndürdü. Lütfen tekrar deneyin." });
          controller.close();
          return;
        }

        send({ type: "progress", message: "💾 DB'ye kaydediliyor...", progress: 90 });

        // ── Save to DB ───────────────────────────────────────────────────────
        const slug =
          typeof blogData.slug === "string" && blogData.slug
            ? blogData.slug
            : slugify(String(blogData.title ?? title));

        const overrideEntry = {
          slug,
          title: String(blogData.title ?? title),
          metaTitle: String(blogData.metaTitle ?? blogData.title ?? title),
          metaDescription: String(blogData.metaDescription ?? ""),
          excerpt: String(blogData.excerpt ?? ""),
          content: String(blogData.content ?? ""),
          tags: Array.isArray(blogData.tags) ? (blogData.tags as string[]) : [],
          category: String(blogData.category ?? "Rehber"),
          readTime: String(blogData.readTime ?? "5 dk"),
          author: "Asil Halı Uzmanları",
          publishedAt: new Date().toISOString().slice(0, 10),
          seoKeyword: String(blogData.seoKeyword ?? kw),
          status: "published",
          isNew: true,
        };

        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient();
        try {
          // Load existing dynamic posts
          const row = await prisma.setting.findUnique({ where: { key: "dynamic_blog_posts" } });
          const existing: Record<string, unknown>[] = row ? JSON.parse(row.value) : [];

          // Replace if slug exists, else append
          const idx = existing.findIndex(
            (p) => (p as { slug?: string }).slug === slug
          );
          if (idx >= 0) {
            existing[idx] = overrideEntry;
          } else {
            existing.unshift(overrideEntry);
          }

          await prisma.setting.upsert({
            where: { key: "dynamic_blog_posts" },
            create: { key: "dynamic_blog_posts", value: JSON.stringify(existing) },
            update: { value: JSON.stringify(existing) },
          });

          // Also save a blog_override for the static-post flow
          const overridesRow = await prisma.setting.findUnique({
            where: { key: "blog_overrides" },
          });
          const overrides: Record<string, unknown> = overridesRow
            ? JSON.parse(overridesRow.value)
            : {};
          overrides[slug] = overrideEntry;
          await prisma.setting.upsert({
            where: { key: "blog_overrides" },
            create: { key: "blog_overrides", value: JSON.stringify(overrides) },
            update: { value: JSON.stringify(overrides) },
          });
        } finally {
          await prisma.$disconnect();
        }

        const wordCount = String(blogData.content ?? "")
          .trim()
          .split(/\s+/).length;

        send({
          type: "done",
          slug,
          title: String(blogData.title ?? title),
          wordCount,
          progress: 100,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        send({ type: "error", message: `Beklenmeyen hata: ${msg}` });
      } finally {
        controller.close();
      }
    },
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

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildPrompt(title: string, keyword: string): string {
  return `Sen camiihalisi.com için uzman bir içerik yazarı ve SEO uzmanısın. Türkiye'nin önde gelen cami halısı üreticisi Asil Halı adına yazı yazıyorsun.

Makale başlığı: "${title}"
Hedef anahtar kelime: "${keyword}"

Google'da ilk sayfada yer alacak kapsamlı bir blog yazısı yaz. Yazı şu özelliklere SAHİP OLMALI:
- En az 1200 kelime içerik (content alanında)
- SEO uyumlu H2, H3 başlıklar (## ve ### markdown formatı)
- Anahtar kelime %0.8-2% yoğunlukta
- Pratik, güvenilir, otoriter ton
- Asil Halı'nın 50+ yıllık uzmanlığını öne çıkar
- Okuyucuya gerçek değer katan içerik
- Türkçe, profesyonel, akıcı dil

SADECE aşağıdaki JSON formatında yanıt ver, başka metin ekleme:
{
  "title": "Başlık (55-65 karakter, anahtar kelime başta)",
  "metaTitle": "Meta başlık (55-65 karakter)",
  "metaDescription": "Meta açıklama (130-160 karakter, anahtar kelime içinde)",
  "excerpt": "Özet paragraf (150-200 kelime)",
  "content": "Tam içerik (H2/H3 başlıklarla, en az 1200 kelime)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "category": "Rehber",
  "readTime": "6 dk",
  "seoKeyword": "${keyword}"
}`;
}

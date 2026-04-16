/**
 * GET  /api/admin/blog?q=keyword  → search similar posts
 * POST /api/admin/blog            → apply (update existing or create new)
 */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { BLOG_POSTS } from "@/lib/blog-data";

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

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

function similarity(post: typeof BLOG_POSTS[0], query: string): number {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter((w) => w.length > 2);
  let score = 0;
  const title = post.title.toLowerCase();
  const excerpt = (post.excerpt ?? "").toLowerCase();
  const content = (post.content ?? "").toLowerCase();
  const tags = (post.tags ?? []).join(" ").toLowerCase();

  if (title.includes(q)) score += 10;
  if (excerpt.includes(q)) score += 6;
  if (tags.includes(q)) score += 5;
  if (content.includes(q)) score += 3;

  for (const w of words) {
    if (title.includes(w)) score += 3;
    if (excerpt.includes(w)) score += 2;
    if (tags.includes(w)) score += 2;
    if (content.includes(w)) score += 1;
  }
  return score;
}

// GET /api/admin/blog?q=keyword
export async function GET(req: Request) {
  const cookieStore = await cookies();
  if (!cookieStore.get("auth_token")?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? "";

  // Also load dynamic posts from DB
  const prisma = await getPrisma();
  let dynamicPosts: typeof BLOG_POSTS = [];
  try {
    const row = await prisma.setting.findUnique({ where: { key: "dynamic_blog_posts" } });
    if (row) dynamicPosts = JSON.parse(row.value);
  } catch { /* ignore */ } finally {
    await prisma.$disconnect();
  }

  const allPosts = [...BLOG_POSTS, ...dynamicPosts];
  const scored = allPosts
    .map((p) => ({ ...p, score: similarity(p, q) }))
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ slug, title, category, excerpt, score, image }) => ({
      slug, title, category, excerpt: excerpt?.slice(0, 120), score, image,
    }));

  return NextResponse.json({ posts: scored });
}

// POST /api/admin/blog — apply blog data
export async function POST(req: Request) {
  const cookieStore = await cookies();
  if (!cookieStore.get("auth_token")?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { targetSlug, blogData } = await req.json();
  if (!blogData?.title) return NextResponse.json({ error: "Blog verisi eksik" }, { status: 400 });

  const prisma = await getPrisma();
  try {
    if (targetSlug) {
      // Update existing post via blog_overrides
      const setting = await prisma.setting.findUnique({ where: { key: "blog_overrides" } });
      const overrides = setting ? JSON.parse(setting.value) : [];
      const idx = overrides.findIndex((o: { slug: string }) => o.slug === targetSlug);
      const updated = {
        slug: targetSlug,
        title: blogData.title,
        metaTitle: blogData.metaTitle,
        metaDescription: blogData.metaDescription,
        excerpt: blogData.excerpt,
        content: blogData.content,
        seoKeyword: blogData.seoKeyword,
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

      // Save SEO score
      const { scorePage, saveSeoScore } = await import("@/lib/seo-scorer");
      const score = scorePage({
        keyword: blogData.seoKeyword || blogData.tags?.[0] || "cami halısı",
        title: blogData.title,
        metaDescription: blogData.metaDescription || "",
        content: blogData.content || "",
        excerpt: blogData.excerpt || "",
      });
      await saveSeoScore(`blog_${targetSlug}`, score);

      return NextResponse.json({ success: true, slug: targetSlug, isNew: false });
    } else {
      // Create new dynamic post
      const slug = slugify(blogData.title) || `ai-blog-${Date.now()}`;
      const newPost = {
        slug,
        title: blogData.title,
        metaTitle: blogData.metaTitle || blogData.title,
        metaDescription: blogData.metaDescription || "",
        excerpt: blogData.excerpt || "",
        content: blogData.content || "",
        category: blogData.category || "Rehber",
        tags: blogData.tags || [blogData.seoKeyword || "cami halısı"],
        readTime: blogData.readTime || "5 dk",
        publishedAt: new Date().toISOString().split("T")[0],
        author: "Asil Halı Uzmanları",
        image: "/images/cami-katalog-01.png",
        seoKeyword: blogData.seoKeyword || "",
      };

      const row = await prisma.setting.findUnique({ where: { key: "dynamic_blog_posts" } });
      const existing = row ? JSON.parse(row.value) : [];
      // Avoid duplicate slugs
      const deduped = existing.filter((p: { slug: string }) => p.slug !== slug);
      deduped.push(newPost);

      await prisma.setting.upsert({
        where: { key: "dynamic_blog_posts" },
        update: { value: JSON.stringify(deduped) },
        create: { key: "dynamic_blog_posts", value: JSON.stringify(deduped) },
      });

      // Save SEO score
      const { scorePage, saveSeoScore } = await import("@/lib/seo-scorer");
      const score = scorePage({
        keyword: newPost.seoKeyword || newPost.tags[0],
        title: newPost.title,
        metaDescription: newPost.metaDescription,
        content: newPost.content,
        excerpt: newPost.excerpt,
      });
      await saveSeoScore(`blog_${slug}`, score);

      return NextResponse.json({ success: true, slug, isNew: true });
    }
  } finally {
    await prisma.$disconnect();
  }
}

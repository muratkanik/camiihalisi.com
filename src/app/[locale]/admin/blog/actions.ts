"use server";

import { revalidatePath } from "next/cache";
import { BLOG_POSTS, BlogPost } from "@/lib/blog-data";
import { scorePage, saveSeoScore, SeoScoreResult } from "@/lib/seo-scorer";

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

export interface BlogOverride {
  slug: string;
  title?: string;
  excerpt?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  image?: string;
  category?: string;
  author?: string;
  publishedAt?: string;
  readTime?: string;
  seoKeyword?: string;
}

export type BlogPostWithOverride = BlogPost & { hasOverride: boolean; seoKeyword?: string };

export async function getBlogPosts(): Promise<BlogPostWithOverride[]> {
  const prisma = await getPrisma();
  let overrides: BlogOverride[] = [];
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "blog_overrides" } });
    if (setting) overrides = JSON.parse(setting.value);
  } catch {
    // ignore
  } finally {
    await prisma.$disconnect();
  }

  return BLOG_POSTS.map((post) => {
    const override = overrides.find((o) => o.slug === post.slug) ?? {};
    return {
      ...post,
      ...override,
      hasOverride: Object.keys(override).length > 0,
    };
  });
}

export async function getBlogSeoScores(): Promise<Record<string, SeoScoreResult | null>> {
  const prisma = await getPrisma();
  try {
    const slugs = BLOG_POSTS.map((p) => p.slug);
    const keys = slugs.map((s) => `seo_score_blog_${s}`);
    const rows = await prisma.setting.findMany({ where: { key: { in: keys } } });
    const result: Record<string, SeoScoreResult | null> = {};
    for (const slug of slugs) {
      const row = rows.find((r) => r.key === `seo_score_blog_${slug}`);
      result[slug] = row ? (JSON.parse(row.value) as SeoScoreResult) : null;
    }
    return result;
  } finally {
    await prisma.$disconnect();
  }
}

export async function saveBlogPostAction(formData: FormData): Promise<void> {
  const slug = formData.get("slug") as string;
  const title = (formData.get("title") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const metaTitle = (formData.get("metaTitle") as string)?.trim();
  const metaDescription = (formData.get("metaDescription") as string)?.trim();
  const image = (formData.get("image") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const author = (formData.get("author") as string)?.trim();
  const publishedAt = (formData.get("publishedAt") as string)?.trim();
  const readTime = (formData.get("readTime") as string)?.trim();
  const seoKeyword = (formData.get("seoKeyword") as string)?.trim();

  const prisma = await getPrisma();
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "blog_overrides" } });
    const overrides: BlogOverride[] = setting ? JSON.parse(setting.value) : [];

    const updated: BlogOverride = {
      slug,
      ...(title ? { title } : {}),
      ...(excerpt ? { excerpt } : {}),
      ...(content ? { content } : {}),
      ...(metaTitle ? { metaTitle } : {}),
      ...(metaDescription ? { metaDescription } : {}),
      ...(image ? { image } : {}),
      ...(category ? { category } : {}),
      ...(author ? { author } : {}),
      ...(publishedAt ? { publishedAt } : {}),
      ...(readTime ? { readTime } : {}),
      ...(seoKeyword ? { seoKeyword } : {}),
    };

    const idx = overrides.findIndex((o) => o.slug === slug);
    if (idx >= 0) {
      overrides[idx] = { ...overrides[idx], ...updated };
    } else {
      overrides.push(updated);
    }

    await prisma.setting.upsert({
      where: { key: "blog_overrides" },
      update: { value: JSON.stringify(overrides) },
      create: { key: "blog_overrides", value: JSON.stringify(overrides) },
    });

    // ── SEO Score ──────────────────────────────────────────────────────────
    const origPost = BLOG_POSTS.find((p) => p.slug === slug);
    const mergedOverride = overrides.find((o) => o.slug === slug) ?? {};
    const kw = seoKeyword || mergedOverride.seoKeyword || origPost?.tags?.[0] || "cami halısı";
    const seoScore = scorePage({
      keyword: kw,
      title: title || origPost?.title || "",
      metaDescription: metaDescription || origPost?.metaDescription || "",
      content: content || origPost?.content || "",
      excerpt: excerpt || origPost?.excerpt || "",
    });
    await saveSeoScore(`blog_${slug}`, seoScore);

    revalidatePath("/blog", "layout");
  } finally {
    await prisma.$disconnect();
  }
}

export async function resetBlogPostAction(formData: FormData): Promise<void> {
  const slug = formData.get("slug") as string;
  const prisma = await getPrisma();
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "blog_overrides" } });
    if (!setting) return;
    const overrides: BlogOverride[] = JSON.parse(setting.value);
    const updated = overrides.filter((o) => o.slug !== slug);
    await prisma.setting.update({
      where: { key: "blog_overrides" },
      data: { value: JSON.stringify(updated) },
    });

    // Recompute SEO score from original post data
    const origPost = BLOG_POSTS.find((p) => p.slug === slug);
    if (origPost) {
      const seoScore = scorePage({
        keyword: origPost.tags?.[0] || "cami halısı",
        title: origPost.title,
        metaDescription: origPost.metaDescription || "",
        content: origPost.content,
        excerpt: origPost.excerpt,
      });
      await saveSeoScore(`blog_${slug}`, seoScore);
    }

    revalidatePath("/blog", "layout");
  } finally {
    await prisma.$disconnect();
  }
}

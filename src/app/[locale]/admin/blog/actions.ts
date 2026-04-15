"use server";

import { revalidatePath } from "next/cache";
import { BLOG_POSTS, BlogPost } from "@/lib/blog-data";

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
}

export type BlogPostWithOverride = BlogPost & { hasOverride: boolean };

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

export async function saveBlogPostAction(formData: FormData): Promise<void> {
  const slug = formData.get("slug") as string;
  const title = (formData.get("title") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const metaTitle = (formData.get("metaTitle") as string)?.trim();
  const metaDescription = (formData.get("metaDescription") as string)?.trim();
  const image = (formData.get("image") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const author = (formData.get("author") as string)?.trim();
  const publishedAt = (formData.get("publishedAt") as string)?.trim();
  const readTime = (formData.get("readTime") as string)?.trim();

  const prisma = await getPrisma();
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "blog_overrides" } });
    const overrides: BlogOverride[] = setting ? JSON.parse(setting.value) : [];

    const updated: BlogOverride = {
      slug,
      ...(title ? { title } : {}),
      ...(excerpt ? { excerpt } : {}),
      ...(metaTitle ? { metaTitle } : {}),
      ...(metaDescription ? { metaDescription } : {}),
      ...(image ? { image } : {}),
      ...(category ? { category } : {}),
      ...(author ? { author } : {}),
      ...(publishedAt ? { publishedAt } : {}),
      ...(readTime ? { readTime } : {}),
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
    revalidatePath("/blog", "layout");
  } finally {
    await prisma.$disconnect();
  }
}

import { CONTENT_CALENDAR } from './src/lib/content-calendar';
import { BLOG_POSTS } from './src/lib/blog-data';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const staticSlugs = BLOG_POSTS.map((p) => p.slug);
  const row = await prisma.setting.findUnique({ where: { key: "dynamic_blog_posts" } });
  const dynamicSlugs = row ? JSON.parse(row.value).map((p: any) => p.slug) : [];
  const allSlugs = [...staticSlugs, ...dynamicSlugs];
  
  const uncovered = CONTENT_CALENDAR.filter(e => !allSlugs.includes(e.slug));
  console.log("TOTAL UNCOVERED:", uncovered.length);
  if (uncovered.length > 0) {
    console.log("FIRST UNCOVERED:", uncovered[0].slug, uncovered[0].keyword);
  } else {
    console.log("ALL COVERED");
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { CONTENT_CALENDAR } = require('./src/lib/content-calendar.ts');
const { BLOG_POSTS } = require('./src/lib/blog-data.ts');

async function main() {
  const staticSlugs = BLOG_POSTS.map((p) => p.slug);
  const row = await prisma.setting.findUnique({ where: { key: "dynamic_blog_posts" } });
  const dynamicSlugs = row ? JSON.parse(row.value).map(p => p.slug) : [];
  const allSlugs = [...staticSlugs, ...dynamicSlugs];
  
  const covered = CONTENT_CALENDAR.filter(e => allSlugs.includes(e.slug));
  console.log("COVERED ARTICLES:");
  for (const c of covered) {
    const s = await prisma.setting.findUnique({ where: { key: `seo_score_blog_${c.slug}` } });
    const score = s ? JSON.parse(s.value).total : "NO SCORE";
    console.log(`- ${c.slug} | SCORE: ${score}`);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const tasks = await prisma.aiTask.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
  console.log("LAST 5 TASKS:", tasks.map(t => ({ keyword: t.keyword, status: t.status, date: t.createdAt })));
  
  const dyn = await prisma.setting.findUnique({ where: { key: "dynamic_blog_posts" } });
  if (dyn) {
    const posts = JSON.parse(dyn.value);
    console.log("DYNAMIC POST SLUGS:", posts.map(p => p.slug));
  } else {
    console.log("NO DYNAMIC POSTS");
  }

  const overrides = await prisma.setting.findUnique({ where: { key: "blog_overrides" } });
  if (overrides) {
    console.log("BLOG OVERRIDES:", JSON.parse(overrides.value).map(o => o.slug));
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());

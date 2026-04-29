const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const dynRow = await prisma.setting.findUnique({ where: { key: "dynamic_blog_posts" } });
  if (!dynRow) return console.log("No dynamic posts");
  
  const posts = JSON.parse(dynRow.value);
  console.log("ALL POSTS:");
  posts.forEach(p => console.log(`- Slug: ${p.slug} | Keyword: ${p.seoKeyword}`));
}
main().catch(console.error).finally(() => prisma.$disconnect());

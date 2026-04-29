const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const rows = await prisma.setting.findMany({ where: { key: { startsWith: 'seo_score_blog_' } } });
  for (const row of rows) {
    const data = JSON.parse(row.value);
    console.log(row.key, "SCORE:", data.total);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());

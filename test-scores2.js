const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const s = await prisma.setting.findUnique({ where: { key: "seo_score_blog_cami-halisi-olcusu-nasil-alinir" } });
  if (s) {
    const parsed = JSON.parse(s.value);
    console.log("SCORE:", parsed.total, "CHECKS:", parsed.checks);
  } else {
    console.log("NO SCORE FOUND");
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());

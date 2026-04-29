const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const keys = [
    "seo_score_blog_cami-halisi-renk-secimi-nasil-yapilir",
    "seo_score_blog_cami-halisi-fiyatlari-2025",
    "seo_score_blog_cami-halisi-fiyatlari-2025-guncel-rehber-ve-i-puclari"
  ];
  for(const k of keys) {
    const s = await prisma.setting.findUnique({ where: { key: k } });
    if (s) {
      const data = JSON.parse(s.value);
      console.log(k, "SCORE:", data.total, "CHECKS:", Object.keys(data.checks).map(c => `${c}: ${data.checks[c].score}`).join(', '));
    } else {
      console.log(k, "NOT FOUND");
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());

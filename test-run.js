const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { CONTENT_CALENDAR, getNextTarget, getLowScoreTarget, SEO_IMPROVE_THRESHOLD } = require('./src/lib/content-calendar.ts');
const { BLOG_POSTS } = require('./src/lib/blog-data.ts');

async function main() {
  const staticSlugs = BLOG_POSTS.map((p) => p.slug);
  
  const row = await prisma.setting.findUnique({ where: { key: "dynamic_blog_posts" } });
  const dynamicPosts = row ? JSON.parse(row.value) : [];
  const dynamicSlugs = dynamicPosts.map((p) => p.slug);
  
  const allSlugs = [...staticSlugs, ...dynamicSlugs];

  const calendarSlugs = CONTENT_CALENDAR.map((e) => e.slug);
  const coveredSlugs = calendarSlugs.filter((s) => allSlugs.includes(s));
  
  const scoreKeys = coveredSlugs.map((s) => `seo_score_blog_${s}`);
  const scoreRows = await prisma.setting.findMany({ where: { key: { in: scoreKeys } } });
  const scores = {};
  for (const row of scoreRows) {
    const slug = row.key.replace("seo_score_blog_", "");
    try {
      const parsed = JSON.parse(row.value);
      scores[slug] = parsed.total ?? 0;
    } catch {
      scores[slug] = 0;
    }
  }

  const improvTarget = getLowScoreTarget(scores, allSlugs);
  const hasLowScore = !!improvTarget && (scores[improvTarget.slug] ?? 0) < SEO_IMPROVE_THRESHOLD;

  let target = hasLowScore ? improvTarget : getNextTarget(allSlugs);
  let mode = hasLowScore ? "improve" : "new";

  if (!target) {
    target = improvTarget;
    mode = "improve";
  }

  console.log("hasLowScore:", hasLowScore);
  console.log("improvTarget:", improvTarget ? improvTarget.slug : "none", "Score:", improvTarget ? scores[improvTarget.slug] : "N/A");
  console.log("target selected:", target ? target.slug : "none");
  console.log("mode:", mode);
}
main().catch(console.error).finally(() => prisma.$disconnect());

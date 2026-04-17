import { CONTENT_CALENDAR } from "@/lib/content-calendar";
import { BLOG_POSTS } from "@/lib/blog-data";
import ContentEngineClient from "@/components/admin/ContentEngineClient";

export const dynamic = "force-dynamic";

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

async function getStatus() {
  const prisma = await getPrisma();
  try {
    // Dynamic blog slugs
    const dynRow = await prisma.setting.findUnique({ where: { key: "dynamic_blog_posts" } });
    const dynamicPosts: Array<{ slug: string; title: string; publishedAt: string }> =
      dynRow ? JSON.parse(dynRow.value) : [];
    const dynamicSlugs = dynamicPosts.map((p) => p.slug);

    // SEO scores for calendar slugs
    const calSlugs = CONTENT_CALENDAR.map((e) => e.slug);
    const scoreKeys = calSlugs.map((s) => `seo_score_blog_${s}`);
    const scoreRows = await prisma.setting.findMany({ where: { key: { in: scoreKeys } } });
    const scoreMap: Record<string, number> = {};
    for (const row of scoreRows) {
      const slug = row.key.replace("seo_score_blog_", "");
      try { scoreMap[slug] = JSON.parse(row.value).score ?? 0; } catch { scoreMap[slug] = 0; }
    }

    // Recent AI tasks
    const recentTasks = await (prisma as any).aiTask.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    }).catch(() => []);

    await prisma.$disconnect();

    const staticSlugs = BLOG_POSTS.map((p) => p.slug);
    const allSlugs = [...staticSlugs, ...dynamicSlugs];

    const calendar = CONTENT_CALENDAR.map((entry) => ({
      ...entry,
      covered: allSlugs.includes(entry.slug),
      seoScore: scoreMap[entry.slug] ?? null,
    }));

    const covered = calendar.filter((e) => e.covered).length;
    const pending = calendar.filter((e) => !e.covered).length;
    const next = calendar.find((e) => !e.covered) ?? null;

    return { calendar, covered, pending, next, recentTasks, dynamicPosts };
  } catch {
    await prisma.$disconnect();
    return { calendar: [], covered: 0, pending: 0, next: null, recentTasks: [], dynamicPosts: [] };
  }
}

export default async function IcerikMotoruPage() {
  const { calendar, covered, pending, next, recentTasks, dynamicPosts } = await getStatus();

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            ⚙️ İçerik Motoru
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Günlük otomatik makale üretimi · Grok-3 destekli · Vercel Cron her sabah 09:00
          </p>
        </div>
      </div>

      {/* İstatistik kartları */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Toplam Hedef", value: calendar.length, color: "text-slate-700 dark:text-white" },
          { label: "Tamamlanan", value: covered, color: "text-green-600 dark:text-green-400" },
          { label: "Bekleyen", value: pending, color: "text-amber-600 dark:text-amber-400" },
          { label: "AI Makale", value: dynamicPosts.length, color: "text-[#006064] dark:text-teal-400" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
            <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Client bileşeni: Manuel tetikleme + log */}
      <ContentEngineClient
        nextKeyword={next?.keyword ?? null}
        nextSlug={next?.slug ?? null}
        recentTasks={recentTasks}
      />

      {/* İçerik Takvimi */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
            İçerik Takvimi — {calendar.length} Hedef
          </h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {calendar.map((entry) => (
            <div key={entry.slug} className="flex items-center gap-4 px-6 py-3">
              {/* Durum */}
              <div className="flex-shrink-0">
                {entry.covered ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded-full">
                    ✓ Yayında
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full">
                    ⏳ Bekliyor
                  </span>
                )}
              </div>

              {/* İçerik */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                  {entry.keyword}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {entry.category} · {entry.targetWordCount}+ kelime · {entry.searchIntent}
                </p>
              </div>

              {/* SEO Skoru */}
              <div className="flex-shrink-0 text-right">
                {entry.seoScore !== null ? (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    entry.seoScore >= 80 ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400" :
                    entry.seoScore >= 50 ? "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" :
                    "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                  }`}>
                    SEO {entry.seoScore}
                  </span>
                ) : (
                  <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
                )}
              </div>

              {/* Öncelik */}
              <div className="flex-shrink-0 w-8 text-right">
                <span className="text-xs text-slate-400">#{entry.priority}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { getCategories, getCategorySeoScores, resetCategoryAction, CategoryWithOverride } from "./actions";
import { Package, ChevronRight, RotateCcw, ExternalLink } from "lucide-react";
import SeoScoreBadge from "@/components/admin/SeoScoreBadge";
import { SeoScoreResult } from "@/lib/seo-scorer";
import KategoriEditFormClient from "@/components/admin/KategoriEditFormClient";

export const dynamic = "force-dynamic";

export default async function KategorilerAdminPage() {
  const [categories, scores] = await Promise.all([getCategories(), getCategorySeoScores()]);
  const mainSlugs = ["akrilik-cami-halisi","yun-cami-halisi","polipropilen-cami-halisi","polyamid-cami-halisi","ozel-desen-axminster-cami-halisi"];
  const mainCategories = categories.filter((c) => mainSlugs.includes(c.slug));
  const subCategories = categories.filter((c) => !mainSlugs.includes(c.slug));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Kategori Yönetimi</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Kategorilerin başlık, açıklama, görsel ve özelliklerini düzenleyin. SEO skoru kayıt sırasında otomatik hesaplanır.
        </p>
      </div>

      <Section title="Ana Kategoriler" icon={<Package className="w-4 h-4" />}>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {mainCategories.map((cat) => (
            <CategoryRow key={cat.slug} cat={cat} seoScore={scores[cat.slug] ?? null} />
          ))}
        </div>
      </Section>

      <Section title="Alt Kategoriler" icon={<ChevronRight className="w-4 h-4" />}>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {subCategories.map((cat) => (
            <CategoryRow key={cat.slug} cat={cat} seoScore={scores[cat.slug] ?? null} isSubcategory />
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
          {icon}
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function CategoryRow({ cat, seoScore, isSubcategory = false }: {
  cat: CategoryWithOverride;
  seoScore: SeoScoreResult | null;
  isSubcategory?: boolean;
}) {
  return (
    <details className="group" id={`cat-${cat.slug}`}>
      <summary className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all list-none">
        <div className={`rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200 dark:border-slate-700 ${isSubcategory ? "w-10 h-8" : "w-14 h-10"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-800 dark:text-white text-sm">{cat.title}</span>
            {cat.hasOverride && (
              <span className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                Düzenlendi
              </span>
            )}
            {cat.badge && (
              <span className="text-xs bg-[#C9972B]/10 text-[#C9972B] px-2 py-0.5 rounded-full font-medium border border-[#C9972B]/20">
                {cat.badge}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <p className="text-xs text-slate-400">/kategori/{cat.slug}</p>
            <SeoScoreBadge score={seoScore} compact />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={`/kategori/${cat.slug}`}
            target="_blank"
            rel="noopener"
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <ChevronRight className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-90" />
        </div>
      </summary>

      {/* SEO Score full breakdown */}
      {seoScore && (
        <div className="px-6 pt-4 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800">
          <SeoScoreBadge score={seoScore} />
        </div>
      )}

      {/* Edit form — client component with image picker */}
      <div className="px-6 pt-4 pb-2 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800">
        <KategoriEditFormClient cat={cat} />
      </div>

      {/* Reset form — separate, outside save form */}
      {cat.hasOverride && (
        <div className="px-6 pb-4 bg-slate-50/50 dark:bg-slate-800/20">
          <form action={resetCategoryAction}>
            <input type="hidden" name="slug" value={cat.slug} />
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Varsayılana Sıfırla
            </button>
          </form>
        </div>
      )}
    </details>
  );
}


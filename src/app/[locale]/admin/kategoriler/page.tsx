import { getCategories, saveCategoryAction, resetCategoryAction, CategoryWithOverride } from "./actions";
import { Package, ChevronRight, RotateCcw, Save, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function KategorilerAdminPage() {
  const categories = await getCategories();
  const mainCategories = categories.filter((c) => !c.slug.includes("-") ||
    ["akrilik-cami-halisi","yun-cami-halisi","polipropilen-cami-halisi","polyamid-cami-halisi","ozel-desen-axminster-cami-halisi"].includes(c.slug));
  const subCategories = categories.filter((c) => !mainCategories.find(m => m.slug === c.slug));

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Kategori Yönetimi</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Kategorilerin başlık, açıklama, görsel ve özelliklerini düzenleyin. Değişiklikler anında yayınlanır.
        </p>
      </div>

      {/* Main Categories */}
      <Section title="Ana Kategoriler" icon={<Package className="w-4 h-4" />}>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {mainCategories.map((cat) => (
            <CategoryRow key={cat.slug} cat={cat} />
          ))}
        </div>
      </Section>

      {/* Sub Categories */}
      <Section title="Alt Kategoriler" icon={<ChevronRight className="w-4 h-4" />}>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {subCategories.map((cat) => (
            <CategoryRow key={cat.slug} cat={cat} isSubcategory />
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

function CategoryRow({ cat, isSubcategory = false }: { cat: CategoryWithOverride; isSubcategory?: boolean }) {
  return (
    <details className="group" id={`cat-${cat.slug}`}>
      <summary className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all list-none">
        {/* Preview image */}
        <div className={`rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200 dark:border-slate-700 ${isSubcategory ? "w-10 h-8" : "w-14 h-10"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
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
          <p className="text-xs text-slate-400 mt-0.5 truncate">/kategori/{cat.slug}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={`/kategori/${cat.slug}`}
            target="_blank"
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <ChevronRight className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-90" />
        </div>
      </summary>

      {/* Edit form */}
      <div className="px-6 pb-6 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800">
        <form action={saveCategoryAction} className="space-y-4 pt-4">
          <input type="hidden" name="slug" value={cat.slug} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Başlık" name="title" defaultValue={cat.title} placeholder="Kategori başlığı" />
            <Field label="Rozet" name="badge" defaultValue={cat.badge} placeholder="Örn: En Çok Satan" />
          </div>

          <Field
            label="Açıklama"
            name="description"
            defaultValue={cat.description}
            placeholder="Kategori açıklaması"
            type="textarea"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Görsel URL" name="image" defaultValue={cat.image} placeholder="/images/cami-1.png" />
            <Field label="Renk (hex)" name="color" defaultValue={cat.color} placeholder="#1B4332" />
          </div>

          <Field
            label="Özellikler (virgülle ayırın)"
            name="features"
            defaultValue={cat.features.join(", ")}
            placeholder="Solmaz Renk, Yumuşak Doku, Ekonomik"
          />

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B4332] text-white font-bold text-sm hover:bg-[#0D2418] transition-all"
            >
              <Save className="w-4 h-4" />
              Kaydet
            </button>
            {cat.hasOverride && (
              <form action={resetCategoryAction} className="inline">
                <input type="hidden" name="slug" value={cat.slug} />
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Sıfırla
                </button>
              </form>
            )}
            <span className="text-xs text-slate-400 ml-auto">
              Slug: <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{cat.slug}</code>
            </span>
          </div>
        </form>
      </div>
    </details>
  );
}

function Field({
  label, name, defaultValue, placeholder, type = "text",
}: {
  label: string; name: string; defaultValue: string; placeholder?: string; type?: "text" | "textarea";
}) {
  const cls = "w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40 focus:border-[#C9972B]";
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>
      {type === "textarea" ? (
        <textarea name={name} defaultValue={defaultValue} placeholder={placeholder} rows={3} className={`${cls} resize-y`} />
      ) : (
        <input type="text" name={name} defaultValue={defaultValue} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}

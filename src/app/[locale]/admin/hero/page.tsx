import { getHeroSlides, removeHeroSlideAction, toggleHeroSlideAction, initDefaultSlidesAction } from "./actions";
import { Image as ImageIcon, Eye, EyeOff, Trash2, RefreshCw, Plus } from "lucide-react";
import HeroAddFormClient from "@/components/admin/HeroAddFormClient";

export const dynamic = "force-dynamic";

export default async function HeroAdminPage() {
  const slides = await getHeroSlides();
  const activeCount = slides.filter((s) => s.isActive).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Hero Slayt Yönetimi</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Ana sayfadaki hero bölümünde gösterilecek fotoğrafları yönetin.
            <span className="ml-2 inline-flex items-center gap-1 text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {activeCount} aktif slayt
            </span>
          </p>
        </div>
        <form action={initDefaultSlidesAction}>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Varsayılanları Yükle
          </button>
        </form>
      </div>

      {/* Yeni Slayt Ekle */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-8">
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Yeni Slayt Ekle
        </h2>
        <HeroAddFormClient />
      </div>

      {/* Slayt Listesi */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Mevcut Slaytlar ({slides.length} toplam)
          </h2>
        </div>

        {slides.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Henüz slayt yok.</p>
            <p className="text-sm mt-1">Varsayılan slaytları yüklemek için yukarıdaki butonu kullanın.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className={`flex items-center gap-4 px-6 py-4 transition-all ${
                  !slide.isActive ? "opacity-50 bg-slate-50/50 dark:bg-slate-800/30" : ""
                }`}
              >
                {/* Preview */}
                <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200 dark:border-slate-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.imageUrl}
                    alt={slide.alt}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{slide.imageUrl}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{slide.alt}</p>
                </div>

                {/* Status badge */}
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                    slide.isActive
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {slide.isActive ? "Aktif" : "Pasif"}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <form action={toggleHeroSlideAction}>
                    <input type="hidden" name="id" value={slide.id} />
                    <button
                      type="submit"
                      title={slide.isActive ? "Pasife Al" : "Aktifleştir"}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all"
                    >
                      {slide.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </form>
                  <form action={removeHeroSlideAction}>
                    <input type="hidden" name="id" value={slide.id} />
                    <button
                      type="submit"
                      title="Sil"
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-600 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-6 text-xs text-slate-400 text-center">
        Slaytlar, hero bölümünde 6 saniyede bir otomatik geçiş yapar. Pasif slaytlar gösterilmez.
      </p>
    </div>
  );
}

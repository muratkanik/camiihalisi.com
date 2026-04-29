"use client";

import { useState, useEffect } from "react";
import { Save, Sparkles } from "lucide-react";
import { saveCategoryAction } from "@/app/[locale]/admin/kategoriler/actions";
import type { CategoryWithOverride } from "@/app/[locale]/admin/kategoriler/actions";
import ImagePickerField from "./ImagePickerField";
import { useRouter } from "next/navigation";
import { getBadges, BadgeWithTranslations } from "@/app/[locale]/admin/rozetler/actions";

interface Props {
  cat: CategoryWithOverride;
}

export default function KategoriEditFormClient({ cat }: Props) {
  const cls = "w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40 focus:border-[#C9972B]";

  const [desc, setDesc] = useState(cat.description || "");
  const [longDesc, setLongDesc] = useState(cat.longDescription || "");
  const [metaDesc, setMetaDesc] = useState(cat.metaDescription || "");
  const [loadingAI, setLoadingAI] = useState<"desc" | "longDesc" | "metaDesc" | "all" | null>(null);
  
  const [allBadges, setAllBadges] = useState<BadgeWithTranslations[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>(cat.badges || []);

  useEffect(() => {
    getBadges().then(setAllBadges);
  }, []);

  const handleBadgeToggle = (slug: string) => {
    setSelectedBadges(prev => 
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const handleExpand = async (field: "desc" | "longDesc" | "metaDesc") => {
    setLoadingAI(field);
    try {
      const currentContent = field === "desc" ? desc : (field === "longDesc" ? longDesc : metaDesc);
      const res = await fetch("/api/ai/expand-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: cat.seoKeyword || cat.title,
          currentContent,
          targetWords: field === "desc" ? 80 : (field === "longDesc" ? 400 : 30),
          mode: "expand",
          field
        }),
      });
      if (!res.ok) throw new Error("AI Hatası");
      const data = await res.json();
      if (data.addition) {
        if (field === "desc") setDesc(prev => (prev ? prev + " " : "") + data.addition);
        else if (field === "longDesc") setLongDesc(prev => (prev ? prev + "\n\n" : "") + data.addition);
        else setMetaDesc(prev => (prev ? prev + " " : "") + data.addition);
      }
    } catch (err) {
      alert("Yapay zeka üretimi sırasında hata oluştu.");
    } finally {
      setLoadingAI(null);
    }
  };

  const handleGenerateAll = async () => {
    if (!confirm("Tüm SEO alanları (Kısa Açıklama, Uzun Açıklama, Meta Açıklama) baştan üretilip mevcutların üzerine yazılacak. Onaylıyor musunuz?")) return;
    setLoadingAI("all");
    try {
      const res = await fetch("/api/ai/expand-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: cat.seoKeyword || cat.title,
          mode: "generate-all"
        }),
      });
      if (!res.ok) throw new Error("AI Hatası");
      const data = await res.json();
      if (data.description) setDesc(data.description);
      if (data.longDescription) setLongDesc(data.longDescription);
      if (data.metaDescription) setMetaDesc(data.metaDescription);
    } catch (err) {
      alert("Tüm SEO içerik üretimi sırasında hata oluştu.");
    } finally {
      setLoadingAI(null);
    }
  };

  const [isPending, startTransition] = useState(false);
  const router = useRouter();

  const actionWrapper = (formData: FormData) => {
    startTransition(true);
    saveCategoryAction(formData)
      .then(() => {
        alert("Kategori başarıyla kaydedildi!");
        router.refresh();
      })
      .catch((err) => {
        alert("Hata oluştu: " + err);
      })
      .finally(() => {
        startTransition(false);
      });
  };

  return (
    <form action={actionWrapper} className="space-y-6">
      <input type="hidden" name="slug" value={cat.slug} />
      <input type="hidden" name="badges" value={selectedBadges.join(",")} />

      <div className="flex justify-between items-center mb-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-white">Genel Bilgiler</h3>
        </div>
        <button
          type="button"
          onClick={handleGenerateAll}
          disabled={loadingAI !== null}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all disabled:opacity-50"
        >
          {loadingAI === "all" ? <span className="animate-pulse">⏳ Üretiliyor...</span> : <><Sparkles className="w-4 h-4" /> Tüm SEO Alanlarını AI İle Üret</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Başlık" name="title" defaultValue={cat.title} placeholder="Kategori başlığı" cls={cls} />
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Rozetler (Çoklu Seçim)</label>
          <div className="flex flex-wrap gap-2 p-2 border rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 min-h-[44px]">
            {allBadges.length === 0 && <span className="text-xs text-slate-400 my-auto">Rozet bulunamadı. Önce rozet ekleyin.</span>}
            {allBadges.map(b => (
              <button
                key={b.slug}
                type="button"
                onClick={() => handleBadgeToggle(b.slug)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${selectedBadges.includes(b.slug) ? "bg-[#0097A7] border-[#0097A7] text-white font-medium" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"}`}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="SEO Anahtar Kelime" name="seoKeyword" defaultValue={cat.seoKeyword} placeholder="akrilik cami halısı" cls={cls} />
        <Field label="Renk (hex)" name="color" defaultValue={cat.color} placeholder="#0097A7" cls={cls} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Kısa Açıklama (Hero Altı)</label>
          <button
            type="button"
            onClick={() => handleExpand("desc")}
            disabled={loadingAI !== null}
            className="text-xs flex items-center gap-1 font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2 py-1 rounded hover:opacity-90 disabled:opacity-50"
          >
            {loadingAI === "desc" ? "⏳ Üretiliyor..." : "✨ AI ile Genişlet/Üret"}
          </button>
        </div>
        <textarea name="description" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Kategori kısa açıklaması" rows={3} className={`${cls} resize-y`} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Uzun Açıklama (Sayfa Altı İçerik)</label>
          <button
            type="button"
            onClick={() => handleExpand("longDesc")}
            disabled={loadingAI !== null}
            className="text-xs flex items-center gap-1 font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2 py-1 rounded hover:opacity-90 disabled:opacity-50"
          >
            {loadingAI === "longDesc" ? "⏳ Üretiliyor..." : "✨ AI ile Genişlet/Üret"}
          </button>
        </div>
        <textarea name="longDescription" value={longDesc} onChange={e => setLongDesc(e.target.value)} placeholder="SEO odaklı kapsamlı açıklama..." rows={6} className={`${cls} resize-y`} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">SEO Meta Açıklama (160 karakter)</label>
          <button
            type="button"
            onClick={() => handleExpand("metaDesc")}
            disabled={loadingAI !== null}
            className="text-xs flex items-center gap-1 font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2 py-1 rounded hover:opacity-90 disabled:opacity-50"
          >
            {loadingAI === "metaDesc" ? "⏳ Üretiliyor..." : "✨ AI ile Genişlet/Üret"}
          </button>
        </div>
        <textarea name="metaDescription" value={metaDesc} onChange={e => setMetaDesc(e.target.value)} placeholder="Google arama sonuçlarında görünen açıklama..." rows={2} className={`${cls} resize-y`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <ImagePickerField name="image" label="Görsel" defaultValue={cat.image} placeholder="/images/cami-1.png" />
        <Field
          label="Özellikler (virgülle ayırın)"
          name="features"
          defaultValue={cat.features.join(", ")}
          placeholder="Solmaz Renk, Yumuşak Doku, Ekonomik"
          cls={cls}
        />
      </div>

      <div className="flex items-center gap-2 pb-2 mt-4">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0097A7] text-white font-bold hover:bg-[#003B40] transition-all shadow-md disabled:opacity-50"
        >
          {isPending ? "⏳ Kaydediliyor..." : <><Save className="w-5 h-5" /> Kaydet &amp; SEO Hesapla</>}
        </button>
        <span className="text-xs text-slate-400 ml-auto font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
          {cat.slug}
        </span>
      </div>
    </form>
  );
}

function Field({ label, name, defaultValue, placeholder, cls }: {
  label: string; name: string; defaultValue: string; placeholder?: string; cls: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>
      <input type="text" name={name} defaultValue={defaultValue} placeholder={placeholder} className={cls} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { saveCategoryAction } from "@/app/[locale]/admin/kategoriler/actions";
import type { CategoryWithOverride } from "@/app/[locale]/admin/kategoriler/actions";
import ImagePickerField from "./ImagePickerField";

interface Props {
  cat: CategoryWithOverride;
}

export default function KategoriEditFormClient({ cat }: Props) {
  const cls = "w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40 focus:border-[#C9972B]";

  const [desc, setDesc] = useState(cat.description || "");
  const [longDesc, setLongDesc] = useState(cat.longDescription || "");
  const [loadingAI, setLoadingAI] = useState<"desc" | "longDesc" | null>(null);

  const handleExpand = async (field: "desc" | "longDesc") => {
    setLoadingAI(field);
    try {
      const currentContent = field === "desc" ? desc : longDesc;
      const res = await fetch("/api/ai/expand-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: cat.seoKeyword || cat.title,
          currentContent,
          targetWords: field === "desc" ? 100 : 400
        }),
      });
      if (!res.ok) throw new Error("AI Hatası");
      const data = await res.json();
      if (data.addition) {
        if (field === "desc") setDesc(prev => prev + " " + data.addition);
        else setLongDesc(prev => prev + "\n\n" + data.addition);
      }
    } catch (err) {
      alert("Yapay zeka üretimi sırasında hata oluştu.");
    } finally {
      setLoadingAI(null);
    }
  };

  return (
    <form action={saveCategoryAction} className="space-y-4">
      <input type="hidden" name="slug" value={cat.slug} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Başlık" name="title" defaultValue={cat.title} placeholder="Kategori başlığı" cls={cls} />
        <Field label="Rozet" name="badge" defaultValue={cat.badge} placeholder="Örn: En Çok Satan" cls={cls} />
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
            {loadingAI === "desc" ? "⏳ Üretiliyor..." : "✨ AI ile Genişlet"}
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
            {loadingAI === "longDesc" ? "⏳ Üretiliyor..." : "✨ AI ile Genişlet"}
          </button>
        </div>
        <textarea name="longDescription" value={longDesc} onChange={e => setLongDesc(e.target.value)} placeholder="SEO odaklı kapsamlı açıklama..." rows={6} className={`${cls} resize-y`} />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">SEO Meta Açıklama (160 karakter)</label>
        <textarea name="metaDescription" defaultValue={cat.metaDescription} placeholder="Google arama sonuçlarında görünen açıklama..." rows={2} className={`${cls} resize-y`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ImagePickerField name="image" label="Görsel" defaultValue={cat.image} placeholder="/images/cami-1.png" />
        <Field
          label="Özellikler (virgülle ayırın)"
          name="features"
          defaultValue={cat.features.join(", ")}
          placeholder="Solmaz Renk, Yumuşak Doku, Ekonomik"
          cls={cls}
        />
      </div>

      <div className="flex items-center gap-2 pb-2">
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0097A7] text-white font-bold text-sm hover:bg-[#003B40] transition-all"
        >
          <Save className="w-4 h-4" />
          Kaydet &amp; SEO Hesapla
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

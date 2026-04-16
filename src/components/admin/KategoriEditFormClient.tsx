"use client";

import { Save } from "lucide-react";
import { saveCategoryAction } from "@/app/[locale]/admin/kategoriler/actions";
import type { CategoryWithOverride } from "@/app/[locale]/admin/kategoriler/actions";
import ImagePickerField from "./ImagePickerField";

interface Props {
  cat: CategoryWithOverride;
}

export default function KategoriEditFormClient({ cat }: Props) {
  const cls = "w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40 focus:border-[#C9972B]";

  return (
    <form action={saveCategoryAction} className="space-y-4">
      <input type="hidden" name="slug" value={cat.slug} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Başlık" name="title" defaultValue={cat.title} placeholder="Kategori başlığı" cls={cls} />
        <Field label="Rozet" name="badge" defaultValue={cat.badge} placeholder="Örn: En Çok Satan" cls={cls} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="SEO Anahtar Kelime" name="seoKeyword" defaultValue={cat.seoKeyword} placeholder="akrilik cami halısı" cls={cls} />
        <Field label="Renk (hex)" name="color" defaultValue={cat.color} placeholder="#1B4332" cls={cls} />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Açıklama (sayfa içeriği)</label>
        <textarea name="description" defaultValue={cat.description} placeholder="Kategori açıklaması" rows={3} className={`${cls} resize-y`} />
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
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B4332] text-white font-bold text-sm hover:bg-[#0D2418] transition-all"
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

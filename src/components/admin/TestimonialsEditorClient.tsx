"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Star, Loader2, CheckCircle2 } from "lucide-react";
import { saveTestimonialsAction } from "@/app/[locale]/admin/yorumlar/actions";
import type { Testimonial } from "@/components/blocks/TrustSection";

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { name: "Mehmet Bey", location: "Ankara — Camii Derneği", quote: "Doğru halıyı seçmek sayesinde yıllardır sorunsuz bir şekilde kullanıyoruz.", rating: 5 },
  { name: "Hasan Efendi", location: "İstanbul — Camii Vakfı",  quote: "10 yıl önce döşettik, hâlâ ilk günkü gibi duruyor. Rengi solmadı, deformasyona uğramadı.", rating: 5 },
];

interface Props {
  initialTestimonials: Testimonial[];
}

export default function TestimonialsEditorClient({ initialTestimonials }: Props) {
  const [items, setItems] = useState<Testimonial[]>(
    initialTestimonials.length > 0 ? initialTestimonials : DEFAULT_TESTIMONIALS
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40 focus:border-[#C9972B]";

  function updateItem(i: number, field: keyof Testimonial, value: string | number) {
    setItems((prev) => prev.map((t, idx) => idx === i ? { ...t, [field]: value } : t));
  }

  function addItem() {
    setItems((prev) => [...prev, { name: "", location: "", quote: "", rating: 5 }]);
  }

  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const fd = new FormData();
      fd.append("testimonials_json", JSON.stringify(items));
      const result = await saveTestimonialsAction(fd);
      if (result.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(result.error ?? "Hata oluştu");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Hata oluştu");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      {items.map((t, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Yorum #{i + 1}
            </h3>
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="text-red-500 hover:text-red-700 transition-colors p-1"
              title="Sil"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">İsim</label>
              <input
                type="text"
                value={t.name}
                onChange={(e) => updateItem(i, "name", e.target.value)}
                placeholder="Mehmet Bey"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Konum / Kurum</label>
              <input
                type="text"
                value={t.location}
                onChange={(e) => updateItem(i, "location", e.target.value)}
                placeholder="Ankara — Camii Derneği"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Yorum</label>
            <textarea
              value={t.quote}
              onChange={(e) => updateItem(i, "quote", e.target.value)}
              placeholder="Yorum metni..."
              rows={3}
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Yıldız Puanı</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => updateItem(i, "rating", star)}
                  className="transition-colors"
                >
                  <Star
                    className={`w-6 h-6 ${star <= (t.rating ?? 5) ? "text-[#C9972B] fill-[#C9972B]" : "text-slate-300 dark:text-slate-600"}`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Ekle / Kaydet butonları */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 text-sm font-medium hover:border-[#006064] hover:text-[#006064] transition-all"
        >
          <Plus className="w-4 h-4" />
          Yeni Yorum Ekle
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#006064] hover:bg-[#00494D] text-white text-sm font-bold transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? "Kaydediliyor..." : saved ? "Kaydedildi!" : "Yorumları Kaydet"}
        </button>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-600">
        * En fazla 3 yorum ana sayfada gösterilir. Sıralama ekleme sırasına göre yapılır.
      </p>
    </div>
  );
}

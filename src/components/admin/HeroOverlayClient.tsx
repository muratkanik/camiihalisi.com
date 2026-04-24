"use client";

import { useState, useTransition } from "react";
import { Eye, Save, Check } from "lucide-react";

interface Props {
  initialOpacity: number;
  saveAction: (formData: FormData) => Promise<{ ok: boolean }>;
  previewImages: string[];
}

export default function HeroOverlayClient({ initialOpacity, saveAction, previewImages }: Props) {
  const [opacity, setOpacity] = useState(initialOpacity);
  const [previewIdx, setPreviewIdx] = useState(0);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const overlayStyle = {
    position: "absolute" as const,
    inset: 0,
    background: `rgba(255,255,255,${opacity / 100})`,
    transition: "background 0.2s ease",
  };

  function handleSave() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("opacity", String(opacity));
      await saveAction(fd);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="space-y-5">
      {/* Canlı Önizleme */}
      <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner" style={{ height: 240 }}>
        {/* Arka plan görseli */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewImages[previewIdx] ?? "/images/cami-hero.png"}
          alt="Hero önizleme"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Overlay */}
        <div style={overlayStyle} />
        {/* Alt gradient (sabit) */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#003B40]/70 to-transparent" />
        {/* Örnek metin */}
        <div className="absolute inset-0 flex items-center px-6 z-10">
          <div>
            <p className="text-[10px] font-bold text-[#C9972B] uppercase tracking-widest mb-1">Asil Halı A.Ş.</p>
            <h2 className="text-lg font-extrabold text-[#0D1B1E] leading-tight">
              Caminiz İçin En Güzel Halı
            </h2>
            <p className="text-xs text-[#334748] mt-1 max-w-[200px]">
              Üretimden kuruluma tek adımda.
            </p>
          </div>
        </div>
        {/* Opacity badge */}
        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1.5">
          <Eye className="w-3 h-3" />
          %{opacity} beyaz
        </div>
      </div>

      {/* Fotoğraf Seçici */}
      {previewImages.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {previewImages.slice(0, 6).map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setPreviewIdx(i)}
              className={`w-12 h-9 rounded-lg overflow-hidden border-2 transition-all ${
                previewIdx === i ? "border-[#0097A7] scale-105" : "border-transparent opacity-60 hover:opacity-90"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Slider Kontrolü */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Beyaz Overlay Yoğunluğu
          </label>
          <span className="text-sm font-bold text-[#0097A7] dark:text-[#26C6DA] tabular-nums w-12 text-right">
            %{opacity}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-14">Şeffaf</span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={opacity}
            onChange={(e) => { setOpacity(Number(e.target.value)); setSaved(false); }}
            className="flex-1 h-2.5 rounded-full appearance-none cursor-pointer accent-[#0097A7] bg-slate-200 dark:bg-slate-700"
          />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-12 text-right">Opak</span>
        </div>
        <div className="flex justify-between text-[10px] font-medium text-slate-600 dark:text-slate-400 mt-2 px-14">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Kaydet */}
      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all shadow-sm ${
          saved
            ? "bg-emerald-500 hover:bg-emerald-600 text-white"
            : "bg-[#0097A7] hover:bg-[#007a87] text-white disabled:opacity-60"
        }`}
      >
        {saved ? (
          <><Check className="w-4 h-4" /> Kaydedildi!</>
        ) : isPending ? (
          <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Kaydediliyor…</>
        ) : (
          <><Save className="w-4 h-4" /> Ayarı Kaydet</>
        )}
      </button>

      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center">
        Değişiklik anında sitede geçerli olur. Önerilen aralık: %60–%85
      </p>
    </div>
  );
}

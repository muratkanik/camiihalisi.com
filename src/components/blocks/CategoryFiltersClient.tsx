"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CatalogItem {
  slug: string;
  title: string;
  image: string;
  desen: "Saflı" | "Göbekli" | "Seccadeli" | "Standart" | "Özel";
  colors: string[]; // hex
  badge?: string;
}

interface Props {
  prefix: string;
  items: CatalogItem[];
}

const DESEN_LABELS = ["Tümü", "Standart", "Saflı", "Göbekli", "Seccadeli", "Özel"] as const;

const RENK_OPTIONS = [
  { label: "Turkuaz", hex: "#006064", dark: true },
  { label: "Lacivert", hex: "#1B2E5E", dark: true },
  { label: "Bordo", hex: "#8B1A1A", dark: true },
  { label: "Mavi", hex: "#1A4E8B", dark: true },
  { label: "Krem", hex: "#F5EDD7", dark: false },
  { label: "Gri", hex: "#7A7A7A", dark: true },
  { label: "Kahverengi", hex: "#6B4226", dark: true },
  { label: "Altın", hex: "#C9972B", dark: false },
];

export default function CategoryFiltersClient({ prefix, items }: Props) {
  const [activeDesen, setActiveDesen] = useState<string>("Tümü");
  const [activeRenk, setActiveRenk] = useState<string | null>(null);

  const desenValues = DESEN_LABELS.filter(
    (d) => d === "Tümü" || items.some((item) => item.desen === d)
  );

  const filtered = items.filter((item) => {
    const desenMatch = activeDesen === "Tümü" || item.desen === activeDesen;
    const renkMatch = !activeRenk || item.colors.includes(activeRenk);
    return desenMatch && renkMatch;
  });

  return (
    <div className="space-y-6">
      {/* Desen Filtreleri */}
      <div>
        <p className="text-xs font-bold text-[#6B6355] uppercase tracking-widest mb-3">Desen / Tip</p>
        <div className="flex flex-wrap gap-2">
          {desenValues.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDesen(d)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                activeDesen === d
                  ? "bg-[#006064] text-white border-[#006064] shadow-sm"
                  : "bg-white text-[#6B6355] border-[#B2EBF2] hover:border-[#006064]/40 hover:text-[#006064]"
              }`}
            >
              {d}
              {d !== "Tümü" && (
                <span className="ml-1.5 text-xs opacity-60">
                  ({items.filter((i) => i.desen === d).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Renk Filtreleri */}
      <div>
        <p className="text-xs font-bold text-[#6B6355] uppercase tracking-widest mb-3">Renk / Ton</p>
        <div className="flex flex-wrap gap-2.5">
          {RENK_OPTIONS.map((renk) => {
            const isActive = activeRenk === renk.hex;
            const hasItems = items.some((item) => item.colors.includes(renk.hex));
            return (
              <button
                key={renk.hex}
                onClick={() => setActiveRenk(isActive ? null : renk.hex)}
                disabled={!hasItems && activeRenk !== renk.hex}
                title={renk.label}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  isActive
                    ? "ring-2 ring-offset-1 ring-[#C9972B] border-[#C9972B] shadow-sm"
                    : "border-[#B2EBF2] hover:border-[#C9972B]/40"
                } ${!hasItems && !isActive ? "opacity-30 cursor-not-allowed" : ""}`}
                style={{ background: renk.hex }}
              >
                <span className={`text-xs font-bold ${renk.dark ? "text-white" : "text-[#1A1A1A]"}`}>
                  {renk.label}
                </span>
                {isActive && (
                  <span className={`text-xs ${renk.dark ? "text-white/80" : "text-[#1A1A1A]/70"}`}>✕</span>
                )}
              </button>
            );
          })}
          {activeRenk && (
            <button
              onClick={() => setActiveRenk(null)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border border-[#B2EBF2] text-[#6B6355] hover:border-[#C9972B]/40 bg-white"
            >
              Tümü
            </button>
          )}
        </div>
        {activeRenk && (
          <p className="text-xs text-[#6B6355] mt-2 italic">
            * Renk filtresi rehber amaçlıdır. Tam renk eşleşmesi için ücretsiz numune talep edin.
          </p>
        )}
      </div>

      {/* Sonuç Sayısı */}
      <p className="text-sm text-[#6B6355]">
        <span className="font-bold text-[#006064]">{filtered.length}</span> ürün çeşidi gösteriliyor
        {activeDesen !== "Tümü" && <span> · Desen: <strong>{activeDesen}</strong></span>}
      </p>

      {/* Ürün Grid */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center text-[#6B6355] border border-dashed border-[#B2EBF2] rounded-2xl">
          <p className="font-semibold">Bu filtrelerle ürün bulunamadı.</p>
          <button
            onClick={() => { setActiveDesen("Tümü"); setActiveRenk(null); }}
            className="mt-3 text-sm text-[#C9972B] hover:underline"
          >
            Filtreleri Temizle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <Link
              key={item.slug}
              href={`${prefix}/kategori/${item.slug}`}
              className="group bg-white rounded-2xl border border-[#B2EBF2] overflow-hidden hover:border-[#C9972B]/40 hover:shadow-md transition-all"
            >
              {/* Image */}
              <div className="relative aspect-square bg-[#F0FDFE] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {item.badge && (
                  <span className="absolute top-2 left-2 text-xs font-bold bg-[#C9972B] text-white px-2.5 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
                {/* Color dots */}
                <div className="absolute bottom-2 right-2 flex gap-1">
                  {item.colors.slice(0, 4).map((hex) => (
                    <span
                      key={hex}
                      className="w-3 h-3 rounded-full border border-white/60 shadow-sm"
                      style={{ background: hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-xs font-bold text-[#006064] uppercase tracking-wide">{item.desen}</p>
                <h3 className="text-sm font-semibold text-[#1A1A1A] mt-0.5 leading-snug group-hover:text-[#006064] transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1 mt-2 text-xs text-[#C9972B] font-semibold">
                  Detay <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface CatalogColor {
  id: string; 
  image: string; 
  hex: string;   
  name: string;  
}

export interface DBCatalogItem {
  id: string;
  categorySlug: string;
  code: string;
  title: string;
  badge: string;
  colors: CatalogColor[];
}

interface Props {
  prefix: string;
  items: DBCatalogItem[];
}

const DESEN_LABELS = ["Tümü", "Saflı", "Göbekli", "Seccadeli", "Standart", "Özel"];

// Sınıflandırma yardımcısı
function getDesen(title: string, code: string): string {
  const t = title.toLowerCase();
  if (t.includes("saflı")) return "Saflı";
  if (t.includes("göbekli") || t.includes("gobekli")) return "Göbekli";
  if (t.includes("seccade")) return "Seccadeli";
  if (t.includes("özel") || t.includes("axminster")) return "Özel";
  return "Standart";
}

export default function CategoryFiltersClient({ prefix, items }: Props) {
  const [activeDesen, setActiveDesen] = useState<string>("Tümü");
  const [activeRenk, setActiveRenk] = useState<string | null>(null);

  // Kartlardaki hover edilen rengi tutmak için (id => color_image_url)
  const [hoveredImage, setHoveredImage] = useState<Record<string, string>>({});

  const desenValues = DESEN_LABELS.filter(
    (d) => d === "Tümü" || items.some((item) => getDesen(item.title, item.code) === d)
  );

  const filtered = items.filter((item) => {
    const dMatch = activeDesen === "Tümü" || getDesen(item.title, item.code) === activeDesen;
    const rMatch = !activeRenk || item.colors.some(c => c.hex.toLowerCase() === activeRenk.toLowerCase());
    return dMatch && rMatch;
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
                  ? "bg-[#0097A7] text-white border-[#0097A7] shadow-sm"
                  : "bg-white text-[#6B6355] border-[#B2EBF2] hover:border-[#0097A7]/40 hover:text-[#0097A7]"
              }`}
            >
              {d}
              {d !== "Tümü" && (
                <span className="ml-1.5 text-xs opacity-60">
                  ({items.filter((i) => getDesen(i.title, i.code) === d).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sonuç Sayısı */}
      <p className="text-sm text-[#6B6355]">
        <span className="font-bold text-[#0097A7]">{filtered.length}</span> ürün çeşidi gösteriliyor
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
                <p className="text-xs font-bold text-[#0097A7] uppercase tracking-wide">{item.desen}</p>
                <h3 className="text-sm font-semibold text-[#1A1A1A] mt-0.5 leading-snug group-hover:text-[#0097A7] transition-colors line-clamp-2">
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

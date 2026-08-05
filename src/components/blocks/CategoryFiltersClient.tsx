"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Lightbox from "@/components/ui/Lightbox";

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
  image?: string;
  colors: CatalogColor[];
}

interface Props {
  prefix: string;
  items: DBCatalogItem[];
}

// Katalog kaynağına göre colors ya CatalogColor[] (DB) ya da düz hex string[] (statik
// fallback CATALOG_DATA) olabilir — ikisini de tek şekle indirger.
function normalizeItems(items: DBCatalogItem[]): DBCatalogItem[] {
  return items.map((item) => {
    const rawColors = item.colors as unknown as (CatalogColor | string)[];
    const colors = rawColors.map((c, i) =>
      typeof c === "string"
        ? { id: `${item.id}-${i}`, hex: c, name: c, image: item.image || "/images/cami-1.png" }
        : c
    );
    return { ...item, colors };
  });
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

export default function CategoryFiltersClient({ prefix, items: rawItems }: Props) {
  const items = normalizeItems(rawItems);
  const [activeDesen, setActiveDesen] = useState<string>("Tümü");
  const [activeRenk, setActiveRenk] = useState<string | null>(null);

  // Kartlardaki hover edilen rengi tutmak için (id => color_image_url)
  const [hoveredImage, setHoveredImage] = useState<Record<string, string>>({});

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  const desenValues = DESEN_LABELS.filter(
    (d) => d === "Tümü" || items.some((item) => getDesen(item.title, item.code) === d)
  );

  const filtered = items.filter((item) => {
    const dMatch = activeDesen === "Tümü" || getDesen(item.title, item.code) === activeDesen;
    const rMatch = !activeRenk || item.colors.some(c => c.hex.toLowerCase() === activeRenk.toLowerCase());
    return dMatch && rMatch;
  });

  const handleOpenLightbox = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    setLightboxIndex(index);
  };

  // Build Lightbox images array from filtered items
  const lightboxImages = filtered.map(item => ({
    src: hoveredImage[item.id] || (item.colors.length > 0 ? item.colors[0].image : "/images/cami-1.png"),
    alt: item.title,
    title: item.title
  }));

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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((item, index) => {
            const currentImg = hoveredImage[item.id] || (item.colors.length > 0 ? item.colors[0].image : "/images/cami-1.png");
            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-[#B2EBF2] overflow-hidden hover:border-[#C9972B]/40 hover:shadow-xl transition-all flex flex-col"
              >
                {/* Image */}
                <div 
                  onClick={(e) => handleOpenLightbox(index, e)} 
                  className="relative aspect-[4/3] bg-[#F0FDFE] overflow-hidden cursor-pointer block"
                >
                  <Image
                    src={currentImg || "/images/cami-1.png"}
                    alt={item.title}
                    fill
                    sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.badge && (
                    <div className="absolute top-3 left-3 bg-[#C9972B] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm tracking-wider uppercase z-10">
                      {item.badge}
                    </div>
                  )}
                  
                  {/* Hover Overlay Icon for Lightbox */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <span className="bg-white/90 text-[#0097A7] rounded-full p-2 shadow-lg backdrop-blur-sm">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                     </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="text-xs font-bold text-[#C9972B] uppercase tracking-widest mb-1">{item.code}</div>
                  <Link href={`${prefix}/kategori/${item.categorySlug}`}>
                    <h3 className="font-bold text-[#0097A7] text-base mb-3 leading-tight cursor-pointer hover:text-[#C9972B] transition-colors">{item.title}</h3>
                  </Link>
                  
                  {/* Renk Varyantları Seçimi */}
                  {item.colors.length > 0 && (
                    <div className="mt-auto pt-3 border-t border-[#B2EBF2]/50">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-[10px] text-[#6B6355]">{item.colors.length} Renk Seçeneği</p>
                        <Link 
                          href={`${prefix}/renk-demo?imageUrl=${encodeURIComponent(currentImg || item.colors[0].image)}&motifName=${encodeURIComponent(item.title)}`}
                          className="text-[10px] font-bold text-[#0097A7] bg-[#E0F7FA] px-2 py-0.5 rounded hover:bg-[#0097A7] hover:text-white transition-colors flex items-center gap-1"
                        >
                          <span role="img" aria-label="palette">🎨</span> Rengini Değiştir
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.colors.slice(0, 6).map(color => (
                          <div 
                            key={color.id}
                            onMouseEnter={() => setHoveredImage(prev => ({...prev, [item.id]: color.image}))}
                            onMouseLeave={() => setHoveredImage(prev => { const p = {...prev}; delete p[item.id]; return p; })}
                            className="w-5 h-5 rounded-full border border-slate-200 cursor-pointer shadow-sm hover:scale-110 transition-transform"
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          />
                        ))}
                        {item.colors.length > 6 && (
                          <div className="w-5 h-5 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-[8px] font-bold text-slate-500">
                            +{item.colors.length - 6}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <Lightbox 
        isOpen={lightboxIndex >= 0} 
        images={lightboxImages} 
        initialIndex={Math.max(0, lightboxIndex)} 
        onClose={() => setLightboxIndex(-1)} 
        prefix={prefix}
      />
    </div>
  );
}

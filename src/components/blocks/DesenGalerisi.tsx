"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { X, ChevronLeft, ChevronRight, Palette, ExternalLink, Filter, Eye } from "lucide-react";

interface DesenItem {
  id: string;
  image: string;
  name: string;
  altText: string;
  category?: string;
}

interface DesenGalerisiProps {
  items: DesenItem[];
  prefix: string;
  title?: string;
  subtitle?: string;
  showCategoryFilter?: boolean;
  categorySlug?: string;
  locale?: string;
}

export default function DesenGalerisi({ items, prefix, title, subtitle, showCategoryFilter = true, categorySlug = "safli-akrilik-cami-halisi" }: DesenGalerisiProps) {
  const t = useTranslations("desenGalerisi.labels");
  const tCat = useTranslations("desenGalerisi.categories");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(24);

  const categories = useMemo(() => {
    const cats = [...new Set(items.map(i => i.category).filter(Boolean))] as string[];
    return cats;
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter(i => i.category === activeCategory);
  }, [items, activeCategory]);

  const displayedItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  const openLightbox = useCallback((idx: number) => setLightboxIdx(idx), []);
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);

  const goPrev = useCallback(() => {
    setLightboxIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
  }, [filteredItems.length]);

  const goNext = useCallback(() => {
    setLightboxIdx((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
  }, [filteredItems.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    },
    [closeLightbox, goPrev, goNext]
  );

  const activeItem = lightboxIdx !== null ? filteredItems[lightboxIdx] : null;

  const loadMore = () => setVisibleCount(prev => prev + 24);

  const detailUrl = (item: DesenItem) => `${prefix}/kategori/${categorySlug}/${item.id}`;

  return (
    <>
      {/* ── Başlık ── */}
      {title && (
        <div className="mb-6">
          <h2
            className="text-2xl md:text-3xl font-bold text-[#0097A7] mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {title}
          </h2>
          <div className="gold-line mb-3" />
          {subtitle && <p className="text-sm text-[#6B6355]">{subtitle}</p>}
          <p className="text-xs text-[#0097A7] font-semibold mt-2">
            {filteredItems.length} {t("patterns")}
          </p>
        </div>
      )}

      {/* ── Kategori Filtresi ── */}
      {showCategoryFilter && categories.length > 1 && (
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-[#6B6355] flex-shrink-0" />
          <button
            onClick={() => { setActiveCategory("all"); setVisibleCount(24); }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeCategory === "all"
                ? "bg-[#0097A7] text-white shadow-md"
                : "bg-[#E0F7FA] text-[#0097A7] hover:bg-[#B2EBF2]"
            }`}
          >
            {t("all")} ({items.length})
          </button>
          {categories.map(cat => {
            const count = items.filter(i => i.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setVisibleCount(24); }}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-[#0097A7] text-white shadow-md"
                    : "bg-[#E0F7FA] text-[#0097A7] hover:bg-[#B2EBF2]"
                }`}
              >
                {tCat.has(cat) ? tCat(cat) : cat} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* ── Desen Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {displayedItems.map((item, idx) => (
          <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden border-2 border-[#E0F7FA] hover:border-[#C9972B] transition-all duration-300">
            <Link href={detailUrl(item)} className="absolute inset-0 z-0 block">
              <Image
                src={item.image}
                alt={item.altText}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            </Link>
            <div className="absolute inset-0 bg-gradient-to-t from-[#003B40]/90 via-[#003B40]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-2 gap-1.5 pointer-events-none">
              <span className="text-white font-semibold text-xs text-center leading-tight">{item.name}</span>
              <div className="flex gap-1.5 pointer-events-auto">
                <button
                  onClick={() => openLightbox(idx)}
                  className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-[10px] font-semibold backdrop-blur-sm transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" /> {t("enlarge")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Daha Fazla Yükle ── */}
      {displayedItems.length < filteredItems.length && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-[#0097A7] hover:bg-[#007A88] text-white rounded-xl font-semibold text-sm transition-colors shadow-md"
          >
            {t("loadMore")} ({filteredItems.length - displayedItems.length} {t("remaining")})
          </button>
        </div>
      )}

      {/* ── Lightbox Modal ── */}
      {activeItem && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-label="Pattern detail view"
        >
          <button onClick={closeLightbox} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); goPrev(); }} className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors" aria-label="Previous">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); goNext(); }} className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors" aria-label="Next">
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-[80vw] max-w-[560px] aspect-square">
              <Image src={activeItem.image} alt={activeItem.altText} fill sizes="80vw" className="object-contain rounded-lg" priority />
            </div>
            <div className="mt-4 text-center space-y-3">
              <h3 className="text-white text-lg font-bold">{activeItem.name}</h3>
              <div className="flex items-center gap-3 justify-center">
                <Link
                  href={detailUrl(activeItem)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0097A7] hover:bg-[#007A88] text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t("productDetail")}
                </Link>
                <Link
                  href={`${prefix}/renk-demo?imageUrl=${encodeURIComponent(activeItem.image)}&motifName=${encodeURIComponent(activeItem.name)}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C9972B] hover:bg-[#B8860B] text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  <Palette className="w-4 h-4" />
                  {t("changeColor")}
                </Link>
              </div>
              <p className="text-white/40 text-xs">
                {lightboxIdx! + 1} / {filteredItems.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

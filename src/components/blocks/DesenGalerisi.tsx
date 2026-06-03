"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, Palette, ZoomIn } from "lucide-react";

interface DesenItem {
  id: string;
  slug: string;
  image: string;
  name: string;
  altText: string;
  dominantColors: string[];
}

interface DesenGalerisiProps {
  items: DesenItem[];
  prefix: string;
  title?: string;
  subtitle?: string;
}

export default function DesenGalerisi({ items, prefix, title, subtitle }: DesenGalerisiProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const openLightbox = useCallback((idx: number) => setLightboxIdx(idx), []);
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);

  const goPrev = useCallback(() => {
    setLightboxIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : items.length - 1));
  }, [items.length]);

  const goNext = useCallback(() => {
    setLightboxIdx((prev) => (prev !== null && prev < items.length - 1 ? prev + 1 : 0));
  }, [items.length]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    },
    [closeLightbox, goPrev, goNext]
  );

  const activeItem = lightboxIdx !== null ? items[lightboxIdx] : null;

  return (
    <>
      {/* ── Başlık ── */}
      {title && (
        <div className="mb-8">
          <h2
            className="text-2xl md:text-3xl font-bold text-[#0097A7] mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {title}
          </h2>
          <div className="gold-line mb-3" />
          {subtitle && <p className="text-sm text-[#6B6355]">{subtitle}</p>}
        </div>
      )}

      {/* ── Desen Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => openLightbox(idx)}
            className="group relative aspect-square rounded-xl overflow-hidden border-2 border-[#E0F7FA] hover:border-[#C9972B] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C9972B] focus:ring-offset-2"
          >
            <Image
              src={item.image}
              alt={item.altText}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#003B40]/90 via-[#003B40]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-3">
              <span className="text-white font-semibold text-sm mb-1">{item.name}</span>
              <div className="flex gap-1.5 mb-2">
                {item.dominantColors.slice(0, 3).map((color, ci) => (
                  <span
                    key={ci}
                    className="w-4 h-4 rounded-full border border-white/40"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1 text-[#E4B84A] text-xs font-medium">
                <ZoomIn className="w-3 h-3" />
                Büyüt
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* ── Lightbox Modal ── */}
      {activeItem && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-label="Desen detay görünümü"
        >
          {/* Kapat */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Önceki */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Önceki desen"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Sonraki */}
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Sonraki desen"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Görsel + Bilgi */}
          <div
            className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-[80vw] max-w-[560px] aspect-square">
              <Image
                src={activeItem.image}
                alt={activeItem.altText}
                fill
                sizes="80vw"
                className="object-contain rounded-lg"
                priority
              />
            </div>

            {/* Alt Bilgi */}
            <div className="mt-4 text-center">
              <h3 className="text-white text-lg font-bold mb-2">{activeItem.name}</h3>
              <div className="flex items-center justify-center gap-2 mb-3">
                {activeItem.dominantColors.map((color, ci) => (
                  <span
                    key={ci}
                    className="w-6 h-6 rounded-full border-2 border-white/30"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>

              {/* Renk Simülatörüne Git */}
              <Link
                href={`${prefix}/renk-demo?imageUrl=${encodeURIComponent(activeItem.image)}&motifName=${encodeURIComponent(activeItem.name)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C9972B] hover:bg-[#B8860B] text-white rounded-xl text-sm font-semibold transition-colors"
              >
                <Palette className="w-4 h-4" />
                Rengini Değiştir
              </Link>

              {/* Sayaç */}
              <p className="text-white/40 text-xs mt-3">
                {lightboxIdx! + 1} / {items.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

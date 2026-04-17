"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, MessageCircle } from "lucide-react";

/* ── Tüm görsel havuzu ──────────────────────────────── */
const HD_PHOTOS = [
  { src: "/images/hd-foto-00.jpg", caption: "Cami İç Mekanı" },
  { src: "/images/hd-foto-01.jpg", caption: "Cami Halısı Projesi" },
  { src: "/images/hd-foto-02.jpg", caption: "Namaz Alanı" },
  { src: "/images/hd-foto-03.jpg", caption: "Cami Halısı Detay" },
  { src: "/images/hd-foto-04.jpg", caption: "İç Mekan Görünümü" },
  { src: "/images/hd-foto-05.jpg", caption: "Halı Deseni" },
  { src: "/images/hd-foto-06.jpg", caption: "Cami Projesi" },
  { src: "/images/hd-foto-07.jpg", caption: "Saf Düzeni" },
  { src: "/images/hd-foto-08.jpg", caption: "Cami Halısı" },
  { src: "/images/hd-foto-09.jpg", caption: "İbadet Alanı" },
  { src: "/images/hd-foto-10.jpg", caption: "Cami İç Mekanı" },
  { src: "/images/hd-foto-11.jpg", caption: "Halı Projesi" },
  { src: "/images/hd-foto-12.jpg", caption: "Cami Halısı Detay" },
  { src: "/images/hd-foto-13.jpg", caption: "Namaz Halısı" },
  { src: "/images/hd-foto-14.jpg", caption: "Cami Projesi" },
  { src: "/images/hd-foto-15.jpg", caption: "İç Mekan" },
  { src: "/images/hd-foto-16.jpg", caption: "Halı Deseni" },
  { src: "/images/hd-foto-17.jpg", caption: "Cami Halısı" },
  { src: "/images/hd-foto-18.jpg", caption: "Saf Çizgileri" },
  { src: "/images/hd-foto-19.jpg", caption: "Namaz Alanı" },
  { src: "/images/hd-foto-20.jpg", caption: "Cami İç Mekanı" },
  { src: "/images/hd-foto-22.jpg", caption: "Halı Projesi" },
  { src: "/images/hd-foto-23.jpg", caption: "Cami Halısı Detay" },
  { src: "/images/hd-foto-24.jpg", caption: "İbadet Mekanı" },
  { src: "/images/hd-foto-25.jpg", caption: "Cami Projesi" },
  { src: "/images/hd-foto-26.jpg", caption: "İç Mekan" },
  { src: "/images/hd-foto-28.jpg", caption: "Halı Deseni" },
  { src: "/images/panorama-cami.jpg", caption: "Panoramik Cami Görünümü" },
];

const KATALOG_IMAGES = Array.from({ length: 31 }, (_, i) => ({
  src: `/images/cami-katalog-${String(i + 1).padStart(2, "0")}.png`,
  caption: `Koleksiyon ${i + 1}`,
}));

const ORIGINAL_IMAGES = [
  { src: "/images/cami-hero.png", caption: "Cami Halısı Hero" },
  { src: "/images/cami-1.png", caption: "Cami Halısı 1" },
  { src: "/images/cami-2.png", caption: "Cami Halısı 2" },
  { src: "/images/cami-3.png", caption: "Cami Halısı 3" },
  { src: "/images/cami-4.png", caption: "Cami Halısı 4" },
  { src: "/images/cami-5.png", caption: "Cami Halısı 5" },
  { src: "/images/cami-6.png", caption: "Cami Halısı 6" },
  { src: "/images/cami-7.png", caption: "Cami Halısı 7" },
  { src: "/images/cami-8.png", caption: "Cami Halısı 8" },
];

const REFERANS_IMAGES = [
  { src: "/images/referans-bilecik.jpg", caption: "Bilecik Cami Projesi" },
  { src: "/images/referans-esentepe.jpg", caption: "Esentepe Cami Projesi" },
];

/* ── Tüm görselleri tek havuzda topla (lightbox navigasyonu için) ── */
const ALL_IMAGES = [
  ...HD_PHOTOS,
  ...KATALOG_IMAGES,
  ...ORIGINAL_IMAGES,
  ...REFERANS_IMAGES,
];

/* ── Lightbox Component ─────────────────────────────── */
interface LightboxProps {
  images: { src: string; caption: string }[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({ images, currentIndex, onClose, onPrev, onNext }: LightboxProps) {
  const image = images[currentIndex];
  const total = images.length;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent z-10">
        <span className="text-white/80 text-sm font-semibold tracking-wide">
          {image.caption}
        </span>
        <div className="flex items-center gap-4">
          <span className="text-white/50 text-xs">
            {currentIndex + 1} / {total}
          </span>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main image */}
      <div
        className="relative flex items-center justify-center w-full h-full px-20 py-20"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={image.src}
          src={image.src}
          alt={image.caption}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl select-none"
          style={{ maxHeight: "calc(100vh - 140px)" }}
          draggable={false}
        />
      </div>

      {/* Prev button */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-[#C9972B]/80 flex items-center justify-center text-white transition-all hover:scale-110 disabled:opacity-30"
        aria-label="Önceki"
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next button */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-[#C9972B]/80 flex items-center justify-center text-white transition-all hover:scale-110 disabled:opacity-30"
        aria-label="Sonraki"
        disabled={currentIndex === total - 1}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom strip — thumbnail strip */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-4 py-4">
        <div className="flex gap-2 overflow-x-auto justify-center pb-1 scrollbar-hide">
          {images.slice(Math.max(0, currentIndex - 5), currentIndex + 6).map((img, i) => {
            const realIdx = Math.max(0, currentIndex - 5) + i;
            return (
              <button
                key={img.src}
                onClick={(e) => { e.stopPropagation(); /* handled by parent */ }}
                className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  realIdx === currentIndex
                    ? "border-[#C9972B] scale-110"
                    : "border-white/20 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img.src} alt="" className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>
        <p className="text-center text-white/40 text-xs mt-2">
          ← → klavye okları • ESC kapatır
        </p>
      </div>
    </div>
  );
}

/* ── Grid Item ──────────────────────────────────────── */
function GridItem({
  src,
  caption,
  heightClass,
  onOpen,
}: {
  src: string;
  caption: string;
  heightClass: string;
  onOpen: () => void;
}) {
  return (
    <div
      className={`relative group overflow-hidden rounded-xl cursor-pointer bg-[#006064]/20 ${heightClass}`}
      onClick={onOpen}
    >
      <img
        src={src}
        alt={caption}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
        <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
      </div>
      {/* Caption strip at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#003B40]/80 to-transparent px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-white text-xs font-medium truncate">{caption}</p>
      </div>
    </div>
  );
}

/* ── Section Header ─────────────────────────────────── */
function SectionHeader({ badge, title, badgeVariant = "gold" }: { badge: string; title: string; badgeVariant?: "gold" | "green" }) {
  return (
    <div className="text-center mb-10">
      <span className={`badge ${badgeVariant === "gold" ? "badge-gold" : "badge-green"} mb-4`}>{badge}</span>
      <h2 className="section-title">{title}</h2>
      <div className="gold-line mx-auto mt-4" />
    </div>
  );
}

/* ── Main Component ─────────────────────────────────── */
export default function GalleryGrid() {
  const [lightboxData, setLightboxData] = useState<{
    images: { src: string; caption: string }[];
    index: number;
  } | null>(null);

  const openLightbox = useCallback(
    (images: { src: string; caption: string }[], index: number) => {
      setLightboxData({ images, index });
    },
    []
  );

  const closeLightbox = useCallback(() => setLightboxData(null), []);

  const prevImage = useCallback(() => {
    setLightboxData((prev) =>
      prev && prev.index > 0 ? { ...prev, index: prev.index - 1 } : prev
    );
  }, []);

  const nextImage = useCallback(() => {
    setLightboxData((prev) =>
      prev && prev.index < prev.images.length - 1
        ? { ...prev, index: prev.index + 1 }
        : prev
    );
  }, []);

  return (
    <>
      {/* Lightbox */}
      {lightboxData && (
        <Lightbox
          images={lightboxData.images}
          currentIndex={lightboxData.index}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}

      {/* ── Section 1: HD Cami Fotoğrafları ── */}
      <section className="section bg-[#F0FDFE]">
        <div className="container-site">
          <SectionHeader badge="HD Fotoğraflar" title="Tamamlanan Cami Projeleri" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {HD_PHOTOS.map((img, idx) => (
              <GridItem
                key={img.src}
                src={img.src}
                caption={img.caption}
                heightClass="h-52"
                onOpen={() => openLightbox(HD_PHOTOS, idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Halı Koleksiyonu ── */}
      <section className="section bg-white">
        <div className="container-site">
          <SectionHeader badge="Koleksiyon" title="Halı Desenleri & Koleksiyon" badgeVariant="green" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {KATALOG_IMAGES.map((img, idx) => (
              <GridItem
                key={img.src}
                src={img.src}
                caption={img.caption}
                heightClass="h-40"
                onOpen={() => openLightbox(KATALOG_IMAGES, idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Referans Projeler ── */}
      <section className="section bg-[#F0FDFE]">
        <div className="container-site">
          <SectionHeader badge="Referanslar" title="Öne Çıkan Projeler" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {REFERANS_IMAGES.map((img, idx) => (
              <GridItem
                key={img.src}
                src={img.src}
                caption={img.caption}
                heightClass="h-72"
                onOpen={() => openLightbox(REFERANS_IMAGES, idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Ek Görseller ── */}
      <section className="section bg-white">
        <div className="container-site">
          <SectionHeader badge="Görseller" title="Cami Halısı Fotoğraf Arşivi" badgeVariant="green" />
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {ORIGINAL_IMAGES.map((img, idx) => (
              <GridItem
                key={img.src}
                src={img.src}
                caption={img.caption}
                heightClass="h-36"
                onOpen={() => openLightbox(ORIGINAL_IMAGES, idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Tüm galeri tek tıkla aç ── */}
      <section className="py-8 bg-[#F0FDFE] border-t border-[#B2EBF2]">
        <div className="container-site text-center">
          <p className="text-[#6B6355] text-sm mb-4">
            Tüm <strong className="text-[#006064]">{ALL_IMAGES.length} görsel</strong>i birden görüntülemek için:
          </p>
          <button
            onClick={() => openLightbox(ALL_IMAGES, 0)}
            className="btn btn-gold"
          >
            Tüm Galeriyi Aç ({ALL_IMAGES.length} Görsel)
          </button>
        </div>
      </section>

      {/* ── WhatsApp CTA ── */}
      <section className="section bg-[#003B40]">
        <div className="container-site text-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Caminiz İçin Özel Halı Çözümü
          </h2>
          <p className="text-white/75 text-lg mb-8 max-w-2xl mx-auto">
            Beğendiğiniz deseni caminize uyarlayabiliriz. Ücretsiz ölçüm ve teklif için ulaşın.
          </p>
          <a
            href="/api/r?to=https%3A%2F%2Fwa.me%2F905323467939%3Ftext%3DMerhaba%252C%2520galeriden%2520bir%2520desen%2520be%25C4%259Fendim%252C%2520bilgi%2520almak%2520istiyorum.&from=%2Fgaleri&label=whatsapp&cat=whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-4 px-8 rounded-xl transition-all hover:scale-105 text-lg shadow-2xl"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp ile İletişime Geç
          </a>
        </div>
      </section>
    </>
  );
}

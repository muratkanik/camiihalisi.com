"use client";

import { useState } from "react";

export default function GalleryGrid() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // HD Cami Fotoğrafları
  const hdPhotos = [
    "/images/hd-foto-01.jpg",
    "/images/hd-foto-02.jpg",
    "/images/hd-foto-03.jpg",
    "/images/hd-foto-04.jpg",
    "/images/hd-foto-05.jpg",
    "/images/hd-foto-06.jpg",
    "/images/hd-foto-07.jpg",
    "/images/hd-foto-08.jpg",
    "/images/hd-foto-09.jpg",
    "/images/hd-foto-10.jpg",
    "/images/hd-foto-11.jpg",
    "/images/hd-foto-12.jpg",
    "/images/hd-foto-13.jpg",
    "/images/hd-foto-14.jpg",
    "/images/hd-foto-15.jpg",
    "/images/hd-foto-16.jpg",
    "/images/hd-foto-17.jpg",
    "/images/hd-foto-18.jpg",
    "/images/hd-foto-19.jpg",
    "/images/hd-foto-20.jpg",
    "/images/hd-foto-22.jpg",
    "/images/hd-foto-23.jpg",
    "/images/hd-foto-24.jpg",
    "/images/hd-foto-25.jpg",
    "/images/hd-foto-26.jpg",
    "/images/hd-foto-28.jpg",
    "/images/panorama-cami.jpg",
  ];

  // Halı Koleksiyonu & Desenleri
  const catalogImages = Array.from({ length: 31 }, (_, i) => `/images/cami-katalog-${String(i + 1).padStart(2, "0")}.png`);

  // Referans Projeler
  const referencePhotos = [
    { src: "/images/referans-bilecik.jpg", caption: "Bilecik Cami Projesi" },
    { src: "/images/referans-esentepe.jpg", caption: "Esentepe Cami Projesi" },
  ];

  const handleClose = () => setSelectedImage(null);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") handleClose();
  };

  return (
    <>
      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={handleClose}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-60"
            aria-label="Close lightbox"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={selectedImage}
            alt="Full screen view"
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Section 1: HD Cami Fotoğrafları */}
      <section className="section bg-[#F7F3EC]">
        <div className="container-site">
          <div className="text-center mb-12">
            <span className="badge badge-gold mb-4">Galeri</span>
            <h2 className="section-title">HD Cami Fotoğrafları</h2>
            <div className="gold-line mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {hdPhotos.map((src, idx) => (
              <div
                key={idx}
                className="relative group overflow-hidden rounded-xl cursor-pointer bg-gray-200"
                onClick={() => setSelectedImage(src)}
              >
                <img
                  src={src}
                  alt={`HD Cami Fotoğrafı ${idx + 1}`}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Halı Koleksiyonu & Desenleri */}
      <section className="section bg-white">
        <div className="container-site">
          <div className="text-center mb-12">
            <span className="badge badge-green mb-4">Koleksiyon</span>
            <h2 className="section-title">Halı Koleksiyonu & Desenleri</h2>
            <div className="gold-line mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {catalogImages.map((src, idx) => (
              <div
                key={idx}
                className="relative group overflow-hidden rounded-xl cursor-pointer bg-gray-200"
                onClick={() => setSelectedImage(src)}
              >
                <img
                  src={src}
                  alt={`Halı Deseni ${idx + 1}`}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Referans Projeler */}
      <section className="section bg-[#F7F3EC]">
        <div className="container-site">
          <div className="text-center mb-12">
            <span className="badge badge-gold mb-4">Referanslar</span>
            <h2 className="section-title">Referans Projeler</h2>
            <div className="gold-line mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {referencePhotos.map((photo) => (
              <div
                key={photo.src}
                className="relative group overflow-hidden rounded-xl cursor-pointer bg-gray-200"
                onClick={() => setSelectedImage(photo.src)}
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D2418]/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-semibold text-lg">{photo.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="section bg-[#0D2418]">
        <div className="container-site text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Caminiz İçin Özel Halı Çözümü
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Yukarıdaki fotoğraflarda beğendiğiniz deseni caminize uyarlayabiliriz.
          </p>
          <a
            href="https://wa.me/905323467939?text=Merhaba%2C%20cami%20hal%C4%B1s%C4%B1%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-4 px-8 rounded-xl transition-colors text-lg"
          >
            WhatsApp ile İletişime Geç
          </a>
        </div>
      </section>
    </>
  );
}

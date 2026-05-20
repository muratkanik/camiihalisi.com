"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface LightboxImage {
  src: string;
  alt: string;
  title?: string;
}

interface LightboxProps {
  isOpen: boolean;
  images: LightboxImage[];
  initialIndex?: number;
  onClose: () => void;
  prefix?: string; // e.g. "/tr" for linking to renk-demo
}

export default function Lightbox({ isOpen, images, initialIndex = 0, onClose, prefix = "" }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  if (!isOpen || images.length === 0) return null;

  const currentImg = images[currentIndex];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Navigation - Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="absolute left-4 z-50 p-3 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* Main Image Container */}
      <div className="relative w-full h-full max-w-5xl max-h-[85vh] mx-4 flex flex-col items-center justify-center p-4">
        <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Image
            src={currentImg.src}
            alt={currentImg.alt}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>
        
        {/* Actions / Caption Bar */}
        <div className="absolute bottom-[-60px] left-0 right-0 flex items-center justify-between px-4" onClick={(e) => e.stopPropagation()}>
          <div className="text-white text-lg font-medium drop-shadow-md">
            {currentImg.title || currentImg.alt}
          </div>
          
          <Link 
            href={`${prefix}/renk-demo?imageUrl=${encodeURIComponent(currentImg.src)}&motifName=${encodeURIComponent(currentImg.title || currentImg.alt)}`}
            className="bg-[#0097A7] text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-[0_0_15px_rgba(0,151,167,0.5)] hover:bg-[#007A87] hover:scale-105 transition-all flex items-center gap-2"
            onClick={onClose} // Optional: close lightbox when navigating
          >
            <span role="img" aria-label="palette" className="text-lg">🎨</span> Rengini Değiştir
          </Link>
        </div>
      </div>

      {/* Navigation - Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="absolute right-4 z-50 p-3 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}
    </div>
  );
}

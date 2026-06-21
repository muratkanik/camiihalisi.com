"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "@/components/ui/Lightbox";

interface GalleryItem {
  src: string;
  label: string;
}

interface Props {
  prefix: string;
  items: GalleryItem[];
}

export default function S101GalleryClient({ prefix, items }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  const lightboxImages = items.map(item => ({
    src: item.src,
    alt: `S101 desen ${item.label} renk`,
    title: `S101 ${item.label}`
  }));

  const handleOpenLightbox = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    setLightboxIndex(index);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map(({ src, label }, index) => (
          <div key={src} className="group flex flex-col items-center gap-2">
            <div 
              onClick={(e) => handleOpenLightbox(index, e)}
              className="relative w-full aspect-square rounded-xl overflow-hidden border border-[#B2EBF2] group-hover:border-[#C9972B]/50 transition-colors shadow-sm cursor-pointer"
            >
              <Image
                src={src}
                alt={`Saflı cami halısı S101 desen ${label} renk`}
                width={300}
                height={300}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <span className="bg-white/90 text-[#0097A7] rounded-full p-2 shadow-lg backdrop-blur-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                 </span>
              </div>
            </div>
            <span className="text-xs font-medium text-[#6B6355]">{label}</span>
          </div>
        ))}
      </div>

      <Lightbox 
        isOpen={lightboxIndex >= 0} 
        images={lightboxImages} 
        initialIndex={Math.max(0, lightboxIndex)} 
        onClose={() => setLightboxIndex(-1)} 
        prefix={prefix}
      />
    </>
  );
}

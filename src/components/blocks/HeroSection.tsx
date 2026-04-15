"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

const MAIN_SITE_URL =
  "https://www.asilhali.com.tr?utm_source=camiihalisi&utm_medium=hero&utm_campaign=site";

// Kendi cami görsellerimiz
const IMAGES = [
  { src: "/images/cami-hero.png", alt: "Güzel bir cami iç mekanı" },
  { src: "/images/cami-1.png", alt: "Cami halısı deseni" },
  { src: "/images/cami-2.png", alt: "Cami mimarisinden bir görünüm" },
];

interface HeroContent {
  title?: string;
  subtitle?: string;
  buttons?: Array<{ label: string; action: string; variant?: string }>;
}

export default function HeroSection({ content }: { content?: HeroContent }) {
  const title = content?.title || "Camiye Layık Kalite";
  const subtitle =
    content?.subtitle ||
    "Türkiye'nin köklü halı ustalarından, ibadethanenize özel üretim. 50 yılı aşkın tecrübe, binlerce cami referansı.";

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative w-full h-[92vh] min-h-[580px] max-h-[900px] flex items-center justify-center overflow-hidden"
      aria-label="Ana hero bölümü"
    >
      {/* ── Arka Plan Slider ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src={IMAGES[currentIndex].src}
            alt={IMAGES[currentIndex].alt}
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Koyu Overlay — AAA Kontrast Garantisi ── */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0D2418]/95 via-[#0D2418]/55 to-[#0D2418]/25" />
      <div className="absolute inset-0 z-10 bg-black/15" />

      {/* ── İslami Geometrik Overlay (subtle) ── */}
      <div
        className="absolute inset-0 z-10 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='55' stroke='%23C9972B' stroke-width='1' fill='none'/%3E%3Ccircle cx='60' cy='60' r='40' stroke='%23C9972B' stroke-width='1' fill='none'/%3E%3Ccircle cx='60' cy='60' r='25' stroke='%23C9972B' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: "120px 120px",
        }}
      />

      {/* ── Ön Plan İçerik ── */}
      <div className="relative z-20 container-site text-center flex flex-col items-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          {/* Üst etiket */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[#C9972B]/40 bg-black/30 backdrop-blur-sm">
            <span className="text-[#E4B84A] text-xs font-semibold tracking-widest uppercase">
              ☽ Asil Halı A.Ş. ☾
            </span>
          </div>

          {/* Ana Başlık */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6 drop-shadow-2xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {title}
          </h1>

          {/* Alt başlık */}
          <p className="text-lg md:text-xl text-white/85 leading-relaxed mb-10 max-w-2xl mx-auto drop-shadow-lg">
            {subtitle}
          </p>

          {/* Butonlar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#kategoriler" className="btn btn-gold !text-base !px-8 !py-4">
              Koleksiyonları İncele
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href={MAIN_SITE_URL}
              target="_blank"
              rel="noopener"
              className="btn btn-outline !text-base !px-8 !py-4"
            >
              Asil Halı'ya Git
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Güven rozeti */}
          <div className="flex flex-wrap gap-6 justify-center items-center mt-10">
            {["50+ Yıl Tecrübe", "10.000+ Cami Referansı", "Türkiye Geneli Teslimat"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-white/75 text-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9972B]" />
                  {item}
                </div>
              )
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Slider Göstergeleri ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-400 rounded-full ${
              idx === currentIndex
                ? "w-8 h-2.5 bg-[#C9972B]"
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Slayt ${idx + 1}`}
          />
        ))}
      </div>

      {/* ── Alt Gradient Geçiş ── */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F7F3EC] to-transparent z-20" />
    </section>
  );
}

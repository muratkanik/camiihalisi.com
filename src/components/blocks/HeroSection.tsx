"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

const IMAGES = [
  { src: "/images/cami-hero.png",   alt: "Cami iç mekanı — turkuaz halı" },
  { src: "/images/hd-foto-01.jpg",  alt: "HD Cami Fotoğrafı" },
  { src: "/images/hd-foto-02.jpg",  alt: "HD Cami Fotoğrafı" },
  { src: "/images/hd-foto-03.jpg",  alt: "HD Cami Fotoğrafı" },
  { src: "/images/hd-foto-04.jpg",  alt: "HD Cami Fotoğrafı" },
  { src: "/images/hd-foto-05.jpg",  alt: "HD Cami Fotoğrafı" },
  { src: "/images/hd-foto-06.jpg",  alt: "HD Cami Fotoğrafı" },
  { src: "/images/panorama-cami.jpg", alt: "Panoramik Cami Görünümü" },
  { src: "/images/gobekli-cami-halisi.png", alt: "Göbekli Cami Halısı" },
  { src: "/images/ozel-cami-halisi.png",    alt: "Özel Desen Cami Halısı" },
];

const MAIN_SITE_URL =
  "/api/r?to=https%3A%2F%2Fwww.asilhali.com.tr%3Futm_source%3Dcamiihalisi%26utm_medium%3Dhero%26utm_campaign%3Dsite&from=hero&label=fiyat-teklifi&cat=outbound";

interface HeroContent {
  title?: string;
  subtitle?: string;
}

export default function HeroSection({ content }: { content?: HeroContent }) {
  const h = useTranslations("hero");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % IMAGES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative w-full h-[85vh] sm:h-[92vh] min-h-[560px] max-h-[900px] overflow-hidden">

      {/* ── Slider arka plan ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src={IMAGES[idx].src}
            alt={IMAGES[idx].alt}
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Gradient overlay — mobilde tam, masaüstünde yalnız sol ── */}
      <div className="absolute inset-0 z-10 bg-white/80 md:bg-gradient-to-r md:from-white/92 md:via-white/60 md:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-[#003B40]/70 to-transparent" />

      {/* ── İçerik ── */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="w-full px-6 md:px-12 lg:px-20">
          <div className="max-w-lg">

            {/* Üst etiket */}
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-6 h-px bg-[#C9972B]" />
              <span className="text-xs font-bold text-[#C9972B] uppercase tracking-widest">
                Asil Halı A.Ş.
              </span>
            </div>

            {/* Ana başlık */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0D1B1E] leading-tight mb-4">
              {h("questionTitle")}
            </h1>

            {/* Alt başlık */}
            <p className="text-[#334748] text-base md:text-lg leading-relaxed mb-7 max-w-sm">
              {h("questionSubtitle")}
            </p>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <a
                href={MAIN_SITE_URL}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 bg-[#C9972B] hover:bg-[#B8821E] text-white font-bold px-7 py-3.5 rounded-full transition-all shadow-lg hover:shadow-xl text-base"
              >
                {h("cta")}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#kategoriler"
                className="text-sm font-semibold text-[#006064] hover:text-[#C9972B] transition-colors underline underline-offset-4"
              >
                {h("browseCatalog")}
              </a>
            </div>

            {/* Checkmarks */}
            <ul className="space-y-2.5">
              {[h("check1"), h("check2"), h("check3")].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-[#0D1B1E] font-medium">
                  <span className="w-5 h-5 rounded-full bg-[#006064]/15 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#006064]" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Floating etiketler — sadece tablet+ ── */}
      <div className="hidden md:block absolute right-16 top-[22%] z-20">
        <div className="bg-white/85 backdrop-blur-md rounded-xl px-4 py-2.5 shadow-lg border border-[#B2EBF2]">
          <p className="text-xs font-bold text-[#006064] uppercase tracking-wider">{h("badge1Title")}</p>
          <p className="text-[10px] text-[#5A6A6D]">{h("badge1Desc")}</p>
        </div>
      </div>
      <div className="hidden md:block absolute right-16 top-[46%] z-20">
        <div className="bg-white/85 backdrop-blur-md rounded-xl px-4 py-2.5 shadow-lg border border-[#B2EBF2]">
          <p className="text-xs font-bold text-[#006064] uppercase tracking-wider">{h("badge2Title")}</p>
          <p className="text-[10px] text-[#5A6A6D]">{h("badge2Desc")}</p>
        </div>
      </div>
      <div className="hidden md:block absolute right-16 bottom-[20%] z-20">
        <div className="bg-white/85 backdrop-blur-md rounded-xl px-4 py-2.5 shadow-lg border border-[#B2EBF2]">
          <p className="text-xs font-bold text-[#006064] uppercase tracking-wider">{h("badge3Title")}</p>
          <p className="text-[10px] text-[#5A6A6D]">{h("badge3Desc")}</p>
        </div>
      </div>

      {/* ── Stats şeridi ── */}
      <div className="absolute bottom-0 inset-x-0 z-20 flex items-center justify-center gap-6 md:gap-20 py-4">
        {[
          { n: "50+",     l: h("statYears") },
          { n: "10.000+", l: h("statMosques") },
          { n: "81",      l: h("statCities") },
        ].map((s) => (
          <div key={s.l} className="text-center">
            <div className="text-xl md:text-2xl font-extrabold text-[#E4B84A] leading-none">{s.n}</div>
            <div className="text-[11px] text-white/80 mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── Slider noktaları ── */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i === idx ? "bg-[#C9972B] w-4" : "bg-white/50"
            }`}
            aria-label={`${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

"use client";

import { ArrowRight, Check } from "lucide-react";

const HERO_IMAGE = "/images/cami-hero.png";

const MAIN_SITE_URL =
  "/api/r?to=https%3A%2F%2Fwww.asilhali.com.tr%3Futm_source%3Dcamiihalisi%26utm_medium%3Dhero%26utm_campaign%3Dsite&from=hero&label=fiyat-teklifi&cat=outbound";

const CHECKS = [
  "İhtiyaçlarınıza Özel Çözüm",
  "Uzman Satış Danışmanları",
  "Ücretsiz ve Hızlı Teklif",
];

interface HeroContent {
  title?: string;
  subtitle?: string;
}

export default function HeroSection({ content }: { content?: HeroContent }) {
  return (
    <section className="w-full bg-[#F0FDFE] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[560px]">

        {/* ── Sol: İçerik ── */}
        <div className="flex flex-col justify-center px-8 md:px-12 lg:px-16 py-14 lg:py-16 bg-white">
          {/* Üst etiket */}
          <div className="inline-flex items-center gap-2 mb-5 self-start">
            <span className="w-6 h-px bg-[#C9972B]" />
            <span className="text-xs font-bold text-[#C9972B] uppercase tracking-widest">
              Asil Halı A.Ş.
            </span>
          </div>

          {/* Ana başlık */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0D1B1E] leading-tight mb-4">
            Cami Halısı mı<br />Arıyorsunuz?
          </h1>

          {/* Alt başlık */}
          <p className="text-[#5A6A6D] text-base md:text-lg leading-relaxed mb-7 max-w-md">
            Ucuz Bir Çözüm mü, Uzun Yıllar Sorunsuz Kullanacağınız Güvenilir Bir Sistem mi?
          </p>

          {/* CTA butonu */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <a
              href={MAIN_SITE_URL}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 bg-[#C9972B] hover:bg-[#B8821E] text-white font-bold px-7 py-3.5 rounded-full transition-all shadow-md hover:shadow-lg text-base"
            >
              Teklif Al
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#kategoriler"
              className="text-sm font-semibold text-[#006064] hover:text-[#C9972B] transition-colors underline underline-offset-4"
            >
              Modelleri İncele →
            </a>
          </div>

          {/* Checkmark listesi */}
          <ul className="space-y-2.5">
            {CHECKS.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-[#0D1B1E] font-medium">
                <span className="w-5 h-5 rounded-full bg-[#E0F7FA] flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-[#006064]" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Sağ: Görsel + floating etiketler ── */}
        <div className="relative min-h-[320px] lg:min-h-0">
          <img
            src={HERO_IMAGE}
            alt="Asil Halı — Cami iç mekanı turkuaz halı"
            className="w-full h-full object-cover object-center"
          />

          {/* Hafif overlay */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#006064]/10" />

          {/* Floating etiket — Uzun Ömür */}
          <div className="absolute top-[18%] left-4 md:left-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-[#B2EBF2]">
              <p className="text-xs font-bold text-[#006064] uppercase tracking-wider">Uzun Ömür</p>
              <p className="text-[10px] text-[#5A6A6D]">15-20 yıl kullanım ömrü</p>
            </div>
            {/* ok */}
            <div className="ml-6 mt-0.5 w-px h-8 bg-[#C9972B]/60" />
          </div>

          {/* Floating etiket — Yüksek Konfor */}
          <div className="absolute top-[46%] right-4 md:right-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-[#B2EBF2]">
              <p className="text-xs font-bold text-[#006064] uppercase tracking-wider">Yüksek Konfor</p>
              <p className="text-[10px] text-[#5A6A6D]">Namaz konforunu artırır</p>
            </div>
          </div>

          {/* Floating etiket — Profesyonel Uygulama */}
          <div className="absolute bottom-[12%] right-4 md:right-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-[#B2EBF2]">
              <p className="text-xs font-bold text-[#006064] uppercase tracking-wider">Profesyonel Uygulama</p>
              <p className="text-[10px] text-[#5A6A6D]">Uzman ekip montajı</p>
            </div>
          </div>

          {/* Stats ribbon */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#006064]/80 backdrop-blur-sm px-6 py-3 flex gap-6 overflow-hidden">
            {[
              { n: "50+", l: "Yıl Tecrübe" },
              { n: "10.000+", l: "Referans Cami" },
              { n: "81", l: "Şehir Teslimat" },
            ].map((s) => (
              <div key={s.l} className="text-center flex-1">
                <div className="text-lg font-extrabold text-[#E4B84A] leading-none">{s.n}</div>
                <div className="text-[10px] text-white/80 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

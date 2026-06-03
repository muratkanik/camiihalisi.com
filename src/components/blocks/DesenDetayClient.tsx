"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Palette,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Ruler,
  Shield,
  Flame,
  Zap,
  Droplets,
  Star,
} from "lucide-react";
import dynamic from "next/dynamic";

const ColorReplacementModal = dynamic(
  () => import("@/components/blocks/ColorReplacementModal"),
  { ssr: false }
);

import type { SafliAkrilikDesen } from "@/lib/safli-akrilik-desenler";

/* Sabit ürün bilgileri — tüm saflı akrilik halılara ortak */
const PRODUCT_SPECS = [
  { icon: Ruler, label: "Hav Yüksekliği", value: "8-10 mm" },
  { icon: Shield, label: "Ağırlık", value: "2.100-2.800 gr/m²" },
  { icon: Flame, label: "Yangın Sınıfı", value: "Bfl-s1" },
  { icon: Zap, label: "Antistatik", value: "Evet" },
  { icon: Droplets, label: "Leke Tutmazlık", value: "Yüksek" },
  { icon: Star, label: "Garanti", value: "7 Yıl" },
];

const PRODUCT_FEATURES = [
  "100% Akrilik iplik — yumuşak dokunuş ve parlak görünüm",
  "Saf çizgileri düzenli namaz sırası oluşturur",
  "Leke ve kire karşı özel koruma katmanı",
  "UV direnci — renkler uzun yıllar solmaz",
  "Kolay bakım ve temizlik",
  "Özel sipariş ile istenilen renkte üretim",
  "Bfl-s1 yangın sınıfı sertifikası",
  "Tüm ölçülerde üretim imkanı",
];

interface DesenDetayClientProps {
  desen: SafliAkrilikDesen;
  prevDesen: SafliAkrilikDesen | null;
  nextDesen: SafliAkrilikDesen | null;
  prefix: string;
  locale: string;
  categorySlug: string;
}

export default function DesenDetayClient({
  desen,
  prevDesen,
  nextDesen,
  prefix,
  locale,
  categorySlug,
}: DesenDetayClientProps) {
  const [colorModalOpen, setColorModalOpen] = useState(false);

  const displayName = useMemo(() => {
    if (locale === "en") return desen.nameEn;
    if (locale === "ar") return desen.nameAr;
    return desen.name;
  }, [desen, locale]);

  const altText = useMemo(() => {
    if (locale === "en") return desen.altTextEn;
    if (locale === "ar") return desen.altTextAr;
    return desen.altText;
  }, [desen, locale]);

  return (
    <>
      <div className="min-h-screen bg-[#FAFAF8]">
        {/* ── Breadcrumb ── */}
        <div className="bg-[#F0FDFE] border-b border-[#E0F7FA]">
          <div className="container-site py-3">
            <nav className="flex items-center gap-2 text-xs text-[#6B6355]">
              <Link href={`${prefix}`} className="hover:text-[#0097A7]">Ana Sayfa</Link>
              <span>/</span>
              <Link href={`${prefix}/kategori/${categorySlug}`} className="hover:text-[#0097A7]">
                Saflı Akrilik Cami Halısı
              </Link>
              <span>/</span>
              <span className="text-[#003B40] font-semibold">{displayName}</span>
            </nav>
          </div>
        </div>

        {/* ── Ana İçerik ── */}
        <section className="container-site py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Sol — Görsel */}
            <div className="space-y-4">
              {/* Geri Butonu */}
              <Link
                href={`${prefix}/kategori/${categorySlug}`}
                className="inline-flex items-center gap-1.5 text-sm text-[#0097A7] hover:text-[#007A88] font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Tüm Desenlere Dön
              </Link>

              {/* Ana Görsel */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-[#E0F7FA] shadow-lg">
                <Image
                  src={desen.image}
                  alt={altText}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Renk Değiştir Butonu */}
              <button
                onClick={() => setColorModalOpen(true)}
                className="w-full py-4 bg-gradient-to-r from-[#C9972B] to-[#DAA520] hover:from-[#B8860B] hover:to-[#C9972B] text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Palette className="w-5 h-5" />
                Rengini Değiştir — Canlı Önizleme
              </button>

              {/* Önceki / Sonraki */}
              <div className="flex gap-3">
                {prevDesen ? (
                  <Link
                    href={`${prefix}/kategori/${categorySlug}/${prevDesen.id}`}
                    className="flex-1 flex items-center gap-2 px-4 py-3 bg-white border border-[#E0F7FA] rounded-xl hover:bg-[#F0FDFE] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#0097A7]" />
                    <div className="min-w-0">
                      <div className="text-[10px] text-[#999]">Önceki</div>
                      <div className="text-xs font-semibold text-[#003B40] truncate">
                        {locale === "en" ? prevDesen.nameEn : prevDesen.name}
                      </div>
                    </div>
                  </Link>
                ) : <div className="flex-1" />}

                {nextDesen ? (
                  <Link
                    href={`${prefix}/kategori/${categorySlug}/${nextDesen.id}`}
                    className="flex-1 flex items-center gap-2 px-4 py-3 bg-white border border-[#E0F7FA] rounded-xl hover:bg-[#F0FDFE] transition-colors text-right justify-end"
                  >
                    <div className="min-w-0">
                      <div className="text-[10px] text-[#999]">Sonraki</div>
                      <div className="text-xs font-semibold text-[#003B40] truncate">
                        {locale === "en" ? nextDesen.nameEn : nextDesen.name}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#0097A7]" />
                  </Link>
                ) : <div className="flex-1" />}
              </div>
            </div>

            {/* Sağ — Bilgiler */}
            <div className="space-y-6">
              {/* Başlık + Badge */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E0F7FA] text-[#0097A7] rounded-full text-xs font-bold mb-3">
                  <Star className="w-3 h-3" /> Saflı Akrilik
                </div>
                <h1
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#003B40] mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {displayName}
                </h1>
                <p className="text-sm text-[#6B6355] leading-relaxed">
                  Saflı akrilik cami halısı — {displayName} deseni. Yüksek kaliteli %100 akrilik iplikten
                  üretilmiş, saf çizgili namaz düzeni sunan özel tasarım cami halısı.
                  İstenilen renkte özel üretim yapılabilir.
                </p>
              </div>

              {/* Teknik Özellikler */}
              <div className="bg-white rounded-2xl border border-[#E0F7FA] p-5 shadow-sm">
                <h2 className="text-base font-bold text-[#003B40] mb-4">Teknik Özellikler</h2>
                <div className="grid grid-cols-2 gap-3">
                  {PRODUCT_SPECS.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-center gap-3 p-3 bg-[#F0FDFE] rounded-xl"
                    >
                      <div className="w-8 h-8 bg-[#0097A7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <spec.icon className="w-4 h-4 text-[#0097A7]" />
                      </div>
                      <div>
                        <div className="text-[10px] text-[#999] uppercase tracking-wider">{spec.label}</div>
                        <div className="text-sm font-bold text-[#003B40]">{spec.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Malzeme Bilgileri */}
              <div className="bg-white rounded-2xl border border-[#E0F7FA] p-5 shadow-sm">
                <h2 className="text-base font-bold text-[#003B40] mb-3">Malzeme ve Üretim</h2>
                <div className="space-y-2.5">
                  <div className="flex justify-between py-2 border-b border-[#F0FDFE]">
                    <span className="text-sm text-[#6B6355]">Lif Türü</span>
                    <span className="text-sm font-semibold text-[#003B40]">%100 Akrilik</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#F0FDFE]">
                    <span className="text-sm text-[#6B6355]">Desen Tipi</span>
                    <span className="text-sm font-semibold text-[#003B40]">Saflı</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#F0FDFE]">
                    <span className="text-sm text-[#6B6355]">Üretim</span>
                    <span className="text-sm font-semibold text-[#003B40]">Makine Halısı</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#F0FDFE]">
                    <span className="text-sm text-[#6B6355]">Renk Seçeneği</span>
                    <span className="text-sm font-semibold text-[#C9972B]">Özel Sipariş</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-[#6B6355]">Teslimat</span>
                    <span className="text-sm font-semibold text-[#003B40]">3-4 Hafta</span>
                  </div>
                </div>
              </div>

              {/* Özellikler Listesi */}
              <div className="bg-white rounded-2xl border border-[#E0F7FA] p-5 shadow-sm">
                <h2 className="text-base font-bold text-[#003B40] mb-3">Ürün Özellikleri</h2>
                <ul className="space-y-2">
                  {PRODUCT_FEATURES.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#6B6355]">
                      <div className="w-5 h-5 bg-[#E0F7FA] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 bg-[#0097A7] rounded-full" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Kartları */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://wa.me/905323467939?text=Merhaba%2C%20safli%20akrilik%20cami%20halisi%20hakkinda%20bilgi%20almak%20istiyorum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-4 bg-[#25D366] hover:bg-[#20BD5C] text-white rounded-xl font-semibold text-sm transition-all shadow-md"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp ile Bilgi Al
                </a>
                <a
                  href="tel:+903425022233"
                  className="flex items-center gap-3 px-5 py-4 bg-[#003B40] hover:bg-[#005566] text-white rounded-xl font-semibold text-sm transition-all shadow-md"
                >
                  <Phone className="w-5 h-5" />
                  Hemen Arayın
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Renk Değiştirme Modalı ── */}
      <ColorReplacementModal
        isOpen={colorModalOpen}
        onClose={() => setColorModalOpen(false)}
        imageSrc={desen.image}
        patternName={displayName}
      />
    </>
  );
}

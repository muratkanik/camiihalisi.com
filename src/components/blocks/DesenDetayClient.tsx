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

/* ══════════════════════════════════════════════════
   Locale çeviri sözlüğü — tüm UI metinleri
   ══════════════════════════════════════════════════ */
const T: Record<string, Record<string, string>> = {
  tr: {
    home: "Ana Sayfa",
    categoryName: "Saflı Akrilik Cami Halısı",
    backToAll: "Tüm Desenlere Dön",
    changeColor: "Rengini Değiştir — Canlı Önizleme",
    prev: "Önceki",
    next: "Sonraki",
    badge: "Saflı Akrilik",
    description: "Saflı akrilik cami halısı — {name} deseni. Yüksek kaliteli %100 akrilik iplikten üretilmiş, saf çizgili namaz düzeni sunan özel tasarım cami halısı. İstenilen renkte özel üretim yapılabilir.",
    techSpecs: "Teknik Özellikler",
    pileHeight: "Hav Yüksekliği",
    weight: "Ağırlık",
    fireClass: "Yangın Sınıfı",
    antistatic: "Antistatik",
    antistaticVal: "Evet",
    stainResist: "Leke Tutmazlık",
    stainResistVal: "Yüksek",
    warranty: "Garanti",
    warrantyVal: "7 Yıl",
    materialTitle: "Malzeme ve Üretim",
    fiberType: "Lif Türü",
    fiberTypeVal: "%100 Akrilik",
    patternType: "Desen Tipi",
    patternTypeVal: "Saflı",
    production: "Üretim",
    productionVal: "Makine Halısı",
    colorOption: "Renk Seçeneği",
    colorOptionVal: "Özel Sipariş",
    delivery: "Teslimat",
    deliveryVal: "3-4 Hafta",
    featuresTitle: "Ürün Özellikleri",
    feat1: "100% Akrilik iplik — yumuşak dokunuş ve parlak görünüm",
    feat2: "Saf çizgileri düzenli namaz sırası oluşturur",
    feat3: "Leke ve kire karşı özel koruma katmanı",
    feat4: "UV direnci — renkler uzun yıllar solmaz",
    feat5: "Kolay bakım ve temizlik",
    feat6: "Özel sipariş ile istenilen renkte üretim",
    feat7: "Bfl-s1 yangın sınıfı sertifikası",
    feat8: "Tüm ölçülerde üretim imkanı",
    whatsapp: "WhatsApp ile Bilgi Al",
    callNow: "Hemen Arayın",
    waMsg: "Merhaba%2C%20safli%20akrilik%20cami%20halisi%20hakkinda%20bilgi%20almak%20istiyorum.",
  },
  en: {
    home: "Home",
    categoryName: "Acrylic Lined Mosque Carpet",
    backToAll: "Back to All Patterns",
    changeColor: "Change Color — Live Preview",
    prev: "Previous",
    next: "Next",
    badge: "Acrylic Lined",
    description: "Acrylic lined mosque carpet — {name} pattern. Made from high-quality 100% acrylic yarn, offering an orderly prayer line layout. Custom production available in any colour.",
    techSpecs: "Technical Specifications",
    pileHeight: "Pile Height",
    weight: "Weight",
    fireClass: "Fire Class",
    antistatic: "Antistatic",
    antistaticVal: "Yes",
    stainResist: "Stain Resistance",
    stainResistVal: "High",
    warranty: "Warranty",
    warrantyVal: "7 Years",
    materialTitle: "Material & Production",
    fiberType: "Fibre Type",
    fiberTypeVal: "100% Acrylic",
    patternType: "Pattern Type",
    patternTypeVal: "Lined",
    production: "Production",
    productionVal: "Machine Woven",
    colorOption: "Colour Option",
    colorOptionVal: "Custom Order",
    delivery: "Delivery",
    deliveryVal: "3-4 Weeks",
    featuresTitle: "Product Features",
    feat1: "100% Acrylic yarn — soft touch and bright appearance",
    feat2: "Line markings create orderly prayer rows",
    feat3: "Special protective layer against stains and dirt",
    feat4: "UV resistance — colours stay vibrant for years",
    feat5: "Easy care and cleaning",
    feat6: "Custom production in any desired colour",
    feat7: "Bfl-s1 fire class certification",
    feat8: "Available in all sizes",
    whatsapp: "Get Info via WhatsApp",
    callNow: "Call Now",
    waMsg: "Hello%2C%20I%20would%20like%20to%20get%20information%20about%20acrylic%20mosque%20carpets.",
  },
  ar: {
    home: "الرئيسية",
    categoryName: "سجاد مسجد أكريليك مصفوف",
    backToAll: "العودة إلى جميع الأنماط",
    changeColor: "تغيير اللون — معاينة مباشرة",
    prev: "السابق",
    next: "التالي",
    badge: "أكريليك مصفوف",
    description: "سجاد مسجد أكريليك مصفوف — نمط {name}. مصنوع من خيوط أكريليك 100% عالية الجودة، يوفر صفوف صلاة منتظمة. الإنتاج حسب الطلب بأي لون.",
    techSpecs: "المواصفات الفنية",
    pileHeight: "ارتفاع الوبر",
    weight: "الوزن",
    fireClass: "فئة الحريق",
    antistatic: "مضاد للكهرباء الساكنة",
    antistaticVal: "نعم",
    stainResist: "مقاومة البقع",
    stainResistVal: "عالية",
    warranty: "الضمان",
    warrantyVal: "٧ سنوات",
    materialTitle: "المواد والإنتاج",
    fiberType: "نوع الألياف",
    fiberTypeVal: "أكريليك 100%",
    patternType: "نوع النمط",
    patternTypeVal: "مصفوف",
    production: "الإنتاج",
    productionVal: "سجاد آلي",
    colorOption: "خيار اللون",
    colorOptionVal: "طلب خاص",
    delivery: "التسليم",
    deliveryVal: "٣-٤ أسابيع",
    featuresTitle: "مميزات المنتج",
    feat1: "خيوط أكريليك 100% — ملمس ناعم ومظهر لامع",
    feat2: "خطوط الصف تُنشئ صفوف صلاة منتظمة",
    feat3: "طبقة حماية خاصة ضد البقع والأوساخ",
    feat4: "مقاومة للأشعة فوق البنفسجية — الألوان لا تتلاشى لسنوات",
    feat5: "سهولة العناية والتنظيف",
    feat6: "إنتاج حسب الطلب بأي لون مطلوب",
    feat7: "شهادة فئة الحريق Bfl-s1",
    feat8: "متوفر بجميع المقاسات",
    whatsapp: "احصل على معلومات عبر واتساب",
    callNow: "اتصل الآن",
    waMsg: "مرحبا%2C%20أود%20الحصول%20على%20معلومات%20حول%20سجاد%20المسجد%20الأكريليك.",
  },
  fr: {
    home: "Accueil",
    categoryName: "Tapis de Mosquée Acrylique à Lignes",
    backToAll: "Retour à tous les motifs",
    changeColor: "Changer la couleur — Aperçu en direct",
    prev: "Précédent",
    next: "Suivant",
    badge: "Acrylique à Lignes",
    description: "Tapis de mosquée acrylique à lignes — motif {name}. Fabriqué en fil acrylique 100% de haute qualité, offrant des rangées de prière ordonnées. Production sur mesure dans toute couleur souhaitée.",
    techSpecs: "Caractéristiques Techniques",
    pileHeight: "Hauteur du Velours",
    weight: "Poids",
    fireClass: "Classe Feu",
    antistatic: "Antistatique",
    antistaticVal: "Oui",
    stainResist: "Résistance aux Taches",
    stainResistVal: "Élevée",
    warranty: "Garantie",
    warrantyVal: "7 Ans",
    materialTitle: "Matériaux et Production",
    fiberType: "Type de Fibre",
    fiberTypeVal: "100% Acrylique",
    patternType: "Type de Motif",
    patternTypeVal: "À Lignes",
    production: "Production",
    productionVal: "Tissage Machine",
    colorOption: "Option Couleur",
    colorOptionVal: "Commande Spéciale",
    delivery: "Livraison",
    deliveryVal: "3-4 Semaines",
    featuresTitle: "Caractéristiques du Produit",
    feat1: "Fil acrylique 100% — toucher doux et apparence brillante",
    feat2: "Les marquages créent des rangées de prière ordonnées",
    feat3: "Couche de protection spéciale contre les taches et la saleté",
    feat4: "Résistance aux UV — les couleurs restent vives pendant des années",
    feat5: "Entretien et nettoyage faciles",
    feat6: "Production personnalisée dans la couleur souhaitée",
    feat7: "Certification classe feu Bfl-s1",
    feat8: "Disponible dans toutes les tailles",
    whatsapp: "Info via WhatsApp",
    callNow: "Appelez Maintenant",
    waMsg: "Bonjour%2C%20je%20souhaiterais%20obtenir%20des%20informations%20sur%20les%20tapis%20de%20mosquée%20acryliques.",
  },
  de: {
    home: "Startseite",
    categoryName: "Acryl-Moscheeteppich mit Reihen",
    backToAll: "Zurück zu allen Mustern",
    changeColor: "Farbe ändern — Live-Vorschau",
    prev: "Vorheriges",
    next: "Nächstes",
    badge: "Acryl Reihen",
    description: "Acryl-Moscheeteppich mit Reihen — Muster {name}. Hergestellt aus hochwertigem 100% Acrylgarn, bietet geordnete Gebetsreihen. Sonderanfertigung in jeder gewünschten Farbe.",
    techSpecs: "Technische Daten",
    pileHeight: "Florhöhe",
    weight: "Gewicht",
    fireClass: "Brandklasse",
    antistatic: "Antistatisch",
    antistaticVal: "Ja",
    stainResist: "Fleckenschutz",
    stainResistVal: "Hoch",
    warranty: "Garantie",
    warrantyVal: "7 Jahre",
    materialTitle: "Material & Produktion",
    fiberType: "Fasertyp",
    fiberTypeVal: "100% Acryl",
    patternType: "Mustertyp",
    patternTypeVal: "Reihen",
    production: "Produktion",
    productionVal: "Maschinengewebt",
    colorOption: "Farboption",
    colorOptionVal: "Sonderbestellung",
    delivery: "Lieferung",
    deliveryVal: "3-4 Wochen",
    featuresTitle: "Produkteigenschaften",
    feat1: "100% Acrylgarn — weiche Haptik und glänzendes Aussehen",
    feat2: "Reihmarkierungen sorgen für geordnete Gebetsreihen",
    feat3: "Spezielle Schutzschicht gegen Flecken und Schmutz",
    feat4: "UV-Beständigkeit — Farben bleiben jahrelang leuchtend",
    feat5: "Leichte Pflege und Reinigung",
    feat6: "Sonderanfertigung in jeder gewünschten Farbe",
    feat7: "Bfl-s1 Brandklassenzertifizierung",
    feat8: "In allen Größen erhältlich",
    whatsapp: "Info über WhatsApp",
    callNow: "Jetzt Anrufen",
    waMsg: "Hallo%2C%20ich%20möchte%20Informationen%20über%20Acryl-Moscheeteppiche%20erhalten.",
  },
};

function t(locale: string, key: string, vars?: Record<string, string>): string {
  const dict = T[locale] || T.tr;
  let val = dict[key] || T.tr[key] || key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      val = val.replace(`{${k}}`, v);
    }
  }
  return val;
}

/* ── Teknik Spec İkonları ── */
const SPEC_ICONS = [
  { icon: Ruler, key: "pileHeight", val: "8-10 mm" },
  { icon: Shield, key: "weight", val: "2.100-2.800 gr/m²" },
  { icon: Flame, key: "fireClass", val: "Bfl-s1" },
  { icon: Zap, key: "antistatic", valKey: "antistaticVal" },
  { icon: Droplets, key: "stainResist", valKey: "stainResistVal" },
  { icon: Star, key: "warranty", valKey: "warrantyVal" },
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

  const prevName = prevDesen
    ? locale === "en" ? prevDesen.nameEn : locale === "ar" ? prevDesen.nameAr : prevDesen.name
    : "";
  const nextName = nextDesen
    ? locale === "en" ? nextDesen.nameEn : locale === "ar" ? nextDesen.nameAr : nextDesen.name
    : "";

  const features = [
    t(locale, "feat1"), t(locale, "feat2"), t(locale, "feat3"), t(locale, "feat4"),
    t(locale, "feat5"), t(locale, "feat6"), t(locale, "feat7"), t(locale, "feat8"),
  ];

  const materialRows = [
    { label: t(locale, "fiberType"), value: t(locale, "fiberTypeVal"), gold: false },
    { label: t(locale, "patternType"), value: t(locale, "patternTypeVal"), gold: false },
    { label: t(locale, "production"), value: t(locale, "productionVal"), gold: false },
    { label: t(locale, "colorOption"), value: t(locale, "colorOptionVal"), gold: true },
    { label: t(locale, "delivery"), value: t(locale, "deliveryVal"), gold: false },
  ];

  const isRtl = locale === "ar";

  return (
    <>
      <div className="min-h-screen bg-[#FAFAF8]" dir={isRtl ? "rtl" : "ltr"}>
        {/* ── Breadcrumb ── */}
        <div className="bg-[#F0FDFE] border-b border-[#E0F7FA]">
          <div className="container-site py-3">
            <nav className="flex items-center gap-2 text-xs text-[#6B6355]">
              <Link href={`${prefix}`} className="hover:text-[#0097A7]">{t(locale, "home")}</Link>
              <span>/</span>
              <Link href={`${prefix}/kategori/${categorySlug}`} className="hover:text-[#0097A7]">
                {t(locale, "categoryName")}
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
              <Link
                href={`${prefix}/kategori/${categorySlug}`}
                className="inline-flex items-center gap-1.5 text-sm text-[#0097A7] hover:text-[#007A88] font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t(locale, "backToAll")}
              </Link>

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

              <button
                onClick={() => setColorModalOpen(true)}
                className="w-full py-4 bg-gradient-to-r from-[#C9972B] to-[#DAA520] hover:from-[#B8860B] hover:to-[#C9972B] text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Palette className="w-5 h-5" />
                {t(locale, "changeColor")}
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
                      <div className="text-[10px] text-[#999]">{t(locale, "prev")}</div>
                      <div className="text-xs font-semibold text-[#003B40] truncate">{prevName}</div>
                    </div>
                  </Link>
                ) : <div className="flex-1" />}

                {nextDesen ? (
                  <Link
                    href={`${prefix}/kategori/${categorySlug}/${nextDesen.id}`}
                    className="flex-1 flex items-center gap-2 px-4 py-3 bg-white border border-[#E0F7FA] rounded-xl hover:bg-[#F0FDFE] transition-colors text-right justify-end"
                  >
                    <div className="min-w-0">
                      <div className="text-[10px] text-[#999]">{t(locale, "next")}</div>
                      <div className="text-xs font-semibold text-[#003B40] truncate">{nextName}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#0097A7]" />
                  </Link>
                ) : <div className="flex-1" />}
              </div>
            </div>

            {/* Sağ — Bilgiler */}
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E0F7FA] text-[#0097A7] rounded-full text-xs font-bold mb-3">
                  <Star className="w-3 h-3" /> {t(locale, "badge")}
                </div>
                <h1
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#003B40] mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {displayName}
                </h1>
                <p className="text-sm text-[#6B6355] leading-relaxed">
                  {t(locale, "description", { name: displayName })}
                </p>
              </div>

              {/* Teknik Özellikler */}
              <div className="bg-white rounded-2xl border border-[#E0F7FA] p-5 shadow-sm">
                <h2 className="text-base font-bold text-[#003B40] mb-4">{t(locale, "techSpecs")}</h2>
                <div className="grid grid-cols-2 gap-3">
                  {SPEC_ICONS.map((spec) => (
                    <div
                      key={spec.key}
                      className="flex items-center gap-3 p-3 bg-[#F0FDFE] rounded-xl"
                    >
                      <div className="w-8 h-8 bg-[#0097A7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <spec.icon className="w-4 h-4 text-[#0097A7]" />
                      </div>
                      <div>
                        <div className="text-[10px] text-[#999] uppercase tracking-wider">{t(locale, spec.key)}</div>
                        <div className="text-sm font-bold text-[#003B40]">
                          {spec.val || t(locale, spec.valKey!)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Malzeme Bilgileri */}
              <div className="bg-white rounded-2xl border border-[#E0F7FA] p-5 shadow-sm">
                <h2 className="text-base font-bold text-[#003B40] mb-3">{t(locale, "materialTitle")}</h2>
                <div className="space-y-2.5">
                  {materialRows.map((row, i) => (
                    <div key={i} className={`flex justify-between py-2 ${i < materialRows.length - 1 ? "border-b border-[#F0FDFE]" : ""}`}>
                      <span className="text-sm text-[#6B6355]">{row.label}</span>
                      <span className={`text-sm font-semibold ${row.gold ? "text-[#C9972B]" : "text-[#003B40]"}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Özellikler Listesi */}
              <div className="bg-white rounded-2xl border border-[#E0F7FA] p-5 shadow-sm">
                <h2 className="text-base font-bold text-[#003B40] mb-3">{t(locale, "featuresTitle")}</h2>
                <ul className="space-y-2">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#6B6355]">
                      <div className="w-5 h-5 bg-[#E0F7FA] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 bg-[#0097A7] rounded-full" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`https://wa.me/905323467939?text=${t(locale, "waMsg")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-4 bg-[#25D366] hover:bg-[#20BD5C] text-white rounded-xl font-semibold text-sm transition-all shadow-md"
                >
                  <MessageCircle className="w-5 h-5" />
                  {t(locale, "whatsapp")}
                </a>
                <a
                  href="tel:+903425022233"
                  className="flex items-center gap-3 px-5 py-4 bg-[#003B40] hover:bg-[#005566] text-white rounded-xl font-semibold text-sm transition-all shadow-md"
                >
                  <Phone className="w-5 h-5" />
                  {t(locale, "callNow")}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ColorReplacementModal
        isOpen={colorModalOpen}
        onClose={() => setColorModalOpen(false)}
        imageSrc={desen.image}
        patternName={displayName}
        locale={locale}
      />
    </>
  );
}

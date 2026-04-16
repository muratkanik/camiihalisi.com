import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";

const CATEGORIES = [
  {
    slug: "akrilik-cami-halisi",
    title: "Akrilik Cami Halısı",
    description: "Parlak renkleri, yumuşak dokusu ve ekonomik fiyatıyla en çok tercih edilen halı türü.",
    badge: "En Çok Satan",
    image: "/images/cami-1.png",
    color: "#006064",
    features: ["Solmaz Renk", "Yumuşak Doku", "Ekonomik"],
    subcategories: [
      { label: "Saflı Akrilik", slug: "safli-akrilik-cami-halisi" },
      { label: "Göbekli Akrilik", slug: "gobekli-akrilik-cami-halisi" },
      { label: "Seccadeli Akrilik", slug: "seccadeli-akrilik-cami-halisi" },
    ],
  },
  {
    slug: "yun-cami-halisi",
    title: "Yün Cami Halısı",
    description: "Doğal yünün sıcaklığı ve dayanıklılığıyla ibadethaneye özel lüks.",
    badge: "Premium",
    image: "/images/cami-2.png",
    color: "#0097A7",
    features: ["%100 Doğal", "Isı Yalıtımı", "Uzun Ömür"],
    subcategories: [
      { label: "Saflı Yün", slug: "safli-yun-cami-halisi" },
      { label: "Göbekli Yün", slug: "gobekli-yun-cami-halisi" },
      { label: "Seccadeli Yün", slug: "seccadeli-yun-cami-halisi" },
    ],
  },
  {
    slug: "polipropilen-cami-halisi",
    title: "Polipropilen Cami Halısı",
    description: "Neme ve lekeye karşı üstün direnciyle yüksek trafik alanları için üretilmiş.",
    badge: "Dayanıklı",
    image: "/images/cami-3.png",
    color: "#006064",
    features: ["Kolay Temizlik", "Leke Tutmaz", "Yüksek Trafik"],
    subcategories: [
      { label: "Saflı Polipropilen", slug: "safli-polipropilen-cami-halisi" },
      { label: "Göbekli Polipropilen", slug: "gobekli-polipropilen-cami-halisi" },
      { label: "Seccadeli Polipropilen", slug: "seccadeli-polipropilen-cami-halisi" },
    ],
  },
  {
    slug: "polyamid-cami-halisi",
    title: "Polyamid Cami Halısı",
    description: "Sentetik liflerin en kalitelisi. Yüksek aşınma direnci ve canlı renklerle büyük camilerin tercihi.",
    badge: "Profesyonel",
    image: "/images/cami-4.png",
    color: "#0097A7",
    features: ["Aşınmaz", "Canlı Renkler", "Büyük Hacim"],
    subcategories: [
      { label: "Saflı Polyamid", slug: "safli-polyamid-cami-halisi" },
      { label: "Göbekli Polyamid", slug: "gobekli-polyamid-cami-halisi" },
      { label: "Seccadeli Polyamid", slug: "seccadeli-polyamid-cami-halisi" },
    ],
  },
];

const SPECIAL = {
  slug: "ozel-desen-axminster-cami-halisi",
  title: "Özel Desen & Renk Axminster Cami Halısı",
  description: "Sınırsız renk ve desen seçeneğiyle tamamen özelleştirilebilir Axminster dokuma — her cami için eşsiz tasarım.",
  badge: "Özel Sipariş",
  image: "/images/cami-hero.png",
  features: ["Sınırsız Renk", "Özel Tasarım", "Ücretsiz 3D Görselleştirme"],
};

interface CategoryGridProps {
  locale: string;
}

export default function CategoryGrid({ locale }: CategoryGridProps) {
  const prefix = locale === "tr" ? "" : `/${locale}`;

  return (
    <section id="kategoriler" className="section bg-[#F0FDFE] geometric-overlay">
      <div className="container-site relative z-10">
        {/* Başlık */}
        <div className="text-center mb-10">
          <span className="badge badge-gold mb-4">Ürün Kategorileri</span>
          <h2 className="section-title mb-4">
            Cami Halısı Koleksiyonları
          </h2>
          <div className="gold-line mx-auto mb-4" />
          <p className="section-subtitle mx-auto">
            Her caminin ihtiyacına ve bütçesine uygun, özel üretim halı çözümleri.
            Akrilik, yün, polipropilen ve polyamid seçenekleriyle saflı, göbekli veya seccadeli tasarım.
          </p>
        </div>

        {/* Ana Kategori Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {CATEGORIES.map((cat) => (
            <div key={cat.slug} className="group card card-gold-border overflow-hidden flex flex-col">
              {/* Görsel */}
              <Link href={`${prefix}/kategori/${cat.slug}`} className="block">
                <div className="relative h-44 overflow-hidden bg-[#E0F7FA]">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <span className="absolute top-3 left-3 badge badge-gold text-xs">{cat.badge}</span>
                  <h3 className="absolute bottom-3 left-3 right-3 text-white text-lg font-bold leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {cat.title}
                  </h3>
                </div>
              </Link>

              {/* İçerik */}
              <div className="p-5 flex flex-col flex-1">
                <p className="text-sm text-[#6B6355] leading-relaxed mb-4">{cat.description}</p>

                {/* Özellik etiketleri */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {cat.features.map((f) => (
                    <span key={f} className="badge badge-green text-xs normal-case tracking-normal">{f}</span>
                  ))}
                </div>

                {/* Alt kategoriler — doğrudan görünür */}
                <div className="border-t border-[#E0F7FA] pt-3 mb-3">
                  <p className="text-xs font-semibold text-[#C9972B] uppercase tracking-widest mb-2">Alt Kategoriler</p>
                  <div className="grid grid-cols-1 gap-1">
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`${prefix}/kategori/${sub.slug}`}
                        className="flex items-center gap-1.5 py-1.5 px-2 text-xs font-medium text-[#1A1A1A] hover:text-[#006064] hover:bg-[#F0FDFE] rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-3 h-3 text-[#C9972B] flex-shrink-0" />
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Ana kategori CTA */}
                <Link
                  href={`${prefix}/kategori/${cat.slug}`}
                  className="flex items-center gap-1 text-[#006064] font-semibold text-sm hover:gap-2 transition-all mt-auto"
                >
                  Tüm {cat.title} Modelleri
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Axminster Özel Sipariş */}
        <div className="bg-gradient-to-r from-[#006064] to-[#0097A7] rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-64 relative h-48 md:h-auto flex-shrink-0">
              <Image src={SPECIAL.image} alt={SPECIAL.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 256px" />
              <div className="absolute inset-0 bg-black/30" />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <span className="badge bg-[#C9972B]/20 text-[#E4B84A] border border-[#C9972B]/30 mb-3 w-fit">{SPECIAL.badge}</span>
              <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {SPECIAL.title}
              </h3>
              <p className="text-white/70 text-sm mb-5 leading-relaxed">{SPECIAL.description}</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {SPECIAL.features.map((f) => (
                  <span key={f} className="text-xs bg-white/10 text-white/80 border border-white/20 px-2.5 py-1 rounded-full">{f}</span>
                ))}
              </div>
              <Link href={`${prefix}/kategori/${SPECIAL.slug}`} className="btn btn-gold w-fit text-sm">
                Özel Tasarım İncele
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Halı Altı Malzemeleri Bağlantısı */}
        <div className="mt-6 bg-white border border-[#B2EBF2] rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-[#006064] text-lg mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Halı Altı Malzemeleri
              </h3>
              <p className="text-sm text-[#6B6355]">
                Kauçuk altlıklar ve keçe altlıklar — halınızın ömrünü uzatır, ses ve ısı yalıtımı sağlar.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {["Kauçuk Altlık", "TredMOR™ Berber Supreme", "600 gr Keçe", "1000 gr Keçe", "1200 gr Keçe"].map((item) => (
                  <span key={item} className="text-xs bg-[#F0FDFE] border border-[#B2EBF2] text-[#6B6355] px-2.5 py-1 rounded-full">{item}</span>
                ))}
              </div>
            </div>
            <Link href={`${prefix}/kategori/kece-cami-halisi-altligi`} className="flex-shrink-0 btn btn-outline text-sm">
              Halı Altı Ürünleri
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

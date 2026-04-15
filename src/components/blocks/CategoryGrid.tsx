import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    slug: "akrilik-cami-halisi",
    title: "Akrilik Cami Halısı",
    description:
      "Parlak renkleri, yumuşak dokusu ve ekonomik fiyatıyla en çok tercih edilen halı türü. Uzun yıllar solmayan renkler.",
    badge: "En Çok Satan",
    image: "/images/cami-1.png",
    color: "#1B4332",
    features: ["Solmaz Renk", "Yumuşak Doku", "Ekonomik"],
  },
  {
    slug: "yun-cami-halisi",
    title: "Yün Cami Halısı",
    description:
      "Doğal yünün sıcaklığı ve dayanıklılığıyla ibadethaneye özel lüks. Neme ve kokuya karşı doğal direnç.",
    badge: "Premium",
    image: "/images/cami-2.png",
    color: "#2D6A4F",
    features: ["%100 Doğal", "Isı Yalıtımı", "Uzun Ömür"],
  },
  {
    slug: "polipropilen-cami-halisi",
    title: "Polipropilen Halısı",
    description:
      "Yüksek trafik alanları için üretilmiş, kolay temizlenen ve leke tutmayan modern teknolojiyle üretim.",
    badge: "Dayanıklı",
    image: "/images/cami-3.png",
    color: "#1B4332",
    features: ["Kolay Temizlik", "Leke Tutmaz", "Yüksek Trafik"],
  },
  {
    slug: "polyamid-cami-halisi",
    title: "Polyamid Cami Halısı",
    description:
      "Sentetik liflerin en kalitelisi. Yüksek aşınma direnci ve canlı renklerle büyük camilerin tercihi.",
    badge: "Profesyonel",
    image: "/images/cami-4.png",
    color: "#2D6A4F",
    features: ["Aşınmaz", "Canlı Renkler", "Büyük Hacim"],
  },
];

interface CategoryGridProps {
  locale: string;
}

export default function CategoryGrid({ locale }: CategoryGridProps) {
  const prefix = locale === "tr" ? "" : `/${locale}`;

  return (
    <section className="section bg-[#F7F3EC] geometric-overlay">
      <div className="container-site relative z-10">
        {/* Başlık */}
        <div className="text-center mb-14">
          <span className="badge badge-gold mb-4">Ürün Kategorileri</span>
          <h2 className="section-title mb-4">
            İbadete Özel Halı Koleksiyonları
          </h2>
          <div className="gold-line mx-auto mb-4" />
          <p className="section-subtitle mx-auto">
            Her caminin ihtiyacına ve bütçesine uygun, özel üretim halı
            çözümleri. Türkiye'nin dört bir yanına teslim.
          </p>
        </div>

        {/* Kategori Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`${prefix}/kategori/${cat.slug}`}
              className="group card card-gold-border overflow-hidden flex flex-col"
            >
              {/* Görsel */}
              <div className="relative h-56 overflow-hidden bg-[#EDE8DF]">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Koyu overlay — kontrast garantisi */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Badge */}
                <span className="absolute top-4 left-4 badge badge-gold text-xs">
                  {cat.badge}
                </span>

                {/* Başlık overlay'de */}
                <h3
                  className="absolute bottom-4 left-4 right-4 text-white text-xl font-bold leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {cat.title}
                </h3>
              </div>

              {/* İçerik */}
              <div className="p-6 flex flex-col flex-1">
                <p className="text-sm text-[#6B6355] leading-relaxed mb-4 flex-1">
                  {cat.description}
                </p>

                {/* Özellik etiketleri */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {cat.features.map((f) => (
                    <span
                      key={f}
                      className="badge badge-green text-xs normal-case tracking-normal"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-1 text-[#1B4332] font-semibold text-sm group-hover:gap-2 transition-all">
                  Detaylı İncele
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

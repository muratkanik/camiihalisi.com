import Link from "next/link";
import { ArrowRight } from "lucide-react";

const PRODUCTS = [
  {
    slug:  "akrilik-cami-halisi",
    label: "Saflı Turkuaz Akrilik",
    image: "/images/cami-3.png",   // turkuaz saflı akrilik
  },
  {
    slug:  "polipropilen-cami-halisi",
    label: "Göbekli Cami Halısı",
    image: "/images/gobekli-cami-halisi.png",
  },
  {
    slug:  "yun-cami-halisi",
    label: "Büyük Cami Desenli",
    image: "/images/cami-4.png",   // turkuaz büyük cami
  },
  {
    slug:  "ozel-desen-axminster-cami-halisi",
    label: "Özel Desen Axminster",
    image: "/images/ozel-cami-halisi.png",
  },
];

interface Props {
  locale?: string;
}

export default function CategoryShowcase({ locale = "tr" }: Props) {
  const prefix = locale === "tr" ? "" : `/${locale}`;

  return (
    <section id="kategoriler" className="section bg-[#E8F7F8]">
      <div className="container-site">
        {/* Başlık */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0D1B1E] leading-tight">
            Hangi Cami Halısı<br className="hidden sm:block" /> Sizin İçin Uygun?
          </h2>
        </div>

        {/* Ürün Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {PRODUCTS.map((p) => (
            <Link
              key={p.slug}
              href={`${prefix}/kategori/${p.slug}`}
              className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-[#B2EBF2] hover:border-[#006064] hover:shadow-lg transition-all"
            >
              <div className="aspect-square overflow-hidden bg-[#F0FDFE]">
                <img
                  src={p.image}
                  alt={p.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="px-3 py-2.5 text-center">
                <p className="text-sm font-semibold text-[#0D1B1E] leading-snug">{p.label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA butonu */}
        <div className="flex justify-center">
          <Link
            href={`${prefix}/kategori/akrilik-cami-halisi`}
            className="inline-flex items-center gap-2 bg-[#006064] hover:bg-[#00494D] text-white font-bold px-8 py-3.5 rounded-full transition-all text-base shadow-md hover:shadow-lg"
          >
            Tüm Halı Modellerini Gör
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Navigation from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import GalleryGrid from "./GalleryGrid";
import { localizedMetadata } from "@/lib/seo";

const SITE_URL = "https://camiihalisi.com";

const TITLES = {
  tr: "Cami Halısı Galerisi | Asil Halı Fotoğraflar ve Desen Kataloğu",
  en: "Mosque Carpet Gallery | Asil Halı Photos and Pattern Catalogue",
  de: "Moscheeteppich-Galerie | Asil Halı Fotos und Musterkatalog",
  fr: "Galerie de Tapis de Mosquée | Photos et Catalogue de Motifs Asil Halı",
  ar: "معرض سجاد المساجد | صور وكتالوج أنماط أصيل هالي",
  ru: "Галерея Ковров для Мечетей | Фото и Каталог Узоров Asil Halı",
};

const DESCRIPTIONS = {
  tr: "Asil Halı A.Ş. cami halısı galeri sayfası. Akrilik, yün, polipropilen ve polyamid cami halısı fotoğrafları, desen kataloğu ve tamamlanan referans projeler.",
  en: "Asil Halı A.Ş. mosque carpet gallery. Acrylic, wool, polypropylene and polyamide mosque carpet photos, pattern catalogue and completed reference projects.",
  de: "Moscheeteppich-Galerie von Asil Halı A.Ş. Fotos, Musterkatalog und abgeschlossene Referenzprojekte für Acryl-, Woll-, Polypropylen- und Polyamid-Moscheeteppiche.",
  fr: "Galerie de tapis de mosquée d'Asil Halı A.Ş. Photos, catalogue de motifs et projets de référence achevés pour tapis acrylique, laine, polypropylène et polyamide.",
  ar: "معرض سجاد المساجد لشركة أصيل هالي. صور سجاد المساجد الأكريليك والصوف والبولي بروبيلين والبولي أميد وكتالوج الأنماط والمشاريع المرجعية المكتملة.",
  ru: "Галерея ковров для мечетей Asil Halı A.Ş. Фотографии акриловых, шерстяных, полипропиленовых и полиамидных ковров, каталог узоров и завершённые референс-проекты.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata({
    path: "/galeri",
    locale,
    titles: TITLES,
    descriptions: DESCRIPTIONS,
    ogImage: `${SITE_URL}/images/cami-hero.png`,
  });
}

// Server component wrapper
export default async function GaleriPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const prefix = locale === "tr" ? "" : `/${locale}`;

  return (
    <>
      <Navigation locale={locale} />

      <main id="main-content">
        {/* Hero */}
        <section className="bg-[#0097A7] py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C9972B' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")` }} />
          <div className="container-site relative z-10">
            <nav className="flex items-center gap-2 text-sm text-white/50 mb-6" aria-label="Breadcrumb">
              <Link href={`${prefix}/`} className="hover:text-white transition-colors">Ana Sayfa</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#E4B84A]">Galeri</span>
            </nav>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Fotoğraf Galerisi
            </h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Asil Halı'nın gerçekleştirdiği cami halısı projelerinden görüntüler.
            </p>
          </div>
        </section>

        <GalleryGrid />
      </main>

      <Footer locale={locale} />
    </>
  );
}

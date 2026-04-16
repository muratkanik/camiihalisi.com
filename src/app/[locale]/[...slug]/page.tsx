import DynamicPageRenderer from "@/components/DynamicPageRenderer";
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from "next/navigation";
import Link from 'next/link';
import type { Metadata } from 'next';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug.join("/");
  
  const page = await prisma.page.findUnique({
    where: { slug: slugPath }
  });

  if (!page) {
    return { title: "Sayfa Bulunamadı - Asil Halı" };
  }

  return {
    title: `${page.titleInternal} | Asil Halı`,
    description: `Kaliteli dokuması ve estetik desenleriyle ${page.titleInternal.toLowerCase()} halı modellerimizi inceleyin. Camilere özel üretim Asil Halı farkı.`,
    openGraph: {
      title: `${page.titleInternal} | Asil Halı`,
      description: `Premium kalite ${page.titleInternal} çeşitlerimiz hakkında detaylı bilgi.`,
      url: `https://www.camiihalisi.com/kategori/${slugPath}`,
      siteName: 'Asil Halı A.Ş.',
      locale: 'tr_TR',
      type: 'website',
    }
  };
}

export default async function DynamicSlugPage({ params }: { params: Promise<{ locale: string, slug: string[] }> }) {
  const { locale, slug } = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const slugPath = slug.join("/");

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-secondary selection:text-secondary-foreground">
      <nav className="fixed top-0 w-full z-50 glass-panel px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-border">
        <Link href={`/${locale}`} className="text-2xl font-bold flex items-center gap-2">
          <span className="text-primary dark:text-primary">CAMİİ</span>
          <span className="text-secondary font-light">HALISI</span>
        </Link>
        <div className="flex gap-4 md:gap-8 overflow-x-auto w-full md:w-auto text-sm font-medium tracking-wide justify-center md:pb-0 pb-2 scrollbar-hide">
          <Link href={`/${locale}/kategori/akrilik-cami-halisi`} className="whitespace-nowrap hover:text-secondary transition-colors text-primary font-semibold">Akrilik</Link>
          <Link href={`/${locale}/kategori/yun-cami-halisi`} className="whitespace-nowrap hover:text-secondary transition-colors text-primary font-semibold">Yün</Link>
          <Link href={`/${locale}/iletisim`} className="whitespace-nowrap hover:text-secondary transition-colors text-primary font-semibold">İletişim</Link>
        </div>
      </nav>

      {/* Main Dynamic Content Rendered from Prisma */}
      <div className="pt-32 md:pt-28">
        <DynamicPageRenderer slug={slugPath} locale={locale} />
      </div>

      <div className="md:hidden fixed bottom-0 w-full glass-panel border-t border-secondary/20 z-50 px-2 py-3 flex justify-around items-center text-xs text-center font-medium bg-background/95">
        <Link href={`/${locale}/hakkimizda`} className="flex flex-col items-center opacity-80 hover:opacity-100 hover:text-primary">
          <span>Hakkımızda</span>
        </Link>
        <Link href={`/${locale}/iletisim`} className="flex flex-col items-center opacity-80 hover:opacity-100 hover:text-primary">
          <span>İletişim</span>
        </Link>
      </div>
    </div>
  );
}

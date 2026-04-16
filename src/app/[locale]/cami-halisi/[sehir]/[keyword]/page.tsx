import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { ChevronRight, ExternalLink, MessageCircle, Check } from "lucide-react";

import Navigation from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import CTASection from "@/components/blocks/CTASection";
import { getCityBySlug } from "@/lib/cities";

const SITE_URL = "https://camiihalisi.com";
const WA_URL = "https://wa.me/905323467939?text=Merhaba%2C%20cami%20hal%C4%B1s%C4%B1%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.";

async function getKeyword(citySlug: string, keywordSlug: string) {
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const kw = await prisma.cityKeyword.findUnique({
      where: { citySlug_keywordSlug: { citySlug, keywordSlug } },
    });
    await prisma.$disconnect();
    return kw;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const keywords = await prisma.cityKeyword.findMany({
      where: { isActive: true },
      select: { citySlug: true, keywordSlug: true },
    });
    await prisma.$disconnect();
    return keywords.flatMap(({ citySlug, keywordSlug }) =>
      ["tr"].map((locale) => ({ locale, sehir: citySlug, keyword: keywordSlug }))
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; sehir: string; keyword: string }>;
}): Promise<Metadata> {
  const { sehir, keyword } = await params;
  const city = getCityBySlug(sehir);
  const kw = await getKeyword(sehir, keyword);

  if (!city || !kw) return { title: "Sayfa Bulunamadı" };

  const title = `${city.name} ${kw.keyword} | Asil Halı`;
  const desc = `${city.name} için ${kw.keyword} çözümleri. Asil Halı A.Ş. – 50+ yıl tecrübe, 10.000+ cami referansı. Özel ölçü üretim, hızlı teslimat.`;

  return {
    title,
    description: desc,
    keywords: [
      `${city.name} ${kw.keyword}`,
      `${city.name} cami halısı`,
      kw.keyword,
      "Asil Halı",
    ],
    alternates: { canonical: `${SITE_URL}/cami-halisi/${sehir}/${keyword}` },
    openGraph: { title, description: desc, url: `${SITE_URL}/cami-halisi/${sehir}/${keyword}` },
  };
}

export default async function CityKeywordPage({
  params,
}: {
  params: Promise<{ locale: string; sehir: string; keyword: string }>;
}) {
  const { locale, sehir, keyword } = await params;
  setRequestLocale(locale);

  const city = getCityBySlug(sehir);
  const kw = await getKeyword(sehir, keyword);

  if (!city || !kw || !kw.isActive) notFound();

  const prefix = locale === "tr" ? "" : `/${locale}`;

  return (
    <>
      <Navigation locale={locale} />

      <main id="main-content">
        {/* ── Hero ── */}
        <section className="bg-[#006064] py-20 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0l8 13.9h16v16L77.1 40 64 46.1v16H48L40 80 32 62.1H16v-16L2.9 40 16 33.9v-16h16z' fill='%23C9972B' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: "80px 80px",
            }}
          />
          <div className="container-site relative z-10">
            <nav className="flex items-center gap-2 text-sm text-white/50 mb-6 flex-wrap" aria-label="Breadcrumb">
              <Link href={`${prefix}/`} className="hover:text-white transition-colors">Ana Sayfa</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href={`${prefix}/cami-halisi`} className="hover:text-white transition-colors">Cami Halısı</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href={`${prefix}/cami-halisi/${sehir}`} className="hover:text-white transition-colors">{city.name}</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#E4B84A]">{kw.keyword}</span>
            </nav>
            <span className="badge bg-[#C9972B]/20 text-[#E4B84A] border border-[#C9972B]/30 mb-4">
              {city.name}
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-3xl"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {city.name} {kw.keyword}
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              {city.name} ve çevresi için {kw.keyword.toLowerCase()} tedariki, üretim ve teslimat.
              Asil Halı A.Ş. uzman ekibiyle yanınızda.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3 px-6 rounded-xl transition-colors">
                <MessageCircle className="w-4 h-4" />
                WhatsApp ile Yazın
              </a>
              <Link href={`${prefix}/cami-halisi/${sehir}`}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
                {city.name} Cami Halısı →
              </Link>
            </div>
          </div>
        </section>

        {/* ── İçerik ── */}
        <section className="section bg-[#F0FDFE]">
          <div className="container-site">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <span className="badge badge-gold mb-4">{city.name} Hizmeti</span>
                <h2 className="section-title mb-4">
                  {city.name}'da {kw.keyword} için Doğru Adres
                </h2>
                <div className="gold-line mb-6" />
                <div className="space-y-4 text-[#4A4035] leading-relaxed">
                  <p>
                    Asil Halı A.Ş. olarak {city.name} başta olmak üzere tüm Türkiye'ye
                    {" "}{kw.keyword.toLowerCase()} konusunda profesyonel çözümler sunuyoruz.
                    50+ yıllık deneyimimiz ve 10.000'i aşkın cami referansımızla projenizin
                    her aşamasında yanınızdayız.
                  </p>
                  <p>
                    {city.name} için özel ölçü üretim, tasarım danışmanlığı ve hızlı teslimat
                    hizmetlerimizden yararlanmak için bizimle iletişime geçin.
                    Uzman ekibimiz caminizin ihtiyaçlarını değerlendirerek size en uygun
                    çözümü sunacaktır.
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-3">
                  {[
                    "Özel ölçü üretim — caminizin tam ebadında",
                    "Ücretsiz keşif ve tasarım danışmanlığı",
                    `${city.name} geneli hızlı teslimat`,
                    "5-10 yıl ürün garantisi",
                    "Profesyonel döşeme ve montaj desteği",
                    "10.000+ referans cami",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#006064] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-[#4A4035]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* İletişim Kartı */}
              <div className="bg-white rounded-2xl border border-[#B2EBF2] p-8 shadow-sm sticky top-24">
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Teklif Alın
                </h3>
                <p className="text-sm text-[#6B6355] mb-6">
                  {city.name} için {kw.keyword.toLowerCase()} fiyat teklifi ve detaylı bilgi
                </p>
                <div className="space-y-3">
                  <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3.5 px-6 rounded-xl transition-colors w-full">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp ile Yazın
                  </a>
                  <a href="/api/r?to=https%3A%2F%2Fwww.asilhali.com.tr%3Futm_source%3Dcamiihalisi%26utm_medium%3Dcity-keyword&from=city-keyword&label=main-site&cat=outbound"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 btn btn-gold w-full">
                    asilhali.com.tr'yi Ziyaret Et
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <Link href={`${prefix}/cami-halisi/${sehir}`}
                    className="block text-center py-3 text-sm text-[#6B6355] hover:text-[#006064] transition-colors">
                    ← {city.name} ana sayfasına dön
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CTASection
          variant="green"
          title={`${city.name} Caminizin Halı Projesinde Yanınızdayız`}
          subtitle={`50 yılı aşkın deneyimimiz ve 10.000'i aşkın cami referansımızla, ${city.name} için en iyi çözümü sunuyoruz.`}
        />
      </main>

      <Footer locale={locale} />
    </>
  );
}

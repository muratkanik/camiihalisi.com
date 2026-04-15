import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ExternalLink, MessageCircle, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CTASection from "@/components/blocks/CTASection";
import { INTL_CITIES, getIntlCitiesForLocale } from "@/lib/cities-international";

const SITE_URL = "https://camiihalisi.com";
const MAIN_SITE_URL = "https://www.asilhali.com.tr?utm_source=camiihalisi&utm_medium=intl-city";
const WA_URL = "https://wa.me/905325551234?text=Hello%2C%20I%20would%20like%20information%20about%20mosque%20carpets.";

function getCityBySlug(slug: string) {
  return INTL_CITIES.find((c) => c.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; sehir: string }>;
}): Promise<Metadata> {
  const { locale, sehir } = await params;
  const city = getCityBySlug(sehir);
  if (!city) return { title: "Page Not Found" };

  if (locale === "ar") {
    const cityName = city.nameAr || city.name;
    const countryName = city.countryAr || city.country;
    return {
      title: `سجادة مسجد ${cityName} | ${countryName} – أصيل هالي`,
      description: `سجاد مساجد ${cityName}، ${countryName}. أكريليك، صوف، بولي بروبيلين. تصنيع حسب الطلب، شحن دولي. أصيل هالي تركيا.`,
      alternates: { canonical: `${SITE_URL}/ar/mosque-carpet/${sehir}` },
    };
  }

  return {
    title: `${city.name} Mosque Carpet | Turkey Manufacturer – Asil Hali`,
    description: `Mosque carpet for ${city.name}, ${city.country}. Acrylic, wool, polypropylene and polyamide options. Custom size production, international shipping. Asil Hali Turkey.`,
    keywords: [
      `${city.name} mosque carpet`,
      `${city.name} mosque rug`,
      `mosque carpet ${city.name}`,
      `prayer carpet ${city.name}`,
      "mosque carpet turkey",
      "Asil Hali",
    ],
    alternates: { canonical: `${SITE_URL}/en/mosque-carpet/${sehir}` },
  };
}

export function generateStaticParams() {
  const results: { locale: string; sehir: string }[] = [];
  for (const city of INTL_CITIES) {
    for (const locale of city.locales) {
      results.push({ locale, sehir: city.slug });
    }
  }
  return results;
}

const CARPET_TYPES_EN = [
  { slug: "akrilik-cami-halisi", name: "Acrylic Mosque Carpet", desc: "Economic, UV-resistant, 15-20 year lifespan" },
  { slug: "yun-cami-halisi", name: "Wool Mosque Carpet", desc: "100% natural, thermal insulation, 25-30 years" },
  { slug: "polipropilen-cami-halisi", name: "Polypropylene Mosque Carpet", desc: "Water-resistant, easy cleaning" },
  { slug: "polyamid-cami-halisi", name: "Polyamide Mosque Carpet", desc: "Highest abrasion resistance, large mosques" },
  { slug: "ozel-desen-axminster-cami-halisi", name: "Custom Axminster Mosque Carpet", desc: "Unlimited colors, unique design per mosque" },
];

const CARPET_TYPES_AR = [
  { slug: "akrilik-cami-halisi", name: "سجادة مسجد أكريليك", desc: "اقتصادي، مقاوم للأشعة فوق البنفسجية، عمر 15-20 سنة" },
  { slug: "yun-cami-halisi", name: "سجادة مسجد صوف", desc: "صوف طبيعي 100%، عزل حراري، 25-30 سنة" },
  { slug: "polipropilen-cami-halisi", name: "سجادة مسجد بولي بروبيلين", desc: "مقاومة للماء، سهل التنظيف" },
  { slug: "polyamid-cami-halisi", name: "سجادة مسجد بولي أميد", desc: "أعلى مقاومة للتآكل، للمساجد الكبيرة" },
  { slug: "ozel-desen-axminster-cami-halisi", name: "سجادة أكسمينستر مخصصة", desc: "ألوان غير محدودة، تصميم فريد لكل مسجد" },
];

const ADVANTAGES_EN = [
  "Custom size production for any mosque",
  "Free design consultation and 3D visualization",
  "International shipping worldwide",
  "5–10 year product warranty",
  "Bfl-s1 fire safety certified",
  "50+ years of mosque carpet expertise",
  "10,000+ mosque references",
  "Professional installation support",
];

const ADVANTAGES_AR = [
  "تصنيع بقياسات مخصصة لأي مسجد",
  "استشارة تصميم مجانية ومعاينة ثلاثية الأبعاد",
  "شحن دولي إلى جميع أنحاء العالم",
  "ضمان المنتج 5-10 سنوات",
  "حاصلة على شهادة سلامة من الحريق Bfl-s1",
  "أكثر من 50 عاماً من الخبرة في سجاد المساجد",
  "أكثر من 10,000 مسجد مرجعي",
  "دعم التركيب الاحترافي",
];

export default async function IntlMosqueCarpetPage({
  params,
}: {
  params: Promise<{ locale: string; sehir: string }>;
}) {
  const { locale, sehir } = await params;
  setRequestLocale(locale);

  const city = getCityBySlug(sehir);
  if (!city || !city.locales.includes(locale)) notFound();

  const prefix = locale === "tr" ? "" : `/${locale}`;
  const isAr = locale === "ar";

  const cityName = isAr ? (city.nameAr || city.name) : city.name;
  const countryName = isAr ? (city.countryAr || city.country) : city.country;
  const carpetTypes = isAr ? CARPET_TYPES_AR : CARPET_TYPES_EN;
  const advantages = isAr ? ADVANTAGES_AR : ADVANTAGES_EN;

  const waUrl = isAr
    ? "https://wa.me/905325551234?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D9%85%D8%B9%D9%84%D9%88%D9%85%D8%A7%D8%AA%20%D8%B9%D9%86%20%D8%B3%D8%AC%D8%A7%D8%AF%20%D8%A7%D9%84%D9%85%D8%B3%D8%A7%D8%AC%D8%AF."
    : WA_URL;

  const h1 = isAr
    ? `سجادة مسجد ${cityName}`
    : `${city.name} Mosque Carpet`;

  const subtitle = isAr
    ? `توريد وتركيب سجاد المساجد في ${cityName}، ${countryName}. شركة أصيل هالي تركيا — خبرة أكثر من 50 عاماً، شحن دولي.`
    : `Mosque carpet supply and installation for ${city.name}, ${city.country}. Asil Hali Turkey — 50+ years expertise, worldwide shipping.`;

  return (
    <>
      <Navigation locale={locale} />
      <main id="main-content">
        {/* Hero */}
        <section className="bg-[#1B4332] py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C9972B' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")` }} />
          <div className="container-site relative z-10">
            <nav className="flex items-center gap-2 text-sm text-white/50 mb-6" aria-label="Breadcrumb">
              <Link href={`${prefix}/`} className="hover:text-white transition-colors">
                {isAr ? "الرئيسية" : "Home"}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#E4B84A]">{h1}</span>
            </nav>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {h1}
                </h1>
                <p className="text-lg text-white/80 mb-6 leading-relaxed">{subtitle}</p>
                <div className="flex flex-wrap gap-3">
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3 px-5 rounded-xl transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    {isAr ? "واتساب" : "WhatsApp"}
                  </a>
                  <a href={MAIN_SITE_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#C9972B] hover:bg-[#B8861F] text-[#0D2418] font-bold py-3 px-5 rounded-xl transition-colors">
                    {isAr ? "احصل على عرض سعر" : "Get Quote"}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-[#E4B84A] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {isAr ? `ملخص خدماتنا في ${cityName}` : `Our Service for ${city.name}`}
                </h2>
                <div className="space-y-2.5 text-sm text-white/80">
                  {[
                    { label: isAr ? "المدينة" : "City", value: `${cityName}, ${countryName}` },
                    { label: isAr ? "خيارات المواد" : "Material Options", value: isAr ? "4 خيارات مختلفة" : "4 Different Materials" },
                    { label: isAr ? "نوع الإنتاج" : "Production Type", value: isAr ? "بقياسات مخصصة" : "Custom Size" },
                    { label: isAr ? "وقت التسليم" : "Delivery Time", value: isAr ? "3-8 أسابيع" : "3–8 Weeks" },
                    { label: isAr ? "الضمان" : "Warranty", value: isAr ? "5-10 سنوات" : "5–10 Years" },
                    { label: isAr ? "درجة مقاومة الحريق" : "Fire Class", value: "Bfl-s1" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span>{item.label}:</span>
                      <span className="font-semibold text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="section bg-[#F7F3EC]">
          <div className="container-site">
            <div className="text-center mb-10">
              <h2 className="section-title mb-3">
                {isAr ? `أنواع سجاد المساجد لـ${cityName}` : `Mosque Carpet Types for ${city.name}`}
              </h2>
              <div className="gold-line mx-auto mb-4" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {carpetTypes.map((carpet) => (
                <Link key={carpet.slug} href={`${prefix}/kategori/${carpet.slug}`} className="group bg-white rounded-xl border border-[#DDD8CE] p-5 hover:border-[#C9972B]/40 hover:shadow-md transition-all">
                  <h3 className="font-bold text-[#1B4332] mb-2 group-hover:text-[#C9972B] transition-colors">{carpet.name}</h3>
                  <p className="text-sm text-[#6B6355]">{carpet.desc}</p>
                </Link>
              ))}
            </div>

            {/* Advantages */}
            <div className="bg-white rounded-2xl border border-[#DDD8CE] p-8">
              <h2 className="text-2xl font-bold text-[#1B4332] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {isAr ? "لماذا أصيل هالي؟" : "Why Asil Hali for Your Mosque?"}
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {advantages.map((adv) => (
                  <div key={adv} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#1B4332]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#1B4332]" />
                    </div>
                    <span className="text-sm text-[#1A1A1A]">{adv}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <CTASection
          variant="green"
          title={isAr ? `احصل على عرض سعر مجاني لمسجدك في ${cityName}` : `Get a Free Quote for Your Mosque in ${city.name}`}
          subtitle={isAr ? "خبراء أصيل هالي يقدمون أفضل حلول سجاد المساجد لجميع أحجام المساجد." : "Asil Hali experts provide the best mosque carpet solutions for mosques of all sizes."}
        />
      </main>
      <Footer locale={locale} />
    </>
  );
}

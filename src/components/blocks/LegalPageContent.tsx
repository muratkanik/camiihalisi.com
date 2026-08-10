import prisma from "@/lib/prisma";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Navigation from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";

type Locale = "tr" | "en" | "de" | "fr" | "ar" | "ru";

type LegalLocaleContent = { title: string; updated: string; body: string };
type LegalData = Record<string, Record<string, LegalLocaleContent>>;

const HOME_LABEL: Record<Locale, string> = {
  tr: "Ana Sayfa",
  en: "Home",
  de: "Startseite",
  fr: "Accueil",
  ar: "الرئيسية",
  ru: "Главная",
};

// Renders "## Heading" blocks as <h2>, remaining paragraphs (blank-line separated) as <p>.
function renderBody(body: string) {
  const blocks = body.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return blocks.map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="text-xl font-bold text-[#0097A7] mt-8 mb-3 first:mt-0">
          {block.replace(/^##\s*/, "")}
        </h2>
      );
    }
    return (
      <p key={i} className="text-[#4A4035] leading-relaxed mb-4">
        {block}
      </p>
    );
  });
}

export default async function LegalPageContent({
  legalKey,
  locale,
}: {
  legalKey: "gizlilik" | "kullanim-sartlari";
  locale: string;
}) {
  const activeLocale: Locale = (["tr", "en", "de", "fr", "ar", "ru"] as const).includes(locale as Locale)
    ? (locale as Locale)
    : "tr";
  const prefix = activeLocale === "tr" ? "" : `/${activeLocale}`;

  let content: LegalLocaleContent | null = null;
  try {
    const row = await prisma.setting.findUnique({ where: { key: "legal_pages_data" } });
    if (row) {
      const data = JSON.parse(row.value) as LegalData;
      content = data[legalKey]?.[activeLocale] ?? data[legalKey]?.tr ?? null;
    }
  } catch (e) {
    console.error(e);
  }

  return (
    <>
      <Navigation locale={locale} />
      <main id="main-content">
        <section className="bg-[#0097A7] py-16 relative overflow-hidden">
          <div className="container-site relative z-10">
            <nav className="flex items-center gap-2 text-sm text-white/50 mb-6" aria-label="Breadcrumb">
              <Link href={`${prefix}/`} className="hover:text-white transition-colors">
                {HOME_LABEL[activeLocale]}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#E4B84A]">{content?.title ?? legalKey}</span>
            </nav>
            <h1
              className="text-3xl md:text-5xl font-bold text-white mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {content?.title ?? legalKey}
            </h1>
            {content?.updated && <p className="text-sm text-white/60">{content.updated}</p>}
          </div>
        </section>

        <section className="section bg-white">
          <div className="container-site max-w-3xl">
            {content ? (
              renderBody(content.body)
            ) : (
              <p className="text-[#4A4035]">İçerik hazırlanıyor.</p>
            )}
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}

import Link from "next/link";
import { ExternalLink, Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { getSettings, buildTrackedWaUrl, buildTrackedMainSiteUrl } from "@/lib/settings";
import { getTranslations } from "next-intl/server";

interface FooterProps {
  locale: string;
}

export default async function Footer({ locale }: FooterProps) {
  const [settings, t, tNav] = await Promise.all([
    getSettings(),
    getTranslations({ locale, namespace: "footer" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  const MAIN_SITE_URL = buildTrackedMainSiteUrl(settings, "footer", "main-site");
  const WA_URL = buildTrackedWaUrl(settings, "footer", "whatsapp");
  const INSTAGRAM_URL = settings.instagramUrl;
  const LINKEDIN_URL = settings.linkedinUrl;
  const prefix = locale === "tr" ? "" : `/${locale}`;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#003B40] text-[#F0FDFE]">
      {/* ── Ana Siteye Yönlendirme Bandı ── */}
      <div className="border-b border-[#C9972B]/30 py-6">
        <div className="container-site text-center">
          <p className="text-sm text-[#C9972B]/80 mb-2 uppercase tracking-widest font-semibold">
            {t("officialSite")}
          </p>
          <a
            href={MAIN_SITE_URL}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 text-xl font-bold text-white hover:text-[#E4B84A] transition-colors"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            www.asilhali.com.tr
            <ExternalLink className="w-5 h-5" />
          </a>
          <p className="mt-2 text-sm text-[#F0FDFE]/60">
            {t("siteTagline")}
          </p>
        </div>
      </div>

      {/* ── Footer İçerik ── */}
      <div className="container-site py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Sütun 1: Marka */}
          <div className="lg:col-span-1">
            {/* Footer Logo */}
            <div className="flex flex-col items-start mb-4">
              <svg width="148" height="14" viewBox="0 0 148 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <line x1="2" y1="10" x2="52" y2="10" stroke="#C9972B" strokeWidth="0.75" strokeLinecap="round"/>
                <path d="M57 13 C57 10 55.5 8.5 55.5 7 C55.5 5.5 57 4.5 57 4.5 C57 4.5 58.5 5.5 58.5 7 C58.5 8.5 57 10 57 13Z" fill="#C9972B"/>
                <circle cx="57" cy="3.5" r="1.2" fill="#C9972B"/>
                <path d="M74 13 C74 9 71.5 7 71.5 5 C71.5 3 74 1.5 74 1.5 C74 1.5 76.5 3 76.5 5 C76.5 7 74 9 74 13Z" fill="#C9972B"/>
                <circle cx="74" cy="0.8" r="1.5" fill="#C9972B"/>
                <path d="M91 13 C91 10 89.5 8.5 89.5 7 C89.5 5.5 91 4.5 91 4.5 C91 4.5 92.5 5.5 92.5 7 C92.5 8.5 91 10 91 13Z" fill="#C9972B"/>
                <circle cx="91" cy="3.5" r="1.2" fill="#C9972B"/>
                <line x1="96" y1="10" x2="146" y2="10" stroke="#C9972B" strokeWidth="0.75" strokeLinecap="round"/>
              </svg>
              <div className="font-bold text-white text-xl leading-none mt-1 tracking-[0.12em]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                CAMİİ HALISI
              </div>
              <div className="text-[9px] font-medium tracking-widest mt-0.5" style={{ color: "#C9972B", fontFamily: "'Cormorant Garamond', serif" }}>
                {tNav("logoTagline")}
              </div>
            </div>
            <p className="text-sm text-[#F0FDFE]/70 leading-relaxed mb-4">
              {t("infoPortal")}
            </p>
            <div className="border-l-2 border-[#C9972B]/50 pl-3 mt-4">
              <p className="text-xs text-[#F0FDFE]/50 italic leading-relaxed">
                &ldquo;{t("quran")}&rdquo;
              </p>
              <p className="text-[10px] text-[#C9972B]/70 mt-1">{t("quranRef")}</p>
            </div>
          </div>

          {/* Sütun 2: Ürünler */}
          <div>
            <h3 className="text-sm font-bold text-[#C9972B] uppercase tracking-widest mb-4">
              {t("carpetMenu")}
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/kategori/akrilik-cami-halisi",           labelKey: "pl_acrylic" as const },
                { href: "/kategori/safli-akrilik-cami-halisi",     labelKey: "pl_acrylicSolid" as const },
                { href: "/kategori/gobekli-akrilik-cami-halisi",   labelKey: "pl_acrylicMedallion" as const },
                { href: "/kategori/yun-cami-halisi",               labelKey: "pl_wool" as const },
                { href: "/kategori/polipropilen-cami-halisi",      labelKey: "pl_polypropylene" as const },
                { href: "/kategori/polyamid-cami-halisi",          labelKey: "pl_polyamide" as const },
                { href: "/kategori/ozel-desen-axminster-cami-halisi", labelKey: "pl_axminster" as const },
                { href: "/kategori/kece-cami-halisi-altligi",      labelKey: "pl_underlay" as const },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={`${prefix}${item.href}`}
                    className="text-xs text-[#F0FDFE]/70 hover:text-[#E4B84A] transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#C9972B]/50 flex-shrink-0" />
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sütun 3: Kurumsal */}
          <div>
            <h3 className="text-sm font-bold text-[#C9972B] uppercase tracking-widest mb-4">
              {t("company")}
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/hakkimizda", labelKey: "about" as const },
                { href: "/referanslar", labelKey: "references" as const },
                { href: "/galeri", labelKey: "gallery" as const },
                { href: "/teknik-ozellikler", labelKey: "technicalSpecs" as const },
                { href: "/blog", labelKey: "blog" as const },
                { href: "/iletisim", labelKey: "contactUs" as const },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={`${prefix}${item.href}`}
                    className="text-sm text-[#F0FDFE]/70 hover:text-[#E4B84A] transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#C9972B]/50 flex-shrink-0" />
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Sosyal Medya */}
            <div className="mt-6">
              <h3 className="text-sm font-bold text-[#C9972B] uppercase tracking-widest mb-3">{t("followUs")}</h3>
              <div className="flex gap-2">
                <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-[#25D366]/20 hover:bg-[#25D366]/30 rounded-lg flex items-center justify-center transition-colors" aria-label="WhatsApp">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#25D366" className="w-4 h-4">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors text-xs font-bold text-[#F0FDFE]/70" aria-label="Instagram">
                  IG
                </a>
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors text-xs font-bold text-[#F0FDFE]/70" aria-label="LinkedIn">
                  in
                </a>
              </div>
            </div>
          </div>

          {/* Sütun 4: İletişim */}
          <div>
            <h3 className="text-sm font-bold text-[#C9972B] uppercase tracking-widest mb-4">
              {t("contact")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${settings.phone.replace(/\s/g, "")}`}
                  className="flex items-start gap-2.5 text-sm text-[#F0FDFE]/70 hover:text-[#E4B84A] transition-colors"
                >
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#C9972B]/70" />
                  <span>{settings.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-start gap-2.5 text-sm text-[#F0FDFE]/70 hover:text-[#E4B84A] transition-colors"
                >
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#C9972B]/70" />
                  <span>{settings.email}</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2.5 text-sm text-[#F0FDFE]/70">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#C9972B]/70" />
                  <span>{settings.address}</span>
                </div>
              </li>
            </ul>

            <div className="mt-5 space-y-2">
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-2.5 px-4 rounded-xl transition-colors text-sm w-full justify-center"
              >
                <MessageCircle className="w-4 h-4" />
                {t("whatsappBtn")}
              </a>
              <a
                href={MAIN_SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold text-sm w-full justify-center"
              >
                {t("quoteBtn")}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="flex gap-2 pt-1">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 text-xs font-semibold bg-white/10 rounded-lg text-[#F0FDFE]/70 hover:bg-white/20 hover:text-white transition-colors">
                  Instagram
                </a>
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 text-xs font-semibold bg-white/10 rounded-lg text-[#F0FDFE]/70 hover:bg-white/20 hover:text-white transition-colors">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Alt Bar ── */}
      <div className="border-t border-[#F0FDFE]/10 py-5">
        <div className="container-site flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#F0FDFE]/40">
          <p>
            © {year} Asil Halı A.Ş. — {t("copyrightNote")}{" "}
            <a href={MAIN_SITE_URL} className="text-[#C9972B]/70 hover:text-[#C9972B]" target="_blank" rel="noopener">
              asilhali.com.tr
            </a>
          </p>
          <div className="flex items-center gap-4">
            <Link href={`${prefix}/gizlilik`} className="hover:text-[#F0FDFE]/70 transition-colors">
              {t("privacyPolicy")}
            </Link>
            <span>|</span>
            <Link href={`${prefix}/kullanim-sartlari`} className="hover:text-[#F0FDFE]/70 transition-colors">
              {t("termsOfUse")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

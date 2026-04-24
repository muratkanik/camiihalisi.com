"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, ChevronRight, MessageCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "./LocaleSwitcher";
import TeklifFormModal from "./TeklifFormModal";

const MAIN_SITE_URL = "/api/r?to=https%3A%2F%2Fasilhali.com.tr%2F%23!cami-halisi%3Futm_source%3Dcamiihalisi%26utm_medium%3Dtopnav%26utm_campaign%3Dsite&from=nav&label=main-site&cat=outbound";
const DEFAULT_WA_URL = "/api/r?to=https%3A%2F%2Fwa.me%2F905062259235%3Ftext%3DMerhaba%252C%2520cami%2520hal%25C4%25B1s%25C4%25B1%2520hakk%25C4%25B1nda%2520bilgi%2520almak%2520istiyorum.&from=nav&label=whatsapp&cat=whatsapp";

export interface NavTranslations {
  mainSite: string; mainSiteLink: string; whatsapp: string; instagram: string;
  linkedin: string; products: string; carpets: string; underlay: string;
  gallery: string; blog: string; about: string; contact: string;
  references: string; technicalSpecs: string; getQuote: string; whatsappChat: string;
}

interface NavProps {
  locale: string;
  waUrl?: string;
  phone?: string;
  t?: NavTranslations;
}

export default function Navigation({ locale, waUrl, phone, t }: NavProps) {
  const tMenu = useTranslations("menu");
  const tNav = useTranslations("nav");

  const CARPET_MENU = [
    {
      parent: tMenu("acrylic"),
      parentSlug: "akrilik-cami-halisi",
      children: [
        { label: tMenu("acrylic_solid"), slug: "safli-akrilik-cami-halisi" },
        { label: tMenu("acrylic_medallion"), slug: "gobekli-akrilik-cami-halisi" },
        { label: tMenu("acrylic_prayer"), slug: "seccadeli-akrilik-cami-halisi" },
      ],
    },
    {
      parent: tMenu("wool"),
      parentSlug: "yun-cami-halisi",
      children: [
        { label: tMenu("wool_solid"), slug: "safli-yun-cami-halisi" },
        { label: tMenu("wool_medallion"), slug: "gobekli-yun-cami-halisi" },
        { label: tMenu("wool_prayer"), slug: "seccadeli-yun-cami-halisi" },
      ],
    },
    {
      parent: tMenu("polypropylene"),
      parentSlug: "polipropilen-cami-halisi",
      children: [
        { label: tMenu("polypropylene_solid"), slug: "safli-polipropilen-cami-halisi" },
        { label: tMenu("polypropylene_medallion"), slug: "gobekli-polipropilen-cami-halisi" },
        { label: tMenu("polypropylene_prayer"), slug: "seccadeli-polipropilen-cami-halisi" },
      ],
    },
    {
      parent: tMenu("polyamide"),
      parentSlug: "polyamid-cami-halisi",
      children: [
        { label: tMenu("polyamide_solid"), slug: "safli-polyamid-cami-halisi" },
        { label: tMenu("polyamide_medallion"), slug: "gobekli-polyamid-cami-halisi" },
        { label: tMenu("polyamide_prayer"), slug: "seccadeli-polyamid-cami-halisi" },
      ],
    },
    {
      parent: tMenu("axminster"),
      parentSlug: "ozel-desen-axminster-cami-halisi",
      children: [],
    },
  ];

  const UNDERLAY_MENU = [
    {
      parent: tMenu("underlay_rubber"),
      parentSlug: "kaucuk-cami-halisi-altligi",
      children: [
        { label: tMenu("underlay_rubber_tredmor"), slug: "tredmor-berber-supreme" },
      ],
    },
    {
      parent: tMenu("underlay_felt"),
      parentSlug: "kece-cami-halisi-altligi",
      children: [
        { label: tMenu("underlay_felt_600"), slug: "600-cami-halisi-kecesi" },
        { label: tMenu("underlay_felt_1000"), slug: "1000-cami-halisi-kecesi" },
        { label: tMenu("underlay_felt_1200"), slug: "1200-cami-halisi-kecesi" },
      ],
    },
  ];
  const WA_URL = waUrl ?? DEFAULT_WA_URL;
  const PHONE = phone ?? "+90 532 346 79 39";
  const PHONE_HREF = PHONE.replace(/\s/g, "");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [teklifOpen, setTeklifOpen] = useState(false);
  const [carpetOpen, setCarpetOpen] = useState(false);
  const [underlayOpen, setUnderlayOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const carpetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const underlayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const prefix = locale === "tr" ? "" : `/${locale}`;

  const TOP_NAV = [
    { href: `${prefix}/hakkimizda`, label: tNav("about") },
    { href: `${prefix}/referanslar`, label: tNav("references") },
    { href: `${prefix}/blog`, label: tNav("blog") },
    { href: `${prefix}/teknik-ozellikler`, label: tNav("technicalSpecs") },
    { href: `${prefix}/iletisim`, label: tNav("contact") },
  ];

  const openCarpet = () => {
    if (carpetTimer.current) clearTimeout(carpetTimer.current);
    setCarpetOpen(true);
  };
  const closeCarpet = () => {
    carpetTimer.current = setTimeout(() => setCarpetOpen(false), 150);
  };
  const openUnderlay = () => {
    if (underlayTimer.current) clearTimeout(underlayTimer.current);
    setUnderlayOpen(true);
  };
  const closeUnderlay = () => {
    underlayTimer.current = setTimeout(() => setUnderlayOpen(false), 150);
  };

  return (
    <>
      {/* ── Üst Bilgi Bandı ── */}
      <div className="main-site-cta text-sm flex items-center justify-between px-4 md:px-8">
        <span>
          {tNav("mainSite")}{" "}
          <a href={MAIN_SITE_URL} target="_blank" rel="noopener noreferrer">
            {tNav("mainSiteLink")}
          </a>
        </span>
        <div className="hidden md:flex items-center gap-4">
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
            <MessageCircle className="w-3.5 h-3.5" /> {tNav("whatsapp")}
          </a>
          <a href="https://www.instagram.com/mosquecarpets" target="_blank" rel="noopener noreferrer" className="hover:underline">
            {tNav("instagram")}
          </a>
          <a href="https://www.linkedin.com/company/asil-hali" target="_blank" rel="noopener noreferrer" className="hover:underline">
            {tNav("linkedin")}
          </a>
          <a href={`tel:${PHONE_HREF}`} className="flex items-center gap-1 hover:underline">
            <Phone className="w-3.5 h-3.5" /> {PHONE}
          </a>
        </div>
      </div>

      {/* ── Ana Navigasyon ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass border-b border-[#B2EBF2] shadow-md"
            : "bg-[#F0FDFE] border-b border-[#B2EBF2]"
        }`}
      >
        <div className="container-site">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo — Yeni Tasarım */}
            <Link href={`${prefix}/`} className="flex-shrink-0 group flex flex-col items-center leading-none transition-opacity duration-200 hover:opacity-85">
              {/* Üst süsleme — İslami motif */}
              <svg width="148" height="14" viewBox="0 0 148 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                {/* Sol yatay çizgi */}
                <line x1="2" y1="10" x2="52" y2="10" stroke="#C9972B" strokeWidth="0.75" strokeLinecap="round"/>
                {/* Sol küçük lale */}
                <path d="M57 13 C57 10 55.5 8.5 55.5 7 C55.5 5.5 57 4.5 57 4.5 C57 4.5 58.5 5.5 58.5 7 C58.5 8.5 57 10 57 13Z" fill="#C9972B"/>
                <circle cx="57" cy="3.5" r="1.2" fill="#C9972B"/>
                {/* Merkez büyük lale */}
                <path d="M74 13 C74 9 71.5 7 71.5 5 C71.5 3 74 1.5 74 1.5 C74 1.5 76.5 3 76.5 5 C76.5 7 74 9 74 13Z" fill="#C9972B"/>
                <circle cx="74" cy="0.8" r="1.5" fill="#C9972B"/>
                {/* Sağ küçük lale */}
                <path d="M91 13 C91 10 89.5 8.5 89.5 7 C89.5 5.5 91 4.5 91 4.5 C91 4.5 92.5 5.5 92.5 7 C92.5 8.5 91 10 91 13Z" fill="#C9972B"/>
                <circle cx="91" cy="3.5" r="1.2" fill="#C9972B"/>
                {/* Sağ yatay çizgi */}
                <line x1="96" y1="10" x2="146" y2="10" stroke="#C9972B" strokeWidth="0.75" strokeLinecap="round"/>
              </svg>

              {/* Ana başlık */}
              <span
                className="text-[#0097A7] font-bold tracking-[0.12em] leading-none mt-0.5"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.35rem", letterSpacing: "0.12em" }}
              >
                CAMİİ HALISI
              </span>

              {/* Alt tagline */}
              <span
                className="text-[9.5px] font-medium tracking-widest mt-0.5 select-none"
                style={{ color: "#C9972B", fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.13em" }}
              >
                {tNav("logoTagline")}
              </span>
            </Link>

            {/* Desktop Menü */}
            <nav className="hidden xl:flex items-center gap-0.5" aria-label="Ana menü">
              <Link href={`${prefix}/hakkimizda`} className="px-2 2xl:px-3 py-2 text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-[#E0F7FA] hover:text-[#0097A7] transition-colors">
                {tNav("about")}
              </Link>

              {/* Cami Halısı Mega Dropdown */}
              <div
                className="relative"
                onMouseEnter={openCarpet}
                onMouseLeave={closeCarpet}
              >
                <button
                  className="flex items-center gap-1 px-2 2xl:px-3 py-2 text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-[#E0F7FA] hover:text-[#0097A7] transition-colors"
                  aria-expanded={carpetOpen}
                >
                  {tMenu("carpetTitle")}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${carpetOpen ? "rotate-180" : ""}`} />
                </button>
                {carpetOpen && (
                  <div
                    className="absolute top-full left-0 pt-2 z-50"
                    onMouseEnter={openCarpet}
                    onMouseLeave={closeCarpet}
                  >
                    <div className="bg-white border border-[#B2EBF2] rounded-xl shadow-xl overflow-hidden w-[min(580px,calc(100vw-2rem))]">
                      <div className="grid grid-cols-2 gap-0 p-4">
                        {CARPET_MENU.map((group) => (
                          <div key={group.parentSlug} className="p-2">
                            <Link
                              href={`${prefix}/kategori/${group.parentSlug}`}
                              className="block text-sm font-bold text-[#0097A7] hover:text-[#C9972B] transition-colors mb-1.5"
                              onClick={() => setCarpetOpen(false)}
                            >
                              {group.parent}
                            </Link>
                            {group.children.map((child) => (
                              <Link
                                key={child.slug}
                                href={`${prefix}/kategori/${child.slug}`}
                                className="flex items-center gap-1 py-1 text-xs text-[#6B6355] hover:text-[#0097A7] transition-colors"
                                onClick={() => setCarpetOpen(false)}
                              >
                                <ChevronRight className="w-3 h-3 text-[#C9972B] flex-shrink-0" />
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-[#E0F7FA] px-6 py-3 bg-[#F0FDFE]">
                        <Link href={`${prefix}/kategori/akrilik-cami-halisi`} className="text-xs text-[#C9972B] font-semibold hover:underline" onClick={() => setCarpetOpen(false)}>
                          → {tMenu("viewAll")}
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Halı Altı Malzemeleri Dropdown */}
              <div
                className="relative"
                onMouseEnter={openUnderlay}
                onMouseLeave={closeUnderlay}
              >
                <button
                  className="flex items-center gap-1 px-2 2xl:px-3 py-2 text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-[#E0F7FA] hover:text-[#0097A7] transition-colors"
                  aria-expanded={underlayOpen}
                >
                  {tMenu("underlayTitle")}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${underlayOpen ? "rotate-180" : ""}`} />
                </button>
                {underlayOpen && (
                  <div
                    className="absolute top-full left-0 pt-2 z-50"
                    onMouseEnter={openUnderlay}
                    onMouseLeave={closeUnderlay}
                  >
                    <div className="bg-white border border-[#B2EBF2] rounded-xl shadow-xl overflow-hidden w-72">
                      <div className="p-4">
                        {UNDERLAY_MENU.map((group) => (
                          <div key={group.parentSlug} className="mb-3">
                            <Link
                              href={`${prefix}/kategori/${group.parentSlug}`}
                              className="block text-sm font-bold text-[#0097A7] hover:text-[#C9972B] transition-colors mb-1.5"
                              onClick={() => setUnderlayOpen(false)}
                            >
                              {group.parent}
                            </Link>
                            {group.children.map((child) => (
                              <Link
                                key={child.slug}
                                href={`${prefix}/kategori/${child.slug}`}
                                className="flex items-center gap-1 py-1 text-xs text-[#6B6355] hover:text-[#0097A7] transition-colors"
                                onClick={() => setUnderlayOpen(false)}
                              >
                                <ChevronRight className="w-3 h-3 text-[#C9972B] flex-shrink-0" />
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link href={`${prefix}/referanslar`} className="px-2 2xl:px-3 py-2 text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-[#E0F7FA] hover:text-[#0097A7] transition-colors">
                {tNav("references")}
              </Link>
              <Link href={`${prefix}/galeri`} className="px-2 2xl:px-3 py-2 text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-[#E0F7FA] hover:text-[#0097A7] transition-colors">
                {tNav("gallery")}
              </Link>
              <Link href={`${prefix}/blog`} className="px-2 2xl:px-3 py-2 text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-[#E0F7FA] hover:text-[#0097A7] transition-colors">
                {tNav("blog")}
              </Link>
              <Link href={`${prefix}/teknik-ozellikler`} className="px-2 2xl:px-3 py-2 text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-[#E0F7FA] hover:text-[#0097A7] transition-colors">
                {tNav("technicalSpecs")}
              </Link>
              <Link href={`${prefix}/iletisim`} className="px-2 2xl:px-3 py-2 text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-[#E0F7FA] hover:text-[#0097A7] transition-colors">
                {tNav("contact")}
              </Link>

              {/* Dil Seçici */}
              <LocaleSwitcher currentLocale={locale} />

              {/* WhatsApp CTA */}
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 2xl:ml-2 flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-2 px-2.5 2xl:px-3 rounded-xl transition-colors text-sm"
                aria-label="WhatsApp ile iletişim"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden 2xl:inline">WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setTeklifOpen(true)}
                className="btn btn-primary text-sm ml-1 !py-2 !px-2.5 2xl:!px-3 whitespace-nowrap flex-shrink-0"
              >
                {tNav("getQuote")}
              </button>
            </nav>

            {/* Mobil: Dil + WhatsApp + Hamburger */}
            <div className="xl:hidden flex items-center gap-2">
              <LocaleSwitcher currentLocale={locale} />
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 bg-[#25D366] text-white text-xs font-bold py-2 px-3 rounded-xl"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg hover:bg-[#E0F7FA] transition-colors"
                aria-label="Menüyü aç"
              >
                {mobileOpen ? <X className="w-5 h-5 text-[#0097A7]" /> : <Menu className="w-5 h-5 text-[#0097A7]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobil Menü */}
        {mobileOpen && (
          <div className="xl:hidden bg-[#F0FDFE] border-t border-[#B2EBF2] max-h-[80vh] overflow-y-auto">
            <div className="container-site py-3 flex flex-col gap-0.5">

              {/* Cami Halısı Accordion — İLK SIRADA */}
              <div>
                <button
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-[#0097A7] hover:bg-[#E0F7FA] rounded-lg"
                  onClick={() => setMobileExpanded(mobileExpanded === "carpet" ? null : "carpet")}
                >
                  {tMenu("carpetTitle")}
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded === "carpet" ? "rotate-180" : ""}`} />
                </button>
                {mobileExpanded === "carpet" && (
                  <div className="pl-4 pb-2">
                    {CARPET_MENU.map((group) => (
                      <div key={group.parentSlug} className="mb-2">
                        <Link
                          href={`${prefix}/kategori/${group.parentSlug}`}
                          className="block px-4 py-2 text-sm font-semibold text-[#0097A7] hover:bg-[#E0F7FA] rounded-lg"
                          onClick={() => setMobileOpen(false)}
                        >
                          {group.parent}
                        </Link>
                        {group.children.map((child) => (
                          <Link
                            key={child.slug}
                            href={`${prefix}/kategori/${child.slug}`}
                            className="flex items-center gap-1 pl-8 pr-4 py-1.5 text-xs text-[#6B6355] hover:text-[#0097A7] hover:bg-[#E0F7FA] rounded-lg"
                            onClick={() => setMobileOpen(false)}
                          >
                            <ChevronRight className="w-3 h-3 text-[#C9972B]" />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Halı Altı Accordion */}
              <div>
                <button
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-[#0097A7] hover:bg-[#E0F7FA] rounded-lg"
                  onClick={() => setMobileExpanded(mobileExpanded === "underlay" ? null : "underlay")}
                >
                  {tMenu("underlayTitle")}
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded === "underlay" ? "rotate-180" : ""}`} />
                </button>
                {mobileExpanded === "underlay" && (
                  <div className="pl-4 pb-2">
                    {UNDERLAY_MENU.map((group) => (
                      <div key={group.parentSlug} className="mb-2">
                        <Link
                          href={`${prefix}/kategori/${group.parentSlug}`}
                          className="block px-4 py-2 text-sm font-semibold text-[#0097A7] hover:bg-[#E0F7FA] rounded-lg"
                          onClick={() => setMobileOpen(false)}
                        >
                          {group.parent}
                        </Link>
                        {group.children.map((child) => (
                          <Link
                            key={child.slug}
                            href={`${prefix}/kategori/${child.slug}`}
                            className="flex items-center gap-1 pl-8 pr-4 py-1.5 text-xs text-[#6B6355] hover:text-[#0097A7] hover:bg-[#E0F7FA] rounded-lg"
                            onClick={() => setMobileOpen(false)}
                          >
                            <ChevronRight className="w-3 h-3 text-[#C9972B]" />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link href={`${prefix}/hakkimizda`} className="px-4 py-3 text-sm font-medium text-[#1A1A1A] hover:text-[#0097A7] hover:bg-[#E0F7FA] rounded-lg" onClick={() => setMobileOpen(false)}>
                {tNav("about")}
              </Link>
              <Link href={`${prefix}/referanslar`} className="px-4 py-3 text-sm font-medium text-[#1A1A1A] hover:text-[#0097A7] hover:bg-[#E0F7FA] rounded-lg" onClick={() => setMobileOpen(false)}>
                {tNav("references")}
              </Link>
              <Link href={`${prefix}/galeri`} className="px-4 py-3 text-sm font-medium text-[#1A1A1A] hover:text-[#0097A7] hover:bg-[#E0F7FA] rounded-lg" onClick={() => setMobileOpen(false)}>
                {tNav("gallery")}
              </Link>
              <Link href={`${prefix}/blog`} className="px-4 py-3 text-sm font-medium text-[#1A1A1A] hover:text-[#0097A7] hover:bg-[#E0F7FA] rounded-lg" onClick={() => setMobileOpen(false)}>
                {tNav("blog")}
              </Link>
              <Link href={`${prefix}/teknik-ozellikler`} className="px-4 py-3 text-sm font-medium text-[#1A1A1A] hover:text-[#0097A7] hover:bg-[#E0F7FA] rounded-lg" onClick={() => setMobileOpen(false)}>
                {tNav("technicalSpecs")}
              </Link>
              <Link href={`${prefix}/iletisim`} className="px-4 py-3 text-sm font-medium text-[#1A1A1A] hover:text-[#0097A7] hover:bg-[#E0F7FA] rounded-lg" onClick={() => setMobileOpen(false)}>
                {tNav("contact")}
              </Link>

              {/* Sosyal linkler mobil */}
              <div className="flex gap-2 px-4 py-3 mt-1 border-t border-[#B2EBF2]">
                <a href="https://www.instagram.com/mosquecarpets" target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 text-xs font-semibold bg-[#E8E0D5] rounded-lg text-[#1A1A1A] hover:bg-[#B2EBF2]">
                  Instagram
                </a>
                <a href="https://www.linkedin.com/company/asil-hali" target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 text-xs font-semibold bg-[#E8E0D5] rounded-lg text-[#1A1A1A] hover:bg-[#B2EBF2]">
                  LinkedIn
                </a>
              </div>

              <button
                type="button"
                onClick={() => { setMobileOpen(false); setTeklifOpen(true); }}
                className="btn btn-primary text-sm mx-0 mb-2"
              >
                {tNav("getQuote")}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Teklif Al Modal */}
      <TeklifFormModal open={teklifOpen} onClose={() => setTeklifOpen(false)} />
    </>
  );
}

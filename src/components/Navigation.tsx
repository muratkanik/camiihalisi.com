"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, ExternalLink, ChevronDown, ChevronRight, MessageCircle, Phone } from "lucide-react";

const MAIN_SITE_URL = "/api/r?to=https%3A%2F%2Fasilhali.com.tr%2F%23!cami-halisi%3Futm_source%3Dcamiihalisi%26utm_medium%3Dtopnav%26utm_campaign%3Dsite&from=nav&label=main-site&cat=outbound";
const DEFAULT_WA_URL = "/api/r?to=https%3A%2F%2Fwa.me%2F905062259235%3Ftext%3DMerhaba%252C%2520cami%2520hal%25C4%25B1s%25C4%25B1%2520hakk%25C4%25B1nda%2520bilgi%2520almak%2520istiyorum.&from=nav&label=whatsapp&cat=whatsapp";

interface NavProps {
  locale: string;
  waUrl?: string;
  phone?: string;
}

const CARPET_MENU = [
  {
    parent: "Akrilik Cami Halısı",
    parentSlug: "akrilik-cami-halisi",
    children: [
      { label: "Saflı Akrilik Cami Halıları", slug: "safli-akrilik-cami-halisi" },
      { label: "Göbekli Akrilik Cami Halıları", slug: "gobekli-akrilik-cami-halisi" },
      { label: "Seccadeli Akrilik Cami Halıları", slug: "seccadeli-akrilik-cami-halisi" },
    ],
  },
  {
    parent: "Yün Cami Halısı",
    parentSlug: "yun-cami-halisi",
    children: [
      { label: "Saflı Yün Cami Halıları", slug: "safli-yun-cami-halisi" },
      { label: "Göbekli Yün Cami Halıları", slug: "gobekli-yun-cami-halisi" },
      { label: "Seccadeli Yün Cami Halıları", slug: "seccadeli-yun-cami-halisi" },
    ],
  },
  {
    parent: "Polipropilen Cami Halısı",
    parentSlug: "polipropilen-cami-halisi",
    children: [
      { label: "Saflı Polipropilen Cami Halıları", slug: "safli-polipropilen-cami-halisi" },
      { label: "Göbekli Polipropilen Cami Halıları", slug: "gobekli-polipropilen-cami-halisi" },
      { label: "Seccadeli Polipropilen Cami Halıları", slug: "seccadeli-polipropilen-cami-halisi" },
    ],
  },
  {
    parent: "Polyamid Cami Halısı",
    parentSlug: "polyamid-cami-halisi",
    children: [
      { label: "Saflı Polyamid Cami Halıları", slug: "safli-polyamid-cami-halisi" },
      { label: "Göbekli Polyamid Cami Halıları", slug: "gobekli-polyamid-cami-halisi" },
      { label: "Seccadeli Polyamid Cami Halıları", slug: "seccadeli-polyamid-cami-halisi" },
    ],
  },
  {
    parent: "Özel Desen & Axminster",
    parentSlug: "ozel-desen-axminster-cami-halisi",
    children: [],
  },
];

const UNDERLAY_MENU = [
  {
    parent: "Kauçuk Cami Halısı Altlıkları",
    parentSlug: "kaucuk-cami-halisi-altligi",
    children: [
      { label: "TredMOR™ Berber Supreme", slug: "tredmor-berber-supreme" },
    ],
  },
  {
    parent: "Keçe Cami Halısı Altlıkları",
    parentSlug: "kece-cami-halisi-altligi",
    children: [
      { label: "600 Cami Halısı Keçesi", slug: "600-cami-halisi-kecesi" },
      { label: "1000 Cami Halısı Keçesi", slug: "1000-cami-halisi-kecesi" },
      { label: "1200 Cami Halısı Keçesi", slug: "1200-cami-halisi-kecesi" },
    ],
  },
];

const TOP_NAV = [
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/referanslar", label: "Referanslar" },
  { href: "/blog", label: "Blog" },
  { href: "/teknik-ozellikler", label: "Teknik Özellikler" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Navigation({ locale, waUrl, phone }: NavProps) {
  const WA_URL = waUrl ?? DEFAULT_WA_URL;
  const PHONE = phone ?? "+90 532 346 79 39";
  const PHONE_HREF = PHONE.replace(/\s/g, "");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
          Asil Halı A.Ş. resmi sitesi:{" "}
          <a href={MAIN_SITE_URL} target="_blank" rel="noopener noreferrer">
            asilhali.com.tr →
          </a>
        </span>
        <div className="hidden md:flex items-center gap-4">
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </a>
          <a href="https://www.instagram.com/mosquecarpets" target="_blank" rel="noopener noreferrer" className="hover:underline">
            Instagram
          </a>
          <a href="https://www.linkedin.com/company/asil-hali" target="_blank" rel="noopener noreferrer" className="hover:underline">
            LinkedIn
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
            {/* Logo */}
            <Link href={`${prefix}/`} className="flex items-center gap-2.5 flex-shrink-0 group">
              {/* Icon: sekizgen İslami motif */}
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="transition-transform duration-300 group-hover:scale-105">
                {/* Dış sekizgen */}
                <path d="M20 2L25.5 8H33.5V16L40 20L33.5 24V32H25.5L20 38L14.5 32H6.5V24L0 20L6.5 16V8H14.5Z" fill="#006064"/>
                {/* İç sekizgen - altın */}
                <path d="M20 9L23.8 13H29.2V18.2L33 20L29.2 21.8V27H23.8L20 31L16.2 27H10.8V21.8L7 20L10.8 18.2V13H16.2Z" fill="#C9972B"/>
                {/* Merkez boşluk */}
                <circle cx="20" cy="20" r="5.5" fill="#006064"/>
                {/* Merkez nokta */}
                <circle cx="20" cy="20" r="2.5" fill="#F0FDFE"/>
              </svg>

              {/* Metin */}
              <div className="flex flex-col leading-none gap-0.5">
                <span className="text-[#006064] font-bold text-xl tracking-tight leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  CAMİİ HALISI
                </span>
                <span className="text-[11px] font-semibold tracking-wider" style={{ color: "#C9972B" }}>
                  by <span className="font-bold">Asil Halı</span>
                </span>
              </div>
            </Link>

            {/* Desktop Menü */}
            <nav className="hidden md:flex items-center gap-0.5" aria-label="Ana menü">
              <Link href={`${prefix}/hakkimizda`} className="px-3 py-2 text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-[#E0F7FA] hover:text-[#006064] transition-colors">
                Hakkımızda
              </Link>

              {/* Cami Halısı Mega Dropdown */}
              <div
                className="relative"
                onMouseEnter={openCarpet}
                onMouseLeave={closeCarpet}
              >
                <button
                  className="flex items-center gap-1 px-3 py-2 text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-[#E0F7FA] hover:text-[#006064] transition-colors"
                  aria-expanded={carpetOpen}
                >
                  Cami Halısı
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${carpetOpen ? "rotate-180" : ""}`} />
                </button>
                {carpetOpen && (
                  <div
                    className="absolute top-full left-0 pt-2 z-50"
                    onMouseEnter={openCarpet}
                    onMouseLeave={closeCarpet}
                  >
                    <div className="bg-white border border-[#B2EBF2] rounded-xl shadow-xl overflow-hidden w-[580px]">
                      <div className="grid grid-cols-2 gap-0 p-4">
                        {CARPET_MENU.map((group) => (
                          <div key={group.parentSlug} className="p-2">
                            <Link
                              href={`${prefix}/kategori/${group.parentSlug}`}
                              className="block text-sm font-bold text-[#006064] hover:text-[#C9972B] transition-colors mb-1.5"
                              onClick={() => setCarpetOpen(false)}
                            >
                              {group.parent}
                            </Link>
                            {group.children.map((child) => (
                              <Link
                                key={child.slug}
                                href={`${prefix}/kategori/${child.slug}`}
                                className="flex items-center gap-1 py-1 text-xs text-[#6B6355] hover:text-[#006064] transition-colors"
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
                          → Tüm Cami Halısı Ürünleri
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
                  className="flex items-center gap-1 px-3 py-2 text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-[#E0F7FA] hover:text-[#006064] transition-colors"
                  aria-expanded={underlayOpen}
                >
                  Halı Altlığı
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
                              className="block text-sm font-bold text-[#006064] hover:text-[#C9972B] transition-colors mb-1.5"
                              onClick={() => setUnderlayOpen(false)}
                            >
                              {group.parent}
                            </Link>
                            {group.children.map((child) => (
                              <Link
                                key={child.slug}
                                href={`${prefix}/kategori/${child.slug}`}
                                className="flex items-center gap-1 py-1 text-xs text-[#6B6355] hover:text-[#006064] transition-colors"
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

              <Link href={`${prefix}/referanslar`} className="px-3 py-2 text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-[#E0F7FA] hover:text-[#006064] transition-colors">
                Referanslar
              </Link>
              <Link href={`${prefix}/galeri`} className="px-3 py-2 text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-[#E0F7FA] hover:text-[#006064] transition-colors">
                Galeri
              </Link>
              <Link href={`${prefix}/blog`} className="px-3 py-2 text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-[#E0F7FA] hover:text-[#006064] transition-colors">
                Blog
              </Link>
              <Link href={`${prefix}/teknik-ozellikler`} className="px-3 py-2 text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-[#E0F7FA] hover:text-[#006064] transition-colors">
                Teknik
              </Link>
              <Link href={`${prefix}/iletisim`} className="px-3 py-2 text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-[#E0F7FA] hover:text-[#006064] transition-colors">
                İletişim
              </Link>

              {/* WhatsApp CTA */}
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-2 px-3 rounded-xl transition-colors text-sm"
                aria-label="WhatsApp ile iletişim"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>

              <a
                href={MAIN_SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary text-sm ml-1 !py-2 !px-3"
              >
                Teklif Al
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </nav>

            {/* Mobil: WhatsApp + Hamburger */}
            <div className="md:hidden flex items-center gap-2">
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
                {mobileOpen ? <X className="w-5 h-5 text-[#006064]" /> : <Menu className="w-5 h-5 text-[#006064]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobil Menü */}
        {mobileOpen && (
          <div className="md:hidden bg-[#F0FDFE] border-t border-[#B2EBF2] max-h-[80vh] overflow-y-auto">
            <div className="container-site py-3 flex flex-col gap-0.5">

              {/* Cami Halısı Accordion — İLK SIRADA */}
              <div>
                <button
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-[#006064] hover:bg-[#E0F7FA] rounded-lg"
                  onClick={() => setMobileExpanded(mobileExpanded === "carpet" ? null : "carpet")}
                >
                  Cami Halısı
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded === "carpet" ? "rotate-180" : ""}`} />
                </button>
                {mobileExpanded === "carpet" && (
                  <div className="pl-4 pb-2">
                    {CARPET_MENU.map((group) => (
                      <div key={group.parentSlug} className="mb-2">
                        <Link
                          href={`${prefix}/kategori/${group.parentSlug}`}
                          className="block px-4 py-2 text-sm font-semibold text-[#006064] hover:bg-[#E0F7FA] rounded-lg"
                          onClick={() => setMobileOpen(false)}
                        >
                          {group.parent}
                        </Link>
                        {group.children.map((child) => (
                          <Link
                            key={child.slug}
                            href={`${prefix}/kategori/${child.slug}`}
                            className="flex items-center gap-1 pl-8 pr-4 py-1.5 text-xs text-[#6B6355] hover:text-[#006064] hover:bg-[#E0F7FA] rounded-lg"
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
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-[#006064] hover:bg-[#E0F7FA] rounded-lg"
                  onClick={() => setMobileExpanded(mobileExpanded === "underlay" ? null : "underlay")}
                >
                  Halı Altlığı
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded === "underlay" ? "rotate-180" : ""}`} />
                </button>
                {mobileExpanded === "underlay" && (
                  <div className="pl-4 pb-2">
                    {UNDERLAY_MENU.map((group) => (
                      <div key={group.parentSlug} className="mb-2">
                        <Link
                          href={`${prefix}/kategori/${group.parentSlug}`}
                          className="block px-4 py-2 text-sm font-semibold text-[#006064] hover:bg-[#E0F7FA] rounded-lg"
                          onClick={() => setMobileOpen(false)}
                        >
                          {group.parent}
                        </Link>
                        {group.children.map((child) => (
                          <Link
                            key={child.slug}
                            href={`${prefix}/kategori/${child.slug}`}
                            className="flex items-center gap-1 pl-8 pr-4 py-1.5 text-xs text-[#6B6355] hover:text-[#006064] hover:bg-[#E0F7FA] rounded-lg"
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

              <Link href={`${prefix}/hakkimizda`} className="px-4 py-3 text-sm font-medium text-[#1A1A1A] hover:text-[#006064] hover:bg-[#E0F7FA] rounded-lg" onClick={() => setMobileOpen(false)}>
                Hakkımızda
              </Link>
              <Link href={`${prefix}/referanslar`} className="px-4 py-3 text-sm font-medium text-[#1A1A1A] hover:text-[#006064] hover:bg-[#E0F7FA] rounded-lg" onClick={() => setMobileOpen(false)}>
                Referanslar
              </Link>
              <Link href={`${prefix}/galeri`} className="px-4 py-3 text-sm font-medium text-[#1A1A1A] hover:text-[#006064] hover:bg-[#E0F7FA] rounded-lg" onClick={() => setMobileOpen(false)}>
                Galeri
              </Link>
              <Link href={`${prefix}/blog`} className="px-4 py-3 text-sm font-medium text-[#1A1A1A] hover:text-[#006064] hover:bg-[#E0F7FA] rounded-lg" onClick={() => setMobileOpen(false)}>
                Blog
              </Link>
              <Link href={`${prefix}/teknik-ozellikler`} className="px-4 py-3 text-sm font-medium text-[#1A1A1A] hover:text-[#006064] hover:bg-[#E0F7FA] rounded-lg" onClick={() => setMobileOpen(false)}>
                Teknik Özellikler
              </Link>
              <Link href={`${prefix}/iletisim`} className="px-4 py-3 text-sm font-medium text-[#1A1A1A] hover:text-[#006064] hover:bg-[#E0F7FA] rounded-lg" onClick={() => setMobileOpen(false)}>
                İletişim
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

              <a
                href={MAIN_SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary text-sm mx-0 mb-2"
              >
                Asil Halı'ya Git — Teklif Al
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

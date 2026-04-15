"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ExternalLink, ChevronDown } from "lucide-react";

const MAIN_SITE_URL = "https://www.asilhali.com.tr?utm_source=camiihalisi&utm_medium=topnav&utm_campaign=site";

interface NavProps {
  locale: string;
}

const categories = [
  { href: "akrilik-cami-halisi", label: "Akrilik Cami Halısı" },
  { href: "yun-cami-halisi", label: "Yün Cami Halısı" },
  { href: "polipropilen-cami-halisi", label: "Polipropilen Cami Halısı" },
  { href: "polyamid-cami-halisi", label: "Polyamid Cami Halısı" },
];

export default function Navigation({ locale }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const prefix = locale === "tr" ? "" : `/${locale}`;

  return (
    <>
      {/* ── Üst Bilgi Bandı: Ana Siteye Link ── */}
      <div className="main-site-cta text-sm">
        Asil Halı A.Ş.'nin resmi web sitesi:{" "}
        <a href={MAIN_SITE_URL} target="_blank" rel="noopener">
          asilhali.com.tr →
        </a>
      </div>

      {/* ── Ana Navigasyon ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass border-b border-[#DDD8CE] shadow-md"
            : "bg-[#F7F3EC] border-b border-[#DDD8CE]"
        }`}
      >
        <div className="container-site">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link
              href={`${prefix}/`}
              className="flex items-center gap-2 flex-shrink-0"
            >
              {/* İslami sekizgen motif ikonu */}
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  d="M18 2L22.9 7.1H30.9L30.9 15.1L36 18L30.9 20.9V28.9H22.9L18 34L13.1 28.9H5.1V20.9L0 18L5.1 15.1V7.1H13.1L18 2Z"
                  fill="#1B4332"
                />
                <path
                  d="M18 8L21.2 11.2H26.8L26.8 16.8L30 18L26.8 19.2V24.8H21.2L18 28L14.8 24.8H9.2V19.2L6 18L9.2 16.8V11.2H14.8L18 8Z"
                  fill="#C9972B"
                />
                <circle cx="18" cy="18" r="4" fill="#F7F3EC" />
              </svg>
              <div className="flex flex-col leading-none">
                <span
                  className="text-[#1B4332] font-bold text-lg tracking-tight"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  CAMİİ HALISI
                </span>
                <span className="text-[#C9972B] text-[10px] font-medium tracking-widest uppercase">
                  Asil Halı Bilgi Portalı
                </span>
              </div>
            </Link>

            {/* Desktop Menü */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Ana menü">
              <Link
                href={`${prefix}/`}
                className="px-4 py-2 text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-[#EDE8DF] hover:text-[#1B4332] transition-colors"
              >
                Ana Sayfa
              </Link>

              {/* Kategoriler Dropdown */}
              <div className="relative" onMouseLeave={() => setDropdownOpen(false)}>
                <button
                  onMouseEnter={() => setDropdownOpen(true)}
                  className="flex items-center gap-1 px-4 py-2 text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-[#EDE8DF] hover:text-[#1B4332] transition-colors"
                >
                  Ürünler
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-[#DDD8CE] rounded-xl shadow-lg overflow-hidden">
                    {categories.map((cat) => (
                      <Link
                        key={cat.href}
                        href={`${prefix}/kategori/${cat.href}`}
                        className="block px-4 py-3 text-sm text-[#1A1A1A] hover:bg-[#F7F3EC] hover:text-[#1B4332] font-medium transition-colors border-b border-[#EDE8DF] last:border-0"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href={`${prefix}/blog`}
                className="px-4 py-2 text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-[#EDE8DF] hover:text-[#1B4332] transition-colors"
              >
                Makaleler
              </Link>

              <Link
                href={`${prefix}/hakkimizda`}
                className="px-4 py-2 text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-[#EDE8DF] hover:text-[#1B4332] transition-colors"
              >
                Hakkımızda
              </Link>

              <Link
                href={`${prefix}/iletisim`}
                className="px-4 py-2 text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-[#EDE8DF] hover:text-[#1B4332] transition-colors"
              >
                İletişim
              </Link>

              {/* Ana Site CTA Butonu */}
              <a
                href={MAIN_SITE_URL}
                target="_blank"
                rel="noopener"
                className="btn btn-primary text-sm ml-2 !py-2 !px-4"
              >
                Alış Veriş
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </nav>

            {/* Mobil Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[#EDE8DF] transition-colors"
              aria-label="Menüyü aç"
            >
              {mobileOpen ? <X className="w-5 h-5 text-[#1B4332]" /> : <Menu className="w-5 h-5 text-[#1B4332]" />}
            </button>
          </div>
        </div>

        {/* Mobil Menü */}
        {mobileOpen && (
          <div className="md:hidden bg-[#F7F3EC] border-t border-[#DDD8CE]">
            <div className="container-site py-4 flex flex-col gap-1">
              <Link href={`${prefix}/`} className="px-4 py-3 text-sm font-medium text-[#1A1A1A] hover:text-[#1B4332] hover:bg-[#EDE8DF] rounded-lg" onClick={() => setMobileOpen(false)}>
                Ana Sayfa
              </Link>
              <div className="px-4 py-2 text-xs font-semibold text-[#C9972B] uppercase tracking-widest">Ürünler</div>
              {categories.map((cat) => (
                <Link key={cat.href} href={`${prefix}/kategori/${cat.href}`} className="pl-8 pr-4 py-2.5 text-sm font-medium text-[#1A1A1A] hover:text-[#1B4332] hover:bg-[#EDE8DF] rounded-lg" onClick={() => setMobileOpen(false)}>
                  {cat.label}
                </Link>
              ))}
              <Link href={`${prefix}/blog`} className="px-4 py-3 text-sm font-medium text-[#1A1A1A] hover:text-[#1B4332] hover:bg-[#EDE8DF] rounded-lg" onClick={() => setMobileOpen(false)}>
                Makaleler
              </Link>
              <Link href={`${prefix}/hakkimizda`} className="px-4 py-3 text-sm font-medium text-[#1A1A1A] hover:text-[#1B4332] hover:bg-[#EDE8DF] rounded-lg" onClick={() => setMobileOpen(false)}>
                Hakkımızda
              </Link>
              <Link href={`${prefix}/iletisim`} className="px-4 py-3 text-sm font-medium text-[#1A1A1A] hover:text-[#1B4332] hover:bg-[#EDE8DF] rounded-lg" onClick={() => setMobileOpen(false)}>
                İletişim
              </Link>
              <a
                href={MAIN_SITE_URL}
                target="_blank"
                rel="noopener"
                className="btn btn-primary text-sm mt-2"
              >
                Asil Halı'ya Git — Alış Veriş
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

import Link from "next/link";
import { ExternalLink, Phone, Mail, MapPin } from "lucide-react";

const MAIN_SITE_URL = "https://www.asilhali.com.tr?utm_source=camiihalisi&utm_medium=footer&utm_campaign=site";

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const prefix = locale === "tr" ? "" : `/${locale}`;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0D2418] text-[#F7F3EC]">
      {/* ── Ana Siteye Yönlendirme Bandı ── */}
      <div className="border-b border-[#C9972B]/30 py-6">
        <div className="container-site text-center">
          <p className="text-sm text-[#C9972B]/80 mb-2 uppercase tracking-widest font-semibold">
            Resmi Alış Veriş Sitesi
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
          <p className="mt-2 text-sm text-[#F7F3EC]/60">
            Fiyat teklifi, sipariş ve katalog için ana sitemizi ziyaret edin
          </p>
        </div>
      </div>

      {/* ── Footer İçerik ── */}
      <div className="container-site py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Sütun 1: Marka */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M18 2L22.9 7.1H30.9L30.9 15.1L36 18L30.9 20.9V28.9H22.9L18 34L13.1 28.9H5.1V20.9L0 18L5.1 15.1V7.1H13.1L18 2Z" fill="#2D6A4F" />
                <path d="M18 8L21.2 11.2H26.8L26.8 16.8L30 18L26.8 19.2V24.8H21.2L18 28L14.8 24.8H9.2V19.2L6 18L9.2 16.8V11.2H14.8L18 8Z" fill="#C9972B" />
                <circle cx="18" cy="18" r="4" fill="#F7F3EC" />
              </svg>
              <div>
                <div className="font-bold text-white text-base" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  CAMİİ HALISI
                </div>
                <div className="text-[10px] text-[#C9972B] uppercase tracking-widest">
                  Bilgi Portalı
                </div>
              </div>
            </div>
            <p className="text-sm text-[#F7F3EC]/70 leading-relaxed mb-4">
              Türkiye'nin köklü cami halısı üreticisi Asil Halı A.Ş.'nin bilgi ve içerik portalı.
              İbadete özel halı çözümleri hakkında kapsamlı rehberler.
            </p>
            {/* İslami alıntı */}
            <div className="border-l-2 border-[#C9972B]/50 pl-3 mt-4">
              <p className="text-xs text-[#F7F3EC]/50 italic leading-relaxed">
                "Mescitler Allah'ındır, o hâlde Allah ile birlikte kimseye kulluk etmeyin."
              </p>
              <p className="text-[10px] text-[#C9972B]/70 mt-1">— Cin Suresi, 18. Ayet</p>
            </div>
          </div>

          {/* Sütun 2: Ürünler */}
          <div>
            <h3 className="text-sm font-bold text-[#C9972B] uppercase tracking-widest mb-4">
              Ürün Kategorileri
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "akrilik-cami-halisi", label: "Akrilik Cami Halısı" },
                { href: "yun-cami-halisi", label: "Yün Cami Halısı" },
                { href: "polipropilen-cami-halisi", label: "Polipropilen Cami Halısı" },
                { href: "polyamid-cami-halisi", label: "Polyamid Cami Halısı" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={`${prefix}/kategori/${item.href}`}
                    className="text-sm text-[#F7F3EC]/70 hover:text-[#E4B84A] transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#C9972B]/50 flex-shrink-0" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sütun 3: Bilgi */}
          <div>
            <h3 className="text-sm font-bold text-[#C9972B] uppercase tracking-widest mb-4">
              Rehberler & Makaleler
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/blog", label: "Tüm Makaleler" },
                { href: "/teknik-bilgiler/olcumlendirme", label: "Ölçümlendirme Rehberi" },
                { href: "/teknik-bilgiler/bakim", label: "Bakım & Temizlik" },
                { href: "/teknik-bilgiler/kurulum", label: "Döşeme Rehberi" },
                { href: "/sss", label: "Sık Sorulan Sorular" },
                { href: "/galeri", label: "Cami Galeri" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={`${prefix}${item.href}`}
                    className="text-sm text-[#F7F3EC]/70 hover:text-[#E4B84A] transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#C9972B]/50 flex-shrink-0" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sütun 4: İletişim */}
          <div>
            <h3 className="text-sm font-bold text-[#C9972B] uppercase tracking-widest mb-4">
              İletişim
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+902125551234"
                  className="flex items-start gap-2.5 text-sm text-[#F7F3EC]/70 hover:text-[#E4B84A] transition-colors"
                >
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#C9972B]/70" />
                  <span>+90 (212) 555 12 34</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@asilhali.com.tr"
                  className="flex items-start gap-2.5 text-sm text-[#F7F3EC]/70 hover:text-[#E4B84A] transition-colors"
                >
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#C9972B]/70" />
                  <span>info@asilhali.com.tr</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2.5 text-sm text-[#F7F3EC]/70">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#C9972B]/70" />
                  <span>İstanbul, Türkiye</span>
                </div>
              </li>
            </ul>

            <div className="mt-6">
              <a
                href={MAIN_SITE_URL}
                target="_blank"
                rel="noopener"
                className="btn btn-gold text-sm w-full justify-center"
              >
                Teklif Al — asilhali.com.tr
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Alt Bar ── */}
      <div className="border-t border-[#F7F3EC]/10 py-5">
        <div className="container-site flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#F7F3EC]/40">
          <p>
            © {year} Asil Halı A.Ş. — Bu site bir bilgi portalıdır.
            Alış veriş için:{" "}
            <a href={MAIN_SITE_URL} className="text-[#C9972B]/70 hover:text-[#C9972B]" target="_blank" rel="noopener">
              asilhali.com.tr
            </a>
          </p>
          <div className="flex items-center gap-4">
            <Link href={`${prefix}/gizlilik`} className="hover:text-[#F7F3EC]/70 transition-colors">
              Gizlilik Politikası
            </Link>
            <span>|</span>
            <Link href={`${prefix}/kullanim-sartlari`} className="hover:text-[#F7F3EC]/70 transition-colors">
              Kullanım Şartları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { ExternalLink, Phone, Mail, MapPin, MessageCircle } from "lucide-react";

const MAIN_SITE_URL = "https://www.asilhali.com.tr?utm_source=camiihalisi&utm_medium=footer&utm_campaign=site";
const WA_URL = "https://wa.me/905325551234?text=Merhaba%2C%20cami%20hal%C4%B1s%C4%B1%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.";
const INSTAGRAM_URL = "https://www.instagram.com/asilhali";
const LINKEDIN_URL = "https://www.linkedin.com/company/asilhali";

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
            <div className="flex items-center gap-2.5 mb-4">
              <svg width="38" height="38" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M20 2L25.5 8H33.5V16L40 20L33.5 24V32H25.5L20 38L14.5 32H6.5V24L0 20L6.5 16V8H14.5Z" fill="#2D6A4F"/>
                <path d="M20 9L23.8 13H29.2V18.2L33 20L29.2 21.8V27H23.8L20 31L16.2 27H10.8V21.8L7 20L10.8 18.2V13H16.2Z" fill="#C9972B"/>
                <circle cx="20" cy="20" r="5.5" fill="#1B4332"/>
                <circle cx="20" cy="20" r="2.5" fill="#F7F3EC"/>
              </svg>
              <div>
                <div className="font-bold text-white text-lg leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  CAMİİ HALISI
                </div>
                <div className="text-[11px] font-semibold" style={{ color: "#C9972B" }}>
                  by <span className="font-bold">Asil Halı</span>
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
              Cami Halısı
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/kategori/akrilik-cami-halisi", label: "Akrilik Cami Halısı" },
                { href: "/kategori/safli-akrilik-cami-halisi", label: "↳ Saflı Akrilik" },
                { href: "/kategori/gobekli-akrilik-cami-halisi", label: "↳ Göbekli Akrilik" },
                { href: "/kategori/yun-cami-halisi", label: "Yün Cami Halısı" },
                { href: "/kategori/polipropilen-cami-halisi", label: "Polipropilen Cami Halısı" },
                { href: "/kategori/polyamid-cami-halisi", label: "Polyamid Cami Halısı" },
                { href: "/kategori/ozel-desen-axminster-cami-halisi", label: "Özel Desen Axminster" },
                { href: "/kategori/kece-cami-halisi-altligi", label: "Halı Altı Malzemeleri" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={`${prefix}${item.href}`}
                    className="text-xs text-[#F7F3EC]/70 hover:text-[#E4B84A] transition-colors flex items-center gap-1.5"
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
              Kurumsal & Rehberler
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/hakkimizda", label: "Hakkımızda" },
                { href: "/referanslar", label: "Referanslar" },
                { href: "/teknik-ozellikler", label: "Teknik Özellikler" },
                { href: "/blog", label: "Blog & Makaleler" },
                { href: "/iletisim", label: "İletişim" },
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
            {/* Sosyal Medya */}
            <div className="mt-6">
              <h3 className="text-sm font-bold text-[#C9972B] uppercase tracking-widest mb-3">Sosyal Medya</h3>
              <div className="flex gap-2">
                <a href="https://wa.me/905325551234" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-[#25D366]/20 hover:bg-[#25D366]/30 rounded-lg flex items-center justify-center transition-colors" aria-label="WhatsApp">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#25D366" className="w-4 h-4">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/asilhali" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors text-xs font-bold text-[#F7F3EC]/70" aria-label="Instagram">
                  IG
                </a>
                <a href="https://www.linkedin.com/company/asilhali" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors text-xs font-bold text-[#F7F3EC]/70" aria-label="LinkedIn">
                  in
                </a>
              </div>
            </div>
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

            <div className="mt-5 space-y-2">
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-2.5 px-4 rounded-xl transition-colors text-sm w-full justify-center"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp ile Yazın
              </a>
              <a
                href={MAIN_SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold text-sm w-full justify-center"
              >
                Teklif Al — asilhali.com.tr
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="flex gap-2 pt-1">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 text-xs font-semibold bg-white/10 rounded-lg text-[#F7F3EC]/70 hover:bg-white/20 hover:text-white transition-colors">
                  Instagram
                </a>
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 text-xs font-semibold bg-white/10 rounded-lg text-[#F7F3EC]/70 hover:bg-white/20 hover:text-white transition-colors">
                  LinkedIn
                </a>
              </div>
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

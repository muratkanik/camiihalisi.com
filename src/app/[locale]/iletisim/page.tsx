"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Phone, Mail, MapPin, ExternalLink, Send, Clock } from "lucide-react";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const MAIN_SITE_URL = "https://www.asilhali.com.tr?utm_source=camiihalisi&utm_medium=iletisim";

const CONTACT_INFO = [
  {
    icon: Phone,
    title: "Telefon",
    lines: ["+90 (212) 555 12 34", "+90 (532) 555 56 78"],
    href: "tel:+902125551234",
    cta: "Hemen Ara",
  },
  {
    icon: Mail,
    title: "E-posta",
    lines: ["info@asilhali.com.tr", "satis@asilhali.com.tr"],
    href: "mailto:info@asilhali.com.tr",
    cta: "Mail Gönder",
  },
  {
    icon: MapPin,
    title: "Adres",
    lines: ["Asil Halı Fabrika ve Showroom", "İkitelli OSB, İstanbul"],
    href: "https://maps.google.com",
    cta: "Haritada Gör",
  },
  {
    icon: Clock,
    title: "Çalışma Saatleri",
    lines: ["Pzt–Cum: 08:00–18:00", "Cmt: 09:00–14:00"],
    href: null,
    cta: null,
  },
];

export default function IletisimPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", mosque: "", message: "", type: "teklif",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simüle gönderim — gerçek projede /api/contact endpoint'ine POST atılır
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <>
      <Navigation locale="tr" />

      <main id="main-content">
        {/* ── Hero ── */}
        <section className="bg-[#1B4332] py-20 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C9972B' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="container-site relative z-10">
            <nav className="flex items-center gap-2 text-sm text-white/50 mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#E4B84A]">İletişim</span>
            </nav>
            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              İletişime Geçin
            </h1>
            <p className="text-lg text-white/70 max-w-xl">
              Caminiz için ücretsiz keşif, fiyat teklifi veya teknik danışmanlık için
              aşağıdaki formu doldurun ya da doğrudan iletişime geçin.
            </p>
          </div>
        </section>

        {/* ── İçerik ── */}
        <section className="section bg-[#F7F3EC]">
          <div className="container-site">
            <div className="grid lg:grid-cols-2 gap-12">

              {/* Sol: Form */}
              <div>
                <div className="bg-white rounded-2xl border border-[#DDD8CE] p-8 shadow-sm">
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-[#1B4332]/10 flex items-center justify-center mx-auto mb-4">
                        <Send className="w-7 h-7 text-[#1B4332]" />
                      </div>
                      <h2
                        className="text-2xl font-bold text-[#1B4332] mb-2"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        Mesajınız İletildi!
                      </h2>
                      <p className="text-[#6B6355] leading-relaxed">
                        En kısa sürede sizinle iletişime geçeceğiz. Daha hızlı yanıt için{" "}
                        <a
                          href="tel:+902125551234"
                          className="text-[#1B4332] font-semibold underline"
                        >
                          bizi arayabilirsiniz
                        </a>
                        .
                      </p>
                    </div>
                  ) : (
                    <>
                      <h2
                        className="text-2xl font-bold text-[#1B4332] mb-6"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        Teklif / Danışmanlık Formu
                      </h2>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Talep türü */}
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                            Talebiniz
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { val: "teklif", label: "Fiyat Teklifi" },
                              { val: "kesif", label: "Ücretsiz Keşif" },
                              { val: "bilgi", label: "Bilgi Talebi" },
                            ].map((opt) => (
                              <button
                                key={opt.val}
                                type="button"
                                onClick={() => setForm({ ...form, type: opt.val })}
                                className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all ${
                                  form.type === opt.val
                                    ? "bg-[#1B4332] text-white border-[#1B4332]"
                                    : "bg-white text-[#6B6355] border-[#DDD8CE] hover:border-[#1B4332]/40"
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                              Adınız Soyadınız *
                            </label>
                            <input
                              type="text"
                              required
                              value={form.name}
                              onChange={(e) => setForm({ ...form, name: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl border border-[#DDD8CE] bg-[#F7F3EC] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all"
                              placeholder="Adınız"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                              Cami / Kurum Adı
                            </label>
                            <input
                              type="text"
                              value={form.mosque}
                              onChange={(e) => setForm({ ...form, mosque: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl border border-[#DDD8CE] bg-[#F7F3EC] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all"
                              placeholder="Cami adı"
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                              E-posta *
                            </label>
                            <input
                              type="email"
                              required
                              value={form.email}
                              onChange={(e) => setForm({ ...form, email: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl border border-[#DDD8CE] bg-[#F7F3EC] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all"
                              placeholder="ornek@email.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                              Telefon *
                            </label>
                            <input
                              type="tel"
                              required
                              value={form.phone}
                              onChange={(e) => setForm({ ...form, phone: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl border border-[#DDD8CE] bg-[#F7F3EC] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all"
                              placeholder="05XX XXX XX XX"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                            Mesajınız
                          </label>
                          <textarea
                            rows={4}
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-[#DDD8CE] bg-[#F7F3EC] text-[#1A1A1A] text-sm focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all resize-none"
                            placeholder="Caminizin metrekaresi, istediğiniz halı türü veya sorularınız..."
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="btn btn-primary w-full justify-center"
                        >
                          {loading ? "Gönderiliyor..." : "Gönder"}
                          <Send className="w-4 h-4" />
                        </button>

                        <p className="text-xs text-[#6B6355] text-center">
                          Bu form yalnızca bilgilendirme amaçlıdır. Resmi teklif için{" "}
                          <a href={MAIN_SITE_URL} target="_blank" rel="noopener" className="text-[#1B4332] underline font-medium">
                            asilhali.com.tr
                          </a>
                          {" "}ziyaret edin.
                        </p>
                      </form>
                    </>
                  )}
                </div>
              </div>

              {/* Sağ: İletişim bilgileri */}
              <div className="space-y-5">
                <div>
                  <span className="badge badge-gold mb-4">Direkt İletişim</span>
                  <h2 className="section-title mb-3">
                    Hemen Ulaşın
                  </h2>
                  <div className="gold-line mb-6" />
                  <p className="text-[#6B6355] leading-relaxed">
                    Asil Halı uzman ekibimiz, cami halısı projeniz için danışmanlık
                    vermek üzere hazır. Ölçüm, malzeme seçimi veya fiyat konusunda
                    hızlı yanıt için doğrudan arayabilirsiniz.
                  </p>
                </div>

                {CONTACT_INFO.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#DDD8CE] hover:border-[#C9972B]/40 transition-all"
                    >
                      <div className="w-11 h-11 rounded-xl bg-[#1B4332]/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-[#1B4332]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-[#C9972B] uppercase tracking-widest mb-1">
                          {item.title}
                        </div>
                        {item.lines.map((line, j) => (
                          <div key={j} className="text-sm text-[#1A1A1A] font-medium">{line}</div>
                        ))}
                      </div>
                      {item.href && item.cta && (
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener" : undefined}
                          className="text-xs font-semibold text-[#1B4332] hover:text-[#C9972B] transition-colors flex-shrink-0"
                        >
                          {item.cta} →
                        </a>
                      )}
                    </div>
                  );
                })}

                {/* Resmi site banner */}
                <div className="bg-[#C9972B] rounded-2xl p-5 text-[#1A1A1A]">
                  <p className="text-sm font-semibold mb-1">Resmi Alış Veriş Sitesi</p>
                  <a
                    href={MAIN_SITE_URL}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center gap-2 text-lg font-bold hover:opacity-80 transition-opacity"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    www.asilhali.com.tr
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <p className="text-xs mt-1 opacity-70">Katalog, sipariş ve fiyat teklifi için</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer locale="tr" />
    </>
  );
}

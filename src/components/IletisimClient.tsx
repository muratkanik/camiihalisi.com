"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight, Phone, Mail, MapPin, ExternalLink, Send,
  Globe, Building2, Factory, Home, Briefcase, Warehouse,
} from "lucide-react";
import type { ContactOffice } from "@/app/[locale]/admin/iletisim/types";

const TYPE_ICON: Record<string, React.ElementType> = {
  merkez: Building2, fabrika: Factory, ofis: Briefcase,
  "home-office": Home, depo: Warehouse, yurtdisi: Globe,
};
const TYPE_LABEL: Record<string, string> = {
  merkez: "Merkez", fabrika: "Fabrika", ofis: "Ofis",
  "home-office": "Temsilci", depo: "Depo", yurtdisi: "Uluslararası",
};
const TYPE_COLOR: Record<string, string> = {
  merkez: "bg-[#006064] text-white", fabrika: "bg-slate-700 text-white",
  ofis: "bg-blue-700 text-white", "home-office": "bg-emerald-700 text-white",
  depo: "bg-slate-500 text-white", yurtdisi: "bg-purple-700 text-white",
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface Props {
  settings: {
    phone: string;
    email: string;
    whatsappNumber: string;
    whatsappMessage: string;
  };
  offices: ContactOffice[];
  prefix: string;
}

export default function IletisimClient({ settings, offices, prefix }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", mosque: "", message: "", type: "teklif" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const activeOffices = offices.filter((o) => o.active);
  const byRegion = activeOffices.reduce<Record<string, ContactOffice[]>>((acc, o) => {
    (acc[o.region] = acc[o.region] ?? []).push(o);
    return acc;
  }, {});

  const waUrl = `/api/r?to=https%3A%2F%2Fwa.me%2F${settings.whatsappNumber}%3Ftext%3D${settings.whatsappMessage}&from=%2Filetisim&label=whatsapp-hero&cat=whatsapp`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/iletisim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? "Gönderim sırasında hata oluştu.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setSubmitError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content">
      {/* ── Hero ── */}
      <section className="bg-[#006064] py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C9972B' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="container-site relative z-10">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href={`${prefix}/`} className="hover:text-white transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#E4B84A]">İletişim</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            İletişime Geçin
          </h1>
          <p className="text-lg text-white/70 max-w-xl">
            Türkiye genelinde ofis ve temsilciliklerimizle, New York şubemizle hizmetinizdeyiz.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-sm font-medium transition-all">
              <Phone className="w-4 h-4" /> {settings.phone}
            </a>
            <a href={waUrl} target="_blank" rel="noopener" className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/30 rounded-xl text-white text-sm font-medium transition-all">
              <WhatsAppIcon className="w-4 h-4" /> WhatsApp
            </a>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-sm font-medium transition-all">
              <Mail className="w-4 h-4" /> {settings.email}
            </a>
          </div>
        </div>
      </section>

      {/* ── Form + Quick Info ── */}
      <section className="section bg-[#F0FDFE]">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Form */}
            <div className="bg-white rounded-2xl border border-[#B2EBF2] p-8 shadow-sm">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#006064]/10 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-7 h-7 text-[#006064]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#006064] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Mesajınız İletildi!</h2>
                  <p className="text-[#6B6355]">En kısa sürede iletişime geçeceğiz. Acil durumlar için{" "}
                    <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="text-[#006064] font-semibold underline">bizi arayın</a>.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-[#006064] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Teklif / Danışmanlık Formu
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      {[{ val: "teklif", label: "Fiyat Teklifi" }, { val: "kesif", label: "Ücretsiz Keşif" }, { val: "bilgi", label: "Bilgi Talebi" }].map((opt) => (
                        <button key={opt.val} type="button" onClick={() => setForm({ ...form, type: opt.val })}
                          className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${form.type === opt.val ? "bg-[#006064] text-white border-[#006064]" : "bg-white text-[#6B6355] border-[#B2EBF2] hover:border-[#006064]/40"}`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Adınız Soyadınız" required className="w-full px-4 py-2.5 rounded-xl border border-[#B2EBF2] bg-[#F0FDFE] text-sm focus:outline-none focus:border-[#006064] focus:ring-2 focus:ring-[#006064]/10 transition-all" />
                      <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Telefon" className="w-full px-4 py-2.5 rounded-xl border border-[#B2EBF2] bg-[#F0FDFE] text-sm focus:outline-none focus:border-[#006064] focus:ring-2 focus:ring-[#006064]/10 transition-all" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="E-posta" className="w-full px-4 py-2.5 rounded-xl border border-[#B2EBF2] bg-[#F0FDFE] text-sm focus:outline-none focus:border-[#006064] focus:ring-2 focus:ring-[#006064]/10 transition-all" />
                      <input type="text" value={form.mosque} onChange={(e) => setForm({ ...form, mosque: e.target.value })} placeholder="Cami / Kurum Adı" className="w-full px-4 py-2.5 rounded-xl border border-[#B2EBF2] bg-[#F0FDFE] text-sm focus:outline-none focus:border-[#006064] focus:ring-2 focus:ring-[#006064]/10 transition-all" />
                    </div>
                    <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required placeholder="Caminizin metrekaresi, istediğiniz halı türü veya sorularınız..." className="w-full px-4 py-2.5 rounded-xl border border-[#B2EBF2] bg-[#F0FDFE] text-sm focus:outline-none focus:border-[#006064] focus:ring-2 focus:ring-[#006064]/10 transition-all resize-none" />
                    {submitError && (
                      <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                        ⚠ {submitError}
                      </div>
                    )}
                    <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center">
                      {loading ? "Gönderiliyor..." : "Gönder"} <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Hızlı iletişim */}
            <div className="space-y-4">
              <div>
                <span className="badge badge-gold mb-4">Direkt İletişim</span>
                <h2 className="section-title mb-2">Hemen Ulaşın</h2>
                <div className="gold-line mb-4" />
                <p className="text-[#6B6355] text-sm leading-relaxed">
                  Kayseri merkez fabrikamız, İstanbul ofisimiz ve Türkiye genelindeki bölge temsilcilerimizle hizmetinizdeyiz.
                </p>
              </div>
              {/* WhatsApp card */}
              <a href={`/api/r?to=https%3A%2F%2Fwa.me%2F${settings.whatsappNumber}%3Ftext%3D${settings.whatsappMessage}&from=%2Filetisim&label=whatsapp-card&cat=whatsapp`} target="_blank" rel="noopener"
                className="flex items-center gap-4 p-5 bg-[#25D366] rounded-2xl text-white hover:bg-[#20b858] transition-all group">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <WhatsAppIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">WhatsApp ile Yazın</div>
                  <div className="text-white/80 text-sm">Hızlı yanıt</div>
                </div>
                <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100" />
              </a>
              {/* Email card */}
              <a href={`mailto:${settings.email}`}
                className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-[#B2EBF2] hover:border-[#C9972B]/40 transition-all">
                <div className="w-11 h-11 rounded-xl bg-[#006064]/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#006064]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#C9972B] uppercase tracking-widest mb-0.5">E-Posta</div>
                  <div className="text-sm font-medium text-[#1A1A1A]">{settings.email}</div>
                </div>
              </a>
              {/* Official site */}
              <div className="bg-[#C9972B] rounded-2xl p-5 text-[#1A1A1A]">
                <p className="text-sm font-semibold mb-1">Resmi Alışveriş &amp; Katalog</p>
                <a href="/api/r?to=https%3A%2F%2Fwww.asilhali.com.tr%3Futm_source%3Dcamiihalisi%26utm_medium%3Diletisim&from=%2Filetisim&label=main-site&cat=outbound" target="_blank" rel="noopener"
                  className="flex items-center gap-2 text-lg font-bold hover:opacity-80 transition-opacity" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  www.asilhali.com.tr <ExternalLink className="w-4 h-4" />
                </a>
                <p className="text-xs mt-1 opacity-70">Fiyat teklifi ve sipariş için</p>
              </div>
            </div>
          </div>

          {/* ── Tüm Ofisler ── */}
          {activeOffices.length > 0 && (
            <div>
              <div className="text-center mb-10">
                <span className="badge badge-gold mb-4">Lokasyonlarımız</span>
                <h2 className="section-title">Türkiye ve Dünya Genelinde</h2>
                <div className="gold-line mx-auto mt-3" />
              </div>
              {Object.entries(byRegion).map(([region, regionOffices]) => (
                <div key={region} className="mb-10">
                  <h3 className="text-sm font-bold text-[#C9972B] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="flex-1 border-t border-[#B2EBF2]" />
                    {region}
                    <span className="flex-1 border-t border-[#B2EBF2]" />
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {regionOffices.map((office) => {
                      const TypeIcon = TYPE_ICON[office.type] ?? Building2;
                      return (
                        <div key={office.id} className="bg-white rounded-2xl border border-[#B2EBF2] hover:border-[#C9972B]/40 hover:shadow-md transition-all p-5">
                          <div className="flex items-start gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${TYPE_COLOR[office.type] ?? "bg-slate-600 text-white"}`}>
                              <TypeIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-[#1A1A1A]">{office.title}</div>
                              <span className="text-xs bg-[#F0FDFE] text-[#6B6355] border border-[#B2EBF2] px-1.5 py-0.5 rounded font-medium">
                                {TYPE_LABEL[office.type] ?? office.type}
                              </span>
                            </div>
                          </div>
                          {(office.address || office.city) && (
                            <div className="flex gap-2 mb-3">
                              <MapPin className="w-3.5 h-3.5 text-[#C9972B] flex-shrink-0 mt-0.5" />
                              <div className="text-xs text-[#6B6355] leading-relaxed">
                                {office.address && <div>{office.address}</div>}
                                <div className="font-medium text-[#1A1A1A]">{office.city}{office.country && office.country !== "Türkiye" ? `, ${office.country}` : ""}</div>
                              </div>
                            </div>
                          )}
                          {office.phones.length > 0 && (
                            <div className="space-y-1.5 mb-3">
                              {office.phones.map((p, i) => (
                                <a key={i} href={`tel:${p.number.replace(/\s/g, "")}`}
                                  className="flex items-center gap-2 text-xs text-[#1A1A1A] hover:text-[#006064] transition-colors">
                                  <Phone className="w-3 h-3 text-[#006064] flex-shrink-0" />
                                  <span className="text-[#6B6355]">{p.label}:</span>
                                  <span className="font-medium">{p.number}</span>
                                </a>
                              ))}
                            </div>
                          )}
                          {office.email && (
                            <a href={`mailto:${office.email}`} className="flex items-center gap-2 text-xs text-[#1A1A1A] hover:text-[#006064] transition-colors mb-1.5">
                              <Mail className="w-3 h-3 text-[#006064] flex-shrink-0" />
                              <span>{office.email}</span>
                            </a>
                          )}
                          {office.whatsapp && (
                            <a href={`https://wa.me/${office.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener"
                              className="flex items-center gap-2 text-xs text-[#25D366] hover:opacity-80 transition-opacity mb-1.5">
                              <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                              </svg>
                              <span className="font-medium">WhatsApp ile Yaz</span>
                            </a>
                          )}
                          {office.workHours && (
                            <div className="text-xs text-[#6B6355] mt-2 pt-2 border-t border-[#B2EBF2]">{office.workHours}</div>
                          )}
                          {office.mapsUrl && (
                            <a href={office.mapsUrl} target="_blank" rel="noopener"
                              className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#006064] hover:text-[#C9972B] transition-colors">
                              <MapPin className="w-3 h-3" /> Yol Tarifi Al →
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";

interface TrafikData {
  today: number;
  week: number;
  month: number;
  total: number;
  whatsappCount: number;
  siteCount: number;
  byPage:     { fromPage: string; label: string; count: number }[];
  byLabel:    { label: string; count: number }[];
  byCategory: { category: string; count: number }[];
  byCountry:  { code: string; name: string; flag: string; count: number }[];
  byCity:     { city: string; count: number }[];
  byDevice:   { device: string; count: number }[];
  byBrowser:  { browser: string; count: number }[];
  byRef:      { domain: string; count: number }[];
  recent: {
    fromPage: string; toUrl: string; label: string; category: string;
    country?: string; city?: string; device?: string; browser?: string;
    refDomain?: string; createdAt: string;
  }[];
}

const PERIODS = [
  { key: "today", label: "Bugün" },
  { key: "week",  label: "7 Gün" },
  { key: "month", label: "30 Gün" },
  { key: "all",   label: "Tümü" },
];

const DEVICE_ICON: Record<string, string> = {
  mobile: "📱", tablet: "🖥️", desktop: "💻",
};
const BROWSER_ICON: Record<string, string> = {
  chrome: "🟢", safari: "🔵", firefox: "🦊", edge: "🟦", opera: "🔴", ie: "⬛", other: "⬜",
};
const CAT_ICON: Record<string, string> = {
  outbound: "🔗", whatsapp: "💬", phone: "📞", form: "📋",
};

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#B2EBF2] p-5 flex flex-col gap-1">
      <span className="text-xs text-[#6B6355] uppercase tracking-widest font-semibold">{label}</span>
      <span className="text-3xl font-bold text-[#006064]">{value.toLocaleString("tr-TR")}</span>
      {sub && <span className="text-xs text-[#6B6355]">{sub}</span>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-bold text-[#006064] uppercase tracking-widest mb-3 mt-6 flex items-center gap-2">
      {children}
    </h2>
  );
}

export default function TrafikPage() {
  const [period, setPeriod] = useState("week");
  const [data, setData] = useState<TrafikData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/trafik?period=${period}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [period]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Başlık */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Trafik Takip
          </h1>
          <p className="text-sm text-[#6B6355] mt-0.5">
            asilhali.com.tr yönlendirme & ziyaretçi verileri
          </p>
        </div>
        {/* Dönem seçici */}
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                period === p.key
                  ? "bg-[#006064] text-white border-[#006064]"
                  : "bg-white text-[#6B6355] border-[#B2EBF2] hover:border-[#006064]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-[#6B6355]">
          Yükleniyor…
        </div>
      ) : !data ? (
        <div className="text-red-500 py-12 text-center">Veri alınamadı</div>
      ) : (
        <>
          {/* ── Özet Kartlar ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Bugün" value={data.today} />
            <StatCard label="7 Gün" value={data.week} />
            <StatCard label="30 Gün" value={data.month} />
            <StatCard label="Toplam" value={data.total} />
          </div>

          {/* WA vs Site */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <StatCard
              label="💬 WhatsApp Tıklaması"
              value={data.whatsappCount}
              sub="Bu dönem WhatsApp bağlantısı"
            />
            <StatCard
              label="🔗 Site Yönlendirme"
              value={data.siteCount}
              sub="Bu dönem asilhali.com.tr"
            />
          </div>

          {/* ── Ülkeler + Şehirler ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            <div>
              <SectionTitle>🌍 Ülkeler</SectionTitle>
              {data.byCountry.length === 0 ? (
                <p className="text-xs text-[#6B6355]">Henüz veri yok</p>
              ) : (
                <div className="bg-white rounded-2xl border border-[#B2EBF2] overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#F0FDFE] text-[#006064] text-xs font-semibold">
                        <th className="text-left px-4 py-2.5">Ülke</th>
                        <th className="text-right px-4 py-2.5">Tıklama</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.byCountry.map((r) => (
                        <tr key={r.code} className="border-t border-[#F0FDFE] hover:bg-[#F0FDFE]/50">
                          <td className="px-4 py-2.5 font-medium">
                            <span className="mr-2">{r.flag}</span>{r.name}
                          </td>
                          <td className="px-4 py-2.5 text-right font-bold text-[#006064]">{r.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div>
              <SectionTitle>🇹🇷 Türkiye Şehirleri</SectionTitle>
              {data.byCity.length === 0 ? (
                <p className="text-xs text-[#6B6355]">Henüz veri yok</p>
              ) : (
                <div className="bg-white rounded-2xl border border-[#B2EBF2] overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#F0FDFE] text-[#006064] text-xs font-semibold">
                        <th className="text-left px-4 py-2.5">Şehir</th>
                        <th className="text-right px-4 py-2.5">Tıklama</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.byCity.map((r) => (
                        <tr key={r.city} className="border-t border-[#F0FDFE] hover:bg-[#F0FDFE]/50">
                          <td className="px-4 py-2.5 font-medium">{r.city}</td>
                          <td className="px-4 py-2.5 text-right font-bold text-[#006064]">{r.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* ── Cihaz + Browser + Kaynak ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
            <div>
              <SectionTitle>📱 Cihaz Türü</SectionTitle>
              <div className="bg-white rounded-2xl border border-[#B2EBF2] p-4 space-y-2">
                {data.byDevice.length === 0 ? (
                  <p className="text-xs text-[#6B6355]">Veri yok</p>
                ) : data.byDevice.map((r) => (
                  <div key={r.device} className="flex items-center justify-between">
                    <span className="text-sm capitalize">
                      {DEVICE_ICON[r.device] ?? "❓"} {r.device}
                    </span>
                    <span className="font-bold text-[#006064]">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionTitle>🌐 Tarayıcı</SectionTitle>
              <div className="bg-white rounded-2xl border border-[#B2EBF2] p-4 space-y-2">
                {data.byBrowser.length === 0 ? (
                  <p className="text-xs text-[#6B6355]">Veri yok</p>
                ) : data.byBrowser.map((r) => (
                  <div key={r.browser} className="flex items-center justify-between">
                    <span className="text-sm capitalize">
                      {BROWSER_ICON[r.browser] ?? "⬜"} {r.browser}
                    </span>
                    <span className="font-bold text-[#006064]">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionTitle>🔀 Trafik Kaynağı</SectionTitle>
              <div className="bg-white rounded-2xl border border-[#B2EBF2] p-4 space-y-2">
                {data.byRef.length === 0 ? (
                  <p className="text-xs text-[#6B6355]">Çoğunlukla direkt trafik</p>
                ) : data.byRef.map((r) => (
                  <div key={r.domain} className="flex items-center justify-between">
                    <span className="text-sm truncate max-w-[150px]">{r.domain}</span>
                    <span className="font-bold text-[#006064]">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sayfa + Etiket ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            <div>
              <SectionTitle>🏷️ Tıklanan Buton / Link</SectionTitle>
              {data.byLabel.length === 0 ? (
                <p className="text-xs text-[#6B6355]">Henüz tıklama yok</p>
              ) : (
                <div className="bg-white rounded-2xl border border-[#B2EBF2] overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#F0FDFE] text-[#006064] text-xs font-semibold">
                        <th className="text-left px-4 py-2.5">Etiket</th>
                        <th className="text-right px-4 py-2.5">Tıklama</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.byLabel.map((r) => (
                        <tr key={r.label} className="border-t border-[#F0FDFE] hover:bg-[#F0FDFE]/50">
                          <td className="px-4 py-2.5 font-mono text-xs">{r.label || "(etiket yok)"}</td>
                          <td className="px-4 py-2.5 text-right font-bold text-[#006064]">{r.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div>
              <SectionTitle>📄 Sayfa Bazlı Tıklamalar</SectionTitle>
              {data.byPage.length === 0 ? (
                <p className="text-xs text-[#6B6355]">Henüz tıklama yok</p>
              ) : (
                <div className="bg-white rounded-2xl border border-[#B2EBF2] overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#F0FDFE] text-[#006064] text-xs font-semibold">
                        <th className="text-left px-4 py-2.5">Sayfa</th>
                        <th className="text-left px-4 py-2.5">Etiket</th>
                        <th className="text-right px-4 py-2.5">Adet</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.byPage.map((r, i) => (
                        <tr key={i} className="border-t border-[#F0FDFE] hover:bg-[#F0FDFE]/50">
                          <td className="px-4 py-2 text-xs font-mono truncate max-w-[150px]">{r.fromPage}</td>
                          <td className="px-4 py-2 text-xs text-[#6B6355] truncate max-w-[120px]">{r.label}</td>
                          <td className="px-4 py-2 text-right font-bold text-[#006064]">{r.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* ── Son Tıklamalar ── */}
          <SectionTitle>🕐 Son Tıklamalar</SectionTitle>
          <div className="bg-white rounded-2xl border border-[#B2EBF2] overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#F0FDFE] text-[#006064] font-semibold">
                  <th className="text-left px-3 py-2.5">Zaman</th>
                  <th className="text-left px-3 py-2.5">Sayfa</th>
                  <th className="text-left px-3 py-2.5">Etiket</th>
                  <th className="text-left px-3 py-2.5">Tür</th>
                  <th className="text-left px-3 py-2.5">Ülke / Şehir</th>
                  <th className="text-left px-3 py-2.5">Cihaz</th>
                  <th className="text-left px-3 py-2.5">Kaynak</th>
                </tr>
              </thead>
              <tbody>
                {data.recent.map((r, i) => (
                  <tr key={i} className="border-t border-[#F0FDFE] hover:bg-[#F0FDFE]/40">
                    <td className="px-3 py-2 whitespace-nowrap text-[#6B6355]">
                      {new Date(r.createdAt).toLocaleString("tr-TR", {
                        month: "short", day: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </td>
                    <td className="px-3 py-2 font-mono max-w-[140px] truncate">{r.fromPage}</td>
                    <td className="px-3 py-2 max-w-[120px] truncate">{r.label}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {CAT_ICON[r.category] ?? "?"} {r.category}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {r.country ?? "?"}{r.city ? ` / ${r.city}` : ""}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {r.device ? `${DEVICE_ICON[r.device] ?? ""} ${r.device}` : "?"}
                    </td>
                    <td className="px-3 py-2 text-[#6B6355]">{r.refDomain ?? "direkt"}</td>
                  </tr>
                ))}
                {data.recent.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-[#6B6355]">
                      Henüz tıklama kaydı yok
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

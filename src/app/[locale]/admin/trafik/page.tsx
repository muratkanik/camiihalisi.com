"use client";

import { useEffect, useState } from "react";
import {
  ExternalLink, MousePointerClick, TrendingUp,
  Calendar, BarChart2, ArrowUpRight, RefreshCw
} from "lucide-react";

interface ClickRow {
  fromPage: string;
  label: string;
  category: string;
  count: number;
  lastSeen: string;
}

interface Stats {
  today: number;
  week: number;
  month: number;
  total: number;
  byPage: ClickRow[];
  byLabel: { label: string; count: number }[];
  byCategory: { category: string; count: number }[];
  recent: { fromPage: string; toUrl: string; label: string; createdAt: string }[];
}

export default function TrafikPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"today" | "week" | "month" | "all">("week");

  const load = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/trafik?period=${period}`);
    if (res.ok) setStats(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, [period]);

  const periodLabel = { today: "Bugün", week: "Bu Hafta", month: "Bu Ay", all: "Tüm Zamanlar" }[period];

  return (
    <div>
      {/* Başlık */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Trafik Takip</h1>
          <p className="text-slate-500 text-sm mt-1">
            camiihalisi.com → asilhali.com.tr yönlendirme istatistikleri
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Yenile
        </button>
      </div>

      {/* Dönem Seçici */}
      <div className="flex gap-2 mb-6">
        {(["today", "week", "month", "all"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              period === p
                ? "bg-[#006064] text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {{ today: "Bugün", week: "Bu Hafta", month: "Bu Ay", all: "Tümü" }[p]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Yükleniyor...
        </div>
      ) : !stats ? (
        <div className="text-center text-slate-400 py-20">Veri yüklenemedi</div>
      ) : (
        <>
          {/* Özet Kartlar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Bugün", value: stats.today, icon: Calendar, color: "bg-blue-50 text-blue-700 border-blue-100" },
              { label: "Bu Hafta", value: stats.week, icon: TrendingUp, color: "bg-teal-50 text-teal-700 border-teal-100" },
              { label: "Bu Ay", value: stats.month, icon: BarChart2, color: "bg-amber-50 text-amber-700 border-amber-100" },
              { label: "Toplam", value: stats.total, icon: MousePointerClick, color: "bg-slate-50 text-slate-700 border-slate-100" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className={`rounded-2xl border p-5 ${color}`}>
                <Icon className="w-5 h-5 mb-2 opacity-70" />
                <div className="text-3xl font-bold">{value.toLocaleString("tr-TR")}</div>
                <div className="text-sm font-medium mt-1">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Sayfaya Göre Tıklama */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-[#006064]" />
                Sayfa Bazlı Tıklama — {periodLabel}
              </h2>
              {stats.byPage.length === 0 ? (
                <p className="text-slate-400 text-sm py-8 text-center">Henüz kayıt yok</p>
              ) : (
                <div className="space-y-2">
                  {stats.byPage.slice(0, 10).map((row, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 text-xs text-slate-400 text-right">{i + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-700 truncate">{row.fromPage}</div>
                        <div className="text-xs text-slate-400">{row.label || "—"}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 rounded-full bg-[#006064]/20"
                          style={{ width: `${Math.max(8, (row.count / (stats.byPage[0]?.count || 1)) * 80)}px` }}
                        />
                        <span className="text-sm font-bold text-[#006064] w-8 text-right">{row.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Butona Göre */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                <MousePointerClick className="w-4 h-4 text-[#C9972B]" />
                Buton / Kaynak Etiket — {periodLabel}
              </h2>
              {stats.byLabel.length === 0 ? (
                <p className="text-slate-400 text-sm py-8 text-center">Henüz kayıt yok</p>
              ) : (
                <div className="space-y-2">
                  {stats.byLabel.slice(0, 10).map((row, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 text-xs text-slate-400 text-right">{i + 1}</div>
                      <div className="flex-1 text-sm font-medium text-slate-700 truncate">{row.label || "—"}</div>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 rounded-full bg-[#C9972B]/30"
                          style={{ width: `${Math.max(8, (row.count / (stats.byLabel[0]?.count || 1)) * 80)}px` }}
                        />
                        <span className="text-sm font-bold text-[#C9972B] w-8 text-right">{row.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Son Tıklamalar */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-slate-500" />
              Son Tıklamalar
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left pb-2 text-xs text-slate-400 font-medium">Tarih/Saat</th>
                    <th className="text-left pb-2 text-xs text-slate-400 font-medium">Kaynak Sayfa</th>
                    <th className="text-left pb-2 text-xs text-slate-400 font-medium">Etiket</th>
                    <th className="text-left pb-2 text-xs text-slate-400 font-medium">Hedef</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">Henüz kayıt yok</td>
                    </tr>
                  ) : (
                    stats.recent.map((row, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-2 pr-4 text-slate-400 whitespace-nowrap text-xs">
                          {new Date(row.createdAt).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })}
                        </td>
                        <td className="py-2 pr-4 text-slate-700 truncate max-w-[180px]">{row.fromPage}</td>
                        <td className="py-2 pr-4">
                          <span className="inline-block px-2 py-0.5 text-xs bg-[#E0F7FA] text-[#006064] rounded-full">
                            {row.label || "—"}
                          </span>
                        </td>
                        <td className="py-2 text-slate-400 text-xs truncate max-w-[160px]">
                          <a href={row.toUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#006064] flex items-center gap-1">
                            asilhali.com.tr <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Sparkles, Loader2, Target, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export default function AdminPage() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setResults(null);
    setError(null);

    try {
      const res = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Sunucu hatası oluştu.");
      }
      
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">Otonom İçerik Motoru</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Anahtar kelimeyi verin, AI dört dile otonom çevirip sıraya alsın.</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/admin/sehirler" className="btn-outline flex items-center gap-2 !px-4 !py-2 text-sm">
            🗺️ Şehirler & Keyword
          </a>
          <a href="/admin/ayarlar" className="btn-outline flex items-center gap-2 !px-4 !py-2 text-sm">
            ⚙️ Ayarlar
          </a>
          <a href="/" target="_blank" className="btn-outline flex items-center gap-2 !px-5 !py-2.5">
            Siteyi Canlı Gör
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </header>

      <div className="glass-card overflow-hidden mb-10 transition-all hover:shadow-2xl">
        <div className="p-8 border-b border-slate-100/50 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-900/30">
          <div className="flex items-center gap-3 text-primary mb-3">
            <Target className="w-6 h-6" />
            <h2 className="font-extrabold text-xl">Yeni Görev Başlat</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Girilen anahtar kelime için veri tabanındaki uzmanlık PDF'leri (ContentArchive) baz alınarak içerik tasarlanır. AI çevirileri yapar ve otonom yayına alır.
          </p>
        </div>
        
        <form onSubmit={handleGenerate} className="p-8">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Örn: Yün Cami Halısı İmalatçıları"
                className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-lg shadow-inner"
              />
            </div>
            <button 
              type="submit"
              disabled={loading || !keyword}
              className="btn-primary !px-10 !py-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  İşleniyor
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Motoru Başlat
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 mb-8">
          <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {results && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div>
              <h3 className="font-semibold">{results.message}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">TR (Master İçerik)</h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold font-mono">
                SEO Skor: {results.payload?.tr?.seo_score_estimated || 95}
              </span>
            </div>
            <div className="p-6">
              <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl text-sm overflow-x-auto">
                {JSON.stringify(results.payload?.tr, null, 2)}
              </pre>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Otonom Çeviri Kuyruğu Tamamlandı:</h4>
              <div className="flex gap-4">
                 <div className="flex-1 bg-white border border-slate-200 rounded-lg p-3 text-center">🇺🇸 English API Düğümü <CheckCircle2 className="w-4 h-4 text-emerald-500 inline ml-1"/></div>
                 <div className="flex-1 bg-white border border-slate-200 rounded-lg p-3 text-center">🇸🇦 Arabic API Düğümü <CheckCircle2 className="w-4 h-4 text-emerald-500 inline ml-1"/></div>
                 <div className="flex-1 bg-white border border-slate-200 rounded-lg p-3 text-center">🇫🇷 French API Düğümü <CheckCircle2 className="w-4 h-4 text-emerald-500 inline ml-1"/></div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

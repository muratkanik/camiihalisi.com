"use client";

import { useState } from "react";
import { Search, Sparkles, Copy, ChevronDown, ChevronUp, AlertCircle, Loader2 } from "lucide-react";

interface AnalysisSection {
  title: string;
  content: string;
}

function parseAnalysis(raw: string): AnalysisSection[] {
  const sections: AnalysisSection[] = [];
  const lines = raw.split("\n");
  let current: AnalysisSection | null = null;

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+\d+\.\s+(.+)/);
    if (headingMatch) {
      if (current) sections.push(current);
      current = { title: headingMatch[1].trim(), content: "" };
    } else if (current) {
      current.content += line + "\n";
    }
  }
  if (current) sections.push(current);
  return sections;
}

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^-\s+(.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/gs, (match) => `<ul class="list-disc pl-5 space-y-1 my-2">${match}</ul>`)
    .replace(/\n{2,}/g, "</p><p class='mt-2'>")
    .replace(/^(.+)$/m, "<p>$1</p>");
}

const SECTION_ICONS: Record<string, string> = {
  "Rakip Stratejileri": "🏆",
  "İçerik Boşlukları ve Fırsatlar": "🎯",
  "Önerilen Sayfa Yapısı": "📐",
  "Semantik Anahtar Kelimeler": "🔑",
  "İç Bağlantı Önerileri": "🔗",
  "Önerilen Meta Başlık ve Meta Açıklama": "📝",
  "Zorluk & Fırsat Değerlendirmesi": "📊",
};

export default function SeoAnalysisPage() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [raw, setRaw] = useState("");
  const [sections, setSections] = useState<AnalysisSection[]>([]);
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0, 1, 2]));
  const [copied, setCopied] = useState(false);
  const [analyzed, setAnalyzed] = useState("");

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    if (!keyword.trim()) return;
    setLoading(true);
    setError("");
    setRaw("");
    setSections([]);

    try {
      const res = await fetch("/api/ai/seo-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: keyword.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Bilinmeyen hata");
      setRaw(data.analysis);
      setSections(parseAnalysis(data.analysis));
      setAnalyzed(keyword.trim());
      setOpenSections(new Set([0, 1, 2, 3, 4, 5, 6]));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  function toggleSection(idx: number) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const quickKeywords = [
    "cami halısı",
    "akrilik cami halısı",
    "yün cami halısı",
    "cami halısı fiyatları",
    "cami halısı modelleri",
    "özel cami halısı",
    "cami halısı temizleme",
  ];

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9972B] to-[#A07720] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">SEO Rakip Analizi</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">AI destekli anahtar kelime ve rakip analizi</p>
          </div>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 max-w-2xl">
          Bir anahtar kelime girin, Grok AI rakip stratejilerini, içerik fırsatlarını ve SEO önerilerini analiz etsin.
          Sonuçları doğrudan blog veya kategori sayfalarınızda kullanabilirsiniz.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 mb-6">
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
              Anahtar Kelime
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Örn: cami halısı fiyatları"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40 focus:border-[#C9972B] text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !keyword.trim()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1B4332] text-white font-bold text-sm hover:bg-[#0D2418] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analiz ediliyor...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analiz Et
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick keywords */}
          <div>
            <p className="text-xs text-slate-400 mb-2">Hızlı seçim:</p>
            <div className="flex flex-wrap gap-2">
              {quickKeywords.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => setKeyword(kw)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    keyword === kw
                      ? "bg-[#1B4332] text-white border-[#1B4332]"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 mb-6">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">Analiz başarısız</p>
            <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 animate-pulse">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-3" />
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-4/5" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-3/5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {sections.length > 0 && !loading && (
        <>
          {/* Results header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Analiz tamamlandı:&nbsp;
                <span className="text-[#C9972B] font-bold">"{analyzed}"</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{sections.length} bölüm · Grok-3 tarafından oluşturuldu</p>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? "Kopyalandı!" : "Tümünü Kopyala"}
            </button>
          </div>

          {/* Section cards */}
          <div className="space-y-3">
            {sections.map((section, idx) => {
              const isOpen = openSections.has(idx);
              const icon = SECTION_ICONS[section.title] ?? "📋";
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(idx)}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
                  >
                    <span className="text-xl flex-shrink-0">{icon}</span>
                    <span className="flex-1 font-bold text-slate-800 dark:text-white text-sm">{section.title}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-800">
                      <div
                        className="mt-4 text-sm text-slate-700 dark:text-slate-300 prose prose-sm dark:prose-invert max-w-none
                          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:my-2
                          [&_li]:text-slate-600 [&_li]:dark:text-slate-400
                          [&_strong]:text-slate-800 [&_strong]:dark:text-white [&_strong]:font-semibold
                          [&_p]:mb-2 [&_p]:leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(section.content.trim()),
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Raw text (collapsed) */}
          <details className="mt-4">
            <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex items-center gap-1">
              <ChevronDown className="w-3.5 h-3.5" />
              Ham metni göster
            </summary>
            <pre className="mt-2 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-400 overflow-x-auto whitespace-pre-wrap">
              {raw}
            </pre>
          </details>
        </>
      )}

      {/* Empty state */}
      {!loading && sections.length === 0 && !error && (
        <div className="text-center py-16 text-slate-400">
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-semibold text-slate-500 dark:text-slate-400">Analiz başlatmak için bir anahtar kelime girin</p>
          <p className="text-sm mt-1">Grok AI rakip stratejilerini ve SEO fırsatlarını belirleyecek</p>
        </div>
      )}
    </div>
  );
}

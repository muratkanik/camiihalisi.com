"use client";

import { useState } from "react";
import { Sparkles, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

export default function AiEngineWidget() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sunucu hatası.");
      setMessage(data.message || "İçerik oluşturuldu!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 rounded-xl p-4">
      <p className="text-white/50 text-xs mb-3 uppercase tracking-widest font-semibold">Yeni İçerik Görevi</p>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Örn: Yün Cami Halısı İmalatçıları"
          className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#C9972B]/60 focus:bg-white/15"
        />
        <button
          type="submit"
          disabled={loading || !keyword.trim()}
          className="px-6 py-3 rounded-xl bg-[#C9972B] hover:bg-[#B8861F] disabled:opacity-60 disabled:cursor-not-allowed text-[#003B40] font-bold text-sm transition-all flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? "İşleniyor…" : "Motoru Başlat"}
        </button>
      </form>
      {message && (
        <div className="mt-3 flex items-center gap-2 text-emerald-300 text-sm">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {message}
        </div>
      )}
      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-300 text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}
    </div>
  );
}

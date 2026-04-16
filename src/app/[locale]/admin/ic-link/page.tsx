"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Save, Loader2, RotateCcw, Link2, CheckCircle2, ExternalLink } from "lucide-react";

interface LinkMap {
  [keyword: string]: string;
}

export default function IcLinkAdminPage() {
  const [map, setMap] = useState<LinkMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newKw, setNewKw] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [addError, setAddError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/ic-link");
    const d = await res.json();
    setMap(d.map ?? {});
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSave() {
    setSaving(true);
    await fetch("/api/admin/ic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ map }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleReset() {
    if (!confirm("Varsayılan anahtar kelimelere sıfırlamak istediğinizden emin misiniz?")) return;
    setSaving(true);
    const res = await fetch("/api/admin/ic-link", { method: "DELETE" });
    const d = await res.json();
    setMap(d.map ?? {});
    setSaving(false);
  }

  function handleAdd() {
    const kw = newKw.trim().toLowerCase();
    const url = newUrl.trim();
    if (!kw) { setAddError("Anahtar kelime boş olamaz."); return; }
    if (!url) { setAddError("URL boş olamaz."); return; }
    if (!url.startsWith("/") && !url.startsWith("http")) { setAddError("URL / ile başlamalı (göreceli) veya http(s):// içermeli."); return; }
    if (map[kw]) { setAddError(`"${kw}" zaten mevcut.`); return; }
    setMap((prev) => ({ ...prev, [kw]: url }));
    setNewKw("");
    setNewUrl("");
    setAddError("");
  }

  function handleDelete(kw: string) {
    setMap((prev) => {
      const next = { ...prev };
      delete next[kw];
      return next;
    });
  }

  function handleUrlChange(kw: string, url: string) {
    setMap((prev) => ({ ...prev, [kw]: url }));
  }

  const entries = Object.entries(map).sort(([a], [b]) => a.localeCompare(b));

  const inputCls = "px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40 focus:border-[#C9972B]";

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <Link2 className="w-6 h-6 text-[#C9972B]" />
            İç Link Yönetimi
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Blog yazılarında geçen anahtar kelimeler otomatik olarak belirlenen sayfalara bağlanır.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            Varsayılana Sıfırla
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1B4332] text-white font-bold text-sm hover:bg-[#0D2418] transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? "Kaydedildi!" : "Kaydet"}
          </button>
        </div>
      </div>

      {/* How it works */}
      <div className="mb-6 px-4 py-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl text-sm text-blue-700 dark:text-blue-400">
        <strong>Nasıl çalışır?</strong> Blog yazılarında bu anahtar kelimeler ilk kez geçtiğinde, otomatik olarak belirlenen sayfaya bağlantı eklenir. Bağlantılar her paragrafta en fazla bir kez uygulanır.
      </div>

      {/* Add new */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 mb-6">
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Yeni Bağlantı Ekle
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newKw}
            onChange={(e) => { setNewKw(e.target.value); setAddError(""); }}
            placeholder="Anahtar kelime — örn: akrilik cami halısı"
            className={`${inputCls} flex-1`}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <input
            type="text"
            value={newUrl}
            onChange={(e) => { setNewUrl(e.target.value); setAddError(""); }}
            placeholder="URL — örn: /kategori/akrilik-cami-halisi"
            className={`${inputCls} flex-1`}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#C9972B] text-white font-bold text-sm hover:bg-[#B8861F] transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            Ekle
          </button>
        </div>
        {addError && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{addError}</p>}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
            Mevcut Bağlantılar ({entries.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : entries.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Link2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">Henüz bağlantı yok.</p>
            <p className="text-sm mt-1">Yukarıdaki formu kullanarak ekleyin.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {entries.map(([kw, url]) => (
              <div key={kw} className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
                {/* Keyword */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                    &ldquo;{kw}&rdquo;
                  </p>
                </div>

                {/* Arrow */}
                <span className="text-slate-300 dark:text-slate-600 text-lg flex-shrink-0">→</span>

                {/* URL input */}
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => handleUrlChange(kw, e.target.value)}
                    className={`${inputCls} w-full`}
                  />
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener"
                    title="Sayfayı Gör"
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all flex-shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(kw)}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-600 transition-all flex-shrink-0 opacity-0 group-hover:opacity-100"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-slate-400 text-center">
        Değişiklikler <strong>Kaydet</strong> butonuna basıldıktan sonra uygulanır. Blog yazıları bir sonraki yüklemede güncellenmiş bağlantıları kullanır.
      </p>
    </div>
  );
}

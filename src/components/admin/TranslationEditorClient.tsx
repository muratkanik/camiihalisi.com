"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type MessageTree = Record<string, unknown>;
type FlatMap = Record<string, string>;
type LocaleKey = "tr" | "en" | "ar" | "fr";
type NsOverrides = Record<LocaleKey, FlatMap>;
type AllOverrides = Record<string, NsOverrides>;

interface Props {
  trMessages: MessageTree;
  enMessages: MessageTree;
  arMessages: MessageTree;
  frMessages: MessageTree;
  dbOverrides: Record<string, Record<string, Record<string, string>>>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LOCALES: { key: LocaleKey; label: string; flag: string; dir: "ltr" | "rtl" }[] = [
  { key: "tr", label: "Türkçe",   flag: "🇹🇷", dir: "ltr" },
  { key: "en", label: "English",  flag: "🇬🇧", dir: "ltr" },
  { key: "ar", label: "العربية",  flag: "🇸🇦", dir: "rtl" },
  { key: "fr", label: "Français", flag: "🇫🇷", dir: "ltr" },
];

const NS_CONFIG: Record<string, { label: string; icon: string }> = {
  nav:        { label: "Navigasyon",        icon: "🧭" },
  hero:       { label: "Hero / Ana Banner", icon: "🏠" },
  categories: { label: "Kategoriler",       icon: "📦" },
  features:   { label: "Özellikler",        icon: "✨" },
  cta:        { label: "CTA / Aksiyon",     icon: "🎯" },
  stats:      { label: "İstatistikler",     icon: "📊" },
  faq:        { label: "SSS",               icon: "❓" },
  trust:      { label: "Müşteri Görüşleri", icon: "⭐" },
  blog:       { label: "Blog",              icon: "📝" },
  footer:     { label: "Footer",            icon: "🔗" },
  contact:    { label: "İletişim",          icon: "📞" },
  problem:    { label: "Problem Bölümü",    icon: "⚠️" },
  about:      { label: "Hakkımızda",        icon: "ℹ️" },
  gallery:    { label: "Galeri",            icon: "🖼️" },
  references: { label: "Referanslar",       icon: "🏛️" },
  common:     { label: "Genel",             icon: "⚙️" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function flattenTree(obj: unknown, prefix = ""): FlatMap {
  if (typeof obj !== "object" || obj === null) return {};
  const result: FlatMap = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") result[key] = v;
    else if (typeof v === "object" && v !== null)
      Object.assign(result, flattenTree(v, key));
  }
  return result;
}

function buildEdits(
  tr: MessageTree, en: MessageTree, ar: MessageTree, fr: MessageTree,
  db: Record<string, Record<string, Record<string, string>>>
): AllOverrides {
  const nsList = Array.from(new Set([...Object.keys(tr), ...Object.keys(en)]));
  const result: AllOverrides = {};
  for (const ns of nsList) {
    const base: NsOverrides = {
      tr: flattenTree(tr[ns]),
      en: flattenTree(en[ns]),
      ar: flattenTree(ar[ns]),
      fr: flattenTree(fr[ns]),
    };
    for (const loc of ["tr","en","ar","fr"] as LocaleKey[])
      Object.assign(base[loc], db[ns]?.[loc] ?? {});
    result[ns] = base;
  }
  return result;
}

// ─── Auto-resize textarea ─────────────────────────────────────────────────────

function AutoTextarea({
  value, onChange, dir, changed, placeholder,
}: {
  value: string; onChange: (v: string) => void;
  dir: "ltr" | "rtl"; changed: boolean; placeholder?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.max(72, el.scrollHeight) + "px";
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={e => onChange(e.target.value)}
      dir={dir}
      placeholder={placeholder}
      rows={2}
      className={`w-full text-sm leading-relaxed px-3 py-2 rounded-lg border transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-[#006064]/40 resize-none overflow-hidden
        ${changed
          ? "border-amber-300 bg-amber-50/60 dark:bg-amber-950/20 dark:border-amber-600/60"
          : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800"
        } dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600`}
      style={{ minHeight: 72 }}
    />
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TranslationEditorClient({
  trMessages, enMessages, arMessages, frMessages, dbOverrides,
}: Props) {

  // ── Derived file values (original JSON) ──
  const fileValues = useMemo<Record<string, Record<LocaleKey, FlatMap>>>(() => {
    const nsList = Array.from(new Set([...Object.keys(trMessages), ...Object.keys(enMessages)]));
    const r: Record<string, Record<LocaleKey, FlatMap>> = {};
    for (const ns of nsList) {
      r[ns] = {
        tr: flattenTree(trMessages[ns]),
        en: flattenTree(enMessages[ns]),
        ar: flattenTree(arMessages[ns]),
        fr: flattenTree(frMessages[ns]),
      };
    }
    return r;
  }, [trMessages, enMessages, arMessages, frMessages]);

  // ── All editable values (file + DB overrides merged) ──
  const [edits, setEdits] = useState<AllOverrides>(() =>
    buildEdits(trMessages, enMessages, arMessages, frMessages, dbOverrides)
  );

  // ── Namespace list (only those that have keys) ──
  const namespaces = useMemo(
    () => Object.keys(NS_CONFIG).filter(ns => edits[ns] && Object.keys(edits[ns]?.tr ?? {}).length > 0),
    [edits]
  );

  // ── UI state ──
  const [selectedNs, setSelectedNs] = useState<string>(namespaces[0] ?? "nav");
  const [search, setSearch]         = useState("");
  const [filter, setFilter]         = useState<"all" | "modified" | "empty">("all");
  const [saving, setSaving]         = useState(false);
  const [translating, setTranslating] = useState(false);
  const [savedAt, setSavedAt]       = useState<string | null>(null);
  const [error, setError]           = useState<string | null>(null);
  const [toast, setToast]           = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ── Namespace-level stats ──
  const nsStats = useCallback((ns: string) => {
    const allKeys = Object.keys(fileValues[ns]?.tr ?? {});
    const modified = allKeys.filter(key =>
      LOCALES.some(l =>
        (edits[ns]?.[l.key]?.[key] ?? "") !== (fileValues[ns]?.[l.key]?.[key] ?? "")
      )
    ).length;
    return { total: allKeys.length, modified };
  }, [edits, fileValues]);

  // ── Keys for selected namespace (filtered/searched) ──
  const nsKeys = useMemo(() => {
    const allKeys = Object.keys(fileValues[selectedNs]?.tr ?? {});
    return allKeys.filter(key => {
      if (search) {
        const q = search.toLowerCase();
        const inKey   = key.toLowerCase().includes(q);
        const inValue = LOCALES.some(l =>
          (edits[selectedNs]?.[l.key]?.[key] ?? "").toLowerCase().includes(q)
        );
        if (!inKey && !inValue) return false;
      }
      if (filter === "modified") return LOCALES.some(l =>
        (edits[selectedNs]?.[l.key]?.[key] ?? "") !== (fileValues[selectedNs]?.[l.key]?.[key] ?? "")
      );
      if (filter === "empty") return LOCALES.some(l => !(edits[selectedNs]?.[l.key]?.[key]));
      return true;
    });
  }, [selectedNs, search, filter, edits, fileValues]);

  // ── Handlers ──
  const handleChange = useCallback((locale: LocaleKey, key: string, value: string) => {
    setEdits(prev => ({
      ...prev,
      [selectedNs]: {
        ...prev[selectedNs],
        [locale]: { ...prev[selectedNs][locale], [key]: value },
      },
    }));
    setSavedAt(null);
    setError(null);
  }, [selectedNs]);

  const handleReset = useCallback((locale: LocaleKey, key: string) => {
    const original = fileValues[selectedNs]?.[locale]?.[key] ?? "";
    handleChange(locale, key, original);
  }, [selectedNs, fileValues, handleChange]);

  const handleCopyFromTr = useCallback((locale: LocaleKey, key: string) => {
    const trVal = edits[selectedNs]?.tr?.[key] ?? "";
    handleChange(locale, key, trVal);
  }, [selectedNs, edits, handleChange]);

  const handleSave = async (ns?: string) => {
    const target = ns ?? selectedNs;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/ceviri", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overrides: { [target]: edits[target] } }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }
      const time = new Date().toLocaleTimeString("tr-TR");
      setSavedAt(time);
      showToast(`✓ "${NS_CONFIG[target]?.label ?? target}" ${time} kaydedildi`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kayıt hatası");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/ceviri", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overrides: edits }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const time = new Date().toLocaleTimeString("tr-TR");
      setSavedAt(time);
      showToast(`✓ Tüm içerikler ${time} kaydedildi`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kayıt hatası");
    } finally {
      setSaving(false);
    }
  };

  const handleAiTranslate = async () => {
    setTranslating(true);
    setError(null);
    try {
      const keys = Object.keys(fileValues[selectedNs]?.tr ?? {});
      const content: FlatMap = {};
      for (const key of keys)
        content[key] = edits[selectedNs]?.tr[key] ?? fileValues[selectedNs]?.tr[key] ?? "";

      const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ namespace: selectedNs, content, targetLocales: ["en","ar","fr"] }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const translated: Partial<Record<LocaleKey, FlatMap>> = await res.json();

      setEdits(prev => {
        const updated = { ...prev[selectedNs] };
        for (const loc of ["en","ar","fr"] as LocaleKey[]) {
          if (translated[loc] && !("_error" in (translated[loc] as object)))
            updated[loc] = { ...updated[loc], ...translated[loc] };
        }
        return { ...prev, [selectedNs]: updated };
      });
      showToast("✨ AI çevirisi tamamlandı — kaydetmeyi unutmayın!");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Çeviri hatası");
    } finally {
      setTranslating(false);
    }
  };

  // ── Keyboard shortcut ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedNs, edits]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentStats = nsStats(selectedNs);

  // ── Render ──
  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 130px)" }}>

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#006064] text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-xl animate-in slide-in-from-top-2 duration-300">
          {toast}
        </div>
      )}

      {/* ── Global top bar ── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 rounded-t-xl">
        <p className="text-xs text-slate-500">
          Değişiklikler DB'ye kaydedilir, sayfa yenilenmeden uygulanır.
          <kbd className="ml-2 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 text-[10px] font-mono">⌘S</kbd>
          {" "}kaydet
        </p>
        <div className="flex items-center gap-2">
          {error && (
            <span className="text-xs text-red-500 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-lg border border-red-200 dark:border-red-700">
              ⚠ {error}
            </span>
          )}
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#C9972B] text-white hover:bg-[#B8821E] disabled:opacity-50 transition-colors shadow-sm"
          >
            {saving ? <><Spinner /> Kaydediliyor...</> : "💾 Tümünü Kaydet"}
          </button>
        </div>
      </div>

      {/* ── Main panel ── */}
      <div className="flex flex-1 overflow-hidden border-x border-b border-slate-200 dark:border-slate-700 rounded-b-xl">

        {/* ── Left sidebar: Namespace list ── */}
        <aside className="w-52 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-slate-900 px-3 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bölümler</p>
          </div>
          <nav className="p-2 space-y-0.5">
            {namespaces.map(ns => {
              const info  = NS_CONFIG[ns] ?? { label: ns, icon: "📄" };
              const stats = nsStats(ns);
              const active = selectedNs === ns;
              return (
                <button
                  key={ns}
                  onClick={() => { setSelectedNs(ns); setSearch(""); setFilter("all"); setSavedAt(null); }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center justify-between ${
                    active
                      ? "bg-[#006064] text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="flex-shrink-0">{info.icon}</span>
                    <span className="text-xs font-medium truncate">{info.label}</span>
                  </span>
                  {stats.modified > 0 && (
                    <span className={`flex-shrink-0 ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      active ? "bg-white/25 text-white" : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400"
                    }`}>
                      {stats.modified}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ── Right: content area ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">

          {/* ── Namespace toolbar ── */}
          <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white truncate">
                {NS_CONFIG[selectedNs]?.icon} {NS_CONFIG[selectedNs]?.label ?? selectedNs}
              </h2>
              <p className="text-xs text-slate-400">
                {currentStats.total} anahtar
                {currentStats.modified > 0 && (
                  <span className="text-amber-600 dark:text-amber-400 ml-2 font-medium">
                    • {currentStats.modified} değiştirilmiş
                  </span>
                )}
                {savedAt && currentStats.modified === 0 && (
                  <span className="text-green-600 dark:text-green-400 ml-2">✓ {savedAt} kaydedildi</span>
                )}
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="search"
                placeholder="Anahtar veya metin ara..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#006064]/40 w-52"
              />
            </div>

            {/* Filter chips */}
            <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 text-xs shrink-0">
              {([
                { id: "all",      label: "Tümü" },
                { id: "modified", label: "Değişen" },
                { id: "empty",    label: "Boş" },
              ] as const).map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-3 py-1.5 font-medium transition-colors ${
                    filter === f.id
                      ? "bg-[#006064] text-white"
                      : "bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <button
              onClick={handleAiTranslate}
              disabled={translating || saving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 disabled:opacity-50 transition-colors border border-purple-200 dark:border-purple-700 shrink-0"
            >
              {translating ? <><Spinner /> Çevriliyor...</> : "✨ AI Çevir"}
            </button>
            <button
              onClick={() => handleSave()}
              disabled={saving || currentStats.modified === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#006064] text-white hover:bg-[#00474b] disabled:opacity-50 transition-colors shrink-0"
            >
              {saving ? <><Spinner /> Kaydediliyor...</> : "💾 Kaydet"}
            </button>
          </div>

          {/* ── Locale header row ── */}
          <div className="grid gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider" style={{ gridTemplateColumns: "200px 1fr 1fr 1fr 1fr" }}>
            <div>Anahtar</div>
            {LOCALES.map(l => (
              <div key={l.key} className="flex items-center gap-1.5">
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </div>
            ))}
          </div>

          {/* ── Key rows ── */}
          <div className="flex-1 overflow-y-auto">
            {nsKeys.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                <span className="text-4xl mb-3">🔍</span>
                <p className="text-sm font-medium">Sonuç bulunamadı</p>
                <p className="text-xs mt-1">Arama veya filtreyi değiştirin</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {nsKeys.map(key => {
                  const isModified = LOCALES.some(l =>
                    (edits[selectedNs]?.[l.key]?.[key] ?? "") !== (fileValues[selectedNs]?.[l.key]?.[key] ?? "")
                  );
                  return (
                    <div
                      key={key}
                      className={`grid gap-3 px-4 py-3 items-start transition-colors ${
                        isModified
                          ? "bg-amber-50/70 dark:bg-amber-950/10"
                          : "bg-white dark:bg-slate-900"
                      } hover:bg-slate-50 dark:hover:bg-slate-800/50`}
                      style={{ gridTemplateColumns: "200px 1fr 1fr 1fr 1fr" }}
                    >
                      {/* Key label */}
                      <div className="pt-2 pr-2">
                        <code className="text-[11px] font-mono text-slate-500 dark:text-slate-400 break-all leading-relaxed">
                          {key}
                        </code>
                        {isModified && (
                          <div className="mt-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">değiştirildi</span>
                          </div>
                        )}
                      </div>

                      {/* Locale editors */}
                      {LOCALES.map(l => {
                        const val      = edits[selectedNs]?.[l.key]?.[key] ?? "";
                        const original = fileValues[selectedNs]?.[l.key]?.[key] ?? "";
                        const changed  = val !== original;
                        return (
                          <div key={l.key} className="space-y-1.5">
                            <AutoTextarea
                              value={val}
                              onChange={v => handleChange(l.key, key, v)}
                              dir={l.dir}
                              changed={changed}
                              placeholder={original || "(boş)"}
                            />
                            {/* Per-field toolbar */}
                            <div className="flex items-center justify-between px-0.5">
                              <span className="text-[10px] text-slate-300 dark:text-slate-600">
                                {val.length} k
                              </span>
                              <div className="flex items-center gap-2">
                                {l.key !== "tr" && (
                                  <button
                                    onClick={() => handleCopyFromTr(l.key, key)}
                                    title="TR değerini kopyala"
                                    className="text-[10px] text-slate-400 hover:text-[#006064] dark:hover:text-[#4DB6AC] transition-colors"
                                  >
                                    ← TR
                                  </button>
                                )}
                                {changed && (
                                  <button
                                    onClick={() => handleReset(l.key, key)}
                                    title="Orijinal değere sıfırla"
                                    className="text-[10px] text-amber-500 hover:text-red-500 transition-colors"
                                  >
                                    ↩ sıfırla
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useCallback, useMemo } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

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

// ─── Constants ───────────────────────────────────────────────────────────────

const LOCALES: { key: LocaleKey; label: string; flag: string; dir: "ltr" | "rtl" }[] = [
  { key: "tr", label: "Türkçe", flag: "🇹🇷", dir: "ltr" },
  { key: "en", label: "English", flag: "🇬🇧", dir: "ltr" },
  { key: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl" },
  { key: "fr", label: "Français", flag: "🇫🇷", dir: "ltr" },
];

const NS_LABELS: Record<string, string> = {
  nav: "🧭 Navigasyon",
  hero: "🏠 Hero / Ana Banner",
  categories: "📦 Kategoriler",
  features: "✨ Özellikler",
  cta: "🎯 CTA / Aksiyon",
  stats: "📊 İstatistikler",
  faq: "❓ SSS",
  trust: "⭐ Müşteri Görüşleri",
  blog: "📝 Blog",
  footer: "🔗 Footer",
  contact: "📞 İletişim",
  about: "ℹ️ Hakkımızda",
  gallery: "🖼️ Galeri",
  references: "🏛️ Referanslar",
  common: "⚙️ Genel",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function flattenTree(obj: unknown, prefix = ""): FlatMap {
  if (typeof obj !== "object" || obj === null) return {};
  const result: FlatMap = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") {
      result[key] = v;
    } else if (typeof v === "object" && v !== null) {
      Object.assign(result, flattenTree(v, key));
    }
  }
  return result;
}

function buildInitialEdits(
  tr: MessageTree,
  en: MessageTree,
  ar: MessageTree,
  fr: MessageTree,
  dbOverrides: Record<string, Record<string, Record<string, string>>>
): AllOverrides {
  const namespaces = Array.from(
    new Set([...Object.keys(tr), ...Object.keys(en)])
  );
  const result: AllOverrides = {};
  for (const ns of namespaces) {
    const base: NsOverrides = {
      tr: flattenTree(tr[ns]),
      en: flattenTree(en[ns]),
      ar: flattenTree(ar[ns]),
      fr: flattenTree(fr[ns]),
    };
    // Apply DB overrides
    for (const locale of LOCALES.map((l) => l.key)) {
      const overrideMap = dbOverrides[ns]?.[locale] ?? {};
      Object.assign(base[locale], overrideMap);
    }
    result[ns] = base;
  }
  return result;
}

// ─── Section Component ───────────────────────────────────────────────────────

interface SectionProps {
  ns: string;
  keys: string[];
  edits: NsOverrides;
  fileValues: Record<LocaleKey, FlatMap>;
  onChange: (locale: LocaleKey, key: string, value: string) => void;
  onSave: () => Promise<void>;
  onAiTranslate: () => Promise<void>;
}

function TranslationSection({
  ns,
  keys,
  edits,
  fileValues,
  onChange,
  onSave,
  onAiTranslate,
}: SectionProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasChanges = useMemo(() => {
    for (const locale of LOCALES.map((l) => l.key)) {
      for (const key of keys) {
        if ((edits[locale][key] ?? "") !== (fileValues[locale][key] ?? "")) return true;
      }
    }
    return false;
  }, [edits, fileValues, keys]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSave();
      setSavedAt(new Date().toLocaleTimeString("tr-TR"));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Kayıt hatası");
    } finally {
      setSaving(false);
    }
  };

  const handleAiTranslate = async () => {
    setTranslating(true);
    setError(null);
    try {
      await onAiTranslate();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Çeviri hatası");
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      {/* Accordion Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-800 dark:text-white">
            {NS_LABELS[ns] ?? ns}
          </span>
          <span className="text-xs text-slate-400">{keys.length} anahtar</span>
          {hasChanges && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              Kaydedilmemiş değişiklik
            </span>
          )}
          {savedAt && !hasChanges && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              ✓ {savedAt} kaydedildi
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Accordion Body */}
      {open && (
        <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          {/* Table Header */}
          <div className="grid grid-cols-[200px_1fr_1fr_1fr_1fr] gap-px bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            <div className="bg-slate-50 dark:bg-slate-900 px-3 py-2">Anahtar</div>
            {LOCALES.map((l) => (
              <div key={l.key} className="bg-slate-50 dark:bg-slate-900 px-3 py-2">
                {l.flag} {l.label}
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {keys.map((key) => (
              <div
                key={key}
                className="grid grid-cols-[200px_1fr_1fr_1fr_1fr] gap-px bg-slate-100 dark:bg-slate-800"
              >
                {/* Key */}
                <div className="bg-white dark:bg-slate-900 px-3 py-2 flex items-start">
                  <span className="text-xs font-mono text-slate-500 break-all leading-5">{key}</span>
                </div>
                {/* Locale inputs */}
                {LOCALES.map((l) => {
                  const val = edits[l.key][key] ?? "";
                  const original = fileValues[l.key][key] ?? "";
                  const changed = val !== original;
                  return (
                    <div key={l.key} className="bg-white dark:bg-slate-900 px-2 py-1.5">
                      <textarea
                        value={val}
                        onChange={(e) => onChange(l.key, key, e.target.value)}
                        dir={l.dir}
                        rows={Math.max(1, Math.ceil(val.length / 40))}
                        className={`w-full text-xs resize-none rounded border px-2 py-1 focus:outline-none focus:ring-1 transition-colors ${
                          changed
                            ? "border-amber-300 bg-amber-50 focus:ring-amber-400 dark:bg-amber-950/20 dark:border-amber-600"
                            : "border-slate-200 dark:border-slate-700 bg-transparent focus:ring-[#006064] focus:border-[#006064]"
                        } dark:text-slate-200`}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              {error && (
                <span className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 px-2 py-1 rounded">
                  ⚠ {error}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAiTranslate}
                disabled={translating}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/30 dark:text-purple-300 disabled:opacity-50 transition-colors border border-purple-200 dark:border-purple-700"
              >
                {translating ? (
                  <>
                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Çevriliyor...
                  </>
                ) : (
                  <>✨ AI ile Çevir</>
                )}
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#006064] text-white hover:bg-[#00474b] disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <>
                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Kaydediliyor...
                  </>
                ) : (
                  "💾 Kaydet"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export default function TranslationEditorClient({
  trMessages,
  enMessages,
  arMessages,
  frMessages,
  dbOverrides,
}: Props) {
  const fileValues = useMemo<Record<string, Record<LocaleKey, FlatMap>>>(() => {
    const namespaces = Array.from(new Set([...Object.keys(trMessages), ...Object.keys(enMessages)]));
    const result: Record<string, Record<LocaleKey, FlatMap>> = {};
    for (const ns of namespaces) {
      result[ns] = {
        tr: flattenTree(trMessages[ns]),
        en: flattenTree(enMessages[ns]),
        ar: flattenTree(arMessages[ns]),
        fr: flattenTree(frMessages[ns]),
      };
    }
    return result;
  }, [trMessages, enMessages, arMessages, frMessages]);

  const [edits, setEdits] = useState<AllOverrides>(() =>
    buildInitialEdits(trMessages, enMessages, arMessages, frMessages, dbOverrides)
  );

  const [globalSaving, setGlobalSaving] = useState(false);
  const [globalSavedAt, setGlobalSavedAt] = useState<string | null>(null);

  const namespaces = useMemo(
    () => Object.keys(NS_LABELS).filter((ns) => edits[ns]),
    [edits]
  );

  const handleChange = useCallback(
    (ns: string, locale: LocaleKey, key: string, value: string) => {
      setEdits((prev) => ({
        ...prev,
        [ns]: {
          ...prev[ns],
          [locale]: { ...prev[ns][locale], [key]: value },
        },
      }));
    },
    []
  );

  const handleSave = useCallback(
    async (ns: string) => {
      const overrides: AllOverrides = { [ns]: edits[ns] };
      const res = await fetch("/api/admin/ceviri", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overrides }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }
    },
    [edits]
  );

  const handleAiTranslate = useCallback(
    async (ns: string) => {
      const keys = Object.keys(fileValues[ns]?.tr ?? {});
      const content: FlatMap = {};
      for (const key of keys) {
        content[key] = edits[ns]?.tr[key] ?? fileValues[ns]?.tr[key] ?? "";
      }

      const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namespace: ns,
          content,
          targetLocales: ["en", "ar", "fr"],
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }

      const translated: Partial<Record<LocaleKey, FlatMap>> = await res.json();

      setEdits((prev) => {
        const updated = { ...prev[ns] };
        for (const locale of (["en", "ar", "fr"] as LocaleKey[])) {
          if (translated[locale] && !("_error" in translated[locale]!)) {
            updated[locale] = { ...updated[locale], ...translated[locale] };
          }
        }
        return { ...prev, [ns]: updated };
      });
    },
    [edits, fileValues]
  );

  const handleSaveAll = async () => {
    setGlobalSaving(true);
    try {
      const res = await fetch("/api/admin/ceviri", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overrides: edits }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setGlobalSavedAt(new Date().toLocaleTimeString("tr-TR"));
    } finally {
      setGlobalSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Top actions */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-slate-500">
          Değişiklikler anında yayına girer — sayfa yeniden derlenmeden DB override olarak uygulanır.
        </p>
        <div className="flex items-center gap-3">
          {globalSavedAt && (
            <span className="text-xs text-green-600 dark:text-green-400">
              ✓ Tümü {globalSavedAt} kaydedildi
            </span>
          )}
          <button
            onClick={handleSaveAll}
            disabled={globalSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[#006064] text-white hover:bg-[#00474b] disabled:opacity-50 transition-colors shadow-sm"
          >
            {globalSaving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Kaydediliyor...
              </>
            ) : (
              "💾 Tümünü Kaydet"
            )}
          </button>
        </div>
      </div>

      {/* Locale legend */}
      <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs text-slate-500">
        <span className="font-semibold">Diller:</span>
        {LOCALES.map((l) => (
          <span key={l.key} className="flex items-center gap-1">
            {l.flag} <span className="font-medium text-slate-700 dark:text-slate-300">{l.label}</span>
          </span>
        ))}
        <span className="ml-2 text-amber-600">■ Değiştirilmiş alan</span>
      </div>

      {/* Accordion sections */}
      {namespaces.map((ns) => {
        const keys = Object.keys(fileValues[ns]?.tr ?? {});
        return (
          <TranslationSection
            key={ns}
            ns={ns}
            keys={keys}
            edits={edits[ns]}
            fileValues={fileValues[ns]}
            onChange={(locale, key, value) => handleChange(ns, locale, key, value)}
            onSave={() => handleSave(ns)}
            onAiTranslate={() => handleAiTranslate(ns)}
          />
        );
      })}
    </div>
  );
}

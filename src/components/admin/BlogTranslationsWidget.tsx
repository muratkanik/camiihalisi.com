"use client";

import { useState, useEffect, useCallback } from "react";

interface TranslationFields {
  title?: string;
  excerpt?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
}

interface LocaleTranslations {
  [locale: string]: TranslationFields;
}

interface Props {
  slug: string;
  sourceTR: TranslationFields;
}

const LOCALES = [
  { key: "en", label: "English", flag: "🇬🇧" },
  { key: "ar", label: "العربية", flag: "🇸🇦" },
  { key: "fr", label: "Français", flag: "🇫🇷" },
] as const;

type LocaleKey = (typeof LOCALES)[number]["key"];

const FIELD_LABELS: Record<keyof TranslationFields, string> = {
  title: "Başlık",
  excerpt: "Özet",
  content: "İçerik",
  metaTitle: "SEO Başlık",
  metaDescription: "SEO Açıklama",
};

export default function BlogTranslationsWidget({ slug, sourceTR }: Props) {
  const [open, setOpen] = useState(false);
  const [translations, setTranslations] = useState<LocaleTranslations>({});
  const [translating, setTranslating] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState<Set<string>>(new Set());
  const [savedAt, setSavedAt] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openLocales, setOpenLocales] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Load existing translations when widget opens
  useEffect(() => {
    if (!open || loading) return;
    setLoading(true);
    fetch(`/api/admin/blog-translate?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data: LocaleTranslations) => setTranslations(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, slug]);

  const handleAiTranslate = useCallback(
    async (locale: LocaleKey) => {
      setTranslating((prev) => new Set([...prev, locale]));
      setErrors((prev) => ({ ...prev, [locale]: "" }));

      try {
        const res = await fetch("/api/admin/blog-translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            targetLocale: locale,
            fields: {
              title: sourceTR.title ?? "",
              excerpt: sourceTR.excerpt ?? "",
              content: sourceTR.content ?? "",
              metaTitle: sourceTR.metaTitle ?? sourceTR.title ?? "",
              metaDescription: sourceTR.metaDescription ?? sourceTR.excerpt ?? "",
            },
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);

        setTranslations((prev) => ({
          ...prev,
          [locale]: { ...(prev[locale] ?? {}), ...data.translation },
        }));
        setSavedAt((prev) => ({ ...prev, [locale]: new Date().toLocaleTimeString("tr-TR") }));
        setOpenLocales((prev) => new Set([...prev, locale]));
      } catch (err: unknown) {
        setErrors((prev) => ({
          ...prev,
          [locale]: err instanceof Error ? err.message : "Hata",
        }));
      } finally {
        setTranslating((prev) => {
          const next = new Set(prev);
          next.delete(locale);
          return next;
        });
      }
    },
    [slug, sourceTR]
  );

  const handleSave = useCallback(
    async (locale: LocaleKey) => {
      setSaving((prev) => new Set([...prev, locale]));
      try {
        const res = await fetch("/api/admin/blog-translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            targetLocale: locale,
            fields: translations[locale] ?? {},
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setSavedAt((prev) => ({ ...prev, [locale]: new Date().toLocaleTimeString("tr-TR") }));
      } catch (err: unknown) {
        setErrors((prev) => ({
          ...prev,
          [locale]: err instanceof Error ? err.message : "Kayıt hatası",
        }));
      } finally {
        setSaving((prev) => {
          const next = new Set(prev);
          next.delete(locale);
          return next;
        });
      }
    },
    [slug, translations]
  );

  const updateField = (locale: string, field: keyof TranslationFields, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [locale]: { ...(prev[locale] ?? {}), [field]: value },
    }));
  };

  const hasTranslation = (locale: string) => {
    const t = translations[locale];
    return t && Object.values(t).some((v) => v && v.trim());
  };

  const inputCls =
    "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#006064] focus:border-[#006064] resize-y";

  return (
    <div className="mt-4 border border-purple-200 dark:border-purple-800 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-purple-50 dark:bg-purple-950/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-purple-700 dark:text-purple-300">🌐 Çeviri Yönetimi</span>
          <div className="flex gap-1">
            {LOCALES.map((l) => (
              <span
                key={l.key}
                title={`${l.label} ${hasTranslation(l.key) ? "✓" : "⚪"}`}
                className={`text-sm ${hasTranslation(l.key) ? "grayscale-0" : "grayscale opacity-30"}`}
              >
                {l.flag}
              </span>
            ))}
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-purple-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Body */}
      {open && (
        <div className="bg-white dark:bg-slate-900">
          {loading && (
            <div className="px-4 py-3 text-xs text-slate-500 font-mono">Yükleniyor...</div>
          )}

          {LOCALES.map((locale) => {
            const isTranslating = translating.has(locale.key);
            const isSaving = saving.has(locale.key);
            const hasTrans = hasTranslation(locale.key);
            const localeOpen = openLocales.has(locale.key);
            const t = translations[locale.key] ?? {};

            return (
              <div key={locale.key} className="border-t border-slate-100 dark:border-slate-800">
                {/* Locale Header */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40">
                  <button
                    onClick={() =>
                      setOpenLocales((prev) => {
                        const next = new Set(prev);
                        if (next.has(locale.key)) next.delete(locale.key);
                        else next.add(locale.key);
                        return next;
                      })
                    }
                    className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <span>{locale.flag}</span>
                    <span>{locale.label}</span>
                    {hasTrans ? (
                      <span className="text-xs bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 px-1.5 py-0.5 rounded-full">
                        ✓ Çevrildi
                      </span>
                    ) : (
                      <span className="text-xs bg-slate-100 text-slate-400 dark:bg-slate-700 px-1.5 py-0.5 rounded-full">
                        Çevrilmedi
                      </span>
                    )}
                    {savedAt[locale.key] && (
                      <span className="text-xs text-slate-400">
                        — {savedAt[locale.key]}
                      </span>
                    )}
                  </button>
                  <div className="flex items-center gap-2">
                    {errors[locale.key] && (
                      <span className="text-xs text-red-500 max-w-[200px] truncate">
                        ⚠ {errors[locale.key]}
                      </span>
                    )}
                    <button
                      onClick={() => handleAiTranslate(locale.key)}
                      disabled={isTranslating}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-950/30 dark:text-purple-300 disabled:opacity-50 transition-colors border border-purple-200 dark:border-purple-700"
                    >
                      {isTranslating ? (
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
                  </div>
                </div>

                {/* Edit Fields (collapsed by default) */}
                {localeOpen && (
                  <div className="px-4 py-3 space-y-3 bg-white dark:bg-slate-900">
                    {(Object.keys(FIELD_LABELS) as (keyof TranslationFields)[]).map((field) => (
                      <div key={field}>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                          {FIELD_LABELS[field]}
                        </label>
                        {field === "content" ? (
                          <textarea
                            value={t[field] ?? ""}
                            onChange={(e) => updateField(locale.key, field, e.target.value)}
                            rows={6}
                            dir={locale.key === "ar" ? "rtl" : "ltr"}
                            className={inputCls}
                          />
                        ) : (
                          <input
                            type="text"
                            value={t[field] ?? ""}
                            onChange={(e) => updateField(locale.key, field, e.target.value)}
                            dir={locale.key === "ar" ? "rtl" : "ltr"}
                            className={inputCls}
                          />
                        )}
                      </div>
                    ))}
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleSave(locale.key)}
                        disabled={isSaving}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#006064] text-white hover:bg-[#00474b] disabled:opacity-50 transition-colors"
                      >
                        {isSaving ? "Kaydediliyor..." : "💾 Kaydet"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

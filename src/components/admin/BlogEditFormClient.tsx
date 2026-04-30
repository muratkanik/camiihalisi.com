"use client";

import { useState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Save, Sparkles, Loader2, CheckCircle2, X, Languages, Check } from "lucide-react";
import { saveBlogPostAction } from "@/app/[locale]/admin/blog/actions";
import type { BlogPostWithOverride } from "@/app/[locale]/admin/blog/actions";
import type { SeoScoreResult } from "@/lib/seo-scorer";
import ImagePickerField from "./ImagePickerField";
import BlogTranslationsWidget from "./BlogTranslationsWidget";

interface Props {
  post: BlogPostWithOverride;
  seoScore: SeoScoreResult | null;
}

interface SeoFix {
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  contentAddition?: string;
}

const LOCALES = [
  { key: "en", label: "İngilizce", flag: "🇬🇧" },
  { key: "de", label: "Almanca", flag: "🇩🇪" },
  { key: "ar", label: "Arapça", flag: "🇸🇦" },
  { key: "fr", label: "Fransızca", flag: "🇫🇷" },
] as const;

export default function BlogEditFormClient({ post, seoScore }: Props) {
  // ── Controlled fields ────────────────────────────────────────────────────────
  const [title, setTitle]               = useState(post.title ?? "");
  const [excerpt, setExcerpt]           = useState(post.excerpt ?? "");
  const [content, setContent]           = useState(post.content ?? "");
  const [metaTitle, setMetaTitle]       = useState(post.metaTitle ?? "");
  const [metaDescription, setMetaDesc]  = useState(post.metaDescription ?? "");
  const [seoKeywords, setSeoKeywords]   = useState(post.seoKeyword ?? post.tags?.[0] ?? "");

  // ── AI: content expand ───────────────────────────────────────────────────────
  const [expanding, setExpanding]       = useState(false);
  const [expansion, setExpansion]       = useState("");
  const [expandError, setExpandError]   = useState("");
  const [insertedWords, setInsertedWords] = useState(0);

  // ── AI: SEO fix ──────────────────────────────────────────────────────────────
  const [fixing, setFixing]             = useState(false);
  const [seoFix, setSeoFix]             = useState<SeoFix | null>(null);
  const [fixError, setFixError]         = useState("");

  // ── AI: translate ────────────────────────────────────────────────────────────
  const [translating, setTranslating]   = useState(false);
  const [translateDone, setTranslateDone] = useState<string[]>([]);
  const [translateError, setTranslateError] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  // Clear insert feedback after 4s
  useEffect(() => {
    if (!insertedWords) return;
    const t = setTimeout(() => setInsertedWords(0), 4000);
    return () => clearTimeout(t);
  }, [insertedWords]);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  function scrollTextareaToBottom() {
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        textareaRef.current.focus();
      }
    });
  }

  // ── Content expand ───────────────────────────────────────────────────────────
  async function handleExpand() {
    setExpanding(true);
    setExpansion("");
    setExpandError("");
    try {
      const primaryKw = seoKeywords.split(",")[0]?.trim() || "cami halısı";
      const res = await fetch("/api/ai/expand-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: primaryKw, currentContent: content, targetWords: 1500 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Hata");
      setExpansion(data.addition);
    } catch (err: unknown) {
      setExpandError(err instanceof Error ? err.message : "Hata");
    } finally {
      setExpanding(false);
    }
  }

  function handleInsertExpansion() {
    const words = expansion.trim().split(/\s+/).filter(Boolean).length;
    setInsertedWords(words);
    setContent((prev) => prev.trim() + "\n\n" + expansion.trim());
    setExpansion("");
    scrollTextareaToBottom();
  }

  // ── SEO Fix ──────────────────────────────────────────────────────────────────
  async function handleSeoFix() {
    setFixing(true);
    setSeoFix(null);
    setFixError("");

    // Collect issues from seoScore
    const checks = seoScore?.checks;
    const issues: { field: string; problem: string }[] = [];
    if (checks?.title?.status !== "good" && checks?.title?.note)           issues.push({ field: "title",           problem: checks.title.note });
    if (checks?.metaDescription?.status !== "good" && checks?.metaDescription?.note) issues.push({ field: "metaDescription", problem: checks.metaDescription.note });
    if (checks?.contentLength?.status !== "good" && checks?.contentLength?.note)   issues.push({ field: "content",         problem: checks.contentLength.note });
    if (checks?.keywordDensity?.status !== "good" && checks?.keywordDensity?.note)  issues.push({ field: "keywordDensity",  problem: checks.keywordDensity.note });
    if (checks?.keywordInTitle?.status !== "good" && checks?.keywordInTitle?.note)  issues.push({ field: "title",           problem: checks.keywordInTitle.note });
    if (checks?.keywordInMeta?.status !== "good" && checks?.keywordInMeta?.note)   issues.push({ field: "metaDescription", problem: checks.keywordInMeta.note });

    if (!issues.length) {
      setSeoFix({});
      setFixing(false);
      return;
    }

    try {
      const res = await fetch("/api/ai/seo-fix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: seoKeywords || "cami halısı",
          title,
          metaTitle,
          metaDescription,
          content,
          issues,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Hata");
      setSeoFix(data.fix);
    } catch (err: unknown) {
      setFixError(err instanceof Error ? err.message : "Hata");
    } finally {
      setFixing(false);
    }
  }

  function applyFix(field: keyof SeoFix) {
    if (!seoFix) return;
    if (field === "title" && seoFix.title)                   setTitle(seoFix.title);
    if (field === "metaTitle" && seoFix.metaTitle)           setMetaTitle(seoFix.metaTitle);
    if (field === "metaDescription" && seoFix.metaDescription) setMetaDesc(seoFix.metaDescription);
    if (field === "contentAddition" && seoFix.contentAddition) {
      const words = seoFix.contentAddition.trim().split(/\s+/).filter(Boolean).length;
      setInsertedWords(words);
      setContent((prev) => prev.trim() + "\n\n" + seoFix!.contentAddition!.trim());
      scrollTextareaToBottom();
    }
    setSeoFix((prev) => prev ? { ...prev, [field]: undefined } : null);
  }

  function applyAllFixes() {
    if (!seoFix) return;
    if (seoFix.title)             setTitle(seoFix.title);
    if (seoFix.metaTitle)         setMetaTitle(seoFix.metaTitle);
    if (seoFix.metaDescription)   setMetaDesc(seoFix.metaDescription);
    if (seoFix.contentAddition) {
      const words = seoFix.contentAddition.trim().split(/\s+/).filter(Boolean).length;
      setInsertedWords(words);
      setContent((prev) => prev.trim() + "\n\n" + seoFix!.contentAddition!.trim());
      scrollTextareaToBottom();
    }
    setSeoFix(null);
  }

  // ── Translate ─────────────────────────────────────────────────────────────────
  async function handleTranslateAll() {
    setTranslating(true);
    setTranslateDone([]);
    setTranslateError("");
    const fields = { title, excerpt, content, metaTitle, metaDescription };
    const done: string[] = [];
    for (const { key } of LOCALES) {
      try {
        const res = await fetch("/api/admin/blog-translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: post.slug, targetLocale: key, fields }),
        });
        if (res.ok) done.push(key);
        else {
          const d = await res.json();
          setTranslateError(d.error ?? `${key} çevirisi başarısız`);
        }
      } catch {
        setTranslateError(`${key} çevirisi başarısız`);
      }
      setTranslateDone([...done]);
    }
    setTranslating(false);
  }

  const router = useRouter();
  const actionWrapper = async (formData: FormData) => {
    try {
      await saveBlogPostAction(formData);
      alert("Makale başarıyla kaydedildi!");
      router.refresh();
    } catch (err) {
      alert("Hata oluştu: " + err);
    }
  };

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40 focus:border-[#C9972B]";

  const hasSeoIssues = seoScore?.checks && Object.values(seoScore.checks).some((c) => c?.status !== "good");
  const fixHasSuggestions = seoFix && Object.values(seoFix).some((v) => !!v);

  return (
    <>
    <form action={actionWrapper} className="space-y-4">
      <input type="hidden" name="slug" value={post.slug} />

      {/* ── SEO Optimize Bar ── */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${
          (seoScore?.total ?? 0) >= 80 
            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400"
            : (seoScore?.total ?? 0) >= 50
            ? "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400"
            : "border-red-200 bg-red-50 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400"
        }`}>
          <span>SEO:</span>
          <span className="text-sm">{seoScore?.total ?? 0}/100</span>
        </div>
        <button
          type="button"
          onClick={handleSeoFix}
          disabled={fixing || translating}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0097A7] text-white text-xs font-bold hover:bg-[#003B40] transition-colors disabled:opacity-50"
        >
          {fixing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          {fixing ? "Analiz ediliyor..." : "🤖 AI ile SEO Düzelt"}
        </button>

        <button
          type="button"
          onClick={handleExpand}
          disabled={expanding || fixing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#C9972B] text-[#C9972B] text-xs font-bold hover:bg-[#C9972B]/10 transition-colors disabled:opacity-50"
        >
          {expanding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          {expanding ? "Üretiliyor..." : "✨ İçeriği Genişlet"}
        </button>

        <button
          type="button"
          onClick={handleTranslateAll}
          disabled={translating || fixing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          {translating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Languages className="w-3.5 h-3.5" />}
          {translating ? "Çevriliyor..." : "🌐 Tüm Dillere Çevir"}
        </button>

        {/* Translate status */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {LOCALES.map(({ key, label, flag }) => (
            translateDone.includes(key) ? (
              <span key={key} className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <Check className="w-3 h-3" /> {flag} {label}
              </span>
            ) : null
          ))}
        </div>

        {translateError && (
          <span className="text-xs text-red-500">{translateError}</span>
        )}

        {hasSeoIssues && !fixing && !fixHasSuggestions && (
          <span className="text-xs text-amber-600 dark:text-amber-400 ml-auto">
            ⚠ SEO sorunları tespit edildi
          </span>
        )}
        {!hasSeoIssues && seoScore && (
          <span className="text-xs text-emerald-600 dark:text-emerald-400 ml-auto">
            ✓ SEO durumu iyi — çeviri yapabilirsiniz
          </span>
        )}
      </div>

      {/* ── SEO Fix Suggestions Panel ── */}
      {fixHasSuggestions && (
        <div className="border border-blue-200 dark:border-blue-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-blue-50 dark:bg-blue-950/20 border-b border-blue-200 dark:border-blue-800">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI SEO Önerileri
            </span>
            <div className="flex gap-2">
              <button type="button" onClick={applyAllFixes}
                className="text-xs font-bold text-blue-700 dark:text-blue-400 hover:text-blue-600 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                ✓ Tümünü Uygula
              </button>
              <button type="button" onClick={() => setSeoFix(null)}
                className="p-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="divide-y divide-blue-100 dark:divide-blue-900/30">
            {seoFix?.title && (
              <SuggestionRow label="Başlık" value={seoFix.title} onApply={() => applyFix("title")} onDismiss={() => setSeoFix(p => p ? {...p, title: undefined} : null)} />
            )}
            {seoFix?.metaTitle && (
              <SuggestionRow label="Meta Başlık" value={seoFix.metaTitle} onApply={() => applyFix("metaTitle")} onDismiss={() => setSeoFix(p => p ? {...p, metaTitle: undefined} : null)} />
            )}
            {seoFix?.metaDescription && (
              <SuggestionRow label="Meta Açıklama" value={seoFix.metaDescription} onApply={() => applyFix("metaDescription")} onDismiss={() => setSeoFix(p => p ? {...p, metaDescription: undefined} : null)} />
            )}
            {seoFix?.contentAddition && (
              <SuggestionRow label="İçerik Eki" value={seoFix.contentAddition.slice(0, 200) + (seoFix.contentAddition.length > 200 ? "…" : "")} onApply={() => applyFix("contentAddition")} onDismiss={() => setSeoFix(p => p ? {...p, contentAddition: undefined} : null)} />
            )}
          </div>
        </div>
      )}

      {/* No issues */}
      {seoFix && !fixHasSuggestions && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          Tüm SEO alanları zaten iyi durumda! Şimdi &ldquo;Tüm Dillere Çevir&rdquo; yapabilirsiniz.
        </div>
      )}

      {fixError && (
        <p className="text-xs text-red-600 dark:text-red-400 px-1">{fixError}</p>
      )}

      {/* ── Fields ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ControlledField label="Başlık" name="title" value={title} onChange={setTitle}
          note={title.length > 0 ? `${title.length} karakter` : undefined}
          status={seoScore?.checks.title.status} />
        <ImagePickerField name="image" label="Görsel" defaultValue={post.image} placeholder="/images/cami-katalog-01.png" />
      </div>

      <ControlledField label="Özet (excerpt)" name="excerpt" value={excerpt} onChange={setExcerpt} type="textarea" rows={2} />

      {/* ── Content ── */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            İçerik
            <span className="ml-2 font-normal text-slate-400 normal-case">({wordCount} kelime)</span>
            {insertedWords > 0 && (
              <span className="ml-2 text-emerald-600 dark:text-emerald-400 font-semibold animate-pulse">
                ✓ +{insertedWords} kelime eklendi
              </span>
            )}
          </label>
        </div>

        <textarea
          ref={textareaRef}
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={7}
          className={`${inputCls} resize-y transition-shadow ${insertedWords > 0 ? "ring-2 ring-emerald-400" : ""}`}
          placeholder="Blog yazısının tam içeriği..."
        />

        {expandError && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{expandError}</p>}

        {/* Content expansion preview */}
        {expansion && (
          <div className="mt-3 border border-emerald-200 dark:border-emerald-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/20 border-b border-emerald-200 dark:border-emerald-800">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> AI İçerik Hazır
                <span className="font-normal text-emerald-600 dark:text-emerald-500">
                  ({expansion.split(/\s+/).length} kelime)
                </span>
              </span>
              <div className="flex gap-2">
                <button type="button" onClick={handleInsertExpansion}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 transition-colors px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  ✓ İçeriğe Ekle
                </button>
                <button type="button" onClick={() => setExpansion("")}
                  className="p-1 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-500">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="px-4 py-3 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {expansion}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ControlledField label="Kategori" name="category" value={post.category ?? ""} onChange={() => {}} placeholder="Rehber" />
        <ControlledField label="Alt Kategori (isteğe bağlı)" name="subcategory" value={(post as any).subcategory ?? ""} onChange={() => {}} placeholder="..." />
        <ControlledField label="Yazar" name="author" value={post.author ?? ""} onChange={() => {}} placeholder="Asil Halı Uzmanları" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ControlledField label="Okuma Süresi" name="readTime" value={post.readTime ?? ""} onChange={() => {}} placeholder="3 dk" />
        <ControlledField label="Yayın Tarihi" name="publishedAt" value={post.publishedAt ?? ""} onChange={() => {}} placeholder="2025-01-15" />
      </div>

      {/* SEO Keywords */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
          SEO Anahtar Kelimeler
          <span className="ml-1 text-slate-400 font-normal normal-case">(virgülle ayırın)</span>
        </label>
        <input
          type="text"
          name="seoKeyword"
          value={seoKeywords}
          onChange={(e) => setSeoKeywords(e.target.value)}
          placeholder="cami halısı, akrilik cami halısı, halı fiyatları"
          className={inputCls}
        />
        {seoKeywords && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {seoKeywords.split(",").map((k) => k.trim()).filter(Boolean).map((kw, i) => (
              <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${i === 0 ? "bg-[#0097A7] text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                {i === 0 && "★ "}{kw}
              </span>
            ))}
          </div>
        )}
      </div>

      <ControlledField
        label="SEO Başlık (metaTitle)"
        name="metaTitle"
        value={metaTitle}
        onChange={setMetaTitle}
        note={metaTitle.length > 0 ? `${metaTitle.length} karakter` : undefined}
      />
      <ControlledField
        label="SEO Açıklama (metaDescription)"
        name="metaDescription"
        value={metaDescription}
        onChange={setMetaDesc}
        type="textarea"
        rows={2}
        note={metaDescription.length > 0 ? `${metaDescription.length} karakter` : undefined}
        status={seoScore?.checks.metaDescription.status}
      />

      {/* Yayın Durumu */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">
          Yayın Durumu
        </label>
        <div className="flex gap-4">
          {(["published", "draft"] as const).map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="radio"
                name="status"
                value={s}
                defaultChecked={(post.status ?? "published") === s}
                className="accent-[#0097A7]"
              />
              <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${
                s === "published"
                  ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
              }`}>
                {s === "published" ? "✅ Yayında" : "📝 Taslak"}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="pb-2">
        <SaveButton />
      </div>
    </form>

    <BlogTranslationsWidget
      slug={post.slug}
      sourceTR={{
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
      }}
    />
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0097A7] text-white font-bold text-sm hover:bg-[#003B40] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
      {pending ? "Kaydediliyor..." : "Kaydet & SEO Hesapla"}
    </button>
  );
}

function SuggestionRow({
  label, value, onApply, onDismiss,
}: { label: string; value: string; onApply: () => void; onDismiss: () => void }) {
  return (
    <div className="px-4 py-3 bg-white dark:bg-slate-900 flex items-start gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed break-words">{value}</p>
      </div>
      <div className="flex gap-1.5 flex-shrink-0 pt-0.5">
        <button type="button" onClick={onApply}
          className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 rounded-lg transition-colors">
          <Check className="w-3 h-3" /> Uygula
        </button>
        <button type="button" onClick={onDismiss}
          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function ControlledField({
  label, name, value, onChange, placeholder, type = "text", rows = 3, note, status,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: "text" | "textarea"; rows?: number;
  note?: string; status?: "good" | "warn" | "bad";
}) {
  const cls = "w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40 focus:border-[#C9972B]";
  const statusDot = status === "good" ? "🟢" : status === "warn" ? "🟡" : status === "bad" ? "🔴" : null;
  return (
    <div>
      <label className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
        <span>{statusDot && <span className="mr-1">{statusDot}</span>}{label}</span>
        {note && <span className="font-normal text-slate-400 normal-case">{note}</span>}
      </label>
      {type === "textarea" ? (
        <textarea name={name} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={`${cls} resize-y`} />
      ) : (
        <input type="text" name={name} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}

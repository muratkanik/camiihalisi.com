"use client";

import { useState, useRef } from "react";
import { Save, Sparkles, Loader2, CheckCircle2, Plus, X } from "lucide-react";
import { saveBlogPostAction } from "@/app/[locale]/admin/blog/actions";
import type { BlogPostWithOverride } from "@/app/[locale]/admin/blog/actions";
import type { SeoScoreResult } from "@/lib/seo-scorer";
import ImagePickerField from "./ImagePickerField";

interface Props {
  post: BlogPostWithOverride;
  seoScore: SeoScoreResult | null;
}

export default function BlogEditFormClient({ post, seoScore }: Props) {
  const [content, setContent] = useState(post.content ?? "");
  const [seoKeywords, setSeoKeywords] = useState(
    post.seoKeyword ?? post.tags?.[0] ?? ""
  );
  const [expanding, setExpanding] = useState(false);
  const [expansion, setExpansion] = useState("");
  const [expandError, setExpandError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const contentScore = seoScore?.checks.contentLength;
  const isContentShort = contentScore && contentScore.status !== "good";
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  async function handleExpand() {
    setExpanding(true);
    setExpansion("");
    setExpandError("");
    try {
      const primaryKw = seoKeywords.split(",")[0]?.trim() || "cami halısı";
      const res = await fetch("/api/ai/expand-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: primaryKw,
          currentContent: content,
          targetWords: 900,
        }),
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
    setContent((prev) => prev.trim() + "\n\n" + expansion.trim());
    setExpansion("");
  }

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40 focus:border-[#C9972B]";

  return (
    <form ref={formRef} action={saveBlogPostAction} className="space-y-4">
      <input type="hidden" name="slug" value={post.slug} />
      {/* Keep content in sync via hidden input when state changes */}
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="seoKeyword" value={seoKeywords} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Başlık" name="title" defaultValue={post.title} />
        <ImagePickerField name="image" label="Görsel" defaultValue={post.image} placeholder="/images/cami-katalog-01.png" />
      </div>

      <Field label="Özet (excerpt)" name="excerpt" defaultValue={post.excerpt} type="textarea" rows={2} />

      {/* Content with AI expand */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            İçerik
            <span className="ml-2 font-normal text-slate-400 normal-case">({wordCount} kelime)</span>
          </label>
          {isContentShort && (
            <button type="button" onClick={handleExpand} disabled={expanding}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#C9972B] hover:text-[#A07720] transition-colors disabled:opacity-50">
              {expanding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {expanding ? "Üretiliyor..." : "✨ AI ile Genişlet"}
            </button>
          )}
        </div>

        {isContentShort && (
          <div className="flex items-center gap-2 mb-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 px-3 py-2 rounded-lg">
            <span>⚠</span>
            <span>{contentScore?.note}</span>
          </div>
        )}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={7}
          className={`${inputCls} resize-y`}
          placeholder="Blog yazısının tam içeriği..."
        />

        {/* AI Expansion Preview */}
        {expandError && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">{expandError}</p>
        )}
        {expansion && (
          <div className="mt-3 border border-emerald-200 dark:border-emerald-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/20 border-b border-emerald-200 dark:border-emerald-800">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> AI Öneri Hazır
                <span className="font-normal text-emerald-600 dark:text-emerald-500">({expansion.split(/\s+/).length} kelime)</span>
              </span>
              <div className="flex gap-2">
                <button type="button" onClick={handleInsertExpansion}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 transition-colors px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Plus className="w-3 h-3" /> İçeriğe Ekle
                </button>
                <button type="button" onClick={() => setExpansion("")}
                  className="p-1 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-500 transition-all">
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
        <Field label="Kategori" name="category" defaultValue={post.category} placeholder="Rehber" />
        <Field label="Yazar" name="author" defaultValue={post.author} placeholder="Asil Halı Uzmanları" />
        <Field label="Okuma Süresi" name="readTime" defaultValue={post.readTime} placeholder="3 dk" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Yayın Tarihi" name="publishedAt" defaultValue={post.publishedAt} placeholder="2025-01-15" />
        {/* Multiple keywords field */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            SEO Anahtar Kelimeler
            <span className="ml-1 text-slate-400 font-normal normal-case">(virgülle ayırın)</span>
          </label>
          <input
            type="text"
            value={seoKeywords}
            onChange={(e) => setSeoKeywords(e.target.value)}
            placeholder="cami halısı, akrilik cami halısı, halı fiyatları"
            className={inputCls}
          />
          {seoKeywords && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {seoKeywords.split(",").map((k) => k.trim()).filter(Boolean).map((kw, i) => (
                <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${i === 0 ? "bg-[#1B4332] text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                  {i === 0 && "★ "}{kw}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <Field label="SEO Başlık (metaTitle)" name="metaTitle" defaultValue={post.metaTitle} />
      <Field label="SEO Açıklama (metaDescription)" name="metaDescription" defaultValue={post.metaDescription} type="textarea" rows={2} />

      <div className="pb-2">
        <button type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B4332] text-white font-bold text-sm hover:bg-[#0D2418] transition-all">
          <Save className="w-4 h-4" />
          Kaydet &amp; SEO Hesapla
        </button>
      </div>
    </form>
  );
}

function Field({ label, name, defaultValue, placeholder, type = "text", rows = 3 }: {
  label: string; name: string; defaultValue: string; placeholder?: string; type?: "text" | "textarea"; rows?: number;
}) {
  const cls = "w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40 focus:border-[#C9972B]";
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>
      {type === "textarea" ? (
        <textarea name={name} defaultValue={defaultValue} placeholder={placeholder} rows={rows} className={`${cls} resize-y`} />
      ) : (
        <input type="text" name={name} defaultValue={defaultValue} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}

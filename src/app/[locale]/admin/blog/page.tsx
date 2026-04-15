import { getBlogPosts, getBlogSeoScores, saveBlogPostAction, resetBlogPostAction, BlogPostWithOverride } from "./actions";
import { BookOpen, ExternalLink, ChevronRight, RotateCcw, Save } from "lucide-react";
import { BLOG_CATEGORIES } from "@/lib/blog-data";
import SeoScoreBadge from "@/components/admin/SeoScoreBadge";
import { SeoScoreResult } from "@/lib/seo-scorer";

export const dynamic = "force-dynamic";

export default async function BlogAdminPage() {
  const [posts, scores] = await Promise.all([getBlogPosts(), getBlogSeoScores()]);

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Blog Yazıları</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            {posts.length} yazı · Başlık, açıklama ve meta etiketlerini düzenleyin. SEO skoru kayıt sırasında otomatik hesaplanır.
          </p>
        </div>
        <a
          href="/blog"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          Blogu Görüntüle
        </a>
      </div>

      {BLOG_CATEGORIES.filter((c) => c !== "Tümü").map((cat) => {
        const catPosts = posts.filter((p) => p.category === cat);
        if (catPosts.length === 0) return null;
        return (
          <div key={cat} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {cat}
                <span className="text-xs font-normal text-slate-400 ml-1">({catPosts.length} yazı)</span>
              </h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {catPosts.map((post) => (
                <BlogPostRow key={post.slug} post={post} seoScore={scores[post.slug] ?? null} />
              ))}
            </div>
          </div>
        );
      })}

      {(() => {
        const others = posts.filter((p) => !BLOG_CATEGORIES.includes(p.category));
        if (others.length === 0) return null;
        return (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Diğer
                <span className="text-xs font-normal text-slate-400 ml-1">({others.length} yazı)</span>
              </h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {others.map((post) => (
                <BlogPostRow key={post.slug} post={post} seoScore={scores[post.slug] ?? null} />
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function BlogPostRow({ post, seoScore }: { post: BlogPostWithOverride; seoScore: SeoScoreResult | null }) {
  return (
    <details className="group">
      <summary className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all list-none">
        <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200 dark:border-slate-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-800 dark:text-white text-sm line-clamp-1">{post.title}</span>
            {post.hasOverride && (
              <span className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                Düzenlendi
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <span className="text-xs text-slate-400">{post.publishedAt}</span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-400">{post.readTime}</span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">{post.category}</span>
            <SeoScoreBadge score={seoScore} compact />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={`/blog/${post.slug}`}
            target="_blank"
            rel="noopener"
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <ChevronRight className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-90" />
        </div>
      </summary>

      {/* SEO Score full breakdown */}
      {seoScore && (
        <div className="px-6 pt-4 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800">
          <SeoScoreBadge score={seoScore} />
        </div>
      )}

      {/* Save form */}
      <div className="px-6 pt-4 pb-2 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800">
        <form action={saveBlogPostAction} className="space-y-4">
          <input type="hidden" name="slug" value={post.slug} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Başlık" name="title" defaultValue={post.title} />
            <Field label="Görsel URL" name="image" defaultValue={post.image} placeholder="/images/cami-katalog-01.png" />
          </div>

          <Field label="Özet (excerpt)" name="excerpt" defaultValue={post.excerpt} type="textarea" rows={2} />
          <Field label="İçerik" name="content" defaultValue={post.content} type="textarea" rows={6} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Kategori" name="category" defaultValue={post.category} placeholder="Rehber" />
            <Field label="Yazar" name="author" defaultValue={post.author} placeholder="Asil Halı Uzmanları" />
            <Field label="Okuma Süresi" name="readTime" defaultValue={post.readTime} placeholder="3 dk" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Yayın Tarihi" name="publishedAt" defaultValue={post.publishedAt} placeholder="2025-01-15" />
            <Field
              label="SEO Anahtar Kelime"
              name="seoKeyword"
              defaultValue={post.seoKeyword ?? post.tags?.[0] ?? ""}
              placeholder="cami halısı"
            />
          </div>

          <Field label="SEO Başlık (metaTitle)" name="metaTitle" defaultValue={post.metaTitle} />
          <Field label="SEO Açıklama (metaDescription)" name="metaDescription" defaultValue={post.metaDescription} type="textarea" rows={2} />

          <div className="pb-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B4332] text-white font-bold text-sm hover:bg-[#0D2418] transition-all"
            >
              <Save className="w-4 h-4" />
              Kaydet &amp; SEO Hesapla
            </button>
          </div>
        </form>
      </div>

      {/* Reset form — separate, outside save form */}
      {post.hasOverride && (
        <div className="px-6 pb-4 bg-slate-50/50 dark:bg-slate-800/20">
          <form action={resetBlogPostAction}>
            <input type="hidden" name="slug" value={post.slug} />
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Varsayılana Sıfırla
            </button>
          </form>
        </div>
      )}
    </details>
  );
}

function Field({
  label, name, defaultValue, placeholder, type = "text", rows = 3,
}: {
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

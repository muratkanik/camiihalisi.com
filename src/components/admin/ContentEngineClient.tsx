"use client";

import { useState } from "react";
import { Zap, Loader2, CheckCircle2, AlertCircle, Clock, ExternalLink } from "lucide-react";

interface AiTaskLog {
  id: string;
  keyword: string;
  targetPageSlug: string | null;
  status: string;
  logs: string | null;
  createdAt: string;
}

interface CronResult {
  isNew?: boolean;
  title?: string;
  slug?: string;
  wordCount?: number;
  elapsed?: number;
}

interface Props {
  nextKeyword: string | null;
  nextSlug: string | null;
  recentTasks: AiTaskLog[];
}

export default function ContentEngineClient({ nextKeyword, nextSlug, recentTasks: initialTasks }: Props) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<CronResult | null>(null);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState<AiTaskLog[]>(initialTasks);

  async function handleRun() {
    setRunning(true);
    setResult(null);
    setError("");
    try {
      const res = await fetch("/api/cron/content-engine");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Hata");
      setResult(data);
      // Refresh tasks
      setTimeout(() => window.location.reload(), 2000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Bilinmeyen hata");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Manuel Tetikleme Kartı */}
      <div className="bg-gradient-to-br from-[#006064] to-[#003B40] rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#C9972B] flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-[#003B40]" />
          </div>
          <div className="flex-1">
            <h3 className="font-extrabold text-lg mb-1">İçerik Motorunu Şimdi Çalıştır</h3>
            <p className="text-white/70 text-sm mb-1">
              Cron her gün 09:00'da (UTC 06:00) otomatik çalışır. Manuel test için aşağıdaki butonu kullanın.
            </p>
            {nextKeyword && (
              <p className="text-white/60 text-xs mb-4">
                Sıradaki hedef: <span className="text-[#C9972B] font-semibold">"{nextKeyword}"</span>
              </p>
            )}

            {!result && (
              <button
                type="button"
                onClick={handleRun}
                disabled={running || !nextKeyword}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C9972B] text-[#003B40] font-bold text-sm hover:bg-[#E4B84A] disabled:opacity-50 transition-all"
              >
                {running
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Üretiliyor... (~45 sn)</>
                  : <><Zap className="w-4 h-4" /> Şimdi Üret</>}
              </button>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/30 border border-red-700/40 text-red-300 text-sm mt-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {result && (
              <div className="mt-3 bg-white/10 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-green-300 font-bold mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {result.isNew ? "Yeni makale yayınlandı!" : "Mevcut makale güncellendi!"}
                </div>
                <p className="text-white/80"><span className="text-white/50">Başlık:</span> {result.title}</p>
                <p className="text-white/80"><span className="text-white/50">Kelime:</span> {result.wordCount}</p>
                <p className="text-white/80"><span className="text-white/50">Süre:</span> {result.elapsed ? Math.round(result.elapsed / 1000) : 0}s</p>
                {result.slug && (
                  <a
                    href={`/blog/${result.slug}`}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1 text-[#C9972B] hover:underline mt-1"
                  >
                    Makaleyi Görüntüle <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

            {!nextKeyword && !result && (
              <p className="text-white/50 text-sm italic mt-2">
                İçerik takvimindeki tüm hedefler tamamlandı 🎉
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Son Çalışmalar */}
      {tasks.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4" /> Son Çalışmalar
            </h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {tasks.map((task) => {
              let logObj: Record<string, unknown> | null = null;
              try { logObj = task.logs ? JSON.parse(task.logs) : null; } catch { /* ignore */ }

              return (
                <div key={task.id} className="flex items-center gap-4 px-6 py-3">
                  <div className="flex-shrink-0">
                    {task.status === "completed" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-950/20 dark:text-green-400 px-2 py-0.5 rounded-full">
                        ✓ Tamamlandı
                      </span>
                    ) : task.status === "failed" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400 px-2 py-0.5 rounded-full">
                        ✗ Hata
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400 px-2 py-0.5 rounded-full">
                        ⏳ Bekliyor
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{task.keyword}</p>
                    {logObj?.title && (
                      <p className="text-xs text-slate-400 truncate">{logObj.title as string}</p>
                    )}
                    {logObj?.wordCount && (
                      <p className="text-xs text-slate-400">{logObj.wordCount as number} kelime</p>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-xs text-slate-400">
                    {new Date(task.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </div>
                  {task.targetPageSlug && task.status === "completed" && (
                    <a href={`/blog/${task.targetPageSlug}`} target="_blank" rel="noopener"
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-all">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

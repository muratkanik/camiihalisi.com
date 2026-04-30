"use client";

import { useState, useRef, useEffect } from "react";
import { Zap, Loader2, CheckCircle2, AlertCircle, Clock, ExternalLink, X } from "lucide-react";

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

interface TerminalLine {
  id: number;
  text: string;
  type: "info" | "progress" | "stream" | "success" | "error" | "system";
}

function TermLine({ line }: { line: TerminalLine }) {
  const colors: Record<TerminalLine["type"], string> = {
    info: "text-green-400",
    progress: "text-cyan-400",
    stream: "text-green-300 opacity-80",
    success: "text-emerald-300 font-bold",
    error: "text-red-400",
    system: "text-slate-500",
  };
  const prefix: Record<TerminalLine["type"], string> = {
    info: "▶ ",
    progress: "  ",
    stream: "  ",
    success: "✓ ",
    error: "✗ ",
    system: "# ",
  };
  return (
    <div className={`font-mono text-xs leading-6 ${colors[line.type]}`}>
      <span className="opacity-60">{prefix[line.type]}</span>
      {line.text}
    </div>
  );
}

export default function ContentEngineClient({ nextKeyword, nextSlug, recentTasks: initialTasks }: Props) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<CronResult | null>(null);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState<AiTaskLog[]>(initialTasks);

  // ── Auto-Translation Terminal State ──────────────────────────────────────────
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [termLines, setTermLines] = useState<TerminalLine[]>([]);
  const [termProgress, setTermProgress] = useState(0);
  const [termRunning, setTermRunning] = useState(false);
  const lineIdRef = useRef(0);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const addLine = (text: string, type: TerminalLine["type"] = "info") => {
    setTermLines((prev) => [...prev, { id: ++lineIdRef.current, text, type }]);
  };

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [termLines]);

  async function handleRun() {
    setTerminalOpen(true);
    setTermRunning(true);
    setTermLines([]);
    setTermProgress(0);
    setError("");
    setResult(null);

    addLine("İçerik Motoru manuel olarak tetikleniyor...", "system");
    addLine("Bağlantı kuruluyor (Server-Sent Events)...", "info");

    try {
      const res = await fetch("/api/cron/content-engine");
      if (!res.body) throw new Error("ReadableStream desteklenmiyor.");
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const dataStr = line.slice(6).trim();
          if (dataStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.type === "progress") {
              addLine(parsed.message, "progress");
              if (typeof parsed.progress === "number") {
                setTermProgress(parsed.progress);
              }
            } else if (parsed.type === "error") {
              addLine(parsed.message, "error");
              setError(parsed.message);
            } else if (parsed.type === "done") {
              setResult({
                isNew: parsed.isNew,
                title: parsed.title,
                slug: parsed.slug,
                wordCount: parsed.wordCount,
                elapsed: parsed.elapsed,
              });
              if (typeof parsed.progress === "number") {
                setTermProgress(parsed.progress);
              }
            }
          } catch {
            // ignore JSON parse errors
          }
        }
      }

    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Bilinmeyen hata";
      addLine(`Bağlantı koptu veya hata oluştu: ${msg}`, "error");
      setError(msg);
    } finally {
      setTermRunning(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Manuel Tetikleme Kartı */}
      <div className="bg-gradient-to-br from-[#0097A7] to-[#003B40] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-[#C9972B] flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-[#003B40]" />
          </div>
          <div className="flex-1">
            <h3 className="font-extrabold text-lg mb-1">İçerik Motorunu Şimdi Çalıştır</h3>
            <p className="text-white/70 text-sm mb-1">
              Cron her gün 09:00'da (UTC 06:00) otomatik çalışır. Manuel test için aşağıdaki butonu kullanın.
            </p>
            {nextKeyword ? (
              <p className="text-white/60 text-xs mb-4">
                Sıradaki hedef: <span className="text-[#C9972B] font-semibold">"{nextKeyword}"</span>
              </p>
            ) : (
              <p className="text-white/60 text-xs mb-4">
                İyileştirilecek hedef aranacak...
              </p>
            )}

            {!result && (
              <button
                type="button"
                onClick={handleRun}
                disabled={termRunning}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C9972B] text-[#003B40] font-bold text-sm hover:bg-[#E4B84A] disabled:opacity-50 transition-all"
              >
                {termRunning
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Çalışıyor... (Terminali İzleyin)</>
                  : <><Zap className="w-4 h-4" /> Şimdi Çalıştır (Üret veya İyileştir)</>}
              </button>
            )}

            {error && !terminalOpen && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/30 border border-red-700/40 text-red-300 text-sm mt-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {result && !terminalOpen && (
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
          </div>
        </div>
      </div>

      {/* ── Terminal Modal ── */}
      {terminalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-slate-950 w-full max-w-3xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[600px]">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <span className="text-xs font-mono text-slate-500 ml-2">İçerik Motoru Terminali v2</span>
              </div>
              {!termRunning && (
                <button
                  type="button"
                  onClick={() => setTerminalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-black/50 scrollbar-thin scrollbar-thumb-slate-800">
              {termLines.map((line) => (
                <TermLine key={line.id} line={line} />
              ))}
              <div ref={terminalEndRef} />
            </div>

            <div className="px-4 py-4 bg-slate-900 border-t border-slate-800 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${termProgress}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-slate-400 min-w-[3ch] text-right">
                  {termProgress}%
                </span>
              </div>
              
              {!termRunning && (
                <button
                  type="button"
                  onClick={() => {
                    setTerminalOpen(false);
                    if (termProgress === 100) {
                      window.location.reload();
                    }
                  }}
                  className="w-full py-2.5 rounded-lg font-bold text-sm bg-[#C9972B] text-[#003B40] hover:bg-[#E4B84A] transition-colors"
                >
                  {termProgress === 100 ? "İşlem Başarılı — Sayfayı Yenile" : "Kapat"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
              let logObj: { title?: string; wordCount?: number } | null = null;
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
                    <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                      {logObj?.title ?? task.keyword}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="font-mono">{new Date(task.createdAt).toLocaleString("tr-TR")}</span>
                      {logObj?.wordCount && <span>· {logObj.wordCount} kelime</span>}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {task.targetPageSlug && (
                      <a
                        href={`/blog/${task.targetPageSlug}`}
                        target="_blank"
                        rel="noopener"
                        className="text-xs font-medium text-[#0097A7] hover:underline"
                      >
                        Görüntüle
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

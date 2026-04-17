"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles, X, ExternalLink, CheckCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SseEvent {
  type: "progress" | "token" | "done" | "error";
  message?: string;
  progress?: number;
  word_count?: number;
  slug?: string;
  title?: string;
  wordCount?: number;
}

interface TerminalLine {
  id: number;
  text: string;
  type: "info" | "progress" | "stream" | "success" | "error" | "system";
}

// ─── Terminal Line Component ──────────────────────────────────────────────────

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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BlogCreatorModal() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [keyword, setKeyword] = useState("");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [done, setDone] = useState<{ slug: string; title: string; wordCount: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const lineIdRef = useRef(0);
  const termRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  function addLine(text: string, type: TerminalLine["type"] = "info") {
    lineIdRef.current += 1;
    setLines((prev) => [...prev, { id: lineIdRef.current, text, type }]);
  }

  // Auto-scroll terminal
  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [lines]);

  const handleStart = useCallback(async () => {
    if (!title.trim()) return;

    setRunning(true);
    setDone(null);
    setError(null);
    setProgress(0);
    setLines([]);

    addLine(`camiihalisi.com Blog Üretici v2.0`, "system");
    addLine(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, "system");
    addLine(`Başlık  : "${title.trim()}"`, "system");
    if (keyword.trim()) addLine(`Keyword : "${keyword.trim()}"`, "system");
    addLine(`Tarih   : ${new Date().toLocaleString("tr-TR")}`, "system");
    addLine(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, "system");
    addLine(``, "system");
    addLine(`Grok-3 bağlantısı kuruluyor...`, "info");

    const abort = new AbortController();
    abortRef.current = abort;

    try {
      const res = await fetch("/api/ai/create-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), keyword: keyword.trim() }),
        signal: abort.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buffer = "";
      let lastWordCount = 0;

      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;

        buffer += dec.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;
          const raw = part.slice(6).trim();
          let event: SseEvent;
          try {
            event = JSON.parse(raw);
          } catch {
            continue;
          }

          if (event.type === "progress") {
            addLine(event.message ?? "", "progress");
            setProgress(event.progress ?? 0);
          } else if (event.type === "token") {
            const wc = event.word_count ?? 0;
            if (wc - lastWordCount >= 80) {
              lastWordCount = wc;
              addLine(`✍  ${wc} kelime üretildi...`, "stream");
              setProgress(event.progress ?? progress);
            }
          } else if (event.type === "done") {
            setProgress(100);
            addLine(``, "system");
            addLine(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, "system");
            addLine(`✓  Tamamlandı!`, "success");
            addLine(`   Başlık    : ${event.title}`, "success");
            addLine(`   Slug      : ${event.slug}`, "success");
            addLine(`   Kelime    : ${event.wordCount}`, "success");
            addLine(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, "system");
            setDone({
              slug: event.slug ?? "",
              title: event.title ?? title,
              wordCount: event.wordCount ?? 0,
            });
          } else if (event.type === "error") {
            addLine(`HATA: ${event.message}`, "error");
            setError(event.message ?? "Bilinmeyen hata");
          }
        }
      }
    } catch (err: unknown) {
      if ((err as Error).name === "AbortError") {
        addLine(`İşlem kullanıcı tarafından iptal edildi.`, "error");
      } else {
        const msg = err instanceof Error ? err.message : String(err);
        addLine(`HATA: ${msg}`, "error");
        setError(msg);
      }
    } finally {
      setRunning(false);
      abortRef.current = null;
    }
  }, [title, keyword, progress]);

  function handleClose() {
    if (running && abortRef.current) {
      abortRef.current.abort();
    }
    setOpen(false);
    setRunning(false);
    setDone(null);
    setError(null);
    setLines([]);
    setProgress(0);
  }

  function handleOpenFresh() {
    setOpen(true);
    setTitle("");
    setKeyword("");
    setDone(null);
    setError(null);
    setLines([]);
    setProgress(0);
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={handleOpenFresh}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-[#006064] text-white font-bold text-sm hover:from-purple-700 hover:to-[#00474b] transition-all shadow-md hover:shadow-lg"
      >
        <Sparkles className="w-4 h-4" />
        AI ile Yarat
      </button>

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#0d1117] rounded-2xl shadow-2xl border border-[#30363d] overflow-hidden flex flex-col max-h-[90vh]">

            {/* ── Window Chrome ────────────────────────────────────────── */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-[#30363d]">
              <div className="flex gap-1.5">
                <button onClick={handleClose} className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-90 transition-all" title="Kapat" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-[#8b949e] font-mono">
                  camiihalisi.com — Blog Generator (Grok-3)
                </span>
              </div>
              <button onClick={handleClose} className="text-[#8b949e] hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Input Panel (shown before running) ───────────────────── */}
            {!running && !done && lines.length === 0 && (
              <div className="px-6 py-5 bg-[#0d1117] border-b border-[#30363d] space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8b949e] mb-1.5 font-mono uppercase tracking-widest">
                    Makale Başlığı *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !running && title.trim() && handleStart()}
                    placeholder="örn: Akrilik Cami Halısı Alırken Dikkat Edilmesi Gerekenler"
                    className="w-full px-4 py-3 rounded-xl bg-[#161b22] border border-[#30363d] text-[#e6edf3] text-sm placeholder-[#484f58] focus:outline-none focus:border-[#388bfd] focus:ring-1 focus:ring-[#388bfd]/30 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8b949e] mb-1.5 font-mono uppercase tracking-widest">
                    SEO Keyword <span className="text-[#484f58] normal-case font-normal">(isteğe bağlı)</span>
                  </label>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="örn: akrilik cami halısı"
                    className="w-full px-4 py-3 rounded-xl bg-[#161b22] border border-[#30363d] text-[#e6edf3] text-sm placeholder-[#484f58] focus:outline-none focus:border-[#388bfd] focus:ring-1 focus:ring-[#388bfd]/30 font-mono"
                  />
                </div>
                <button
                  onClick={handleStart}
                  disabled={!title.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-[#006064] text-white font-bold text-sm hover:from-purple-700 hover:to-[#00474b] disabled:opacity-40 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Üretimi Başlat
                </button>
              </div>
            )}

            {/* ── Terminal Output ───────────────────────────────────────── */}
            {(running || lines.length > 0) && (
              <div
                ref={termRef}
                className="flex-1 overflow-y-auto px-5 py-4 bg-[#0d1117] min-h-[260px] max-h-[380px]"
              >
                {lines.map((line) => (
                  <TermLine key={line.id} line={line} />
                ))}
                {running && (
                  <div className="font-mono text-xs text-green-400 flex items-center gap-1 mt-1">
                    <span className="animate-pulse">▋</span>
                  </div>
                )}
              </div>
            )}

            {/* ── Progress Bar ──────────────────────────────────────────── */}
            {(running || done) && (
              <div className="px-5 pb-1 bg-[#0d1117]">
                <div className="w-full h-1 bg-[#21262d] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      done ? "bg-emerald-400" : "bg-[#388bfd]"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-right text-xs text-[#484f58] font-mono mt-0.5 mb-1">
                  {progress}%
                </div>
              </div>
            )}

            {/* ── Done Panel ────────────────────────────────────────────── */}
            {done && (
              <div className="px-5 py-4 bg-[#0d1117] border-t border-[#30363d] space-y-3">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-bold font-mono">Blog yazısı başarıyla oluşturuldu!</span>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/admin/blog`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#006064] text-white text-xs font-bold hover:bg-[#00474b] transition-colors"
                  >
                    ✏️ Düzenle
                  </a>
                  <a
                    href={`/blog/${done.slug}`}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#161b22] border border-[#30363d] text-[#8b949e] text-xs font-bold hover:text-white hover:border-[#8b949e] transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Önizle
                  </a>
                  <button
                    onClick={() => {
                      setDone(null);
                      setError(null);
                      setLines([]);
                      setProgress(0);
                      setTitle("");
                      setKeyword("");
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#161b22] border border-[#30363d] text-[#8b949e] text-xs font-bold hover:text-white hover:border-[#8b949e] transition-colors ml-auto"
                  >
                    + Yeni Yaz
                  </button>
                </div>
              </div>
            )}

            {/* ── Error Panel ───────────────────────────────────────────── */}
            {error && !done && (
              <div className="px-5 py-3 bg-[#0d1117] border-t border-[#30363d]">
                <div className="text-xs text-red-400 font-mono bg-red-950/20 border border-red-800/40 rounded-lg px-3 py-2">
                  ✗ {error}
                </div>
                <button
                  onClick={() => {
                    setError(null);
                    setLines([]);
                    setProgress(0);
                  }}
                  className="mt-2 text-xs text-[#8b949e] hover:text-white font-mono underline transition-colors"
                >
                  Geri Dön
                </button>
              </div>
            )}

            {/* ── Cancel Button ─────────────────────────────────────────── */}
            {running && (
              <div className="px-5 py-3 bg-[#0d1117] border-t border-[#30363d]">
                <button
                  onClick={() => {
                    if (abortRef.current) abortRef.current.abort();
                  }}
                  className="text-xs text-[#8b949e] hover:text-red-400 font-mono underline transition-colors"
                >
                  İptal Et
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

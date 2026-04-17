"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, Search, Upload, Loader2, Trash2, CheckCircle2 } from "lucide-react";

interface GalleryData {
  static: string[];
  uploaded: string[];
  blobSupported: boolean;
}

interface Props {
  open: boolean;
  current: string;
  onSelect: (url: string) => void;
  onClose: () => void;
}

export default function ImagePickerModal({ open, current, onSelect, onClose }: Props) {
  const [data, setData] = useState<GalleryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"static" | "uploaded">("static");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [selected, setSelected] = useState(current);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/galeri");
      const d = await res.json();
      setData(d);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      setSelected(current);
      setSearch("");
      load();
    }
  }, [open, current, load]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError("");
    const fd = new FormData();
    fd.append("file", files[0]);
    try {
      const res = await fetch("/api/admin/galeri/upload", { method: "POST", body: fd });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error ?? "Yükleme hatası");
      await load();
      setTab("uploaded");
      setSelected(d.url);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Hata");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(url: string) {
    if (!confirm("Bu görseli silmek istediğinizden emin misiniz?")) return;
    setDeleting(url);
    try {
      await fetch("/api/admin/galeri", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      await load();
      if (selected === url) setSelected("");
    } finally {
      setDeleting(null);
    }
  }

  if (!open) return null;

  const allImages = tab === "static"
    ? (data?.static ?? [])
    : (data?.uploaded ?? []);

  const filtered = allImages.filter((img) =>
    img.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-4xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <h2 className="text-lg font-extrabold text-slate-800 dark:text-white">Görsel Seç</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex-shrink-0 flex-wrap">
          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setTab("static")}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${tab === "static" ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
            >
              Statik ({data?.static.length ?? 0})
            </button>
            <button
              onClick={() => setTab("uploaded")}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${tab === "uploaded" ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
            >
              Yüklenen ({data?.uploaded.length ?? 0})
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-40">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ara..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40"
            />
          </div>

          {/* Upload */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C9972B] text-white text-sm font-bold hover:bg-[#B8861F] transition-all disabled:opacity-50"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? "Yükleniyor..." : "Yükle"}
            </button>
          </div>
        </div>

        {/* Blob not configured notice */}
        {data && !data.blobSupported && tab === "uploaded" && (
          <div className="px-6 py-3 bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-400 flex-shrink-0">
            ⚠ Vercel Blob yapılandırılmamış. Yükleme için <code className="font-mono">BLOB_READ_WRITE_TOKEN</code> ortam değişkenini ekleyin.
          </div>
        )}

        {uploadError && (
          <div className="px-6 py-2 bg-red-50 dark:bg-red-950/20 border-b border-red-200 text-xs text-red-600 flex-shrink-0">
            {uploadError}
          </div>
        )}

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
              <p className="font-medium">{search ? "Sonuç yok" : "Görsel yok"}</p>
              {tab === "uploaded" && !search && (
                <p className="text-sm mt-1">Yukarıdaki butonu kullanarak görsel yükleyin.</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {filtered.map((img) => {
                const isSelected = selected === img;
                return (
                  <div key={img} className="relative group">
                    <button
                      type="button"
                      onClick={() => setSelected(img)}
                      className={`relative w-full aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        isSelected
                          ? "border-[#C9972B] ring-2 ring-[#C9972B]/30"
                          : "border-slate-200 dark:border-slate-700 hover:border-[#C9972B]/50"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#C9972B]/20 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-[#C9972B] drop-shadow" />
                        </div>
                      )}
                    </button>
                    {/* Delete button — only for uploaded */}
                    {tab === "uploaded" && (
                      <button
                        type="button"
                        onClick={() => handleDelete(img)}
                        disabled={deleting === img}
                        title="Sil"
                        className="absolute top-1 right-1 p-1 rounded-md bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700 disabled:opacity-50"
                      >
                        {deleting === img ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                      </button>
                    )}
                    {/* Filename tooltip */}
                    <p className="mt-1 text-xs text-slate-400 truncate text-center px-1">
                      {img.split("/").pop()}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {selected && (
              <>
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selected} alt="" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs text-slate-500 truncate max-w-xs">{selected}</span>
              </>
            )}
            {!selected && <span className="text-xs text-slate-400">Henüz görsel seçilmedi</span>}
          </div>
          <div className="flex gap-2 flex-shrink-0 ml-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={() => { onSelect(selected); onClose(); }}
              disabled={!selected}
              className="px-5 py-2 rounded-xl bg-[#006064] text-white text-sm font-bold hover:bg-[#003B40] transition-all disabled:opacity-50"
            >
              Seç
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

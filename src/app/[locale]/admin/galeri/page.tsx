"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Images, Upload, Trash2, Loader2, Search, Copy, CheckCircle2, RefreshCw } from "lucide-react";

interface GalleryData {
  static: string[];
  uploaded: string[];
  blobSupported: boolean;
}

export default function GaleriAdminPage() {
  const [data, setData] = useState<GalleryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"static" | "uploaded">("static");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
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

  useEffect(() => { load(); }, [load]);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError("");
    const results: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/galeri/upload", { method: "POST", body: fd });
      const d = await res.json();
      if (!res.ok) { setUploadError(d.error ?? "Yükleme hatası"); break; }
      results.push(d.url);
    }
    setUploading(false);
    if (results.length > 0) {
      await load();
      setTab("uploaded");
    }
  }

  async function handleDelete(url: string) {
    if (!confirm("Görseli silmek istediğinizden emin misiniz?")) return;
    setDeleting(url);
    await fetch("/api/admin/galeri", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    setDeleting(null);
    await load();
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1800);
  }

  const allImages = tab === "static" ? (data?.static ?? []) : (data?.uploaded ?? []);
  const filtered = allImages.filter((img) => img.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Görsel Galerisi</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Sitede kullanılan tüm görseller. Yükleyin, kopyalayın, silin.
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Yenile
        </button>
      </div>

      {/* Blob notice */}
      {data && !data.blobSupported && (
        <div className="mb-6 px-4 py-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-400">
          <strong>Yükleme devre dışı:</strong> Vercel Blob yapılandırılmamış.
          <code className="ml-1 font-mono bg-amber-100 dark:bg-amber-900/30 px-1 rounded">BLOB_READ_WRITE_TOKEN</code> ortam değişkenini Vercel ayarlarından ekleyin.
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setTab("static")}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${tab === "static" ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
            >
              <Images className="w-3.5 h-3.5 inline mr-1.5" />
              Statik ({data?.static.length ?? 0})
            </button>
            <button
              onClick={() => setTab("uploaded")}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${tab === "uploaded" ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
            >
              <Upload className="w-3.5 h-3.5 inline mr-1.5" />
              Yüklenen ({data?.uploaded.length ?? 0})
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Dosya adı ile ara..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40"
            />
          </div>

          {/* Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || !data?.blobSupported}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#C9972B] text-white text-sm font-bold hover:bg-[#B8861F] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Yükleniyor..." : "Görsel Yükle"}
          </button>
        </div>

        {uploadError && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">{uploadError}</p>
        )}
      </div>

      {/* Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Images className="w-16 h-16 opacity-20 mb-3" />
            <p className="font-semibold">{search ? "Sonuç bulunamadı" : "Görsel yok"}</p>
            {tab === "uploaded" && !search && data?.blobSupported && (
              <p className="text-sm mt-1">Yukarıdaki butonu kullanarak görsel yükleyin.</p>
            )}
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-400 mb-4">{filtered.length} görsel gösteriliyor</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map((img) => (
                <div key={img} className="group">
                  {/* Image */}
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    {/* Overlay actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyUrl(img)}
                        title="URL'yi Kopyala"
                        className="p-2 rounded-lg bg-white/90 text-slate-800 hover:bg-white transition-all"
                      >
                        {copied === img ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                      {tab === "uploaded" && (
                        <button
                          type="button"
                          onClick={() => handleDelete(img)}
                          disabled={deleting === img}
                          title="Sil"
                          className="p-2 rounded-lg bg-red-600/90 text-white hover:bg-red-600 transition-all disabled:opacity-50"
                        >
                          {deleting === img ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filename */}
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 truncate text-center px-1">
                    {img.split("/").pop()}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

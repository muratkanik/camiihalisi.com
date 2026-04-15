import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Plus, Trash2, Eye, EyeOff, ExternalLink, Database } from "lucide-react";
import { addKeywordAction, toggleKeywordAction, deleteKeywordAction, seedCitiesAction } from "./actions";

const SITE_URL = "https://camiihalisi.com";

async function getData() {
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const [cities, keywords] = await Promise.all([
      prisma.city.findMany({ orderBy: [{ type: "asc" }, { name: "asc" }] }),
      prisma.cityKeyword.findMany({ orderBy: { createdAt: "desc" } }),
    ]);
    await prisma.$disconnect();
    return { cities, keywords, dbReady: true };
  } catch {
    return { cities: [], keywords: [], dbReady: false };
  }
}

export default async function SehirlerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { cities, keywords, dbReady } = await getData();
  const iller = cities.filter((c) => c.type === "il");
  const ilceler = cities.filter((c) => c.type === "ilce");

  return (
    <div className="min-h-screen bg-[#F7F3EC]">
      {/* Header */}
      <div className="bg-[#1B4332] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/admin`} className="text-white/60 hover:text-white text-sm transition-colors">← Admin</Link>
          <span className="text-white/40">/</span>
          <h1 className="font-bold text-lg">Şehirler & Keyword'ler</h1>
        </div>
        <a href={`${SITE_URL}/sitemap.xml`} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-[#E4B84A] hover:text-white transition-colors">
          Sitemap <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">

        {/* DB Durumu */}
        {!dbReady && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <Database className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-800">Veritabanı henüz hazır değil</p>
              <p className="text-sm text-amber-700 mt-1">
                Önce migration çalıştırın: <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">npx prisma migrate dev</code>
              </p>
              <form action={seedCitiesAction} className="mt-2">
                <button type="submit" className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded-lg hover:bg-amber-700 transition-colors">
                  Şehirleri Aktar (Seed)
                </button>
              </form>
            </div>
          </div>
        )}

        {dbReady && cities.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Database className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-800">Veritabanı boş</p>
              <p className="text-sm text-blue-700 mt-1">Tüm Türkiye illerini ve ilçelerini aktarmak için aşağıdaki butona tıklayın.</p>
              <form action={seedCitiesAction} className="mt-2">
                <button type="submit" className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
                  Şehirleri Aktar ({cities.length === 0 ? "145" : cities.length} kayıt)
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Keyword Ekleme Formu */}
        <div className="bg-white rounded-2xl border border-[#DDD8CE] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-1">Yeni Keyword Ekle</h2>
          <p className="text-sm text-[#6B6355] mb-4">
            Bir şehire keyword ekleyin → <code className="bg-[#F7F3EC] px-1.5 py-0.5 rounded font-mono text-xs">/cami-halisi/[şehir]/[keyword-slug]</code> sayfası otomatik oluşur ve sitemap'e eklenir.
          </p>
          <form action={addKeywordAction} className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-48">
              <label className="block text-xs font-semibold text-[#6B6355] mb-1.5 uppercase tracking-wide">Şehir</label>
              <select name="citySlug" required
                className="w-full px-3 py-2.5 text-sm border border-[#DDD8CE] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20">
                <option value="">Şehir seçin...</option>
                <optgroup label="İller">
                  {iller.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </optgroup>
                <optgroup label="İlçeler">
                  {ilceler.map((c) => <option key={c.slug} value={c.slug}>{c.name} ({c.parent})</option>)}
                </optgroup>
              </select>
            </div>
            <div className="flex-1 min-w-48">
              <label className="block text-xs font-semibold text-[#6B6355] mb-1.5 uppercase tracking-wide">Keyword</label>
              <input
                type="text"
                name="keyword"
                required
                placeholder="örn: Plastik Cami Halısı"
                className="w-full px-3 py-2.5 text-sm border border-[#DDD8CE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
              />
            </div>
            <button type="submit"
              className="flex items-center gap-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm">
              <Plus className="w-4 h-4" />
              Ekle
            </button>
          </form>
        </div>

        {/* Aktif Keyword'ler */}
        <div className="bg-white rounded-2xl border border-[#DDD8CE] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#DDD8CE] flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#1A1A1A]">
              Keyword'ler
              <span className="ml-2 text-sm font-normal text-[#6B6355]">({keywords.length} toplam)</span>
            </h2>
            <span className="text-xs text-[#6B6355] bg-[#F7F3EC] px-2.5 py-1 rounded-full">
              {keywords.filter(k => k.isActive).length} aktif
            </span>
          </div>

          {keywords.length === 0 ? (
            <div className="px-6 py-10 text-center text-[#6B6355] text-sm">
              Henüz keyword eklenmedi. Yukarıdan ekleyin.
            </div>
          ) : (
            <div className="divide-y divide-[#DDD8CE]">
              {keywords.map((kw) => {
                const city = cities.find(c => c.slug === kw.citySlug);
                const url = `/cami-halisi/${kw.citySlug}/${kw.keywordSlug}`;
                return (
                  <div key={kw.id} className={`px-6 py-4 flex items-center gap-4 ${!kw.isActive ? "opacity-50" : ""}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[#1A1A1A] text-sm">{city?.name ?? kw.citySlug}</span>
                        <span className="text-[#6B6355]">→</span>
                        <span className="text-[#1B4332] font-medium text-sm">{kw.keyword}</span>
                        {!kw.isActive && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Pasif</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs text-[#6B6355] font-mono">{url}</code>
                        <a href={`${SITE_URL}${url}`} target="_blank" rel="noopener noreferrer"
                          className="text-[#C9972B] hover:text-[#E4B84A] transition-colors">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <form action={toggleKeywordAction}>
                        <input type="hidden" name="id" value={kw.id} />
                        <input type="hidden" name="isActive" value={String(kw.isActive)} />
                        <button type="submit"
                          title={kw.isActive ? "Pasif yap" : "Aktif et"}
                          className="p-1.5 rounded-lg hover:bg-[#F7F3EC] text-[#6B6355] hover:text-[#1B4332] transition-colors">
                          {kw.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </form>
                      <form action={deleteKeywordAction}>
                        <input type="hidden" name="id" value={kw.id} />
                        <button type="submit"
                          title="Sil"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-[#6B6355] hover:text-red-600 transition-colors"
                          onClick={(e) => { if (!confirm("Bu keyword'ü silmek istiyor musunuz?")) e.preventDefault(); }}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Şehir Listesi */}
        {dbReady && cities.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#DDD8CE] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#DDD8CE]">
              <h2 className="text-lg font-bold text-[#1A1A1A]">
                Şehirler <span className="ml-2 text-sm font-normal text-[#6B6355]">({iller.length} il + {ilceler.length} ilçe)</span>
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {cities.map((c) => (
                  <div key={c.slug}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 ${
                      c.type === "il"
                        ? "border-[#1B4332]/20 bg-[#1B4332]/5 text-[#1B4332]"
                        : "border-[#DDD8CE] bg-[#F7F3EC] text-[#6B6355]"
                    }`}>
                    <span className="flex-1 truncate">{c.name}</span>
                    <span className="opacity-50 flex-shrink-0">{c.type === "il" ? "●" : "○"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

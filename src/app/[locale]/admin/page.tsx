import { Image, Package, BookOpen, MapPin, Users, Settings, ArrowRight, BarChart2, Sparkles } from "lucide-react";
import AiEngineWidget from "./AiEngineWidget";
import { CATEGORIES } from "@/lib/categories";
import { BLOG_POSTS } from "@/lib/blog-data";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

async function getDashboardStats() {
  const prisma = new PrismaClient();
  try {
    const [userCount, keywordCount, cityCount] = await Promise.all([
      prisma.user.count(),
      prisma.cityKeyword.count({ where: { isActive: true } }),
      prisma.city.count(),
    ]);
    return { userCount, keywordCount, cityCount };
  } catch {
    return { userCount: 0, keywordCount: 0, cityCount: 0 };
  } finally {
    await prisma.$disconnect();
  }
}

export default async function AdminDashboard() {
  const { userCount, keywordCount, cityCount } = await getDashboardStats();

  const stats = [
    { label: "Kategori", value: CATEGORIES.length, icon: <Package className="w-5 h-5" />, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", href: "/admin/kategoriler" },
    { label: "Blog Yazısı", value: BLOG_POSTS.length, icon: <BookOpen className="w-5 h-5" />, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", href: "/admin/blog" },
    { label: "Aktif Keyword", value: keywordCount, icon: <MapPin className="w-5 h-5" />, color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", href: "/admin/sehirler" },
    { label: "Şehir/İlçe", value: cityCount, icon: <BarChart2 className="w-5 h-5" />, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", href: "/admin/sehirler" },
    { label: "Admin Kullanıcı", value: userCount, icon: <Users className="w-5 h-5" />, color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400", href: "/admin/kullanicilar" },
  ];

  const quickLinks = [
    { label: "Hero Slayt Yönetimi", desc: "Ana sayfadaki fotoğraf slaytlarını düzenle", href: "/admin/hero", icon: <Image className="w-5 h-5" /> },
    { label: "Kategori Yönetimi", desc: "23 kategori başlık, açıklama ve görsel düzenleme", href: "/admin/kategoriler", icon: <Package className="w-5 h-5" /> },
    { label: "Blog Yazıları", desc: `${BLOG_POSTS.length} blog yazısının içeriğini düzenle`, href: "/admin/blog", icon: <BookOpen className="w-5 h-5" /> },
    { label: "Şehirler & Keyword", desc: `${cityCount} şehir/ilçe · ${keywordCount} aktif keyword`, href: "/admin/sehirler", icon: <MapPin className="w-5 h-5" /> },
    { label: "Kullanıcı Yönetimi", desc: "Admin kullanıcıları ekle, düzenle, sil", href: "/admin/kullanicilar", icon: <Users className="w-5 h-5" /> },
    { label: "Site Ayarları", desc: "Telefon, e-posta, sosyal medya linkleri", href: "/admin/ayarlar", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">camiihalisi.com yönetim paneline hoş geldiniz.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((s) => (
          <a
            key={s.label}
            href={s.href}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 hover:shadow-md transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              {s.icon}
            </div>
            <div className="text-2xl font-extrabold text-slate-800 dark:text-white group-hover:text-[#C9972B] transition-colors">
              {s.value}
            </div>
            <div className="text-xs text-slate-500 mt-0.5 font-medium">{s.label}</div>
          </a>
        ))}
      </div>

      {/* Quick links grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {quickLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md hover:border-[#C9972B]/30 transition-all group flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-500 dark:text-slate-400 group-hover:bg-[#C9972B]/10 group-hover:text-[#C9972B] transition-all">
              {link.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-800 dark:text-white text-sm group-hover:text-[#C9972B] transition-colors">{link.label}</span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#C9972B] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </div>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{link.desc}</p>
            </div>
          </a>
        ))}
      </div>

      {/* AI Content Engine */}
      <div className="bg-gradient-to-br from-[#0D2418] to-[#1B4332] rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#C9972B]" />
              <h2 className="font-extrabold text-lg">Otonom İçerik Motoru (AI)</h2>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-lg">
              Anahtar kelime girin, AI 4 dilde otomatik SEO içeriği oluştursun ve yayına alsın.
              Şehir+keyword sayfaları için dinamik içerik üretir.
            </p>
          </div>
        </div>
        <AiEngineWidget />
      </div>
    </div>
  );
}

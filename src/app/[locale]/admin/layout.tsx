import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Panel | Otonom SEO Yöneticisi",
  description: "Camiihalisi.com Yapay Zeka ve Dinamik İçerik Yönetimi",
  robots: { index: false, follow: false }
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans selection:bg-primary selection:text-white">
      {/* Sidebar - Premium Glassmorphism */}
      <aside className="w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 flex flex-col fixed h-full z-20 shadow-2xl">
        <div className="h-20 flex items-center px-8 border-b border-slate-200/50 dark:border-slate-800">
          <h2 className="text-2xl font-extrabold tracking-tight">
            <span className="text-primary pr-2">AsilHalı</span> 
            <span className="text-slate-800 dark:text-slate-200 font-light opacity-80">Admin</span>
          </h2>
        </div>
        
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          <a href="/admin" className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-primary/10 text-primary font-bold transition-all hover:bg-primary hover:text-white group">
            <svg className="w-5 h-5 opacity-80 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Dashboard
          </a>
          <a href="/admin/icerikler" className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-600 dark:text-slate-400 font-semibold transition-all hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white group">
            <svg className="w-5 h-5 opacity-60 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14"></path></svg>
            İçerik Arşivi (PDF)
          </a>
          <a href="/admin/ayarlar" className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-600 dark:text-slate-400 font-semibold transition-all hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white group">
            <svg className="w-5 h-5 opacity-60 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Site Ayarları
          </a>
        </nav>
        
        <div className="p-6 border-t border-slate-200/50 dark:border-slate-800">
          <form action={async () => {
            "use server";
            const cookieStore = await cookies();
            cookieStore.delete("auth_token");
            redirect("/login");
          }}>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-900/50 hover:scale-105 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Güvenli Çıkış
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72 p-10 pt-16 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
}

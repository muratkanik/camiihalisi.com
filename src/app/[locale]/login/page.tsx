import { redirect } from "next/navigation";
import { loginAction } from "./actions";
import { ShieldAlert, LogIn } from "lucide-react";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  const handleLogin = async (formData: FormData) => {
    "use server";
    const res = await loginAction(formData);
    if (res.error) {
      redirect(`?error=${res.error}`);
    }
    if (res.success) {
      redirect("/admin");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      {/* Background Image of Luxury Mosque Interior */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1542646698-ea9a0a09e0a2?auto=format&fit=crop&q=80&w=2500" 
          alt="Mosque luxury interior" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]"></div>
      </div>

      {/* Login Card (Glassmorphism) */}
      <div className="w-full max-w-md relative z-10 glass-card p-10 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-primary/30 mb-6">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Asil Halı Admin</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Sistem Yöneticisi Girişi</p>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-100/80 dark:bg-red-900/40 border border-red-200 dark:border-red-800/50 p-4 rounded-xl flex gap-3 items-center text-red-700 dark:text-red-400">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        <form action={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">E-Posta Adresi</label>
            <input 
              name="email" 
              type="email" 
              required 
              defaultValue="admin@asilhali.com.tr"
              className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400" 
              placeholder="Ornek: ali@asilhali.com.tr"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Yönetici Şifresi</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400" 
              placeholder="••••••••••"
            />
          </div>
          
          <div className="pt-2">
            <button type="submit" className="w-full btn-primary !py-4 shadow-lg shadow-primary/30 text-base">
              Güvenli Giriş Yap
              <ArrowRight className="w-5 h-5 opacity-80" />
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Otonom Web Yöneticisi © 2026
        </div>
      </div>
    </div>
  );
}

// Just importing ArrowRight inside the same file for standard
import { ArrowRight } from "lucide-react";

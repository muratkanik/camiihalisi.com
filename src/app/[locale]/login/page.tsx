import { ShieldAlert, LogIn, ArrowRight } from "lucide-react";
import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#0D2418]">
      {/* Arkaplan desen */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C9972B' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Login kartı */}
      <div className="w-full max-w-md relative z-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#C9972B] flex items-center justify-center mx-auto mb-5 shadow-lg">
            <LogIn className="w-8 h-8 text-[#0D2418]" />
          </div>
          <h1
            className="text-3xl font-bold text-white mb-1"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Admin Girişi
          </h1>
          <p className="text-white/50 text-sm">camiihalisi.com yönetim paneli</p>
        </div>

        {/* Hata mesajı */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 text-red-300">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{decodeURIComponent(error)}</span>
          </div>
        )}

        <form action={loginAction} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              E-posta
            </label>
            <input
              name="email"
              type="email"
              required
              defaultValue="admin@camiihalisi.com"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#C9972B] focus:ring-2 focus:ring-[#C9972B]/20 transition-all text-sm"
              placeholder="admin@camiihalisi.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Şifre
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#C9972B] focus:ring-2 focus:ring-[#C9972B]/20 transition-all text-sm"
              placeholder="••••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#C9972B] hover:bg-[#B8861F] text-[#0D2418] font-bold py-3.5 rounded-xl transition-colors text-sm mt-2"
          >
            Giriş Yap
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/25 uppercase tracking-widest">
          camiihalisi.com © 2026
        </p>
      </div>
    </div>
  );
}

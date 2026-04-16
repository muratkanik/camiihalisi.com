"use client";

import { useState, useTransition } from "react";
import { Users, UserPlus, KeyRound, Trash2, ShieldAlert, CheckCircle2 } from "lucide-react";

// We need a client wrapper since we show form state.
// The actual server logic is in actions.ts but we call via fetch pattern.

export default function KullanicilarPage() {
  return <KullanicilarClient />;
}

function KullanicilarClient() {
  const [users, setUsers] = useState<Array<{id:string;email:string;role:string;createdAt:string}>>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Load users via API
  const loadUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);
      setLoaded(true);
    } catch {
      setError("Kullanıcılar yüklenemedi.");
    }
  };

  if (!loaded) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Kullanıcı Yönetimi</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Admin panel kullanıcılarını ekleyin, düzenleyin ve silin.</p>
        </div>
        <button
          onClick={loadUsers}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#006064] text-white font-bold text-sm hover:bg-[#003B40] transition-all"
        >
          <Users className="w-4 h-4" />
          Kullanıcıları Yükle
        </button>
      </div>
    );
  }

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await fetch("/api/admin/users", { method: "POST", body: fd });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSuccess("Kullanıcı eklendi.");
        (e.target as HTMLFormElement).reset();
        loadUsers();
      }
    });
  };

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`"${email}" kullanıcısını silmek istediğinizden emin misiniz?`)) return;
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", id);
      const res = await fetch("/api/admin/users", { method: "DELETE", body: fd });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSuccess("Kullanıcı silindi.");
        loadUsers();
      }
    });
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await fetch("/api/admin/users", { method: "PATCH", body: fd });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSuccess("Şifre güncellendi.");
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Kullanıcı Yönetimi</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Admin panel kullanıcılarını ekleyin, düzenleyin ve silin.</p>
      </div>

      {/* Status messages */}
      {error && (
        <div className="mb-6 flex items-center gap-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="mb-6 flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {success}
        </div>
      )}

      {/* User list */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Users className="w-4 h-4" />
            Mevcut Kullanıcılar ({users.length})
          </h2>
        </div>

        {users.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">Kullanıcı bulunamadı.</div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((u) => (
              <details key={u.id} className="group">
                <summary className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all list-none">
                  <div className="w-9 h-9 rounded-full bg-[#006064] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{u.email[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">{u.email}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Rol: <span className="font-medium text-[#C9972B]">{u.role}</span>
                      <span className="mx-2">·</span>
                      Kayıt: {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); handleDelete(u.id, u.email); }}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-600 transition-all"
                    title="Kullanıcıyı Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </summary>

                {/* Change password */}
                <div className="px-6 pb-5 pt-4 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" /> Şifre Güncelle
                  </p>
                  <form onSubmit={handleChangePassword} className="flex gap-3">
                    <input type="hidden" name="id" value={u.id} />
                    <input
                      name="newPassword"
                      type="password"
                      required
                      minLength={8}
                      placeholder="Yeni şifre (min. 8 karakter)"
                      className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40 focus:border-[#C9972B]"
                    />
                    <button
                      type="submit"
                      disabled={isPending}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 text-white font-bold text-sm hover:bg-slate-700 dark:hover:bg-slate-600 transition-all flex items-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      Güncelle
                    </button>
                  </form>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>

      {/* Add user form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Yeni Kullanıcı Ekle
          </h2>
        </div>
        <form onSubmit={handleAdd} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">E-posta</label>
              <input
                name="email"
                type="email"
                required
                placeholder="kullanici@camiihalisi.com"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40 focus:border-[#C9972B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Şifre</label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="En az 8 karakter"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40 focus:border-[#C9972B]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Rol</label>
            <select
              name="role"
              className="w-48 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40 focus:border-[#C9972B]"
            >
              <option value="admin">Admin</option>
              <option value="editor">Editör</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C9972B] text-white font-bold text-sm hover:bg-[#B8861F] transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Kullanıcı Ekle
          </button>
        </form>
      </div>
    </div>
  );
}

import { getBadges, saveBadgeAction, deleteBadgeAction } from "./actions";

export default async function RozetlerPage() {
  const badges = await getBadges();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Kategori Rozetleri</h1>
      
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow border border-slate-100 dark:border-slate-800 mb-8">
        <h2 className="text-lg font-semibold mb-4">Yeni Rozet Ekle / Düzenle</h2>
        <form action={saveBadgeAction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Slug (Benzersiz)</label>
            <input type="text" name="slug" required placeholder="ornek: en-cok-satan" className="w-full px-3 py-2 border rounded-lg bg-transparent border-slate-200 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Admin Adı</label>
            <input type="text" name="name" required placeholder="En Çok Satan" className="w-full px-3 py-2 border rounded-lg bg-transparent border-slate-200 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">TR Çeviri</label>
            <input type="text" name="trName" placeholder="En Çok Satan" className="w-full px-3 py-2 border rounded-lg bg-transparent border-slate-200 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">EN Çeviri</label>
            <input type="text" name="enName" placeholder="Best Seller" className="w-full px-3 py-2 border rounded-lg bg-transparent border-slate-200 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">AR Çeviri</label>
            <input type="text" name="arName" placeholder="الأكثر مبيعا" className="w-full px-3 py-2 border rounded-lg bg-transparent border-slate-200 dark:border-slate-700" />
          </div>
          <div className="md:col-span-2 flex justify-end mt-2">
            <button type="submit" className="bg-[#0097A7] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#007A87] transition-colors">
              Kaydet
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow border border-slate-100 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">İsim</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Çeviriler (TR/EN/AR)</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {badges.map(b => (
              <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                <td className="px-6 py-4 font-mono text-sm text-slate-500">{b.slug}</td>
                <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{b.name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  <span className="mr-2">TR: {b.translations?.tr || "-"}</span>
                  <span className="mr-2">EN: {b.translations?.en || "-"}</span>
                  <span>AR: {b.translations?.ar || "-"}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <form action={async () => { "use server"; await deleteBadgeAction(b.slug); }}>
                    <button type="submit" className="text-red-500 hover:text-red-600 font-medium text-sm">
                      Sil
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {badges.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  Henüz rozet eklenmemiş.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

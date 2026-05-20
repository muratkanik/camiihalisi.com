import { setRequestLocale } from "next-intl/server";
import KatalogAdminClient from "./KatalogAdminClient";

export const metadata = {
  title: "Katalog & Renk Yönetimi | Admin",
};

export default async function KatalogAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Katalog & Renk Yönetimi</h1>
        <p className="text-slate-500 text-sm mt-1">
          Kategori bazlı desenleri (SAFLI 01 vb.) ve her desenin 20'ye kadar renk seçeneğini buradan yönetin.
        </p>
      </div>
      <KatalogAdminClient />
    </div>
  );
}

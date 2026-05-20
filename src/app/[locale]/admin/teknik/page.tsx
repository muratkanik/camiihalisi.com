import { setRequestLocale } from "next-intl/server";
import TeknikAdminClient from "./TeknikAdminClient";

export const metadata = {
  title: "Teknik Belgeler & Ödüller | Admin",
};

export default async function TeknikAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Teknik Özellikler & Sertifikalar</h1>
        <p className="text-slate-500 text-sm mt-1">
          Teknik özellikleri, malzeme detaylarını, ISO sertifikalarını ve başarı ödüllerini buradan yönetebilirsiniz.
        </p>
      </div>
      <TeknikAdminClient />
    </div>
  );
}

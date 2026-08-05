import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import TranslationEditorClient from "@/components/admin/TranslationEditorClient";

async function getTranslationData() {
  const trMessages = (await import("../../../../../messages/tr.json")).default;
  const enMessages = (await import("../../../../../messages/en.json")).default;
  const deMessages = (await import("../../../../../messages/de.json")).default;
  const arMessages = (await import("../../../../../messages/ar.json")).default;
  const frMessages = (await import("../../../../../messages/fr.json")).default;
  const ruMessages = (await import("../../../../../messages/ru.json")).default;

  // DB overrides
  let dbOverrides: Record<string, Record<string, Record<string, string>>> = {};
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const row = await prisma.setting.findUnique({ where: { key: "ui_translation_overrides" } });
    if (row) dbOverrides = JSON.parse(row.value);
    await prisma.$disconnect();
  } catch { /* ignore */ }

  return { trMessages, enMessages, deMessages, arMessages, frMessages, ruMessages, dbOverrides };
}

export default async function CeviriPage({ params }: { params: Promise<{ locale: string }> }) {
  if (!(await isAdminAuthenticated())) {
    redirect("/login");
  }

  const data = await getTranslationData();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Çeviri Yönetimi</h1>
        <p className="text-slate-500 text-sm mt-1">
          Site metinlerini tüm diller için düzenleyin. AI ile otomatik çeviri yapabilirsiniz.
        </p>
      </div>
      <TranslationEditorClient {...data} />
    </div>
  );
}

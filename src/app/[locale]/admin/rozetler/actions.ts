"use server";

import { revalidatePath } from "next/cache";

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

export interface BadgeWithTranslations {
  id: string;
  slug: string;
  name: string;
  translations: Record<string, string>; // locale -> translated name
}

export async function getBadges(): Promise<BadgeWithTranslations[]> {
  const prisma = await getPrisma();
  try {
    const badges = await prisma.badge.findMany({ orderBy: { createdAt: "asc" } });
    const uiSetting = await prisma.setting.findUnique({ where: { key: "ui_translation_overrides" } });
    const uiOverrides = uiSetting ? JSON.parse(uiSetting.value) : {};

    return badges.map(b => {
      const nsKey = "badgeData." + b.slug;
      const translations: Record<string, string> = {};
      if (uiOverrides[nsKey]) {
        for (const loc of Object.keys(uiOverrides[nsKey])) {
          if (uiOverrides[nsKey][loc]?.name) {
            translations[loc] = uiOverrides[nsKey][loc].name;
          }
        }
      }
      return {
        ...b,
        translations
      };
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function saveBadgeAction(formData: FormData) {
  const slug = (formData.get("slug") as string)?.trim();
  const name = (formData.get("name") as string)?.trim();
  const trName = (formData.get("trName") as string)?.trim();
  const enName = (formData.get("enName") as string)?.trim();
  const arName = (formData.get("arName") as string)?.trim();
  
  if (!slug || !name) throw new Error("Slug ve isim zorunludur");

  const prisma = await getPrisma();
  try {
    await prisma.badge.upsert({
      where: { slug },
      update: { name },
      create: { slug, name }
    });

    const uiSetting = await prisma.setting.findUnique({ where: { key: "ui_translation_overrides" } });
    const uiOverrides = uiSetting ? JSON.parse(uiSetting.value) : {};
    
    const nsKey = "badgeData." + slug;
    if (!uiOverrides[nsKey]) uiOverrides[nsKey] = {};
    if (!uiOverrides[nsKey]["tr"]) uiOverrides[nsKey]["tr"] = {};
    if (!uiOverrides[nsKey]["en"]) uiOverrides[nsKey]["en"] = {};
    if (!uiOverrides[nsKey]["ar"]) uiOverrides[nsKey]["ar"] = {};
    
    if (trName) uiOverrides[nsKey]["tr"]["name"] = trName;
    if (enName) uiOverrides[nsKey]["en"]["name"] = enName;
    if (arName) uiOverrides[nsKey]["ar"]["name"] = arName;

    await prisma.setting.upsert({
      where: { key: "ui_translation_overrides" },
      update: { value: JSON.stringify(uiOverrides) },
      create: { key: "ui_translation_overrides", value: JSON.stringify(uiOverrides) }
    });

    revalidatePath("/", "layout");
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteBadgeAction(slug: string) {
  const prisma = await getPrisma();
  try {
    await prisma.badge.delete({ where: { slug } });
    revalidatePath("/", "layout");
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

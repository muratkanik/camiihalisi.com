"use server";

import { revalidatePath } from "next/cache";

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/İ/g, "i").replace(/Ğ/g, "g").replace(/Ü/g, "u")
    .replace(/Ş/g, "s").replace(/Ö/g, "o").replace(/Ç/g, "c")
    .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export async function addKeywordAction(formData: FormData): Promise<void> {
  try {
    const citySlug = (formData.get("citySlug") as string)?.trim();
    const keyword = (formData.get("keyword") as string)?.trim();
    if (!citySlug || !keyword) return;

    const keywordSlug = toSlug(keyword);
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    await prisma.cityKeyword.upsert({
      where: { citySlug_keywordSlug: { citySlug, keywordSlug } },
      update: { keyword, isActive: true },
      create: { citySlug, keyword, keywordSlug, isActive: true },
    });

    await prisma.$disconnect();
    revalidatePath("/", "layout");
  } catch (err) {
    console.error("addKeywordAction error:", err);
  }
}

export async function toggleKeywordAction(formData: FormData): Promise<void> {
  try {
    const id = formData.get("id") as string;
    const isActive = formData.get("isActive") === "true";
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    await prisma.cityKeyword.update({ where: { id }, data: { isActive: !isActive } });
    await prisma.$disconnect();
    revalidatePath("/", "layout");
  } catch (err) {
    console.error("toggleKeywordAction error:", err);
  }
}

export async function deleteKeywordAction(formData: FormData): Promise<void> {
  try {
    const id = formData.get("id") as string;
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    await prisma.cityKeyword.delete({ where: { id } });
    await prisma.$disconnect();
    revalidatePath("/", "layout");
  } catch (err) {
    console.error("deleteKeywordAction error:", err);
  }
}

export async function seedCitiesAction(): Promise<void> {
  try {
    const { ALL_CITIES } = await import("@/lib/cities");
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    for (const city of ALL_CITIES) {
      await prisma.city.upsert({
        where: { slug: city.slug },
        update: { name: city.name, type: city.type, parent: city.parent ?? null, population: city.population ?? null },
        create: { slug: city.slug, name: city.name, type: city.type, parent: city.parent ?? null, population: city.population ?? null, isActive: true },
      });
    }

    await prisma.$disconnect();
    revalidatePath("/admin/sehirler");
  } catch (err) {
    console.error("seedCitiesAction error:", err);
  }
}

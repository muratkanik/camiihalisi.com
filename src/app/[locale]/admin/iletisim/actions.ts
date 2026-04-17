"use server";

import { revalidatePath } from "next/cache";
import { ContactOffice, DEFAULT_OFFICES } from "./types";

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

export async function getContactOffices(): Promise<ContactOffice[]> {
  const prisma = await getPrisma();
  try {
    const row = await prisma.setting.findUnique({ where: { key: "contact_offices" } });
    if (row) return JSON.parse(row.value) as ContactOffice[];
    return DEFAULT_OFFICES;
  } catch {
    return DEFAULT_OFFICES;
  } finally {
    await prisma.$disconnect();
  }
}

export async function saveContactOfficesAction(formData: FormData): Promise<void> {
  const json = formData.get("offices_json") as string;
  let offices: ContactOffice[];
  try {
    offices = JSON.parse(json);
  } catch {
    throw new Error("Geçersiz JSON");
  }

  const prisma = await getPrisma();
  try {
    await prisma.setting.upsert({
      where: { key: "contact_offices" },
      update: { value: JSON.stringify(offices) },
      create: { key: "contact_offices", value: JSON.stringify(offices) },
    });
    revalidatePath("/iletisim", "layout");
  } finally {
    await prisma.$disconnect();
  }
}

export async function resetContactOfficesAction(): Promise<void> {
  const prisma = await getPrisma();
  try {
    await prisma.setting.upsert({
      where: { key: "contact_offices" },
      update: { value: JSON.stringify(DEFAULT_OFFICES) },
      create: { key: "contact_offices", value: JSON.stringify(DEFAULT_OFFICES) },
    });
    revalidatePath("/iletisim", "layout");
  } finally {
    await prisma.$disconnect();
  }
}

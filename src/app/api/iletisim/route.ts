import { NextResponse } from "next/server";
import { DEFAULT_OFFICES } from "@/app/[locale]/admin/iletisim/actions";

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

export async function GET() {
  const prisma = await getPrisma();
  try {
    const row = await prisma.setting.findUnique({ where: { key: "contact_offices" } });
    const offices = row ? JSON.parse(row.value) : DEFAULT_OFFICES;
    return NextResponse.json({ offices: offices.filter((o: { active: boolean }) => o.active) });
  } catch {
    return NextResponse.json({ offices: DEFAULT_OFFICES.filter((o) => o.active) });
  } finally {
    await prisma.$disconnect();
  }
}

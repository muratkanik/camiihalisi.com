/**
 * GET  /api/admin/ceviri  → mevcut override'ları getir
 * POST /api/admin/ceviri  → override'ları kaydet
 *
 * DB key: "ui_translation_overrides"
 * Shape: { [namespace]: { [locale]: { [flatKey]: string } } }
 */
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return !!cookieStore.get("auth_token")?.value;
}

export async function GET(_req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const prisma = await getPrisma();
  try {
    const row = await prisma.setting.findUnique({ where: { key: "ui_translation_overrides" } });
    const data = row ? JSON.parse(row.value) : {};
    return NextResponse.json(data);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  let body: { overrides?: Record<string, Record<string, Record<string, string>>> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON" }, { status: 400 });
  }

  const { overrides } = body;
  if (!overrides || typeof overrides !== "object") {
    return NextResponse.json({ error: "overrides alanı gerekli" }, { status: 400 });
  }

  const prisma = await getPrisma();
  try {
    // Mevcut override'ları al, yeni değerlerle merge et
    const row = await prisma.setting.findUnique({ where: { key: "ui_translation_overrides" } });
    const existing: Record<string, Record<string, Record<string, string>>> = row
      ? JSON.parse(row.value)
      : {};

    // Deep merge: namespace → locale → key
    for (const [ns, localeMap] of Object.entries(overrides)) {
      if (!existing[ns]) existing[ns] = {};
      for (const [locale, keyMap] of Object.entries(localeMap)) {
        if (!existing[ns][locale]) existing[ns][locale] = {};
        Object.assign(existing[ns][locale], keyMap);
      }
    }

    await prisma.setting.upsert({
      where: { key: "ui_translation_overrides" },
      create: { key: "ui_translation_overrides", value: JSON.stringify(existing) },
      update: { value: JSON.stringify(existing) },
    });

    return NextResponse.json({ ok: true });
  } finally {
    await prisma.$disconnect();
  }
}

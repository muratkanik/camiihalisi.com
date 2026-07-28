import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { isAdminAuthenticated } from "@/lib/auth";

async function checkAuth() {
  return isAdminAuthenticated();
}

const prisma = new PrismaClient();

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const row = await prisma.setting.findUnique({ where: { key: "catalog_items" } });
    const items = row ? JSON.parse(row.value) : [];
    return NextResponse.json({ items });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { items } = body;
    await prisma.setting.upsert({
      where: { key: "catalog_items" },
      create: { key: "catalog_items", value: JSON.stringify(items) },
      update: { value: JSON.stringify(items) },
    });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

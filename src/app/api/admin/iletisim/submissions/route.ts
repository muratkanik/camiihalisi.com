/**
 * GET  /api/admin/iletisim/submissions — list form submissions
 * POST /api/admin/iletisim/submissions — mark as read / delete
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

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const prisma = await getPrisma();
  try {
    const row = await prisma.setting.findUnique({ where: { key: "contact_submissions" } });
    const submissions = row ? JSON.parse(row.value) : [];
    return NextResponse.json({ submissions });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const body: { action?: string; id?: string } = await req.json();
  const { action, id } = body;

  const prisma = await getPrisma();
  try {
    const row = await prisma.setting.findUnique({ where: { key: "contact_submissions" } });
    let submissions: Array<{ id: string; read: boolean }> = row ? JSON.parse(row.value) : [];

    if (action === "mark_read" && id) {
      submissions = submissions.map((s) => s.id === id ? { ...s, read: true } : s);
    } else if (action === "delete" && id) {
      submissions = submissions.filter((s) => s.id !== id);
    } else if (action === "mark_all_read") {
      submissions = submissions.map((s) => ({ ...s, read: true }));
    }

    await prisma.setting.upsert({
      where: { key: "contact_submissions" },
      create: { key: "contact_submissions", value: JSON.stringify(submissions) },
      update: { value: JSON.stringify(submissions) },
    });
    return NextResponse.json({ ok: true });
  } finally {
    await prisma.$disconnect();
  }
}

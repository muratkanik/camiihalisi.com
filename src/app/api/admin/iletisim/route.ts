import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DEFAULT_OFFICES } from "@/app/[locale]/admin/iletisim/types";

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

function auth(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return !!cookieStore.get("auth_token")?.value;
}

export async function GET() {
  const cookieStore = await cookies();
  if (!auth(cookieStore)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const prisma = await getPrisma();
  try {
    const row = await prisma.setting.findUnique({ where: { key: "contact_offices" } });
    const offices = row ? JSON.parse(row.value) : DEFAULT_OFFICES;
    return NextResponse.json({ offices });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  if (!auth(cookieStore)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { offices } = await req.json();
  if (!Array.isArray(offices)) return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });

  const prisma = await getPrisma();
  try {
    await prisma.setting.upsert({
      where: { key: "contact_offices" },
      update: { value: JSON.stringify(offices) },
      create: { key: "contact_offices", value: JSON.stringify(offices) },
    });
    return NextResponse.json({ success: true });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  if (!auth(cookieStore)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const prisma = await getPrisma();
  try {
    await prisma.setting.upsert({
      where: { key: "contact_offices" },
      update: { value: JSON.stringify(DEFAULT_OFFICES) },
      create: { key: "contact_offices", value: JSON.stringify(DEFAULT_OFFICES) },
    });
    return NextResponse.json({ offices: DEFAULT_OFFICES });
  } finally {
    await prisma.$disconnect();
  }
}

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

async function checkAuth() {
  const cookieStore = await cookies();
  return !!cookieStore.get("auth_token")?.value;
}

const prisma = new PrismaClient();

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const row = await prisma.setting.findUnique({ where: { key: "teknik_ozellikler_data" } });
    const data = row ? JSON.parse(row.value) : {
      specsTable: [
        { ozellik: "Yangın Sınıfı", deger: "Bfl-s1 (EN 13501-1)", aciklama: "AB yangın yönetmeliği ibadet yerleri standardı" },
        { ozellik: "Renk Haslığı", deger: "ISO 105-B02 (≥5)", aciklama: "Güneş ışığına karşı renk kalıcılığı testi" }
      ],
      materialSpecs: [
        { malzeme: "Akrilik", hav: "6–10 mm", agirlik: "1.800–2.400 gr/m²", omur: "15–20 yıl", yangin: "Bfl-s1", garanti: "5 yıl" },
      ],
      certificates: [],
      awards: []
    };
    return NextResponse.json({ data });
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
    const { data } = body;
    await prisma.setting.upsert({
      where: { key: "teknik_ozellikler_data" },
      create: { key: "teknik_ozellikler_data", value: JSON.stringify(data) },
      update: { value: JSON.stringify(data) },
    });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

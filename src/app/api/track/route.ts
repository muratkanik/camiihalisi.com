import { NextRequest, NextResponse } from "next/server";

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

// POST /api/track — tıklama olayı kaydet
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fromPage, toUrl, label, category } = body;

    if (!fromPage || !toUrl) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const ua = req.headers.get("user-agent")?.slice(0, 200) ?? undefined;
    const referer = req.headers.get("referer")?.slice(0, 500) ?? undefined;

    const prisma = await getPrisma();
    try {
      await (prisma as any).clickEvent.create({
        data: {
          fromPage: fromPage.slice(0, 500),
          toUrl: toUrl.slice(0, 500),
          label: (label ?? "").slice(0, 100),
          category: category ?? "outbound",
          ua,
          referer,
        },
      });
    } finally {
      await prisma.$disconnect();
    }

    return NextResponse.json({ ok: true });
  } catch {
    // Hata takip akışını bozmasın
    return NextResponse.json({ ok: false });
  }
}

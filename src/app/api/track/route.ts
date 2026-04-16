import { NextRequest, NextResponse } from "next/server";
import { getVisitorInfo } from "@/lib/visitor-info";

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

// POST /api/track — tıklama olayı kaydet (client-side fire)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fromPage, toUrl, label, category } = body;

    if (!fromPage || !toUrl) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const v = getVisitorInfo(req);

    const prisma = await getPrisma();
    try {
      await (prisma as any).clickEvent.create({
        data: {
          fromPage:  fromPage.slice(0, 500),
          toUrl:     toUrl.slice(0, 500),
          label:     (label ?? "").slice(0, 100),
          category:  category ?? "outbound",
          referer:   v.referer,
          refDomain: v.refDomain,
          ua:        v.ua,
          device:    v.device,
          browser:   v.browser,
          ip:        v.ip,
          country:   v.country,
          city:      v.city,
        },
      });
    } finally {
      await prisma.$disconnect();
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}

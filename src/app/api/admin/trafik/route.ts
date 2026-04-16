import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

async function checkAuth() {
  const cookieStore = await cookies();
  return !!cookieStore.get("auth_token")?.value;
}

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

function periodStart(period: string): Date {
  const now = new Date();
  switch (period) {
    case "today": {
      const d = new Date(now);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    case "week": {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      return d;
    }
    case "month": {
      const d = new Date(now);
      d.setDate(d.getDate() - 30);
      return d;
    }
    default:
      return new Date(0);
  }
}

export async function GET(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const period = req.nextUrl.searchParams.get("period") ?? "week";
  const since = periodStart(period);
  const todayStart = periodStart("today");
  const weekStart = periodStart("week");
  const monthStart = periodStart("month");

  const prisma = await getPrisma();
  try {
    // Toplam sayılar
    const [today, week, month, total] = await Promise.all([
      (prisma as any).clickEvent.count({ where: { createdAt: { gte: todayStart } } }),
      (prisma as any).clickEvent.count({ where: { createdAt: { gte: weekStart } } }),
      (prisma as any).clickEvent.count({ where: { createdAt: { gte: monthStart } } }),
      (prisma as any).clickEvent.count(),
    ]);

    // Sayfa bazlı
    const byPageRaw = await (prisma as any).clickEvent.groupBy({
      by: ["fromPage", "label"],
      where: { createdAt: { gte: since } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 20,
    });

    const byPage = byPageRaw.map((r: any) => ({
      fromPage: r.fromPage,
      label: r.label,
      category: "",
      count: r._count.id,
      lastSeen: "",
    }));

    // Etiket bazlı
    const byLabelRaw = await (prisma as any).clickEvent.groupBy({
      by: ["label"],
      where: { createdAt: { gte: since } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 20,
    });

    const byLabel = byLabelRaw.map((r: any) => ({ label: r.label, count: r._count.id }));

    // Kategori bazlı
    const byCategoryRaw = await (prisma as any).clickEvent.groupBy({
      by: ["category"],
      where: { createdAt: { gte: since } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    const byCategory = byCategoryRaw.map((r: any) => ({ category: r.category, count: r._count.id }));

    // Son 50 tıklama
    const recent = await (prisma as any).clickEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { fromPage: true, toUrl: true, label: true, createdAt: true },
    });

    return NextResponse.json({ today, week, month, total, byPage, byLabel, byCategory, recent });
  } finally {
    await prisma.$disconnect();
  }
}

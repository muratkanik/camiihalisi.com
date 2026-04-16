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

// Ülke kodu → bayrak emoji
function countryFlag(code: string): string {
  if (!code || code.length !== 2) return "🌍";
  return String.fromCodePoint(
    ...code.toUpperCase().split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}

// Ülke kodu → Türkçe isim (yaygın olanlar)
const COUNTRY_NAMES: Record<string, string> = {
  TR: "Türkiye", DE: "Almanya", US: "ABD", NL: "Hollanda",
  AT: "Avusturya", FR: "Fransa", BE: "Belçika", CH: "İsviçre",
  GB: "İngiltere", SA: "Suudi Arabistan", AE: "BAE", QA: "Katar",
  KW: "Kuveyt", SE: "İsveç", DK: "Danimarka", NO: "Norveç",
  AU: "Avustralya", CA: "Kanada", RU: "Rusya", AZ: "Azerbaycan",
  KZ: "Kazakistan", UZ: "Özbekistan", TM: "Türkmenistan",
  BG: "Bulgaristan", GR: "Yunanistan", RO: "Romanya",
};

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
    // ── Özet sayılar ─────────────────────────────────────────────────
    const [today, week, month, total] = await Promise.all([
      (prisma as any).clickEvent.count({ where: { createdAt: { gte: todayStart } } }),
      (prisma as any).clickEvent.count({ where: { createdAt: { gte: weekStart } } }),
      (prisma as any).clickEvent.count({ where: { createdAt: { gte: monthStart } } }),
      (prisma as any).clickEvent.count(),
    ]);

    // WhatsApp vs site ayrımı (bu dönem)
    const [whatsappCount, siteCount] = await Promise.all([
      (prisma as any).clickEvent.count({
        where: { createdAt: { gte: since }, category: "whatsapp" },
      }),
      (prisma as any).clickEvent.count({
        where: { createdAt: { gte: since }, category: "outbound" },
      }),
    ]);

    // ── Sayfa + etiket bazlı ──────────────────────────────────────────
    const byPageRaw = await (prisma as any).clickEvent.groupBy({
      by: ["fromPage", "label"],
      where: { createdAt: { gte: since } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 25,
    });
    const byPage = byPageRaw.map((r: any) => ({
      fromPage: r.fromPage,
      label: r.label,
      count: r._count.id,
    }));

    // ── Etiket bazlı ─────────────────────────────────────────────────
    const byLabelRaw = await (prisma as any).clickEvent.groupBy({
      by: ["label"],
      where: { createdAt: { gte: since } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 20,
    });
    const byLabel = byLabelRaw.map((r: any) => ({ label: r.label, count: r._count.id }));

    // ── Kategori bazlı ───────────────────────────────────────────────
    const byCategoryRaw = await (prisma as any).clickEvent.groupBy({
      by: ["category"],
      where: { createdAt: { gte: since } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });
    const byCategory = byCategoryRaw.map((r: any) => ({
      category: r.category,
      count: r._count.id,
    }));

    // ── Ülke bazlı ───────────────────────────────────────────────────
    const byCountryRaw = await (prisma as any).clickEvent.groupBy({
      by: ["country"],
      where: { createdAt: { gte: since }, country: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 20,
    });
    const byCountry = byCountryRaw.map((r: any) => ({
      code:  r.country ?? "??",
      name:  r.country ? (COUNTRY_NAMES[r.country] ?? r.country) : "Bilinmiyor",
      flag:  r.country ? countryFlag(r.country) : "🌍",
      count: r._count.id,
    }));

    // ── Şehir bazlı (Türkiye) ────────────────────────────────────────
    const byCityRaw = await (prisma as any).clickEvent.groupBy({
      by: ["city"],
      where: { createdAt: { gte: since }, country: "TR", city: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 15,
    });
    const byCity = byCityRaw.map((r: any) => ({
      city:  r.city ?? "Bilinmiyor",
      count: r._count.id,
    }));

    // ── Cihaz bazlı ──────────────────────────────────────────────────
    const byDeviceRaw = await (prisma as any).clickEvent.groupBy({
      by: ["device"],
      where: { createdAt: { gte: since }, device: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });
    const byDevice = byDeviceRaw.map((r: any) => ({
      device: r.device ?? "bilinmiyor",
      count:  r._count.id,
    }));

    // ── Browser bazlı ────────────────────────────────────────────────
    const byBrowserRaw = await (prisma as any).clickEvent.groupBy({
      by: ["browser"],
      where: { createdAt: { gte: since }, browser: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });
    const byBrowser = byBrowserRaw.map((r: any) => ({
      browser: r.browser ?? "other",
      count:   r._count.id,
    }));

    // ── Kaynak domain bazlı ──────────────────────────────────────────
    const byRefRaw = await (prisma as any).clickEvent.groupBy({
      by: ["refDomain"],
      where: { createdAt: { gte: since }, refDomain: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 15,
    });
    const byRef = byRefRaw.map((r: any) => ({
      domain: r.refDomain ?? "direkt",
      count:  r._count.id,
    }));

    // ── Son 50 tıklama (tam bilgi) ───────────────────────────────────
    const recent = await (prisma as any).clickEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        fromPage:  true,
        toUrl:     true,
        label:     true,
        category:  true,
        country:   true,
        city:      true,
        device:    true,
        browser:   true,
        refDomain: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      today, week, month, total,
      whatsappCount, siteCount,
      byPage, byLabel, byCategory,
      byCountry, byCity, byDevice, byBrowser, byRef,
      recent,
    });
  } finally {
    await prisma.$disconnect();
  }
}

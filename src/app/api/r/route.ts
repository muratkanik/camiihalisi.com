import { NextRequest, NextResponse } from "next/server";

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

/**
 * GET /api/r?to=URL&from=PAGE&label=LABEL&cat=CATEGORY
 * Tıklamayı loglar, hedefe yönlendirir.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const to = searchParams.get("to");
  const from = searchParams.get("from") ?? "/";
  const label = searchParams.get("label") ?? "";
  const cat = searchParams.get("cat") ?? "outbound";

  // Güvenlik: sadece izin verilen domainlere yönlendir
  const ALLOWED_HOSTS = ["asilhali.com.tr", "www.asilhali.com.tr", "wa.me"];
  if (!to) return NextResponse.redirect("/");

  try {
    const url = new URL(to);
    if (!ALLOWED_HOSTS.includes(url.hostname)) {
      return NextResponse.redirect("/");
    }
  } catch {
    return NextResponse.redirect("/");
  }

  // Arka planda log — fire and forget
  try {
    const ua = req.headers.get("user-agent")?.slice(0, 200) ?? undefined;
    const referer = req.headers.get("referer")?.slice(0, 500) ?? undefined;
    const prisma = await getPrisma();
    await (prisma as any).clickEvent.create({
      data: {
        fromPage: from.slice(0, 500),
        toUrl: to.slice(0, 500),
        label: label.slice(0, 100),
        category: cat,
        ua,
        referer,
      },
    });
    await prisma.$disconnect();
  } catch {
    // Hata yönlendirmeyi engellemesin
  }

  return NextResponse.redirect(to, { status: 302 });
}

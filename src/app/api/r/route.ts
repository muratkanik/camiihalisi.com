import { NextRequest, NextResponse } from "next/server";
import { getVisitorInfo } from "@/lib/visitor-info";

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

/**
 * GET /api/r?to=URL&from=PAGE&label=LABEL&cat=CATEGORY
 * Ziyaretçi bilgilerini loglar ve hedefe 302 yönlendirir.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const to    = searchParams.get("to");
  const from  = searchParams.get("from") ?? "/";
  const label = searchParams.get("label") ?? "";
  const cat   = searchParams.get("cat") ?? "outbound";

  // Güvenlik: sadece izin verilen domainlere yönlendir
  const ALLOWED_HOSTS = ["asilhali.com.tr", "www.asilhali.com.tr", "wa.me"];
  if (!to) return NextResponse.redirect(new URL("/", req.url));

  try {
    const url = new URL(to);
    if (!ALLOWED_HOSTS.includes(url.hostname)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Arka planda log — yönlendirmeyi asla engellemesin
  (async () => {
    try {
      const v = getVisitorInfo(req);
      const prisma = await getPrisma();
      await (prisma as any).clickEvent.create({
        data: {
          fromPage:  from.slice(0, 500),
          toUrl:     to.slice(0, 500),
          label:     label.slice(0, 100),
          category:  cat,
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
      await prisma.$disconnect();
    } catch {
      // sessizce geç
    }
  })();

  return NextResponse.redirect(to, { status: 302 });
}

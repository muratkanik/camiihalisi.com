import type { NextRequest } from "next/server";

export interface VisitorInfo {
  ip?: string;
  country?: string;
  city?: string;
  ua?: string;
  device?: string;
  browser?: string;
  referer?: string;
  refDomain?: string;
}

/** UA → device type */
function parseDevice(ua: string): string {
  const u = ua.toLowerCase();
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(u)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/.test(u)) return "mobile";
  return "desktop";
}

/** UA → browser name */
function parseBrowser(ua: string): string {
  const u = ua.toLowerCase();
  if (u.includes("edg/") || u.includes("edge/")) return "edge";
  if (u.includes("opr/") || u.includes("opera")) return "opera";
  if (u.includes("chrome") && !u.includes("chromium")) return "chrome";
  if (u.includes("safari") && !u.includes("chrome")) return "safari";
  if (u.includes("firefox")) return "firefox";
  if (u.includes("trident") || u.includes("msie")) return "ie";
  return "other";
}

/** Referer header → domain only */
function refToDomain(ref: string | null): string | undefined {
  if (!ref) return undefined;
  try {
    const url = new URL(ref);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

/** Extract visitor information from a Next.js request */
export function getVisitorInfo(req: NextRequest): VisitorInfo {
  // IP: x-forwarded-for first entry, or x-real-ip
  const xff = req.headers.get("x-forwarded-for");
  const ip = xff
    ? xff.split(",")[0].trim()
    : (req.headers.get("x-real-ip") ?? undefined);

  // Vercel geo headers
  const country = req.headers.get("x-vercel-ip-country") ?? undefined;
  const city    = req.headers.get("x-vercel-ip-city") ?? undefined;

  // User-agent
  const rawUa = req.headers.get("user-agent");
  const ua      = rawUa?.slice(0, 250) ?? undefined;
  const device  = rawUa ? parseDevice(rawUa) : undefined;
  const browser = rawUa ? parseBrowser(rawUa) : undefined;

  // Referer
  const rawRef  = req.headers.get("referer");
  const referer = rawRef?.slice(0, 500) ?? undefined;
  const refDomain = refToDomain(rawRef);

  return { ip, country, city, ua, device, browser, referer, refDomain };
}

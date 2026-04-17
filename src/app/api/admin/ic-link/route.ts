import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loadLinkMap, saveLinkMap, DEFAULT_LINK_MAP, LinkMap } from "@/lib/internal-links";

async function checkAuth() {
  const cookieStore = await cookies();
  return !!cookieStore.get("auth_token")?.value;
}

// GET /api/admin/ic-link — returns current link map
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const map = await loadLinkMap();
  return NextResponse.json({ map });
}

// POST /api/admin/ic-link — saves the entire map
export async function POST(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { map } = await req.json() as { map: LinkMap };
  if (!map || typeof map !== "object") {
    return NextResponse.json({ error: "Invalid map" }, { status: 400 });
  }
  await saveLinkMap(map);
  return NextResponse.json({ ok: true });
}

// DELETE /api/admin/ic-link — resets to defaults
export async function DELETE() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await saveLinkMap(DEFAULT_LINK_MAP);
  return NextResponse.json({ ok: true, map: DEFAULT_LINK_MAP });
}

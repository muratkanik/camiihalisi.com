import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { STATIC_IMAGES } from "@/lib/image-manifest";

async function checkAuth() {
  const cookieStore = await cookies();
  return !!cookieStore.get("auth_token")?.value;
}

async function getBlobImages(): Promise<string[]> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return [];
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const blobModule = await import("@vercel/blob" as any);
    const { blobs } = await blobModule.list({ prefix: "gallery/" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return blobs.map((b: any) => b.url);
  } catch {
    return [];
  }
}

// GET /api/admin/galeri — returns { images: string[], blobSupported: boolean }
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const blobImages = await getBlobImages();
  const blobSupported = !!process.env.BLOB_READ_WRITE_TOKEN;

  return NextResponse.json({
    static: STATIC_IMAGES,
    uploaded: blobImages,
    blobSupported,
  });
}

// DELETE /api/admin/galeri — deletes a blob image by URL
export async function DELETE(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url } = await req.json();
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Blob not configured" }, { status: 400 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const blobModule = await import("@vercel/blob" as any);
    await blobModule.del(url);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Hata" },
      { status: 500 }
    );
  }
}

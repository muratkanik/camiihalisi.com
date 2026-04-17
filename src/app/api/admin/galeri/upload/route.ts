import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

async function checkAuth() {
  const cookieStore = await cookies();
  return !!cookieStore.get("auth_token")?.value;
}

// POST /api/admin/galeri/upload — multipart form with file field
export async function POST(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Blob depolama yapılandırılmamış. BLOB_READ_WRITE_TOKEN ortam değişkeni gereklidir." },
      { status: 400 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const blobModule = await import("@vercel/blob" as any);
    const filename = `gallery/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const blob = await blobModule.put(filename, file, {
      access: "public",
      token,
    });

    return NextResponse.json({ url: blob.url });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Yükleme hatası" },
      { status: 500 }
    );
  }
}

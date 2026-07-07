import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assuming a global prisma instance exists

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      productSlug, 
      productTitle, 
      productUrl, 
      originalImageUrl, 
      mappings, 
      previewImageUrl 
    } = body;

    if (!productSlug || !mappings || !Array.isArray(mappings)) {
      return NextResponse.json({ error: "Eksik parametreler" }, { status: 400 });
    }

    // Limit preview image size or drop it if too large (e.g. > 1MB)
    let finalPreviewImageUrl = previewImageUrl;
    if (previewImageUrl && previewImageUrl.length > 1024 * 1024) {
      console.warn("Preview image too large, dropping from DB");
      finalPreviewImageUrl = null;
    }

    const session = await prisma.carpetDesignSession.create({
      data: {
        productSlug,
        productTitle: productTitle || productSlug,
        productUrl: productUrl || "",
        originalImageUrl: originalImageUrl || "",
        mappings,
        previewImageUrl: finalPreviewImageUrl,
        status: "shared",
      },
    });

    return NextResponse.json({ success: true, designId: session.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating carpet design session:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
  }

  try {
    const session = await prisma.carpetDesignSession.findUnique({
      where: { id },
    });

    if (!session) {
      return NextResponse.json({ error: "Tasarım bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ success: true, session }, { status: 200 });
  } catch (error) {
    console.error("Error fetching carpet design session:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

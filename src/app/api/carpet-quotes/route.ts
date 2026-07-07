import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      designSessionId,
      productSlug,
      customerName,
      customerPhone,
      customerEmail,
      city,
      district,
      requestedSize,
      requestedQuantity,
      customerNote,
      contactPreference
    } = body;

    if (!designSessionId || !customerName || !customerPhone || !contactPreference) {
      return NextResponse.json({ error: "Eksik parametreler. Ad soyad ve telefon zorunludur." }, { status: 400 });
    }
    
    if (customerName.length < 2 || customerPhone.length < 5) {
      return NextResponse.json({ error: "Geçersiz ad veya telefon." }, { status: 400 });
    }

    // Optional: update session status
    await prisma.carpetDesignSession.update({
      where: { id: designSessionId },
      data: { status: "quote_requested", customerName, customerPhone, customerEmail, requestedSize, requestedQuantity, customerNote }
    });

    const quote = await prisma.carpetQuoteRequest.create({
      data: {
        designSessionId,
        productSlug,
        customerName,
        customerPhone,
        customerEmail,
        city,
        district,
        requestedSize,
        requestedQuantity,
        customerNote,
        contactPreference,
        status: "new"
      },
    });

    // TODO: Trigger email sending logic here if an email service is available

    return NextResponse.json({ success: true, quoteId: quote.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating quote request:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

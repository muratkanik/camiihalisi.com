import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patternName, colorChanges, customerName, phone, email, locale } = body;

    // Validation
    if (!patternName || !customerName || !phone) {
      return NextResponse.json(
        { error: "patternName, customerName, phone are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.from("order_requests").insert({
      pattern_name: patternName,
      color_changes: colorChanges || [],
      customer_name: customerName,
      phone,
      email: email || null,
      locale: locale || "tr",
      status: "new",
    }).select("id").single();

    if (error) {
      console.error("Supabase order insert error:", error);
      return NextResponse.json(
        { error: "Failed to save order" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, orderId: data.id });
  } catch (err) {
    console.error("Order API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_OFFICES } from "@/app/[locale]/admin/iletisim/types";

const SETTINGS_DEFAULTS = {
  phone: "+90 532 346 79 39",
  email: "info@asilhali.com.tr",
  address: "Kayseri, Türkiye",
  whatsappNumber: "905062259235",
  whatsappMessage: "Merhaba%2C%20cami%20hal%C4%B1s%C4%B1%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.",
};

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

// GET /api/iletisim — public: offices + settings for the contact page
export async function GET() {
  const prisma = await getPrisma();
  try {
    const [officesRow, settingsRows] = await Promise.all([
      prisma.setting.findUnique({ where: { key: "contact_offices" } }),
      prisma.setting.findMany({
        where: { key: { in: ["phone", "email", "address", "whatsapp_number", "whatsapp_message"] } },
      }),
    ]);

    const offices = officesRow
      ? JSON.parse(officesRow.value)
      : DEFAULT_OFFICES;

    // Build settings from DB rows
    const settingsMap: Record<string, string> = {};
    for (const row of settingsRows) settingsMap[row.key] = row.value;

    const settings = {
      phone: settingsMap["phone"] ?? SETTINGS_DEFAULTS.phone,
      email: settingsMap["email"] ?? SETTINGS_DEFAULTS.email,
      address: settingsMap["address"] ?? SETTINGS_DEFAULTS.address,
      whatsappNumber: settingsMap["whatsapp_number"] ?? SETTINGS_DEFAULTS.whatsappNumber,
      whatsappMessage: settingsMap["whatsapp_message"] ?? SETTINGS_DEFAULTS.whatsappMessage,
    };

    return NextResponse.json({
      offices: offices.filter((o: { active: boolean }) => o.active),
      settings,
    });
  } catch {
    return NextResponse.json({
      offices: DEFAULT_OFFICES.filter((o) => o.active),
      settings: {
        phone: SETTINGS_DEFAULTS.phone,
        email: SETTINGS_DEFAULTS.email,
        address: SETTINGS_DEFAULTS.address,
        whatsappNumber: SETTINGS_DEFAULTS.whatsappNumber,
        whatsappMessage: SETTINGS_DEFAULTS.whatsappMessage,
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/iletisim — public: save contact form submission
export async function POST(req: NextRequest) {
  let body: {
    name?: string;
    email?: string;
    phone?: string;
    mosque?: string;
    message?: string;
    type?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const { name, email, phone, mosque, message, type } = body;

  if (!name?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Ad ve mesaj alanları zorunludur" }, { status: 400 });
  }

  const submission = {
    id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim(),
    email: email?.trim() ?? "",
    phone: phone?.trim() ?? "",
    mosque: mosque?.trim() ?? "",
    message: message.trim(),
    type: type ?? "bilgi",
    submittedAt: new Date().toISOString(),
    read: false,
  };

  const prisma = await getPrisma();
  try {
    const row = await prisma.setting.findUnique({ where: { key: "contact_submissions" } });
    const existing: typeof submission[] = row ? JSON.parse(row.value) : [];
    existing.unshift(submission); // newest first

    // Keep last 200 submissions
    const trimmed = existing.slice(0, 200);

    await prisma.setting.upsert({
      where: { key: "contact_submissions" },
      create: { key: "contact_submissions", value: JSON.stringify(trimmed) },
      update: { value: JSON.stringify(trimmed) },
    });

    return NextResponse.json({ ok: true, id: submission.id });
  } catch (err: unknown) {
    console.error("Contact form save error:", err);
    // Don't fail visibly — still return success to user
    return NextResponse.json({ ok: true, id: submission.id });
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/admin/init-translations
 *
 * 1. Reads all locale message JSON files and saves them into `ui_translation_overrides`.
 * 2. Seeds `blog_translations` for the 3 ProblemSection blog posts (EN/AR/FR).
 *
 * Shape saved: { [namespace]: { [locale]: { [flatKey]: string } } }
 * Nested keys are flattened with dots, e.g. blog.categories.all → "categories.all" under "blog" ns.
 *
 * Safe to run multiple times — existing admin overrides win on merge.
 */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LOCALES = ["tr", "en", "ar", "fr"] as const;

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return !!cookieStore.get("auth_token")?.value;
}

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

/** Recursively flatten an object: { a: { b: "v" } } → { "a.b": "v" } */
function flatten(
  obj: Record<string, unknown>,
  prefix = ""
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(result, flatten(v as Record<string, unknown>, key));
    } else {
      result[key] = String(v ?? "");
    }
  }
  return result;
}

// Blog translations for the 3 ProblemSection posts (hardcoded EN/AR/FR)
const PROBLEM_BLOG_TRANSLATIONS: Record<string, Record<string, Record<string, string>>> = {
  "yanlis-teknik-secim-neden-hali-yipratiyor": {
    en: {
      title: "Wrong Technical Choice",
      excerpt: "If the wrong thread, density and base are chosen, carpets deform quickly.",
    },
    ar: {
      title: "الاختيار التقني الخاطئ",
      excerpt: "إذا لم يتم اختيار الخيط والكثافة والقاعدة الصحيحة، تتشوه السجاجيد بسرعة.",
    },
    fr: {
      title: "Mauvais Choix Technique",
      excerpt: "Si le mauvais fil, la densité et la base ne sont pas choisis, les tapis se déforment rapidement.",
    },
  },
  "eksik-zemin-analizi-cami-halisini-nasil-etkiler": {
    en: {
      title: "Insufficient Floor Analysis",
      excerpt: "If floor details and usage intensity are not properly analyzed, unavoidable problems arise.",
    },
    ar: {
      title: "تحليل الأرضية غير الكافي",
      excerpt: "إذا لم يتم تحليل تفاصيل الأرضية وكثافة الاستخدام بشكل صحيح، تنشأ مشاكل لا يمكن تجنبها.",
    },
    fr: {
      title: "Analyse du Sol Insuffisante",
      excerpt: "Si les détails du sol et l'intensité d'utilisation ne sont pas correctement analysés, des problèmes inévitables surviennent.",
    },
  },
  "kalitesiz-montaj-sureci-hali-omrunu-kisaltiyor": {
    en: {
      title: "Poor Installation Process",
      excerpt: "Irregular and unprofessional installation shortens the lifespan of the carpet.",
    },
    ar: {
      title: "عملية تركيب رديئة",
      excerpt: "التركيب غير المنتظم وغير الاحترافي يقصر من عمر السجادة.",
    },
    fr: {
      title: "Mauvais Processus d'Installation",
      excerpt: "Une installation irrégulière et non professionnelle raccourcit la durée de vie du tapis.",
    },
  },
};

export async function POST() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const messagesDir = path.join(process.cwd(), "messages");

  // Build: { [ns]: { [locale]: { [flatKey]: string } } }
  const fromFiles: Record<string, Record<string, Record<string, string>>> = {};

  for (const locale of LOCALES) {
    const filePath = path.join(messagesDir, `${locale}.json`);
    if (!fs.existsSync(filePath)) continue;

    let raw: Record<string, unknown>;
    try {
      raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch {
      continue;
    }

    for (const [ns, nsValue] of Object.entries(raw)) {
      if (!nsValue || typeof nsValue !== "object") continue;
      const flat = flatten(nsValue as Record<string, unknown>);
      if (!fromFiles[ns]) fromFiles[ns] = {};
      fromFiles[ns][locale] = flat;
    }
  }

  const prisma = await getPrisma();
  try {
    // Load existing admin overrides — admin values WIN over file defaults
    const row = await prisma.setting.findUnique({
      where: { key: "ui_translation_overrides" },
    });
    const existing: Record<string, Record<string, Record<string, string>>> = row
      ? JSON.parse(row.value)
      : {};

    // Merge: files as base, admin overrides on top
    const merged: Record<string, Record<string, Record<string, string>>> = {};

    const allNs = new Set([
      ...Object.keys(fromFiles),
      ...Object.keys(existing),
    ]);

    for (const ns of allNs) {
      merged[ns] = {};
      const allLocales = new Set([
        ...Object.keys(fromFiles[ns] ?? {}),
        ...Object.keys(existing[ns] ?? {}),
      ]);
      for (const locale of allLocales) {
        merged[ns][locale] = {
          ...(fromFiles[ns]?.[locale] ?? {}),
          ...(existing[ns]?.[locale] ?? {}), // admin overrides win
        };
      }
    }

    await prisma.setting.upsert({
      where: { key: "ui_translation_overrides" },
      create: { key: "ui_translation_overrides", value: JSON.stringify(merged) },
      update: { value: JSON.stringify(merged) },
    });

    // ── Step 2: Seed blog_translations for ProblemSection posts ──────────────
    const blogRow = await prisma.setting.findUnique({ where: { key: "blog_translations" } });
    const existingBlog: Record<string, Record<string, Record<string, string>>> = blogRow
      ? JSON.parse(blogRow.value)
      : {};

    for (const [slug, localeMap] of Object.entries(PROBLEM_BLOG_TRANSLATIONS)) {
      if (!existingBlog[slug]) existingBlog[slug] = {};
      for (const [locale, fields] of Object.entries(localeMap)) {
        existingBlog[slug][locale] = { ...(existingBlog[slug][locale] ?? {}), ...fields };
      }
    }

    await prisma.setting.upsert({
      where: { key: "blog_translations" },
      create: { key: "blog_translations", value: JSON.stringify(existingBlog) },
      update: { value: JSON.stringify(existingBlog) },
    });

    const nsCount = Object.keys(merged).length;
    const keyCount = Object.values(merged).reduce(
      (sum, locMap) =>
        sum +
        Object.values(locMap).reduce((s, keys) => s + Object.keys(keys).length, 0),
      0
    );

    return NextResponse.json({
      ok: true,
      namespaces: nsCount,
      totalKeys: keyCount,
      locales: LOCALES,
      blogSlugsSeeded: Object.keys(PROBLEM_BLOG_TRANSLATIONS),
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  return NextResponse.json({
    info: "POST this endpoint to seed all locale message files into ui_translation_overrides DB key.",
    locales: LOCALES,
    messagesDir: "messages/",
  });
}

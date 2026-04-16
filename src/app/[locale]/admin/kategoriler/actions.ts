"use server";

import { revalidatePath } from "next/cache";
import { CATEGORIES, CategoryMeta } from "@/lib/categories";
import { scorePage, saveSeoScore, SeoScoreResult } from "@/lib/seo-scorer";

export interface CategoryOverride {
  slug: string;
  title?: string;
  description?: string;
  badge?: string;
  image?: string;
  features?: string[];
  color?: string;
  metaDescription?: string;
  seoKeyword?: string;
}

export type CategoryWithOverride = {
  slug: string;
  title: string;
  label: string;
  priority: "high" | "medium" | "low";
  image: string;
  description: string;
  badge: string;
  features: string[];
  color: string;
  metaDescription: string;
  seoKeyword: string;
  hasOverride: boolean;
};

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

// Default category data hardcoded in CategoryGrid — replicate enough for admin UI
const CATEGORY_DETAILS: Record<string, Partial<CategoryOverride>> = {
  "akrilik-cami-halisi": {
    description: "Parlak renkleri, yumuşak dokusu ve ekonomik fiyatıyla en çok tercih edilen halı türü.",
    badge: "En Çok Satan",
    image: "/images/cami-1.png",
    features: ["Solmaz Renk", "Yumuşak Doku", "Ekonomik"],
    color: "#1B4332",
    metaDescription: "Akrilik cami halısı modelleri, fiyatları ve özellikleri hakkında detaylı bilgi. Asil Halı'dan kaliteli akrilik cami halısı seçenekleri.",
    seoKeyword: "akrilik cami halısı",
  },
  "yun-cami-halisi": {
    description: "Doğal yünün sıcaklığı ve dayanıklılığıyla ibadethaneye özel lüks.",
    badge: "Premium",
    image: "/images/cami-2.png",
    features: ["%100 Doğal", "Isı Yalıtımı", "Uzun Ömür"],
    color: "#2D6A4F",
    metaDescription: "Yün cami halısı fiyatları ve modelleri. %100 doğal yünden üretilen premium cami halıları. Asil Halı güvencesiyle.",
    seoKeyword: "yün cami halısı",
  },
  "polipropilen-cami-halisi": {
    description: "Neme ve lekeye karşı üstün direnciyle yüksek trafik alanları için üretilmiş.",
    badge: "Dayanıklı",
    image: "/images/cami-3.png",
    features: ["Kolay Temizlik", "Leke Tutmaz", "Yüksek Trafik"],
    color: "#1B4332",
    metaDescription: "Polipropilen cami halısı seçenekleri. Neme ve lekeye dayanıklı, yüksek trafikli camiler için ideal halı çözümleri.",
    seoKeyword: "polipropilen cami halısı",
  },
  "polyamid-cami-halisi": {
    description: "Sentetik liflerin en kalitelisi. Yüksek aşınma direnci ve canlı renkler.",
    badge: "Profesyonel",
    image: "/images/cami-4.png",
    features: ["Aşınmaz", "Canlı Renkler", "Büyük Hacim"],
    color: "#2D6A4F",
    metaDescription: "Polyamid cami halısı modelleri. Yüksek aşınma direnci ve canlı renkleriyle profesyonel cami halısı çözümleri.",
    seoKeyword: "polyamid cami halısı",
  },
  "ozel-desen-axminster-cami-halisi": {
    description: "Sınırsız renk ve desen seçeneğiyle tamamen özelleştirilebilir Axminster dokuma.",
    badge: "Özel Sipariş",
    image: "/images/cami-hero.png",
    features: ["Sınırsız Renk", "Özel Tasarım", "Ücretsiz 3D Görsel"],
    color: "#1B4332",
    metaDescription: "Özel desen Axminster cami halısı siparişi. Sınırsız renk ve desen seçeneğiyle kişiselleştirilmiş cami halısı tasarımı.",
    seoKeyword: "axminster cami halısı",
  },
};

export async function getCategories(): Promise<CategoryWithOverride[]> {
  const prisma = await getPrisma();
  let overrides: CategoryOverride[] = [];
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "category_overrides" } });
    if (setting) {
      overrides = JSON.parse(setting.value) as CategoryOverride[];
    }
  } catch {
    // ignore
  } finally {
    await prisma.$disconnect();
  }

  return CATEGORIES.map((cat) => {
    const defaults: Partial<CategoryOverride> = CATEGORY_DETAILS[cat.slug] ?? {};
    const override: Partial<CategoryOverride> = overrides.find((o) => o.slug === cat.slug) ?? {};
    return {
      ...cat,
      description: override.description ?? defaults.description ?? "",
      badge: override.badge ?? defaults.badge ?? "",
      image: override.image ?? defaults.image ?? "/images/cami-hero.png",
      features: override.features ?? defaults.features ?? [],
      color: override.color ?? defaults.color ?? "#1B4332",
      slug: override.slug ?? cat.slug,
      title: override.title ?? cat.label,
      metaDescription: override.metaDescription ?? defaults.metaDescription ?? "",
      seoKeyword: override.seoKeyword ?? defaults.seoKeyword ?? cat.label,
      hasOverride: Object.keys(override).length > 0,
    };
  });
}

export async function getCategorySeoScores(): Promise<Record<string, SeoScoreResult | null>> {
  const prisma = await getPrisma();
  try {
    const slugs = CATEGORIES.map((c) => c.slug);
    const keys = slugs.map((s) => `seo_score_cat_${s}`);
    const rows = await prisma.setting.findMany({ where: { key: { in: keys } } });
    const result: Record<string, SeoScoreResult | null> = {};
    for (const slug of slugs) {
      const row = rows.find((r) => r.key === `seo_score_cat_${slug}`);
      result[slug] = row ? (JSON.parse(row.value) as SeoScoreResult) : null;
    }
    return result;
  } finally {
    await prisma.$disconnect();
  }
}

export async function saveCategoryAction(formData: FormData): Promise<void> {
  const slug = formData.get("slug") as string;
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const badge = (formData.get("badge") as string)?.trim();
  const image = (formData.get("image") as string)?.trim();
  const featuresRaw = (formData.get("features") as string)?.trim();
  const color = (formData.get("color") as string)?.trim();
  const metaDescription = (formData.get("metaDescription") as string)?.trim();
  const seoKeyword = (formData.get("seoKeyword") as string)?.trim();

  const features = featuresRaw
    ? featuresRaw.split(",").map((f) => f.trim()).filter(Boolean)
    : undefined;

  const prisma = await getPrisma();
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "category_overrides" } });
    const overrides: CategoryOverride[] = setting ? JSON.parse(setting.value) : [];

    const idx = overrides.findIndex((o) => o.slug === slug);
    const updated: CategoryOverride = {
      slug,
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(badge ? { badge } : {}),
      ...(image ? { image } : {}),
      ...(features ? { features } : {}),
      ...(color ? { color } : {}),
      ...(metaDescription ? { metaDescription } : {}),
      ...(seoKeyword ? { seoKeyword } : {}),
    };

    if (idx >= 0) {
      overrides[idx] = { ...overrides[idx], ...updated };
    } else {
      overrides.push(updated);
    }

    await prisma.setting.upsert({
      where: { key: "category_overrides" },
      update: { value: JSON.stringify(overrides) },
      create: { key: "category_overrides", value: JSON.stringify(overrides) },
    });

    // ── SEO Score ──────────────────────────────────────────────────────────
    const defaults = CATEGORY_DETAILS[slug] ?? {};
    const mergedOverride = overrides.find((o) => o.slug === slug) ?? {};
    const kw = seoKeyword || (mergedOverride as CategoryOverride).seoKeyword || defaults.seoKeyword || slug.replace(/-/g, " ");
    const seoTitle = title || (mergedOverride as CategoryOverride).title || "";
    const seoDesc = description || (mergedOverride as CategoryOverride).description || defaults.description || "";
    const seoMeta = metaDescription || (mergedOverride as CategoryOverride).metaDescription || defaults.metaDescription || "";
    const seoScore = scorePage({
      keyword: kw,
      title: seoTitle,
      metaDescription: seoMeta,
      content: seoDesc,
    });
    await saveSeoScore(`cat_${slug}`, seoScore);

    revalidatePath("/", "layout");
  } finally {
    await prisma.$disconnect();
  }
}

export async function resetCategoryAction(formData: FormData): Promise<void> {
  const slug = formData.get("slug") as string;
  const prisma = await getPrisma();
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "category_overrides" } });
    if (!setting) return;
    const overrides: CategoryOverride[] = JSON.parse(setting.value);
    const updated = overrides.filter((o) => o.slug !== slug);
    await prisma.setting.update({
      where: { key: "category_overrides" },
      data: { value: JSON.stringify(updated) },
    });

    // Recompute SEO score from defaults
    const defaults = CATEGORY_DETAILS[slug] ?? {};
    if (defaults.seoKeyword || defaults.description) {
      const seoScore = scorePage({
        keyword: defaults.seoKeyword || slug.replace(/-/g, " "),
        title: defaults.title || slug,
        metaDescription: defaults.metaDescription || "",
        content: defaults.description || "",
      });
      await saveSeoScore(`cat_${slug}`, seoScore);
    }

    revalidatePath("/", "layout");
  } finally {
    await prisma.$disconnect();
  }
}

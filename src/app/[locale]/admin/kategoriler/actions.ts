"use server";

import { revalidatePath } from "next/cache";
import { CATEGORIES, CategoryMeta } from "@/lib/categories";

export interface CategoryOverride {
  slug: string;
  title?: string;
  description?: string;
  badge?: string;
  image?: string;
  features?: string[];
  color?: string;
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
  },
  "yun-cami-halisi": {
    description: "Doğal yünün sıcaklığı ve dayanıklılığıyla ibadethaneye özel lüks.",
    badge: "Premium",
    image: "/images/cami-2.png",
    features: ["%100 Doğal", "Isı Yalıtımı", "Uzun Ömür"],
    color: "#2D6A4F",
  },
  "polipropilen-cami-halisi": {
    description: "Neme ve lekeye karşı üstün direnciyle yüksek trafik alanları için üretilmiş.",
    badge: "Dayanıklı",
    image: "/images/cami-3.png",
    features: ["Kolay Temizlik", "Leke Tutmaz", "Yüksek Trafik"],
    color: "#1B4332",
  },
  "polyamid-cami-halisi": {
    description: "Sentetik liflerin en kalitelisi. Yüksek aşınma direnci ve canlı renkler.",
    badge: "Profesyonel",
    image: "/images/cami-4.png",
    features: ["Aşınmaz", "Canlı Renkler", "Büyük Hacim"],
    color: "#2D6A4F",
  },
  "ozel-desen-axminster-cami-halisi": {
    description: "Sınırsız renk ve desen seçeneğiyle tamamen özelleştirilebilir Axminster dokuma.",
    badge: "Özel Sipariş",
    image: "/images/cami-hero.png",
    features: ["Sınırsız Renk", "Özel Tasarım", "Ücretsiz 3D Görsel"],
    color: "#1B4332",
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
      hasOverride: Object.keys(override).length > 0,
    };
  });
}

export async function saveCategoryAction(formData: FormData): Promise<void> {
  const slug = formData.get("slug") as string;
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const badge = (formData.get("badge") as string)?.trim();
  const image = (formData.get("image") as string)?.trim();
  const featuresRaw = (formData.get("features") as string)?.trim();
  const color = (formData.get("color") as string)?.trim();

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
    revalidatePath("/", "layout");
  } finally {
    await prisma.$disconnect();
  }
}

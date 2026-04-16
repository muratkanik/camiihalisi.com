"use server";

import { revalidatePath } from "next/cache";

export interface HeroSlide {
  id: string;
  imageUrl: string;
  alt: string;
  isActive: boolean;
  order: number;
}

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const prisma = await getPrisma();
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "hero_slides" } });
    if (!setting) return getDefaultSlides();
    return JSON.parse(setting.value) as HeroSlide[];
  } catch {
    return getDefaultSlides();
  } finally {
    await prisma.$disconnect();
  }
}

function getDefaultSlides(): HeroSlide[] {
  const images = [
    "/images/cami-hero.png",
    "/images/hd-foto-01.jpg", "/images/hd-foto-02.jpg", "/images/hd-foto-03.jpg",
    "/images/hd-foto-04.jpg", "/images/hd-foto-05.jpg", "/images/hd-foto-06.jpg",
    "/images/hd-foto-07.jpg", "/images/hd-foto-08.jpg", "/images/hd-foto-09.jpg",
    "/images/hd-foto-10.jpg", "/images/hd-foto-11.jpg", "/images/hd-foto-12.jpg",
    "/images/hd-foto-13.jpg", "/images/hd-foto-14.jpg", "/images/hd-foto-15.jpg",
    "/images/hd-foto-16.jpg", "/images/hd-foto-17.jpg", "/images/hd-foto-18.jpg",
    "/images/hd-foto-19.jpg", "/images/hd-foto-20.jpg",
    "/images/hd-foto-22.jpg", "/images/hd-foto-23.jpg", "/images/hd-foto-24.jpg",
    "/images/hd-foto-25.jpg", "/images/hd-foto-26.jpg", "/images/hd-foto-28.jpg",
    "/images/panorama-cami.jpg",
  ];
  return images.map((src, i) => ({
    id: `default-${i}`,
    imageUrl: src,
    alt: src.includes("panorama") ? "Panoramik Cami Görünümü" : `Cami Fotoğrafı ${i + 1}`,
    isActive: true,
    order: i,
  }));
}

export async function saveHeroSlidesAction(formData: FormData): Promise<void> {
  const raw = formData.get("slides_json") as string;
  const prisma = await getPrisma();
  try {
    const slides: HeroSlide[] = JSON.parse(raw);
    await prisma.setting.upsert({
      where: { key: "hero_slides" },
      update: { value: JSON.stringify(slides) },
      create: { key: "hero_slides", value: JSON.stringify(slides) },
    });
    revalidatePath("/", "layout");
  } finally {
    await prisma.$disconnect();
  }
}

export async function addHeroSlideAction(formData: FormData): Promise<void> {
  const imageUrl = (formData.get("imageUrl") as string)?.trim();
  const alt = (formData.get("alt") as string)?.trim() || "Cami Fotoğrafı";
  if (!imageUrl) return;

  const slides = await getHeroSlides();
  const newSlide: HeroSlide = {
    id: `slide-${Date.now()}`,
    imageUrl,
    alt,
    isActive: true,
    order: slides.length,
  };
  slides.push(newSlide);

  const prisma = await getPrisma();
  try {
    await prisma.setting.upsert({
      where: { key: "hero_slides" },
      update: { value: JSON.stringify(slides) },
      create: { key: "hero_slides", value: JSON.stringify(slides) },
    });
    revalidatePath("/", "layout");
  } finally {
    await prisma.$disconnect();
  }
}

export async function removeHeroSlideAction(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  const slides = await getHeroSlides();
  const updated = slides.filter((s) => s.id !== id);
  const prisma = await getPrisma();
  try {
    await prisma.setting.upsert({
      where: { key: "hero_slides" },
      update: { value: JSON.stringify(updated) },
      create: { key: "hero_slides", value: JSON.stringify(updated) },
    });
    revalidatePath("/", "layout");
  } finally {
    await prisma.$disconnect();
  }
}

export async function toggleHeroSlideAction(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  const slides = await getHeroSlides();
  const updated = slides.map((s) => s.id === id ? { ...s, isActive: !s.isActive } : s);
  const prisma = await getPrisma();
  try {
    await prisma.setting.upsert({
      where: { key: "hero_slides" },
      update: { value: JSON.stringify(updated) },
      create: { key: "hero_slides", value: JSON.stringify(updated) },
    });
    revalidatePath("/", "layout");
  } finally {
    await prisma.$disconnect();
  }
}

export async function initDefaultSlidesAction(): Promise<void> {
  const defaults = getDefaultSlides();
  const prisma = await getPrisma();
  try {
    await prisma.setting.upsert({
      where: { key: "hero_slides" },
      update: { value: JSON.stringify(defaults) },
      create: { key: "hero_slides", value: JSON.stringify(defaults) },
    });
    revalidatePath("/", "layout");
  } finally {
    await prisma.$disconnect();
  }
}

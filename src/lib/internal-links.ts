/**
 * Internal Linking System
 * Maps keywords to URLs and applies auto-linking in content.
 * Data stored in Setting table with key "internal_links".
 */

export type LinkMap = Record<string, string>; // keyword → url

/**
 * Apply internal links to a plain-text paragraph.
 * - Only links the FIRST occurrence of each keyword per call (per paragraph).
 * - Case-insensitive matching, preserves original casing in display.
 * - Returns HTML string with <a> tags inserted.
 * - Does not link inside existing <a> tags.
 */
export function applyLinks(text: string, links: LinkMap): string {
  if (!text || Object.keys(links).length === 0) return text;

  // Sort keywords longest-first to avoid partial matches
  const keywords = Object.keys(links).sort((a, b) => b.length - a.length);

  let result = text;

  for (const kw of keywords) {
    const url = links[kw];
    if (!url) continue;

    // Match the keyword (whole word preferred, case-insensitive)
    // Only replace first occurrence (not inside existing <a> tags)
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?<!<[^>]*)\\b(${escaped})\\b`, "i");

    result = result.replace(regex, (match) => {
      return `<a href="${url}" class="text-[#006064] underline underline-offset-2 decoration-[#C9972B]/60 hover:decoration-[#C9972B] font-medium transition-colors" title="${kw}">${match}</a>`;
    });
  }

  return result;
}

/**
 * Load link map from Prisma Setting table.
 */
export async function loadLinkMap(): Promise<LinkMap> {
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    try {
      const setting = await prisma.setting.findUnique({
        where: { key: "internal_links" },
      });
      if (!setting) return {};
      return JSON.parse(setting.value) as LinkMap;
    } finally {
      await prisma.$disconnect();
    }
  } catch {
    return {};
  }
}

/**
 * Save link map to Prisma Setting table.
 */
export async function saveLinkMap(map: LinkMap): Promise<void> {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  try {
    await prisma.setting.upsert({
      where: { key: "internal_links" },
      update: { value: JSON.stringify(map) },
      create: { key: "internal_links", value: JSON.stringify(map) },
    });
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Default link map — pre-populated with common site keywords.
 */
export const DEFAULT_LINK_MAP: LinkMap = {
  "akrilik cami halısı": "/kategori/akrilik-cami-halisi",
  "yün cami halısı": "/kategori/yun-cami-halisi",
  "polipropilen cami halısı": "/kategori/polipropilen-cami-halisi",
  "polyamid cami halısı": "/kategori/polyamid-cami-halisi",
  "axminster cami halısı": "/kategori/ozel-desen-axminster-cami-halisi",
  "saflı cami halısı": "/kategori/safli-akrilik-cami-halisi",
  "göbekli cami halısı": "/kategori/gobekli-akrilik-cami-halisi",
  "seccadeli cami halısı": "/kategori/seccadeli-akrilik-cami-halisi",
  "keçe cami halısı altlığı": "/kategori/kece-cami-halisi-altligi",
  "kauçuk cami halısı altlığı": "/kategori/kaucuk-cami-halisi-altligi",
};

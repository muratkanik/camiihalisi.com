/**
 * SEO Scorer — camiihalisi.com
 * Calculates a 0-100 SEO score for any page content.
 * Call scorePage() when content is saved; store result in DB.
 */

export interface SeoCheck {
  score: number;
  max: number;
  status: "good" | "warn" | "bad";
  note: string;
}

export interface SeoScoreResult {
  total: number;          // 0-100
  grade: "A" | "B" | "C" | "D" | "F";
  color: string;          // tailwind color class
  checks: {
    title: SeoCheck;
    metaDescription: SeoCheck;
    contentLength: SeoCheck;
    keywordInTitle: SeoCheck;
    keywordInMeta: SeoCheck;
    keywordDensity: SeoCheck;
    readability: SeoCheck;
  };
  calculatedAt: string;
}

export interface SeoInput {
  keyword: string;        // primary keyword to optimise for
  title: string;
  metaDescription: string;
  content: string;        // full page text (strip HTML before passing)
  excerpt?: string;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function keywordFrequency(text: string, kw: string): number {
  if (!kw || !text) return 0;
  const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = text.toLowerCase().match(new RegExp(escaped.toLowerCase(), "g"));
  return matches ? matches.length : 0;
}

function avgSentenceLength(text: string): number {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10);
  if (!sentences.length) return 0;
  const totalWords = sentences.reduce((acc, s) => acc + countWords(s), 0);
  return totalWords / sentences.length;
}

export function scorePage(input: SeoInput): SeoScoreResult {
  const { keyword, title, metaDescription, content } = input;
  const fullText = `${title} ${metaDescription} ${content}`;
  const wordCount = countWords(content);
  const kw = keyword.toLowerCase();

  // ── 1. Title (0-20) ──────────────────────────────────────────────────
  const titleLen = title.length;
  let titleScore = 0;
  let titleNote = "";
  if (titleLen >= 45 && titleLen <= 65) {
    titleScore = 20;
    titleNote = `✓ Mükemmel uzunluk (${titleLen} karakter)`;
  } else if (titleLen >= 35 && titleLen < 45) {
    titleScore = 14;
    titleNote = `⚠ Biraz kısa (${titleLen} kar.) — 45-65 hedefle`;
  } else if (titleLen > 65 && titleLen <= 80) {
    titleScore = 13;
    titleNote = `⚠ Biraz uzun (${titleLen} kar.) — 65'in altında tut`;
  } else if (titleLen > 80) {
    titleScore = 5;
    titleNote = `✗ Çok uzun (${titleLen} kar.) — Google kesiyor`;
  } else {
    titleScore = 5;
    titleNote = `✗ Çok kısa (${titleLen} kar.) — en az 35 karakter yaz`;
  }
  const titleCheck: SeoCheck = {
    score: titleScore, max: 20,
    status: titleScore >= 16 ? "good" : titleScore >= 10 ? "warn" : "bad",
    note: titleNote,
  };

  // ── 2. Meta Description (0-20) ────────────────────────────────────────
  const metaLen = metaDescription.length;
  let metaScore = 0;
  let metaNote = "";
  if (metaLen >= 130 && metaLen <= 165) {
    metaScore = 20;
    metaNote = `✓ Mükemmel uzunluk (${metaLen} karakter)`;
  } else if (metaLen >= 100 && metaLen < 130) {
    metaScore = 14;
    metaNote = `⚠ Biraz kısa (${metaLen} kar.) — 130-165 hedefle`;
  } else if (metaLen > 165 && metaLen <= 185) {
    metaScore = 13;
    metaNote = `⚠ Biraz uzun (${metaLen} kar.) — 165'in altında tut`;
  } else if (metaLen > 185) {
    metaScore = 5;
    metaNote = `✗ Çok uzun (${metaLen} kar.) — Google kesiyor`;
  } else if (metaLen === 0) {
    metaScore = 0;
    metaNote = `✗ Meta açıklama eksik`;
  } else {
    metaScore = 6;
    metaNote = `✗ Çok kısa (${metaLen} kar.) — en az 100 karakter yaz`;
  }
  const metaCheck: SeoCheck = {
    score: metaScore, max: 20,
    status: metaScore >= 16 ? "good" : metaScore >= 10 ? "warn" : "bad",
    note: metaNote,
  };

  // ── 3. Content Length (0-20) ──────────────────────────────────────────
  let contentScore = 0;
  let contentNote = "";
  if (wordCount >= 1500) {
    contentScore = 20;
    contentNote = `✓ Detaylı içerik (${wordCount} kelime)`;
  } else if (wordCount >= 800) {
    contentScore = 16;
    contentNote = `✓ Yeterli içerik (${wordCount} kelime) — 1500+ hedefle`;
  } else if (wordCount >= 400) {
    contentScore = 11;
    contentNote = `⚠ Kısa içerik (${wordCount} kelime) — en az 800 önerilir`;
  } else if (wordCount >= 100) {
    contentScore = 6;
    contentNote = `✗ Çok kısa (${wordCount} kelime) — en az 400 yaz`;
  } else {
    contentScore = 0;
    contentNote = `✗ İçerik neredeyse yok (${wordCount} kelime)`;
  }
  const contentCheck: SeoCheck = {
    score: contentScore, max: 20,
    status: contentScore >= 16 ? "good" : contentScore >= 10 ? "warn" : "bad",
    note: contentNote,
  };

  // ── 4. Keyword in Title (0-15) ────────────────────────────────────────
  const kwInTitle = title.toLowerCase().includes(kw);
  const kwInTitleBeginning = title.toLowerCase().startsWith(kw) || title.toLowerCase().indexOf(kw) < 15;
  let kwTitleScore = 0;
  let kwTitleNote = "";
  if (kwInTitleBeginning) {
    kwTitleScore = 15;
    kwTitleNote = `✓ Anahtar kelime başlığın başında`;
  } else if (kwInTitle) {
    kwTitleScore = 10;
    kwTitleNote = `✓ Anahtar kelime başlıkta var (başa al: +5p)`;
  } else {
    kwTitleScore = 0;
    kwTitleNote = `✗ Anahtar kelime "${keyword}" başlıkta yok`;
  }
  const kwTitleCheck: SeoCheck = {
    score: kwTitleScore, max: 15,
    status: kwTitleScore >= 12 ? "good" : kwTitleScore >= 8 ? "warn" : "bad",
    note: kwTitleNote,
  };

  // ── 5. Keyword in Meta (0-10) ─────────────────────────────────────────
  const kwInMeta = metaDescription.toLowerCase().includes(kw);
  const kwMetaScore = kwInMeta ? 10 : 0;
  const kwMetaCheck: SeoCheck = {
    score: kwMetaScore, max: 10,
    status: kwInMeta ? "good" : "bad",
    note: kwInMeta
      ? `✓ Anahtar kelime meta açıklamada`
      : `✗ Anahtar kelime "${keyword}" meta açıklamada yok`,
  };

  // ── 6. Keyword Density in Content (0-10) ─────────────────────────────
  let densityScore = 0;
  let densityNote = "";
  if (wordCount > 0) {
    const freq = keywordFrequency(content, keyword);
    const density = (freq / wordCount) * 100;
    if (density >= 0.8 && density <= 2.5) {
      densityScore = 10;
      densityNote = `✓ İdeal yoğunluk (${density.toFixed(1)}% — ${freq} kez)`;
    } else if (density >= 0.4 && density < 0.8) {
      densityScore = 6;
      densityNote = `⚠ Düşük yoğunluk (${density.toFixed(1)}%) — biraz daha ekle`;
    } else if (density > 2.5 && density <= 4) {
      densityScore = 5;
      densityNote = `⚠ Yüksek yoğunluk (${density.toFixed(1)}%) — aşırıya kaçma`;
    } else if (density > 4) {
      densityScore = 1;
      densityNote = `✗ Aşırı doldurma (${density.toFixed(1)}%) — Google penalize eder`;
    } else {
      densityScore = 3;
      densityNote = `✗ Anahtar kelime içerikte çok az (${freq} kez)`;
    }
  } else {
    densityNote = "✗ İçerik yok";
  }
  const densityCheck: SeoCheck = {
    score: densityScore, max: 10,
    status: densityScore >= 8 ? "good" : densityScore >= 5 ? "warn" : "bad",
    note: densityNote,
  };

  // ── 7. Readability (0-5) ──────────────────────────────────────────────
  const avgSentLen = avgSentenceLength(content);
  let readScore = 0;
  let readNote = "";
  if (avgSentLen >= 10 && avgSentLen <= 20) {
    readScore = 5;
    readNote = `✓ Cümle uzunluğu ideal (ort. ${avgSentLen.toFixed(0)} kelime)`;
  } else if (avgSentLen > 20 && avgSentLen <= 30) {
    readScore = 3;
    readNote = `⚠ Cümleler biraz uzun (ort. ${avgSentLen.toFixed(0)} kelime)`;
  } else if (avgSentLen > 30) {
    readScore = 1;
    readNote = `✗ Cümleler çok uzun (ort. ${avgSentLen.toFixed(0)} kelime) — kıs`;
  } else {
    readScore = 2;
    readNote = `⚠ Yeterli cümle bulunamadı`;
  }
  const readCheck: SeoCheck = {
    score: readScore, max: 5,
    status: readScore >= 4 ? "good" : readScore >= 2 ? "warn" : "bad",
    note: readNote,
  };

  // ── Total & Grade ─────────────────────────────────────────────────────
  const total = Math.min(100,
    titleCheck.score + metaCheck.score + contentCheck.score +
    kwTitleCheck.score + kwMetaCheck.score + densityCheck.score + readCheck.score
  );

  const grade: SeoScoreResult["grade"] =
    total >= 85 ? "A" : total >= 70 ? "B" : total >= 55 ? "C" : total >= 40 ? "D" : "F";

  const color =
    total >= 85 ? "emerald" : total >= 70 ? "green" : total >= 55 ? "yellow" : total >= 40 ? "orange" : "red";

  return {
    total,
    grade,
    color,
    checks: {
      title: titleCheck,
      metaDescription: metaCheck,
      contentLength: contentCheck,
      keywordInTitle: kwTitleCheck,
      keywordInMeta: kwMetaCheck,
      keywordDensity: densityCheck,
      readability: readCheck,
    },
    calculatedAt: new Date().toISOString(),
  };
}

export function gradeColor(grade: string): string {
  switch (grade) {
    case "A": return "text-emerald-600 bg-emerald-50 border-emerald-200";
    case "B": return "text-green-600 bg-green-50 border-green-200";
    case "C": return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "D": return "text-orange-600 bg-orange-50 border-orange-200";
    default:  return "text-red-600 bg-red-50 border-red-200";
  }
}

/** Save score to Setting table */
export async function saveSeoScore(key: string, score: SeoScoreResult): Promise<void> {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const settingKey = `seo_score_${key}`;
    await prisma.setting.upsert({
      where: { key: settingKey },
      update: { value: JSON.stringify(score) },
      create: { key: settingKey, value: JSON.stringify(score) },
    });
  } finally {
    await prisma.$disconnect();
  }
}

/** Load score from Setting table */
export async function loadSeoScore(key: string): Promise<SeoScoreResult | null> {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const settingKey = `seo_score_${key}`;
    const row = await prisma.setting.findUnique({ where: { key: settingKey } });
    if (!row) return null;
    return JSON.parse(row.value) as SeoScoreResult;
  } catch {
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

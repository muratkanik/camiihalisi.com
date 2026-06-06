"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, Download, Share2, Undo2, Redo2, RotateCcw, Palette, ShoppingCart, ArrowRight } from "lucide-react";
import { YARN_COLORS, type YarnColor } from "@/lib/yarn-colors";

/* ── Renk Yardımcı Fonksiyonları ── */
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s, l };
}

function hslToRgb(h: number, s: number, l: number) {
  let r, g, b;
  h /= 360;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

/* ── Gelişmiş Renk Eşleştirme ── */

/** Hue farkı (0-180 arası, dairesel) */
function hueDist(h1: number, h2: number): number {
  const d = Math.abs(h1 - h2);
  return d > 180 ? 360 - d : d;
}

/**
 * İki renk arası HSL mesafesi (0-1 arası normalize).
 * Düşük doygunluklu renklerde (gri/beyaz/siyah) hue'yu göz ardı eder.
 */
function colorDistance(h1: number, s1: number, l1: number, h2: number, s2: number, l2: number): number {
  const avgS = (s1 + s2) / 2;
  // Düşük doygunlukta hue anlamsız → ağırlığı düşür
  const hueWeight = Math.min(avgS * 3, 1.0); // s < 0.33 → hue etkisi azalır
  const hDiff = hueDist(h1, h2) / 180; // 0-1
  const sDiff = Math.abs(s1 - s2);      // 0-1
  const lDiff = Math.abs(l1 - l2);      // 0-1
  return Math.sqrt(
    hueWeight * hDiff * hDiff * 2.0 +   // Hue ağırlığı
    sDiff * sDiff * 1.5 +                 // Doygunluk
    lDiff * lDiff * 1.0                   // Parlaklık
  );
}

/**
 * Piksel seçiminde 7×7 alan örnekleyip medyan renk bulur.
 * Gürültüyü azaltır, doğru rengi yakalar.
 */
function sampleAreaColor(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  canvasW: number, canvasH: number
): string {
  const radius = 3; // 7×7 grid
  const samples: { r: number; g: number; b: number }[] = [];

  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const sx = Math.max(0, Math.min(canvasW - 1, cx + dx));
      const sy = Math.max(0, Math.min(canvasH - 1, cy + dy));
      const px = ctx.getImageData(sx, sy, 1, 1).data;
      samples.push({ r: px[0], g: px[1], b: px[2] });
    }
  }

  // Her kanalın medyanını al (gürültü dirençli)
  const sorted = (arr: number[]) => [...arr].sort((a, b) => a - b);
  const mid = Math.floor(samples.length / 2);
  const mr = sorted(samples.map(s => s.r))[mid];
  const mg = sorted(samples.map(s => s.g))[mid];
  const mb = sorted(samples.map(s => s.b))[mid];

  return "#" + [mr, mg, mb].map(v => v.toString(16).padStart(2, "0")).join("");
}

/**
 * Görüntüdeki renk ailelerini çıkarır.
 * Birbirine yakın renkler tek bir temsil rengiyle gösterilir.
 * Kullanıcı bir aile seçtiğinde tüm benzer tonlar değişir.
 */
function extractDominantColors(data: ImageData, maxColors: number = 8): string[] {
  const step = Math.max(1, Math.floor((data.width * data.height) / 15000));

  // Geniş kutulara grupla — yakın renkler aynı kutuya düşsün
  const buckets = new Map<string, { count: number; rSum: number; gSum: number; bSum: number }>();

  for (let i = 0; i < data.data.length; i += 4 * step) {
    const r = data.data[i], g = data.data[i + 1], b = data.data[i + 2];
    const hsl = rgbToHsl(r, g, b);
    if (hsl.l < 0.05 || hsl.l > 0.95) continue;

    // Geniş kova: 20° hue / 0.2 sat / 0.15 light
    const hB = Math.round(hsl.h / 20) * 20;
    const sB = Math.round(hsl.s / 0.2) * 0.2;
    const lB = Math.round(hsl.l / 0.15) * 0.15;
    const key = `${hB}-${sB.toFixed(1)}-${lB.toFixed(2)}`;

    const ex = buckets.get(key);
    if (ex) { ex.count++; ex.rSum += r; ex.gSum += g; ex.bSum += b; }
    else buckets.set(key, { count: 1, rSum: r, gSum: g, bSum: b });
  }

  // Piksel sayısına göre sırala
  const sorted = [...buckets.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, maxColors * 3);

  // Birbirine yakın grupları birleştir (geniş eşik: 0.22)
  const result: string[] = [];
  for (const [, v] of sorted) {
    const avgR = Math.round(v.rSum / v.count);
    const avgG = Math.round(v.gSum / v.count);
    const avgB = Math.round(v.bSum / v.count);
    const hex = "#" + [avgR, avgG, avgB].map(c => c.toString(16).padStart(2, "0")).join("");
    const hsl = rgbToHsl(avgR, avgG, avgB);

    const tooClose = result.some(existing => {
      const eRgb = hexToRgb(existing);
      const eHsl = rgbToHsl(eRgb.r, eRgb.g, eRgb.b);
      return colorDistance(hsl.h, hsl.s, hsl.l, eHsl.h, eHsl.s, eHsl.l) < 0.22;
    });

    if (!tooClose) {
      result.push(hex);
      if (result.length >= maxColors) break;
    }
  }

  return result;
}

/**
 * Gelişmiş renk değiştirme — HSL mesafesine dayalı, adaptif tolerans.
 * Düşük doygunluklu renklerde otomatik olarak parlaklık tabanlı eşleştirme yapar.
 */
function replaceColorInImageData(
  ctx: CanvasRenderingContext2D,
  currentData: ImageData,
  sourceHex: string,
  targetHex: string,
  toleranceLevel: number = 30 // 0-100 arası
): ImageData {
  const newData = ctx.createImageData(currentData);
  const sourceRgb = hexToRgb(sourceHex);
  const sourceHsl = rgbToHsl(sourceRgb.r, sourceRgb.g, sourceRgb.b);
  const targetRgb = hexToRgb(targetHex);
  const targetHsl = rgbToHsl(targetRgb.r, targetRgb.g, targetRgb.b);

  // Normalize tolerans (0-100 → 0.05-0.5 aralığında mesafe eşiği)
  const threshold = 0.05 + (toleranceLevel / 100) * 0.45;

  for (let i = 0; i < currentData.data.length; i += 4) {
    const r = currentData.data[i];
    const g = currentData.data[i + 1];
    const b = currentData.data[i + 2];
    const a = currentData.data[i + 3];
    const pxlHsl = rgbToHsl(r, g, b);

    // Çok açık ve çok koyu pikselleri koru (beyaz/siyah arka plan)
    if (pxlHsl.l < 0.04 || pxlHsl.l > 0.96) {
      newData.data[i] = r;
      newData.data[i + 1] = g;
      newData.data[i + 2] = b;
      newData.data[i + 3] = a;
      continue;
    }

    const dist = colorDistance(pxlHsl.h, pxlHsl.s, pxlHsl.l, sourceHsl.h, sourceHsl.s, sourceHsl.l);

    if (dist < threshold) {
      // Yumuşak geçiş: mesafe eşiğe yaklaştıkça etki azalır
      const blend = Math.max(0, 1 - (dist / threshold));
      const smoothBlend = blend * blend * (3 - 2 * blend); // smoothstep

      const lDiff = pxlHsl.l - sourceHsl.l;
      const sDiff = pxlHsl.s - sourceHsl.s;
      let newH = targetHsl.h;
      let newS = Math.max(0, Math.min(1, targetHsl.s + sDiff * 0.5));
      let newL = Math.max(0, Math.min(1, targetHsl.l + lDiff));

      const replaced = hslToRgb(newH, newS, newL);
      // Orijinal piksel ile replaced arasında smoothBlend ile karıştır
      newData.data[i]     = Math.round(r + (replaced.r - r) * smoothBlend);
      newData.data[i + 1] = Math.round(g + (replaced.g - g) * smoothBlend);
      newData.data[i + 2] = Math.round(b + (replaced.b - b) * smoothBlend);
    } else {
      newData.data[i] = r;
      newData.data[i + 1] = g;
      newData.data[i + 2] = b;
    }
    newData.data[i + 3] = a;
  }
  return newData;
}

/* ── Renk Değişim Kaydı ── */
interface ColorChange {
  sourceHex: string;
  targetHex: string;
  yarnCode: string;
  yarnName: string;
}

/* ── Çeviri Sözlüğü ── */
const MT: Record<string, Record<string, string>> = {
  tr: {
    title: "Renk Değiştirme",
    howTo: "Nasıl kullanılır?",
    step1: "1. Desen üzerinde değiştirmek istediğiniz renge tıklayın",
    step2: "2. Aşağıdaki iplik paletinden yeni rengi seçin",
    step3: "3. \"Uygula\" butonuna basın",
    selectedColor: "Seçili Renk",
    clickHint: "Desen üzerinde bir renge tıklayın",
    yarnPalette: "İplik Renk Paleti",
    yarnCode: "İplik",
    apply: "Rengi Uygula",
    undo: "Geri",
    redo: "İleri",
    reset: "Sıfırla",
    download: "İndir",
    share: "Paylaş",
    colorChanges: "Renk Değişimleri",
    noChanges: "Henüz renk değişikliği yapılmadı",
    original: "Orijinal",
    orderBtn: "Bu Varyasyonla Sipariş Ver",
    orderBtnShort: "Sipariş Ver",
    orderMessage: "📋 SİPARİŞ TALEBİ\n\n🕌 Motif: {pattern}\n\n🎨 Renk Değişiklikleri:\n{changes}\n\n📞 İletişim Bilgileri:\n- Ad Soyad: {name}\n- Telefon: {phone}\n- E-posta: {email}\n\nAsil Halı — camiihalisi.com renk simülatöründen gönderilmiştir.",
    formTitle: "Sipariş Bilgileri",
    formName: "Ad Soyad",
    formPhone: "Telefon",
    formEmail: "E-posta",
    formSubmit: "Gönder ve WhatsApp ile İlet",
    formSaving: "Kaydediliyor...",
    formBack: "Geri Dön",
    formNameReq: "Ad soyad gerekli",
    formPhoneReq: "Telefon gerekli",
    shareText: "Cami halısı desen özelleştirmem:\nMotif: {pattern}\n{changes}\n\nAsil Halı — camiihalisi.com",
    changeItem: "{source} → {target} (İplik: {code})",
  },
  en: {
    title: "Change Colour",
    howTo: "How to use?",
    step1: "1. Click on the colour you want to change on the pattern",
    step2: "2. Choose the new colour from the yarn palette below",
    step3: "3. Press the \"Apply\" button",
    selectedColor: "Selected Colour",
    clickHint: "Click a colour on the pattern",
    yarnPalette: "Yarn Colour Palette",
    yarnCode: "Yarn",
    apply: "Apply Colour",
    undo: "Undo",
    redo: "Redo",
    reset: "Reset",
    download: "Download",
    share: "Share",
    colorChanges: "Colour Changes",
    noChanges: "No colour changes yet",
    original: "Original",
    orderBtn: "Order with This Variation",
    orderBtnShort: "Order",
    orderMessage: "📋 ORDER REQUEST\n\n🕌 Pattern: {pattern}\n\n🎨 Colour Changes:\n{changes}\n\n📞 Contact Details:\n- Name: {name}\n- Phone: {phone}\n- Email: {email}\n\nSent from Asil Halı — camiihalisi.com colour simulator.",
    formTitle: "Order Details",
    formName: "Full Name",
    formPhone: "Phone",
    formEmail: "Email",
    formSubmit: "Submit & Send via WhatsApp",
    formSaving: "Saving...",
    formBack: "Go Back",
    formNameReq: "Name is required",
    formPhoneReq: "Phone is required",
    shareText: "My mosque carpet customisation:\nPattern: {pattern}\n{changes}\n\nAsil Halı — camiihalisi.com",
    changeItem: "{source} → {target} (Yarn: {code})",
  },
  ar: {
    title: "تغيير اللون",
    howTo: "كيفية الاستخدام؟",
    step1: "١. انقر على اللون الذي تريد تغييره على النمط",
    step2: "٢. اختر اللون الجديد من لوحة الخيوط أدناه",
    step3: "٣. اضغط على زر \"تطبيق\"",
    selectedColor: "اللون المحدد",
    clickHint: "انقر على لون على النمط",
    yarnPalette: "لوحة ألوان الخيوط",
    yarnCode: "خيط",
    apply: "تطبيق اللون",
    undo: "تراجع",
    redo: "إعادة",
    reset: "إعادة تعيين",
    download: "تحميل",
    share: "مشاركة",
    colorChanges: "تغييرات الألوان",
    noChanges: "لا توجد تغييرات بعد",
    original: "أصلي",
    orderBtn: "اطلب بهذا التنوع",
    orderBtnShort: "اطلب",
    orderMessage: "📋 طلب شراء\n\n🕌 النمط: {pattern}\n\n🎨 تغييرات الألوان:\n{changes}\n\n📞 بيانات التواصل:\n- الاسم: {name}\n- الهاتف: {phone}\n- البريد الإلكتروني: {email}\n\nمرسل من محاكي ألوان أصيل هالي — camiihalisi.com",
    formTitle: "بيانات الطلب",
    formName: "الاسم الكامل",
    formPhone: "الهاتف",
    formEmail: "البريد الإلكتروني",
    formSubmit: "إرسال عبر واتساب",
    formSaving: "جاري الحفظ...",
    formBack: "رجوع",
    formNameReq: "الاسم مطلوب",
    formPhoneReq: "الهاتف مطلوب",
    shareText: "تخصيص سجاد مسجدي:\nالنمط: {pattern}\n{changes}\n\nأصيل هالي — camiihalisi.com",
    changeItem: "{source} ← {target} (خيط: {code})",
  },
  fr: {
    title: "Changer la Couleur",
    howTo: "Comment utiliser ?",
    step1: "1. Cliquez sur la couleur à modifier sur le motif",
    step2: "2. Choisissez la nouvelle couleur dans la palette de fils",
    step3: "3. Appuyez sur le bouton « Appliquer »",
    selectedColor: "Couleur Sélectionnée",
    clickHint: "Cliquez sur une couleur du motif",
    yarnPalette: "Palette de Fils",
    yarnCode: "Fil",
    apply: "Appliquer la Couleur",
    undo: "Annuler",
    redo: "Rétablir",
    reset: "Réinitialiser",
    download: "Télécharger",
    share: "Partager",
    colorChanges: "Changements de Couleur",
    noChanges: "Aucun changement de couleur",
    original: "Original",
    orderBtn: "Commander avec cette Variation",
    orderBtnShort: "Commander",
    orderMessage: "📋 DEMANDE DE COMMANDE\n\n🕌 Motif : {pattern}\n\n🎨 Changements de couleur :\n{changes}\n\n📞 Coordonnées :\n- Nom : {name}\n- Téléphone : {phone}\n- E-mail : {email}\n\nEnvoyé depuis le simulateur de couleurs Asil Halı — camiihalisi.com",
    formTitle: "Détails de la Commande",
    formName: "Nom Complet",
    formPhone: "Téléphone",
    formEmail: "E-mail",
    formSubmit: "Envoyer via WhatsApp",
    formSaving: "Enregistrement...",
    formBack: "Retour",
    formNameReq: "Le nom est requis",
    formPhoneReq: "Le téléphone est requis",
    shareText: "Ma personnalisation de tapis de mosquée :\nMotif : {pattern}\n{changes}\n\nAsil Halı — camiihalisi.com",
    changeItem: "{source} → {target} (Fil : {code})",
  },
  de: {
    title: "Farbe Ändern",
    howTo: "Wie benutzen?",
    step1: "1. Klicken Sie auf die Farbe, die Sie ändern möchten",
    step2: "2. Wählen Sie die neue Farbe aus der Garnpalette",
    step3: "3. Klicken Sie auf \"Anwenden\"",
    selectedColor: "Ausgewählte Farbe",
    clickHint: "Klicken Sie auf eine Farbe im Muster",
    yarnPalette: "Garn-Farbpalette",
    yarnCode: "Garn",
    apply: "Farbe Anwenden",
    undo: "Rückgängig",
    redo: "Wiederholen",
    reset: "Zurücksetzen",
    download: "Herunterladen",
    share: "Teilen",
    colorChanges: "Farbänderungen",
    noChanges: "Noch keine Farbänderungen",
    original: "Original",
    orderBtn: "Mit dieser Variation bestellen",
    orderBtnShort: "Bestellen",
    orderMessage: "📋 BESTELLANFRAGE\n\n🕌 Muster: {pattern}\n\n🎨 Farbänderungen:\n{changes}\n\n📞 Kontaktdaten:\n- Name: {name}\n- Telefon: {phone}\n- E-Mail: {email}\n\nGesendet vom Asil Halı — camiihalisi.com Farbsimulator.",
    formTitle: "Bestelldetails",
    formName: "Vollständiger Name",
    formPhone: "Telefon",
    formEmail: "E-Mail",
    formSubmit: "Senden & per WhatsApp übermitteln",
    formSaving: "Speichern...",
    formBack: "Zurück",
    formNameReq: "Name ist erforderlich",
    formPhoneReq: "Telefon ist erforderlich",
    shareText: "Meine Moscheeteppich-Anpassung:\nMuster: {pattern}\n{changes}\n\nAsil Halı — camiihalisi.com",
    changeItem: "{source} → {target} (Garn: {code})",
  },
};

function mt(locale: string, key: string): string {
  const dict = MT[locale] || MT.tr;
  return dict[key] || MT.tr[key] || key;
}

/* ── Sipariş Linki Oluşturma (WhatsApp tabanlı, form bilgileriyle) ── */
function buildOrderUrl(patternName: string, changes: ColorChange[], locale: string, form: { name: string; phone: string; email: string }): string {
  const t = (key: string) => mt(locale, key);
  const changesText = changes
    .map(c => t("changeItem")
      .replace("{source}", c.sourceHex)
      .replace("{target}", c.targetHex)
      .replace("{code}", `${c.yarnCode} - ${c.yarnName}`)
    )
    .join("\n");
  const text = t("orderMessage")
    .replace("{pattern}", patternName)
    .replace("{changes}", changesText || t("noChanges"))
    .replace("{name}", form.name)
    .replace("{phone}", form.phone)
    .replace("{email}", form.email || "-");
  return `https://wa.me/905062259235?text=${encodeURIComponent(text)}`;
}

/* ── Bileşen ── */
interface ColorReplacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  patternName: string;
  locale?: string;
}

export default function ColorReplacementModal({
  isOpen,
  onClose,
  imageSrc,
  patternName,
  locale = "tr",
}: ColorReplacementModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedYarn, setSelectedYarn] = useState<YarnColor | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [colorChanges, setColorChanges] = useState<ColorChange[]>([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", email: "" });
  const [orderSaving, setOrderSaving] = useState(false);
  const [orderFormErrors, setOrderFormErrors] = useState<Record<string, string>>({});
  const originalDataRef = useRef<ImageData | null>(null);

  const t = useCallback((key: string) => mt(locale, key), [locale]);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setImageLoaded(false);
    setSelectedColor(null);
    setSelectedYarn(null);
    setExtractedColors([]);
    setHistory([]);
    setHistoryIndex(-1);
    setColorChanges([]);

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const maxW = 560;
      let w = img.width;
      let h = img.height;
      if (w > maxW) { h = (maxW / w) * h; w = maxW; }
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h);
      originalDataRef.current = data;
      setHistory([data]);
      setHistoryIndex(0);

      // Renk ailelerini otomatik çıkar (6-8 ana renk grubu)
      const families = extractDominantColors(data, 8);
      setExtractedColors(families);

      setImageLoaded(true);
    };
  }, [isOpen, imageSrc]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imageLoaded || !canvasRef.current || extractedColors.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    // 7×7 alan medyan örnekleme
    const rawHex = sampleAreaColor(ctx, x, y, canvas.width, canvas.height);
    const rawRgb = hexToRgb(rawHex);
    const rawHsl = rgbToHsl(rawRgb.r, rawRgb.g, rawRgb.b);

    // Her zaman en yakın renk ailesine snap'le
    let bestDist = Infinity;
    let bestColor = extractedColors[0];
    for (const dc of extractedColors) {
      const dcRgb = hexToRgb(dc);
      const dcHsl = rgbToHsl(dcRgb.r, dcRgb.g, dcRgb.b);
      const dist = colorDistance(rawHsl.h, rawHsl.s, rawHsl.l, dcHsl.h, dcHsl.s, dcHsl.l);
      if (dist < bestDist) {
        bestDist = dist;
        bestColor = dc;
      }
    }
    setSelectedColor(bestColor);
  }, [imageLoaded, extractedColors]);

  const applyColor = useCallback(() => {
    if (!selectedColor || !selectedYarn || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const currentData = history[historyIndex];
    if (!currentData) return;
    const newData = replaceColorInImageData(ctx, currentData, selectedColor, selectedYarn.hex, 45);
    ctx.putImageData(newData, 0, 0);
    const newHistory = [...history.slice(0, historyIndex + 1), newData];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    // Renk değişim kaydı
    setColorChanges(prev => [
      ...prev,
      {
        sourceHex: selectedColor,
        targetHex: selectedYarn.hex,
        yarnCode: selectedYarn.code,
        yarnName: locale === "tr" ? selectedYarn.name : selectedYarn.nameEn,
      },
    ]);

    setSelectedColor(null);
  }, [selectedColor, selectedYarn, history, historyIndex, locale]);

  const undo = useCallback(() => {
    if (historyIndex <= 0 || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const newIdx = historyIndex - 1;
    ctx.putImageData(history[newIdx], 0, 0);
    setHistoryIndex(newIdx);
    setColorChanges(prev => prev.slice(0, -1));
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1 || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const newIdx = historyIndex + 1;
    ctx.putImageData(history[newIdx], 0, 0);
    setHistoryIndex(newIdx);
  }, [historyIndex, history]);

  const reset = useCallback(() => {
    if (!originalDataRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.putImageData(originalDataRef.current, 0, 0);
    setHistory([originalDataRef.current]);
    setHistoryIndex(0);
    setSelectedColor(null);
    setSelectedYarn(null);
    setColorChanges([]);
  }, []);

  const download = useCallback(() => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `${patternName.replace(/\s+/g, "-")}-custom-color.jpg`;
    link.href = canvasRef.current.toDataURL("image/jpeg", 0.92);
    link.click();
  }, [patternName]);

  const handleShare = useCallback(() => {
    if (!canvasRef.current) return;
    const changesText = colorChanges
      .map(c => t("changeItem")
        .replace("{source}", c.sourceHex)
        .replace("{target}", c.targetHex)
        .replace("{code}", `${c.yarnCode} - ${c.yarnName}`)
      )
      .join("\n");
    const text = t("shareText")
      .replace("{pattern}", patternName)
      .replace("{changes}", changesText || t("noChanges"));

    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `${patternName}.jpg`, { type: "image/jpeg" });
      if (navigator.share) {
        navigator.share({ title: patternName, text, files: [file] }).catch(() => {});
      }
    }, "image/jpeg", 0.92);
  }, [patternName, colorChanges, t]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const yarnName = (yc: YarnColor) => locale === "tr" ? yc.name : yc.nameEn;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-[960px] w-full max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        {/* ── Başlık ── */}
        <div className="sticky top-0 z-10 bg-white border-b border-[#E0F7FA] px-3 sm:px-4 py-2 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Palette className="w-4 h-4 text-[#0097A7] flex-shrink-0" />
            <h3 className="font-bold text-[#003B40] text-xs sm:text-sm truncate">
              {t("title")} — {patternName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F0FDFE] hover:bg-red-50 flex items-center justify-center text-[#6B6355] hover:text-red-600 transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ── İki Sütunlu Layout (desktop) ── */}
        <div className="p-3 sm:p-4 flex flex-col lg:flex-row gap-3">

          {/* ── Sol: Canvas + Desen Renkleri ── */}
          <div className="lg:w-[55%] flex-shrink-0 space-y-2">
            <div className="relative bg-[#F8F6F3] rounded-xl p-1.5 flex justify-center">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="max-w-full cursor-crosshair rounded-lg shadow-inner"
                style={{ maxHeight: "280px", objectFit: "contain" }}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin w-6 h-6 border-2 border-[#0097A7] border-t-transparent rounded-full" />
                </div>
              )}
            </div>

            {/* Desen Renkleri — canvas altında inline */}
            {extractedColors.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] font-semibold text-[#0097A7] flex-shrink-0">
                  {locale === "tr" ? "Desen:" : locale === "ar" ? "النمط:" : "Pattern:"}
                </span>
                {extractedColors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(c)}
                    className={`w-7 h-7 rounded-md border-2 transition-all ${
                      selectedColor === c ? "border-[#C9972B] scale-110 shadow-md ring-1 ring-[#C9972B]/40" : "border-black/10 hover:border-[#0097A7] hover:scale-105"
                    }`}
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            )}

            {/* Seçili → Hedef mini gösterim */}
            {selectedColor && (
              <div className="flex items-center gap-2 bg-[#F8F6F3] rounded-lg px-2 py-1.5">
                <div className="w-6 h-6 rounded border-2 border-[#E0F7FA] flex-shrink-0" style={{ backgroundColor: selectedColor }} />
                <span className="font-mono text-[10px] text-[#003B40]">{selectedColor}</span>
                {selectedYarn && (
                  <>
                    <ArrowRight className="w-3 h-3 text-[#C9972B] flex-shrink-0" />
                    <div className="w-6 h-6 rounded border-2 border-[#C9972B] flex-shrink-0" style={{ backgroundColor: selectedYarn.hex }} />
                    <span className="font-mono text-[10px] font-bold text-[#003B40]">{selectedYarn.code}</span>
                  </>
                )}
                {selectedColor && selectedYarn && (
                  <button
                    onClick={applyColor}
                    className="ml-auto px-3 py-1 text-[10px] font-bold rounded-lg bg-[#C9972B] hover:bg-[#B8860B] text-white transition-all"
                  >
                    {t("apply")}
                  </button>
                )}
              </div>
            )}

            {/* Renk değişimleri + araç çubuğu (inline) */}
            <div className="flex items-center gap-1 flex-wrap">
              {colorChanges.map((c, i) => (
                <div key={i} className="flex items-center gap-0.5 bg-[#F8F6F3] rounded px-1 py-0.5 text-[8px]">
                  <div className="w-3 h-3 rounded-sm border border-black/10" style={{ backgroundColor: c.sourceHex }} />
                  <ArrowRight className="w-2 h-2 text-[#C9972B]" />
                  <div className="w-3 h-3 rounded-sm border border-black/10" style={{ backgroundColor: c.targetHex }} />
                  <span className="font-mono font-bold">{c.yarnCode}</span>
                </div>
              ))}
              {/* Mini araç butonları */}
              <div className="flex gap-0.5 ml-auto">
                <button onClick={undo} disabled={historyIndex <= 0} className="p-1 rounded bg-[#F0FDFE] text-[#0097A7] hover:bg-[#E0F7FA] disabled:opacity-20 transition-all" title={t("undo")}>
                  <Undo2 className="w-3 h-3" />
                </button>
                <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-1 rounded bg-[#F0FDFE] text-[#0097A7] hover:bg-[#E0F7FA] disabled:opacity-20 transition-all" title={t("redo")}>
                  <Redo2 className="w-3 h-3" />
                </button>
                <button onClick={reset} className="p-1 rounded bg-[#F0FDFE] text-[#0097A7] hover:bg-[#E0F7FA] transition-all" title={t("reset")}>
                  <RotateCcw className="w-3 h-3" />
                </button>
                <button onClick={download} className="p-1 rounded bg-[#003B40] text-white hover:bg-[#005566] transition-all" title={t("download")}>
                  <Download className="w-3 h-3" />
                </button>
                <button onClick={handleShare} className="p-1 rounded bg-[#25D366] text-white hover:bg-[#20BD5C] transition-all" title={t("share")}>
                  <Share2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* ── Sağ: İplik Paleti + Sipariş ── */}
          <div className="lg:w-[45%] space-y-2">
            {/* İplik paleti */}
            <div>
              <label className="text-[10px] font-semibold text-[#6B6355] mb-1 block flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-gradient-to-br from-[#0097A7] to-[#C9972B]" />
                {t("yarnPalette")}
                <span className="text-[9px] font-normal text-[#999]">({YARN_COLORS.length})</span>
              </label>
              <div className="grid grid-cols-9 sm:grid-cols-11 lg:grid-cols-9 gap-0.5">
                {YARN_COLORS.map((yc) => (
                  <button
                    key={yc.code}
                    onClick={() => setSelectedYarn(yc)}
                    className={`group relative flex flex-col items-center p-0.5 rounded transition-all ${
                      selectedYarn?.code === yc.code
                        ? "ring-2 ring-[#C9972B] bg-[#FFF8E8] scale-110 shadow-md z-10"
                        : "hover:bg-[#F0FDFE] hover:scale-110"
                    }`}
                    title={`${yc.code} — ${yarnName(yc)}`}
                  >
                    <div
                      className={`w-full aspect-square rounded border transition-all ${
                        selectedYarn?.code === yc.code
                          ? "border-[#C9972B]"
                          : "border-black/10 group-hover:border-[#0097A7]"
                      }`}
                      style={{ backgroundColor: yc.hex }}
                    />
                    <span className={`text-[7px] font-mono leading-tight ${
                      selectedYarn?.code === yc.code ? "text-[#C9972B] font-bold" : "text-[#AAA]"
                    }`}>
                      {yc.code}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sipariş butonu */}
            {colorChanges.length > 0 && !showOrderForm && (
              <button
                onClick={() => setShowOrderForm(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#C9972B] to-[#E4B84A] text-[#1A1A1A] hover:from-[#B8860B] hover:to-[#C9972B] shadow-lg hover:shadow-xl transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">{t("orderBtn")}</span>
                <span className="sm:hidden">{t("orderBtnShort")}</span>
              </button>
            )}

          {/* ── Sipariş Formu ── */}
          {showOrderForm && (
            <div className="bg-gradient-to-b from-[#FFF8E8] to-white border-2 border-[#C9972B]/30 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[#003B40] flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-[#C9972B]" />
                  {t("formTitle")}
                </h4>
                <button
                  onClick={() => { setShowOrderForm(false); setOrderFormErrors({}); }}
                  className="text-xs text-[#6B6355] hover:text-[#003B40] transition-colors"
                >
                  {t("formBack")}
                </button>
              </div>

              {/* Renk değişimleri özeti */}
              <div className="flex gap-1.5 flex-wrap">
                {colorChanges.map((c, i) => (
                  <div key={i} className="flex items-center gap-1 bg-white rounded-md px-2 py-1 border border-[#E0F7FA] text-[10px]">
                    <div className="w-3 h-3 rounded-sm border border-black/10" style={{ backgroundColor: c.sourceHex }} />
                    <ArrowRight className="w-2.5 h-2.5 text-[#C9972B]" />
                    <div className="w-3 h-3 rounded-sm border border-black/10" style={{ backgroundColor: c.targetHex }} />
                    <span className="font-mono font-bold text-[#003B40]">{c.yarnCode}</span>
                  </div>
                ))}
              </div>

              {/* Form alanları */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[#6B6355] mb-1 block">{t("formName")} *</label>
                  <input
                    type="text"
                    value={orderForm.name}
                    onChange={(e) => { setOrderForm(prev => ({ ...prev, name: e.target.value })); setOrderFormErrors(prev => ({ ...prev, name: "" })); }}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40 transition-all ${
                      orderFormErrors.name ? "border-red-400" : "border-[#E0F7FA]"
                    }`}
                    placeholder={t("formName")}
                  />
                  {orderFormErrors.name && <p className="text-[10px] text-red-500 mt-0.5">{orderFormErrors.name}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#6B6355] mb-1 block">{t("formPhone")} *</label>
                  <input
                    type="tel"
                    value={orderForm.phone}
                    onChange={(e) => { setOrderForm(prev => ({ ...prev, phone: e.target.value })); setOrderFormErrors(prev => ({ ...prev, phone: "" })); }}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40 transition-all ${
                      orderFormErrors.phone ? "border-red-400" : "border-[#E0F7FA]"
                    }`}
                    placeholder="+90 5XX XXX XX XX"
                    dir="ltr"
                  />
                  {orderFormErrors.phone && <p className="text-[10px] text-red-500 mt-0.5">{orderFormErrors.phone}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#6B6355] mb-1 block">{t("formEmail")}</label>
                  <input
                    type="email"
                    value={orderForm.email}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E0F7FA] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40 transition-all"
                    placeholder="ornek@email.com"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Gönder butonu */}
              <button
                onClick={async () => {
                  // Validate
                  const errors: Record<string, string> = {};
                  if (!orderForm.name.trim()) errors.name = t("formNameReq");
                  if (!orderForm.phone.trim()) errors.phone = t("formPhoneReq");
                  if (Object.keys(errors).length > 0) {
                    setOrderFormErrors(errors);
                    return;
                  }

                  setOrderSaving(true);
                  try {
                    // Save to Supabase
                    await fetch("/api/orders", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        patternName,
                        colorChanges: colorChanges.map(c => ({
                          source: c.sourceHex,
                          target: c.targetHex,
                          yarnCode: c.yarnCode,
                          yarnName: c.yarnName,
                        })),
                        customerName: orderForm.name.trim(),
                        phone: orderForm.phone.trim(),
                        email: orderForm.email.trim() || null,
                        locale,
                      }),
                    });
                  } catch {
                    // Even if save fails, still redirect to WhatsApp
                  }

                  // Redirect to WhatsApp
                  const waUrl = buildOrderUrl(patternName, colorChanges, locale, {
                    name: orderForm.name.trim(),
                    phone: orderForm.phone.trim(),
                    email: orderForm.email.trim(),
                  });
                  window.open(waUrl, "_blank");
                  setOrderSaving(false);
                  setShowOrderForm(false);
                }}
                disabled={orderSaving}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                  orderSaving
                    ? "bg-gray-300 text-gray-500 cursor-wait"
                    : "bg-[#25D366] text-white hover:bg-[#20BD5C] shadow-lg hover:shadow-xl"
                }`}
              >
                {orderSaving ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> {t("formSaving")}</>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    {t("formSubmit")}
                  </>
                )}
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

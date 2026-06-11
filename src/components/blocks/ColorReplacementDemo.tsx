"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Share2, MessageCircle, Undo2, Redo2, ZoomIn, ZoomOut } from "lucide-react";

// Helper: Convert hex to RGB
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

// Helper: RGB to HSL
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

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

// Helper: HSL to RGB
function hslToRgb(h: number, s: number, l: number) {
  let r, g, b;
  h /= 360;

  if (s === 0) {
    r = g = b = l; // achromatic
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

function perceptualColorDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) {
  const rmean = (r1 + r2) / 2;
  const r = r1 - r2;
  const g = g1 - g2;
  const b = b1 - b2;
  const weightR = 2 + rmean / 256;
  const weightG = 4;
  const weightB = 2 + (255 - rmean) / 256;
  return Math.sqrt(weightR * r * r + weightG * g * g + weightB * b * b);
}

function extractColorsHistogram(imgData: ImageData, maxColors: number = 6): string[] {
  const binSize = 12; // finer bins
  const bins = new Map<string, { r: number, g: number, b: number, count: number }>();

  // Sample every 4th pixel (step = 16 bytes). 360,000 pixels / 4 = 90,000 samples. Fast and highly accurate.
  const step = 16; 
  let totalSampled = 0;

  for (let i = 0; i < imgData.data.length; i += step) {
    if (imgData.data[i + 3] < 128) continue;
    const r = imgData.data[i];
    const g = imgData.data[i + 1];
    const b = imgData.data[i + 2];
    
    const binR = Math.round(r / binSize) * binSize;
    const binG = Math.round(g / binSize) * binSize;
    const binB = Math.round(b / binSize) * binSize;
    const key = `${binR},${binG},${binB}`;

    const existing = bins.get(key);
    if (existing) {
      existing.r += r;
      existing.g += g;
      existing.b += b;
      existing.count++;
    } else {
      bins.set(key, { r, g, b, count: 1 });
    }
    totalSampled++;
  }

  const sortedBins = Array.from(bins.values()).map(bin => ({
    r: bin.r / bin.count,
    g: bin.g / bin.count,
    b: bin.b / bin.count,
    count: bin.count
  })).sort((a, b) => b.count - a.count);

  const result: string[] = [];
  const minCount = Math.max(1, totalSampled * 0.001); // 0.1% presence

  for (const bin of sortedBins) {
    if (bin.count < minCount) continue;
    
    let tooSimilar = false;
    for (const resHex of result) {
      const rgb = hexToRgb(resHex);
      if (perceptualColorDistance(bin.r, bin.g, bin.b, rgb.r, rgb.g, rgb.b) < 12) {
        tooSimilar = true; 
        break;
      }
    }
    
    if (!tooSimilar) {
      const hex = "#" + [Math.round(bin.r), Math.round(bin.g), Math.round(bin.b)]
        .map(x => x.toString(16).padStart(2, '0')).join('');
      result.push(hex);
    }
    
    if (result.length >= maxColors) break;
  }
  
  return result;
}

// Helper: Replace color in ImageData
function replaceColorInImageData(ctx: CanvasRenderingContext2D, currentData: ImageData, sourceHex: string, targetHex: string, tolerance: number = 50): ImageData {
  const newData = ctx.createImageData(currentData);
  const sourceRgb = hexToRgb(sourceHex);
  const sourceHsl = rgbToHsl(sourceRgb.r, sourceRgb.g, sourceRgb.b);
  const targetRgb = hexToRgb(targetHex);
  const targetHsl = rgbToHsl(targetRgb.r, targetRgb.g, targetRgb.b);

  for (let i = 0; i < currentData.data.length; i += 4) {
    const r = currentData.data[i];
    const g = currentData.data[i + 1];
    const b = currentData.data[i + 2];
    const a = currentData.data[i + 3];

    const dist = perceptualColorDistance(r, g, b, sourceRgb.r, sourceRgb.g, sourceRgb.b);

    if (dist < tolerance) {
      const pxlHsl = rgbToHsl(r, g, b);
      if (pxlHsl.s > 0.05 && pxlHsl.l > 0.05 && pxlHsl.l < 0.95) {
        const lDiff = pxlHsl.l - sourceHsl.l;
        let newL = targetHsl.l + lDiff;
        newL = Math.max(0, Math.min(1, newL));
        const newRgb = hslToRgb(targetHsl.h, targetHsl.s, newL);
        newData.data[i] = newRgb.r;
        newData.data[i + 1] = newRgb.g;
        newData.data[i + 2] = newRgb.b;
      } else {
        newData.data[i] = r;
        newData.data[i + 1] = g;
        newData.data[i + 2] = b;
      }
    } else {
      newData.data[i] = r;
      newData.data[i + 1] = g;
      newData.data[i + 2] = b;
    }
    newData.data[i + 3] = a;
  }
  return newData;
}

const MOTIFS = [
  { id: "sample-motif", src: "/images/sample.bmp", name: "Özel Desen", colors: ["#005577", "#a52a2a", "#e8dcc5"] },
  { id: "s101-turkuaz", src: "/images/s101-turkuaz.webp", name: "S101 Turkuaz", colors: ["#008c99", "#e2d5bc", "#b8860b"] },
  { id: "s101-bordo", src: "/images/s101-bordo.webp", name: "S101 Bordo", colors: ["#6b1c23", "#e2d5bc", "#b8860b"] },
  { id: "s101-bej", src: "/images/s101-bej.webp", name: "S101 Bej", colors: ["#dcd3b6", "#a0522d", "#4b5320"] },
  { id: "cami-1", src: "/images/cami-1.png", name: "Akrilik Saflı", colors: ["#005577", "#a52a2a", "#e8dcc5"] },
  { id: "cami-2", src: "/images/cami-2.png", name: "Yün Göbekli", colors: ["#6B4226", "#e8dcc5", "#005577"] },
  { id: "cami-3", src: "/images/cami-3.png", name: "P.P. Seccadeli", colors: ["#1A4E8B", "#e8dcc5", "#b8860b"] },
  // ── Saflı Akrilik Desen Koleksiyonu ──
  { id: "safli-akrilik-01", src: "/images/desenler/safli-akrilik/safli-akrilik-desen-01.webp", name: "Yıldız Geometri", colors: ["#006B7B", "#4CC4C4", "#FFFFFF"] },
  { id: "safli-akrilik-02", src: "/images/desenler/safli-akrilik/safli-akrilik-desen-02.webp", name: "Sade Bordür", colors: ["#0097A7", "#005566", "#E0F0F0"] },
  { id: "safli-akrilik-03", src: "/images/desenler/safli-akrilik/safli-akrilik-desen-03.webp", name: "Osmanlı Motif", colors: ["#006B7B", "#4CC4C4", "#C9972B"] },
  { id: "safli-akrilik-04", src: "/images/desenler/safli-akrilik/safli-akrilik-desen-04.webp", name: "Klasik Saflı", colors: ["#006B7B", "#4CC4C4", "#E0C880"] },
  { id: "safli-akrilik-05", src: "/images/desenler/safli-akrilik/safli-akrilik-desen-05.webp", name: "Lale Motif", colors: ["#0097A7", "#002244", "#E0C880"] },
  { id: "safli-akrilik-06", src: "/images/desenler/safli-akrilik/safli-akrilik-desen-06.webp", name: "İnce Çizgi", colors: ["#006B7B", "#3BB8B8", "#002244"] },
  { id: "safli-akrilik-07", src: "/images/desenler/safli-akrilik/safli-akrilik-desen-07.webp", name: "Selçuklu Yıldız", colors: ["#006B7B", "#4CC4C4", "#C9972B"] },
  { id: "safli-akrilik-08", src: "/images/desenler/safli-akrilik/safli-akrilik-desen-08.webp", name: "Mihrap Bordür", colors: ["#006B7B", "#3BB8B8", "#E0C880"] },
  { id: "safli-akrilik-09", src: "/images/desenler/safli-akrilik/safli-akrilik-desen-09.webp", name: "Geometrik Şerit", colors: ["#006B7B", "#4CC4C4", "#002244"] },
  { id: "safli-akrilik-10", src: "/images/desenler/safli-akrilik/safli-akrilik-desen-10.webp", name: "Dokuma Doku", colors: ["#005566", "#3BB8B8", "#002244"] },
  { id: "safli-akrilik-11", src: "/images/desenler/safli-akrilik/safli-akrilik-desen-11.webp", name: "Çiçek Motif", colors: ["#006B7B", "#4CC4C4", "#C9972B"] },
  { id: "safli-akrilik-12", src: "/images/desenler/safli-akrilik/safli-akrilik-desen-12.webp", name: "Modern Saflı", colors: ["#0097A7", "#005566", "#E0F0F0"] },
  { id: "safli-akrilik-13", src: "/images/desenler/safli-akrilik/safli-akrilik-desen-13.webp", name: "Halı Bordür", colors: ["#006B7B", "#4CC4C4", "#C9972B"] },
  { id: "safli-akrilik-14", src: "/images/desenler/safli-akrilik/safli-akrilik-desen-14.webp", name: "Zincir Motif", colors: ["#006B7B", "#3BB8B8", "#E0C880"] },
  { id: "safli-akrilik-15", src: "/images/desenler/safli-akrilik/safli-akrilik-desen-15.webp", name: "Büyük Yıldız", colors: ["#005566", "#4CC4C4", "#002244"] },
  { id: "safli-akrilik-16", src: "/images/desenler/safli-akrilik/safli-akrilik-desen-16.webp", name: "Arabesque", colors: ["#006B7B", "#4CC4C4", "#C9972B"] },
  { id: "safli-akrilik-17", src: "/images/desenler/safli-akrilik/safli-akrilik-desen-17.webp", name: "Minimal Saflı", colors: ["#005566", "#0097A7", "#002244"] },
];

export default function ColorReplacementDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentMotif, setCurrentMotif] = useState(MOTIFS[0]);
  const [zoom, setZoom] = useState(1);
  
  const [extractedColors, setExtractedColors] = useState<string[]>(MOTIFS[0].colors);
  const [selectedColorToReplace, setSelectedColorToReplace] = useState<string | null>(null);
  const [newColorHex, setNewColorHex] = useState<string>("#8B1A1A"); 
  const [tolerance, setTolerance] = useState<number>(50);
  const [appliedChanges, setAppliedChanges] = useState<{from: string, to: string}[]>([]);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const originalImageDataRef = useRef<ImageData | null>(null);
  const hasSetMotif = useRef(false);
  const hasAppliedUrlChanges = useRef(false);

  useEffect(() => {
    if (!hasSetMotif.current && typeof window !== 'undefined') {
      hasSetMotif.current = true;
      const params = new URLSearchParams(window.location.search);
      const customUrl = params.get('imageUrl');
      const customName = params.get('motifName');
      const motifId = params.get('motif');

      if (customUrl) {
        setCurrentMotif({
          id: "custom",
          src: customUrl,
          name: customName || "Özel Desen",
          colors: []
        });
        return;
      } else if (motifId && motifId !== currentMotif.id) {
        const found = MOTIFS.find(m => m.id === motifId);
        if (found) {
          setCurrentMotif(found);
          return;
        }
      }
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setImageLoaded(false);
    setSelectedColorToReplace(null);
    setAppliedChanges([]);
    setHistory([]);
    setHistoryIndex(-1);

    const img = new window.Image();
    img.src = currentMotif.src; 
    img.crossOrigin = "Anonymous"; // In case customUrl is external
    img.onload = () => {
      const maxW = 600;
      let w = img.width;
      let h = img.height;
      if (w > maxW) {
        h = (maxW / w) * h;
        w = maxW;
      }
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      
      const initialImgData = ctx.getImageData(0, 0, w, h);
      originalImageDataRef.current = initialImgData;

      if (currentMotif.id === "custom" || currentMotif.colors.length === 0) {
        const extracted = extractColorsHistogram(initialImgData, 6);
        setExtractedColors(extracted.length > 0 ? extracted : ["#ffffff", "#000000"]);
      } else {
        setExtractedColors(currentMotif.colors);
      }

      let finalImgData = initialImgData;
      const initialHistory = [initialImgData];
      const initialChanges: {from: string, to: string}[] = [];

      if (!hasAppliedUrlChanges.current && typeof window !== 'undefined') {
        hasAppliedUrlChanges.current = true;
        const params = new URLSearchParams(window.location.search);
        const changesParam = params.get('changes');
        if (changesParam) {
          const changesList = changesParam.split('_');
          for (const ch of changesList) {
            const parts = ch.split('-');
            if (parts.length === 2) {
              const from = '#' + parts[0];
              const to = '#' + parts[1];
              finalImgData = replaceColorInImageData(ctx, finalImgData, from, to, tolerance);
              initialHistory.push(finalImgData);
              initialChanges.push({ from, to });
            }
          }
          ctx.putImageData(finalImgData, 0, 0);
        }
      }

      setHistory(initialHistory);
      setHistoryIndex(initialHistory.length - 1);
      setAppliedChanges(initialChanges);
      setImageLoaded(true);
    };
  }, [currentMotif, tolerance]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imageLoaded || !canvasRef.current || !originalImageDataRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = "#" + [pixel[0], pixel[1], pixel[2]].map(x => x.toString(16).padStart(2, '0')).join('');
    
    setSelectedColorToReplace(hex);
    
    if (!extractedColors.includes(hex)) {
      setExtractedColors(prev => [hex, ...prev].slice(0, 5));
    }
  };

  const handleReplaceColor = () => {
    if (!selectedColorToReplace || historyIndex < 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const currentData = history[historyIndex];
    const newData = replaceColorInImageData(ctx, currentData, selectedColorToReplace, newColorHex, tolerance);
    ctx.putImageData(newData, 0, 0);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    const newAppliedChanges = appliedChanges.slice(0, historyIndex);
    setAppliedChanges([...newAppliedChanges, { from: selectedColorToReplace, to: newColorHex }]);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      canvasRef.current?.getContext("2d")?.putImageData(history[newIndex], 0, 0);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      canvasRef.current?.getContext("2d")?.putImageData(history[newIndex], 0, 0);
    }
  };

  const resetImage = () => {
    if (!originalImageDataRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx?.putImageData(originalImageDataRef.current, 0, 0);
    setSelectedColorToReplace(null);
    setAppliedChanges([]);
    setHistory([originalImageDataRef.current]);
    setHistoryIndex(0);
  };

  const activeChanges = appliedChanges.slice(0, Math.max(0, historyIndex));
  let customUrl = "https://camiihalisi.com/renk-demo";
  if (typeof window !== "undefined") {
    const params = new URLSearchParams();
    if (currentMotif.id === "custom") {
      params.set('imageUrl', currentMotif.src);
      params.set('motifName', currentMotif.name);
    } else {
      params.set('motif', currentMotif.id);
    }
    if (activeChanges.length > 0) {
      const changesStr = activeChanges.map(c => `${c.from.replace('#', '')}-${c.to.replace('#', '')}`).join('_');
      params.set('changes', changesStr);
    }
    customUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }

  const shareText = `Asil Halı Simülatörü'nde yeni bir model tasarladım!\nMotif: ${currentMotif.name}\n\n${activeChanges.length > 0 ? `🎨 Uygulanan Renk Değişiklikleri:\n${activeChanges.map(c => `• ${c.from.toUpperCase()} ➔ ${c.to.toUpperCase()}`).join('\n')}` : 'Özel tasarımım'}\n\nKendi halını tasarlamak için tıkla:\n${customUrl}`;

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/jpeg", 0.9);
    const link = document.createElement("a");
    link.download = `asil-hali-${currentMotif.id}-tasarim.jpg`;
    link.href = url;
    link.click();
  };

  const handleWhatsAppShare = () => {
    const encodedText = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, "_blank");
  };

  const handleNativeShare = async () => {
    if (!canvasRef.current) return;
    
    if (navigator.share) {
      try {
        const blob = await new Promise<Blob | null>(resolve => canvasRef.current!.toBlob(resolve, 'image/jpeg', 0.9));
        if (blob) {
          const file = new File([blob], `asil-hali-${currentMotif.id}.jpg`, { type: 'image/jpeg' });
          await navigator.share({
            title: 'Asil Halı Özel Tasarım',
            text: shareText,
            files: [file]
          });
          return;
        }
      } catch (err) {
        console.error("Share failed", err);
      }
    }
    
    alert("Cihazınız doğrudan paylaşımı desteklemiyor. Resim indirilecek ve mesaj panoya kopyalanacak. WhatsApp'tan manuel olarak gönderebilirsiniz.");
    navigator.clipboard.writeText(shareText);
    handleDownload();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#B2EBF2] flex flex-col gap-8">
      
      {/* ── Motif Seçici ── */}
      <div>
        <h3 className="text-lg font-bold text-[#0097A7] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          1. Motif Seçin
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {MOTIFS.map(motif => (
            <button
              key={motif.id}
              onClick={() => setCurrentMotif(motif)}
              className={`flex-shrink-0 flex flex-col items-center gap-1 p-1.5 rounded-xl border transition-all ${
                currentMotif.id === motif.id ? 'border-[#C9972B] bg-[#FFF9E6] shadow-md scale-105' : 'border-[#E0F7FA] hover:border-[#0097A7] hover:bg-[#F0FDFE]'
              }`}
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden relative">
                <img src={motif.src} alt={motif.name} className="object-cover w-full h-full" />
              </div>
              <span className="text-[10px] font-semibold text-[#1A1A1A]">{motif.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sol Taraf: Kanvas / Resim */}
        <div className="lg:col-span-2 flex flex-col">
          <h3 className="text-lg font-bold text-[#0097A7] mb-2 flex items-center justify-between" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            <span>2. Resme Tıklayarak Renk Seçin</span>
            <div className="flex gap-2">
              <button onClick={() => setZoom(z => Math.max(z - 0.5, 1))} className="p-1.5 rounded bg-white text-slate-600 shadow border hover:bg-slate-50 transition-colors" title="Uzaklaştır" disabled={zoom <= 1}>
                <ZoomOut className="w-4 h-4" />
              </button>
              <button onClick={() => setZoom(1)} className="px-2 py-1 rounded bg-white text-slate-600 shadow border hover:bg-slate-50 transition-colors text-xs font-semibold" title="Orijinal Boyut">
                1x
              </button>
              <button onClick={() => setZoom(z => Math.min(z + 0.5, 4))} className="p-1.5 rounded bg-white text-slate-600 shadow border hover:bg-slate-50 transition-colors" title="Yakınlaştır" disabled={zoom >= 4}>
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </h3>
          <div className="bg-[#F0FDFE] rounded-xl overflow-auto border border-[#E0F7FA] flex relative flex-1 min-h-[300px] max-h-[60vh] custom-scrollbar">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                <div className="text-[#0097A7] font-semibold animate-pulse">Yükleniyor...</div>
              </div>
            )}
            <div className="flex w-full h-full items-center justify-center min-w-min min-h-min p-4">
              <canvas 
                ref={canvasRef} 
                onClick={handleCanvasClick}
                className="object-contain drop-shadow-md cursor-crosshair transition-all duration-200"
                style={{ 
                  width: zoom === 1 ? 'auto' : `${zoom * 100}%`,
                  maxWidth: zoom === 1 ? '100%' : 'none',
                  maxHeight: zoom === 1 ? '100%' : 'none',
                  height: zoom === 1 ? 'auto' : 'auto'
                }}
              />
            </div>
          </div>
        </div>

        {/* Sağ Taraf: Kontroller */}
        <div className="flex flex-col gap-4 mt-2 lg:mt-0">
          <div>
            <h3 className="text-base font-bold text-[#1A1A1A] mb-2">Seçili Değiştirilecek Renk:</h3>
            <div className="flex gap-2 flex-wrap">
              {extractedColors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColorToReplace(color)}
                  className={`w-10 h-10 rounded-full border-4 transition-transform ${selectedColorToReplace === color ? 'border-[#C9972B] scale-110 shadow-lg' : 'border-white shadow-sm hover:scale-105'}`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className={`transition-opacity duration-300 ${!selectedColorToReplace ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
            <h3 className="text-lg font-bold text-[#0097A7] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              3. Yeni Rengi Belirle
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <input 
                type="color" 
                value={newColorHex} 
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-12 h-12 rounded cursor-pointer border-0 p-0"
              />
              <div className="text-sm font-mono text-[#1A1A1A] bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                {newColorHex.toUpperCase()}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-[#1A1A1A]">Yayılım Hassasiyeti (Tolerans)</span>
                <span className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{tolerance}</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="150" 
                step="5"
                value={tolerance} 
                onChange={(e) => setTolerance(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0097A7]"
                title="Aynı tonların ne kadar geniş bir aralıkta seçileceğini belirler"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Dar (Sadece tıklandığı gibi)</span>
                <span>Geniş (Benzer tonları katar)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E0F7FA] flex flex-col gap-2">
            <button
              onClick={handleReplaceColor}
              disabled={!selectedColorToReplace}
              className="btn bg-[#0097A7] text-white hover:bg-[#007A88] w-full py-2 min-h-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Rengi Uygula
            </button>
            
            <div className="flex gap-2 w-full">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="flex-1 btn btn-outline py-2 min-h-0 flex items-center justify-center gap-2 disabled:opacity-50 text-xs"
                title="Geri Al"
              >
                <Undo2 className="w-4 h-4" /> Geri Al
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="flex-1 btn btn-outline py-2 min-h-0 flex items-center justify-center gap-2 disabled:opacity-50 text-xs"
                title="İleri Al"
              >
                <Redo2 className="w-4 h-4" /> İleri Al
              </button>
            </div>
            
            <button
              onClick={resetImage}
              disabled={historyIndex <= 0}
              className="btn btn-ghost w-full py-1 min-h-0 text-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 text-xs"
            >
              Tümünü Sıfırla
            </button>
          </div>

          {/* Paylaşım Alanı */}
          <div className="pt-4 border-t border-[#E0F7FA]">
            <h3 className="text-base font-bold text-[#1A1A1A] mb-2">Paylaş & İndir</h3>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={handleDownload}
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-[#E0F7FA] hover:bg-[#F0FDFE] hover:border-[#0097A7] transition-all"
                title="Resmi İndir"
              >
                <Download className="w-4 h-4 text-[#0097A7]" />
                <span className="text-[10px] font-semibold text-[#1A1A1A]">İndir</span>
              </button>
              
              <button 
                onClick={handleWhatsAppShare}
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-green-100 hover:bg-green-50 hover:border-green-500 transition-all"
                title="WhatsApp'ta Paylaş"
              >
                <MessageCircle className="w-4 h-4 text-green-600" />
                <span className="text-[10px] font-semibold text-green-700">WhatsApp</span>
              </button>
              
              <button 
                onClick={handleNativeShare}
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-blue-100 hover:bg-blue-50 hover:border-blue-500 transition-all"
                title="Diğer Seçenekler"
              >
                <Share2 className="w-4 h-4 text-blue-600" />
                <span className="text-[10px] font-semibold text-blue-700">Paylaş</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-[10px] text-[#8B6E23] font-medium bg-[#FFF9E6] py-1.5 px-3 rounded-lg inline-block border border-[#FFE082]">
          <strong>Not:</strong> Ekrandaki renkler simülasyon amaçlıdır, fiziksel iplik renkleriyle %100 birebir uyum göstermeyebilir.
        </p>
      </div>
    </div>
  );
}

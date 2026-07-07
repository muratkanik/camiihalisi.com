"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { YARN_PALETTE, type YarnColor } from "@/data/yarnPalette";
import { X, Lock, Unlock, RotateCcw, Download, Check, Search, Droplet, Palette, RefreshCw } from "lucide-react";
import CarpetDesignActions from "./CarpetDesignActions";
import CarpetQuoteRequestForm from "./CarpetQuoteRequestForm";
import { saveDesignToLocal, loadDesignFromLocal, clearDesignFromLocal } from "@/lib/carpetDesignStorage";
import { downloadCanvasPNG, downloadDesignJSON } from "@/lib/carpetDesignExport";
import { generateWhatsAppMessage, openWhatsAppChat } from "@/lib/carpetDesignShare";
import { CarpetDesignSessionData, QuoteRequestFormData, CarpetDesignMapping } from "@/types/carpetDesign";

// --- COLOR MATH & CLUSTERING ---
function rgbToLab(r: number, g: number, b: number) {
  let R = r / 255, G = g / 255, B = b / 255;
  R = R > 0.04045 ? Math.pow((R + 0.055) / 1.055, 2.4) : R / 12.92;
  G = G > 0.04045 ? Math.pow((G + 0.055) / 1.055, 2.4) : G / 12.92;
  B = B > 0.04045 ? Math.pow((B + 0.055) / 1.055, 2.4) : B / 12.92;

  let X = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047;
  let Y = (R * 0.2126 + G * 0.7152 + B * 0.0722) / 1.00000;
  let Z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;

  X = X > 0.008856 ? Math.pow(X, 1 / 3) : (7.787 * X) + 16 / 116;
  Y = Y > 0.008856 ? Math.pow(Y, 1 / 3) : (7.787 * Y) + 16 / 116;
  Z = Z > 0.008856 ? Math.pow(Z, 1 / 3) : (7.787 * Z) + 16 / 116;

  return { L: (116 * Y) - 16, a: 500 * (X - Y), b: 200 * (Y - Z) };
}

function labToRgb(l: number, a: number, b: number) {
  let y = (l + 16) / 116;
  let x = a / 500 + y;
  let z = y - b / 200;

  let x3 = x * x * x, y3 = y * y * y, z3 = z * z * z;

  x = (x3 > 0.008856 ? x3 : (x - 16 / 116) / 7.787) * 0.95047;
  y = (y3 > 0.008856 ? y3 : (y - 16 / 116) / 7.787) * 1.00000;
  z = (z3 > 0.008856 ? z3 : (z - 16 / 116) / 7.787) * 1.08883;

  let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let b_ = x * 0.0557 + y * -0.2040 + z * 1.0570;

  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  b_ = b_ > 0.0031308 ? 1.055 * Math.pow(b_, 1 / 2.4) - 0.055 : 12.92 * b_;

  return {
    r: Math.max(0, Math.min(255, Math.round(r * 255))),
    g: Math.max(0, Math.min(255, Math.round(g * 255))),
    b: Math.max(0, Math.min(255, Math.round(b_ * 255)))
  };
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function deltaE76(lab1: { L: number; a: number; b: number }, lab2: { L: number; a: number; b: number }) {
  return Math.sqrt(Math.pow(lab1.L - lab2.L, 2) + Math.pow(lab1.a - lab2.a, 2) + Math.pow(lab1.b - lab2.b, 2));
}

interface DetectedColor {
  id: string;
  lab: { L: number; a: number; b: number };
  rgb: { r: number; g: number; b: number };
  hex: string;
  percentage: number;
  isProtected: boolean;
  mappedYarn: YarnColor | null;
}

function extractDominantColors(imgData: ImageData, k: number = 8): DetectedColor[] {
  const pixels: {L: number, a: number, b: number}[] = [];
  const sampleStep = Math.max(1, Math.floor(Math.sqrt((imgData.width * imgData.height) / 40000))) * 4;
  
  for (let i = 0; i < imgData.data.length; i += sampleStep) {
    if (imgData.data[i + 3] < 128) continue;
    pixels.push(rgbToLab(imgData.data[i], imgData.data[i + 1], imgData.data[i + 2]));
  }

  if (pixels.length === 0) return [];

  let centroids: {L: number, a: number, b: number}[] = [];
  for (let i = 0; i < Math.min(k, pixels.length); i++) {
    centroids.push(pixels[Math.floor(Math.random() * pixels.length)]);
  }

  let assignments = new Int32Array(pixels.length);
  for (let iter = 0; iter < 12; iter++) {
    for (let p = 0; p < pixels.length; p++) {
      let minDist = Infinity;
      let bestC = 0;
      for (let c = 0; c < centroids.length; c++) {
        const dist = deltaE76(pixels[p], centroids[c]);
        if (dist < minDist) {
          minDist = dist;
          bestC = c;
        }
      }
      assignments[p] = bestC;
    }

    const newCentroids = Array(centroids.length).fill(0).map(() => ({L: 0, a: 0, b: 0, count: 0}));
    for (let p = 0; p < pixels.length; p++) {
      const c = assignments[p];
      newCentroids[c].L += pixels[p].L;
      newCentroids[c].a += pixels[p].a;
      newCentroids[c].b += pixels[p].b;
      newCentroids[c].count++;
    }

    let changed = false;
    for (let c = 0; c < centroids.length; c++) {
      if (newCentroids[c].count > 0) {
        const nL = newCentroids[c].L / newCentroids[c].count;
        const na = newCentroids[c].a / newCentroids[c].count;
        const nb = newCentroids[c].b / newCentroids[c].count;
        if (deltaE76(centroids[c], {L: nL, a: na, b: nb}) > 1) changed = true;
        centroids[c] = {L: nL, a: na, b: nb};
      }
    }
    if (!changed) break;
  }

  const counts = Array(centroids.length).fill(0);
  for (let i = 0; i < pixels.length; i++) counts[assignments[i]]++;

  let results: DetectedColor[] = [];
  for (let i = 0; i < centroids.length; i++) {
    if (counts[i] === 0) continue;
    const percentage = (counts[i] / pixels.length) * 100;
    if (percentage < 1.0) continue; 

    const rgb = labToRgb(centroids[i].L, centroids[i].a, centroids[i].b);
    results.push({
      id: `c_${i}_${Date.now()}`,
      lab: centroids[i],
      rgb,
      hex: rgbToHex(rgb.r, rgb.g, rgb.b),
      percentage,
      isProtected: centroids[i].L > 85, // auto protect cream/white lines
      mappedYarn: null
    });
  }

  // Merge similar colors
  for (let i = 0; i < results.length; i++) {
    for (let j = i + 1; j < results.length; j++) {
      if (deltaE76(results[i].lab, results[j].lab) < 14) {
        const totalPct = results[i].percentage + results[j].percentage;
        const weightI = results[i].percentage / totalPct;
        const weightJ = results[j].percentage / totalPct;
        
        results[i].lab.L = results[i].lab.L * weightI + results[j].lab.L * weightJ;
        results[i].lab.a = results[i].lab.a * weightI + results[j].lab.a * weightJ;
        results[i].lab.b = results[i].lab.b * weightI + results[j].lab.b * weightJ;
        results[i].percentage = totalPct;
        
        const newRgb = labToRgb(results[i].lab.L, results[i].lab.a, results[i].lab.b);
        results[i].rgb = newRgb;
        results[i].hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
        
        results.splice(j, 1);
        j--; 
      }
    }
  }

  return results.sort((a, b) => b.percentage - a.percentage);
}

function replaceColors(ctx: CanvasRenderingContext2D, originalData: ImageData, detectedColors: DetectedColor[]) {
  const newImgData = ctx.createImageData(originalData);
  const targetMap = new Map<string, { L: number, a: number, b: number }>();
  
  for (const dc of detectedColors) {
    if (dc.mappedYarn) {
      const rgb = hexToRgb(dc.mappedYarn.hex);
      targetMap.set(dc.id, rgbToLab(rgb.r, rgb.g, rgb.b));
    }
  }

  if (targetMap.size === 0) {
    newImgData.data.set(originalData.data);
    return newImgData;
  }

  for (let i = 0; i < originalData.data.length; i += 4) {
    const r = originalData.data[i], g = originalData.data[i + 1], b = originalData.data[i + 2], a = originalData.data[i + 3];
    if (a < 128) {
      newImgData.data[i] = r; newImgData.data[i+1] = g; newImgData.data[i+2] = b; newImgData.data[i+3] = a;
      continue;
    }

    const pixelLab = rgbToLab(r, g, b);
    let bestDist = Infinity;
    let bestCluster: DetectedColor | null = null;
    
    for (const dc of detectedColors) {
      const dist = deltaE76(pixelLab, dc.lab);
      if (dist < bestDist) {
        bestDist = dist;
        bestCluster = dc;
      }
    }

    if (bestCluster && targetMap.has(bestCluster.id) && !bestCluster.isProtected) {
      const targetLab = targetMap.get(bestCluster.id)!;
      const newL = targetLab.L + (pixelLab.L - bestCluster.lab.L) * 0.75;
      const newRgb = labToRgb(newL, targetLab.a, targetLab.b);
      
      newImgData.data[i] = newRgb.r;
      newImgData.data[i+1] = newRgb.g;
      newImgData.data[i+2] = newRgb.b;
      newImgData.data[i+3] = 255;
    } else {
      newImgData.data[i] = r;
      newImgData.data[i+1] = g;
      newImgData.data[i+2] = b;
      newImgData.data[i+3] = a;
    }
  }
  return newImgData;
}

// --- COMPONENT ---
interface CarpetColorCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  patternName: string;
  locale: string;
  productSlug: string;
  initialDesignSession?: CarpetDesignSessionData | null;
}

export default function CarpetColorCustomizer({ isOpen, onClose, imageSrc, patternName, locale, productSlug, initialDesignSession }: CarpetColorCustomizerProps) {
  const [detectedColors, setDetectedColors] = useState<DetectedColor[]>([]);
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Modals/States
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isSavingLink, setIsSavingLink] = useState(false);
  const [shareableUrl, setShareableUrl] = useState("");
  const [effectiveRestoredSession, setEffectiveRestoredSession] = useState<CarpetDesignSessionData | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageDataRef = useRef<ImageData | null>(null);
  
  // Calculate mapping status
  const hasMappings = useMemo(() => detectedColors.some(c => c.mappedYarn !== null), [detectedColors]);

  // Check for local storage on mount
  useEffect(() => {
    if (isOpen && !initialDesignSession && !effectiveRestoredSession && !isAnalyzing && detectedColors.length === 0) {
      const localData = loadDesignFromLocal(productSlug);
      if (localData && localData.mappings && localData.mappings.length > 0) {
        if (window.confirm(locale === "en" ? "Do you want to restore your previous design for this product?" : "Bu ürün için son yarım kalan tasarımınızı geri yüklemek ister misiniz?")) {
           localData.id = "local"; 
           setShareableUrl("");
           setEffectiveRestoredSession(localData);
        } else {
           clearDesignFromLocal(productSlug);
        }
      }
    }
  }, [isOpen, initialDesignSession, effectiveRestoredSession, productSlug, locale]);

  // Load and analyze image
  useEffect(() => {
    if (!isOpen || !imageSrc || canvasRef.current === null) return;
    
    setIsAnalyzing(true);
    setDetectedColors([]);
    setSelectedClusterId(null);
    setHasUnsavedChanges(false);

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      originalImageDataRef.current = imgData;

      setTimeout(() => {
        let colors = extractDominantColors(imgData);
        
        const activeSession = effectiveRestoredSession || initialDesignSession;
        if (activeSession?.mappings) {
          colors = colors.map((c, idx) => {
            const map = activeSession.mappings.find((m: any) => m.sourceColorHex === c.hex);
            if (map) {
              const targetYarn = YARN_PALETTE.find(y => y.code === map.targetYarnCode);
              if (targetYarn) {
                return { ...c, mappedYarn: targetYarn, isProtected: false };
              }
            }
            return c;
          });
        }
        
        setDetectedColors(colors);
        if (colors.length > 0) setSelectedClusterId(colors[0].id);
        setIsAnalyzing(false);
      }, 50);
    };
    img.src = imageSrc;
  }, [isOpen, imageSrc, initialDesignSession]);

  // Apply replacement
  const applyReplacement = useCallback(() => {
    if (!canvasRef.current || !originalImageDataRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const newImgData = replaceColors(ctx, originalImageDataRef.current, detectedColors);
    ctx.putImageData(newImgData, 0, 0);
  }, [detectedColors]);

  useEffect(() => {
    if (!isAnalyzing && detectedColors.length > 0) {
      applyReplacement();
    }
  }, [detectedColors, isAnalyzing, applyReplacement]);

  const handleYarnSelect = (yarn: YarnColor) => {
    if (!selectedClusterId) return;
    setDetectedColors(prev => prev.map(c => 
      c.id === selectedClusterId ? { ...c, mappedYarn: yarn } : c
    ));
    setHasUnsavedChanges(true);
  };

  const toggleProtect = (id: string) => {
    setDetectedColors(prev => prev.map(c => 
      c.id === id ? { ...c, isProtected: !c.isProtected } : c
    ));
  };

  const removeMapping = (id: string) => {
    setDetectedColors(prev => prev.map(c => 
      c.id === id ? { ...c, mappedYarn: null } : c
    ));
    setHasUnsavedChanges(true);
  };

  const resetAll = () => {
    setDetectedColors(prev => prev.map(c => ({ ...c, mappedYarn: null })));
    setHasUnsavedChanges(true);
  };

  const buildSessionData = (): CarpetDesignSessionData => {
    const mappings: CarpetDesignMapping[] = detectedColors.filter(c => c.mappedYarn).map(c => ({
      sourceClusterId: c.id,
      sourceColorHex: c.hex,
      sourceColorPercentage: c.percentage,
      targetYarnId: c.mappedYarn!.id,
      targetYarnCode: c.mappedYarn!.code,
      targetYarnNameTr: c.mappedYarn!.name_tr,
      targetYarnNameEn: c.mappedYarn!.name_en,
      targetYarnHex: c.mappedYarn!.hex,
    }));

    return {
      productSlug,
      productTitle: patternName,
      productUrl: window.location.href.split("?")[0],
      originalImageUrl: imageSrc,
      mappings,
      previewImageDataUrl: canvasRef.current?.toDataURL("image/jpeg", 0.7)
    };
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm("Tasarımınızı kaydetmeden çıkmak üzeresiniz. Devam edilsin mi?")) {
        return;
      }
    }
    onClose();
  };

  const handleSaveLocal = () => {
    saveDesignToLocal(productSlug, buildSessionData());
    setHasUnsavedChanges(false);
    alert("Tasarımınız bu tarayıcıya kaydedildi.");
  };

  const handleDownloadPng = () => {
    if (canvasRef.current) downloadCanvasPNG(canvasRef.current, productSlug);
  };

  const handleDownloadJson = () => {
    downloadDesignJSON(buildSessionData());
  };

  const handleShareWhatsApp = async () => {
    setIsSavingLink(true);
    let shareUrl = shareableUrl;
    
    if (!shareUrl) {
      try {
        const res = await fetch("/api/carpet-designs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildSessionData())
        });
        const data = await res.json();
        if (data.success) {
          shareUrl = `${window.location.href.split("?")[0]}?design=${data.designId}`;
          setShareableUrl(shareUrl);
        }
      } catch (e) {
        console.error(e);
      }
    }
    
    setIsSavingLink(false);
    const message = generateWhatsAppMessage(buildSessionData(), shareUrl || window.location.href, locale);
    openWhatsAppChat("905323467939", message); // Demo number updated to real format or config
  };

  const handleShareLink = async () => {
    if (shareableUrl) {
      navigator.clipboard.writeText(shareableUrl);
      alert("Link kopyalandı!");
      return;
    }
    setIsSavingLink(true);
    try {
      const res = await fetch("/api/carpet-designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildSessionData())
      });
      const data = await res.json();
      if (data.success) {
        const url = `${window.location.href.split("?")[0]}?design=${data.designId}`;
        setShareableUrl(url);
        navigator.clipboard.writeText(url);
        alert("Paylaşım linki oluşturuldu ve panoya kopyalandı!");
      }
    } catch (e) {
      alert("Hata oluştu.");
    } finally {
      setIsSavingLink(false);
    }
  };

  const handleSubmitQuote = async (formData: QuoteRequestFormData) => {
    // Save design first to get ID
    const sessionRes = await fetch("/api/carpet-designs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildSessionData())
    });
    const sessionData = await sessionRes.json();
    
    if (sessionData.success) {
      const quoteRes = await fetch("/api/carpet-quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          designSessionId: sessionData.designId,
          productSlug
        })
      });
      if (!quoteRes.ok) throw new Error("Quote failed");
    } else {
      throw new Error("Session failed");
    }
  };

  const availableYarns = useMemo(() => {
    return YARN_PALETTE.filter(y => y.available && 
      (y.name_tr.toLowerCase().includes(searchTerm.toLowerCase()) || 
       y.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
       y.code.includes(searchTerm))
    );
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex flex-col bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
        {/* HEADER BAR */}
        <div className="flex-none h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <button onClick={handleClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
              <X className="w-6 h-6" />
            </button>
            <div>
              <h2 className="font-bold text-slate-800 dark:text-white">Renk Değiştir — {patternName}</h2>
              <p className="text-xs text-slate-500">Doku korumalı canlı önizleme (Lab K-Means)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={resetAll} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <RotateCcw className="w-4 h-4" /> Sıfırla
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex flex-1 w-full overflow-hidden">
          {/* LEFT PANEL: Canvas & Detected Colors */}
          <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950/50 relative overflow-hidden">
            <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden">
              {isAnalyzing && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                  <RefreshCw className="w-10 h-10 text-[#C9972B] animate-spin mb-4" />
                  <p className="font-medium text-slate-700 dark:text-slate-300">Desen Yapay Zeka ile Analiz Ediliyor...</p>
                  <p className="text-sm text-slate-500 mt-1">Renk grupları tespit ediliyor</p>
                </div>
              )}
              <canvas 
                ref={canvasRef} 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800"
              />
            </div>

            {/* Detected Colors Strip */}
            <div className="flex-none h-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <Droplet className="w-4 h-4" /> Desende Tespit Edilen Ana Renkler
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {detectedColors.map(color => (
                  <div 
                    key={color.id}
                    onClick={() => setSelectedClusterId(color.id)}
                    className={`flex-shrink-0 w-32 rounded-xl border-2 transition-all cursor-pointer overflow-hidden ${
                      selectedClusterId === color.id ? 'border-[#003B40] shadow-md scale-105' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="h-12 w-full relative" style={{ backgroundColor: color.hex }}>
                      {color.isProtected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Lock className="w-5 h-5 text-white drop-shadow-md" />
                        </div>
                      )}
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 text-xs text-center relative group">
                      <p className="font-semibold text-slate-800 dark:text-white truncate">
                        {color.mappedYarn ? color.mappedYarn.name_tr : `Renk %${Math.round(color.percentage)}`}
                      </p>
                      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-800 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); toggleProtect(color.id); }} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {color.isProtected ? <Unlock className="w-4 h-4"/> : <Lock className="w-4 h-4"/>}
                        </button>
                        {color.mappedYarn && (
                          <button onClick={(e) => { e.stopPropagation(); removeMapping(color.id); }} className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400">
                            <RotateCcw className="w-4 h-4"/>
                          </button>
                        )}
                      </div>
                    </div>
                    {color.mappedYarn && <div className="h-1.5 w-full bg-[#C9972B]" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Yarn Palette */}
          <div className="w-96 flex-none bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-[#C9972B]" /> İplik Paleti
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Renk veya Kod ara..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#003B40] text-slate-800 dark:text-slate-200 outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {!selectedClusterId ? (
                <div className="text-center text-slate-500 mt-10">
                  <Palette className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Lütfen önce değiştirmek istediğiniz ana rengi soldan seçin.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {availableYarns.map(yarn => {
                    const selectedCluster = detectedColors.find(c => c.id === selectedClusterId);
                    const isSelected = selectedCluster?.mappedYarn?.code === yarn.code;
                    
                    return (
                      <button
                        key={yarn.code}
                        onClick={() => handleYarnSelect(yarn)}
                        disabled={selectedCluster?.isProtected}
                        className={`group relative flex flex-col items-center gap-1.5 rounded-xl p-2 transition-all ${
                          isSelected ? 'bg-slate-100 dark:bg-slate-800 ring-2 ring-[#003B40] dark:ring-[#C9972B]' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        } ${selectedCluster?.isProtected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="w-full aspect-square rounded-lg shadow-inner ring-1 ring-black/5" style={{ backgroundColor: yarn.hex }}>
                          {isSelected && <div className="absolute inset-0 flex items-center justify-center"><Check className="w-6 h-6 text-white drop-shadow-md" /></div>}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{yarn.code}</span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-center leading-tight">{yarn.name_tr}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <CarpetDesignActions
          hasMappings={hasMappings}
          locale={locale}
          onSaveLocal={handleSaveLocal}
          onDownloadPng={handleDownloadPng}
          onDownloadJson={handleDownloadJson}
          onShareLink={handleShareLink}
          onShareWhatsApp={handleShareWhatsApp}
          onRequestQuote={() => setIsQuoteModalOpen(true)}
          isSavingLink={isSavingLink}
        />
      </div>

      <CarpetQuoteRequestForm 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
        productTitle={patternName} 
        onSubmit={handleSubmitQuote} 
      />
    </>
  );
}

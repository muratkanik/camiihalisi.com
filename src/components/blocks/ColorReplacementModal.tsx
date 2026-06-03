"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, Download, Share2, Undo2, Redo2, RotateCcw, Palette } from "lucide-react";

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

function replaceColorInImageData(
  ctx: CanvasRenderingContext2D,
  currentData: ImageData,
  sourceHex: string,
  targetHex: string,
  tolerance: number = 5
): ImageData {
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
    const pxlHsl = rgbToHsl(r, g, b);
    let hueDiff = Math.abs(pxlHsl.h - sourceHsl.h);
    if (hueDiff > 180) hueDiff = 360 - hueDiff;

    if (hueDiff < tolerance && pxlHsl.s > 0.05 && pxlHsl.l > 0.05 && pxlHsl.l < 0.95) {
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
    newData.data[i + 3] = a;
  }
  return newData;
}

/* ── Hazır Renk Paleti ── */
const PRESET_COLORS = [
  "#8B1A1A", "#6b1c23", "#B22222", "#CD853F", "#DAA520",
  "#006B7B", "#0097A7", "#1A4E8B", "#003B40", "#2E8B57",
  "#4B0082", "#800080", "#C71585", "#FF6347", "#FF8C00",
  "#556B2F", "#8FBC8F", "#708090", "#2F4F4F", "#191970",
];

interface ColorReplacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  patternName: string;
}

export default function ColorReplacementModal({
  isOpen,
  onClose,
  imageSrc,
  patternName,
}: ColorReplacementModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [newColor, setNewColor] = useState("#8B1A1A");
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const originalDataRef = useRef<ImageData | null>(null);

  // Resim yükle
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setImageLoaded(false);
    setSelectedColor(null);
    setExtractedColors([]);
    setHistory([]);
    setHistoryIndex(-1);

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
      setImageLoaded(true);
    };
  }, [isOpen, imageSrc]);

  // Canvas tıklama — renk seçme
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imageLoaded || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = "#" + [pixel[0], pixel[1], pixel[2]].map(v => v.toString(16).padStart(2, "0")).join("");
    setSelectedColor(hex);
    if (!extractedColors.includes(hex)) {
      setExtractedColors(prev => [hex, ...prev].slice(0, 6));
    }
  }, [imageLoaded, extractedColors]);

  // Renk değiştir
  const applyColor = useCallback(() => {
    if (!selectedColor || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const currentData = history[historyIndex];
    if (!currentData) return;

    const newData = replaceColorInImageData(ctx, currentData, selectedColor, newColor, 5);
    ctx.putImageData(newData, 0, 0);
    const newHistory = [...history.slice(0, historyIndex + 1), newData];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSelectedColor(null);
  }, [selectedColor, newColor, history, historyIndex]);

  // Geri al
  const undo = useCallback(() => {
    if (historyIndex <= 0 || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const newIdx = historyIndex - 1;
    ctx.putImageData(history[newIdx], 0, 0);
    setHistoryIndex(newIdx);
  }, [historyIndex, history]);

  // İleri al
  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1 || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const newIdx = historyIndex + 1;
    ctx.putImageData(history[newIdx], 0, 0);
    setHistoryIndex(newIdx);
  }, [historyIndex, history]);

  // Sıfırla
  const reset = useCallback(() => {
    if (!originalDataRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.putImageData(originalDataRef.current, 0, 0);
    setHistory([originalDataRef.current]);
    setHistoryIndex(0);
    setSelectedColor(null);
  }, []);

  // İndir
  const download = useCallback(() => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `${patternName.replace(/\s+/g, "-")}-ozel-renk.jpg`;
    link.href = canvasRef.current.toDataURL("image/jpeg", 0.92);
    link.click();
  }, [patternName]);

  // Escape ile kapat
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-[720px] w-full max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Başlık */}
        <div className="sticky top-0 z-10 bg-white border-b border-[#E0F7FA] px-5 py-3 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#0097A7]" />
            <h3 className="font-bold text-[#003B40] text-base">
              Renk Değiştirme — {patternName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F0FDFE] hover:bg-red-50 flex items-center justify-center text-[#6B6355] hover:text-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Canvas */}
          <div className="relative bg-[#F8F6F3] rounded-xl p-3 flex justify-center">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="max-w-full cursor-crosshair rounded-lg shadow-inner"
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-3 border-[#0097A7] border-t-transparent rounded-full" />
              </div>
            )}
          </div>

          {/* Talimatlar */}
          <div className="bg-[#F0FDFE] rounded-xl p-3 text-xs text-[#003B40] space-y-1">
            <p className="font-semibold text-[#0097A7]">Nasıl kullanılır?</p>
            <p>1. Desen üzerinde değiştirmek istediğiniz <strong>renge tıklayın</strong></p>
            <p>2. Aşağıdan <strong>yeni rengi</strong> seçin</p>
            <p>3. <strong>&quot;Uygula&quot;</strong> butonuna basın</p>
          </div>

          {/* Seçili Renk + Yeni Renk */}
          <div className="grid grid-cols-2 gap-4">
            {/* Seçili Renk */}
            <div>
              <label className="text-xs font-semibold text-[#6B6355] mb-2 block">Seçili Renk</label>
              {selectedColor ? (
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-lg border-2 border-[#E0F7FA] shadow-inner"
                    style={{ backgroundColor: selectedColor }}
                  />
                  <span className="font-mono text-sm text-[#003B40]">{selectedColor}</span>
                </div>
              ) : (
                <p className="text-xs text-[#999] italic">Desen üzerinde bir renge tıklayın</p>
              )}

              {/* Seçilen Renkler */}
              {extractedColors.length > 0 && (
                <div className="flex gap-1.5 mt-2">
                  {extractedColors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(c)}
                      className={`w-7 h-7 rounded-md border-2 transition-all ${
                        selectedColor === c ? "border-[#C9972B] scale-110 shadow-md" : "border-[#E0F7FA] hover:border-[#0097A7]"
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Yeni Renk */}
            <div>
              <label className="text-xs font-semibold text-[#6B6355] mb-2 block">Yeni Renk</label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0"
                />
                <span className="font-mono text-sm text-[#003B40]">{newColor}</span>
              </div>

              {/* Hazır Renkler */}
              <div className="grid grid-cols-10 gap-1">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setNewColor(c)}
                    className={`w-5 h-5 rounded border transition-all ${
                      newColor === c ? "border-[#C9972B] ring-1 ring-[#C9972B]" : "border-transparent hover:border-[#0097A7]"
                    }`}
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Uygula Butonu */}
          <button
            onClick={applyColor}
            disabled={!selectedColor}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
              selectedColor
                ? "bg-[#C9972B] hover:bg-[#B8860B] text-white shadow-md"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Rengi Uygula
          </button>

          {/* Araç Çubuğu */}
          <div className="flex items-center justify-between border-t border-[#E0F7FA] pt-4">
            <div className="flex gap-2">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg bg-[#F0FDFE] text-[#0097A7] hover:bg-[#E0F7FA] disabled:opacity-30 transition-all"
              >
                <Undo2 className="w-3.5 h-3.5" /> Geri
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg bg-[#F0FDFE] text-[#0097A7] hover:bg-[#E0F7FA] disabled:opacity-30 transition-all"
              >
                <Redo2 className="w-3.5 h-3.5" /> İleri
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg bg-[#F0FDFE] text-[#0097A7] hover:bg-[#E0F7FA] transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Sıfırla
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={download}
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg bg-[#003B40] text-white hover:bg-[#005566] transition-all"
              >
                <Download className="w-3.5 h-3.5" /> İndir
              </button>
              <button
                onClick={() => {
                  if (!canvasRef.current) return;
                  canvasRef.current.toBlob((blob) => {
                    if (!blob) return;
                    const file = new File([blob], `${patternName}.jpg`, { type: "image/jpeg" });
                    if (navigator.share) {
                      navigator.share({ title: patternName, files: [file] }).catch(() => {});
                    }
                  }, "image/jpeg", 0.92);
                }}
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg bg-[#25D366] text-white hover:bg-[#20BD5C] transition-all"
              >
                <Share2 className="w-3.5 h-3.5" /> Paylaş
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

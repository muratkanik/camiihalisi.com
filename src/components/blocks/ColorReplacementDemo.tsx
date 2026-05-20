"use client";

import { useEffect, useRef, useState } from "react";

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

export default function ColorReplacementDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Örnek başlangıç renkleri (Sistem otomatik de bulabilir ama demo amaçlı manuel sabitliyoruz)
  const [extractedColors, setExtractedColors] = useState<string[]>([
    "#005577", // Turkuaz/Mavi ton
    "#a52a2a", // Bordo ton
    "#e8dcc5", // Krem/Bej ton
  ]);

  const [selectedColorToReplace, setSelectedColorToReplace] = useState<string | null>(null);
  const [newColorHex, setNewColorHex] = useState<string>("#0097A7");

  // Asıl resim verisini saklamak için
  const originalImageDataRef = useRef<ImageData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new window.Image();
    // Test amaçlı bir halı resmi
    img.src = "/images/cami-1.png"; 
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      originalImageDataRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setImageLoaded(true);
    };
  }, []);

  const handleReplaceColor = () => {
    if (!selectedColorToReplace || !originalImageDataRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const originalData = originalImageDataRef.current;
    const newData = ctx.createImageData(originalData);

    const sourceRgb = hexToRgb(selectedColorToReplace);
    const sourceHsl = rgbToHsl(sourceRgb.r, sourceRgb.g, sourceRgb.b);
    
    const targetRgb = hexToRgb(newColorHex);
    const targetHsl = rgbToHsl(targetRgb.r, targetRgb.g, targetRgb.b);

    const tolerance = 25; // Hue tolerance in degrees

    for (let i = 0; i < originalData.data.length; i += 4) {
      const r = originalData.data[i];
      const g = originalData.data[i + 1];
      const b = originalData.data[i + 2];
      const a = originalData.data[i + 3];

      const pxlHsl = rgbToHsl(r, g, b);

      // Renk mesafesini ölç
      let hueDiff = Math.abs(pxlHsl.h - sourceHsl.h);
      if (hueDiff > 180) hueDiff = 360 - hueDiff;

      // Sadece doygunluğu yeterli olan ve Hue değeri benzeyen pikselleri değiştir
      // Gölgeleri ve beyaz/siyah alanları koru
      if (hueDiff < tolerance && pxlHsl.s > 0.15 && pxlHsl.l > 0.1 && pxlHsl.l < 0.9) {
        // Hedef rengin Hue değerine çevir, ama orijinal aydınlığı koru
        const newRgb = hslToRgb(targetHsl.h, targetHsl.s, pxlHsl.l);
        newData.data[i] = newRgb.r;
        newData.data[i + 1] = newRgb.g;
        newData.data[i + 2] = newRgb.b;
      } else {
        // Değiştirme
        newData.data[i] = r;
        newData.data[i + 1] = g;
        newData.data[i + 2] = b;
      }
      newData.data[i + 3] = a;
    }

    ctx.putImageData(newData, 0, 0);
  };

  const resetImage = () => {
    if (!originalImageDataRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx?.putImageData(originalImageDataRef.current, 0, 0);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#B2EBF2]">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Sol Taraf: Kanvas / Resim */}
        <div className="lg:col-span-2">
          <div className="bg-[#F0FDFE] rounded-xl overflow-hidden border border-[#E0F7FA] flex items-center justify-center min-h-[400px]">
            {!imageLoaded && <div className="text-[#0097A7] font-semibold animate-pulse">Resim Yükleniyor...</div>}
            <canvas ref={canvasRef} className="max-w-full h-auto drop-shadow-md" />
          </div>
        </div>

        {/* Sağ Taraf: Kontroller */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold text-[#0097A7] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              1. Değiştirilecek Rengi Seç
            </h3>
            <p className="text-sm text-[#6B6355] mb-4">Resmin içinden algılanan baskın renkler:</p>
            <div className="flex gap-3">
              {extractedColors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColorToReplace(color)}
                  className={`w-12 h-12 rounded-full border-4 transition-transform ${selectedColorToReplace === color ? 'border-[#C9972B] scale-110 shadow-lg' : 'border-white shadow-sm hover:scale-105'}`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className={`transition-opacity duration-300 ${!selectedColorToReplace ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
            <h3 className="text-xl font-bold text-[#0097A7] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              2. Yeni Rengi Belirle
            </h3>
            <p className="text-sm text-[#6B6355] mb-4">Uygulamak istediğiniz yeni tonu seçin:</p>
            <div className="flex items-center gap-4">
              <input 
                type="color" 
                value={newColorHex} 
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-14 h-14 rounded cursor-pointer border-0 p-0"
              />
              <div className="text-sm font-mono text-[#1A1A1A] bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                {newColorHex.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E0F7FA] flex flex-col gap-3">
            <button
              onClick={handleReplaceColor}
              disabled={!selectedColorToReplace}
              className="btn bg-[#0097A7] text-white hover:bg-[#007A88] w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Rengi Uygula
            </button>
            <button
              onClick={resetImage}
              className="btn btn-outline w-full py-3"
            >
              Orijinale Dön
            </button>
          </div>

          <div className="bg-[#FFF9E6] p-4 rounded-xl border border-[#FFE082]">
            <p className="text-xs text-[#8B6E23] leading-relaxed font-medium">
              💡 <strong>İpucu:</strong> Bu algoritma HSL (Hue-Saturation-Lightness) dönüşümü kullanır. 
              Gölgeler ve parlama efektleri (aydınlık/karanlık değerleri) korunarak sadece "renk tonu" (Hue) değiştirilir.
              Böylece gerçekçi bir halı dokusu korunur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

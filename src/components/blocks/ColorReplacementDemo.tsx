"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Share2, MessageCircle } from "lucide-react";

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

const MOTIFS = [
  { id: "sample-motif", src: "/images/sample.bmp", name: "Özel Desen", colors: ["#005577", "#a52a2a", "#e8dcc5"] },
  { id: "s101-turkuaz", src: "/images/s101-turkuaz.webp", name: "S101 Turkuaz", colors: ["#008c99", "#e2d5bc", "#b8860b"] },
  { id: "s101-bordo", src: "/images/s101-bordo.webp", name: "S101 Bordo", colors: ["#6b1c23", "#e2d5bc", "#b8860b"] },
  { id: "s101-bej", src: "/images/s101-bej.webp", name: "S101 Bej", colors: ["#dcd3b6", "#a0522d", "#4b5320"] },
  { id: "cami-1", src: "/images/cami-1.png", name: "Akrilik Saflı", colors: ["#005577", "#a52a2a", "#e8dcc5"] },
  { id: "cami-2", src: "/images/cami-2.png", name: "Yün Göbekli", colors: ["#6B4226", "#e8dcc5", "#005577"] },
  { id: "cami-3", src: "/images/cami-3.png", name: "P.P. Seccadeli", colors: ["#1A4E8B", "#e8dcc5", "#b8860b"] },
];

export default function ColorReplacementDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentMotif, setCurrentMotif] = useState(MOTIFS[0]);
  
  const [extractedColors, setExtractedColors] = useState<string[]>(MOTIFS[0].colors);
  const [selectedColorToReplace, setSelectedColorToReplace] = useState<string | null>(null);
  const [newColorHex, setNewColorHex] = useState<string>("#8B1A1A"); 
  const [tolerance, setTolerance] = useState<number>(35);
  const [appliedChanges, setAppliedChanges] = useState<{from: string, to: string}[]>([]);

  const originalImageDataRef = useRef<ImageData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setImageLoaded(false);
    setSelectedColorToReplace(null);
    setExtractedColors(currentMotif.colors);
    setAppliedChanges([]);

    const img = new window.Image();
    img.src = currentMotif.src; 
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
      originalImageDataRef.current = ctx.getImageData(0, 0, w, h);
      setImageLoaded(true);
    };
  }, [currentMotif]);

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

    for (let i = 0; i < originalData.data.length; i += 4) {
      const r = originalData.data[i];
      const g = originalData.data[i + 1];
      const b = originalData.data[i + 2];
      const a = originalData.data[i + 3];

      const pxlHsl = rgbToHsl(r, g, b);

      let hueDiff = Math.abs(pxlHsl.h - sourceHsl.h);
      if (hueDiff > 180) hueDiff = 360 - hueDiff;

      // Hem hue farkına hem de parlaklık yakınlığına bakalım ki yanlış yerler boyanmasın
      if (hueDiff < tolerance && pxlHsl.s > 0.05 && pxlHsl.l > 0.05 && pxlHsl.l < 0.95) {
        // Tıklanan orijinal rengin parlaklığı (sourceHsl.l) referans alınır
        // Bu pikselin parlaklığı ile tıklanan yer arasındaki fark (lDiff)
        const lDiff = pxlHsl.l - sourceHsl.l;
        
        // Hedef rengin parlaklığına bu farkı ekle (Böylece seçilen renk baz alınır, gölgeler ona göre ayarlanır)
        let newL = targetHsl.l + lDiff;
        
        // 0-1 aralığında sınırla
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

    ctx.putImageData(newData, 0, 0);

    // Save change history
    setAppliedChanges(prev => [...prev, { from: selectedColorToReplace, to: newColorHex }]);
  };

  const resetImage = () => {
    if (!originalImageDataRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx?.putImageData(originalImageDataRef.current, 0, 0);
    setSelectedColorToReplace(null);
    setAppliedChanges([]);
  };

  const shareText = `Asil Halı Simülatörü'nde yeni bir model tasarladım!\nMotif: ${currentMotif.name}\n\n${appliedChanges.length > 0 ? `🎨 Uygulanan Renk Değişiklikleri:\n${appliedChanges.map(c => `• ${c.from.toUpperCase()} rengi ➔ ${c.to.toUpperCase()} oldu`).join('\n')}` : 'Özel tasarımım'}\n\nKendi halını tasarlamak için tıkla:\nhttps://camiihalisi.com/renk-demo`;

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
        <h3 className="text-xl font-bold text-[#0097A7] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          1. Motif Seçin
        </h3>
        <div className="flex flex-wrap gap-4">
          {MOTIFS.map(motif => (
            <button
              key={motif.id}
              onClick={() => setCurrentMotif(motif)}
              className={`flex flex-col items-center gap-2 p-2 rounded-xl border transition-all ${
                currentMotif.id === motif.id ? 'border-[#C9972B] bg-[#FFF9E6] shadow-md scale-105' : 'border-[#E0F7FA] hover:border-[#0097A7] hover:bg-[#F0FDFE]'
              }`}
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden relative">
                <img src={motif.src} alt={motif.name} className="object-cover w-full h-full" />
              </div>
              <span className="text-xs font-semibold text-[#1A1A1A]">{motif.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sol Taraf: Kanvas / Resim */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold text-[#0097A7] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            2. Resim Üzerinden veya Listeden Renk Seçin
          </h3>
          <p className="text-sm text-[#6B6355] mb-4">
            Resmin üzerindeki bir noktaya <strong>tıklayarak</strong> değiştirmek istediğiniz rengi anında seçebilirsiniz.
          </p>
          <div className="bg-[#F0FDFE] rounded-xl overflow-hidden border border-[#E0F7FA] flex items-center justify-center min-h-[400px] relative cursor-crosshair">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                <div className="text-[#0097A7] font-semibold animate-pulse">Motif Yükleniyor...</div>
              </div>
            )}
            <canvas 
              ref={canvasRef} 
              onClick={handleCanvasClick}
              className="max-w-full h-auto drop-shadow-md" 
            />
          </div>
        </div>

        {/* Sağ Taraf: Kontroller */}
        <div className="space-y-8 mt-2 lg:mt-0">
          <div>
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Seçili Değiştirilecek Renk:</h3>
            <div className="flex gap-3 flex-wrap">
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
              3. Yeni Rengi Belirle
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

            <div className="mt-6">
              <label className="text-sm font-bold text-[#1A1A1A] flex justify-between">
                <span>Renk Hassasiyeti (Tolerans)</span>
                <span>{tolerance}</span>
              </label>
              <input
                type="range"
                min="5"
                max="90"
                value={tolerance}
                onChange={(e) => setTolerance(Number(e.target.value))}
                className="w-full mt-2 accent-[#0097A7]"
              />
              <p className="text-xs text-[#6B6355] mt-1">Değeri artırdıkça seçtiğiniz renge yakın olan diğer tonlar da değişime dahil olur.</p>
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

          {/* Paylaşım Alanı */}
          <div className="pt-6 border-t border-[#E0F7FA]">
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-3">Tasarımını Paylaş</h3>
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={handleDownload}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-[#E0F7FA] hover:bg-[#F0FDFE] hover:border-[#0097A7] transition-all"
                title="Resmi İndir"
              >
                <Download className="w-5 h-5 text-[#0097A7]" />
                <span className="text-xs font-semibold text-[#1A1A1A]">İndir</span>
              </button>
              
              <button 
                onClick={handleWhatsAppShare}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-green-100 hover:bg-green-50 hover:border-green-500 transition-all"
                title="WhatsApp'ta Paylaş"
              >
                <MessageCircle className="w-5 h-5 text-green-600" />
                <span className="text-xs font-semibold text-green-700">WhatsApp</span>
              </button>
              
              <button 
                onClick={handleNativeShare}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-blue-100 hover:bg-blue-50 hover:border-blue-500 transition-all"
                title="Diğer Seçenekler"
              >
                <Share2 className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-semibold text-blue-700">Paylaş</span>
              </button>
            </div>
          </div>

          <div className="bg-[#FFF9E6] p-4 rounded-xl border border-[#FFE082]">
            <p className="text-xs text-[#8B6E23] leading-relaxed font-medium">
              💡 <strong>İpucu:</strong> Farenizle (veya dokunarak) <strong>resmin üzerindeki herhangi bir alana tıklayıp</strong> oradaki rengi yakalayabilirsiniz. Algoritma tıkladığınız renge benzeyen (ton olarak) diğer alanları da bulup yeni rengi uygular.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

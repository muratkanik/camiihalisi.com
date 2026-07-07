"use client";

import { useState } from "react";
import { X, CheckCircle } from "lucide-react";
import { QuoteRequestFormData } from "@/types/carpetDesign";

interface CarpetQuoteRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: QuoteRequestFormData) => Promise<void>;
  productTitle: string;
}

export default function CarpetQuoteRequestForm({ isOpen, onClose, onSubmit, productTitle }: CarpetQuoteRequestFormProps) {
  const [formData, setFormData] = useState<QuoteRequestFormData>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    city: "",
    district: "",
    requestedSize: "",
    requestedQuantity: "",
    customerNote: "",
    contactPreference: "whatsapp"
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setIsSuccess(true);
    } catch (error) {
      alert("Gönderim sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        {isSuccess ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Talebiniz Alındı!</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Özel renk tasarımınız ve talebiniz ekibimize ulaştı. 
              En kısa sürede belirlediğiniz iletişim kanalı üzerinden sizinle irtibata geçeceğiz.
            </p>
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-[#003B40] text-white rounded-lg hover:bg-[#002a2e]"
            >
              Kapat
            </button>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">Teklif Talebi Oluştur</h3>
                <p className="text-xs text-slate-500">Ürün: {productTitle}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Ad Soyad / Kurum *</label>
                    <input required type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Telefon *</label>
                    <input required type="tel" value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">E-posta</label>
                  <input type="email" value={formData.customerEmail} onChange={e => setFormData({...formData, customerEmail: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Şehir</label>
                    <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">İlçe</label>
                    <input type="text" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Ölçü / Metrekare</label>
                  <input type="text" placeholder="Örn: 500 m2 veya 10x50m" value={formData.requestedSize} onChange={e => setFormData({...formData, requestedSize: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Ek Notlar</label>
                  <textarea rows={3} value={formData.customerNote} onChange={e => setFormData({...formData, customerNote: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm"></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Size Nasıl Ulaşalım?</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" checked={formData.contactPreference === 'whatsapp'} onChange={() => setFormData({...formData, contactPreference: 'whatsapp'})} /> WhatsApp
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" checked={formData.contactPreference === 'phone'} onChange={() => setFormData({...formData, contactPreference: 'phone'})} /> Telefon
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" checked={formData.contactPreference === 'email'} onChange={() => setFormData({...formData, contactPreference: 'email'})} /> E-posta
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#C9972B] hover:bg-[#b08426] text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Gönderiliyor..." : "Tasarımı ve Talebi Gönder"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

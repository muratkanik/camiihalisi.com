"use client";

import { useState } from "react";
import { updateQuoteStatus } from "./actions";

export default function StatusUpdater({ quoteId, currentStatus }: { quoteId: string, currentStatus: string }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsUpdating(true);
    const res = await updateQuoteStatus(quoteId, e.target.value);
    setIsUpdating(false);
    if (res.error) {
      alert(res.error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-500">Durum:</span>
      <select 
        value={currentStatus} 
        onChange={handleStatusChange}
        disabled={isUpdating}
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-[#003B40]"
      >
        <option value="new">Yeni (New)</option>
        <option value="contacted">İletişime Geçildi (Contacted)</option>
        <option value="quoted">Teklif Verildi (Quoted)</option>
        <option value="won">Kazanıldı / Sipariş (Won)</option>
        <option value="lost">İptal / Kaybedildi (Lost)</option>
        <option value="spam">Spam</option>
      </select>
      {isUpdating && <span className="text-xs text-slate-400">Kaydediliyor...</span>}
    </div>
  );
}

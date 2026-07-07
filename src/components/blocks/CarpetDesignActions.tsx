"use client";

import { Download, Share2, MessageCircle, FileJson, Mail, Save } from "lucide-react";

interface CarpetDesignActionsProps {
  hasMappings: boolean;
  locale?: string;
  onSaveLocal: () => void;
  onDownloadPng: () => void;
  onDownloadJson: () => void;
  onShareLink: () => void;
  onShareWhatsApp: () => void;
  onRequestQuote: () => void;
  isSavingLink: boolean;
}

export default function CarpetDesignActions({
  hasMappings,
  locale = "tr",
  onSaveLocal,
  onDownloadPng,
  onDownloadJson,
  onShareLink,
  onShareWhatsApp,
  onRequestQuote,
  isSavingLink
}: CarpetDesignActionsProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 sticky bottom-0 z-20 flex flex-wrap gap-3 items-center justify-between">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onSaveLocal}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 text-sm font-medium transition-colors"
        >
          <Save className="w-4 h-4" /> {locale === "en" ? "Save Design" : "Kaydet"}
        </button>
        <button
          onClick={onDownloadPng}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 text-sm font-medium transition-colors"
        >
          <Download className="w-4 h-4" /> {locale === "en" ? "Download PNG" : "PNG İndir"}
        </button>
        <button
          onClick={onDownloadJson}
          disabled={!hasMappings}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            hasMappings 
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700' 
              : 'bg-slate-50 text-slate-400 cursor-not-allowed dark:bg-slate-900/50 dark:text-slate-600'
          }`}
        >
          <FileJson className="w-4 h-4" /> Data
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={onShareLink}
          disabled={!hasMappings || isSavingLink}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            hasMappings && !isSavingLink
              ? 'bg-[#003B40]/10 text-[#003B40] hover:bg-[#003B40]/20 dark:bg-[#C9972B]/10 dark:text-[#C9972B] dark:hover:bg-[#C9972B]/20'
              : 'bg-slate-50 text-slate-400 cursor-not-allowed dark:bg-slate-900/50 dark:text-slate-600'
          }`}
        >
          <Share2 className={`w-4 h-4 ${isSavingLink ? 'animate-pulse' : ''}`} /> {locale === "en" ? "Create Link" : "Link"}
        </button>
        <button
          onClick={onShareWhatsApp}
          disabled={!hasMappings}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            hasMappings 
              ? 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40' 
              : 'bg-slate-50 text-slate-400 cursor-not-allowed dark:bg-slate-900/50 dark:text-slate-600'
          }`}
        >
          <MessageCircle className="w-4 h-4" /> {locale === "en" ? "WhatsApp" : "WhatsApp"}
        </button>
        <button
          onClick={onRequestQuote}
          disabled={!hasMappings}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ${
            hasMappings 
              ? 'bg-[#C9972B] text-white hover:bg-[#b08426] dark:bg-[#C9972B] dark:hover:bg-[#b08426]' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
          }`}
        >
          <Mail className="w-4 h-4" /> {locale === "en" ? "Request Quote" : "Sipariş / Teklif Al"}
        </button>
      </div>
    </div>
  );
}

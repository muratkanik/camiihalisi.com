"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import dynamic from "next/dynamic";

const ImagePickerModal = dynamic(() => import("./ImagePickerModal"), { ssr: false });

interface Props {
  name: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
}

export default function ImagePickerField({ name, label = "Görsel", defaultValue = "", placeholder = "/images/..." }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);

  const cls = "w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40 focus:border-[#C9972B]";

  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="flex gap-2 items-start">
        {/* Thumbnail */}
        <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-slate-400" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          {/* URL input (manual entry still possible) */}
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className={cls}
          />
          {/* Hidden form field */}
          <input type="hidden" name={name} value={value} />

          {/* Open picker button */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Galeriden Seç
          </button>
        </div>
      </div>

      <ImagePickerModal
        open={open}
        current={value}
        onSelect={setValue}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}

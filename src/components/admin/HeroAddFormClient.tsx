"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { addHeroSlideAction } from "@/app/[locale]/admin/hero/actions";
import ImagePickerField from "./ImagePickerField";

export default function HeroAddFormClient() {
  const [, setKey] = useState(0); // force reset after submit

  return (
    <form
      action={async (fd) => {
        await addHeroSlideAction(fd);
        setKey((k) => k + 1);
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <ImagePickerField
            name="imageUrl"
            label=""
            defaultValue=""
            placeholder="Görsel URL'si — örn: /images/hd-foto-01.jpg"
          />
        </div>
        <input
          name="alt"
          type="text"
          placeholder="Alt metin (isteğe bağlı)"
          className="w-full sm:w-48 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40 focus:border-[#C9972B]"
        />
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-[#C9972B] text-white font-bold text-sm hover:bg-[#B8861F] transition-all flex items-center gap-2 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Ekle
        </button>
      </div>
      <p className="text-xs text-slate-400">
        /public/images/ klasöründeki görseller için /images/dosyaadi.jpg formatını kullanın.
      </p>
    </form>
  );
}

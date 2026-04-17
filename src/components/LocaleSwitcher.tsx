"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "@/i18n/routing";
import { ChevronDown } from "lucide-react";

const LOCALES = [
  { code: "tr", label: "Türkçe", flag: "🇹🇷", short: "TR" },
  { code: "en", label: "English", flag: "🇬🇧", short: "EN" },
  { code: "ar", label: "العربية", flag: "🇸🇦", short: "AR" },
  { code: "fr", label: "Français", flag: "🇫🇷", short: "FR" },
];

interface Props {
  currentLocale: string;
}

export default function LocaleSwitcher({ currentLocale }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const current = LOCALES.find((l) => l.code === currentLocale) ?? LOCALES[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function switchLocale(locale: string) {
    setOpen(false);
    router.replace(pathname, { locale });
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm font-semibold text-[#006064] hover:bg-[#E0F7FA] transition-colors border border-[#B2EBF2]"
        aria-label="Dil seç"
        aria-expanded={open}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.short}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1.5 z-50 bg-white border border-[#B2EBF2] rounded-xl shadow-xl overflow-hidden min-w-[140px]">
          {LOCALES.map((locale) => (
            <button
              key={locale.code}
              onClick={() => switchLocale(locale.code)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-[#E0F7FA] transition-colors text-left ${
                locale.code === currentLocale
                  ? "font-bold text-[#006064] bg-[#F0FDFE]"
                  : "text-[#1A1A1A]"
              }`}
            >
              <span className="text-base">{locale.flag}</span>
              <span>{locale.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

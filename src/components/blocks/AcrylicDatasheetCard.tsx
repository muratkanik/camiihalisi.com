"use client";

import { useState } from "react";
import { FileText, Download, ChevronDown } from "lucide-react";

type Locale = "tr" | "en" | "ar" | "fr" | "de" | "ru";
type LocalizedText = Record<Locale, string>;

type Product = {
  code: string;
  pileHeight: string;
  pitch: string;
  points: string;
  weight: string;
  pdf: string;
};

type CommonData = {
  manufacturingMethod: LocalizedText;
  manufacturingTechnology: LocalizedText;
  pileYarn: LocalizedText;
  weavingSystem: LocalizedText;
  weavingWidth: string;
  row: string;
  backing: LocalizedText;
  yarnCount: string;
  warpYarn: LocalizedText;
  tolerance: LocalizedText;
  description: LocalizedText;
  performanceFeatures: LocalizedText[];
  usage: {
    underlay: LocalizedText;
    vacuum: LocalizedText;
    serviceLife: LocalizedText;
    warranty: LocalizedText;
  };
};

type TabCopy = {
  specs: string;
  description: string;
  performance: string;
};

type FieldLabels = {
  code: string;
  height: string;
  pitch: string;
  points: string;
  weight: string;
  row: string;
  weavingWidth: string;
  manufacturingMethod: string;
  manufacturingTechnology: string;
  pileYarn: string;
  weavingSystem: string;
  backing: string;
  yarnCount: string;
  warpYarn: string;
  download: string;
};

export default function AcrylicDatasheetCard({
  product,
  common,
  locale,
  labels,
  tabs,
}: {
  product: Product;
  common: CommonData;
  locale: Locale;
  labels: FieldLabels;
  tabs: TabCopy;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"specs" | "description" | "performance">("specs");

  return (
    <div className="rounded-2xl border border-[#B2EBF2] bg-[#F0FDFE] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full cursor-pointer list-none items-center justify-between gap-4 p-5 text-left"
      >
        <span>
          <span className="block text-xs uppercase tracking-wider text-[#0097A7] font-semibold">{labels.code}</span>
          <span className="block text-2xl font-bold text-[#003B40] mt-1">Akrilik {product.code}</span>
        </span>
        <span className="flex items-center gap-2 flex-shrink-0">
          <FileText className="w-6 h-6 text-[#C9972B]" aria-hidden="true" />
          <ChevronDown className={`w-5 h-5 text-[#0097A7] transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5">
          <div className="flex gap-1 border-t border-[#B2EBF2] pt-4 mb-4 flex-wrap">
            {(["specs", "description", "performance"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  tab === key ? "bg-[#0097A7] text-white" : "bg-white text-[#0097A7] border border-[#B2EBF2] hover:bg-[#E0F7FA]"
                }`}
              >
                {tabs[key]}
              </button>
            ))}
          </div>

          {tab === "specs" && (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div><dt className="text-[#6B6355]">{labels.height}</dt><dd className="font-semibold text-[#1A1A1A]">{product.pileHeight}</dd></div>
              <div><dt className="text-[#6B6355]">{labels.pitch}</dt><dd className="font-semibold text-[#1A1A1A]">{product.pitch}</dd></div>
              <div><dt className="text-[#6B6355]">{labels.points}</dt><dd className="font-semibold text-[#1A1A1A]">{product.points}</dd></div>
              <div><dt className="text-[#6B6355]">{labels.weight}</dt><dd className="font-semibold text-[#1A1A1A]">{product.weight}</dd></div>
              <div><dt className="text-[#6B6355]">{labels.row}</dt><dd className="font-semibold text-[#1A1A1A]">{common.row}</dd></div>
              <div><dt className="text-[#6B6355]">{labels.weavingWidth}</dt><dd className="font-semibold text-[#1A1A1A]">{common.weavingWidth}</dd></div>
              <div><dt className="text-[#6B6355]">{labels.yarnCount}</dt><dd className="font-semibold text-[#1A1A1A]">{common.yarnCount}</dd></div>
              <div><dt className="text-[#6B6355]">{labels.warpYarn}</dt><dd className="font-semibold text-[#1A1A1A]">{common.warpYarn[locale]}</dd></div>
              <div className="col-span-2"><dt className="text-[#6B6355]">{labels.pileYarn}</dt><dd className="font-semibold text-[#1A1A1A]">{common.pileYarn[locale]}</dd></div>
              <div className="col-span-2"><dt className="text-[#6B6355]">{labels.backing}</dt><dd className="font-semibold text-[#1A1A1A]">{common.backing[locale]}</dd></div>
              <div className="col-span-2"><dt className="text-[#6B6355]">{labels.weavingSystem}</dt><dd className="font-semibold text-[#1A1A1A]">{common.weavingSystem[locale]}</dd></div>
              <div className="col-span-2"><dt className="text-[#6B6355]">{labels.manufacturingMethod}</dt><dd className="font-semibold text-[#1A1A1A]">{common.manufacturingMethod[locale]}</dd></div>
              <div className="col-span-2"><dt className="text-[#6B6355]">{labels.manufacturingTechnology}</dt><dd className="font-semibold text-[#1A1A1A]">{common.manufacturingTechnology[locale]}</dd></div>
              <div className="col-span-2 text-xs text-[#6B6355] italic pt-1">{common.tolerance[locale]}</div>
            </dl>
          )}

          {tab === "description" && (
            <p className="text-sm text-[#3A3A3A] leading-relaxed whitespace-pre-line">{common.description[locale]}</p>
          )}

          {tab === "performance" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {common.performanceFeatures.map((f, i) => (
                  <span key={i} className="inline-flex items-center rounded-full bg-white border border-[#C9972B]/40 px-3 py-1 text-xs font-semibold text-[#0097A7]">
                    {f[locale]}
                  </span>
                ))}
              </div>
              <ul className="text-sm text-[#3A3A3A] space-y-1.5 list-disc list-inside">
                <li>{common.usage.underlay[locale]}</li>
                <li>{common.usage.vacuum[locale]}</li>
                <li>{common.usage.serviceLife[locale]}</li>
                <li>{common.usage.warranty[locale]}</li>
              </ul>
            </div>
          )}

          <a
            href={`/datasheets/akrilik/${product.pdf}`}
            target="_blank"
            rel="noopener"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0097A7] px-4 py-3 text-sm font-semibold text-white hover:bg-[#007F8C] transition-colors"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            {labels.download} — {product.code}
          </a>
        </div>
      )}
    </div>
  );
}

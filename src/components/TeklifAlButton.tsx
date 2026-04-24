"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import TeklifFormModal from "./TeklifFormModal";

interface Props {
  label?: string;
  className?: string;
  variant?: "gold" | "primary" | "outline";
}

export default function TeklifAlButton({
  label,
  className = "",
  variant = "gold",
}: Props) {
  const t = useTranslations("quote");
  const [open, setOpen] = useState(false);

  const cls =
    variant === "gold"
      ? "btn btn-gold"
      : variant === "primary"
      ? "btn btn-primary"
      : "btn btn-outline";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${cls} ${className}`}
      >
        {label ?? t("openButton")}
        <ExternalLink className="w-4 h-4" />
      </button>
      <TeklifFormModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

"use client";

import { useEffect, useState } from "react";

interface Props {
  createdAt: string;   // ISO timestamp (UTC)
  durationMs?: number; // kaç ms boyunca gösterilsin, varsayılan 4 dk
  variant?: "overlay" | "inline"; // overlay: kart görseli üzerine absolute; inline: satır içi
}

/**
 * AI ile oluşturulan blog yazıları için gerçek zamanlı "Yeni" etiketi.
 * `createdAt`'ten itibaren `durationMs` ms geçince otomatik kaybolur.
 * 10 saniyede bir yeniden kontrol eder.
 */
export default function NewBadge({
  createdAt,
  durationMs = 4 * 60 * 1000,
  variant = "overlay",
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function check() {
      const age = Date.now() - new Date(createdAt).getTime();
      setVisible(age < durationMs);
    }
    check();
    const id = setInterval(check, 10_000);
    return () => clearInterval(id);
  }, [createdAt, durationMs]);

  if (!visible) return null;

  if (variant === "inline") {
    return (
      <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold flex-shrink-0 animate-pulse">
        ✨ Yeni
      </span>
    );
  }

  // overlay — kart görseli üzerine
  return (
    <span
      className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-lg animate-pulse"
    >
      ✨ Yeni
    </span>
  );
}

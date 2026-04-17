import { SeoScoreResult, gradeColor } from "@/lib/seo-scorer";

interface Props {
  score: SeoScoreResult | null;
  compact?: boolean;
}

export default function SeoScoreBadge({ score, compact = false }: Props) {
  if (!score) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
        SEO: Hesaplanmadı
      </span>
    );
  }

  const gc = gradeColor(score.grade);
  const barColor =
    score.total >= 85 ? "bg-emerald-500" :
    score.total >= 70 ? "bg-green-500" :
    score.total >= 55 ? "bg-yellow-400" :
    score.total >= 40 ? "bg-orange-400" : "bg-red-500";

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${gc}`}>
        <span className={`w-2 h-2 rounded-full ${barColor}`}></span>
        SEO: {score.total}/100
        <span className="font-black">{score.grade}</span>
      </span>
    );
  }

  return (
    <div className="mt-4 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
          SEO Skoru
        </span>
        <div className="flex items-center gap-3">
          {/* Score bar */}
          <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${barColor}`}
              style={{ width: `${score.total}%` }}
            />
          </div>
          <span className={`text-sm font-extrabold px-2.5 py-0.5 rounded-lg border ${gc}`}>
            {score.total}/100 &nbsp;{score.grade}
          </span>
        </div>
      </div>

      {/* Checks */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {Object.entries(score.checks).map(([key, check]) => {
          const labels: Record<string, string> = {
            title: "Başlık",
            metaDescription: "Meta Açıklama",
            contentLength: "İçerik Uzunluğu",
            keywordInTitle: "Anahtar: Başlık",
            keywordInMeta: "Anahtar: Meta",
            keywordDensity: "Anahtar Yoğunluğu",
            readability: "Okunabilirlik",
          };
          const statusColor =
            check.status === "good" ? "text-emerald-600" :
            check.status === "warn" ? "text-yellow-600" : "text-red-500";
          const barPct = (check.score / check.max) * 100;

          return (
            <div key={key} className="flex items-center gap-3 px-4 py-2.5">
              <span className="w-28 text-xs font-medium text-slate-500 dark:text-slate-400 flex-shrink-0">
                {labels[key] ?? key}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        check.status === "good" ? "bg-emerald-400" :
                        check.status === "warn" ? "bg-yellow-400" : "bg-red-400"
                      }`}
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${statusColor} w-10 text-right`}>
                    {check.score}/{check.max}
                  </span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{check.note}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/30 text-xs text-slate-400 border-t border-slate-100 dark:border-slate-700">
        Son hesaplama: {new Date(score.calculatedAt).toLocaleString("tr-TR")}
      </div>
    </div>
  );
}

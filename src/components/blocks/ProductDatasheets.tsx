import { FileText, Download } from "lucide-react";

type Locale = "tr" | "en" | "ar" | "fr" | "de";

type Datasheet = {
  code: string;
  pileHeight: string;
  pitch: string;
  points: string;
  weight: string;
  pdf: string;
};

const ACRYLIC_DATASHEETS: Datasheet[] = [
  { code: "3000", pileHeight: "13 mm", pitch: "400 / m", points: "505.000 / m²", weight: "3.000 g / m²", pdf: "asil-hali-akrilik-cami-halisi-3000-teknik-veri-foyu.pdf" },
  { code: "3300", pileHeight: "14 mm", pitch: "676 / m", points: "567.800 / m²", weight: "3.300 g / m²", pdf: "asil-hali-akrilik-cami-halisi-3300-teknik-veri-foyu.pdf" },
  { code: "3465", pileHeight: "13 mm", pitch: "400 / m", points: "582.000 / m²", weight: "3.465 g / m²", pdf: "asil-hali-akrilik-cami-halisi-3465-teknik-veri-foyu.pdf" },
  { code: "3588", pileHeight: "14 mm", pitch: "400 / m", points: "637.140 / m²", weight: "3.588 g / m²", pdf: "asil-hali-akrilik-cami-halisi-3588-teknik-veri-foyu.pdf" },
  { code: "3600", pileHeight: "14 mm", pitch: "400 / m", points: "637.140 / m²", weight: "3.600 g / m²", pdf: "asil-hali-akrilik-cami-halisi-3600-teknik-veri-foyu.pdf" },
  { code: "3844", pileHeight: "14 mm", pitch: "400 / m", points: "688.800 / m²", weight: "3.844 g / m²", pdf: "asil-hali-akrilik-cami-halisi-3844-teknik-veri-foyu.pdf" },
  { code: "4100", pileHeight: "14 mm", pitch: "458 / m", points: "787.200 / m²", weight: "4.100 g / m²", pdf: "asil-hali-akrilik-cami-halisi-4100-teknik-veri-foyu.pdf" },
  { code: "4356", pileHeight: "15 mm", pitch: "503 / m", points: "865.100 / m²", weight: "4.356 g / m²", pdf: "asil-hali-akrilik-cami-halisi-4356-teknik-veri-foyu.pdf" },
  { code: "4600", pileHeight: "14 mm", pitch: "600 / m", points: "1.008.000 / m²", weight: "4.600 g / m²", pdf: "asil-hali-akrilik-cami-halisi-4600-teknik-veri-foyu.pdf" },
  { code: "4715", pileHeight: "15 mm", pitch: "600 / m", points: "1.033.200 / m²", weight: "4.715 g / m²", pdf: "asil-hali-akrilik-cami-halisi-4715-teknik-veri-foyu.pdf" },
  { code: "4950", pileHeight: "16 mm", pitch: "600 / m", points: "1.076.000 / m²", weight: "4.950 g / m²", pdf: "asil-hali-akrilik-cami-halisi-4950-teknik-veri-foyu.pdf" },
  { code: "5125", pileHeight: "16 mm", pitch: "650 / m", points: "1.101.875 / m²", weight: "5.125 g / m²", pdf: "asil-hali-akrilik-cami-halisi-5125-teknik-veri-foyu.pdf" },
  { code: "5380", pileHeight: "16 mm", pitch: "675 / m", points: "1.119.300 / m²", weight: "5.380 g / m²", pdf: "asil-hali-akrilik-cami-halisi-5380-teknik-veri-foyu.pdf" },
  { code: "5535", pileHeight: "16 mm", pitch: "700 / m", points: "1.205.400 / m²", weight: "5.535 g / m²", pdf: "asil-hali-akrilik-cami-halisi-5535-teknik-veri-foyu.pdf" },
];

const COPY: Record<Locale, {
  eyebrow: string;
  title: string;
  description: string;
  code: string;
  height: string;
  pitch: string;
  points: string;
  weight: string;
  open: string;
  download: string;
  note: string;
}> = {
  tr: {
    eyebrow: "Teknik dokümanlar",
    title: "Akrilik cami halısı teknik veri föyleri",
    description: "Akrilik cami halısı kalite ve model kodlarına göre teknik özellikleri karşılaştırın. Her föyde üretim yöntemi, dokuma değerleri, hav yüksekliği, toplam ağırlık ve kullanım bilgileri yer alır.",
    code: "Kalite / model kodu",
    height: "Hav yüksekliği",
    pitch: "Atkı sayısı",
    points: "İlme ucu",
    weight: "Toplam ağırlık",
    open: "Teknik özeti aç",
    download: "PDF föyü indir",
    note: "Tüm föylerde %100 birinci kalite akrilik hav ipliği, Wilton çift karşılıklı dokuma teknolojisi, premium jüt taban ve 2 yıl ürün garantisi bilgisi yer alır. Projeye uygun seçim için teknik ekibimizden destek alabilirsiniz.",
  },
  en: {
    eyebrow: "Technical documents",
    title: "Acrylic mosque carpet technical data sheets",
    description: "Compare acrylic mosque carpet specifications by quality and model code. Each sheet includes manufacturing, weaving, pile height, total weight and use information.",
    code: "Quality / model code",
    height: "Pile height",
    pitch: "Pitch",
    points: "Points",
    weight: "Total weight",
    open: "Open technical summary",
    download: "Download PDF sheet",
    note: "All sheets specify first-quality acrylic pile yarn, Wilton face-to-face weaving, premium jute backing and a 2-year product warranty. Contact our technical team for project-specific guidance.",
  },
  de: {
    eyebrow: "Technische Dokumente",
    title: "Technische Datenblätter für Acryl-Moscheeteppiche",
    description: "Vergleichen Sie die technischen Eigenschaften nach Qualitäts- und Modellcode.",
    code: "Qualitäts- / Modellcode",
    height: "Polhöhe",
    pitch: "Schussdichte",
    points: "Noppen",
    weight: "Gesamtgewicht",
    open: "Technische Zusammenfassung öffnen",
    download: "PDF-Datenblatt herunterladen",
    note: "Alle Datenblätter enthalten Angaben zu Acrylgarn, Wilton-Webtechnik, Juterücken und 2 Jahren Produktgarantie.",
  },
  fr: {
    eyebrow: "Documents techniques",
    title: "Fiches techniques des tapis de mosquée en acrylique",
    description: "Comparez les caractéristiques techniques par code qualité et modèle.",
    code: "Code qualité / modèle",
    height: "Hauteur de velours",
    pitch: "Trame",
    points: "Points",
    weight: "Poids total",
    open: "Ouvrir le résumé technique",
    download: "Télécharger la fiche PDF",
    note: "Toutes les fiches indiquent le fil acrylique, le tissage Wilton, le dossier en jute et une garantie produit de 2 ans.",
  },
  ar: {
    eyebrow: "الوثائق الفنية",
    title: "النشرات الفنية لسجاد المساجد الأكريليك",
    description: "قارن المواصفات الفنية حسب رمز الجودة والطراز.",
    code: "رمز الجودة / الطراز",
    height: "ارتفاع الوبر",
    pitch: "عدد اللحمة",
    points: "عدد العقد",
    weight: "الوزن الإجمالي",
    open: "فتح الملخص الفني",
    download: "تحميل ورقة PDF",
    note: "تتضمن جميع النشرات معلومات عن خيوط الأكريليك وتقنية نسج ويلتون وقاعدة الجوت وضمان المنتج لمدة عامين.",
  },
};

export default function ProductDatasheets({ locale }: { locale: string }) {
  const copy = COPY[(locale as Locale) in COPY ? (locale as Locale) : "tr"];

  return (
    <section id="teknik-veri-foyleri" className="py-14 bg-white border-b border-[#E0F7FA]">
      <div className="container-site">
        <div className="max-w-3xl mb-8">
          <span className="badge badge-gold mb-4">{copy.eyebrow}</span>
          <h2 className="section-title mb-3">{copy.title}</h2>
          <div className="gold-line mb-4" />
          <p className="text-[#6B6355] leading-relaxed">{copy.description}</p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {ACRYLIC_DATASHEETS.map((sheet) => (
            <details key={sheet.code} className="group rounded-2xl border border-[#B2EBF2] bg-[#F0FDFE] overflow-hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5">
                <span>
                  <span className="block text-xs uppercase tracking-wider text-[#0097A7] font-semibold">{copy.code}</span>
                  <span className="block text-2xl font-bold text-[#003B40] mt-1">Akrilik {sheet.code}</span>
                </span>
                <FileText className="w-6 h-6 text-[#C9972B] flex-shrink-0" aria-hidden="true" />
              </summary>
              <div className="px-5 pb-5">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm border-t border-[#B2EBF2] pt-4">
                  <div><dt className="text-[#6B6355]">{copy.height}</dt><dd className="font-semibold text-[#1A1A1A]">{sheet.pileHeight}</dd></div>
                  <div><dt className="text-[#6B6355]">{copy.pitch}</dt><dd className="font-semibold text-[#1A1A1A]">{sheet.pitch}</dd></div>
                  <div><dt className="text-[#6B6355]">{copy.points}</dt><dd className="font-semibold text-[#1A1A1A]">{sheet.points}</dd></div>
                  <div><dt className="text-[#6B6355]">{copy.weight}</dt><dd className="font-semibold text-[#1A1A1A]">{sheet.weight}</dd></div>
                </dl>
                <a
                  href={`/datasheets/akrilik/${sheet.pdf}`}
                  target="_blank"
                  rel="noopener"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0097A7] px-4 py-3 text-sm font-semibold text-white hover:bg-[#007F8C] transition-colors"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  {copy.download} — {sheet.code}
                </a>
              </div>
            </details>
          ))}
        </div>

        <p className="mt-6 text-xs text-[#6B6355] leading-relaxed max-w-4xl">{copy.note}</p>
      </div>
    </section>
  );
}

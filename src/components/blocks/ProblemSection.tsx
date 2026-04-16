// "Birçok Camide Halılar Neden Erken Yıpranır?" — 3 koyu teal kart

const PROBLEMS = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: "Yanlış Teknik Seçim",
    desc: "Doğru iplik, yoğunluk ve alt yapı seçilmezse halılar hızla deforme olur.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <circle cx="17.5" cy="17.5" r="3.5" />
        <path d="m21 21-1.5-1.5" />
      </svg>
    ),
    title: "Eksik Zemin Analizi",
    desc: "Zemin detayları ve kullanım yoğunluğu yanlış analiz edilirse çözümsüz sorunlar kaçınılmaz olur.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Kalitesiz Montaj Süreci",
    desc: "Düzensiz ve profesyonel olmayan montaj işlemleri halının ömrünü kısaltır.",
  },
];

export default function ProblemSection() {
  return (
    <section className="section bg-white">
      <div className="container-site">
        {/* Başlık */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0D1B1E] leading-tight">
            Birçok Camide Halılar<br className="hidden sm:block" /> Neden Erken Yıpranır?
          </h2>
        </div>

        {/* Kartlar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROBLEMS.map((p, i) => (
            <div
              key={i}
              className="bg-[#006064] rounded-2xl p-8 flex flex-col gap-5 hover:bg-[#00494D] transition-colors"
            >
              {/* İkon */}
              <div className="text-white/80">{p.icon}</div>

              {/* Başlık */}
              <h3 className="text-white font-bold text-lg leading-snug">{p.title}</h3>

              {/* Açıklama */}
              <p className="text-white/65 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

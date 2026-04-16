import { ArrowRight, Quote } from "lucide-react";

const MAIN_SITE_URL =
  "/api/r?to=https%3A%2F%2Fwww.asilhali.com.tr%3Futm_source%3Dcamiihalisi%26utm_medium%3Dtrust%26utm_campaign%3Dsite&from=trust&label=iletisime-gec&cat=outbound";

export interface Testimonial {
  name: string;
  location: string;
  quote: string;
  rating?: number; // 1-5, defaults to 5
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    name: "Mehmet Bey",
    location: "Ankara — Camii Derneği",
    quote:
      "Doğru halıyı seçmek sayesinde yıllardır sorunsuz bir şekilde kullanıyoruz. Destek ve profesyonelliklerinden dolayı Allah razı olsun.",
    rating: 5,
  },
  {
    name: "Hasan Efendi",
    location: "İstanbul — Camii Vakfı",
    quote:
      "10 yıl önce döşettik, hâlâ ilk günkü gibi duruyor. Rengi solmadı, deformasyona uğramadı. Asil Halı'yı herkese tavsiye ederiz.",
    rating: 5,
  },
];

interface TrustSectionProps {
  testimonials?: Testimonial[];
}

export default function TrustSection({ testimonials }: TrustSectionProps) {
  const items = (testimonials && testimonials.length > 0) ? testimonials : DEFAULT_TESTIMONIALS;

  return (
    <section className="section overflow-hidden">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* ── Sol: Metin + görsel ── */}
          <div className="relative">
            {/* Arka plan görseli — soluk */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden -z-10">
              <img
                src="/images/panorama-cami.jpg"
                alt="Cami iç mekanı"
                className="w-full h-full object-cover opacity-15"
              />
              <div className="absolute inset-0 bg-[#F0FDFE]/85" />
            </div>

            <div className="p-8 md:p-10 rounded-3xl border border-[#B2EBF2]">
              {/* Başlık */}
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D1B1E] leading-tight mb-5">
                30 Yıldır<br />
                <span className="text-[#006064]">Güven ve Kaliteyle</span><br />
                Hizmet Ediyoruz
              </h2>

              <p className="text-[#5A6A6D] text-base leading-relaxed mb-7">
                Cami halısı seçimini şansa bırakmayın, şimdi uzmanlarımızla iletişime geçin.
              </p>

              {/* İstatistikler */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { n: "50+", l: "Yıl Tecrübe" },
                  { n: "10K+", l: "Cami" },
                  { n: "81", l: "Şehir" },
                ].map((s) => (
                  <div key={s.l} className="text-center bg-white rounded-xl py-3 px-2 border border-[#B2EBF2]">
                    <div className="text-xl font-extrabold text-[#006064]">{s.n}</div>
                    <div className="text-xs text-[#5A6A6D] mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>

              <a
                href={MAIN_SITE_URL}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 bg-[#C9972B] hover:bg-[#B8821E] text-white font-bold px-7 py-3.5 rounded-full transition-all shadow-md text-base"
              >
                İletişime Geç
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* ── Sağ: Referans kartları ── */}
          <div className="flex flex-col gap-5">
            {items.slice(0, 3).map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#B2EBF2] p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Tırnak ikonu */}
                <Quote className="w-7 h-7 text-[#C9972B]/40 mb-3" />

                {/* Alıntı */}
                <p className="text-[#1A1A1A] text-sm leading-relaxed mb-5 italic">
                  "{t.quote}"
                </p>

                {/* Kimlik */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#006064]/15 flex items-center justify-center flex-shrink-0 text-[#006064] font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#0D1B1E]">{t.name}</div>
                    <div className="text-xs text-[#5A6A6D]">{t.location}</div>
                  </div>
                  {/* Yıldızlar */}
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(t.rating ?? 5)].map((_, si) => (
                      <svg key={si} className="w-3.5 h-3.5 text-[#C9972B]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

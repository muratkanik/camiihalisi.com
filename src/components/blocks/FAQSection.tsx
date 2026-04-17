"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

const DEFAULT_FAQS: FAQItem[] = [
  {
    question: "Cami halısı siparişi nasıl verebilirim?",
    answer:
      "Asil Halı'nın resmi web sitesi asilhali.com.tr üzerinden veya telefon ile iletişime geçerek sipariş verebilirsiniz. Teknik ekibimiz caminizin ölçümünü alarak size özel fiyat teklifi hazırlar.",
  },
  {
    question: "Cami halısı ölçümü nasıl alınır?",
    answer:
      "Cami alanının uzunluk ve genişlik ölçüleri alınır, sütun ve mihrap gibi özel alanlar ayrıca hesaplanır. Uzman ekibimiz yerinde keşif yaparak kesin ölçüm alabilir veya mimari planlardan hesaplama yapabilir.",
  },
  {
    question: "Hangi halı türü cami için en uygundur?",
    answer:
      "Cami büyüklüğüne, bütçeye ve kullanım yoğunluğuna göre değişir. Küçük mahalle camileri için akrilik tercih edilirken büyük camilerde yün veya polyamid tercih edilir. Ücretsiz danışmanlığımızdan yararlanabilirsiniz.",
  },
  {
    question: "Cami halısı ne sıklıkla değiştirilmelidir?",
    answer:
      "Kaliteli bir cami halısı 15-20 yıl kullanılabilir. Ancak yoğun kullanım, yetersiz bakım veya nem gibi faktörler ömrü kısaltabilir. Düzenli temizlik ve profesyonel bakım ömrü uzatır.",
  },
  {
    question: "Teslimat süresi ne kadar?",
    answer:
      "Standart siparişlerde 3-6 hafta, acil siparişlerde ise 2-3 hafta içinde teslimat sağlanır. Üretim sürecini şeffaf biçimde takip edebilirsiniz.",
  },
  {
    question: "Özel desen tasarımı mümkün müdür?",
    answer:
      "Evet. Caminizin mimarisine, rengine veya bulunduğu bölgenin geleneğine uygun özel desen tasarımı yapılabilir. Tasarım süreci ücretsizdir ve onayınız alındıktan sonra üretime geçilir.",
  },
];

interface FAQSectionProps {
  faqs?: FAQItem[];
  title?: string;
}

export default function FAQSection({
  faqs = DEFAULT_FAQS,
  title = "Sık Sorulan Sorular",
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section bg-[#F0FDFE]">
      <div className="container-site">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Sol: Başlık */}
          <div className="lg:sticky lg:top-28">
            <span className="badge badge-gold mb-4">SSS</span>
            <h2 className="section-title mb-4">{title}</h2>
            <div className="gold-line mb-6" />
            <p className="section-subtitle text-[#6B6355]">
              Cami halısı seçimi, sipariş ve teslimat hakkında merak ettiğiniz
              her şeyin yanıtı burada.
            </p>
            <p className="mt-6 text-sm text-[#6B6355]/80 leading-relaxed">
              Yanıt bulamadığınız sorunuz mu var?{" "}
              <a
                href="/api/r?to=https%3A%2F%2Fwww.asilhali.com.tr%2Filetisim%3Futm_source%3Dcamiihalisi%26utm_medium%3Dfaq&from=faq&label=bize-ulasin&cat=outbound"
                target="_blank"
                rel="noopener"
                className="text-[#006064] font-semibold underline underline-offset-2 hover:text-[#C9972B]"
              >
                Bize ulaşın →
              </a>
            </p>
          </div>

          {/* Sağ: Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "border-[#C9972B]/50 shadow-md bg-white"
                      : "border-[#B2EBF2] bg-white hover:border-[#C9972B]/30"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span
                      className="font-semibold text-[#1A1A1A] text-sm md:text-base leading-snug"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem" }}
                    >
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 text-[#C9972B] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5">
                      <p className="text-sm text-[#6B6355] leading-relaxed border-t border-[#E0F7FA] pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 1800;
          const steps = 50;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}

export default function StatsSection() {
  const t = useTranslations("stats");

  const stats = [
    { value: 50,    suffix: "+",     label: t("experience"),  description: "" },
    { value: 10000, suffix: "+",     label: t("mosques"),     description: "" },
    { value: 81,    suffix: " " + t("cities"),  label: "",   description: "" },
    { value: 100,   suffix: "%",     label: t("domestic"),    description: "" },
  ];

  return (
    <section className="bg-[#006064] py-16 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C9972B' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M40 0l5.88 10.18L57.32 6.7l-0.47 12.35 12.35-0.47-3.48 11.44L76 40l-10.18 5.88L69.3 57.32l-12.35-0.47 0.47 12.35-11.44-3.48L40 80l-5.88-10.18L22.68 73.3l0.47-12.35-12.35 0.47 3.48-11.44L4 40l10.18-5.88L10.7 22.68l12.35 0.47-0.47-12.35 11.44 3.48z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="container-site relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div
                className="text-4xl md:text-5xl font-bold text-[#E4B84A] mb-1"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              </div>
              {stat.label && (
                <div className="text-white font-semibold text-sm md:text-base">
                  {stat.label}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

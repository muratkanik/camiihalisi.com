import { Shield, Truck, Ruler, Palette, Award, HeartHandshake, Star, Clock } from "lucide-react";

const FEATURES = [
  {
    icon: Shield,
    title: "İbadete Layık Kalite",
    description:
      "Her iplik, her düğüm; camiye yaraşır bir kaliteyle işlenir. ISO sertifikalı üretim süreçleri.",
    color: "#1B4332",
  },
  {
    icon: Ruler,
    title: "Özel Ölçü Üretim",
    description:
      "Caminin metre kare ölçüsüne göre birebir üretim. Sütun aralarından mihrap önüne kadar tam uyum.",
    color: "#C9972B",
  },
  {
    icon: Palette,
    title: "Özel Desen Tasarımı",
    description:
      "Geleneksel İslami motifler veya modern geometrik desenler. Caminin mimarisine özel tasarım.",
    color: "#1B4332",
  },
  {
    icon: Truck,
    title: "Türkiye Geneli Teslimat",
    description:
      "81 ile kapıya teslim. Büyük ölçekli camiler için özel lojistik ve kurulum hizmeti.",
    color: "#C9972B",
  },
  {
    icon: Award,
    title: "50+ Yıl Tecrübe",
    description:
      "Asil Halı, 50 yılı aşkın deneyimiyle Türkiye'nin köklü cami halısı üreticilerinden biridir.",
    color: "#1B4332",
  },
  {
    icon: HeartHandshake,
    title: "Satış Sonrası Destek",
    description:
      "Garanti kapsamı, bakım önerileri ve onarım hizmetiyle uzun süreli müşteri ilişkisi.",
    color: "#C9972B",
  },
  {
    icon: Star,
    title: "10.000+ Referans",
    description:
      "Türkiye'nin dört bir yanında on binlerce camide döşenmiş, kanıtlanmış kalite.",
    color: "#1B4332",
  },
  {
    icon: Clock,
    title: "Hızlı Üretim Süreci",
    description:
      "Siparişten teslimata kadar hızlı ve şeffaf süreç takibi. Acil projeler için öncelikli üretim.",
    color: "#C9972B",
  },
];

export default function FeatureGrid() {
  return (
    <section className="section bg-white">
      <div className="container-site">
        {/* Başlık */}
        <div className="text-center mb-14">
          <span className="badge badge-green mb-4">Neden Asil Halı?</span>
          <h2 className="section-title mb-4">
            Camiye Layık Kaliteyi<br />Nasıl Sağlıyoruz?
          </h2>
          <div className="gold-line mx-auto mb-4" />
          <p className="section-subtitle mx-auto">
            İbadethane, sıradan bir mekan değildir. Her halımız bu bilinçle
            tasarlanır, dokunur ve teslim edilir.
          </p>
        </div>

        {/* Özellik Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#F7F3EC] border border-[#DDD8CE] hover:border-[#C9972B]/40 hover:shadow-lg transition-all duration-300 group"
              >
                {/* İkon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300"
                  style={{ backgroundColor: `${feat.color}15` }}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: feat.color }}
                    aria-hidden="true"
                  />
                </div>

                {/* Başlık */}
                <h3
                  className="font-bold text-[#1A1A1A] mb-2 text-base leading-snug"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem" }}
                >
                  {feat.title}
                </h3>

                {/* Açıklama */}
                <p className="text-sm text-[#6B6355] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

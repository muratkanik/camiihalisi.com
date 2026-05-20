import { setRequestLocale } from "next-intl/server";
import Navigation from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import ColorReplacementDemo from "@/components/blocks/ColorReplacementDemo";

export default async function RenkDemoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navigation locale={locale} />
      
      <main className="min-h-screen bg-[#F0FDFE] py-16">
        <div className="container-site">
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0097A7] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Etkileşimli Cami Halısı Zemin Simülatörü (Demo)
            </h1>
            <div className="gold-line mx-auto mb-6" />
            <p className="text-[#6B6355] text-lg">
              Aşağıdaki örnekte resmin içinden çıkarılan dominant renkleri görebilir,
              bir rengi seçip palet üzerinden dilediğiniz başka bir renkle değiştirebilirsiniz. 
              Gölgeler ve dokular korunarak HTML5 Canvas üzerinde anlık (interaktif) hesaplama yapılır.
            </p>
          </div>

          <ColorReplacementDemo />

        </div>
      </main>

      <Footer locale={locale} />
    </>
  );
}

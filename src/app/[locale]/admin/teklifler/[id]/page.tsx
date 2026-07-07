import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ArrowLeft, User, Phone, MapPin, Mail, Calendar, Hash, FileText } from "lucide-react";
import StatusUpdater from "./StatusUpdater";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "Teklif Detayı | Admin Panel",
};

export default async function TeklifDetayPage({ params }: { params: { id: string } }) {
  const quote = await prisma.carpetQuoteRequest.findUnique({
    where: { id: params.id },
    include: {
      designSession: true,
    },
  });

  if (!quote) {
    notFound();
  }

  const session = quote.designSession;
  // Parse mappings if needed
  let mappings: any[] = [];
  if (session && session.mappings) {
    try {
      mappings = typeof session.mappings === 'string' ? JSON.parse(session.mappings) : session.mappings;
    } catch (e) {
      mappings = session.mappings as any;
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto print:p-0 print:m-0">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/teklifler" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors print:hidden">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Teklif Detayı</h1>
        </div>
        <div className="flex items-center gap-4 print:hidden">
          <StatusUpdater quoteId={quote.id} currentStatus={quote.status} />
          <PrintButton />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sol Kolon: Müşteri ve Talep Bilgileri */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="font-bold text-lg text-slate-800 dark:text-white mb-4 border-b pb-2 dark:border-slate-800">Müşteri Bilgileri</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-500">Ad Soyad / Kurum</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">{quote.customerName}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-500">Telefon</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    <a href={`tel:${quote.customerPhone}`} className="text-blue-600 hover:underline">{quote.customerPhone}</a>
                  </div>
                </div>
              </div>
              {quote.customerEmail && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-500">E-posta</div>
                    <div className="font-medium text-slate-800 dark:text-slate-200">
                      <a href={`mailto:${quote.customerEmail}`} className="text-blue-600 hover:underline">{quote.customerEmail}</a>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-500">Konum</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">{quote.city || "-"} / {quote.district || "-"}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Hash className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-500">İletişim Tercihi</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200 uppercase">{quote.contactPreference}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="font-bold text-lg text-slate-800 dark:text-white mb-4 border-b pb-2 dark:border-slate-800">Talep Detayları</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-500">Ölçü (m²)</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">{quote.requestedSize || "-"}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-500">Talep Tarihi</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    {new Date(quote.createdAt).toLocaleString("tr-TR")}
                  </div>
                </div>
              </div>
              {quote.customerNote && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                  <div className="text-xs font-semibold text-yellow-800 dark:text-yellow-400 mb-1">Müşteri Notu:</div>
                  <p className="text-sm text-yellow-900 dark:text-yellow-200 whitespace-pre-wrap">{quote.customerNote}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sağ Kolon: Ürün ve Renk Tasarımı */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 h-full">
            <h2 className="font-bold text-lg text-slate-800 dark:text-white mb-4 border-b pb-2 dark:border-slate-800">Ürün & Tasarım</h2>
            
            <div className="mb-6">
              <div className="text-sm text-slate-500 mb-1">Seçilen Ürün</div>
              <Link href={session?.productUrl || `/kategori/safli-akrilik-cami-halisi/${quote.productSlug}`} target="_blank" className="text-xl font-bold text-[#003B40] dark:text-[#C9972B] hover:underline">
                {session?.productTitle || quote.productSlug}
              </Link>
            </div>

            {session && (
              <div className="mb-8">
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Tasarım Linki (Müşterinin Gördüğü):</div>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={`${session.productUrl}?design=${session.id}`} 
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-600 dark:text-slate-300 outline-none"
                  />
                  <a 
                    href={`${session.productUrl}?design=${session.id}`} 
                    target="_blank" 
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    Aç
                  </a>
                </div>
              </div>
            )}

            <div>
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Seçilen İplik Renkleri (Üretim Listesi):</div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800">
                    <tr>
                      <th className="p-3 text-xs font-semibold text-slate-500 uppercase">Oran</th>
                      <th className="p-3 text-xs font-semibold text-slate-500 uppercase">Renk</th>
                      <th className="p-3 text-xs font-semibold text-slate-500 uppercase">İp Kodu</th>
                      <th className="p-3 text-xs font-semibold text-slate-500 uppercase">İp Adı</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {mappings.length > 0 ? mappings.map((m: any, i: number) => (
                      <tr key={i}>
                        <td className="p-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                          %{(m.sourceColorPercentage || 0).toFixed(1)}
                        </td>
                        <td className="p-3">
                          <div className="w-8 h-8 rounded shadow-inner ring-1 ring-black/10" style={{ backgroundColor: m.targetYarnHex }}></div>
                        </td>
                        <td className="p-3 text-sm font-bold text-slate-800 dark:text-white">
                          {m.targetYarnCode}
                        </td>
                        <td className="p-3 text-sm text-slate-600 dark:text-slate-400">
                          {m.targetYarnNameTr}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-slate-500 text-sm">Renk eşleşmesi bulunamadı.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {session?.previewImageUrl && (
              <div className="mt-8">
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Önizleme Görüntüsü:</div>
                <img src={session.previewImageUrl} alt="Tasarım Önizleme" className="max-w-full rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

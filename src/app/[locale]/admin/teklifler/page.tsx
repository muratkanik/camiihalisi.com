import { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Özel Tasarım Teklifleri | Admin Panel",
};

export default async function TekliflerPage() {
  const quotes = await prisma.carpetQuoteRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      designSession: true,
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Özel Tasarım ve Teklif Talepleri</h1>
      
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tarih</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Müşteri</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ürün</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ölçü / Miktar</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Durum</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Henüz teklif talebi bulunmuyor.
                  </td>
                </tr>
              ) : (
                quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                      {new Date(quote.createdAt).toLocaleDateString("tr-TR", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{quote.customerName}</div>
                      <div className="text-xs text-slate-500">{quote.customerPhone}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                      {quote.designSession?.productTitle || quote.productSlug}
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                      {quote.requestedSize || "-"} {quote.requestedQuantity ? `/ ${quote.requestedQuantity}` : ""}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        quote.status === "new" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                        quote.status === "contacted" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                        quote.status === "quoted" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" :
                        quote.status === "won" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                        "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400"
                      }`}>
                        {quote.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link 
                        href={`/admin/teklifler/${quote.id}`}
                        className="text-sm font-medium text-[#003B40] hover:text-[#005566] dark:text-[#C9972B] dark:hover:text-[#b08426]"
                      >
                        Detay
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

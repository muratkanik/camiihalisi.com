import { getTestimonials } from "./actions";
import TestimonialsEditorClient from "@/components/admin/TestimonialsEditorClient";

export const dynamic = "force-dynamic";

export default async function YorumlarAdminPage() {
  const testimonials = await getTestimonials();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Müşteri Yorumları</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Ana sayfada görünen müşteri yorumlarını buradan yönetin. En fazla 3 yorum görüntülenir.
        </p>
      </div>

      <TestimonialsEditorClient initialTestimonials={testimonials} />
    </div>
  );
}

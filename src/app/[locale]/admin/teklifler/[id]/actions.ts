"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateQuoteStatus(quoteId: string, newStatus: string) {
  try {
    await prisma.carpetQuoteRequest.update({
      where: { id: quoteId },
      data: { status: newStatus },
    });
    revalidatePath("/[locale]/admin/teklifler", "page");
    revalidatePath(`/[locale]/admin/teklifler/${quoteId}`, "page");
    return { success: true };
  } catch (error) {
    console.error("Status update error", error);
    return { error: "Durum güncellenemedi." };
  }
}

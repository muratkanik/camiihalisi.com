"use server";

import { revalidatePath } from "next/cache";

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

export interface ContactPhone {
  label: string;
  number: string;
}

export interface ContactOffice {
  id: string;
  region: string;
  type: "merkez" | "fabrika" | "ofis" | "home-office" | "depo" | "yurtdisi";
  title: string;
  address?: string;
  city: string;
  country?: string;
  phones: ContactPhone[];
  email?: string;
  whatsapp?: string;
  mapsUrl?: string;
  fax?: string;
  workHours?: string;
  active: boolean;
}

export const DEFAULT_OFFICES: ContactOffice[] = [
  {
    id: "kayseri-merkez",
    region: "Kayseri",
    type: "merkez",
    title: "Kayseri Merkez Showroom",
    address: "Anbar Mah. Demirciler Sit. 14.cad No.46",
    city: "Melikgazi / Kayseri",
    phones: [
      { label: "Merkez", number: "+90 352 232 38 38" },
      { label: "Depo", number: "+90 352 311 39 59" },
      { label: "Mesai Dışı", number: "+90 541 566 13 75" },
    ],
    email: "info@asilhali.com.tr",
    whatsapp: "+905323467939",
    fax: "+90 352 321 10 27",
    mapsUrl: "https://maps.google.com/?q=Asil+Hali+Kayseri+Melikgazi",
    workHours: "Pzt–Cum: 08:00–18:00 | Cmt: 09:00–14:00",
    active: true,
  },
  {
    id: "kayseri-fabrika",
    region: "Kayseri",
    type: "fabrika",
    title: "Kayseri Fabrika",
    address: "Kayseri Organize Sanayi Serbest Bölgesi",
    city: "Kayseri",
    country: "Türkiye",
    phones: [
      { label: "Fabrika", number: "+90 352 232 38 38" },
    ],
    mapsUrl: "https://maps.google.com/?q=Kayseri+Organize+Sanayi",
    active: true,
  },
  {
    id: "istanbul-ofis",
    region: "İstanbul / Marmara",
    type: "ofis",
    title: "İstanbul Ofis",
    address: "Caddebostan Mah. Bağdat Cad. No: 346 Yaprak Apt. Kat: 2 D: 4",
    city: "Kadıköy / İstanbul",
    phones: [
      { label: "İstanbul", number: "+90 216 504 82 27" },
      { label: "Mesai Dışı", number: "+90 532 346 79 39" },
    ],
    mapsUrl: "https://maps.google.com/?q=Caddebostan+Bagdat+Caddesi+346+Kadikoy",
    active: true,
  },
  {
    id: "ihracat",
    region: "Yurtdışı / İhracat",
    type: "yurtdisi",
    title: "Yurtdışı & İhracat",
    city: "Kayseri",
    phones: [
      { label: "İhracat", number: "+90 542 383 86 70" },
    ],
    whatsapp: "+905423838670",
    active: true,
  },
  {
    id: "karadeniz-dogu",
    region: "Karadeniz – Doğu – Güneydoğu",
    type: "home-office",
    title: "Karadeniz / Doğu Temsilciliği",
    city: "Türkiye",
    phones: [{ label: "Temsilci", number: "+90 506 225 92 35" }],
    active: true,
  },
  {
    id: "ic-anadolu-akdeniz",
    region: "İç Anadolu – Akdeniz",
    type: "home-office",
    title: "İç Anadolu / Akdeniz Temsilciliği",
    city: "Türkiye",
    phones: [{ label: "Temsilci", number: "+90 541 566 13 75" }],
    active: true,
  },
  {
    id: "ege",
    region: "Ege",
    type: "home-office",
    title: "Ege Bölgesi Temsilciliği",
    city: "Türkiye",
    phones: [{ label: "Temsilci", number: "+90 532 346 79 39" }],
    active: true,
  },
  {
    id: "new-york",
    region: "Amerika",
    type: "yurtdisi",
    title: "New York Branch Office",
    city: "New York, USA",
    country: "USA",
    phones: [],
    whatsapp: "+905423838670",
    active: true,
  },
];

export async function getContactOffices(): Promise<ContactOffice[]> {
  const prisma = await getPrisma();
  try {
    const row = await prisma.setting.findUnique({ where: { key: "contact_offices" } });
    if (row) return JSON.parse(row.value) as ContactOffice[];
    return DEFAULT_OFFICES;
  } catch {
    return DEFAULT_OFFICES;
  } finally {
    await prisma.$disconnect();
  }
}

export async function saveContactOfficesAction(formData: FormData): Promise<void> {
  const json = formData.get("offices_json") as string;
  let offices: ContactOffice[];
  try {
    offices = JSON.parse(json);
  } catch {
    throw new Error("Geçersiz JSON");
  }

  const prisma = await getPrisma();
  try {
    await prisma.setting.upsert({
      where: { key: "contact_offices" },
      update: { value: JSON.stringify(offices) },
      create: { key: "contact_offices", value: JSON.stringify(offices) },
    });
    revalidatePath("/iletisim", "layout");
  } finally {
    await prisma.$disconnect();
  }
}

export async function resetContactOfficesAction(): Promise<void> {
  const prisma = await getPrisma();
  try {
    await prisma.setting.upsert({
      where: { key: "contact_offices" },
      update: { value: JSON.stringify(DEFAULT_OFFICES) },
      create: { key: "contact_offices", value: JSON.stringify(DEFAULT_OFFICES) },
    });
    revalidatePath("/iletisim", "layout");
  } finally {
    await prisma.$disconnect();
  }
}

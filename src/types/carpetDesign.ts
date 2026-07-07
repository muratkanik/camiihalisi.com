export interface CarpetDesignMapping {
  sourceClusterId: string;
  sourceColorHex: string;
  sourceColorPercentage: number;
  targetYarnId: string;
  targetYarnCode: string;
  targetYarnNameTr: string;
  targetYarnNameEn: string;
  targetYarnHex: string;
}

export interface CarpetDesignSessionData {
  id?: string; // UUID from DB
  productSlug: string;
  productTitle: string;
  productUrl: string;
  originalImageUrl: string;
  mappings: CarpetDesignMapping[];
  previewImageDataUrl?: string | null;
  customerNote?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  requestedSize?: string;
  requestedQuantity?: string;
  status?: "draft" | "shared" | "quote_requested" | "ordered";
  createdAt?: string;
  updatedAt?: string;
}

export interface QuoteRequestFormData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  city?: string;
  district?: string;
  requestedSize?: string;
  requestedQuantity?: string;
  customerNote?: string;
  contactPreference: "whatsapp" | "phone" | "email";
}

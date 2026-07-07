import { CarpetDesignSessionData } from "@/types/carpetDesign";

const STORAGE_KEY_PREFIX = "carpet-design-session-";

export function saveDesignToLocal(productSlug: string, data: CarpetDesignSessionData): void {
  if (typeof window === "undefined") return;
  try {
    const key = `${STORAGE_KEY_PREFIX}${productSlug}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving design to localStorage", error);
  }
}

export function loadDesignFromLocal(productSlug: string): CarpetDesignSessionData | null {
  if (typeof window === "undefined") return null;
  try {
    const key = `${STORAGE_KEY_PREFIX}${productSlug}`;
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data) as CarpetDesignSessionData;
    }
  } catch (error) {
    console.error("Error loading design from localStorage", error);
  }
  return null;
}

export function clearDesignFromLocal(productSlug: string): void {
  if (typeof window === "undefined") return;
  const key = `${STORAGE_KEY_PREFIX}${productSlug}`;
  localStorage.removeItem(key);
}

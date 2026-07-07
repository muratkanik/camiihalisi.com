import { CarpetDesignSessionData } from "@/types/carpetDesign";

export function downloadDesignJSON(design: CarpetDesignSessionData) {
  const exportData = {
    product: {
      title: design.productTitle,
      slug: design.productSlug,
      url: design.productUrl,
      image: design.originalImageUrl,
    },
    createdAt: new Date().toISOString(),
    mappings: design.mappings.map(m => ({
      sourceClusterId: m.sourceClusterId,
      sourceColorHex: m.sourceColorHex,
      sourceColorPercentage: m.sourceColorPercentage,
      targetYarnId: m.targetYarnId,
      targetYarnCode: m.targetYarnCode,
      targetYarnNameTr: m.targetYarnNameTr,
      targetYarnNameEn: m.targetYarnNameEn,
      targetYarnHex: m.targetYarnHex,
    }))
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
  const downloadAnchorNode = document.createElement("a");
  const dateStr = new Date().toISOString().split("T")[0];
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", `cami-halisi-${design.productSlug}-renk-tasarimi-${dateStr}.json`);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

export function downloadCanvasPNG(canvas: HTMLCanvasElement, productSlug: string) {
  const link = document.createElement("a");
  link.download = `cami-halisi-${productSlug}-ozel-renk-tasarim.png`;
  link.href = canvas.toDataURL("image/png");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

"use client";

import { Download, ImagePlus, X } from "lucide-react";

interface PrintActionsProps {
  hasLogo: boolean;
  isDownloading: boolean;
  onUploadLogo: (file: File) => void;
  onRemoveLogo: () => void;
  onPreviewPrint: () => void;
  onDownloadPdf: () => void;
}

export function PrintActions({
  hasLogo,
  isDownloading,
  onUploadLogo,
  onRemoveLogo,
  onPreviewPrint,
  onDownloadPdf
}: PrintActionsProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-end gap-3 print:hidden">
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
        <ImagePlus className="h-4 w-4" />
        Upload Logo
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              onUploadLogo(file);
            }
            event.currentTarget.value = "";
          }}
        />
      </label>

      {hasLogo && (
        <button
          type="button"
          onClick={onRemoveLogo}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <X className="h-4 w-4" />
          Remove Logo
        </button>
      )}

      <button
        type="button"
        onClick={onPreviewPrint}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Preview Print
      </button>

      <button
        type="button"
        onClick={onDownloadPdf}
        disabled={isDownloading}
        className="inline-flex items-center gap-2 rounded-lg bg-invoice-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Download className="h-4 w-4" />
        {isDownloading ? "Generating PDF..." : "Download PDF"}
      </button>
    </div>
  );
}

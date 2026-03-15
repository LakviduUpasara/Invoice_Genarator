"use client";

import { Download, ImagePlus, Printer, X } from "lucide-react";

interface PrintActionsProps {
  hasLogo: boolean;
  onUploadLogo: (file: File) => void;
  onRemoveLogo: () => void;
}

export function PrintActions({ hasLogo, onUploadLogo, onRemoveLogo }: PrintActionsProps) {
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
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 rounded-lg bg-invoice-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
      >
        <Printer className="h-4 w-4" />
        Print
      </button>

      <button
        type="button"
        onClick={() => window.alert("Download PDF feature will be available soon.")}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        <Download className="h-4 w-4" />
        Download PDF
      </button>
    </div>
  );
}

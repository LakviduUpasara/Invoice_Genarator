"use client";

import { Building2 } from "lucide-react";
import type { CompanyInfo, InvoiceMeta } from "@/types/invoice";

interface InvoiceHeaderProps {
  company: CompanyInfo;
  meta: InvoiceMeta;
  logoUrl: string | null;
  onCompanyChange: (field: keyof CompanyInfo, value: string) => void;
  onMetaChange: (field: keyof InvoiceMeta, value: string) => void;
}

function getInitials(companyName: string) {
  const words = companyName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (words.length === 0) {
    return "YC";
  }

  return words.map((word) => word[0]?.toUpperCase() ?? "").join("");
}

export function InvoiceHeader({
  company,
  meta,
  logoUrl,
  onCompanyChange,
  onMetaChange
}: InvoiceHeaderProps) {
  const initials = getInitials(company.name);

  return (
    <header className="invoice-section grid gap-7 border-b border-slate-200 pb-7 md:grid-cols-2 print:grid-cols-2 print:gap-6 print:pb-4">
      <div className="space-y-3 print:space-y-2">
        <div className="w-full max-w-[340px] p-0">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt="Company logo"
              className="block w-full h-auto object-contain object-left"
            />
          ) : (
            <div className="flex min-h-[70px] w-full items-center justify-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-invoice-primary text-sm font-extrabold text-white">
                {initials}
              </div>
              <Building2 className="h-5 w-5 text-slate-300" />
            </div>
          )}
        </div>

        <div className="space-y-2.5 print:space-y-1.5">
          <div>
            <label className="invoice-label print:hidden">Company Name</label>
            <input
              value={company.name}
              onChange={(event) => onCompanyChange("name", event.target.value)}
              className="invoice-input print:hidden"
              aria-label="Company Name"
            />
            <p className="hidden px-3 py-2 text-sm font-semibold text-slate-900 print:block">
              {company.name}
            </p>
          </div>

          <div>
            <label className="invoice-label print:hidden">Address</label>
            <textarea
              value={company.address}
              onChange={(event) => onCompanyChange("address", event.target.value)}
              className="invoice-textarea print:hidden"
              aria-label="Company Address"
              placeholder={"No 123, Main Street, Colombo, Sri Lanka\n0771234567\ncompany@email.com"}
            />
            <p className="hidden whitespace-pre-line px-3 py-2 text-sm text-slate-700 print:block">
              {company.address}
            </p>
          </div>
        </div>
      </div>

      <div className="md:justify-self-end md:text-right print:text-right">
        <h1 className="text-4xl font-extrabold tracking-tight text-invoice-primary">INVOICE</h1>
        <div className="mt-5 space-y-3.5 print:space-y-2">
          <div>
            <label className="invoice-label md:text-right">Invoice No</label>
            <input
              value={meta.invoiceNumber}
              onChange={(event) => onMetaChange("invoiceNumber", event.target.value)}
              className="invoice-input md:text-right print:hidden"
              aria-label="Invoice Number"
            />
            <span className="hidden text-sm font-semibold text-slate-800 print:inline">
              {meta.invoiceNumber}
            </span>
          </div>

          <div>
            <label className="invoice-label md:text-right">Invoice Date</label>
            <input
              type="date"
              value={meta.invoiceDate}
              onChange={(event) => onMetaChange("invoiceDate", event.target.value)}
              className="invoice-input md:text-right print:hidden"
              aria-label="Invoice Date"
            />
            <span className="hidden text-sm font-semibold text-slate-800 print:inline">
              {meta.invoiceDate}
            </span>
          </div>

          <div>
            <label className="invoice-label md:text-right">Due Date</label>
            <input
              type="date"
              value={meta.dueDate}
              onChange={(event) => onMetaChange("dueDate", event.target.value)}
              className="invoice-input md:text-right print:hidden"
              aria-label="Due Date"
            />
            <span className="hidden text-sm font-semibold text-slate-800 print:inline">
              {meta.dueDate}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

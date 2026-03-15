"use client";

import { Building2, Mail, Phone } from "lucide-react";
import Image from "next/image";
import type { CompanyInfo, InvoiceMeta } from "@/types/invoice";

interface InvoiceHeaderProps {
  company: CompanyInfo;
  meta: InvoiceMeta;
  logoUrl?: string | null;
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
    <header className="invoice-section grid grid-cols-1 gap-8 border-b border-slate-200 pb-8 md:grid-cols-2 print:grid-cols-2 print:gap-10">
      <div className="space-y-4 print:pr-4">
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white text-invoice-primary shadow-sm print:border-slate-300 print:shadow-none">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Company logo"
                fill
                unoptimized
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <span className="text-sm font-extrabold tracking-wide">{initials}</span>
            )}

            {!logoUrl && (
              <Building2 className="pointer-events-none absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-white text-slate-300 print:hidden" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <input
              value={company.name}
              onChange={(event) => onCompanyChange("name", event.target.value)}
              className="w-full rounded-md border border-transparent bg-transparent px-2 py-1 text-2xl font-extrabold text-slate-900 outline-none transition focus:border-blue-200 focus:bg-slate-50 print:hidden"
              aria-label="Company Name"
            />
            <p className="hidden px-2 py-1 text-2xl font-extrabold text-slate-900 print:block">
              {company.name}
            </p>
          </div>
        </div>

        <div className="space-y-3 print:space-y-2">
          <div>
            <label className="invoice-label">Address</label>
            <textarea
              value={company.address}
              onChange={(event) => onCompanyChange("address", event.target.value)}
              className="invoice-textarea print:hidden"
              aria-label="Company Address"
            />
            <p className="hidden whitespace-pre-line px-3 py-2 text-sm text-slate-700 print:block">
              {company.address}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-slate-400" />
            <input
              value={company.phone}
              onChange={(event) => onCompanyChange("phone", event.target.value)}
              className="invoice-input print:hidden"
              aria-label="Company Phone"
            />
            <span className="hidden text-sm text-slate-700 print:inline">{company.phone}</span>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-slate-400" />
            <input
              value={company.email}
              onChange={(event) => onCompanyChange("email", event.target.value)}
              className="invoice-input print:hidden"
              aria-label="Company Email"
            />
            <span className="hidden text-sm text-slate-700 print:inline">{company.email}</span>
          </div>
        </div>
      </div>

      <div className="md:justify-self-end md:text-right print:text-right">
        <h1 className="text-4xl font-extrabold tracking-tight text-invoice-primary">INVOICE</h1>
        <div className="mt-6 space-y-4 print:space-y-3">
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

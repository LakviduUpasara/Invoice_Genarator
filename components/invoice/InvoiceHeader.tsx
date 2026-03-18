"use client";

import { Building2 } from "lucide-react";
import type { CompanyInfo, CustomerInfo, InvoiceMeta } from "@/types/invoice";

type PaymentStatus = "Paid" | "Unpaid" | "Partial" | "Overdue";

interface InvoiceHeaderProps {
  company: CompanyInfo;
  customer: CustomerInfo;
  meta: InvoiceMeta;
  balanceDue: number;
  paymentStatus: PaymentStatus;
  logoUrl: string | null;
  onCompanyChange: (field: keyof CompanyInfo, value: string) => void;
  onCustomerChange: (field: keyof CustomerInfo, value: string) => void;
  onMetaChange: (field: keyof InvoiceMeta, value: string) => void;
  onPaymentStatusChange: (status: PaymentStatus) => void;
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

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

const paymentStatusStyles: Record<PaymentStatus, string> = {
  Paid: "border-emerald-200 bg-emerald-100 text-emerald-700",
  Unpaid: "border-slate-200 bg-slate-100 text-slate-700",
  Partial: "border-amber-200 bg-amber-100 text-amber-700",
  Overdue: "border-red-200 bg-red-100 text-red-700"
};

export function InvoiceHeader({
  company,
  customer,
  meta,
  balanceDue,
  paymentStatus,
  logoUrl,
  onCompanyChange,
  onCustomerChange,
  onMetaChange,
  onPaymentStatusChange
}: InvoiceHeaderProps) {
  const initials = getInitials(company.name);

  return (
    <header className="invoice-section grid gap-7 border-b border-slate-200 pb-7 md:grid-cols-2 print:grid-cols-2 print:gap-5 print:pb-3">
      <div className="space-y-3 print:space-y-2">
        <div className="w-full max-w-[200px] p-0">
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

        <div className="mt-2 space-y-2 print:mt-1.5 print:space-y-1.5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-invoice-primary">Invoice To</h2>

          <div>
            <label className="invoice-label print:hidden">Customer Name</label>
            <input
              value={customer.name}
              onChange={(event) => onCustomerChange("name", event.target.value)}
              className="invoice-input print:hidden"
              aria-label="Customer Name"
            />
            <p className="hidden px-3 py-2 text-sm font-semibold text-slate-900 print:block">
              {customer.name}
            </p>
          </div>

          <div>
            <label className="invoice-label print:hidden">Address</label>
            <textarea
              value={customer.address}
              onChange={(event) => onCustomerChange("address", event.target.value)}
              className="invoice-textarea print:hidden"
              aria-label="Customer Address"
              placeholder={"No 123, Main Street, Colombo, Sri Lanka\n0771234567\ncompany@email.com"}
            />
            <p className="hidden whitespace-pre-line px-3 py-2 text-sm text-slate-700 print:block">
              {customer.address}
            </p>
          </div>
        </div>
      </div>

      <div className="md:justify-self-end md:text-right print:text-right">
        <h1 className="text-4xl font-extrabold tracking-tight text-invoice-primary">INVOICE</h1>
        <div className="mt-5 space-y-3.5 print:space-y-1.5">
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

          <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-left md:text-right print:py-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Balance Due</p>
            <p className="text-lg font-extrabold text-blue-700">{formatCurrency(balanceDue)}</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left md:text-right print:py-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Payment Status</p>
            <div className="mt-1 flex items-center gap-2 md:justify-end">
              <select
                value={paymentStatus}
                onChange={(event) => onPaymentStatusChange(event.target.value as PaymentStatus)}
                className="invoice-input max-w-[140px] py-1.5 print:hidden"
                aria-label="Payment Status"
              >
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Partial">Partial</option>
                <option value="Overdue">Overdue</option>
              </select>
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${paymentStatusStyles[paymentStatus]}`}
              >
                {paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

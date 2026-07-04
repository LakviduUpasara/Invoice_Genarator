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
    <header className="invoice-section -mx-5 -mt-5 overflow-hidden rounded-t-2xl border-b border-[#ead39b] sm:-mx-8 sm:-mt-8 md:-mx-10 md:-mt-10 print:mx-0 print:mt-0 print:rounded-none">
      <div className="grid border-b-[5px] border-invoice-gold md:grid-cols-[1fr_250px] print:grid-cols-[1fr_58mm]">
        <div className="flex items-center gap-5 bg-invoice-primary px-6 py-6 text-white sm:px-10 print:px-5 print:py-4">
          <div className="h-[88px] w-[88px] flex-shrink-0 print:h-[62px] print:w-[62px]">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt="Company logo"
                className="h-full w-full object-contain drop-shadow-lg"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl font-black text-invoice-goldLight">
                {initials || <Building2 className="h-6 w-6" />}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <label className="invoice-label text-white/65 print:hidden">Company Name</label>
            <input
              value={company.name}
              onChange={(event) => onCompanyChange("name", event.target.value)}
              className="invoice-input border-white/20 bg-white/10 text-2xl font-black uppercase text-invoice-goldLight placeholder:text-white/40 focus:border-invoice-gold print:hidden"
              aria-label="Company Name"
            />
            <p className="hidden text-[26px] font-black uppercase leading-none tracking-normal text-invoice-goldLight print:block">
              {company.name}
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.32em] text-white print:tracking-[0.2em]">
              Business Invoice
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#9a6b13] via-invoice-gold to-invoice-goldLight px-5 py-5 text-center text-invoice-primary print:py-3">
          <span className="text-sm font-bold">BALANCE DUE</span>
          <strong className="mt-1 text-2xl font-black leading-tight print:text-xl">
            {formatCurrency(balanceDue)}
          </strong>
          <span
            className={`mt-2 inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${paymentStatusStyles[paymentStatus]}`}
          >
            {paymentStatus}
          </span>
        </div>
      </div>

      <div className="grid gap-4 bg-invoice-goldSoft px-6 py-4 text-sm sm:grid-cols-2 sm:px-10 print:grid-cols-2 print:px-5 print:py-3 print:text-xs">
        <div>
          <strong className="mb-1 block text-xs font-black uppercase tracking-wide text-invoice-primary">
            From
          </strong>
          <label className="invoice-label print:hidden">Company Address</label>
          <textarea
            value={company.address}
            onChange={(event) => onCompanyChange("address", event.target.value)}
            className="invoice-textarea min-h-[74px] print:hidden"
            aria-label="Company Address"
          />
          <p className="hidden whitespace-pre-line leading-snug text-slate-700 print:block">
            {company.address}
          </p>
          <div className="grid gap-2 sm:grid-cols-2 print:hidden">
            <input
              value={company.phone}
              onChange={(event) => onCompanyChange("phone", event.target.value)}
              className="invoice-input"
              aria-label="Company Phone"
              placeholder="Phone"
            />
            <input
              value={company.email}
              onChange={(event) => onCompanyChange("email", event.target.value)}
              className="invoice-input"
              aria-label="Company Email"
              placeholder="Email"
            />
          </div>
          <input
            value={company.website}
            onChange={(event) => onCompanyChange("website", event.target.value)}
            className="invoice-input print:hidden"
            aria-label="Company Website"
            placeholder="Website"
          />
          <p className="hidden leading-snug text-slate-700 print:block">
            {[company.phone, company.email, company.website].filter(Boolean).join(" | ")}
          </p>
        </div>

        <div>
          <strong className="mb-1 block text-xs font-black uppercase tracking-wide text-invoice-primary">
            Bill To
          </strong>
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
            <p className="hidden whitespace-pre-line leading-snug text-slate-700 print:block">
              {customer.address}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 px-6 py-6 sm:grid-cols-[1fr_280px] sm:px-10 print:grid-cols-[1fr_62mm] print:px-5 print:py-4">
        <div>
          <h1 className="text-3xl font-light uppercase tracking-wide text-invoice-primary print:text-2xl">
            Invoice
          </h1>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 print:mt-2 print:grid-cols-2 print:gap-2">
            <div>
              <label className="invoice-label">Invoice No</label>
              <input
                value={meta.invoiceNumber}
                onChange={(event) => onMetaChange("invoiceNumber", event.target.value)}
                className="invoice-input print:hidden"
                aria-label="Invoice Number"
              />
              <span className="hidden text-sm font-semibold text-slate-800 print:inline">
                {meta.invoiceNumber}
              </span>
            </div>
            <div>
              <label className="invoice-label">Terms</label>
              <input
                value={meta.terms}
                onChange={(event) => onMetaChange("terms", event.target.value)}
                className="invoice-input print:hidden"
                aria-label="Invoice Terms"
              />
              <span className="hidden text-sm font-semibold text-slate-800 print:inline">
                {meta.terms}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 print:space-y-1.5">
          <div>
            <label className="invoice-label sm:text-right">Invoice Date</label>
            <input
              type="date"
              value={meta.invoiceDate}
              onChange={(event) => onMetaChange("invoiceDate", event.target.value)}
              className="invoice-input sm:text-right print:hidden"
              aria-label="Invoice Date"
            />
            <span className="hidden text-sm font-semibold text-slate-800 print:inline">
              {meta.invoiceDate}
            </span>
          </div>

          <div>
            <label className="invoice-label sm:text-right">Due Date</label>
            <input
              type="date"
              value={meta.dueDate}
              onChange={(event) => onMetaChange("dueDate", event.target.value)}
              className="invoice-input sm:text-right print:hidden"
              aria-label="Due Date"
            />
            <span className="hidden text-sm font-semibold text-slate-800 print:inline">
              {meta.dueDate}
            </span>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left sm:text-right print:hidden">
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

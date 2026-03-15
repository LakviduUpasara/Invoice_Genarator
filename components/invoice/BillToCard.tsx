"use client";

import type { CustomerInfo } from "@/types/invoice";

interface BillToCardProps {
  customer: CustomerInfo;
  onCustomerChange: (field: keyof CustomerInfo, value: string) => void;
}

export function BillToCard({ customer, onCustomerChange }: BillToCardProps) {
  return (
    <section className="invoice-section rounded-xl border border-slate-200 bg-slate-50 p-5">
      <h2 className="text-sm font-bold uppercase tracking-wide text-invoice-primary">Bill To</h2>

      <div className="mt-4 space-y-3">
        <div>
          <label className="invoice-label">Customer Name</label>
          <input
            value={customer.name}
            onChange={(event) => onCustomerChange("name", event.target.value)}
            className="invoice-input print:hidden"
            aria-label="Customer Name"
          />
          <p className="hidden px-3 py-2 text-sm font-semibold text-slate-800 print:block">
            {customer.name}
          </p>
        </div>

        <div>
          <label className="invoice-label">Customer Address</label>
          <textarea
            value={customer.address}
            onChange={(event) => onCustomerChange("address", event.target.value)}
            className="invoice-textarea print:hidden"
            aria-label="Customer Address"
          />
          <p className="hidden whitespace-pre-line px-3 py-2 text-sm text-slate-700 print:block">
            {customer.address}
          </p>
        </div>
      </div>
    </section>
  );
}

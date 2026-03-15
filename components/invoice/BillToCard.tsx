"use client";

import type { CustomerInfo } from "@/types/invoice";

interface BillToCardProps {
  customer: CustomerInfo;
  onCustomerChange: (field: keyof CustomerInfo, value: string) => void;
}

export function BillToCard({ customer, onCustomerChange }: BillToCardProps) {
  return (
    <section className="invoice-section">
      <h2 className="text-sm font-bold uppercase tracking-wide text-invoice-primary">Invoice To</h2>

      <div className="mt-3 space-y-3 print:mt-2 print:space-y-2">
        <div>
          <label className="invoice-label print:hidden">Customer Name</label>
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
    </section>
  );
}

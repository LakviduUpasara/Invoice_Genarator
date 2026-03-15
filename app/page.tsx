"use client";

import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import { Download, ImagePlus, Printer, X } from "lucide-react";
import { BillToCard } from "@/components/invoice/BillToCard";
import { FooterNote } from "@/components/invoice/FooterNote";
import { InvoiceHeader } from "@/components/invoice/InvoiceHeader";
import { InvoiceTable } from "@/components/invoice/InvoiceTable";
import { PaymentSummaryCard } from "@/components/invoice/PaymentSummaryCard";
import { TotalsCard } from "@/components/invoice/TotalsCard";
import type { CompanyInfo, CustomerInfo, InvoiceItem, InvoiceMeta } from "@/types/invoice";

const initialCompany: CompanyInfo = {
  name: "Your Company Name",
  address: "No 123, Main Street, Colombo, Sri Lanka",
  phone: "0771234567",
  email: "company@email.com"
};

const initialMeta: InvoiceMeta = {
  invoiceNumber: "INV-001",
  invoiceDate: "2026-03-14",
  dueDate: "2026-03-14"
};

const initialCustomer: CustomerInfo = {
  name: "Customer Name",
  address: "Customer address here..."
};

const initialItems: InvoiceItem[] = [
  {
    id: "item-1",
    description: "Sample Service",
    qty: 1,
    price: 1000
  }
];

function createItem(): InvoiceItem {
  return {
    id: typeof crypto !== "undefined" ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    description: "",
    qty: 1,
    price: 0
  };
}

export default function HomePage() {
  const [company, setCompany] = useState<CompanyInfo>(initialCompany);
  const [meta, setMeta] = useState<InvoiceMeta>(initialMeta);
  const [customer, setCustomer] = useState<CustomerInfo>(initialCustomer);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [paymentNote, setPaymentNote] = useState(
    "Please make the payment within the due date. Thank you for choosing our services."
  );
  const [items, setItems] = useState<InvoiceItem[]>(initialItems);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);

  const subtotal = useMemo(
    () => items.reduce((accumulator, item) => accumulator + item.qty * item.price, 0),
    [items]
  );
  const taxAmount = useMemo(() => (subtotal * taxRate) / 100, [subtotal, taxRate]);
  const total = useMemo(
    () => Math.max(0, subtotal + taxAmount - discount),
    [subtotal, taxAmount, discount]
  );

  const handleItemChange = (
    id: string,
    field: keyof Omit<InvoiceItem, "id">,
    value: string | number
  ) => {
    setItems((previous) =>
      previous.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems((previous) => previous.filter((item) => item.id !== id));
  };

  const handleAddItem = () => {
    setItems((previous) => [...previous, createItem()]);
  };

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);

    event.target.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 px-4 py-10 sm:px-6 lg:px-8 print:min-h-0 print:bg-white print:px-0 print:py-0">
      <div className="print-page mx-auto w-full max-w-[210mm] print:max-w-none">
        <div className="mb-4 flex flex-wrap justify-end gap-3 print:hidden">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            <ImagePlus className="h-4 w-4" />
            Upload Logo
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
          </label>

          {logoUrl && (
            <button
              type="button"
              onClick={() => setLogoUrl(null)}
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

        <main className="print-surface rounded-2xl border border-slate-200 bg-white shadow-xl md:min-h-[297mm] print:min-h-0 print:rounded-none print:border-slate-200">
          <div className="h-1 w-full rounded-t-2xl bg-invoice-accent" />
          <div className="space-y-8 p-5 sm:p-8 md:p-10 print:space-y-6 print:p-6">
            <InvoiceHeader
              company={company}
              meta={meta}
              logoUrl={logoUrl}
              onCompanyChange={(field, value) =>
                setCompany((previous) => ({ ...previous, [field]: value }))
              }
              onMetaChange={(field, value) => setMeta((previous) => ({ ...previous, [field]: value }))}
            />

            <section className="invoice-section grid grid-cols-1 gap-5 md:grid-cols-2 print:grid-cols-2">
              <BillToCard
                customer={customer}
                onCustomerChange={(field, value) =>
                  setCustomer((previous) => ({ ...previous, [field]: value }))
                }
              />
              <PaymentSummaryCard note={paymentNote} onChange={setPaymentNote} />
            </section>

            <InvoiceTable
              items={items}
              onItemChange={handleItemChange}
              onDeleteItem={handleDeleteItem}
              onAddItem={handleAddItem}
            />

            <div className="invoice-section flex justify-end print:justify-end">
              <TotalsCard
                subtotal={subtotal}
                taxRate={taxRate}
                taxAmount={taxAmount}
                discount={discount}
                total={total}
                onTaxRateChange={setTaxRate}
                onDiscountChange={setDiscount}
              />
            </div>

            <FooterNote />
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { BillToCard } from "@/components/invoice/BillToCard";
import { FooterNote } from "@/components/invoice/FooterNote";
import { InvoiceHeader } from "@/components/invoice/InvoiceHeader";
import { InvoiceTable } from "@/components/invoice/InvoiceTable";
import { PaymentSummaryCard } from "@/components/invoice/PaymentSummaryCard";
import { PrintActions } from "@/components/invoice/PrintActions";
import { TotalsCard } from "@/components/invoice/TotalsCard";
import type { CompanyInfo, CustomerInfo, InvoiceItem, InvoiceMeta } from "@/types/invoice";

const initialCompany: CompanyInfo = {
  name: "Your Company Name",
  address: "No 123, Main Street, Colombo, Sri Lanka\n0771234567\ncompany@email.com",
  phone: "0771234567",
  email: "company@email.com"
};

const initialMeta: InvoiceMeta = {
  invoiceNumber: "INV-001",
  invoiceDate: "2026-03-14",
  dueDate: "2026-03-14"
};

const initialCustomer: CustomerInfo = {
  name: "Your Customer Name",
  address: "No 123, Main Street, Colombo, Sri Lanka\n0771234567\ncompany@email.com"
};

const initialItems: InvoiceItem[] = [
  {
    id: "item-1",
    description: "Sample Service",
    qty: 1,
    price: 1000
  }
];

function createInvoiceItem(): InvoiceItem {
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

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleItemChange = (
    id: string,
    field: keyof Omit<InvoiceItem, "id">,
    value: string | number
  ) => {
    setItems((previousItems) =>
      previousItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems((previousItems) => previousItems.filter((item) => item.id !== id));
  };

  const handleAddItem = () => {
    setItems((previousItems) => [...previousItems, createInvoiceItem()]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 px-4 py-10 sm:px-6 lg:px-8 print:min-h-0 print:bg-white print:px-0 print:py-0">
      <div className="print-page mx-auto w-full max-w-[210mm] print:max-w-none">
        <PrintActions
          hasLogo={Boolean(logoUrl)}
          onUploadLogo={handleLogoUpload}
          onRemoveLogo={() => setLogoUrl(null)}
        />

        <main className="print-surface rounded-2xl border border-slate-200 bg-white shadow-xl md:min-h-[297mm] print:min-h-0 print:rounded-none">
          <div className="h-1 w-full rounded-t-2xl bg-invoice-accent print:rounded-none" />
          <div className="space-y-7 p-5 sm:p-8 md:p-10 print:space-y-3.5 print:p-4">
            <InvoiceHeader
              company={company}
              meta={meta}
              logoUrl={logoUrl}
              onCompanyChange={(field, value) =>
                setCompany((previousCompany) => ({ ...previousCompany, [field]: value }))
              }
              onMetaChange={(field, value) => setMeta((previousMeta) => ({ ...previousMeta, [field]: value }))}
            />

            <section className="invoice-section space-y-4 print:space-y-3">
              <BillToCard
                customer={customer}
                onCustomerChange={(field, value) =>
                  setCustomer((previousCustomer) => ({ ...previousCustomer, [field]: value }))
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

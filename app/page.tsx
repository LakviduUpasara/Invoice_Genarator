"use client";

import { useMemo, useRef, useState } from "react";
import { FooterNote } from "@/components/invoice/FooterNote";
import { InvoiceHeader } from "@/components/invoice/InvoiceHeader";
import { InvoiceTable } from "@/components/invoice/InvoiceTable";
import { PaymentSummaryCard } from "@/components/invoice/PaymentSummaryCard";
import { PrintActions } from "@/components/invoice/PrintActions";
import { TotalsCard } from "@/components/invoice/TotalsCard";
import type { CompanyInfo, CustomerInfo, InvoiceItem, InvoiceMeta } from "@/types/invoice";

type PaymentStatus = "Paid" | "Unpaid" | "Partial" | "Overdue";
type DiscountType = "amount" | "percent";

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
  const invoiceRef = useRef<HTMLElement>(null);
  const [company, setCompany] = useState<CompanyInfo>(initialCompany);
  const [meta, setMeta] = useState<InvoiceMeta>(initialMeta);
  const [customer, setCustomer] = useState<CustomerInfo>(initialCustomer);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [paymentNote, setPaymentNote] = useState(
    "Please make the payment within the due date. Thank you for choosing our services."
  );
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("Unpaid");
  const [accountDetails, setAccountDetails] = useState(
    "Bank: ABC Bank\nAccount Name: Your Company Name\nAccount Number: 1234567890"
  );
  const [items, setItems] = useState<InvoiceItem[]>(initialItems);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [discountType, setDiscountType] = useState<DiscountType>("amount");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const subtotal = useMemo(
    () => items.reduce((accumulator, item) => accumulator + item.qty * item.price, 0),
    [items]
  );
  const taxAmount = useMemo(() => (subtotal * taxRate) / 100, [subtotal, taxRate]);
  const discountAmount = useMemo(() => {
    if (discountType === "percent") {
      const safePercent = Math.max(0, Math.min(100, discountValue));
      return ((subtotal + taxAmount) * safePercent) / 100;
    }
    return Math.max(0, discountValue);
  }, [discountType, discountValue, subtotal, taxAmount]);
  const total = useMemo(
    () => Math.max(0, subtotal + taxAmount - discountAmount),
    [subtotal, taxAmount, discountAmount]
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

  const handleDownloadPdf = async () => {
    if (!invoiceRef.current || isDownloading) {
      return;
    }

    setIsDownloading(true);
    try {
      const headStyles = Array.from(
        document.head.querySelectorAll("style, link[rel='stylesheet']")
      )
        .map((node) => node.outerHTML)
        .join("");

      const invoiceHtml = `
        <div class="print-page mx-auto w-full max-w-[210mm] print:max-w-none">
          ${invoiceRef.current.outerHTML}
        </div>
      `;

      const response = await fetch("/api/invoice-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          invoiceHtml,
          headStyles,
          origin: window.location.origin,
          fileName: meta.invoiceNumber || "invoice"
        })
      });

      if (!response.ok) {
        throw new Error("PDF generation request failed.");
      }

      const pdfBlob = await response.blob();
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = `${meta.invoiceNumber || "invoice"}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch {
      window.alert("PDF generation failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 px-4 py-10 sm:px-6 lg:px-8 print:min-h-0 print:bg-white print:px-0 print:py-0">
      <div data-invoice-page="true" className="print-page mx-auto w-full max-w-[210mm] print:max-w-none">
        <PrintActions
          hasLogo={Boolean(logoUrl)}
          isDownloading={isDownloading}
          onUploadLogo={handleLogoUpload}
          onRemoveLogo={() => setLogoUrl(null)}
          onPreviewPrint={() => window.print()}
          onDownloadPdf={handleDownloadPdf}
        />

        <main
          ref={invoiceRef}
          data-invoice-root="true"
          className="print-surface rounded-2xl bg-white shadow-xl md:min-h-[297mm] print:min-h-0 print:rounded-none"
        >
          <div className="h-1 w-full rounded-t-2xl bg-invoice-accent print:rounded-none" />
          <div className="space-y-7 p-5 sm:p-8 md:p-10 print:space-y-3 print:p-3">
            <InvoiceHeader
              company={company}
              customer={customer}
              meta={meta}
              balanceDue={total}
              paymentStatus={paymentStatus}
              logoUrl={logoUrl}
              onCompanyChange={(field, value) =>
                setCompany((previousCompany) => ({ ...previousCompany, [field]: value }))
              }
              onCustomerChange={(field, value) =>
                setCustomer((previousCustomer) => ({ ...previousCustomer, [field]: value }))
              }
              onMetaChange={(field, value) => setMeta((previousMeta) => ({ ...previousMeta, [field]: value }))}
              onPaymentStatusChange={setPaymentStatus}
            />

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
                discountType={discountType}
                discountValue={discountValue}
                discountAmount={discountAmount}
                total={total}
                onTaxRateChange={setTaxRate}
                onDiscountTypeChange={setDiscountType}
                onDiscountValueChange={setDiscountValue}
              />
            </div>

            <PaymentSummaryCard
              note={paymentNote}
              onChange={setPaymentNote}
              accountDetails={accountDetails}
              onAccountDetailsChange={setAccountDetails}
            />

            <FooterNote />
            <p className="invoice-section mt-3 text-center text-xs text-slate-500 print:mt-2 print:text-[10px]">
              This is a system-generated invoice and does not require a signature.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

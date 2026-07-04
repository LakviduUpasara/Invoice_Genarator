export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

export interface InvoiceMeta {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  terms: string;
  warrantyPeriod: string;
  supportPeriod: string;
}

export interface CustomerInfo {
  name: string;
  address: string;
  phone?: string;
  email?: string;
}

export interface InvoiceItem {
  id: string;
  title?: string;
  description: string;
  note?: string;
  qty: number;
  price: number;
  discountType?: "amount" | "percent";
  discountValue?: number;
  sourceType?: "service" | "product";
}

export type InstallmentStatus = "paid" | "pending";

export interface InstallmentPayment {
  id: string;
  label: string;
  date: string;
  status: InstallmentStatus;
  method: string;
  amount: number;
  note: string;
}

export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface InvoiceMeta {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
}

export interface CustomerInfo {
  name: string;
  address: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  price: number;
}

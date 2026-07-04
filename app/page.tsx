"use client";

import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import {
  Ban,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardList,
  Download,
  FileCheck2,
  FileClock,
  FileText,
  FolderOpen,
  ImagePlus,
  Maximize2,
  Minimize2,
  PackagePlus,
  Plus,
  ReceiptText,
  Save,
  Settings,
  ShoppingCart,
  Trash2,
  UserRoundPlus,
  Users
} from "lucide-react";
import type {
  CompanyInfo,
  CustomerInfo,
  InstallmentPayment,
  InvoiceItem,
  InvoiceMeta
} from "@/types/invoice";

type ActiveSection = "billing" | "quotation" | "business" | "clients" | "services" | "products" | "bills" | "settings";
type DocumentMode = "billing" | "quotation";
type BillState = "draft" | "running" | "completed" | "cancelled";
type DiscountType = "amount" | "percent";

interface CatalogItem {
  id: string;
  type: "service" | "product";
  title: string;
  description: string;
  price: number;
}

interface SavedBill {
  id: string;
  mode: DocumentMode;
  state: BillState;
  number: string;
  customerName: string;
  total: number;
  savedAt: string;
  snapshot: BillSnapshot;
}

interface BillingTheme {
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontScale: string;
}

interface BillSnapshot {
  company: CompanyInfo;
  customer: CustomerInfo;
  meta: InvoiceMeta;
  items: InvoiceItem[];
  installments: InstallmentPayment[];
  paymentNote: string;
  notes: string;
  taxRate: number;
  invoiceDiscountType: DiscountType;
  invoiceDiscountValue: number;
  logoUrl: string | null;
  theme: BillingTheme;
}

const storageKeys = {
  business: "futureys-business",
  clients: "futureys-clients",
  services: "futureys-services",
  products: "futureys-products",
  bills: "futureys-bills",
  template: "futureys-bill-template",
  logo: "futureys-logo",
  posLayout: "futureys-pos-layout",
  theme: "futureys-billing-theme"
};

const initialTheme: BillingTheme = {
  primaryColor: "#071d3d",
  accentColor: "#d8aa3d",
  fontFamily: 'Roboto, "Segoe UI", Arial, Helvetica, sans-serif',
  fontScale: "80%"
};

const fontOptions = [
  { label: "Roboto", value: 'Roboto, "Segoe UI", Arial, Helvetica, sans-serif' },
  { label: "Segoe UI", value: '"Segoe UI", Arial, Helvetica, sans-serif' },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Times New Roman", value: '"Times New Roman", Times, serif' },
  { label: "Georgia", value: "Georgia, serif" }
];

const initialCompany: CompanyInfo = {
  name: "Futureys Private Limited",
  address: "No 161, New Kandy Road, Malabe\nSri Lanka",
  phone: "076 096 6010 / 076 500 3429",
  email: "info@futureys.com",
  website: "www.futureys.com"
};

const initialMeta: InvoiceMeta = {
  invoiceNumber: "INV-010152245",
  invoiceDate: "2026-07-03",
  dueDate: "2026-08-02",
  terms: "Installment",
  warrantyPeriod: "1 Year",
  supportPeriod: "1 Year bug-fix support"
};

const initialClients: CustomerInfo[] = [
  {
    name: "Dinesha Pharmacy",
    address: "Dinesha Pharmacy\nMalabe, Sri Lanka",
    phone: "",
    email: ""
  },
  {
    name: "Susurrus Holdings (Pvt) Ltd",
    address: "No 123, Main Street, Colombo, Sri Lanka",
    phone: "",
    email: ""
  }
];

const initialCatalog: CatalogItem[] = [
  {
    id: "srv-1",
    type: "service",
    title: "POS & Business Management System",
    description: "Selected agreed features + 3 terminals",
    price: 80000
  },
  {
    id: "srv-2",
    type: "service",
    title: "Installation & Staff Training",
    description: "System setup, testing and user handover",
    price: 15000
  },
  {
    id: "prd-1",
    type: "product",
    title: "Turbogear Desktop Barcode Scanner",
    description: "YH-620 / TB-5601D",
    price: 10500
  },
  {
    id: "prd-2",
    type: "product",
    title: "3 Inch Thermal Receipt Printer",
    description: "XP-80T / USB + LAN",
    price: 13500
  },
  {
    id: "prd-3",
    type: "product",
    title: "Full Set PC",
    description: "i3 2nd Gen / 8GB RAM / 128GB SSD / 19 inch LED Monitor / Keyboard & Mouse",
    price: 36000
  },
  {
    id: "prd-4",
    type: "product",
    title: "Heavy Duty Cash Drawer",
    description: "5 Notes / 8 Coins",
    price: 10500
  }
];

const initialItems: InvoiceItem[] = [
  {
    id: "item-1",
    title: "POS & Business Management System",
    description: "Selected agreed features + 3 terminals",
    note: "Core software service",
    qty: 1,
    price: 80000,
    discountType: "amount",
    discountValue: 60000,
    sourceType: "service"
  },
  {
    id: "item-2",
    title: "Turbogear Desktop Barcode Scanner",
    description: "YH-620 / TB-5601D",
    note: "",
    qty: 1,
    price: 10500,
    discountType: "amount",
    discountValue: 0,
    sourceType: "product"
  },
  {
    id: "item-3",
    title: "3 Inch Thermal Receipt Printer",
    description: "XP-80T / USB + LAN",
    note: "",
    qty: 1,
    price: 13500,
    discountType: "amount",
    discountValue: 500,
    sourceType: "product"
  },
  {
    id: "item-4",
    title: "Full Set PC",
    description: "i3 2nd Gen / 8GB RAM / 128GB SSD / 19 inch LED Monitor / Keyboard & Mouse",
    note: "",
    qty: 1,
    price: 36000,
    discountType: "amount",
    discountValue: 0,
    sourceType: "product"
  },
  {
    id: "item-5",
    title: "Heavy Duty Cash Drawer",
    description: "5 Notes / 8 Coins",
    note: "",
    qty: 1,
    price: 10500,
    discountType: "amount",
    discountValue: 0,
    sourceType: "product"
  }
];

const initialInstallments: InstallmentPayment[] = [
  {
    id: "ins-1",
    label: "1st Installment",
    date: "2026-07-04",
    status: "pending",
    method: "Bank Transfer",
    amount: 80000,
    note: ""
  },
  {
    id: "ins-2",
    label: "2nd Installment",
    date: "",
    status: "pending",
    method: "Bank Transfer",
    amount: 10000,
    note: ""
  },
  {
    id: "ins-3",
    label: "3rd Installment",
    date: "",
    status: "pending",
    method: "Bank Transfer",
    amount: 0,
    note: ""
  }
];

function uid(prefix: string) {
  return `${prefix}-${typeof crypto !== "undefined" ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`}`;
}

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

function formatCurrency(value: number) {
  return `LKR ${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function parseNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function lineDiscount(item: InvoiceItem) {
  const gross = item.qty * item.price;
  const value = item.discountValue ?? 0;
  if ((item.discountType ?? "amount") === "percent") {
    return Math.min(gross, (gross * Math.max(0, Math.min(100, value))) / 100);
  }
  return Math.min(gross, Math.max(0, value));
}

function lineTotal(item: InvoiceItem) {
  return Math.max(0, item.qty * item.price - lineDiscount(item));
}

export default function HomePage() {
  const previewRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<ActiveSection>("billing");
  const [mode, setMode] = useState<DocumentMode>("billing");
  const [company, setCompany] = useState<CompanyInfo>(initialCompany);
  const [clients, setClients] = useState<CustomerInfo[]>(initialClients);
  const [customer, setCustomer] = useState<CustomerInfo>(initialClients[0]);
  const [services, setServices] = useState<CatalogItem[]>(initialCatalog.filter((item) => item.type === "service"));
  const [products, setProducts] = useState<CatalogItem[]>(initialCatalog.filter((item) => item.type === "product"));
  const [bills, setBills] = useState<SavedBill[]>([]);
  const [meta, setMeta] = useState<InvoiceMeta>(initialMeta);
  const [items, setItems] = useState<InvoiceItem[]>(initialItems);
  const [installments, setInstallments] = useState<InstallmentPayment[]>(initialInstallments);
  const [taxRate, setTaxRate] = useState(0);
  const [invoiceDiscountType, setInvoiceDiscountType] = useState<DiscountType>("amount");
  const [invoiceDiscountValue, setInvoiceDiscountValue] = useState(0);
  const [paymentNote, setPaymentNote] = useState(
    "This payment covers the POS & Business Management System with agreed features and 3 terminals. Free support is limited to bug fixes for existing features for 1 year only. New features, future updates, custom changes, and additional development are not included. Support after 1 year will be charged separately."
  );
  const [notes, setNotes] = useState("* All payments are non-refundable.");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [theme, setTheme] = useState<BillingTheme>(initialTheme);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [billFilter, setBillFilter] = useState<BillState | "all">("all");
  const [templateSavedAt, setTemplateSavedAt] = useState<string | null>(null);
  const [catalogFilter, setCatalogFilter] = useState<"all" | "service" | "product">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [productPanelWidth, setProductPanelWidth] = useState(62);
  const [cartPanelWidth, setCartPanelWidth] = useState(38);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setCompany(readStorage(storageKeys.business, initialCompany));
    setClients(readStorage(storageKeys.clients, initialClients));
    setServices(readStorage(storageKeys.services, initialCatalog.filter((item) => item.type === "service")));
    setProducts(readStorage(storageKeys.products, initialCatalog.filter((item) => item.type === "product")));
    setBills(readStorage(storageKeys.bills, []));
    setLogoUrl(readStorage<string | null>(storageKeys.logo, null));
    setTheme(readStorage(storageKeys.theme, initialTheme));
    const savedLayout = readStorage(storageKeys.posLayout, { productPanelWidth: 62, cartPanelWidth: 38 });
    setProductPanelWidth(savedLayout.productPanelWidth);
    setCartPanelWidth(savedLayout.cartPanelWidth);
  }, []);

  useEffect(() => writeStorage(storageKeys.business, company), [company]);
  useEffect(() => writeStorage(storageKeys.clients, clients), [clients]);
  useEffect(() => writeStorage(storageKeys.services, services), [services]);
  useEffect(() => writeStorage(storageKeys.products, products), [products]);
  useEffect(() => writeStorage(storageKeys.bills, bills), [bills]);
  useEffect(() => writeStorage(storageKeys.logo, logoUrl), [logoUrl]);
  useEffect(() => writeStorage(storageKeys.theme, theme), [theme]);
  useEffect(
    () => writeStorage(storageKeys.posLayout, { productPanelWidth, cartPanelWidth }),
    [productPanelWidth, cartPanelWidth]
  );
  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.qty * item.price, 0), [items]);
  const lineDiscountTotal = useMemo(() => items.reduce((sum, item) => sum + lineDiscount(item), 0), [items]);
  const afterLineDiscounts = Math.max(0, subtotal - lineDiscountTotal);
  const invoiceDiscountAmount = useMemo(() => {
    if (invoiceDiscountType === "percent") {
      return (afterLineDiscounts * Math.max(0, Math.min(100, invoiceDiscountValue))) / 100;
    }
    return Math.max(0, invoiceDiscountValue);
  }, [afterLineDiscounts, invoiceDiscountType, invoiceDiscountValue]);
  const taxAmount = useMemo(
    () => ((afterLineDiscounts - invoiceDiscountAmount) * taxRate) / 100,
    [afterLineDiscounts, invoiceDiscountAmount, taxRate]
  );
  const total = useMemo(
    () => Math.max(0, afterLineDiscounts - invoiceDiscountAmount + taxAmount),
    [afterLineDiscounts, invoiceDiscountAmount, taxAmount]
  );
  const paidAmount = useMemo(
    () =>
      installments
        .filter((installment) => installment.status === "paid")
        .reduce((sum, installment) => sum + installment.amount, 0),
    [installments]
  );
  const pendingAmount = useMemo(
    () =>
      installments
        .filter((installment) => installment.status === "pending")
        .reduce((sum, installment) => sum + installment.amount, 0),
    [installments]
  );
  const balanceDue = Math.max(0, total - paidAmount);

  const currentSnapshot: BillSnapshot = {
    company,
    customer,
    meta,
    items,
    installments,
    paymentNote,
    notes,
    taxRate,
    invoiceDiscountType,
    invoiceDiscountValue,
    logoUrl,
    theme
  };

  const addCatalogToBill = (catalogItem: CatalogItem) => {
    setItems((previousItems) => [
      ...previousItems,
      {
        id: uid("item"),
        title: catalogItem.title,
        description: catalogItem.description,
        note: "",
        qty: 1,
        price: catalogItem.price,
        discountType: "amount",
        discountValue: 0,
        sourceType: catalogItem.type
      }
    ]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems((previousItems) =>
      previousItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const saveBill = (state: BillState, openManagement = true) => {
    const saved: SavedBill = {
      id: uid("bill"),
      mode,
      state,
      number: meta.invoiceNumber,
      customerName: customer.name,
      total,
      savedAt: new Date().toISOString(),
      snapshot: currentSnapshot
    };
    setBills((previousBills) => [saved, ...previousBills]);
    if (openManagement) {
      setActiveSection("bills");
    }
    return saved;
  };

  const processBill = () => {
    setShowPaymentModal(true);
  };

  const confirmProcessBill = () => {
    const processState: BillState =
      mode === "quotation" ? "draft" : installments.some((installment) => installment.status === "pending") ? "running" : "draft";
    saveBill(processState, false);
    setShowPaymentModal(false);
    setShowDocumentModal(true);
    setBillFilter(processState);
  };

  const saveCurrentTemplate = () => {
    writeStorage(storageKeys.template, currentSnapshot);
    setTemplateSavedAt(new Date().toLocaleString());
  };

  const loadBill = (bill: SavedBill) => {
    setMode(bill.mode);
    setCompany(bill.snapshot.company);
    setCustomer(bill.snapshot.customer);
    setMeta(bill.snapshot.meta);
    setItems(bill.snapshot.items);
    setInstallments(bill.snapshot.installments);
    setPaymentNote(bill.snapshot.paymentNote);
    setNotes(bill.snapshot.notes);
    setTaxRate(bill.snapshot.taxRate);
    setInvoiceDiscountType(bill.snapshot.invoiceDiscountType);
    setInvoiceDiscountValue(bill.snapshot.invoiceDiscountValue);
    setLogoUrl(bill.snapshot.logoUrl);
    setTheme(bill.snapshot.theme ?? initialTheme);
    setShowDocumentModal(true);
    setActiveSection(bill.mode === "quotation" ? "quotation" : "billing");
  };

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadPdf = async () => {
    if (!previewRef.current || isDownloading) {
      return;
    }

    setIsDownloading(true);
    try {
      const headStyles = Array.from(document.head.querySelectorAll("style, link[rel='stylesheet']"))
        .map((node) => node.outerHTML)
        .join("");

      const response = await fetch("/api/invoice-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceHtml: `<div class="print-page">${previewRef.current.outerHTML}</div>`,
          headStyles,
          origin: window.location.origin,
          fileName: meta.invoiceNumber || mode
        })
      });

      if (!response.ok) {
        throw new Error("PDF generation failed");
      }

      const pdfBlob = await response.blob();
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = `${meta.invoiceNumber || mode}.pdf`;
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

  const navItems = [
    { id: "billing" as const, label: "POS Billing", icon: ReceiptText },
    { id: "settings" as const, label: "Billing Settings", icon: Settings }
  ];

  const appStyle = {
    "--billing-primary": theme.primaryColor,
    "--billing-accent": theme.accentColor,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontScale
  } as CSSProperties;

  return (
    <div
      className="h-screen overflow-hidden bg-[#e9eef5] text-[#17213a] print:h-auto print:overflow-visible print:bg-white"
      style={appStyle}
    >
      <div className="grid h-screen grid-cols-1 overflow-hidden lg:grid-cols-[86px_minmax(760px,1fr)] print:block print:h-auto print:overflow-visible">
        <aside className="sticky top-0 z-20 flex gap-2 overflow-x-auto p-3 lg:h-screen lg:flex-col lg:overflow-visible print:hidden" style={{ backgroundColor: theme.primaryColor }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveSection(item.id);
                  if (item.id === "billing") {
                    setMode("billing");
                    setMeta((previous) => ({
                      ...previous,
                      invoiceNumber: previous.invoiceNumber.replace(/^QUO/, "INV")
                    }));
                  }
                }}
                className={`flex min-w-20 flex-col items-center gap-1 rounded-lg px-2 py-3 text-[11px] font-bold transition lg:min-w-0 ${
                  activeSection === item.id
                    ? "text-[#071d3d]"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
                style={activeSection === item.id ? { backgroundColor: theme.accentColor } : undefined}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </aside>

        <section className="hidden border-r border-slate-200 bg-white p-4 shadow-sm lg:h-screen lg:overflow-y-auto print:hidden">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-[#d8aa3d]">Futureys Workspace</p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">
              <ImagePlus className="h-4 w-4" />
              Logo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    handleLogoUpload(file);
                  }
                  event.currentTarget.value = "";
                }}
              />
            </label>
          </div>

          {(activeSection === "billing" || activeSection === "quotation") && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode("billing");
                    setActiveSection("billing");
                    setShowDocumentModal(false);
                  }}
                  className={`rounded-lg border px-3 py-2 text-sm font-black ${
                    mode === "billing" ? "border-[#d8aa3d] bg-[#fff7df] text-[#071d3d]" : "border-slate-200"
                  }`}
                >
                  BILLING
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("quotation");
                    setActiveSection("quotation");
                    setShowDocumentModal(false);
                  }}
                  className={`rounded-lg border px-3 py-2 text-sm font-black ${
                    mode === "quotation" ? "border-[#d8aa3d] bg-[#fff7df] text-[#071d3d]" : "border-slate-200"
                  }`}
                >
                  QUOTATION
                </button>
              </div>
              <EditorCard title="Proposition">
                <select
                  value={mode}
                  onChange={(event) => {
                    const nextMode = event.target.value as DocumentMode;
                    setMode(nextMode);
                    setActiveSection(nextMode);
                    setShowDocumentModal(false);
                    setMeta((previous) => ({
                      ...previous,
                      invoiceNumber:
                        nextMode === "quotation"
                          ? previous.invoiceNumber.replace(/^INV/, "QUO")
                          : previous.invoiceNumber.replace(/^QUO/, "INV")
                    }));
                  }}
                  className="invoice-input font-black uppercase"
                >
                  <option value="billing">Billing / Bill</option>
                  <option value="quotation">Quotation</option>
                </select>
              </EditorCard>

              <EditorCard title="Document">
                <Field label={mode === "billing" ? "Invoice No" : "Quotation No"}>
                  <input
                    value={meta.invoiceNumber}
                    onChange={(event) => setMeta((previous) => ({ ...previous, invoiceNumber: event.target.value }))}
                    className="invoice-input"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Date">
                    <input
                      type="date"
                      value={meta.invoiceDate}
                      onChange={(event) => setMeta((previous) => ({ ...previous, invoiceDate: event.target.value }))}
                      className="invoice-input"
                    />
                  </Field>
                  <Field label="Due Date">
                    <input
                      type="date"
                      value={meta.dueDate}
                      onChange={(event) => setMeta((previous) => ({ ...previous, dueDate: event.target.value }))}
                      className="invoice-input"
                    />
                  </Field>
                </div>
                <Field label="Terms">
                  <input
                    value={meta.terms}
                    onChange={(event) => setMeta((previous) => ({ ...previous, terms: event.target.value }))}
                    className="invoice-input"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Warranty Period">
                    <input
                      value={meta.warrantyPeriod}
                      onChange={(event) => setMeta((previous) => ({ ...previous, warrantyPeriod: event.target.value }))}
                      className="invoice-input"
                      placeholder="1 Year"
                    />
                  </Field>
                  <Field label="Support Period">
                    <input
                      value={meta.supportPeriod}
                      onChange={(event) => setMeta((previous) => ({ ...previous, supportPeriod: event.target.value }))}
                      className="invoice-input"
                      placeholder="1 Year support"
                    />
                  </Field>
                </div>
              </EditorCard>

              <EditorCard title="Client Details">
                <select
                  value={customer.name}
                  onChange={(event) => {
                    const selectedClient = clients.find((client) => client.name === event.target.value);
                    if (selectedClient) {
                      setCustomer(selectedClient);
                    }
                  }}
                  className="invoice-input"
                >
                  {clients.map((client) => (
                    <option key={client.name} value={client.name}>
                      {client.name}
                    </option>
                  ))}
                </select>
                <Field label="Bill To">
                  <input
                    value={customer.name}
                    onChange={(event) => setCustomer((previous) => ({ ...previous, name: event.target.value }))}
                    className="invoice-input"
                  />
                </Field>
                <Field label="Address">
                  <textarea
                    value={customer.address}
                    onChange={(event) => setCustomer((previous) => ({ ...previous, address: event.target.value }))}
                    className="invoice-textarea min-h-20"
                  />
                </Field>
              </EditorCard>

              <CatalogPicker
                title="Services"
                items={services}
                onAdd={addCatalogToBill}
                onJump={() => setActiveSection("services")}
              />
              <CatalogPicker
                title="Products"
                items={products}
                onAdd={addCatalogToBill}
                onJump={() => setActiveSection("products")}
              />

              <EditorCard title="Selected Items">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <input
                          value={item.title ?? ""}
                          onChange={(event) => updateItem(item.id, "title", event.target.value)}
                          className="invoice-input font-bold"
                          placeholder="Item title"
                        />
                        <button
                          type="button"
                          onClick={() => setItems((previous) => previous.filter((entry) => entry.id !== item.id))}
                          className="rounded-md border border-red-200 bg-red-50 p-2 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <textarea
                        value={item.description}
                        onChange={(event) => updateItem(item.id, "description", event.target.value)}
                        className="invoice-textarea min-h-16"
                        placeholder="Description"
                      />
                      <textarea
                        value={item.note ?? ""}
                        onChange={(event) => updateItem(item.id, "note", event.target.value)}
                        className="invoice-textarea mb-2 min-h-14"
                        placeholder="Item note"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          min={0}
                          value={item.qty}
                          onChange={(event) => updateItem(item.id, "qty", parseNumber(event.target.value))}
                          className="invoice-input"
                          aria-label="Quantity"
                        />
                        <input
                          type="number"
                          min={0}
                          value={item.price}
                          onChange={(event) => updateItem(item.id, "price", parseNumber(event.target.value))}
                          className="invoice-input"
                          aria-label="Unit price"
                        />
                        <input
                          type="number"
                          min={0}
                          value={item.discountValue ?? 0}
                          onChange={(event) => updateItem(item.id, "discountValue", parseNumber(event.target.value))}
                          className="invoice-input"
                          aria-label="Discount"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </EditorCard>

              <EditorCard title="Installments">
                <div className="space-y-3">
                  {installments.map((installment) => (
                    <div key={installment.id} className="rounded-lg border border-slate-200 p-3">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          value={installment.label}
                          onChange={(event) =>
                            setInstallments((previous) =>
                              previous.map((entry) =>
                                entry.id === installment.id ? { ...entry, label: event.target.value } : entry
                              )
                            )
                          }
                          className="invoice-input"
                        />
                        <input
                          type="date"
                          value={installment.date}
                          onChange={(event) =>
                            setInstallments((previous) =>
                              previous.map((entry) =>
                                entry.id === installment.id ? { ...entry, date: event.target.value } : entry
                              )
                            )
                          }
                          className="invoice-input"
                        />
                        <select
                          value={installment.status}
                          onChange={(event) =>
                            setInstallments((previous) =>
                              previous.map((entry) =>
                                entry.id === installment.id
                                  ? { ...entry, status: event.target.value as "paid" | "pending" }
                                  : entry
                              )
                            )
                          }
                          className="invoice-input"
                        >
                          <option value="paid">Paid</option>
                          <option value="pending">Pending</option>
                        </select>
                        <input
                          type="number"
                          min={0}
                          value={installment.amount}
                          onChange={(event) =>
                            setInstallments((previous) =>
                              previous.map((entry) =>
                                entry.id === installment.id ? { ...entry, amount: parseNumber(event.target.value) } : entry
                              )
                            )
                          }
                          className="invoice-input"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setInstallments((previous) => [
                      ...previous,
                      {
                        id: uid("ins"),
                        label: `${previous.length + 1} Installment`,
                        date: "",
                        status: "pending",
                        method: "Bank Transfer",
                        amount: balanceDue,
                        note: ""
                      }
                    ])
                  }
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#071d3d] px-3 py-2 text-sm font-bold text-white"
                >
                  <Plus className="h-4 w-4" />
                  Add Installment
                </button>
              </EditorCard>

              <EditorCard title="Payment & Notes">
                <Field label="Payment Summary">
                  <textarea
                    value={paymentNote}
                    onChange={(event) => setPaymentNote(event.target.value)}
                    className="invoice-textarea min-h-28"
                  />
                </Field>
                <Field label="Notes">
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    className="invoice-textarea min-h-20"
                  />
                </Field>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    min={0}
                    value={taxRate}
                    onChange={(event) => setTaxRate(parseNumber(event.target.value))}
                    className="invoice-input"
                    placeholder="Tax %"
                  />
                  <select
                    value={invoiceDiscountType}
                    onChange={(event) => setInvoiceDiscountType(event.target.value as DiscountType)}
                    className="invoice-input"
                  >
                    <option value="amount">Discount LKR</option>
                    <option value="percent">Discount %</option>
                  </select>
                  <input
                    type="number"
                    min={0}
                    value={invoiceDiscountValue}
                    onChange={(event) => setInvoiceDiscountValue(parseNumber(event.target.value))}
                    className="invoice-input"
                    placeholder="Discount"
                  />
                </div>
              </EditorCard>
            </div>
          )}

          {activeSection === "business" && (
            <EditorCard title="Business Details">
              <Field label="Business Name">
                <input
                  value={company.name}
                  onChange={(event) => setCompany((previous) => ({ ...previous, name: event.target.value }))}
                  className="invoice-input"
                />
              </Field>
              <Field label="Address">
                <textarea
                  value={company.address}
                  onChange={(event) => setCompany((previous) => ({ ...previous, address: event.target.value }))}
                  className="invoice-textarea min-h-24"
                />
              </Field>
              <Field label="Phone">
                <input
                  value={company.phone}
                  onChange={(event) => setCompany((previous) => ({ ...previous, phone: event.target.value }))}
                  className="invoice-input"
                />
              </Field>
              <Field label="Email">
                <input
                  value={company.email}
                  onChange={(event) => setCompany((previous) => ({ ...previous, email: event.target.value }))}
                  className="invoice-input"
                />
              </Field>
              <Field label="Website">
                <input
                  value={company.website}
                  onChange={(event) => setCompany((previous) => ({ ...previous, website: event.target.value }))}
                  className="invoice-input"
                />
              </Field>
            </EditorCard>
          )}

          {activeSection === "clients" && (
            <MasterList
              title="Client Details"
              icon={UserRoundPlus}
              items={clients.map((client, index) => ({
                id: `${index}`,
                title: client.name,
                description: client.address,
                price: 0,
                type: "service" as const
              }))}
              onAdd={() => setClients((previous) => [...previous, { name: "New Client", address: "" }])}
              onUpdate={(index, field, value) =>
                setClients((previous) =>
                  previous.map((client, clientIndex) =>
                    clientIndex === Number(index) ? { ...client, [field === "title" ? "name" : "address"]: value } : client
                  )
                )
              }
              onDelete={(index) => setClients((previous) => previous.filter((_, clientIndex) => clientIndex !== Number(index)))}
            />
          )}

          {activeSection === "services" && (
            <MasterList
              title="Services"
              icon={PackagePlus}
              items={services}
              onAdd={() =>
                setServices((previous) => [
                  ...previous,
                  { id: uid("srv"), type: "service", title: "New Service", description: "", price: 0 }
                ])
              }
              onUpdate={(id, field, value) =>
                setServices((previous) =>
                  previous.map((entry) => (entry.id === id ? { ...entry, [field]: field === "price" ? Number(value) : value } : entry))
                )
              }
              onDelete={(id) => setServices((previous) => previous.filter((entry) => entry.id !== id))}
            />
          )}

          {activeSection === "products" && (
            <MasterList
              title="Products"
              icon={PackagePlus}
              items={products}
              onAdd={() =>
                setProducts((previous) => [
                  ...previous,
                  { id: uid("prd"), type: "product", title: "New Product", description: "", price: 0 }
                ])
              }
              onUpdate={(id, field, value) =>
                setProducts((previous) =>
                  previous.map((entry) => (entry.id === id ? { ...entry, [field]: field === "price" ? Number(value) : value } : entry))
                )
              }
              onDelete={(id) => setProducts((previous) => previous.filter((entry) => entry.id !== id))}
            />
          )}

          {activeSection === "bills" && (
            <EditorCard title="Billing Management">
              <div className="grid grid-cols-2 gap-2 text-xs font-black">
                {(["all", "draft", "running", "completed", "cancelled"] as const).map((state) => (
                  <button
                    key={state}
                    type="button"
                    onClick={() => setBillFilter(state)}
                    className={`rounded-lg border px-3 py-2 uppercase ${
                      billFilter === state ? "border-[#d8aa3d] bg-[#fff7df] text-[#071d3d]" : "border-slate-200 bg-white"
                    }`}
                  >
                    {state} ({state === "all" ? bills.length : bills.filter((bill) => bill.state === state).length})
                  </button>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-black">
                <button type="button" onClick={() => saveBill("draft")} className="rounded-lg bg-slate-100 px-3 py-2">
                  Draft
                </button>
                <button type="button" onClick={() => saveBill("running")} className="rounded-lg bg-blue-100 px-3 py-2 text-blue-800">
                  Running
                </button>
                <button type="button" onClick={() => saveBill("completed")} className="rounded-lg bg-emerald-100 px-3 py-2 text-emerald-800">
                  Completed
                </button>
                <button type="button" onClick={() => saveBill("cancelled")} className="rounded-lg bg-red-100 px-3 py-2 text-red-700">
                  Cancel
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {bills.filter((bill) => billFilter === "all" || bill.state === billFilter).map((bill) => (
                  <button
                    key={bill.id}
                    type="button"
                    onClick={() => loadBill(bill)}
                    className="w-full rounded-lg border border-slate-200 p-3 text-left transition hover:border-[#d8aa3d]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-[#071d3d]">{bill.number}</span>
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-black uppercase ${
                          bill.state === "completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : bill.state === "running"
                                ? "bg-blue-100 text-blue-700"
                                : bill.state === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {bill.state}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {bill.mode.toUpperCase()} | {bill.customerName}
                    </p>
                    <p className="mt-1 text-sm font-bold">{formatCurrency(bill.total)}</p>
                  </button>
                ))}
              </div>
            </EditorCard>
          )}
        </section>

        <main className="min-h-0 p-3 lg:h-screen lg:overflow-hidden print:h-auto print:p-0 print:overflow-visible">
          {templateSavedAt && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 print:hidden">
              Billing template saved at {templateSavedAt}.
            </div>
          )}

          {activeSection === "settings" ? (
            <BillingSettings
              company={company}
              logoUrl={logoUrl}
              theme={theme}
              meta={meta}
              taxRate={taxRate}
              invoiceDiscountType={invoiceDiscountType}
              invoiceDiscountValue={invoiceDiscountValue}
              paymentNote={paymentNote}
              notes={notes}
              clients={clients}
              services={services}
              products={products}
              bills={bills}
              billFilter={billFilter}
              templateSavedAt={templateSavedAt}
              onCompanyChange={setCompany}
              onLogoUpload={handleLogoUpload}
              onLogoClear={() => setLogoUrl(null)}
              onThemeChange={setTheme}
              onMetaChange={setMeta}
              onTaxRateChange={setTaxRate}
              onInvoiceDiscountTypeChange={setInvoiceDiscountType}
              onInvoiceDiscountValueChange={setInvoiceDiscountValue}
              onPaymentNoteChange={setPaymentNote}
              onNotesChange={setNotes}
              onClientsChange={setClients}
              onServicesChange={setServices}
              onProductsChange={setProducts}
              onBillFilterChange={setBillFilter}
              onLoadBill={loadBill}
              onSaveTemplate={saveCurrentTemplate}
            />
          ) : (
            <ProcessWorkspace
              mode={mode}
              products={products}
              services={services}
              clients={clients}
              customer={customer}
              items={items}
              total={total}
              subtotal={subtotal}
              lineDiscountTotal={lineDiscountTotal}
              balanceDue={balanceDue}
              catalogFilter={catalogFilter}
              searchQuery={searchQuery}
              productPanelWidth={productPanelWidth}
              cartPanelWidth={cartPanelWidth}
              onCatalogFilterChange={setCatalogFilter}
              onSearchQueryChange={setSearchQuery}
              onProductPanelWidthChange={setProductPanelWidth}
              onCartPanelWidthChange={setCartPanelWidth}
              onCustomerChange={setCustomer}
              onModeChange={setMode}
              onAddCustomerClick={() => setShowCustomerModal(true)}
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => {
                if (document.fullscreenElement) {
                  void document.exitFullscreen();
                } else {
                  void document.documentElement.requestFullscreen?.();
                }
              }}
              onAdd={addCatalogToBill}
              onRemove={(id) => setItems((previous) => previous.filter((item) => item.id !== id))}
              onItemNoteChange={(id, note) => updateItem(id, "note", note)}
              onQuantityChange={(id, qty) => updateItem(id, "qty", qty)}
              onLineDiscountTypeChange={(id, discountType) => updateItem(id, "discountType", discountType)}
              onLineDiscountChange={(id, discount) => updateItem(id, "discountValue", discount)}
              onProcess={processBill}
              onDraft={() => saveBill("draft")}
              onCancel={() => saveBill("cancelled")}
            />
          )}
        </main>
      </div>

      {showPaymentModal && (
        <ProcessPaymentModal
          mode={mode}
          installments={installments}
          total={total}
          paidAmount={paidAmount}
          balanceDue={balanceDue}
          onInstallmentsChange={setInstallments}
          onClose={() => setShowPaymentModal(false)}
          onConfirm={confirmProcessBill}
        />
      )}

      {showCustomerModal && (
        <AddCustomerModal
          onClose={() => setShowCustomerModal(false)}
          onSave={(client) => {
            setClients((previous) => [...previous, client]);
            setCustomer(client);
            setShowCustomerModal(false);
          }}
        />
      )}

      {showDocumentModal && (
        <DocumentModal
          mode={mode}
          processLabel={mode === "quotation" ? "Quotation Draft" : pendingAmount > 0 ? "Running Bill" : "Draft Bill"}
          onClose={() => setShowDocumentModal(false)}
          onDownload={handleDownloadPdf}
          onPrint={() => window.print()}
          isDownloading={isDownloading}
        >
          <InvoicePreview
            refEl={previewRef}
            mode={mode}
            company={company}
            customer={customer}
            meta={meta}
            items={items}
            installments={installments}
            logoUrl={logoUrl}
            theme={theme}
            subtotal={subtotal}
            lineDiscountTotal={lineDiscountTotal}
            invoiceDiscountAmount={invoiceDiscountAmount}
            taxAmount={taxAmount}
            total={total}
            paidAmount={paidAmount}
            pendingAmount={pendingAmount}
            balanceDue={balanceDue}
            paymentNote={paymentNote}
            notes={notes}
          />
        </DocumentModal>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="invoice-label">{label}</span>
      {children}
    </label>
  );
}

function EditorCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-xs font-black uppercase tracking-wide text-[#071d3d]">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  danger = false
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold shadow-sm ${
        danger ? "bg-red-600 text-white" : "bg-[#071d3d] text-white"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function CatalogPicker({
  title,
  items,
  onAdd,
  onJump
}: {
  title: string;
  items: CatalogItem[];
  onAdd: (item: CatalogItem) => void;
  onJump: () => void;
}) {
  return (
    <EditorCard title={`${title} POS Panel`}>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onAdd(item)}
            className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-[#d8aa3d] hover:bg-[#fff7df]"
          >
            <p className="line-clamp-2 text-xs font-black text-[#071d3d]">{item.title}</p>
            <p className="mt-1 text-xs font-bold text-[#9a6b13]">{formatCurrency(item.price)}</p>
          </button>
        ))}
      </div>
      <button type="button" onClick={onJump} className="mt-3 text-xs font-black text-[#9a6b13]">
        Manage {title}
      </button>
    </EditorCard>
  );
}

function MasterList({
  title,
  icon: Icon,
  items,
  onAdd,
  onUpdate,
  onDelete
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: CatalogItem[];
  onAdd: () => void;
  onUpdate: (id: string, field: "title" | "description" | "price", value: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <EditorCard title={title}>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-2 rounded-lg bg-[#071d3d] px-3 py-2 text-sm font-bold text-white"
      >
        <Icon className="h-4 w-4" />
        Add {title}
      </button>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-slate-200 p-3">
            <div className="mb-2 flex gap-2">
              <input
                value={item.title}
                onChange={(event) => onUpdate(item.id, "title", event.target.value)}
                className="invoice-input font-bold"
              />
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                className="rounded-md border border-red-200 bg-red-50 p-2 text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <textarea
              value={item.description}
              onChange={(event) => onUpdate(item.id, "description", event.target.value)}
              className="invoice-textarea min-h-16"
            />
            {item.type !== "service" || title !== "Client Details" ? (
              <input
                type="number"
                min={0}
                value={item.price}
                onChange={(event) => onUpdate(item.id, "price", event.target.value)}
                className="invoice-input mt-2"
              />
            ) : null}
          </div>
        ))}
      </div>
    </EditorCard>
  );
}

function BillingSettings({
  company,
  logoUrl,
  theme,
  meta,
  taxRate,
  invoiceDiscountType,
  invoiceDiscountValue,
  paymentNote,
  notes,
  clients,
  services,
  products,
  bills,
  billFilter,
  templateSavedAt,
  onCompanyChange,
  onLogoUpload,
  onLogoClear,
  onThemeChange,
  onMetaChange,
  onTaxRateChange,
  onInvoiceDiscountTypeChange,
  onInvoiceDiscountValueChange,
  onPaymentNoteChange,
  onNotesChange,
  onClientsChange,
  onServicesChange,
  onProductsChange,
  onBillFilterChange,
  onLoadBill,
  onSaveTemplate
}: {
  company: CompanyInfo;
  logoUrl: string | null;
  theme: BillingTheme;
  meta: InvoiceMeta;
  taxRate: number;
  invoiceDiscountType: DiscountType;
  invoiceDiscountValue: number;
  paymentNote: string;
  notes: string;
  clients: CustomerInfo[];
  services: CatalogItem[];
  products: CatalogItem[];
  bills: SavedBill[];
  billFilter: BillState | "all";
  templateSavedAt: string | null;
  onCompanyChange: (company: CompanyInfo) => void;
  onLogoUpload: (file: File) => void;
  onLogoClear: () => void;
  onThemeChange: (theme: BillingTheme) => void;
  onMetaChange: (meta: InvoiceMeta) => void;
  onTaxRateChange: (rate: number) => void;
  onInvoiceDiscountTypeChange: (type: DiscountType) => void;
  onInvoiceDiscountValueChange: (value: number) => void;
  onPaymentNoteChange: (note: string) => void;
  onNotesChange: (notes: string) => void;
  onClientsChange: (clients: CustomerInfo[]) => void;
  onServicesChange: (services: CatalogItem[]) => void;
  onProductsChange: (products: CatalogItem[]) => void;
  onBillFilterChange: (filter: BillState | "all") => void;
  onLoadBill: (bill: SavedBill) => void;
  onSaveTemplate: () => void;
}) {
  const updateClient = (index: number, patch: Partial<CustomerInfo>) => {
    onClientsChange(clients.map((client, clientIndex) => (clientIndex === index ? { ...client, ...patch } : client)));
  };

  const filteredBills = bills.filter((bill) => billFilter === "all" || bill.state === billFilter);

  return (
    <div className="h-[calc(100vh-24px)] overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-[#d8aa3d]">Futureys Workspace</p>
          <h1 className="text-2xl font-black text-[#071d3d]">Billing Settings</h1>
        </div>
        <button
          type="button"
          onClick={onSaveTemplate}
          className="inline-flex items-center gap-2 rounded-lg bg-[#071d3d] px-4 py-2 text-sm font-black text-white"
        >
          <Save className="h-4 w-4" />
          Save Template
        </button>
      </div>

      {templateSavedAt && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          Template saved at {templateSavedAt}.
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[380px_1fr]">
        <div className="space-y-4">
          <EditorCard title="Logo & Company Details">
            <div className="flex items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt="Business logo" className="max-h-20 max-w-20 object-contain" />
                ) : (
                  <ImagePlus className="h-8 w-8 text-slate-400" />
                )}
              </div>
              <div className="space-y-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#071d3d] px-3 py-2 text-xs font-black text-white">
                  <ImagePlus className="h-4 w-4" />
                  Upload Logo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        onLogoUpload(file);
                      }
                      event.currentTarget.value = "";
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={onLogoClear}
                  className="block rounded-lg border border-red-200 px-3 py-2 text-xs font-black text-red-600"
                >
                  Clear Logo
                </button>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
              <Field label="Primary Color">
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(event) => onThemeChange({ ...theme, primaryColor: event.target.value })}
                    className="h-10 w-14 rounded-md border border-slate-200 bg-white p-1"
                    aria-label="Primary color"
                  />
                  <input
                    value={theme.primaryColor}
                    onChange={(event) => onThemeChange({ ...theme, primaryColor: event.target.value })}
                    className="invoice-input"
                  />
                </div>
              </Field>
              <Field label="Accent Color">
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={theme.accentColor}
                    onChange={(event) => onThemeChange({ ...theme, accentColor: event.target.value })}
                    className="h-10 w-14 rounded-md border border-slate-200 bg-white p-1"
                    aria-label="Accent color"
                  />
                  <input
                    value={theme.accentColor}
                    onChange={(event) => onThemeChange({ ...theme, accentColor: event.target.value })}
                    className="invoice-input"
                  />
                </div>
              </Field>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
              <Field label="Font Family">
                <select
                  value={theme.fontFamily}
                  onChange={(event) => onThemeChange({ ...theme, fontFamily: event.target.value })}
                  className="invoice-input"
                >
                  {fontOptions.map((font) => (
                    <option key={font.label} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="UI Font Size">
                <select
                  value={theme.fontScale}
                  onChange={(event) => onThemeChange({ ...theme, fontScale: event.target.value })}
                  className="invoice-input"
                >
                  <option value="75%">Compact 75%</option>
                  <option value="80%">Normal 80%</option>
                  <option value="87.5%">Large 87.5%</option>
                  <option value="100%">Full 100%</option>
                </select>
              </Field>
            </div>
            <Field label="Company Name">
              <input
                value={company.name}
                onChange={(event) => onCompanyChange({ ...company, name: event.target.value })}
                className="invoice-input"
              />
            </Field>
            <Field label="Address">
              <textarea
                value={company.address}
                onChange={(event) => onCompanyChange({ ...company, address: event.target.value })}
                className="invoice-textarea min-h-24"
              />
            </Field>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
              <Field label="Phone">
                <input
                  value={company.phone}
                  onChange={(event) => onCompanyChange({ ...company, phone: event.target.value })}
                  className="invoice-input"
                />
              </Field>
              <Field label="Email">
                <input
                  value={company.email}
                  onChange={(event) => onCompanyChange({ ...company, email: event.target.value })}
                  className="invoice-input"
                />
              </Field>
              <Field label="Website">
                <input
                  value={company.website}
                  onChange={(event) => onCompanyChange({ ...company, website: event.target.value })}
                  className="invoice-input"
                />
              </Field>
            </div>
          </EditorCard>

          <EditorCard title="Invoice Settings - POS Billing">
            <Field label="Default Terms">
              <input
                value={meta.terms}
                onChange={(event) => onMetaChange({ ...meta, terms: event.target.value })}
                className="invoice-input"
              />
            </Field>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
              <Field label="Warranty Period">
                <input
                  value={meta.warrantyPeriod}
                  onChange={(event) => onMetaChange({ ...meta, warrantyPeriod: event.target.value })}
                  className="invoice-input"
                />
              </Field>
              <Field label="Support Period">
                <input
                  value={meta.supportPeriod}
                  onChange={(event) => onMetaChange({ ...meta, supportPeriod: event.target.value })}
                  className="invoice-input"
                />
              </Field>
            </div>
            <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-1">
              <Field label="Tax %">
                <input
                  type="number"
                  min={0}
                  value={taxRate}
                  onChange={(event) => onTaxRateChange(parseNumber(event.target.value))}
                  className="invoice-input"
                />
              </Field>
              <Field label="Invoice Discount Type">
                <select
                  value={invoiceDiscountType}
                  onChange={(event) => onInvoiceDiscountTypeChange(event.target.value as DiscountType)}
                  className="invoice-input"
                >
                  <option value="amount">LKR</option>
                  <option value="percent">%</option>
                </select>
              </Field>
              <Field label="Invoice Discount">
                <input
                  type="number"
                  min={0}
                  value={invoiceDiscountValue}
                  onChange={(event) => onInvoiceDiscountValueChange(parseNumber(event.target.value))}
                  className="invoice-input"
                />
              </Field>
            </div>
            <Field label="Payment Summary">
              <textarea
                value={paymentNote}
                onChange={(event) => onPaymentNoteChange(event.target.value)}
                className="invoice-textarea min-h-28"
              />
            </Field>
            <Field label="Invoice Notes">
              <textarea
                value={notes}
                onChange={(event) => onNotesChange(event.target.value)}
                className="invoice-textarea min-h-20"
              />
            </Field>
          </EditorCard>
        </div>

        <div className="space-y-4">
          <EditorCard title="Customer Registration">
            <button
              type="button"
              onClick={() => onClientsChange([...clients, { name: "New Customer", address: "", phone: "", email: "" }])}
              className="inline-flex items-center gap-2 rounded-lg bg-[#071d3d] px-3 py-2 text-sm font-bold text-white"
            >
              <UserRoundPlus className="h-4 w-4" />
              Add Customer
            </button>
            <div className="space-y-3">
              {clients.map((client, index) => (
                <div key={`${client.name}-${index}`} className="rounded-lg border border-slate-200 p-3">
                  <div className="mb-2 flex gap-2">
                    <input
                      value={client.name}
                      onChange={(event) => updateClient(index, { name: event.target.value })}
                      className="invoice-input font-bold"
                      placeholder="Customer name"
                    />
                    <button
                      type="button"
                      onClick={() => onClientsChange(clients.filter((_, clientIndex) => clientIndex !== index))}
                      className="rounded-md border border-red-200 bg-red-50 p-2 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    <input
                      value={client.phone ?? ""}
                      onChange={(event) => updateClient(index, { phone: event.target.value })}
                      className="invoice-input"
                      placeholder="Phone"
                    />
                    <input
                      value={client.email ?? ""}
                      onChange={(event) => updateClient(index, { email: event.target.value })}
                      className="invoice-input"
                      placeholder="Email"
                    />
                  </div>
                  <textarea
                    value={client.address}
                    onChange={(event) => updateClient(index, { address: event.target.value })}
                    className="invoice-textarea mt-2 min-h-16"
                    placeholder="Address"
                  />
                </div>
              ))}
            </div>
          </EditorCard>

          <div className="grid gap-4 2xl:grid-cols-2">
            <MasterList
              title="Services"
              icon={PackagePlus}
              items={services}
              onAdd={() =>
                onServicesChange([
                  ...services,
                  { id: uid("srv"), type: "service", title: "New Service", description: "", price: 0 }
                ])
              }
              onUpdate={(id, field, value) =>
                onServicesChange(
                  services.map((entry) =>
                    entry.id === id ? { ...entry, [field]: field === "price" ? Number(value) : value } : entry
                  )
                )
              }
              onDelete={(id) => onServicesChange(services.filter((entry) => entry.id !== id))}
            />
            <MasterList
              title="Products"
              icon={PackagePlus}
              items={products}
              onAdd={() =>
                onProductsChange([
                  ...products,
                  { id: uid("prd"), type: "product", title: "New Product", description: "", price: 0 }
                ])
              }
              onUpdate={(id, field, value) =>
                onProductsChange(
                  products.map((entry) =>
                    entry.id === id ? { ...entry, [field]: field === "price" ? Number(value) : value } : entry
                  )
                )
              }
              onDelete={(id) => onProductsChange(products.filter((entry) => entry.id !== id))}
            />
          </div>

          <EditorCard title="Billing Management">
            <div className="flex flex-wrap gap-2 text-xs font-black">
              {(["all", "draft", "running", "completed", "cancelled"] as const).map((state) => (
                <button
                  key={state}
                  type="button"
                  onClick={() => onBillFilterChange(state)}
                  className={`rounded-lg border px-3 py-2 uppercase ${
                    billFilter === state ? "border-[#d8aa3d] bg-[#fff7df] text-[#071d3d]" : "border-slate-200 bg-white"
                  }`}
                >
                  {state} ({state === "all" ? bills.length : bills.filter((bill) => bill.state === state).length})
                </button>
              ))}
            </div>
            <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">
              {filteredBills.length === 0 ? (
                <p className="rounded-lg bg-slate-50 p-3 text-sm font-bold text-slate-500">No bills saved yet.</p>
              ) : (
                filteredBills.map((bill) => (
                  <button
                    key={bill.id}
                    type="button"
                    onClick={() => onLoadBill(bill)}
                    className="w-full rounded-lg border border-slate-200 p-3 text-left transition hover:border-[#d8aa3d]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-black text-[#071d3d]">{bill.number}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black uppercase text-slate-600">
                        {bill.state}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {bill.mode.toUpperCase()} | {bill.customerName} | {new Date(bill.savedAt).toLocaleString()}
                    </p>
                    <p className="mt-1 text-sm font-bold">{formatCurrency(bill.total)}</p>
                  </button>
                ))
              )}
            </div>
          </EditorCard>
        </div>
      </div>
    </div>
  );
}

function ProcessPaymentModal({
  mode,
  installments,
  total,
  paidAmount,
  balanceDue,
  onInstallmentsChange,
  onClose,
  onConfirm
}: {
  mode: DocumentMode;
  installments: InstallmentPayment[];
  total: number;
  paidAmount: number;
  balanceDue: number;
  onInstallmentsChange: (installments: InstallmentPayment[]) => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const updateInstallment = (id: string, patch: Partial<InstallmentPayment>) => {
    onInstallmentsChange(
      installments.map((installment) =>
        installment.id === id ? { ...installment, ...patch } : installment
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 print:hidden">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#d8aa3d]">Process Payment</p>
            <h2 className="text-xl font-black text-[#071d3d]">
              {mode === "quotation" ? "Quotation Installment Plan" : "Invoice Payment & Installments"}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-3 py-2 font-black">
            Close
          </button>
        </div>

        <div className="grid gap-4 p-6 lg:grid-cols-[1fr_260px]">
          <div className="space-y-3">
            {installments.map((installment, index) => (
              <div key={installment.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-black text-[#071d3d]">Installment {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => onInstallmentsChange(installments.filter((entry) => entry.id !== installment.id))}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Label">
                    <input
                      value={installment.label}
                      onChange={(event) => updateInstallment(installment.id, { label: event.target.value })}
                      className="invoice-input"
                    />
                  </Field>
                  <Field label="Date">
                    <input
                      type="date"
                      value={installment.date}
                      onChange={(event) => updateInstallment(installment.id, { date: event.target.value })}
                      className="invoice-input"
                    />
                  </Field>
                  <Field label="Status">
                    <select
                      value={installment.status}
                      onChange={(event) =>
                        updateInstallment(installment.id, { status: event.target.value as "paid" | "pending" })
                      }
                      className="invoice-input"
                    >
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                    </select>
                  </Field>
                  <Field label="Method">
                    <select
                      value={installment.method}
                      onChange={(event) => updateInstallment(installment.id, { method: event.target.value })}
                      className="invoice-input"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Card">Card</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </Field>
                  <Field label="Amount">
                    <input
                      type="number"
                      min={0}
                      value={installment.amount}
                      onChange={(event) => updateInstallment(installment.id, { amount: parseNumber(event.target.value) })}
                      className="invoice-input"
                    />
                  </Field>
                  <Field label="Note">
                    <input
                      value={installment.note}
                      onChange={(event) => updateInstallment(installment.id, { note: event.target.value })}
                      className="invoice-input"
                    />
                  </Field>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                onInstallmentsChange([
                  ...installments,
                  {
                    id: uid("ins"),
                    label: `${installments.length + 1} Installment`,
                    date: "",
                    status: "pending",
                    method: "Bank Transfer",
                    amount: balanceDue,
                    note: ""
                  }
                ])
              }
              className="inline-flex items-center gap-2 rounded-lg bg-[#071d3d] px-4 py-2 text-sm font-black text-white"
            >
              <Plus className="h-4 w-4" />
              Add Installment
            </button>
          </div>

          <aside className="rounded-xl border border-slate-200 bg-white p-4">
            <TotalRow label="Total" value={formatCurrency(total)} strong />
            <TotalRow label="Paid" value={formatCurrency(paidAmount)} paid />
            <TotalRow label="Balance" value={formatCurrency(balanceDue)} strong />
            <p className="mt-4 rounded-lg bg-blue-50 p-3 text-xs font-bold text-blue-900">
              Confirm කළාම bill එක auto complete වෙන්නේ නැහැ. Paid installments අනුව Running/Draft state එකට save වෙනවා.
            </p>
            <button
              type="button"
              onClick={onConfirm}
              className="mt-4 w-full rounded-lg bg-[#071d3d] px-4 py-3 text-sm font-black text-white"
            >
              Confirm & Open {mode === "quotation" ? "Quotation" : "Invoice"}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}

function DocumentModal({
  mode,
  processLabel,
  onClose,
  onDownload,
  onPrint,
  isDownloading,
  children
}: {
  mode: DocumentMode;
  processLabel: string;
  onClose: () => void;
  onDownload: () => void;
  onPrint: () => void;
  isDownloading: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-slate-950/70 p-5 print:static print:bg-white print:p-0">
      <div className="mx-auto mb-4 flex max-w-[980px] flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm print:hidden">
        <span className="font-bold text-blue-900">
          {mode === "quotation" ? "Quotation" : "Invoice"} opened as {processLabel}. Completion is manual.
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDownload}
            disabled={isDownloading}
            className="rounded-lg bg-[#071d3d] px-3 py-2 text-xs font-black text-white disabled:opacity-60"
          >
            {isDownloading ? "Generating..." : "Download PDF"}
          </button>
          <button
            type="button"
            onClick={onPrint}
            className="rounded-lg bg-[#071d3d] px-3 py-2 text-xs font-black text-white"
          >
            Print
          </button>
          <button type="button" onClick={onClose} className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-black text-blue-700">
            Back to POS
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

function AddCustomerModal({
  onClose,
  onSave
}: {
  onClose: () => void;
  onSave: (client: CustomerInfo) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 print:hidden">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#d8aa3d]">Customer Registration</p>
            <h2 className="text-xl font-black text-[#071d3d]">Add Customer</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-3 py-2 font-black">
            Close
          </button>
        </div>
        <div className="space-y-3">
          <Field label="Customer Name">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="invoice-input"
              placeholder="Customer or business name"
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Phone Number">
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="invoice-input"
                placeholder="+94 77 000 0000"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="invoice-input"
                placeholder="customer@email.com"
              />
            </Field>
          </div>
          <Field label="Address / Contact Details">
            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="invoice-textarea min-h-28"
              placeholder="Address, phone, email"
            />
          </Field>
          <button
            type="button"
            onClick={() => {
              const trimmedName = name.trim();
              if (!trimmedName) {
                return;
              }
              onSave({ name: trimmedName, address, phone, email });
            }}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-black text-white"
          >
            Add Customer
          </button>
        </div>
      </div>
    </div>
  );
}

function ProcessWorkspace({
  mode,
  products,
  services,
  clients,
  customer,
  items,
  total,
  subtotal,
  lineDiscountTotal,
  balanceDue,
  catalogFilter,
  searchQuery,
  productPanelWidth,
  cartPanelWidth,
  onCatalogFilterChange,
  onSearchQueryChange,
  onProductPanelWidthChange,
  onCartPanelWidthChange,
  onCustomerChange,
  onModeChange,
  onAddCustomerClick,
  isFullscreen,
  onToggleFullscreen,
  onAdd,
  onRemove,
  onItemNoteChange,
  onQuantityChange,
  onLineDiscountTypeChange,
  onLineDiscountChange,
  onProcess,
  onDraft,
  onCancel
}: {
  mode: DocumentMode;
  products: CatalogItem[];
  services: CatalogItem[];
  clients: CustomerInfo[];
  customer: CustomerInfo;
  items: InvoiceItem[];
  total: number;
  subtotal: number;
  lineDiscountTotal: number;
  balanceDue: number;
  catalogFilter: "all" | "service" | "product";
  searchQuery: string;
  productPanelWidth: number;
  cartPanelWidth: number;
  onCatalogFilterChange: (value: "all" | "service" | "product") => void;
  onSearchQueryChange: (value: string) => void;
  onProductPanelWidthChange: (value: number) => void;
  onCartPanelWidthChange: (value: number) => void;
  onCustomerChange: (client: CustomerInfo) => void;
  onModeChange: (mode: DocumentMode) => void;
  onAddCustomerClick: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onAdd: (item: CatalogItem) => void;
  onRemove: (id: string) => void;
  onItemNoteChange: (id: string, note: string) => void;
  onQuantityChange: (id: string, qty: number) => void;
  onLineDiscountTypeChange: (id: string, discountType: DiscountType) => void;
  onLineDiscountChange: (id: string, discount: number) => void;
  onProcess: () => void;
  onDraft: () => void;
  onCancel: () => void;
}) {
  const catalog = [...services, ...products].filter((item) => {
    const matchesFilter = catalogFilter === "all" || item.type === catalogFilter;
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const matchesSearch =
      normalizedQuery.length === 0 ||
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.description.toLowerCase().includes(normalizedQuery);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex h-[calc(100vh-24px)] min-h-0 flex-col gap-3 overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
        <div className="min-w-[260px] flex-1">
          <input
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            placeholder="Search product/service name or scan barcode (F3)..."
          />
        </div>
        <select
          value={catalogFilter}
          onChange={(event) => onCatalogFilterChange(event.target.value as "all" | "service" | "product")}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold"
        >
          <option value="all">All Category</option>
          <option value="service">Services</option>
          <option value="product">Products</option>
        </select>
        <select
          value={customer.name}
          onChange={(event) => {
            const selectedClient = clients.find((client) => client.name === event.target.value);
            if (selectedClient) {
              onCustomerChange(selectedClient);
            }
          }}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold"
        >
          {clients.map((client) => (
            <option key={client.name} value={client.name}>
              {client.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onAddCustomerClick}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-black text-white"
        >
          <UserRoundPlus className="h-4 w-4" />
          Customer
        </button>
        <button
          type="button"
          onClick={() => window.open(window.location.href, "_blank", "noopener,noreferrer")}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-black"
        >
          New Window
        </button>
        <button
          type="button"
          onClick={onToggleFullscreen}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-[#071d3d]"
          title={isFullscreen ? "Exit Full Screen" : "Full Screen"}
          aria-label={isFullscreen ? "Exit Full Screen" : "Full Screen"}
        >
          {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </button>
      </div>

      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold text-slate-600 shadow-sm md:grid-cols-2">
        <label className="flex items-center gap-3">
          Products Panel Width
          <input
            type="range"
            min={45}
            max={75}
            value={productPanelWidth}
            onChange={(event) => {
              const next = Number(event.target.value);
              onProductPanelWidthChange(next);
              onCartPanelWidthChange(100 - next);
            }}
            className="flex-1"
          />
          <span className="w-10 text-right">{productPanelWidth}%</span>
        </label>
        <label className="flex items-center gap-3">
          Cart Panel Width
          <input
            type="range"
            min={25}
            max={55}
            value={cartPanelWidth}
            onChange={(event) => {
              const next = Number(event.target.value);
              onCartPanelWidthChange(next);
              onProductPanelWidthChange(100 - next);
            }}
            className="flex-1"
          />
          <span className="w-10 text-right">{cartPanelWidth}%</span>
        </label>
      </div>

      <div
        className="grid min-h-0 flex-1 gap-3 overflow-hidden"
        style={{ gridTemplateColumns: `minmax(420px, ${productPanelWidth}fr) minmax(360px, ${cartPanelWidth}fr)` }}
      >
      <section className="flex min-h-0 flex-col rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-blue-100 px-3 py-2 text-xs font-black text-blue-700">
            {mode === "quotation" ? "QUOTATION" : "BILLING / POS"}
          </span>
          <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-black text-slate-700">
            {catalogFilter === "all" ? "Products + Services" : catalogFilter === "service" ? "Services" : "Products"}
          </span>
        </div>

        <div className="mb-2 flex items-center justify-between border-b border-slate-200 pb-2">
          <h2 className="font-black text-[#071d3d]">Products & Services</h2>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
            {catalog.length} items
          </span>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-2 content-start gap-2 overflow-y-auto pr-2 md:grid-cols-3 2xl:grid-cols-4">
          {catalog.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onAdd(item)}
              className="min-h-[112px] rounded-md border border-slate-200 bg-white p-2.5 text-left transition hover:border-[#d8aa3d] hover:bg-[#fff7df]"
            >
              <p className="line-clamp-2 text-sm font-black text-[#071d3d]">{item.title}</p>
              <p className="mt-1 line-clamp-2 text-xs text-slate-500">{item.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-black text-[#f59e0b]">{formatCurrency(item.price)}</span>
                <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
                  Normal
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <aside className="flex min-h-0 flex-col rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between border-b border-slate-200 pb-2">
          <h2 className="font-black text-[#071d3d]">Cart</h2>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
            {items.length} items
          </span>
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item.id} className="rounded-md border border-slate-200 p-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-black text-[#071d3d]">{item.title || item.description}</p>
                </div>
                <button type="button" onClick={() => onRemove(item.id)} className="text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="font-bold text-slate-500">{formatCurrency(item.price)}</span>
                <span className="font-black text-[#071d3d]">{formatCurrency(lineTotal(item))}</span>
              </div>
              <div className="mt-2 grid grid-cols-[28px_minmax(48px,64px)_64px_68px_1fr] items-center gap-2 text-xs font-bold text-slate-500">
                <span>Qty</span>
                <input
                  type="number"
                  min={0}
                  step="1"
                  value={item.qty}
                  onChange={(event) => onQuantityChange(item.id, parseNumber(event.target.value))}
                  className="rounded-md border border-slate-200 px-2 py-1.5 text-right text-xs font-bold text-[#071d3d] outline-none focus:border-[#d8aa3d] focus:ring-2 focus:ring-amber-100"
                />
                <span>Discount</span>
                <select
                  value={item.discountType ?? "amount"}
                  onChange={(event) => onLineDiscountTypeChange(item.id, event.target.value as DiscountType)}
                  className="rounded-md border border-slate-200 px-2 py-1.5 text-xs font-bold text-[#071d3d] outline-none focus:border-[#d8aa3d] focus:ring-2 focus:ring-amber-100"
                >
                  <option value="amount">LKR</option>
                  <option value="percent">%</option>
                </select>
                <input
                  type="number"
                  min={0}
                  max={(item.discountType ?? "amount") === "percent" ? 100 : undefined}
                  step={(item.discountType ?? "amount") === "percent" ? "0.1" : "0.01"}
                  value={item.discountValue ?? 0}
                  onChange={(event) => onLineDiscountChange(item.id, parseNumber(event.target.value))}
                  className="rounded-md border border-slate-200 px-2 py-1.5 text-right text-xs font-bold text-[#071d3d] outline-none focus:border-[#d8aa3d] focus:ring-2 focus:ring-amber-100"
                />
              </div>
              <textarea
                value={item.note ?? ""}
                onChange={(event) => onItemNoteChange(item.id, event.target.value)}
                className="mt-2 h-10 w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-xs outline-none focus:border-[#d8aa3d] focus:ring-2 focus:ring-amber-100"
                placeholder="Item note for this bill"
              />
            </div>
          ))}
        </div>

        <div className="mt-2 shrink-0 border-t border-slate-200 pt-2">
          <label className="mb-2 block">
            <span className="mb-1 block text-[11px] font-black uppercase text-slate-500">Document Type</span>
            <select
              value={mode}
              onChange={(event) => onModeChange(event.target.value as DocumentMode)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-[#071d3d]"
            >
              <option value="billing">Invoice</option>
              <option value="quotation">Quotation</option>
            </select>
          </label>
          <div className="space-y-1 text-sm">
            <TotalRow label="Subtotal" value={formatCurrency(subtotal)} />
            <TotalRow label="Discount" value={`-${formatCurrency(lineDiscountTotal)}`} warn />
            <TotalRow label="Total" value={formatCurrency(total)} strong />
            <TotalRow label="Balance Due" value={formatCurrency(balanceDue)} strong />
          </div>
          <button
            type="button"
            onClick={onProcess}
            className="mt-3 w-full rounded-md bg-[#1f2937] px-4 py-2.5 text-xs font-black text-white"
          >
            Process {mode === "quotation" ? "Quotation" : "Bill"}
          </button>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button type="button" onClick={onDraft} className="rounded-md border border-orange-300 px-4 py-2 text-xs font-black text-orange-600">
              Draft
            </button>
            <button type="button" onClick={onCancel} className="rounded-md border border-red-300 px-4 py-2 text-xs font-black text-red-600">
              Cancel
            </button>
          </div>
        </div>
      </aside>
      </div>
    </div>
  );
}

function FutureysLogo({ logoUrl, theme }: { logoUrl: string | null; theme: BillingTheme }) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logoUrl} alt="Futureys logo" className="h-16 w-16 object-contain" />
    );
  }

  return (
    <div className="relative h-16 w-16 rounded-full" style={{ backgroundColor: theme.accentColor }}>
      <div className="absolute left-2 right-2 top-[23px] h-[18px] rounded-[100%]" style={{ backgroundColor: theme.primaryColor }} />
      <div className="absolute left-[22px] top-[18px] h-[28px] w-[28px] rounded-full bg-white/80" />
      <div className="absolute left-[30px] top-[26px] h-3 w-3 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
    </div>
  );
}

function InvoicePreview({
  refEl,
  mode,
  company,
  customer,
  meta,
  items,
  installments,
  logoUrl,
  theme,
  subtotal,
  lineDiscountTotal,
  invoiceDiscountAmount,
  taxAmount,
  total,
  paidAmount,
  pendingAmount,
  balanceDue,
  paymentNote,
  notes
}: {
  refEl: React.RefObject<HTMLElement>;
  mode: DocumentMode;
  company: CompanyInfo;
  customer: CustomerInfo;
  meta: InvoiceMeta;
  items: InvoiceItem[];
  installments: InstallmentPayment[];
  logoUrl: string | null;
  theme: BillingTheme;
  subtotal: number;
  lineDiscountTotal: number;
  invoiceDiscountAmount: number;
  taxAmount: number;
  total: number;
  paidAmount: number;
  pendingAmount: number;
  balanceDue: number;
  paymentNote: string;
  notes: string;
}) {
  const previewStyle = {
    fontFamily: theme.fontFamily,
    color: theme.primaryColor
  } as CSSProperties;

  return (
    <article
      ref={refEl}
      className="invoice-print-root mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-white text-[#17213a] shadow-2xl print:min-h-0 print:w-full print:shadow-none"
      style={previewStyle}
    >
      <header className="grid grid-cols-[1fr_250px] border-b-[5px]" style={{ borderColor: theme.accentColor }}>
        <div className="flex items-center gap-5 px-10 py-6 text-white" style={{ backgroundColor: theme.primaryColor }}>
          <FutureysLogo logoUrl={logoUrl} theme={theme} />
          <div>
            <div className="flex items-end gap-3">
              <h1 className="text-[31px] font-black uppercase leading-none tracking-normal" style={{ color: theme.accentColor }}>
                Futureys
              </h1>
              <span className="pb-1 text-[28px] font-light uppercase tracking-wide text-white">
                {mode === "quotation" ? "Quotation" : "Invoice"}
              </span>
            </div>
            <p className="mt-2 text-[12px] font-black uppercase tracking-[0.34em]" style={{ color: theme.accentColor }}>
              Private Limited
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center" style={{ backgroundColor: theme.accentColor, color: theme.primaryColor }}>
          <span className="text-[12px] font-black">Balance Due</span>
          <span className="text-[12px] font-black">LKR</span>
          <strong className="text-[26px] font-black">{balanceDue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-10 bg-[#fff7df] px-10 py-3 text-[11px] leading-snug">
        <div>
          <strong className="mb-1 block uppercase text-[#071d3d]">{company.name}</strong>
          <p className="whitespace-pre-line">{company.address}</p>
        </div>
        <div>
          <strong className="mb-1 block uppercase text-[#071d3d]">Contact Information</strong>
          <p>Phone: {company.phone}</p>
          <p>Email: {company.email}</p>
          <p>Web: {company.website}</p>
        </div>
      </section>

      <section className="px-10 py-6">
        <div className="mb-6 grid grid-cols-[1fr_270px] gap-10 text-[13px]">
          <div>
            <p className="text-[14px] font-black uppercase text-[#aab1bf]">Bill To</p>
            <p className="mt-1 whitespace-pre-line font-semibold">{customer.name}</p>
            {[customer.phone, customer.email].filter(Boolean).length > 0 ? (
              <p className="mt-1 text-[11px] text-[#3d4658]">
                {[customer.phone, customer.email].filter(Boolean).join(" | ")}
              </p>
            ) : null}
            <p className="mt-3 text-[14px] font-black uppercase text-[#aab1bf]">Customer Name</p>
            <p className="mt-1 whitespace-pre-line">{customer.address}</p>
          </div>
          <div className="text-right text-[13px]">
            <MetaRow label={mode === "quotation" ? "Quotation" : "Invoice"} value={meta.invoiceNumber} />
            <MetaRow label="Terms" value={meta.terms} />
            <MetaRow label="Date" value={meta.invoiceDate} />
            <MetaRow label="Due Date" value={meta.dueDate} />
            <MetaRow label="Warranty" value={meta.warrantyPeriod} />
            <MetaRow label="Support" value={meta.supportPeriod} />
          </div>
        </div>

        <PreviewTable
          headers={["Services", "Qty", "Unit Price", "Discount", "Amount"]}
          rows={items.map((item) => [
            <div key={`${item.id}-title`}>
              <p className="font-black text-[#2a2d36]">{item.title || item.description}</p>
              <p className="mt-1 whitespace-pre-line text-[#3d4658]">{item.description}</p>
              {item.note ? <p className="mt-1 whitespace-pre-line text-[#9a6b13]">Note: {item.note}</p> : null}
            </div>,
            item.qty,
            formatCurrency(item.price),
            formatCurrency(lineDiscount(item)),
            formatCurrency(lineTotal(item))
          ])}
        />

        <h2 className="mb-2 mt-5 text-[14px] font-black uppercase text-[#071d3d]">Installment Payments</h2>
        <PreviewTable
          headers={["Installment", "Date", "Status", "Method", "Amount"]}
          rows={installments.map((installment) => [
            installment.label,
            installment.date || "-",
            <span
              key={`${installment.id}-status`}
              className={`rounded-full px-2 py-1 text-[10px] font-black ${
                installment.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              {installment.status === "paid" ? "Paid" : "Pending"}
            </span>,
            installment.method,
            formatCurrency(installment.amount)
          ])}
        />

        <div className="mt-6 grid grid-cols-[1fr_330px] gap-9">
          <div>
            <h2 className="mb-2 text-[14px] font-black uppercase text-[#071d3d]">Payment Summary</h2>
            <p className="whitespace-pre-line text-[11px] leading-snug">{paymentNote}</p>
          </div>
          <div className="text-[12px]">
            <TotalRow label="Subtotal" value={formatCurrency(subtotal)} />
            <TotalRow label="Line Discounts" value={`-${formatCurrency(lineDiscountTotal)}`} warn />
            <TotalRow label="After Line Discount" value={formatCurrency(subtotal - lineDiscountTotal)} />
            <TotalRow label="Invoice Discount" value={`-${formatCurrency(invoiceDiscountAmount)}`} warn />
            <TotalRow label="Tax" value={formatCurrency(taxAmount)} />
            <TotalRow label="Total" value={formatCurrency(total)} strong />
            <TotalRow label="Amount Paid" value={formatCurrency(paidAmount)} paid />
            <TotalRow label="Pending Installments" value={formatCurrency(pendingAmount)} warn />
            <div className="mt-3 border-t-2 border-[#f0dfaf] pt-3">
              <TotalRow label="Balance Due" value={formatCurrency(balanceDue)} strong />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="mb-2 text-[14px] font-black uppercase text-[#071d3d]">Notes</h2>
          <p className="whitespace-pre-line text-[11px]">{notes}</p>
          <p className="mt-2 text-[11px]">
            Warranty Period: <strong>{meta.warrantyPeriod}</strong> | Support Period:{" "}
            <strong>{meta.supportPeriod}</strong>
          </p>
        </div>

        <footer className="mt-5 grid grid-cols-2 gap-10 border-t border-slate-200 pt-3 text-[10px]">
          <div>
            <strong>{company.name}</strong>
            <p className="whitespace-pre-line">{company.address}</p>
          </div>
          <div>
            <strong>Contact Information</strong>
            <p>Phone: {company.phone}</p>
            <p>Email: {company.email}</p>
            <p>Web: {company.website}</p>
          </div>
        </footer>
        <p className="mt-5 text-center text-[9px] text-slate-500">
          This is a computer-generated document and does not require a signature.
        </p>
      </section>
    </article>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[95px_1fr] gap-2">
      <span className="font-black uppercase text-[#aab1bf]">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function TotalRow({
  label,
  value,
  warn = false,
  paid = false,
  strong = false
}: {
  label: string;
  value: string;
  warn?: boolean;
  paid?: boolean;
  strong?: boolean;
}) {
  return (
    <div className={`grid grid-cols-[1fr_auto] gap-3 py-0.5 ${strong ? "font-black text-[#071d3d]" : ""}`}>
      <span className="text-[11px] font-black uppercase text-[#aab1bf]">{label}</span>
      <span className={`${warn ? "text-[#9a6b13]" : ""} ${paid ? "font-black text-emerald-700" : ""}`}>{value}</span>
    </div>
  );
}

function PreviewTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <table className="w-full table-fixed border-collapse text-[11px] leading-snug">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th
              key={header}
              className={`border-t-2 border-[#f0dfaf] bg-[#f2f4f8] px-2 py-2 font-normal uppercase text-[#7f8797] ${
                index === 0 ? "text-left" : "text-right"
              }`}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className="border-b border-[#eef1f5]">
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className={`px-2 py-2 align-top ${cellIndex === 0 ? "text-left" : "text-right"}`}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

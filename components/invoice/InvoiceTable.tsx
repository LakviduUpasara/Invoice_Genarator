"use client";

import { Plus, Trash2 } from "lucide-react";
import type { InvoiceItem } from "@/types/invoice";

interface InvoiceTableProps {
  items: InvoiceItem[];
  onItemChange: (
    id: string,
    field: keyof Omit<InvoiceItem, "id">,
    value: string | number
  ) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: () => void;
}

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function parseNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function InvoiceTable({
  items,
  onItemChange,
  onDeleteItem,
  onAddItem
}: InvoiceTableProps) {
  return (
    <section className="invoice-section mt-6 print:mt-4">
      <div className="overflow-x-auto rounded-xl border border-slate-200 print:overflow-visible">
        <table className="min-w-full table-fixed border-collapse">
          <colgroup>
            <col className="w-[50%]" />
            <col className="w-[12%]" />
            <col className="w-[18%]" />
            <col className="w-[20%]" />
            <col className="w-[10%] print:hidden" />
          </colgroup>
          <thead>
            <tr className="bg-invoice-primary text-left text-sm font-semibold text-white print:text-xs">
              <th className="rounded-tl-xl px-4 py-3 print:px-3 print:py-2">Description</th>
              <th className="px-4 py-3 print:px-3 print:py-2">Qty</th>
              <th className="px-4 py-3 print:px-3 print:py-2">Price</th>
              <th className="px-4 py-3 print:rounded-tr-xl print:px-3 print:py-2">Total</th>
              <th className="rounded-tr-xl px-4 py-3 text-center print:hidden">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {items.map((item) => {
              const rowTotal = item.qty * item.price;

              return (
                <tr key={item.id}>
                  <td className="px-4 py-3 align-top print:px-3 print:py-2">
                    <input
                      value={item.description}
                      onChange={(event) => onItemChange(item.id, "description", event.target.value)}
                      className="invoice-input print:hidden"
                      placeholder="Describe item or service"
                      aria-label="Item Description"
                    />
                    <p className="hidden text-sm text-slate-700 print:block">{item.description || "-"}</p>
                  </td>

                  <td className="px-4 py-3 align-top print:px-3 print:py-2">
                    <input
                      type="number"
                      min={0}
                      step="1"
                      value={item.qty}
                      onChange={(event) => onItemChange(item.id, "qty", parseNumber(event.target.value))}
                      className="invoice-input w-24 print:hidden"
                      aria-label="Item Quantity"
                    />
                    <span className="hidden text-sm text-slate-700 print:inline">{item.qty}</span>
                  </td>

                  <td className="px-4 py-3 align-top print:px-3 print:py-2">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.price}
                      onChange={(event) => onItemChange(item.id, "price", parseNumber(event.target.value))}
                      className="invoice-input w-32 print:hidden"
                      aria-label="Item Price"
                    />
                    <span className="hidden text-sm text-slate-700 print:inline">
                      {formatCurrency(item.price)}
                    </span>
                  </td>

                  <td className="px-4 py-3 align-middle text-sm font-semibold text-slate-800 print:px-3 print:py-2">
                    {formatCurrency(rowTotal)}
                  </td>

                  <td className="px-4 py-3 text-center align-middle print:hidden">
                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="inline-flex items-center justify-center rounded-md border border-red-200 bg-red-50 px-3 py-2 text-red-600 transition hover:bg-red-100"
                      aria-label="Delete Item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}

            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  No items added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={onAddItem}
          className="inline-flex items-center gap-2 rounded-lg bg-invoice-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 print:hidden"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>
    </section>
  );
}

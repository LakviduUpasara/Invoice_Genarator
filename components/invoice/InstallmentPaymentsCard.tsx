"use client";

import { Plus, Trash2 } from "lucide-react";
import type { InstallmentPayment } from "@/types/invoice";

interface InstallmentPaymentsCardProps {
  installments: InstallmentPayment[];
  total: number;
  paidAmount: number;
  pendingAmount: number;
  balanceDue: number;
  onInstallmentChange: (
    id: string,
    field: keyof Omit<InstallmentPayment, "id">,
    value: string | number
  ) => void;
  onAddInstallment: () => void;
  onDeleteInstallment: (id: string) => void;
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

export function InstallmentPaymentsCard({
  installments,
  total,
  paidAmount,
  pendingAmount,
  balanceDue,
  onInstallmentChange,
  onAddInstallment,
  onDeleteInstallment
}: InstallmentPaymentsCardProps) {
  return (
    <section className="invoice-section">
      <div className="mb-3 flex items-center justify-between gap-3 print:mb-2">
        <h2 className="text-sm font-black uppercase tracking-wide text-invoice-primary">
          Installment Payments
        </h2>
        <button
          type="button"
          onClick={onAddInstallment}
          className="inline-flex items-center gap-2 rounded-lg bg-invoice-gold px-3 py-2 text-xs font-bold text-invoice-primary transition hover:opacity-90 print:hidden"
        >
          <Plus className="h-4 w-4" />
          Add Installment
        </button>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-4 print:mb-2 print:grid-cols-4 print:gap-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 print:p-2">
          <p className="text-[11px] font-bold uppercase text-slate-500">Invoice Total</p>
          <p className="mt-1 text-sm font-black text-invoice-primary">{formatCurrency(total)}</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 print:p-2">
          <p className="text-[11px] font-bold uppercase text-emerald-700">Paid</p>
          <p className="mt-1 text-sm font-black text-emerald-700">{formatCurrency(paidAmount)}</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 print:p-2">
          <p className="text-[11px] font-bold uppercase text-amber-700">Pending</p>
          <p className="mt-1 text-sm font-black text-amber-700">{formatCurrency(pendingAmount)}</p>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 print:p-2">
          <p className="text-[11px] font-bold uppercase text-blue-700">Balance Due</p>
          <p className="mt-1 text-sm font-black text-blue-700">{formatCurrency(balanceDue)}</p>
        </div>
      </div>

      <div className="space-y-3 print:hidden">
        {installments.map((installment, index) => (
          <div
            key={installment.id}
            className={`rounded-xl border p-4 ${
              installment.status === "paid"
                ? "border-emerald-200 bg-emerald-50/70"
                : "border-amber-200 bg-amber-50/70"
            }`}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="font-black text-invoice-primary">Installment {index + 1}</p>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    installment.status === "paid"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {installment.status === "paid" ? "Paid" : "Pending"}
                </span>
                <button
                  type="button"
                  onClick={() => onDeleteInstallment(installment.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                  aria-label="Delete Installment"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <label className="invoice-label">Label</label>
            <input
              value={installment.label}
              onChange={(event) => onInstallmentChange(installment.id, "label", event.target.value)}
              className="invoice-input"
              aria-label="Installment Label"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="invoice-label">Payment Date</label>
                <input
                  type="date"
                  value={installment.date}
                  onChange={(event) => onInstallmentChange(installment.id, "date", event.target.value)}
                  className="invoice-input"
                  aria-label="Installment Payment Date"
                />
              </div>
              <div>
                <label className="invoice-label">Status</label>
                <select
                  value={installment.status}
                  onChange={(event) => onInstallmentChange(installment.id, "status", event.target.value)}
                  className="invoice-input"
                  aria-label="Installment Status"
                >
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="invoice-label">Payment Method</label>
                <input
                  value={installment.method}
                  onChange={(event) => onInstallmentChange(installment.id, "method", event.target.value)}
                  className="invoice-input"
                  aria-label="Installment Payment Method"
                />
              </div>
              <div>
                <label className="invoice-label">Amount</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={installment.amount}
                  onChange={(event) =>
                    onInstallmentChange(installment.id, "amount", parseNumber(event.target.value))
                  }
                  className="invoice-input"
                  aria-label="Installment Amount"
                />
              </div>
            </div>

            <label className="invoice-label mt-2">Note</label>
            <input
              value={installment.note}
              onChange={(event) => onInstallmentChange(installment.id, "note", event.target.value)}
              className="invoice-input"
              aria-label="Installment Note"
            />
          </div>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-slate-200 print:block">
        <table className="min-w-full table-fixed border-collapse">
          <colgroup>
            <col className="w-[26%]" />
            <col className="w-[16%]" />
            <col className="w-[16%]" />
            <col className="w-[18%]" />
            <col className="w-[24%]" />
          </colgroup>
          <thead>
            <tr className="bg-slate-100 text-xs uppercase text-slate-500">
              <th className="px-3 py-2 text-left font-bold">Label</th>
              <th className="px-3 py-2 text-right font-bold">Date</th>
              <th className="px-3 py-2 text-right font-bold">Status</th>
              <th className="px-3 py-2 text-right font-bold">Amount</th>
              <th className="px-3 py-2 text-right font-bold">Method / Note</th>
            </tr>
          </thead>
          <tbody>
            {installments.map((installment) => (
              <tr key={installment.id} className="border-t border-slate-200">
                <td className="px-3 py-2 text-left text-xs text-slate-800">{installment.label || "-"}</td>
                <td className="px-3 py-2 text-right text-xs text-slate-700">{installment.date || "-"}</td>
                <td className="px-3 py-2 text-right text-xs">
                  <span
                    className={`rounded-full px-2 py-1 font-bold ${
                      installment.status === "paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {installment.status === "paid" ? "Paid" : "Pending"}
                  </span>
                </td>
                <td className="px-3 py-2 text-right text-xs font-bold text-slate-800">
                  {formatCurrency(installment.amount)}
                </td>
                <td className="px-3 py-2 text-right text-xs text-slate-700">
                  {[installment.method, installment.note].filter(Boolean).join(" / ") || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

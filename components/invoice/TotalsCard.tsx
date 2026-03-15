"use client";

interface TotalsCardProps {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  onTaxRateChange: (value: number) => void;
  onDiscountChange: (value: number) => void;
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

export function TotalsCard({
  subtotal,
  taxRate,
  taxAmount,
  discount,
  total,
  onTaxRateChange,
  onDiscountChange
}: TotalsCardProps) {
  return (
    <section className="invoice-section w-full max-w-sm rounded-xl border border-slate-200 bg-slate-50 p-5 print:ml-auto print:w-[44%] print:max-w-none">
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-600">Subtotal</span>
          <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="text-slate-600">Tax (%)</label>
          <input
            type="number"
            min={0}
            step="0.1"
            value={taxRate}
            onChange={(event) => onTaxRateChange(parseNumber(event.target.value))}
            className="invoice-input w-24 text-right print:hidden"
            aria-label="Tax Rate"
          />
          <span className="hidden font-semibold text-slate-900 print:inline">{taxRate}%</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-600">Tax Amount</span>
          <span className="font-semibold text-slate-900">{formatCurrency(taxAmount)}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="text-slate-600">Discount</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={discount}
            onChange={(event) => onDiscountChange(parseNumber(event.target.value))}
            className="invoice-input w-24 text-right print:hidden"
            aria-label="Discount Amount"
          />
          <span className="hidden font-semibold text-slate-900 print:inline">
            {formatCurrency(discount)}
          </span>
        </div>
      </div>

      <div className="my-4 border-t border-slate-200" />

      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-slate-700">Total</span>
        <span className="text-2xl font-extrabold text-invoice-accent">{formatCurrency(total)}</span>
      </div>
    </section>
  );
}

"use client";

interface TotalsCardProps {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountType: "amount" | "percent";
  discountValue: number;
  discountAmount: number;
  total: number;
  onTaxRateChange: (value: number) => void;
  onDiscountTypeChange: (value: "amount" | "percent") => void;
  onDiscountValueChange: (value: number) => void;
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
  discountType,
  discountValue,
  discountAmount,
  total,
  onTaxRateChange,
  onDiscountTypeChange,
  onDiscountValueChange
}: TotalsCardProps) {
  return (
    <section className="invoice-section w-full max-w-sm rounded-xl border border-slate-200 bg-slate-50 p-5 print:ml-auto print:w-[44%] print:max-w-none print:p-3.5">
      <div className="space-y-3 text-sm print:space-y-2 print:text-xs">
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
          <label className="text-slate-600">Discount Type</label>
          <select
            value={discountType}
            onChange={(event) => onDiscountTypeChange(event.target.value as "amount" | "percent")}
            className="invoice-input w-24 text-right print:hidden"
            aria-label="Discount Type"
          >
            <option value="amount">Price</option>
            <option value="percent">%</option>
          </select>
          <span className="hidden font-semibold text-slate-900 print:inline">
            {discountType === "percent" ? "%" : "Price"}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="text-slate-600">{discountType === "percent" ? "Discount (%)" : "Discount"}</label>
          <input
            type="number"
            min={0}
            max={discountType === "percent" ? 100 : undefined}
            step={discountType === "percent" ? "0.1" : "0.01"}
            value={discountValue}
            onChange={(event) => onDiscountValueChange(parseNumber(event.target.value))}
            className="invoice-input w-24 text-right print:hidden"
            aria-label="Discount Value"
            placeholder={discountType === "percent" ? "10" : "0.00"}
          />
          <span className="hidden font-semibold text-slate-900 print:inline">
            {discountType === "percent" ? `${discountValue}%` : formatCurrency(discountValue)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-600">Discount Amount</span>
          <span className="font-semibold text-slate-900">{formatCurrency(discountAmount)}</span>
        </div>
      </div>

      <div className="my-4 border-t border-slate-200 print:my-2.5" />

      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-slate-700 print:text-sm">Total</span>
        <span className="text-2xl font-extrabold text-invoice-accent print:text-lg">
          {formatCurrency(total)}
        </span>
      </div>
    </section>
  );
}

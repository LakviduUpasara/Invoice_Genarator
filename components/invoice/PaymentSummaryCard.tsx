"use client";

interface PaymentSummaryCardProps {
  note: string;
  onChange: (value: string) => void;
}

export function PaymentSummaryCard({ note, onChange }: PaymentSummaryCardProps) {
  return (
    <section className="invoice-section rounded-xl border border-slate-200 bg-slate-50 p-5">
      <h2 className="text-sm font-bold uppercase tracking-wide text-invoice-primary">
        Payment Summary
      </h2>

      <div className="mt-4">
        <label className="invoice-label">Note</label>
        <textarea
          value={note}
          onChange={(event) => onChange(event.target.value)}
          className="invoice-textarea min-h-[110px] print:hidden"
          aria-label="Payment Summary Note"
        />
        <p className="hidden whitespace-pre-line px-3 py-2 text-sm text-slate-700 print:block">
          {note}
        </p>
      </div>
    </section>
  );
}

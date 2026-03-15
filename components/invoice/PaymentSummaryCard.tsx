"use client";

interface PaymentSummaryCardProps {
  note: string;
  onChange: (value: string) => void;
}

export function PaymentSummaryCard({ note, onChange }: PaymentSummaryCardProps) {
  return (
    <section className="invoice-section">
      <h2 className="text-sm font-bold uppercase tracking-wide text-invoice-primary">
        Payment Summary
      </h2>

      <div className="mt-3 print:mt-2">
        <label className="invoice-label print:hidden">Note</label>
        <textarea
          value={note}
          onChange={(event) => onChange(event.target.value)}
          className="invoice-textarea min-h-[88px] print:hidden"
          aria-label="Payment Summary Note"
        />
        <p className="hidden whitespace-pre-line px-3 py-2 text-sm text-slate-700 print:block">
          {note}
        </p>
      </div>
    </section>
  );
}

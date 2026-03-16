"use client";

interface PaymentSummaryCardProps {
  note: string;
  onChange: (value: string) => void;
  accountDetails: string;
  onAccountDetailsChange: (value: string) => void;
}

export function PaymentSummaryCard({
  note,
  onChange,
  accountDetails,
  onAccountDetailsChange
}: PaymentSummaryCardProps) {
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

      <div className="mt-4 border-t border-slate-200 pt-4 print:mt-3 print:pt-2.5">
        <label className="invoice-label">Account Details</label>
        <textarea
          value={accountDetails}
          onChange={(event) => onAccountDetailsChange(event.target.value)}
          className="invoice-textarea min-h-[76px] print:hidden"
          aria-label="Account Details"
          placeholder={"Bank: ABC Bank\nAccount Name: Your Company Name\nAccount Number: 1234567890"}
        />
        <p className="hidden whitespace-pre-line px-3 py-2 text-sm text-slate-700 print:block">
          {accountDetails}
        </p>
      </div>
    </section>
  );
}

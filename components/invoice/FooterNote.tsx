"use client";

interface FooterNoteProps {
  message?: string;
}

export function FooterNote({ message = "Thank you for your business." }: FooterNoteProps) {
  return (
    <footer className="invoice-section mt-10 rounded-xl border border-slate-200 bg-slate-100 p-4 text-center text-sm font-medium text-slate-700">
      {message}
    </footer>
  );
}

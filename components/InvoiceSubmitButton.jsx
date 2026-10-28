'use client';

import { useFormStatus } from 'react-dom';
import { LoaderCircle, Send } from 'lucide-react';

export default function InvoiceSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-lakuntza-greenDark px-6 py-4 text-sm font-black text-white transition hover:bg-neutral-950 disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? <LoaderCircle size={18} aria-hidden="true" className="animate-spin" /> : <Send size={18} aria-hidden="true" />}
      {pending ? 'Enviando factura…' : 'Enviar factura para revisión'}
    </button>
  );
}

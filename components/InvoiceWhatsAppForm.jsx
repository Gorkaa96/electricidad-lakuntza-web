'use client';

import { FileText, MessageCircle, Upload } from 'lucide-react';

const whatsappText = encodeURIComponent('Hola Electricidad Lakuntza. Quiero revisar mi factura de luz o gas.');
const whatsappHref = `https://wa.me/34649853448?text=${whatsappText}`;

export default function InvoiceWhatsAppForm() {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-white/[.04] p-5 text-white sm:p-8">
      <p className="text-xs font-black uppercase tracking-[.22em] text-lakuntza-green">Prioridad: luz y gas</p>
      <h3 className="mt-3 text-2xl font-black tracking-[-.05em] sm:text-3xl">La forma más rápida de empezar: sube tu factura</h3>
      <p className="mt-3 text-sm leading-6 text-white/70">
        Una factura permite revisar consumo, potencia, condiciones y servicios añadidos sin visita inicial. Si hay margen, te contactamos y lo explicamos claro.
      </p>

      <div className="mt-7 grid gap-3">
        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[.06] p-4">
          <FileText className="mt-0.5 shrink-0 text-lakuntza-green" size={20} />
          <p className="text-sm leading-6 text-white/65">PDF o imagen de la factura, guardada en un espacio privado para su revisión.</p>
        </div>
        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[.06] p-4">
          <MessageCircle className="mt-0.5 shrink-0 text-lakuntza-green" size={20} />
          <p className="text-sm leading-6 text-white/65">Revisión humana: no prometemos ahorro automático; confirmamos si conviene actuar.</p>
        </div>
      </div>

      <a href="/revision-factura-luz-gas" className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-lakuntza-green px-6 py-4 text-sm font-black text-white shadow-green transition hover:bg-lakuntza-greenDark">
        <Upload className="mr-2" size={18} /> Subir factura gratis
      </a>

      <a href={whatsappHref} className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-sm font-black text-white transition hover:bg-white/15">
        Prefiero WhatsApp
      </a>
    </div>
  );
}

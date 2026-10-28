import { FileText, MessageCircle, ShieldCheck } from 'lucide-react';

const whatsappText = encodeURIComponent('Hola Electricidad Lakuntza. Quiero hacer una consulta desde vuestra web.');
const whatsappHref = `https://wa.me/34649853448?text=${whatsappText}`;

export default function MobileContactBar() {
  return (
    <nav aria-label="Accesos rápidos de contacto" className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-2xl backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        <a href="/revision-factura-luz-gas" className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-lakuntza-greenDark px-2 py-3 text-xs font-black text-white transition hover:bg-neutral-950 sm:text-sm">
          <FileText size={16} aria-hidden="true" /> Luz y gas
        </a>
        <a href="/alarmas-movistar-prosegur" className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-lakuntza-greenDark px-2 py-3 text-xs font-black text-white transition hover:bg-neutral-950 sm:text-sm">
          <ShieldCheck size={16} aria-hidden="true" /> Alarmas
        </a>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-2 py-3 text-xs font-black text-neutral-950 transition hover:bg-neutral-100 sm:text-sm">
          <MessageCircle size={16} aria-hidden="true" /> WhatsApp
        </a>
      </div>
    </nav>
  );
}

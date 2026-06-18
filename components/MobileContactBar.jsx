import { FileText, MessageCircle, Phone } from 'lucide-react';

const whatsappText = encodeURIComponent('Hola Electricidad Lakuntza. Quiero revisar mi factura de luz o gas.');
const whatsappHref = `https://wa.me/34649853448?text=${whatsappText}`;

export default function MobileContactBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-2xl backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-[1.5fr_1fr_1fr] gap-2">
        <a href="/revision-factura-luz-gas" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-lakuntza-green px-3 py-3.5 text-sm font-black text-white shadow-green">
          <FileText size={17} /> Factura
        </a>
        <a href="tel:+34649853448" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-3 py-3.5 text-sm font-black text-white">
          <Phone size={17} /> Llamar
        </a>
        <a href={whatsappHref} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-3.5 text-sm font-black text-neutral-950">
          <MessageCircle size={17} /> WhatsApp
        </a>
      </div>
    </div>
  );
}

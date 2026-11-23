import { LayoutGrid, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';

const whatsappHref = 'https://wa.me/34649853448?text=' + encodeURIComponent('Hola Electricidad Lakuntza. Quiero hacer una consulta desde vuestra web.');

export default function MobileContactBar() {
  const linkClass = 'inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#286B2C]';
  return (
    <nav aria-label="Accesos rápidos de contacto" className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-lg backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        <Link href="/servicios" className={linkClass + ' bg-lakuntza-greenDark text-white hover:bg-neutral-950'}><LayoutGrid size={16} aria-hidden="true" /> Servicios</Link>
        <a href="tel:+34649853448" className={linkClass + ' border border-neutral-300 bg-white text-neutral-950 hover:bg-neutral-100'}><Phone size={16} aria-hidden="true" /> Llamar</a>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={linkClass + ' border border-neutral-300 bg-white text-neutral-950 hover:bg-neutral-100'}><MessageCircle size={16} aria-hidden="true" /> WhatsApp</a>
      </div>
    </nav>
  );
}

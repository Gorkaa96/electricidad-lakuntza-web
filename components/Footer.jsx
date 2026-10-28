import Image from 'next/image';
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

const whatsappHref = 'https://wa.me/34649853448?text=' + encodeURIComponent('Hola Electricidad Lakuntza. Quiero hacer una consulta.');
const links = [
  ['Luz y gas', '/revision-factura-luz-gas'],
  ['Alarmas', '/alarmas-movistar-prosegur'],
  ['Instalaciones', '/servicios'],
  ['Trabajos realizados', '/trabajos-realizados'],
  ['Feníe Energía', '/#fenie'],
];

export default function Footer() {
  return (
    <footer className="bg-[#101411] pb-28 pt-16 text-white md:pb-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="lg:col-span-5">
          <a href="/#inicio" className="inline-flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white"><Image src="/logo-lakuntza.png" alt="" width={48} height={48} className="h-full w-full object-contain" /></span>
            <span className="text-base font-black">Electricidad Lakuntza</span>
          </a>
          <p className="mt-6 max-w-md text-sm leading-7 text-white/65">Revisamos facturas de luz y gas de clientes de toda España, mediante Feníe Energía. También realizamos instalaciones y telecomunicaciones en Navarra y País Vasco, según disponibilidad.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="/revision-factura-luz-gas" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-lakuntza-greenDark px-5 py-3 text-sm font-black text-white transition hover:bg-lakuntza-green">Luz y gas <ArrowRight size={16}/></a>
            <a href="/alarmas-movistar-prosegur" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-lakuntza-greenDark px-5 py-3 text-sm font-black text-white transition hover:bg-lakuntza-green">Alarmas <ArrowRight size={16}/></a>
          </div>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[.14em] text-[#A9ED82]">Servicios</p>
            <nav className="mt-5 grid gap-3 text-sm font-bold text-white/75" aria-label="Enlaces del pie de página">
              {links.map(([label,href]) => <a key={href} href={href} className="hover:text-white">{label}</a>)}
            </nav>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[.14em] text-[#A9ED82]">Contacto</p>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-white/75">
              <a href="tel:+34649853448" className="inline-flex items-start gap-3 hover:text-white"><Phone size={17} className="mt-1 shrink-0 text-[#A9ED82]"/>649 853 448</a>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-3 hover:text-white"><MessageCircle size={17} className="mt-1 shrink-0 text-[#A9ED82]"/>WhatsApp</a>
              <a href="mailto:eleclakuntza@yahoo.es" className="inline-flex items-start gap-3 break-all hover:text-white"><Mail size={17} className="mt-1 shrink-0 text-[#A9ED82]"/>eleclakuntza@yahoo.es</a>
              <span className="inline-flex items-start gap-3"><MapPin size={17} className="mt-1 shrink-0 text-[#A9ED82]"/>Uriz Kalea 27 · 31830 Lakuntza, Navarra</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-wrap justify-between gap-4 border-t border-white/15 px-4 pt-7 text-xs text-white/55 sm:px-6 lg:px-8">
        <span>© {new Date().getFullYear()} Electricidad Lakuntza.</span>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Información legal"><a href="/aviso-legal" className="hover:text-white">Aviso legal</a><a href="/privacidad" className="hover:text-white">Privacidad</a><a href="/cookies" className="hover:text-white">Cookies</a></nav>
      </div>
    </footer>
  );
}

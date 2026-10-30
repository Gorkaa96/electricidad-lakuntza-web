import Image from 'next/image';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

const whatsappHref = 'https://wa.me/34649853448?text=' + encodeURIComponent('Hola Electricidad Lakuntza. Quiero hacer una consulta.');

const links = [
  ['Revisión de luz y gas', '/revision-factura-luz-gas'],
  ['Alarmas', '/alarmas-movistar-prosegur'],
  ['Instalaciones', '/servicios'],
  ['Trabajos realizados', '/trabajos-realizados'],
];

export default function Footer() {
  return (
    <footer className="bg-[#132018] pb-28 pt-16 text-white md:pb-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-8">
        <div className="lg:col-span-5">
          <a href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
              <Image src="/logo-lakuntza.png" alt="" width={44} height={44} className="h-full w-full object-contain" />
            </span>
            <span className="text-base font-semibold">Electricidad Lakuntza</span>
          </a>
          <p className="mt-6 max-w-sm text-sm leading-7 text-white/65">
            Revisión de luz y gas a través de Feníe Energía, consultas de alarmas e instalaciones eléctricas según disponibilidad.
          </p>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7">
          <div>
            <p className="text-sm font-semibold text-white">Servicios</p>
            <nav className="mt-5 grid gap-3 text-sm text-white/70" aria-label="Servicios en el pie de página">
              {links.map(([label, href]) => <a key={href} href={href} className="transition-colors hover:text-white">{label}</a>)}
            </nav>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Contacto</p>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-white/70">
              <a href="tel:+34649853448" className="inline-flex items-start gap-3 transition-colors hover:text-white"><Phone size={17} className="mt-1 shrink-0" aria-hidden="true"/>649 853 448</a>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-3 transition-colors hover:text-white"><MessageCircle size={17} className="mt-1 shrink-0" aria-hidden="true"/>WhatsApp</a>
              <a href="mailto:eleclakuntza@yahoo.es" className="inline-flex items-start gap-3 break-all transition-colors hover:text-white"><Mail size={17} className="mt-1 shrink-0" aria-hidden="true"/>eleclakuntza@yahoo.es</a>
              <span className="inline-flex items-start gap-3"><MapPin size={17} className="mt-1 shrink-0" aria-hidden="true"/>Lakuntza, Navarra</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-wrap justify-between gap-4 border-t border-white/15 px-4 pt-7 text-xs text-white/55 sm:px-6 lg:px-8">
        <span>© {new Date().getFullYear()} Electricidad Lakuntza.</span>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Información legal">
          <a href="/aviso-legal" className="hover:text-white">Aviso legal</a>
          <a href="/privacidad" className="hover:text-white">Privacidad</a>
          <a href="/cookies" className="hover:text-white">Cookies</a>
        </nav>
      </div>
    </footer>
  );
}

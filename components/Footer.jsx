import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

const whatsappHref = 'https://wa.me/34649853448?text=' + encodeURIComponent('Hola Electricidad Lakuntza. Quiero hacer una consulta.');

const links = [
  ['Revisión de luz y gas', '/revision-factura-luz-gas'],
  ['Alarmas', '/alarmas-movistar-prosegur'],
  ['Cargadores eléctricos', '/cargadores-electricos'],
  ['Asesoría energética', '/asesoria-energetica'],
];

export default function Footer() {
  return (
    <footer className="bg-[#132018] pb-28 pt-16 text-white md:pb-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-8">
        <div className="lg:col-span-5">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
              <Image src="/logo-lakuntza.png" alt="" width={44} height={44} className="h-full w-full object-contain" />
            </span>
            <span className="text-base font-semibold">Electricidad Lakuntza</span>
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-7 text-white/65">
            Agentes de Feníe Energía para luz y gas y comerciales de alarmas. Electricidad Lakuntza realiza directamente instalaciones de cargadores eléctricos y asesoría energética.
          </p>
          <a href="https://www.fenieenergia.es/es/sobre-fenie/historia" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[#B8EAA7] underline underline-offset-4 hover:text-white">
            ¿Qué es Feníe Energía? Visita su web oficial
          </a>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7">
          <div>
            <p className="text-sm font-semibold text-white">Servicios</p>
            <nav className="mt-5 grid gap-3 text-sm text-white/70" aria-label="Servicios en el pie de página">
              {links.map(([label, href]) => <Link key={href} href={href} className="transition-colors hover:text-white">{label}</Link>)}
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
          <Link href="/aviso-legal" className="hover:text-white">Aviso legal</Link>
          <Link href="/privacidad" className="hover:text-white">Privacidad</Link>
          <Link href="/cookies" className="hover:text-white">Cookies</Link>
        </nav>
      </div>
    </footer>
  );
}

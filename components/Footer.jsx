import Image from 'next/image';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

const whatsappText = encodeURIComponent('Hola Electricidad Lakuntza. Quiero hacer una consulta desde la web.');
const whatsappHref = `https://wa.me/34649853448?text=${whatsappText}`;

const mainLinks = [
  ['Servicios', '/servicios'],
  ['Trabajos realizados', '/trabajos-realizados'],
  ['Luz y gas', '/#energia'],
  ['Zona de servicio', '/zona-servicio'],
  ['Contacto', '/#contacto'],
];

const legalLinks = [
  ['Aviso legal', '/aviso-legal'],
  ['Privacidad', '/privacidad'],
  ['Cookies', '/cookies'],
];

export default function Footer() {
  return (
    <footer className="bg-neutral-950 pb-28 pt-14 text-white md:pb-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-4">
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
              <Image src="/logo-lakuntza.png" alt="Electricidad Lakuntza" width={56} height={56} className="h-full w-full rounded-full object-contain" />
            </span>
            <div>
              <p className="text-base font-black text-white">Electricidad Lakuntza · Elektrizitatea</p>
              <p className="mt-1 text-sm text-white/60">Instalaciones eléctricas · Telecomunicaciones · Energía</p>
            </div>
          </div>

          <p className="mt-6 max-w-md text-sm leading-7 text-white/60">
            Servicio cercano desde Lakuntza para viviendas, comunidades, comercios y pequeñas empresas en Navarra y País Vasco.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a href="tel:+34649853448" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-neutral-950 transition hover:bg-lakuntza-mist">
              <Phone size={17} /> Llamar
            </a>
            <a href={whatsappHref} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-lakuntza-green px-4 py-3 text-sm font-black text-white shadow-green transition hover:bg-lakuntza-greenDark">
              <MessageCircle size={17} /> WhatsApp
            </a>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3 lg:col-span-7">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-green">Navegación</p>
            <nav className="mt-4 grid gap-3 text-sm font-bold text-white/70">
              {mainLinks.map(([label, href]) => (
                <a key={href} href={href} className="transition hover:text-white">{label}</a>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-green">Contacto</p>
            <div className="mt-4 grid gap-3 text-sm text-white/70">
              <a href="tel:+34649853448" className="inline-flex items-start gap-2 transition hover:text-white"><Phone size={16} className="mt-0.5 shrink-0 text-lakuntza-green" />649 853 448</a>
              <a href="mailto:eleclakuntza@yahoo.es" className="inline-flex items-start gap-2 break-all transition hover:text-white"><Mail size={16} className="mt-0.5 shrink-0 text-lakuntza-green" />eleclakuntza@yahoo.es</a>
              <span className="inline-flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-lakuntza-green" />Uriz Kalea, 27 · 31830 Lakuntza, Navarra</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-green">Legal</p>
            <nav className="mt-4 grid gap-3 text-sm font-bold text-white/70">
              {legalLinks.map(([label, href]) => (
                <a key={href} href={href} className="transition hover:text-white">{label}</a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 px-4 pt-6 text-xs leading-6 text-white/40 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Electricidad Lakuntza. Todos los derechos reservados.
      </div>
    </footer>
  );
}

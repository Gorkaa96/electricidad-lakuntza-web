'use client';

import { useState } from 'react';
import { Menu, MessageCircle, Phone, X } from 'lucide-react';
import Logo from './Logo';

const whatsappText = encodeURIComponent('Hola Electricidad Lakuntza. Quiero hacer una consulta desde la web.');
const whatsappHref = `https://wa.me/34649853448?text=${whatsappText}`;

const navItems = [
  ['Servicios', '/servicios'],
  ['Trabajos', '/#trabajos'],
  ['Luz y gas', '/#energia'],
  ['Proceso', '/#proceso'],
  ['Zona', '/zona-servicio'],
  ['Contacto', '/#contacto'],
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200 bg-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/#inicio" aria-label="Ir al inicio" onClick={() => setOpen(false)} className="shrink-0">
          <Logo compact />
        </a>

        <nav className="hidden items-center gap-7 text-sm font-black text-neutral-700 xl:flex" aria-label="Navegación principal">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} className="rounded-full px-1 py-2 transition hover:text-lakuntza-greenDark">
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <a href="tel:+34649853448" className="rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-black text-neutral-900 shadow-sm transition hover:border-lakuntza-green hover:text-lakuntza-greenDark">
            649 853 448
          </a>
          <a href="/#contacto" className="rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-black text-white shadow-lg transition hover:bg-lakuntza-greenDark">
            Pedir presupuesto
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-950 shadow-sm xl:hidden"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-neutral-200 bg-white px-4 py-5 shadow-2xl xl:hidden">
          <div className="mx-auto grid max-w-7xl gap-5">
            <div className="rounded-[1.6rem] border border-lakuntza-line bg-lakuntza-mist p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">Electricidad Lakuntza</p>
              <p className="mt-2 text-sm leading-6 text-neutral-600">Instalaciones eléctricas, telecomunicaciones y asesoría energética en Navarra y País Vasco.</p>
            </div>

            <nav className="grid gap-1 text-sm font-black text-neutral-800" aria-label="Navegación móvil">
              {navItems.map(([label, href]) => (
                <a key={href} href={href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 transition hover:bg-neutral-50">
                  {label}
                </a>
              ))}
            </nav>

            <div className="grid grid-cols-2 gap-2">
              <a href="tel:+34649853448" onClick={() => setOpen(false)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-black text-white">
                <Phone size={17} /> Llamar
              </a>
              <a href={whatsappHref} onClick={() => setOpen(false)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-lakuntza-green px-4 py-3 text-sm font-black text-white shadow-green">
                <MessageCircle size={17} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

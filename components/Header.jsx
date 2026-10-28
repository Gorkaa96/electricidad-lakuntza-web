'use client';

import { useState } from 'react';
import { ArrowRight, FileText, Menu, X } from 'lucide-react';
import Logo from './Logo';

const navigation = [
  ['Luz y gas', '/revision-factura-luz-gas'],
  ['Instalaciones', '/servicios'],
  ['Alarmas', '/alarmas-movistar-prosegur'],
  ['Contacto', '/#contacto'],
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <a href="/#inicio" aria-label="Electricidad Lakuntza, inicio" className="shrink-0" onClick={() => setOpen(false)}>
          <Logo compact />
        </a>
        <nav className="hidden items-center gap-6 text-sm font-bold text-neutral-700 xl:flex" aria-label="Navegación principal">
          {navigation.map(([label, href]) => (
            <a key={href} href={href} className="whitespace-nowrap transition hover:text-lakuntza-greenDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lakuntza-greenDark">{label}</a>
          ))}
        </nav>
        <a href="/revision-factura-luz-gas" className="hidden shrink-0 items-center justify-center gap-2 rounded-xl bg-lakuntza-greenDark px-5 py-3 text-sm font-black text-white transition hover:bg-neutral-950 xl:inline-flex">
          <FileText size={17} /> Revisión gratuita
        </a>
        <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="public-nav-mobile" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} className="focus-ring inline-flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-300 text-neutral-950 xl:hidden">
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>
      <div id="public-nav-mobile" className={open ? 'max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-neutral-200 bg-white px-4 pb-5 pt-3 shadow-lg xl:hidden' : 'hidden'}>
        <nav className="mx-auto grid max-w-7xl gap-1" aria-label="Navegación móvil">
          {navigation.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-bold text-neutral-900 hover:bg-neutral-100">{label}</a>)}
          <a href="/revision-factura-luz-gas" onClick={() => setOpen(false)} className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-lakuntza-greenDark px-4 py-3 text-sm font-black text-white">
            Revisar mi factura <ArrowRight size={17} />
          </a>
        </nav>
      </div>
    </header>
  );
}

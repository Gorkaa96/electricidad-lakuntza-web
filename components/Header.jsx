'use client';

import { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import Logo from './Logo';

const navigation = [
  ['Luz y gas', '/revision-factura-luz-gas'],
  ['Alarmas', '/alarmas-movistar-prosegur'],
  ['Instalaciones', '/servicios'],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#E3E9E2] bg-white/95 backdrop-blur-md">
      <a href="#contenido-principal" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[90] focus:rounded-lg focus:bg-[#235E2C] focus:px-4 focus:py-3 focus:text-white">
        Ir al contenido
      </a>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <a href="/" aria-label="Electricidad Lakuntza, página de inicio" className="shrink-0" onClick={() => setOpen(false)}>
          <Logo compact />
        </a>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-[#334139] lg:flex" aria-label="Navegación principal">
          {navigation.map(([label, href]) => (
            <a key={href} href={href} className="whitespace-nowrap transition-colors hover:text-[#2F7C36]">{label}</a>
          ))}
        </nav>
        <div className="hidden lg:flex">
          <a href="/#contacto" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#24662D] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#194D20]">
            Contactar <ArrowRight size={16} aria-hidden="true"/>
          </a>
        </div>
        <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="public-nav-mobile" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#D6DED4] text-[#152017] lg:hidden">
          {open ? <X size={23} aria-hidden="true"/> : <Menu size={23} aria-hidden="true"/>}
        </button>
      </div>
      <div id="public-nav-mobile" className={open ? 'max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain border-t border-[#E2E9E0] bg-white px-4 py-4 shadow-lg lg:hidden' : 'hidden'}>
        <nav className="mx-auto grid max-w-7xl gap-1" aria-label="Navegación móvil">
          {navigation.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="flex min-h-12 items-center rounded-xl px-4 py-3 text-base font-semibold text-neutral-800 transition-colors hover:bg-[#F0F6ED]">{label}</a>
          ))}
          <a href="/#contacto" onClick={() => setOpen(false)} className="mt-2 flex min-h-12 items-center justify-center rounded-xl bg-[#24662D] px-4 py-3 text-sm font-semibold text-white">Contactar</a>
        </nav>
      </div>
    </header>
  );
}

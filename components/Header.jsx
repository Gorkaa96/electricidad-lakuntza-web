'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

const navItems = [
  ['Servicios', '#servicios'],
  ['Luz y gas', '#energia'],
  ['Proceso', '#proceso'],
  ['Zona', '#zona'],
  ['Contacto', '#contacto'],
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#inicio" aria-label="Ir al inicio">
          <Logo compact />
        </a>

        <nav className="hidden items-center gap-7 text-sm font-black text-neutral-700 lg:flex" aria-label="Navegación principal">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} className="transition hover:text-lakuntza-greenDark">
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href="tel:+34649853448" className="rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-black shadow-sm transition hover:border-lakuntza-green hover:text-lakuntza-greenDark">
            649 853 448
          </a>
          <a href="#contacto" className="rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-black text-white shadow-lg transition hover:bg-lakuntza-greenDark">
            Pedir presupuesto
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 bg-white lg:hidden"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-neutral-200 bg-white px-4 py-4 lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1 text-sm font-black text-neutral-700">
            {navItems.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 hover:bg-neutral-50">
                {label}
              </a>
            ))}
            <a href="tel:+34649853448" className="mt-2 rounded-2xl bg-neutral-950 px-4 py-3 text-center text-white">
              Llamar ahora
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

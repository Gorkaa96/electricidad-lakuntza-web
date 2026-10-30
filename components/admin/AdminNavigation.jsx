'use client';

import { usePathname } from 'next/navigation';
import { FileText, FolderOpen, ExternalLink } from 'lucide-react';

const navItems = [
  { href: '/admin/facturas', label: 'Solicitudes', icon: FileText },
  { href: '/admin/proyectos', label: 'Trabajos', icon: FolderOpen },
  { href: '/', label: 'Ver web', icon: ExternalLink },
];

export default function AdminNavigation({ compact = false }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación del administrador"
      className={compact ? 'grid grid-cols-3 gap-2' : 'grid gap-2'}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const current = item.href !== '/' && (pathname === item.href || pathname.startsWith(item.href + '/'));
        return (
          <a
            key={item.href}
            href={item.href}
            aria-current={current ? 'page' : undefined}
            className={
              compact
                ? `inline-flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-[11px] font-bold sm:flex-row sm:text-xs ${current ? 'border-lakuntza-greenDark bg-[#EAF5E4] text-lakuntza-greenDark' : 'border-neutral-200 bg-white text-neutral-700'}`
                : `flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${current ? 'bg-[#EAF5E4] text-lakuntza-greenDark ring-1 ring-[#C6E8BB]' : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950'}`
            }
          >
            <Icon aria-hidden="true" size={compact ? 17 : 19} className="shrink-0" />
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}

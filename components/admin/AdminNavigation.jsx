'use client';

import { usePathname } from 'next/navigation';
import { ExternalLink, UsersRound, LayoutDashboard, BriefcaseBusiness, ReceiptText } from 'lucide-react';
import { canViewLeads, hasPermission } from '@/lib/rolePermissions';
import { siteUrl } from '@/lib/site';

const navItems = [
  { href: '/admin/resumen', label: 'Resumen', icon: LayoutDashboard, allowed: canViewLeads },
  { href: '/admin/oportunidades', label: 'Oportunidades', icon: BriefcaseBusiness, allowed: canViewLeads },
  { href: '/admin/facturas', label: 'Facturas', icon: ReceiptText, allowed: canViewLeads },
  { href: '/admin/usuarios', label: 'Usuarios', icon: UsersRound, allowed: (member) => hasPermission(member, 'users.manage') },
  { href: siteUrl, label: 'Ver web', icon: ExternalLink, allowed: () => true, external: true },
];

export default function AdminNavigation({ compact = false, member }) {
  const pathname = usePathname();
  const visible = navItems.filter((item) => item.allowed(member));

  return (
    <nav aria-label="Navegación del administrador" className={compact ? 'grid grid-cols-3 gap-2 sm:grid-cols-6' : 'grid gap-2'}>
      {visible.map((item) => {
        const Icon = item.icon;
        const current = !item.external && (pathname === item.href || pathname.startsWith(item.href + '/'));
        return (
          <a key={item.href} href={item.href} aria-current={current ? 'page' : undefined}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            className={compact
              ? `inline-flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-[11px] font-bold sm:flex-row sm:text-xs ${current ? 'border-lakuntza-greenDark bg-[#EAF5E4] text-lakuntza-greenDark' : 'border-neutral-200 bg-white text-neutral-700'}`
              : `flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${current ? 'bg-[#1B4E3D] text-white' : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950'}`}
          >
            <Icon aria-hidden="true" size={compact ? 17 : 19} className="shrink-0" />
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}

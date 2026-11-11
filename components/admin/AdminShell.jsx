import Logo from '@/components/Logo';
import { signOutAdmin } from '@/app/admin/actions';
import AdminNavigation from './AdminNavigation';
import { getAdminContext } from '@/lib/admin';
import { ROLE_LABELS } from '@/lib/rolePermissions';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export default async function AdminShell({ children, title, description, action }) {
 const {admin}=await getAdminContext();
 return <div className="crm min-h-screen bg-[#F3F5F6] text-[#182A25]">
  <a href="#admin-contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-white focus:p-4">Ir al contenido</a>
  <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-[#DAE2DF] bg-white lg:flex">
   <div className="border-b border-[#E5EBE8] px-6 py-6"><a href="/admin/entrada"><Logo compact /></a><p className="mt-5 text-sm font-semibold text-[#325C4D]">CRM interno</p></div>
   <div className="flex-1 px-3 py-6"><AdminNavigation member={admin}/></div>
   <div className="border-t border-[#E5EBE8] p-5">
    <div className="mb-4 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EDF4EF] text-[#28634D]"><ShieldCheck size={18} aria-hidden="true"/></span><div><p className="text-sm font-semibold">{ROLE_LABELS[admin?.role]||'Equipo'}</p><p className="text-xs text-[#586B63]">Acceso privado</p></div></div>
    <form action={signOutAdmin}><button className="min-h-11 w-full rounded-lg border border-[#D6DFDA] px-4 py-2 text-sm font-semibold hover:bg-[#F2F6F3]">Cerrar sesión</button></form>
   </div>
  </aside>
  <main className="min-w-0 lg:pl-64">
   <div className="sticky top-0 z-30 border-b border-[#DDE4E0] bg-white px-4 py-3 lg:hidden">
    <div className="flex items-center justify-between gap-4"><a href="/admin/entrada"><Logo compact/></a><form action={signOutAdmin}><button className="min-h-11 rounded-lg border px-4 text-sm">Salir</button></form></div>
    <div className="mt-3"><AdminNavigation compact member={admin}/></div>
   </div>
   <div className="hidden h-14 items-center justify-between border-b border-[#DFE6E2] bg-white px-8 lg:flex"><p className="text-sm text-[#53675D]">Electricidad Lakuntza <span className="mx-3 text-[#ADBEB4]">/</span> Gestión comercial</p><a href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#325C4D]">Ver web cliente <ExternalLink size={14} aria-hidden="true"/></a></div>
   <header className="mx-auto max-w-[1440px] px-4 pb-6 pt-7 sm:px-6 lg:px-8 lg:pt-9">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-3xl font-semibold tracking-[-.035em]">{title}</h1>{description?<p className="mt-2 max-w-3xl text-sm leading-6 text-[#586B63]">{description}</p>:null}</div>{action}</div>
   </header>
   <div id="admin-contenido" className="mx-auto max-w-[1440px] px-4 pb-12 sm:px-6 lg:px-8">{children}</div>
  </main>
 </div>;
}

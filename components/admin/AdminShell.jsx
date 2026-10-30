import Logo from '@/components/Logo';
import { signOutAdmin } from '@/app/admin/actions';
import AdminNavigation from './AdminNavigation';

export default function AdminShell({ children, title, description, action }) {
  return (
    <div className="min-h-screen bg-[#F5F7F4] text-neutral-950">
      <a href="#admin-contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-xl focus:bg-white focus:p-4">
        Ir al contenido
      </a>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-neutral-200 bg-white lg:flex">
        <div className="border-b border-neutral-200 px-7 py-7">
          <a href="/admin/facturas" aria-label="Electricidad Lakuntza, panel de gestión">
            <Logo compact />
          </a>
          <p className="mt-4 text-xs font-semibold text-neutral-500">Panel privado de gestión</p>
        </div>
        <div className="flex-1 px-4 py-6">
          <AdminNavigation />
        </div>
        <div className="border-t border-neutral-200 p-5">
          <p className="mb-4 text-xs leading-5 text-neutral-600">Datos y facturas de clientes. Utiliza el panel solo desde un dispositivo autorizado.</p>
          <form action={signOutAdmin}>
            <button className="min-h-11 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-100">
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 lg:pl-72">
        <div className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <a href="/admin/facturas" aria-label="Electricidad Lakuntza, panel de gestión"><Logo compact /></a>
            <form action={signOutAdmin}>
              <button className="min-h-10 rounded-xl border border-neutral-300 px-4 text-xs font-semibold text-neutral-700">Salir</button>
            </form>
          </div>
          <div className="mt-3"><AdminNavigation compact /></div>
        </div>

        <header className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-10 lg:py-10">
            <div className="mb-5 h-1 w-12 rounded-full bg-lakuntza-greenDark" aria-hidden="true" />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-neutral-500">Electricidad Lakuntza · Gestión</p>
                <h1 className="mt-2 text-3xl font-extrabold tracking-[-.04em] text-neutral-950 sm:text-4xl">{title}</h1>
                {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">{description}</p> : null}
              </div>
              {action}
            </div>
          </div>
        </header>

        <div id="admin-contenido" className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}

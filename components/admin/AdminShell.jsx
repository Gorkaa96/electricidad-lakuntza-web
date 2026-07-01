import Logo from '@/components/Logo';
import { signOutAdmin } from '@/app/admin/actions';

const navItems = [
  { href: '/admin/proyectos', label: 'Trabajos' },
  { href: '/admin/facturas', label: 'Facturas' },
  { href: '/trabajos-realizados', label: 'Web pública' },
];

export default function AdminShell({ children, title, description, action }) {
  return (
    <div className="min-h-screen bg-lakuntza-mist text-neutral-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-neutral-200 bg-white p-6 lg:block">
        <a href="/admin/proyectos" aria-label="Ir al panel privado">
          <Logo compact />
        </a>

        <nav className="mt-10 grid gap-2 text-sm font-black text-neutral-700" aria-label="Navegación del panel">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="rounded-2xl px-4 py-3 transition hover:bg-neutral-50">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 grid gap-3">
          <p className="rounded-2xl bg-[#F3FAEF] px-4 py-3 text-xs font-bold leading-5 text-lakuntza-greenDark">
            Panel privado de Electricidad Lakuntza. Gestiona solo datos necesarios y no compartas facturas fuera del proceso.
          </p>
          <form action={signOutAdmin}>
            <button className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-black text-neutral-700 transition hover:border-lakuntza-green">
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <main className="lg:pl-64">
        <div className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <a href="/admin/proyectos" aria-label="Ir al panel privado">
              <Logo compact />
            </a>
            <form action={signOutAdmin}>
              <button className="rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-black text-neutral-700 transition hover:border-lakuntza-green">
                Salir
              </button>
            </form>
          </div>
          <nav className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-black text-neutral-700" aria-label="Navegación del panel">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="rounded-2xl border border-neutral-200 bg-white px-3 py-3">
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <header className="border-b border-neutral-200 bg-white/90 px-4 py-5 backdrop-blur sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">Panel privado</p>
              <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-neutral-950">{title}</h1>
              {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">{description}</p> : null}
            </div>
            {action}
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}

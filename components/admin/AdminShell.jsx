import Logo from '@/components/Logo';
import { signOutAdmin } from '@/app/admin/actions';

export default function AdminShell({ children, title, description, action }) {
  return (
    <div className="min-h-screen bg-lakuntza-mist text-neutral-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-neutral-200 bg-white p-6 lg:block">
        <Logo compact />
        <nav className="mt-10 grid gap-2 text-sm font-black text-neutral-700">
          <a href="/admin/proyectos" className="rounded-2xl bg-neutral-950 px-4 py-3 text-white">Proyectos</a>
          <a href="/trabajos-realizados" target="_blank" className="rounded-2xl px-4 py-3 hover:bg-neutral-50">Ver web pública</a>
        </nav>
        <form action={signOutAdmin} className="absolute bottom-6 left-6 right-6">
          <button className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-black text-neutral-700 transition hover:border-lakuntza-green">
            Cerrar sesión
          </button>
        </form>
      </aside>

      <main className="lg:pl-72">
        <header className="border-b border-neutral-200 bg-white/90 px-4 py-5 backdrop-blur sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">Panel privado</p>
              <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-neutral-950">{title}</h1>
              {description ? <p className="mt-2 text-sm leading-6 text-neutral-600">{description}</p> : null}
            </div>
            {action}
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}

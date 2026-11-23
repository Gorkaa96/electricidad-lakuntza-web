import AdminShell from '@/components/admin/AdminShell';
import { requireAdmin } from '@/lib/admin';

export const metadata = { title: 'Permisos insuficientes', robots: { index: false, follow: false } };

export default async function AccessDeniedPage() {
  await requireAdmin();
  return (
    <AdminShell title="Acceso restringido" description="Esta cuenta no tiene permiso para realizar esa operación.">
      <section className="rounded-xl border border-amber-200 bg-white p-7">
        <p className="text-sm leading-7 text-neutral-700">Los permisos del panel son individuales y los asigna un administrador autorizado. Si necesitas acceso a este apartado, consulta con el responsable de Electricidad Lakuntza.</p>
        <a href="/admin/entrada" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-[#24662D] px-5 py-3 text-sm font-semibold text-white">Volver a mis apartados</a>
      </section>
    </AdminShell>
  );
}

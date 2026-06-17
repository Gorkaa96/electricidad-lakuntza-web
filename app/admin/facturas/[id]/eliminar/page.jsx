import { notFound } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import AdminNotice from '@/components/admin/AdminNotice';
import { requireAdmin } from '@/lib/admin';
import { deleteInvoiceLead } from '../../actions';

export const metadata = {
  title: 'Eliminar factura recibida',
  robots: { index: false, follow: false },
};

export const revalidate = 0;

export default async function DeleteInvoiceLeadPage({ params, searchParams }) {
  const { supabase } = await requireAdmin();
  const { data: lead } = await supabase
    .from('invoice_review_leads')
    .select('id, created_at, name, phone, file_name')
    .eq('id', params.id)
    .maybeSingle();

  if (!lead) notFound();

  return (
    <AdminShell title="Eliminar solicitud" description="Borra la solicitud y el archivo privado asociado a la factura.">
      <AdminNotice success={searchParams?.success} error={searchParams?.error} />

      <section className="max-w-3xl rounded-[2rem] border border-red-200 bg-white p-6 shadow-card sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">Acción irreversible</p>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-neutral-950">Eliminar factura recibida</h2>
        <p className="mt-4 text-sm leading-7 text-neutral-600">
          Se eliminará la solicitud del panel y se intentará borrar también el archivo privado subido por el cliente.
        </p>

        <div className="mt-6 grid gap-3 rounded-2xl bg-red-50 p-5 text-sm leading-6 text-red-900">
          <p><strong>Cliente:</strong> {lead.name}</p>
          <p><strong>Teléfono:</strong> {lead.phone}</p>
          <p><strong>Archivo:</strong> {lead.file_name || 'Sin archivo'}</p>
          <p><strong>Recibida:</strong> {new Date(lead.created_at).toLocaleString('es-ES')}</p>
        </div>

        <form action={deleteInvoiceLead} className="mt-6 grid gap-4">
          <input type="hidden" name="id" value={lead.id} />
          <label className="grid gap-2 text-sm font-black text-neutral-800">
            Escribe ELIMINAR para confirmar
            <input name="confirmDelete" className="min-h-12 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-red-500" autoComplete="off" />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700">
              Eliminar definitivamente
            </button>
            <a href={`/admin/facturas/${lead.id}`} className="rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-center text-sm font-black text-neutral-800 transition hover:border-lakuntza-green">
              Cancelar
            </a>
          </div>
        </form>
      </section>
    </AdminShell>
  );
}

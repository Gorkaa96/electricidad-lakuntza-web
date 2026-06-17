import { notFound } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { requireAdmin } from '@/lib/admin';

export const metadata = {
  title: 'Detalle de factura recibida',
  robots: { index: false, follow: false },
};

export const revalidate = 0;

const statusLabels = {
  new: 'Nueva',
  reviewing: 'En revisión',
  contacted: 'Contactado',
  converted: 'Convertido',
  discarded: 'Descartado',
};

const precheckLabels = {
  pending: 'Pendiente',
  potential_improvement: 'Posible mejora',
  manual_review: 'Revisión manual',
  bonus_social_case: 'Bono social / familia numerosa',
};

function row(label, value) {
  return (
    <div className="rounded-2xl bg-neutral-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">{label}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-neutral-800">{value || 'No indicado'}</p>
    </div>
  );
}

export default async function AdminInvoiceLeadDetailPage({ params }) {
  const { supabase } = await requireAdmin();
  const { data: lead } = await supabase
    .from('invoice_review_leads')
    .select('*')
    .eq('id', params.id)
    .maybeSingle();

  if (!lead) notFound();

  let signedUrl = null;
  if (lead.file_path) {
    const { data } = await supabase.storage.from('invoice-files').createSignedUrl(lead.file_path, 60 * 30);
    signedUrl = data?.signedUrl || null;
  }

  return (
    <AdminShell title="Factura recibida" description="Revisa la solicitud y descarga la factura enviada por el cliente.">
      <div className="grid gap-6 lg:grid-cols-12">
        <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-card lg:col-span-8 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#F3FAEF] px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-lakuntza-greenDark">
              {precheckLabels[lead.precheck_result] || lead.precheck_result}
            </span>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-neutral-500">
              {statusLabels[lead.status] || lead.status}
            </span>
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-neutral-950">{lead.name}</h2>
          <p className="mt-2 text-sm text-neutral-500">Recibida el {new Date(lead.created_at).toLocaleString('es-ES')}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {row('Teléfono', lead.phone)}
            {row('Email', lead.email)}
            {row('Localidad', lead.locality)}
            {row('Compañía actual', lead.current_company)}
            {row('Suministro', lead.supply_type)}
            {row('Tipo de cliente', lead.customer_type)}
            {row('Bono social / familia numerosa', lead.bonus_status)}
            {row('Tamaño archivo', lead.file_size ? `${Math.round(lead.file_size / 1024)} KB` : null)}
          </div>

          <div className="mt-6 rounded-2xl bg-neutral-50 p-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">Comentario</p>
            <p className="mt-3 text-sm leading-7 text-neutral-700">{lead.notes || 'Sin comentario.'}</p>
          </div>
        </section>

        <aside className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-card lg:col-span-4 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">Factura</p>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-neutral-950">Archivo recibido</h2>
          <p className="mt-3 break-all text-sm leading-6 text-neutral-500">{lead.file_name || 'Sin archivo'}</p>

          {signedUrl ? (
            <a href={signedUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-black text-white transition hover:bg-lakuntza-greenDark">
              Abrir factura
            </a>
          ) : (
            <p className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-bold leading-6 text-red-700">No se ha podido generar enlace temporal.</p>
          )}

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            El enlace al archivo caduca en 30 minutos. No compartas la factura fuera del proceso de revisión.
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}

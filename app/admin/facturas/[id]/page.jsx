import { notFound } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import AdminNotice from '@/components/admin/AdminNotice';
import { requireAdmin } from '@/lib/admin';
import { updateInvoiceLead } from '../actions';

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

function supplyLabel(value) {
  if (value === 'luz_gas') return 'Luz y gas';
  if (value === 'luz') return 'Luz';
  if (value === 'gas') return 'Gas';
  return value;
}

function customerLabel(value) {
  if (value === 'vivienda') return 'Vivienda';
  if (value === 'negocio') return 'Negocio';
  if (value === 'comunidad') return 'Comunidad';
  return value;
}

function bonusLabel(value) {
  if (value === 'si') return 'Sí';
  if (value === 'no') return 'No';
  if (value === 'no_lo_se') return 'No lo sé';
  return value;
}

export default async function AdminInvoiceLeadDetailPage({ params, searchParams }) {
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

  const whatsappHref = `https://wa.me/${String(lead.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent('Hola, soy Electricidad Lakuntza. Hemos recibido tu factura para revisión y queremos comentarte el resultado.')}`;

  return (
    <AdminShell title="Factura recibida" description="Revisa la solicitud, descarga la factura y actualiza el estado comercial.">
      <AdminNotice success={searchParams?.success} error={searchParams?.error} />

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
            {row('Suministro', supplyLabel(lead.supply_type))}
            {row('Tipo de cliente', customerLabel(lead.customer_type))}
            {row('Bono social / familia numerosa', bonusLabel(lead.bonus_status))}
            {row('Tamaño archivo', lead.file_size ? `${Math.round(lead.file_size / 1024)} KB` : null)}
          </div>

          <div className="mt-6 rounded-2xl bg-neutral-50 p-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">Comentario del cliente</p>
            <p className="mt-3 text-sm leading-7 text-neutral-700">{lead.notes || 'Sin comentario.'}</p>
          </div>

          <div className="mt-6 rounded-2xl bg-neutral-50 p-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">Notas internas</p>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-neutral-700">{lead.admin_notes || 'Sin notas internas.'}</p>
          </div>
        </section>

        <aside className="grid gap-6 lg:col-span-4">
          <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-card sm:p-8">
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
          </section>

          <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-card sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">Gestión comercial</p>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-neutral-950">Actualizar estado</h2>

            <form action={updateInvoiceLead} className="mt-6 grid gap-4">
              <input type="hidden" name="id" value={lead.id} />

              <label className="grid gap-2 text-sm font-black text-neutral-800">
                Estado
                <select name="status" defaultValue={lead.status} className="min-h-12 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-lakuntza-green">
                  <option value="new">Nueva</option>
                  <option value="reviewing">En revisión</option>
                  <option value="contacted">Contactado</option>
                  <option value="converted">Convertido</option>
                  <option value="discarded">Descartado</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-black text-neutral-800">
                Notas internas
                <textarea name="adminNotes" rows={5} defaultValue={lead.admin_notes || ''} className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium leading-6 outline-none focus:border-lakuntza-green" placeholder="Ej.: llamar por la tarde, posible bono social, tarifa actual buena, interesado en luz y gas..." />
              </label>

              <button className="rounded-2xl bg-lakuntza-green px-5 py-3 text-sm font-black text-white shadow-green transition hover:bg-lakuntza-greenDark">
                Guardar gestión
              </button>
            </form>

            <div className="mt-5 grid gap-3">
              <a href={`tel:${lead.phone}`} className="inline-flex w-full items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-black text-neutral-800 transition hover:border-lakuntza-green">
                Llamar cliente
              </a>
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-black text-white transition hover:bg-lakuntza-greenDark">
                WhatsApp cliente
              </a>
            </div>
          </section>
        </aside>
      </div>
    </AdminShell>
  );
}

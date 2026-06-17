import AdminShell from '@/components/admin/AdminShell';
import { requireAdmin } from '@/lib/admin';

export const metadata = {
  title: 'Facturas recibidas',
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
  bonus_social_case: 'Bono social',
};

export default async function AdminInvoiceLeadsPage() {
  const { supabase } = await requireAdmin();
  const { data: leads = [] } = await supabase
    .from('invoice_review_leads')
    .select('id, created_at, name, phone, locality, supply_type, customer_type, bonus_status, status, precheck_result')
    .order('created_at', { ascending: false });

  return (
    <AdminShell
      title="Facturas recibidas"
      description="Solicitudes de revisión gratuita de facturas de luz y gas recibidas desde la web."
    >
      <div className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-card">
        {leads.length > 0 ? (
          <div className="divide-y divide-neutral-200">
            {leads.map((lead) => (
              <a key={lead.id} href={`/admin/facturas/${lead.id}`} className="grid gap-4 p-5 transition hover:bg-neutral-50 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#F3FAEF] px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-lakuntza-greenDark">
                      {precheckLabels[lead.precheck_result] || lead.precheck_result}
                    </span>
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-neutral-500">
                      {statusLabels[lead.status] || lead.status}
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-black tracking-[-0.04em] text-neutral-950">{lead.name}</h2>
                  <p className="mt-2 text-sm text-neutral-500">
                    {lead.phone} · {lead.locality || 'Sin localidad'} · {lead.supply_type} · {lead.customer_type}
                    {lead.bonus_status === 'si' ? ' · Posible bono social' : ''}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">{new Date(lead.created_at).toLocaleString('es-ES')}</p>
                </div>
                <div className="text-sm font-black text-lakuntza-greenDark">Ver solicitud</div>
              </a>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-black tracking-[-0.04em] text-neutral-950">Aún no hay facturas recibidas.</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">Cuando un cliente suba una factura desde la web, aparecerá aquí.</p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

import AdminShell from '@/components/admin/AdminShell';
import AdminNotice from '@/components/admin/AdminNotice';
import { requireAdmin } from '@/lib/admin';

export const metadata = {
  title: 'Facturas recibidas',
  robots: { index: false, follow: false },
};

export const revalidate = 0;

const statusLabels = {
  all: 'Todos',
  new: 'Nueva',
  reviewing: 'En revisión',
  contacted: 'Contactado',
  converted: 'Convertido',
  discarded: 'Descartado',
};

const precheckLabels = {
  all: 'Todos',
  pending: 'Pendiente',
  potential_improvement: 'Posible mejora',
  manual_review: 'Revisión manual',
  bonus_social_case: 'Bono social',
};

const statusOptions = ['all', 'new', 'reviewing', 'contacted', 'converted', 'discarded'];
const precheckOptions = ['all', 'potential_improvement', 'bonus_social_case', 'manual_review', 'pending'];

function buildHref({ status = 'all', precheck = 'all' }) {
  const params = new URLSearchParams();
  if (status !== 'all') params.set('status', status);
  if (precheck !== 'all') params.set('precheck', precheck);
  const query = params.toString();
  return query ? `/admin/facturas?${query}` : '/admin/facturas';
}

function countWhere(leads, predicate) {
  return leads.filter(predicate).length;
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

function statusBadgeClass(status) {
  if (status === 'converted') return 'bg-emerald-50 text-emerald-700';
  if (status === 'discarded') return 'bg-red-50 text-red-700';
  if (status === 'contacted') return 'bg-blue-50 text-blue-700';
  if (status === 'reviewing') return 'bg-amber-50 text-amber-700';
  return 'bg-neutral-100 text-neutral-500';
}

function precheckBadgeClass(precheck) {
  if (precheck === 'potential_improvement') return 'bg-[#F3FAEF] text-lakuntza-greenDark';
  if (precheck === 'bonus_social_case') return 'bg-amber-50 text-amber-700';
  if (precheck === 'manual_review') return 'bg-blue-50 text-blue-700';
  return 'bg-neutral-100 text-neutral-500';
}

export default async function AdminInvoiceLeadsPage({ searchParams }) {
  const { supabase } = await requireAdmin();
  const { data: leads = [] } = await supabase
    .from('invoice_review_leads')
    .select('id, created_at, name, phone, locality, supply_type, customer_type, bonus_status, status, precheck_result, contacted_at, converted_at')
    .order('created_at', { ascending: false });

  const selectedStatus = statusOptions.includes(searchParams?.status) ? searchParams.status : 'all';
  const selectedPrecheck = precheckOptions.includes(searchParams?.precheck) ? searchParams.precheck : 'all';

  const filteredLeads = leads.filter((lead) => {
    const statusMatch = selectedStatus === 'all' || lead.status === selectedStatus;
    const precheckMatch = selectedPrecheck === 'all' || lead.precheck_result === selectedPrecheck;
    return statusMatch && precheckMatch;
  });

  const metrics = [
    { label: 'Total recibidas', value: leads.length, href: buildHref({}) },
    { label: 'Nuevas', value: countWhere(leads, (lead) => lead.status === 'new'), href: buildHref({ status: 'new', precheck: selectedPrecheck }) },
    { label: 'Posible mejora', value: countWhere(leads, (lead) => lead.precheck_result === 'potential_improvement'), href: buildHref({ status: selectedStatus, precheck: 'potential_improvement' }) },
    { label: 'Bono social', value: countWhere(leads, (lead) => lead.precheck_result === 'bonus_social_case'), href: buildHref({ status: selectedStatus, precheck: 'bonus_social_case' }) },
    { label: 'Convertidos', value: countWhere(leads, (lead) => lead.status === 'converted'), href: buildHref({ status: 'converted', precheck: selectedPrecheck }) },
  ];

  return (
    <AdminShell
      title="Facturas recibidas"
      description="Solicitudes de revisión gratuita de facturas de luz y gas recibidas desde la web."
    >
      <AdminNotice success={searchParams?.success} error={searchParams?.error} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <a key={metric.label} href={metric.href} className="rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-lakuntza-green/40">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-neutral-400">{metric.label}</p>
            <p className="mt-3 text-4xl font-black tracking-[-0.06em] text-neutral-950">{metric.value}</p>
          </a>
        ))}
      </div>

      <section className="mt-6 rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-card">
        <div className="grid gap-5 xl:grid-cols-2">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-neutral-400">Estado comercial</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <a
                  key={status}
                  href={buildHref({ status, precheck: selectedPrecheck })}
                  className={`rounded-full px-4 py-2 text-xs font-black transition ${selectedStatus === status ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
                >
                  {statusLabels[status]}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-neutral-400">Resultado inicial</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {precheckOptions.map((precheck) => (
                <a
                  key={precheck}
                  href={buildHref({ status: selectedStatus, precheck })}
                  className={`rounded-full px-4 py-2 text-xs font-black transition ${selectedPrecheck === precheck ? 'bg-lakuntza-green text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
                >
                  {precheckLabels[precheck]}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-card">
        {filteredLeads.length > 0 ? (
          <div className="divide-y divide-neutral-200">
            {filteredLeads.map((lead) => (
              <a key={lead.id} href={`/admin/facturas/${lead.id}`} className="grid gap-4 p-5 transition hover:bg-neutral-50 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] ${precheckBadgeClass(lead.precheck_result)}`}>
                      {precheckLabels[lead.precheck_result] || lead.precheck_result}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] ${statusBadgeClass(lead.status)}`}>
                      {statusLabels[lead.status] || lead.status}
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-black tracking-[-0.04em] text-neutral-950">{lead.name}</h2>
                  <p className="mt-2 text-sm text-neutral-500">
                    {lead.phone} · {lead.locality || 'Sin localidad'} · {supplyLabel(lead.supply_type)} · {customerLabel(lead.customer_type)}
                    {lead.bonus_status === 'si' ? ' · Posible bono social' : ''}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">{new Date(lead.created_at).toLocaleString('es-ES')}</p>
                </div>
                <div className="text-sm font-black text-lakuntza-greenDark">Ver solicitud</div>
              </a>
            ))}
          </div>
        ) : leads.length > 0 ? (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-black tracking-[-0.04em] text-neutral-950">No hay facturas con estos filtros.</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">Cambia los filtros para ver otras solicitudes.</p>
            <a href="/admin/facturas" className="mt-6 inline-flex rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-black text-white">Ver todas</a>
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

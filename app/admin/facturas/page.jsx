import AdminShell from '@/components/admin/AdminShell';
import AdminNotice from '@/components/admin/AdminNotice';
import { requireAdmin } from '@/lib/admin';

export const metadata = {
  title: 'Facturas recibidas',
  robots: { index: false, follow: false },
};

export const revalidate = 0;

const viewLabels = {
  pending: 'Pendientes',
  reviewing: 'En revisión',
  contacted: 'Contactadas',
  closed: 'Cerradas',
  all: 'Todas',
};

const statusLabels = {
  new: 'Nueva',
  reviewing: 'En revisión',
  contacted: 'Contactado',
  converted: 'Convertido',
  discarded: 'Descartado',
};

const ocrLabels = {
  pending: 'Lectura pendiente',
  processing: 'Leyendo factura',
  succeeded: 'Lectura completada',
  failed: 'Revisión manual',
  not_applicable: 'No aplica',
};

const views = ['pending', 'reviewing', 'contacted', 'closed', 'all'];

function href(view) {
  return view === 'pending' ? '/admin/facturas' : `/admin/facturas?view=${view}`;
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(String(value).replace(',', '.'));
  return Number.isFinite(number) ? number : null;
}

function formatNumber(value, suffix = '') {
  const number = toNumber(value);
  if (number === null) return null;
  return `${String(number).replace('.', ',')}${suffix}`;
}

function daysSince(value) {
  if (!value) return null;
  const diff = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(diff)) return null;
  return Math.max(0, Math.floor(diff / 86400000));
}

function isClosed(lead) {
  return lead.status === 'converted' || lead.status === 'discarded';
}

function getView(lead) {
  if (isClosed(lead)) return 'closed';
  if (lead.status === 'contacted') return 'contacted';
  if (lead.status === 'reviewing') return 'reviewing';
  return 'pending';
}

function getAction(lead) {
  const total = toNumber(lead.invoice_total_eur);
  const consumption = toNumber(lead.consumption_kwh);
  const ocrStatus = lead.ocr_status || 'pending';
  const isBusiness = lead.customer_type === 'negocio' || lead.customer_type === 'comunidad';

  if (isClosed(lead)) return { label: 'Cerrada', tone: 'neutral' };
  if (ocrStatus === 'failed') return { label: 'Revisar manual', tone: 'amber' };
  if (ocrStatus !== 'succeeded') return { label: 'Leer factura', tone: 'neutral' };
  if (lead.bonus_status === 'si' || lead.precheck_result === 'bonus_social_case') return { label: 'Confirmar condiciones', tone: 'amber' };
  if (lead.analysis_result === 'viable' || lead.has_extra_services || isBusiness || (total !== null && total >= 90) || (consumption !== null && consumption >= 300)) return { label: 'Contactar', tone: 'green' };
  if (lead.analysis_result === 'not_viable') return { label: 'Sin urgencia', tone: 'neutral' };
  return { label: 'Revisar', tone: 'amber' };
}

function followupText(lead) {
  const age = daysSince(lead.created_at);
  const contactAge = daysSince(lead.contacted_at);

  if (lead.status === 'contacted' && contactAge !== null && contactAge >= 3) return `Seguimiento: contactado hace ${contactAge} días`;
  if ((lead.status === 'new' || lead.status === 'reviewing') && age !== null && age >= 2) return `Pendiente desde hace ${age} días`;
  if (lead.contacted_at) return `Último contacto: ${new Date(lead.contacted_at).toLocaleDateString('es-ES')}`;
  return 'Sin contacto registrado';
}

function actionClass(tone) {
  if (tone === 'green') return 'bg-[#F3FAEF] text-lakuntza-greenDark';
  if (tone === 'amber') return 'bg-amber-50 text-amber-700';
  return 'bg-neutral-100 text-neutral-600';
}

function statusClass(status) {
  if (status === 'converted') return 'bg-[#F3FAEF] text-lakuntza-greenDark';
  if (status === 'discarded') return 'bg-red-50 text-red-700';
  if (status === 'contacted') return 'bg-blue-50 text-blue-700';
  if (status === 'reviewing') return 'bg-amber-50 text-amber-700';
  return 'bg-neutral-100 text-neutral-600';
}

function ocrClass(status) {
  if (status === 'succeeded') return 'bg-[#F3FAEF] text-lakuntza-greenDark';
  if (status === 'failed') return 'bg-amber-50 text-amber-700';
  if (status === 'processing') return 'bg-blue-50 text-blue-700';
  return 'bg-neutral-100 text-neutral-600';
}

function supplyLabel(value) {
  if (value === 'luz_gas') return 'Luz y gas';
  if (value === 'luz') return 'Luz';
  if (value === 'gas') return 'Gas';
  return value || 'Sin suministro';
}

function customerLabel(value) {
  if (value === 'vivienda') return 'Vivienda';
  if (value === 'negocio') return 'Negocio';
  if (value === 'comunidad') return 'Comunidad';
  return value || 'Cliente';
}

export default async function AdminInvoiceLeadsPage({ searchParams }) {
  const { supabase } = await requireAdmin();
  const { data: leads = [] } = await supabase
    .from('invoice_review_leads')
    .select('id, created_at, name, phone, locality, supply_type, customer_type, bonus_status, status, precheck_result, analysis_result, contacted_at, converted_at, ocr_status, ocr_confidence_avg, invoice_total_eur, consumption_kwh, contracted_power_kw, has_extra_services')
    .order('created_at', { ascending: false });

  const selectedView = views.includes(searchParams?.view) ? searchParams.view : 'pending';
  const enrichedLeads = leads.map((lead) => ({ ...lead, view: getView(lead), action: getAction(lead) }));
  const filteredLeads = selectedView === 'all' ? enrichedLeads : enrichedLeads.filter((lead) => lead.view === selectedView);

  const counts = {
    pending: enrichedLeads.filter((lead) => lead.view === 'pending').length,
    reviewing: enrichedLeads.filter((lead) => lead.view === 'reviewing').length,
    contacted: enrichedLeads.filter((lead) => lead.view === 'contacted').length,
    closed: enrichedLeads.filter((lead) => lead.view === 'closed').length,
    all: enrichedLeads.length,
  };

  return (
    <AdminShell title="Facturas" description="Vista sencilla para revisar facturas recibidas, contactar y cerrar el seguimiento.">
      <AdminNotice success={searchParams?.success} error={searchParams?.error} />

      <section className="rounded-[2rem] border border-neutral-200 bg-white p-4 shadow-card sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {views.map((view) => (
            <a key={view} href={href(view)} className={`rounded-2xl border px-5 py-4 transition ${selectedView === view ? 'border-neutral-950 bg-neutral-950 text-white' : 'border-neutral-200 bg-white text-neutral-800 hover:border-lakuntza-green/50'}`}>
              <p className="text-xs font-black uppercase tracking-[0.14em] opacity-70">{viewLabels[view]}</p>
              <p className="mt-2 text-3xl font-black tracking-[-0.06em]">{counts[view]}</p>
            </a>
          ))}
        </div>
      </section>

      <div className="mt-6 overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-card">
        {filteredLeads.length > 0 ? (
          <div className="divide-y divide-neutral-200">
            {filteredLeads.map((lead) => {
              const ocrStatus = lead.ocr_status || 'pending';
              const total = formatNumber(lead.invoice_total_eur, ' €');
              const consumption = formatNumber(lead.consumption_kwh, ' kWh');
              const power = formatNumber(lead.contracted_power_kw, ' kW');

              return (
                <a key={lead.id} href={`/admin/facturas/${lead.id}`} className="grid gap-4 p-5 transition hover:bg-neutral-50 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${statusClass(lead.status)}`}>{statusLabels[lead.status] || lead.status}</span>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${ocrClass(ocrStatus)}`}>{ocrLabels[ocrStatus] || ocrStatus}</span>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${actionClass(lead.action.tone)}`}>{lead.action.label}</span>
                    </div>

                    <h2 className="mt-3 text-xl font-black tracking-[-0.04em] text-neutral-950">{lead.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-neutral-500">
                      {lead.phone} · {lead.locality || 'Sin localidad'} · {supplyLabel(lead.supply_type)} · {customerLabel(lead.customer_type)}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-neutral-500">
                      <span className="rounded-full bg-neutral-50 px-3 py-1">{total ? `Total ${total}` : 'Total pendiente'}</span>
                      <span className="rounded-full bg-neutral-50 px-3 py-1">{consumption ? `Consumo ${consumption}` : 'Consumo pendiente'}</span>
                      <span className="rounded-full bg-neutral-50 px-3 py-1">{power ? `Potencia ${power}` : 'Potencia pendiente'}</span>
                      {lead.has_extra_services ? <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Servicios añadidos</span> : null}
                    </div>

                    <p className="mt-3 text-xs font-bold text-neutral-400">
                      Recibida {new Date(lead.created_at).toLocaleDateString('es-ES')} · {followupText(lead)}
                    </p>
                  </div>

                  <div className="text-left lg:text-right">
                    <p className="text-sm font-black text-lakuntza-greenDark">Abrir</p>
                  </div>
                </a>
              );
            })}
          </div>
        ) : leads.length > 0 ? (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-black tracking-[-0.04em] text-neutral-950">No hay facturas en esta vista.</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">Cambia a otra pestaña para ver más solicitudes.</p>
            <a href="/admin/facturas?view=all" className="mt-6 inline-flex rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-black text-white">Ver todas</a>
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

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

const analysisLabels = {
  all: 'Todos',
  pending: 'Análisis pendiente',
  viable: 'Viable',
  review: 'Revisar',
  not_viable: 'No viable',
};

const priorityLabels = {
  all: 'Todos',
  high: 'Prioridad alta',
  review: 'Revisión manual',
  low: 'Baja prioridad',
  ocr_pending: 'OCR pendiente',
  sensitive: 'Caso sensible',
};

const followupLabels = {
  all: 'Todos',
  no_contact: 'Sin contactar',
  needs_followup: 'Seguimiento',
  stale_review: 'Paradas',
  done: 'Cerradas',
};

const ocrLabels = {
  pending: 'OCR pendiente',
  processing: 'OCR procesando',
  succeeded: 'OCR completado',
  failed: 'OCR error',
  not_applicable: 'OCR no aplica',
};

const statusOptions = ['all', 'new', 'reviewing', 'contacted', 'converted', 'discarded'];
const precheckOptions = ['all', 'potential_improvement', 'bonus_social_case', 'manual_review', 'pending'];
const analysisOptions = ['all', 'viable', 'review', 'not_viable', 'pending'];
const priorityOptions = ['all', 'high', 'review', 'sensitive', 'ocr_pending', 'low'];
const followupOptions = ['all', 'no_contact', 'needs_followup', 'stale_review', 'done'];

function buildHref({ status = 'all', precheck = 'all', analysis = 'all', priority = 'all', followup = 'all' }) {
  const params = new URLSearchParams();
  if (status !== 'all') params.set('status', status);
  if (precheck !== 'all') params.set('precheck', precheck);
  if (analysis !== 'all') params.set('analysis', analysis);
  if (priority !== 'all') params.set('priority', priority);
  if (followup !== 'all') params.set('followup', followup);
  const query = params.toString();
  return query ? `/admin/facturas?${query}` : '/admin/facturas';
}

function countWhere(leads, predicate) {
  return leads.filter(predicate).length;
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

function getPriority(lead) {
  const total = toNumber(lead.invoice_total_eur);
  const consumption = toNumber(lead.consumption_kwh);
  const ocrStatus = lead.ocr_status || 'pending';
  const isBusiness = lead.customer_type === 'negocio' || lead.customer_type === 'comunidad';

  if (lead.bonus_status === 'si' || lead.precheck_result === 'bonus_social_case') return 'sensitive';
  if (ocrStatus === 'failed') return 'review';
  if (ocrStatus !== 'succeeded') return 'ocr_pending';
  if (lead.analysis_result === 'viable' || lead.has_extra_services || isBusiness || (total !== null && total >= 90) || (consumption !== null && consumption >= 300)) return 'high';
  if (lead.analysis_result === 'not_viable') return 'low';
  return 'review';
}

function getFollowup(lead) {
  const ageDays = daysSince(lead.created_at);
  const contactDays = daysSince(lead.contacted_at);

  if (lead.status === 'converted' || lead.status === 'discarded') return 'done';
  if (lead.status === 'contacted' && contactDays !== null && contactDays >= 3) return 'needs_followup';
  if ((lead.status === 'new' || lead.status === 'reviewing') && ageDays !== null && ageDays >= 2) return 'stale_review';
  if (!lead.contacted_at && lead.status !== 'contacted') return 'no_contact';
  return 'all';
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

function analysisBadgeClass(analysis) {
  if (analysis === 'viable') return 'bg-[#F3FAEF] text-lakuntza-greenDark';
  if (analysis === 'review') return 'bg-amber-50 text-amber-700';
  if (analysis === 'not_viable') return 'bg-red-50 text-red-700';
  return 'bg-neutral-100 text-neutral-500';
}

function priorityBadgeClass(priority) {
  if (priority === 'high') return 'bg-lakuntza-green text-white';
  if (priority === 'sensitive') return 'bg-amber-100 text-amber-800';
  if (priority === 'review') return 'bg-blue-50 text-blue-700';
  if (priority === 'low') return 'bg-neutral-100 text-neutral-500';
  if (priority === 'ocr_pending') return 'bg-purple-50 text-purple-700';
  return 'bg-neutral-100 text-neutral-500';
}

function followupBadgeClass(followup) {
  if (followup === 'needs_followup') return 'bg-red-50 text-red-700';
  if (followup === 'stale_review') return 'bg-amber-50 text-amber-700';
  if (followup === 'no_contact') return 'bg-blue-50 text-blue-700';
  if (followup === 'done') return 'bg-emerald-50 text-emerald-700';
  return 'bg-neutral-100 text-neutral-500';
}

function ocrBadgeClass(status) {
  if (status === 'succeeded') return 'bg-[#F3FAEF] text-lakuntza-greenDark';
  if (status === 'processing') return 'bg-blue-50 text-blue-700';
  if (status === 'failed') return 'bg-red-50 text-red-700';
  return 'bg-neutral-100 text-neutral-500';
}

function actionHint(lead) {
  if (lead.followup === 'needs_followup') return 'Hacer seguimiento';
  if (lead.followup === 'stale_review') return 'Retomar revisión';
  if (lead.priority === 'high') return 'Contactar hoy';
  if (lead.priority === 'sensitive') return 'Revisar ayudas';
  if (lead.priority === 'ocr_pending') return 'Procesar lectura';
  if (lead.priority === 'low') return 'Sin urgencia';
  return 'Validar datos';
}

function contactText(lead) {
  if (lead.contacted_at) return `Último contacto ${new Date(lead.contacted_at).toLocaleDateString('es-ES')}`;
  return 'Sin contacto registrado';
}

export default async function AdminInvoiceLeadsPage({ searchParams }) {
  const { supabase } = await requireAdmin();
  const { data: leads = [] } = await supabase
    .from('invoice_review_leads')
    .select('id, created_at, name, phone, locality, supply_type, customer_type, bonus_status, status, precheck_result, analysis_result, contacted_at, converted_at, ocr_status, ocr_confidence_avg, invoice_total_eur, consumption_kwh, contracted_power_kw, has_extra_services')
    .order('created_at', { ascending: false });

  const selectedStatus = statusOptions.includes(searchParams?.status) ? searchParams.status : 'all';
  const selectedPrecheck = precheckOptions.includes(searchParams?.precheck) ? searchParams.precheck : 'all';
  const selectedAnalysis = analysisOptions.includes(searchParams?.analysis) ? searchParams.analysis : 'all';
  const selectedPriority = priorityOptions.includes(searchParams?.priority) ? searchParams.priority : 'all';
  const selectedFollowup = followupOptions.includes(searchParams?.followup) ? searchParams.followup : 'all';
  const enrichedLeads = leads.map((lead) => ({ ...lead, priority: getPriority(lead), followup: getFollowup(lead) }));

  const filteredLeads = enrichedLeads.filter((lead) => {
    const statusMatch = selectedStatus === 'all' || lead.status === selectedStatus;
    const precheckMatch = selectedPrecheck === 'all' || lead.precheck_result === selectedPrecheck;
    const analysisMatch = selectedAnalysis === 'all' || lead.analysis_result === selectedAnalysis;
    const priorityMatch = selectedPriority === 'all' || lead.priority === selectedPriority;
    const followupMatch = selectedFollowup === 'all' || lead.followup === selectedFollowup;
    return statusMatch && precheckMatch && analysisMatch && priorityMatch && followupMatch;
  });

  const metrics = [
    { label: 'Total recibidas', value: leads.length, href: buildHref({}) },
    { label: 'Sin contactar', value: countWhere(enrichedLeads, (lead) => lead.followup === 'no_contact' || lead.followup === 'stale_review'), href: buildHref({ status: selectedStatus, precheck: selectedPrecheck, analysis: selectedAnalysis, priority: selectedPriority, followup: 'no_contact' }) },
    { label: 'Seguimiento', value: countWhere(enrichedLeads, (lead) => lead.followup === 'needs_followup'), href: buildHref({ status: selectedStatus, precheck: selectedPrecheck, analysis: selectedAnalysis, priority: selectedPriority, followup: 'needs_followup' }) },
    { label: 'Prioridad alta', value: countWhere(enrichedLeads, (lead) => lead.priority === 'high'), href: buildHref({ status: selectedStatus, precheck: selectedPrecheck, analysis: selectedAnalysis, priority: 'high', followup: selectedFollowup }) },
    { label: 'Convertidos', value: countWhere(enrichedLeads, (lead) => lead.status === 'converted'), href: buildHref({ status: 'converted', precheck: selectedPrecheck, analysis: selectedAnalysis, priority: selectedPriority, followup: selectedFollowup }) },
  ];

  return (
    <AdminShell title="Facturas recibidas" description="Solicitudes de revisión gratuita de facturas de luz y gas recibidas desde la web.">
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
        <div className="grid gap-5 xl:grid-cols-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-neutral-400">Seguimiento</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {followupOptions.map((followup) => (
                <a key={followup} href={buildHref({ status: selectedStatus, precheck: selectedPrecheck, analysis: selectedAnalysis, priority: selectedPriority, followup })} className={`rounded-full px-4 py-2 text-xs font-black transition ${selectedFollowup === followup ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
                  {followupLabels[followup]}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-neutral-400">Prioridad diaria</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {priorityOptions.map((priority) => (
                <a key={priority} href={buildHref({ status: selectedStatus, precheck: selectedPrecheck, analysis: selectedAnalysis, priority, followup: selectedFollowup })} className={`rounded-full px-4 py-2 text-xs font-black transition ${selectedPriority === priority ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
                  {priorityLabels[priority]}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-neutral-400">Estado comercial</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <a key={status} href={buildHref({ status, precheck: selectedPrecheck, analysis: selectedAnalysis, priority: selectedPriority, followup: selectedFollowup })} className={`rounded-full px-4 py-2 text-xs font-black transition ${selectedStatus === status ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
                  {statusLabels[status]}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-neutral-400">Resultado inicial</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {precheckOptions.map((precheck) => (
                <a key={precheck} href={buildHref({ status: selectedStatus, precheck, analysis: selectedAnalysis, priority: selectedPriority, followup: selectedFollowup })} className={`rounded-full px-4 py-2 text-xs font-black transition ${selectedPrecheck === precheck ? 'bg-lakuntza-green text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
                  {precheckLabels[precheck]}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-neutral-400">Análisis interno</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {analysisOptions.map((analysis) => (
                <a key={analysis} href={buildHref({ status: selectedStatus, precheck: selectedPrecheck, analysis, priority: selectedPriority, followup: selectedFollowup })} className={`rounded-full px-4 py-2 text-xs font-black transition ${selectedAnalysis === analysis ? 'bg-lakuntza-greenDark text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
                  {analysisLabels[analysis]}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-card">
        {filteredLeads.length > 0 ? (
          <div className="divide-y divide-neutral-200">
            {filteredLeads.map((lead) => {
              const total = formatNumber(lead.invoice_total_eur, ' €');
              const consumption = formatNumber(lead.consumption_kwh, ' kWh');
              const power = formatNumber(lead.contracted_power_kw, ' kW');
              const ocrStatus = lead.ocr_status || 'pending';

              return (
                <a key={lead.id} href={`/admin/facturas/${lead.id}`} className="grid gap-4 p-5 transition hover:bg-neutral-50 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] ${followupBadgeClass(lead.followup)}`}>{followupLabels[lead.followup] || 'Seguimiento OK'}</span>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] ${priorityBadgeClass(lead.priority)}`}>{priorityLabels[lead.priority] || lead.priority}</span>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] ${ocrBadgeClass(ocrStatus)}`}>{ocrLabels[ocrStatus] || ocrStatus}</span>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] ${precheckBadgeClass(lead.precheck_result)}`}>{precheckLabels[lead.precheck_result] || lead.precheck_result}</span>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] ${analysisBadgeClass(lead.analysis_result)}`}>{analysisLabels[lead.analysis_result] || 'Análisis pendiente'}</span>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] ${statusBadgeClass(lead.status)}`}>{statusLabels[lead.status] || lead.status}</span>
                    </div>
                    <h2 className="mt-3 text-xl font-black tracking-[-0.04em] text-neutral-950">{lead.name}</h2>
                    <p className="mt-2 text-sm text-neutral-500">
                      {lead.phone} · {lead.locality || 'Sin localidad'} · {supplyLabel(lead.supply_type)} · {customerLabel(lead.customer_type)}
                      {lead.bonus_status === 'si' ? ' · Posible bono social' : ''}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-neutral-500">
                      <span className="rounded-full bg-neutral-50 px-3 py-1">{total ? `Total ${total}` : 'Total no leído'}</span>
                      <span className="rounded-full bg-neutral-50 px-3 py-1">{consumption ? `Consumo ${consumption}` : 'Consumo no leído'}</span>
                      <span className="rounded-full bg-neutral-50 px-3 py-1">{power ? `Potencia ${power}` : 'Potencia no leída'}</span>
                      <span className="rounded-full bg-neutral-50 px-3 py-1">{contactText(lead)}</span>
                      {lead.has_extra_services ? <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Servicios añadidos</span> : null}
                    </div>
                    <p className="mt-2 text-xs text-neutral-400">Recibida {new Date(lead.created_at).toLocaleString('es-ES')}</p>
                  </div>
                  <div className="grid gap-2 text-left lg:text-right">
                    <p className="text-sm font-black text-neutral-950">{actionHint(lead)}</p>
                    <p className="text-sm font-black text-lakuntza-greenDark">Ver solicitud</p>
                  </div>
                </a>
              );
            })}
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

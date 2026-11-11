import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import AdminNotice from '@/components/admin/AdminNotice';
import { requireAnyPermission } from '@/lib/admin';

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
  if (ocrStatus === 'processing') return {label:'Lectura en curso',tone:'neutral'};
  if (ocrStatus !== 'succeeded') return { label: 'Lectura pendiente', tone: 'neutral' };
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
  const resolvedSearchParams = await searchParams;
  const { supabase } = await requireAnyPermission('leads.read_all', 'leads.read_assigned');
  const { data, error: loadError } = await supabase
    .from('invoice_review_leads')
    .select('id, created_at, name, phone, locality, supply_type, customer_type, bonus_status, status, precheck_result, analysis_result, contacted_at, converted_at, ocr_status, ocr_confidence_avg, invoice_total_eur, consumption_kwh, contracted_power_kw, has_extra_services')
    .order('created_at', { ascending: false });

  if (loadError) {
    console.error('[admin-invoices] Error loading invoice requests', { code: loadError.code || 'unknown' });
    return (
      <AdminShell title="Solicitudes" description="Revisión de facturas recibidas.">
        <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-lg font-semibold text-amber-950">No se han podido cargar las solicitudes</h2>
          <p className="mt-2 text-sm leading-6 text-amber-900">Comprueba que la base de datos esté disponible y vuelve a intentarlo. Esto no significa que no haya solicitudes.</p>
          <Link href="/admin/facturas" className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-amber-950 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-900">Reintentar</Link>
        </div>
      </AdminShell>
    );
  }
  const leads = data || [];
  const selectedView = views.includes(resolvedSearchParams?.view) ? resolvedSearchParams.view : 'pending';
  const enrichedLeads = leads.map((lead) => ({ ...lead, view: getView(lead), action: getAction(lead) }));
  const query=String(resolvedSearchParams?.q||'').trim().slice(0,100);
  const viewLeads=selectedView === 'all' ? enrichedLeads : enrichedLeads.filter((lead)=>lead.view===selectedView);
  const filteredLeads=viewLeads.filter(lead=>!query || [lead.name,lead.phone,lead.locality].filter(Boolean).join(' ').toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es')));

  const counts = {
    pending: enrichedLeads.filter((lead) => lead.view === 'pending').length,
    reviewing: enrichedLeads.filter((lead) => lead.view === 'reviewing').length,
    contacted: enrichedLeads.filter((lead) => lead.view === 'contacted').length,
    closed: enrichedLeads.filter((lead) => lead.view === 'closed').length,
    all: enrichedLeads.length,
  };

  return (
    <AdminShell title="Facturas" description="Lectura automática al recibir cada PDF. Revisa sus datos y registra el siguiente paso.">
      <AdminNotice success={resolvedSearchParams?.success} error={resolvedSearchParams?.error} />

      <form method="get" className="mb-5 flex flex-col gap-3 rounded-xl border border-[#DFE6E2] bg-white p-4 sm:flex-row sm:items-end">
        <input type="hidden" name="view" value={selectedView}/>
        <label className="grid flex-1 gap-2 text-sm font-medium text-[#425A4C]">Buscar factura<input name="q" defaultValue={query} placeholder="Nombre, teléfono o localidad" className="min-h-11 w-full border bg-white px-3 py-2 font-normal"/></label>
        <button className="min-h-11 rounded-lg bg-[#1B4E3D] px-5 py-2 text-sm font-semibold text-white">Buscar</button>
        {query?<Link href={href(selectedView)} className="inline-flex min-h-11 items-center px-3 text-sm text-[#3B634B] underline">Limpiar</Link>:null}
      </form>
      <section className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm" aria-label="Filtrar solicitudes">
        <nav className="flex min-w-max gap-1 sm:min-w-0 sm:flex-wrap" aria-label="Vistas de facturas">
          {views.map((view) => (
            <Link
              key={view}
              href={href(view)+(query?(view==='pending'?'?':'&')+'q='+encodeURIComponent(query):'')}
              aria-current={selectedView === view ? 'page' : undefined}
              className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${selectedView === view ? 'bg-[#EAF5E4] text-lakuntza-greenDark' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950'}`}
            >
              {viewLabels[view]} <span className={`inline-flex min-w-6 items-center justify-center rounded-lg px-1.5 py-0.5 text-xs font-bold ${selectedView === view ? 'bg-white text-lakuntza-greenDark' : 'bg-neutral-100 text-neutral-600'}`}>{counts[view]}</span>
            </Link>
          ))}
        </nav>
      </section>

      <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white">
        {filteredLeads.length > 0 ? (
          <div className="divide-y divide-neutral-200">
            {filteredLeads.map((lead) => {
              const ocrStatus = lead.ocr_status || 'pending';
              const total = formatNumber(lead.invoice_total_eur, ' €');
              const consumption = formatNumber(lead.consumption_kwh, ' kWh');
              const power = formatNumber(lead.contracted_power_kw, ' kW');

              return (
                <Link key={lead.id} href={`/admin/facturas/${lead.id}`} className="grid gap-4 p-5 transition-colors hover:bg-[#F5F9F3] lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${statusClass(lead.status)}`}>{statusLabels[lead.status] || lead.status}</span>
                      <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-[11px] font-semibold text-neutral-600">{ocrLabels[ocrStatus] || ocrStatus}</span>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${actionClass(lead.action.tone)}`}>{lead.action.label}</span>
                    </div>

                    <h2 className="mt-3 text-xl font-semibold tracking-[-0.035em] text-neutral-950">{lead.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-neutral-500">
                      Contacto: {lead.phone} · {supplyLabel(lead.supply_type)} · {customerLabel(lead.customer_type)}{lead.locality ? ` · ${lead.locality}` : ''}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-neutral-500">
                      <span className="rounded-full bg-neutral-50 px-3 py-1">{total ? `Total ${total}` : 'Total pendiente'}</span>
                      <span className="rounded-full bg-neutral-50 px-3 py-1">{consumption ? `Consumo ${consumption}` : 'Consumo pendiente'}</span>
                      <span className="rounded-full bg-neutral-50 px-3 py-1">{power ? `Potencia ${power}` : 'Potencia pendiente'}</span>
                      {lead.has_extra_services ? <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Servicios añadidos</span> : null}
                    </div>

                    <p className="mt-3 text-xs font-bold text-neutral-400">
                      Recibida {new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(lead.created_at))} · {followupText(lead)}
                    </p>
                  </div>

                  <div className="text-left lg:text-right">
                    <p className="text-sm font-semibold text-lakuntza-greenDark">Abrir solicitud</p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : leads.length > 0 ? (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-black tracking-[-0.04em] text-neutral-950">No hay facturas en esta vista.</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">Cambia a otra pestaña para ver más solicitudes.</p>
            <Link href="/admin/facturas?view=all" className="mt-6 inline-flex rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-black text-white">Ver todas</Link>
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

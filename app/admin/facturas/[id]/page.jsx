import { notFound } from 'next/navigation';
import IntakeNotificationNotice from '@/components/admin/IntakeNotificationNotice';
import AdminShell from '@/components/admin/AdminShell';
import AdminNotice from '@/components/admin/AdminNotice';
import SimpleInvoiceActionPanel from '@/components/admin/SimpleInvoiceActionPanel';
import { requireAnyPermission } from '@/lib/admin';
import { hasPermission, canEditLeads } from '@/lib/rolePermissions';
import { assignInvoiceLead } from '../assignment-actions';
import { updateInvoiceLead } from '../actions';
import { updateInvoiceAnalysis } from '../analysis-actions';
import { prepareInvoiceOcr } from '../ocr-actions';

export const metadata = {
  title: 'Factura recibida',
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

const analysisLabels = {
  pending: 'Pendiente',
  viable: 'Viable',
  review: 'Revisar',
  not_viable: 'No viable',
};

const ocrLabels = {
  pending: 'Pendiente',
  processing: 'Procesando',
  succeeded: 'Completada',
  failed: 'Revisión manual',
  not_applicable: 'No aplica',
};

function display(value) {
  if (value === null || value === undefined || value === '') return 'No indicado';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  return String(value).replace('.', ',');
}

function numberValue(value) {
  return value === null || value === undefined ? '' : String(value).replace('.', ',');
}

function card(label, value) {
  return (
    <div className="min-w-0 rounded-lg bg-[#F4F7F3] p-4">
      <p className="text-xs font-medium text-neutral-600">{label}</p>
      <p className="mt-2 break-words text-sm font-bold leading-6 text-neutral-800">{display(value)}</p>
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
  if (value === 'familia_numerosa') return 'Familia numerosa: posible derecho a bono social';
  if (value === 'si') return 'Sí / situación especial declarada';
  if (value === 'no') return 'No';
  if (value === 'no_lo_se') return 'No lo sé';
  return value;
}

function badgeClass(value) {
  if (value === 'viable' || value === 'succeeded' || value === 'converted') return 'bg-[#F3FAEF] text-lakuntza-greenDark';
  if (value === 'review' || value === 'reviewing' || value === 'failed') return 'bg-amber-50 text-amber-700';
  if (value === 'not_viable' || value === 'discarded') return 'bg-red-50 text-red-700';
  if (value === 'contacted' || value === 'processing') return 'bg-blue-50 text-blue-700';
  return 'bg-neutral-100 text-neutral-600';
}

function normalizeSpanishPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('34') && digits.length >= 11) return digits;
  if (digits.length === 9) return `34${digits}`;
  return digits;
}

function summaryRows(ocrData) {
  if (!ocrData) return [];
  const invoice = ocrData.invoice || {};
  const electricity = ocrData.electricity || {};
  const consumption = electricity.consumption_kwh || {};
  const power = electricity.contracted_power_kw || {};
  const amounts = ocrData.amounts || {};
  const signals = ocrData.commercial_signals || {};

  return [
    ['Comercializadora', invoice.supplier],
    ['Nº factura', invoice.invoice_number],
    ['Periodo', invoice.billing_period_start && invoice.billing_period_end ? `${invoice.billing_period_start} → ${invoice.billing_period_end}` : null],
    ['CUPS', electricity.cups],
    ['Tarifa / peaje', electricity.access_tariff],
    ...[1, 2, 3, 4, 5, 6].map((n) => ['Potencia P' + n, power['p' + n] != null ? display(power['p' + n]) + ' kW' : null]),
    ['Consumo total', consumption.total != null ? `${display(consumption.total)} kWh` : null],
    ...[1, 2, 3, 4, 5, 6].map((n) => ['Consumo P' + n, consumption['p' + n] != null ? display(consumption['p' + n]) + ' kWh' : null]),
    ['Importe energía', amounts.energy_amount_eur ? `${display(amounts.energy_amount_eur)} €` : null],
    ['Importe potencia', amounts.power_amount_eur ? `${display(amounts.power_amount_eur)} €` : null],
    ['IVA', amounts.vat_eur ? `${display(amounts.vat_eur)} €` : null],
    ['Total factura', amounts.total_eur ? `${display(amounts.total_eur)} €` : null],
    ['Servicios facturados', signals.has_extra_services_billed],
  ];
}

export default async function AdminInvoiceLeadDetailPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { supabase, admin } = await requireAnyPermission('leads.read_all', 'leads.read_assigned');
  const mayEdit = canEditLeads(admin);
  const mayDelete = hasPermission(admin, 'leads.delete');
  const mayAssign = hasPermission(admin, 'leads.assign') && hasPermission(admin, 'leads.edit_all');
  const { data: lead } = await supabase
    .from('invoice_review_leads')
    .select('*')
    .eq('id', resolvedParams.id)
    .maybeSingle();

  if (!lead) notFound();

  const { data: agents } = mayAssign ? await supabase
    .from('admin_users')
    .select('user_id, email, role, active')
    .eq('role', 'agent').eq('active', true).order('email') : { data: [] };

  const { data: latestOcr } = await supabase
    .from('invoice_ocr_results')
    .select('id, created_at, provider, ocr_status, confidence_avg, requires_manual_review, error_message, processed_at, extracted_json')
    .eq('lead_id', lead.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const documentUrl = lead.file_path ? '/admin/facturas/' + lead.id + '/archivo' : null;

  const normalizedPhone = normalizeSpanishPhone(lead.phone);
  const telHref = normalizedPhone ? `tel:+${normalizedPhone}` : '#';
  const analysisReasons = Array.isArray(lead.analysis_reasons) ? lead.analysis_reasons : [];
  const ocrStatus = latestOcr?.ocr_status || lead.ocr_status || 'pending';
  const ocrData = latestOcr?.extracted_json || null;
  const rows = summaryRows(ocrData);

  return (
    <AdminShell title="Factura recibida" description="Ficha sencilla para revisar datos, contactar y dejar el estado actualizado.">
      <AdminNotice success={resolvedSearchParams?.success} error={resolvedSearchParams?.error} />

      <IntakeNotificationNotice status={lead.notification_status} />

      <SimpleInvoiceActionPanel lead={lead} latestOcr={latestOcr} telHref={telHref} canEdit={mayEdit} />

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <section className="rounded-xl border border-neutral-200 bg-white p-6 lg:col-span-8 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${badgeClass(lead.status)}`}>{statusLabels[lead.status] || lead.status}</span>
            <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${badgeClass(ocrStatus)}`}>Lectura: {ocrLabels[ocrStatus] || ocrStatus}</span>
            <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${badgeClass(lead.analysis_result)}`}>{analysisLabels[lead.analysis_result] || 'Pendiente'}</span>
          </div>

          <h2 className="mt-4 break-words text-3xl font-semibold tracking-[-0.04em] text-neutral-950">{lead.name}</h2>
          <p className="mt-2 text-sm text-neutral-600">Recibida el {new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(lead.created_at))}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {card('Teléfono', lead.phone)}
            {card('Email', lead.email)}
            {card('Localidad', lead.locality)}
            {card('Aviso de privacidad aceptado', lead.consent_accepted_at ? lead.privacy_notice_version : 'Sin aceptación web registrada')}
            {card('Compañía actual', lead.current_company)}
            {card('Suministro', supplyLabel(lead.supply_type))}
            {card('Cliente', customerLabel(lead.customer_type))}
            {card('Caso especial indicado', bonusLabel(lead.bonus_status))}
            {card('Archivo', lead.file_size ? `${Math.round(lead.file_size / 1024)} KB` : null)}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="min-w-0 rounded-lg bg-[#F4F7F3] p-5">
              <p className="text-xs font-medium text-neutral-600">Comentario del cliente</p>
              <p className="mt-3 break-words text-sm leading-7 text-neutral-700">{lead.notes || 'Sin comentario.'}</p>
            </div>
            <div className="min-w-0 rounded-lg bg-[#F4F7F3] p-5">
              <p className="text-xs font-medium text-neutral-600">Notas internas</p>
              <p className="mt-3 whitespace-pre-line break-words text-sm leading-7 text-neutral-700">{lead.admin_notes || 'Sin notas internas.'}</p>
            </div>
          </div>
        </section>

        <aside className="grid gap-6 lg:col-span-4">
          <section className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
            <p className="text-sm font-semibold text-lakuntza-greenDark">Factura</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-neutral-950">Archivo recibido</h2>
            <p className="mt-3 break-all text-sm leading-6 text-neutral-600">{lead.file_name || 'Sin archivo'}</p>
            {documentUrl ? <a href={documentUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[#24662D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-lakuntza-greenDark">Descargar factura</a> : null}
            {mayEdit ? <form action={prepareInvoiceOcr} className="mt-3">
              <input type="hidden" name="id" value={lead.id} />
              <button className="inline-flex w-full items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-black text-neutral-800 transition hover:border-lakuntza-green">Procesar lectura</button>
            </form> : null}
            <p className="mt-4 text-xs leading-5 text-neutral-600">La lectura sirve como apoyo. Revisa siempre los datos importantes contra la factura.</p>
          </section>

          <section className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
            <p className="text-sm font-semibold text-lakuntza-greenDark">Gestión</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-neutral-950">Notas y estado</h2>
            {mayEdit ? <form action={updateInvoiceLead} className="mt-6 grid gap-4">
              <input type="hidden" name="id" value={lead.id} />
              <label className="grid gap-2 text-sm font-black text-neutral-800">
                Estado
                <select name="status" defaultValue={lead.status} className="min-h-12 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-lakuntza-green">
                  <option value="new">Nueva</option>
                  <option value="reviewing">En revisión</option>
                  <option value="contacted">Contactado</option>
                  <option value="converted">Convertido</option>
                  <option value="discarded">Descartado</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-black text-neutral-800">
                Notas internas
                <textarea name="adminNotes" rows={5} defaultValue={lead.admin_notes || ''} className="rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm font-medium leading-6 outline-none focus:border-lakuntza-green" placeholder="Ej.: llamar por la tarde, revisar potencia, interesado en luz y gas..." />
              </label>
              <button className="rounded-2xl bg-[#24662D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-lakuntza-greenDark">Guardar gestión</button>
            </form> : <p className="mt-4 text-sm text-neutral-600">Sin permiso para modificar esta solicitud.</p>}
            {mayDelete ? <a href={`/admin/facturas/${lead.id}/eliminar`} className="mt-5 inline-flex w-full items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-black text-red-700 transition hover:bg-red-100">Eliminar solicitud</a> : null}
          </section>
          {mayAssign ? <section className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-semibold">Asignar a un agente</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Los agentes solo acceden a solicitudes autorizadas o asignadas a su cuenta.</p>
            <form action={assignInvoiceLead} className="mt-5 grid gap-3">
              <input type="hidden" name="id" value={lead.id} />
              <label className="grid gap-2 text-sm font-semibold">Responsable
                <select name="assignedTo" defaultValue={lead.assigned_to || ''} className="min-h-12 rounded-xl border border-neutral-300 px-3 py-2">
                  <option value="">Sin asignar</option>
                  {(agents || []).map((agent) => <option value={agent.user_id} key={agent.user_id}>{agent.email}</option>)}
                </select>
              </label>
              <button className="min-h-11 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white">Guardar asignación</button>
            </form>
          </section> : null}
        </aside>
      </div>

      <section className="mt-6 rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-lakuntza-greenDark">Datos y decisión</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-neutral-950">Análisis interno</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">Datos internos para decidir cómo responder. No son una promesa automática de ahorro.</p>
          </div>
          <span className={`inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.14em] ${badgeClass(lead.analysis_result)}`}>{analysisLabels[lead.analysis_result] || 'Pendiente'}</span>
        </div>

        {rows.length > 0 ? (
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-600">Resumen de lectura</p>
                <p className="mt-2 text-sm leading-6 text-neutral-600">Datos extraídos automáticamente. El porcentaje indica campos detectados, no exactitud. Confirmar contra la factura antes de contactar.</p>
              </div>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-neutral-600">Campos detectados {latestOcr?.confidence_avg ?? '—'}%</span>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{rows.map(([label, value]) => card(label, value))}</div>
          </div>
        ) : null}

        <div className="mt-6 rounded-lg bg-[#F4F7F3] p-5">
          <p className="text-xs font-medium text-neutral-600">Motivos actuales</p>
          {analysisReasons.length > 0 ? <ul className="mt-3 grid gap-2 text-sm leading-6 text-neutral-700">{analysisReasons.map((reason) => <li key={reason} className="break-words">• {reason}</li>)}</ul> : <p className="mt-3 text-sm leading-6 text-neutral-600">Sin motivos guardados todavía.</p>}
        </div>

        {mayEdit ? <form action={updateInvoiceAnalysis} className="mt-6 grid gap-5">
          <input type="hidden" name="id" value={lead.id} />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="grid gap-2 text-sm font-black text-neutral-800">CUPS<input name="extractedCups" defaultValue={lead.extracted_cups || ''} className="min-h-12 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-lakuntza-green" /></label>
            <label className="grid gap-2 text-sm font-black text-neutral-800">Tarifa / peaje<input name="extractedTariff" defaultValue={lead.extracted_tariff || ''} className="min-h-12 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-lakuntza-green" /></label>
            <label className="grid gap-2 text-sm font-black text-neutral-800">Potencia kW<input name="contractedPowerKw" defaultValue={numberValue(lead.contracted_power_kw)} inputMode="decimal" className="min-h-12 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-lakuntza-green" /></label>
            <label className="grid gap-2 text-sm font-black text-neutral-800">Consumo kWh<input name="consumptionKwh" defaultValue={numberValue(lead.consumption_kwh)} inputMode="decimal" className="min-h-12 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-lakuntza-green" /></label>
            <label className="grid gap-2 text-sm font-black text-neutral-800">Total €<input name="invoiceTotalEur" defaultValue={numberValue(lead.invoice_total_eur)} inputMode="decimal" className="min-h-12 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-lakuntza-green" /></label>
            <label className="grid gap-2 text-sm font-black text-neutral-800">Días<input name="billingDays" defaultValue={lead.billing_days || ''} inputMode="numeric" className="min-h-12 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-lakuntza-green" /></label>
            <label className="grid gap-2 text-sm font-black text-neutral-800">Resultado<select name="analysisResult" defaultValue={lead.analysis_result || 'pending'} className="min-h-12 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-lakuntza-green"><option value="pending">Pendiente</option><option value="viable">Viable</option><option value="review">Revisar</option><option value="not_viable">No viable</option></select></label>
            <label className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-black text-neutral-800"><input name="hasExtraServices" type="checkbox" defaultChecked={Boolean(lead.has_extra_services)} className="h-4 w-4 accent-lakuntza-green" />Servicios añadidos</label>
          </div>
          <label className="grid gap-2 text-sm font-black text-neutral-800">Motivos / observaciones<textarea name="analysisReasons" rows={5} defaultValue={analysisReasons.join('\n')} className="rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm font-medium leading-6 outline-none focus:border-lakuntza-green" placeholder="Un motivo por línea" /></label>
          <button className="rounded-lg bg-[#24662D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-lakuntza-greenDark">Guardar análisis</button>
        </form> : null}
      </section>
    </AdminShell>
  );
}

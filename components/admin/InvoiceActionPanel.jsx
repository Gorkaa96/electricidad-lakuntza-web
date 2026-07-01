import { quickUpdateInvoiceStatus } from '@/app/admin/facturas/actions';
import { requireAdmin } from '@/lib/admin';

const statusActions = [
  ['reviewing', 'En revisión'],
  ['contacted', 'Contactado'],
  ['converted', 'Convertido'],
  ['discarded', 'Descartado'],
];

const eventLabels = {
  created: 'Solicitud',
  ocr_processed: 'Lectura',
  status_changed: 'Estado',
  analysis_saved: 'Análisis',
  contacted: 'Contacto',
  converted: 'Conversión',
  discarded: 'Descartado',
};

function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(String(value).replace(',', '.'));
  return Number.isFinite(number) ? number : null;
}

function formatNumber(value) {
  const number = toNumber(value);
  return number === null ? null : String(number).replace('.', ',');
}

function normalizedPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('34') && digits.length >= 11) return digits;
  if (digits.length === 9) return `34${digits}`;
  return digits;
}

function getOcr(latestOcr) {
  return latestOcr?.extracted_json || {};
}

function buildDecision(lead, latestOcr) {
  const ocr = getOcr(latestOcr);
  const total = toNumber(lead.invoice_total_eur ?? ocr.amounts?.total_eur ?? ocr.invoice?.total_amount_eur);
  const consumption = toNumber(lead.consumption_kwh ?? ocr.electricity?.consumption_kwh?.total);
  const isBusiness = lead.customer_type === 'negocio' || lead.customer_type === 'comunidad';
  const extraServices = Boolean(lead.has_extra_services || ocr.commercial_signals?.has_extra_services_billed);
  const ocrStatus = latestOcr?.ocr_status || lead.ocr_status || 'pending';
  const confidence = toNumber(latestOcr?.confidence_avg ?? lead.ocr_confidence_avg);

  if (lead.bonus_status === 'si' || lead.precheck_result === 'bonus_social_case') {
    return {
      tone: 'amber',
      title: 'Revisar con cuidado',
      text: 'El cliente ha indicado un posible caso especial. Confirma condiciones antes de recomendar cambios.',
      reasons: ['Dato indicado por el cliente', 'No hacer recomendación automática'],
    };
  }

  if (ocrStatus === 'failed') {
    return {
      tone: 'red',
      title: 'Revisar manualmente',
      text: 'La lectura no ha funcionado. Abre la factura y completa los datos principales antes de contactar.',
      reasons: ['Lectura fallida', 'Faltan datos estructurados'],
    };
  }

  if (ocrStatus !== 'succeeded') {
    return {
      tone: 'neutral',
      title: 'Procesar lectura',
      text: 'Primero conviene leer la factura para ver consumo, potencia, tarifa e importe.',
      reasons: ['Lectura pendiente'],
    };
  }

  if (confidence !== null && confidence < 70) {
    return {
      tone: 'amber',
      title: 'Validar datos',
      text: 'La lectura tiene confianza baja. Comprueba los campos clave contra la factura.',
      reasons: [`Confianza ${confidence}%`, 'Revisar CUPS, total, potencia y consumo'],
    };
  }

  if (lead.analysis_result === 'viable' || extraServices || isBusiness || (total !== null && total >= 90) || (consumption !== null && consumption >= 300)) {
    const reasons = [];
    if (lead.analysis_result === 'viable') reasons.push('Análisis viable');
    if (isBusiness) reasons.push('Negocio o comunidad');
    if (extraServices) reasons.push('Servicios añadidos detectados');
    if (total !== null && total >= 90) reasons.push(`Importe ${String(total).replace('.', ',')} €`);
    if (consumption !== null && consumption >= 300) reasons.push(`Consumo ${String(consumption).replace('.', ',')} kWh`);

    return {
      tone: 'green',
      title: 'Contactar',
      text: 'Hay datos suficientes para comentar la revisión con el cliente, sin prometer ahorro automático.',
      reasons: reasons.length ? reasons : ['Datos suficientes para contacto'],
    };
  }

  if (lead.analysis_result === 'not_viable') {
    return {
      tone: 'neutral',
      title: 'Sin urgencia',
      text: 'No se ve una oportunidad clara. Responder con transparencia o cerrar si procede.',
      reasons: ['Análisis no viable'],
    };
  }

  return {
    tone: 'amber',
    title: 'Validar y decidir',
    text: 'La lectura tiene datos, pero conviene revisar precio, potencia y servicios antes de contactar.',
    reasons: ['Revisión normal'],
  };
}

function buildWhatsapp(lead, latestOcr) {
  const ocr = getOcr(latestOcr);
  const firstName = String(lead.name || '').trim().split(/\s+/)[0] || '';
  const greeting = firstName ? `Hola ${firstName}, soy Electricidad Lakuntza.` : 'Hola, soy Electricidad Lakuntza.';
  const supplier = ocr.invoice?.supplier || lead.current_company;
  const total = formatNumber(lead.invoice_total_eur ?? ocr.amounts?.total_eur ?? ocr.invoice?.total_amount_eur);
  const consumption = formatNumber(lead.consumption_kwh ?? ocr.electricity?.consumption_kwh?.total);
  const power = formatNumber(lead.contracted_power_kw ?? ocr.electricity?.contracted_power_kw?.p1);
  const tariff = lead.extracted_tariff || ocr.electricity?.access_tariff;

  const details = [];
  if (supplier) details.push(`compañía ${supplier}`);
  if (total) details.push(`importe ${total} €`);
  if (consumption) details.push(`consumo ${consumption} kWh`);
  if (power) details.push(`potencia ${power} kW`);
  if (tariff) details.push(`tarifa ${tariff}`);

  const summary = details.length ? ` (${details.join(', ')})` : '';
  return `${greeting} Hemos hecho una primera revisión de tu factura${summary}. No es una recomendación automática ni una promesa de ahorro; queremos explicarte lo que vemos y confirmar algunos datos antes de plantear nada. ¿Te puedo llamar o lo vemos por aquí?`;
}

function toneClasses(tone) {
  if (tone === 'green') return 'border-lakuntza-green/30 bg-[#F3FAEF]';
  if (tone === 'red') return 'border-red-200 bg-red-50';
  if (tone === 'amber') return 'border-amber-200 bg-amber-50';
  return 'border-neutral-200 bg-white';
}

async function getEvents(leadId) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from('invoice_lead_events')
    .select('id, created_at, event_type, title, description')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })
    .limit(4);
  return data || [];
}

export default async function InvoiceActionPanel({ lead, latestOcr, telHref }) {
  const decision = buildDecision(lead, latestOcr);
  const events = await getEvents(lead.id);
  const phone = normalizedPhone(lead.phone);
  const whatsappHref = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(buildWhatsapp(lead, latestOcr))}` : '#';

  return (
    <section className={`mb-6 rounded-[2rem] border p-6 shadow-card sm:p-8 ${toneClasses(decision.tone)}`}>
      <div className="grid gap-6 lg:grid-cols-[1fr_260px] lg:items-start">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-500">Qué hacer ahora</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-neutral-950">{decision.title}</h2>
          <p className="mt-3 max-w-3xl text-sm font-bold leading-7 text-neutral-700">{decision.text}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {decision.reasons.map((reason) => (
              <span key={reason} className="rounded-full bg-white/75 px-3 py-1.5 text-xs font-black text-neutral-700">{reason}</span>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <a href={telHref || '#'} className="inline-flex items-center justify-center rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-black text-white transition hover:bg-lakuntza-greenDark">Llamar</a>
          <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-black text-neutral-800 transition hover:border-lakuntza-green">WhatsApp</a>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white/75 p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-neutral-500">Estado rápido</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {statusActions.map(([status, label]) => (
              <form key={status} action={quickUpdateInvoiceStatus}>
                <input type="hidden" name="id" value={lead.id} />
                <input type="hidden" name="status" value={status} />
                <button disabled={lead.status === status} className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-xs font-black text-neutral-800 transition hover:border-lakuntza-green disabled:cursor-not-allowed disabled:opacity-45">
                  {lead.status === status ? `${label} ✓` : label}
                </button>
              </form>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white/75 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-neutral-500">Últimos movimientos</p>
            <span className="text-[11px] font-bold text-neutral-500">{events.length}</span>
          </div>
          <div className="mt-3 grid gap-2">
            {events.length > 0 ? events.map((event) => (
              <div key={event.id} className="rounded-2xl border border-neutral-200 bg-white p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-black text-neutral-900">{event.title}</p>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-neutral-500">{eventLabels[event.event_type] || event.event_type}</span>
                </div>
                {event.description ? <p className="mt-1 text-xs font-bold leading-5 text-neutral-600">{event.description}</p> : null}
                <p className="mt-1 text-[11px] font-bold text-neutral-400">{new Date(event.created_at).toLocaleString('es-ES')}</p>
              </div>
            )) : <p className="text-xs font-bold text-neutral-500">Sin movimientos todavía.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

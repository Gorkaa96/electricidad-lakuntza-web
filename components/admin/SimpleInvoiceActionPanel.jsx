import { quickUpdateInvoiceStatus } from '@/app/admin/facturas/actions';
import { requireAdmin } from '@/lib/admin';

const statusActions = [
  ['reviewing', 'En revisión'],
  ['contacted', 'Contactado'],
  ['converted', 'Convertido'],
  ['discarded', 'Descartado'],
];

function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(String(value).replace(',', '.'));
  return Number.isFinite(number) ? number : null;
}

function formatNumber(value) {
  const number = toNumber(value);
  return number === null ? null : String(number).replace('.', ',');
}

function normalizePhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('34') && digits.length >= 11) return digits;
  if (digits.length === 9) return `34${digits}`;
  return digits;
}

function ocrData(latestOcr) {
  return latestOcr?.extracted_json || {};
}

function decision(lead, latestOcr) {
  const data = ocrData(latestOcr);
  const status = latestOcr?.ocr_status || lead.ocr_status || 'pending';
  const total = toNumber(lead.invoice_total_eur ?? data.amounts?.total_eur);
  const consumption = toNumber(lead.consumption_kwh ?? data.electricity?.consumption_kwh?.total);
  const business = lead.customer_type === 'negocio' || lead.customer_type === 'comunidad';

  if (lead.bonus_status === 'si' || lead.precheck_result === 'bonus_social_case') return ['Revisar con cuidado', 'El cliente indicó un posible caso especial. Confirma condiciones antes de recomendar cambios.', 'amber'];
  if (status === 'failed') return ['Revisar manualmente', 'La lectura no ha funcionado. Abre la factura y completa los datos principales.', 'amber'];
  if (status !== 'succeeded') return ['Procesar lectura', 'Primero lee la factura para ver consumo, potencia, tarifa e importe.', 'neutral'];
  if (lead.analysis_result === 'viable' || lead.has_extra_services || business || (total !== null && total >= 90) || (consumption !== null && consumption >= 300)) return ['Contactar', 'Hay datos suficientes para explicar la revisión al cliente sin prometer ahorro automático.', 'green'];
  if (lead.analysis_result === 'not_viable') return ['Sin urgencia', 'No se ve una oportunidad clara. Responde con transparencia o cierra si procede.', 'neutral'];
  return ['Validar y decidir', 'Revisa los datos principales antes de contactar.', 'amber'];
}

function whatsappMessage(lead, latestOcr) {
  const data = ocrData(latestOcr);
  const firstName = String(lead.name || '').trim().split(/\s+/)[0] || '';
  const greeting = firstName ? `Hola ${firstName}, soy Electricidad Lakuntza.` : 'Hola, soy Electricidad Lakuntza.';
  const items = [];
  const supplier = data.invoice?.supplier || lead.current_company;
  const total = formatNumber(lead.invoice_total_eur ?? data.amounts?.total_eur);
  const consumption = formatNumber(lead.consumption_kwh ?? data.electricity?.consumption_kwh?.total);
  const power = formatNumber(lead.contracted_power_kw ?? data.electricity?.contracted_power_kw?.p1);
  const tariff = lead.extracted_tariff || data.electricity?.access_tariff;

  if (supplier) items.push(`compañía ${supplier}`);
  if (total) items.push(`importe ${total} €`);
  if (consumption) items.push(`consumo ${consumption} kWh`);
  if (power) items.push(`potencia ${power} kW`);
  if (tariff) items.push(`tarifa ${tariff}`);

  const detail = items.length ? ` (${items.join(', ')})` : '';
  return `${greeting} Hemos hecho una primera revisión de tu factura${detail}. No es una recomendación automática ni una promesa de ahorro; queremos explicarte lo que vemos y confirmar algunos datos antes de plantear nada. ¿Te puedo llamar o lo vemos por aquí?`;
}

function panelClass(tone) {
  if (tone === 'green') return 'border-lakuntza-green/30 bg-[#F3FAEF]';
  if (tone === 'amber') return 'border-amber-200 bg-amber-50';
  return 'border-neutral-200 bg-white';
}

async function recentEvents(leadId) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from('invoice_lead_events')
    .select('id, created_at, title')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })
    .limit(3);
  return data || [];
}

export default async function SimpleInvoiceActionPanel({ lead, latestOcr, telHref }) {
  const [title, text, tone] = decision(lead, latestOcr);
  const events = await recentEvents(lead.id);
  const phone = normalizePhone(lead.phone);
  const whatsappHref = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage(lead, latestOcr))}` : '#';

  return (
    <section className={`rounded-[2rem] border p-6 shadow-card sm:p-8 ${panelClass(tone)}`}>
      <div className="grid gap-6 lg:grid-cols-[1fr_240px] lg:items-start">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-500">Qué hacer ahora</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-neutral-950">{title}</h2>
          <p className="mt-3 max-w-3xl text-sm font-bold leading-7 text-neutral-700">{text}</p>
        </div>
        <div className="grid gap-3">
          <a href={telHref || '#'} className="rounded-2xl bg-neutral-950 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-lakuntza-greenDark">Llamar</a>
          <a href={whatsappHref} target="_blank" rel="noreferrer" className="rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-center text-sm font-black text-neutral-800 transition hover:border-lakuntza-green">WhatsApp</a>
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
          <p className="text-xs font-black uppercase tracking-[0.14em] text-neutral-500">Últimos movimientos</p>
          <div className="mt-3 grid gap-2">
            {events.length > 0 ? events.map((event) => (
              <div key={event.id} className="rounded-2xl border border-neutral-200 bg-white p-3">
                <p className="text-sm font-black text-neutral-900">{event.title}</p>
                <p className="mt-1 text-[11px] font-bold text-neutral-400">{new Date(event.created_at).toLocaleString('es-ES')}</p>
              </div>
            )) : <p className="text-xs font-bold text-neutral-500">Sin movimientos todavía.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

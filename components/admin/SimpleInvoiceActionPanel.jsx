import QuickStatusButtons from './QuickStatusButtons';
import { requireAdmin } from '@/lib/admin';

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
 const status=latestOcr?.ocr_status || lead.ocr_status || 'pending';
 if(lead.status==='converted' || lead.status==='discarded') return ['Caso finalizado','Puedes seguir consultando los documentos y el historial.','neutral'];
 if(lead.bonus_status==='si' || lead.precheck_result==='bonus_social_case') return ['Atención: posible bono social','Comprueba si el cliente perdería protección antes de valorar cualquier cambio.','amber'];
 if(status==='failed') return ['Comprobar factura manualmente','El archivo no se ha podido leer. Abre la factura y revisa importe y consumo.','amber'];
 if(status!=='succeeded') return ['Leer la factura','Comprueba los importes antes de subir una propuesta de Feníe.','neutral'];
 if(toNumber(lead.invoice_total_eur)==null) return ['Completar importe de factura','Revisa el total de la factura y guárdalo antes de comparar.','amber'];
 return ['Subir propuesta de Feníe','Adjunta el PDF oficial para ver de un vistazo la diferencia. Después confirma los datos y prepara el mensaje.','green'];
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

export default async function SimpleInvoiceActionPanel({ lead, latestOcr, telHref, canEdit = false }) {
  const [title, text, tone] = decision(lead, latestOcr);
  const events = await recentEvents(lead.id);
  const phone = normalizePhone(lead.phone);
  const whatsappHref = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage(lead, latestOcr))}` : '#';

  return (
    <section className={`rounded-xl border p-6 sm:p-8 ${panelClass(tone)}`}>
      <div className="grid gap-6 lg:grid-cols-[1fr_240px] lg:items-start">
        <div>
          <p className="text-sm font-semibold text-neutral-500">Qué hacer ahora</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-neutral-950">{title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-700">{text}</p>
        </div>
        <div className="grid gap-3">
          <a href="#propuesta-fenie" className="rounded-lg bg-[#24662D] px-5 py-3 text-center text-base font-semibold text-white transition hover:bg-lakuntza-greenDark">Ver comparativa</a>
          <a href={telHref || '#'} className="rounded-lg border border-[#C8DAC8] bg-white px-5 py-3 text-center text-base font-semibold text-[#215B37]">Llamar</a>
          <a href={whatsappHref} target="_blank" rel="noreferrer" className="rounded-lg border border-neutral-200 bg-white px-5 py-3 text-center text-sm font-black text-neutral-800 transition hover:border-lakuntza-green">WhatsApp</a>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg bg-white/75 p-4">
          <p className="text-xs font-semibold text-neutral-500">Estado rápido</p>
          {canEdit ? <QuickStatusButtons leadId={lead.id} initialStatus={lead.status} />:<p className="mt-3 text-sm text-neutral-500">Consulta en modo solo lectura.</p>}

        </div>
        <div className="rounded-lg bg-white/75 p-4">
          <p className="text-xs font-semibold text-neutral-500">Últimos movimientos</p>
          <div className="mt-3 grid gap-2">
            {events.length > 0 ? events.map((event) => (
              <div key={event.id} className="rounded-lg border border-neutral-200 bg-white p-3">
                <p className="text-sm font-semibold text-neutral-900">{event.title}</p>
                <p className="mt-1 text-[11px] font-bold text-neutral-400">{new Intl.DateTimeFormat('es-ES', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(event.created_at))}</p>
              </div>
            )) : <p className="text-xs font-bold text-neutral-500">Sin movimientos todavía.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

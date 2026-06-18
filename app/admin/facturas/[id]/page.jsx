import { notFound } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import AdminNotice from '@/components/admin/AdminNotice';
import { requireAdmin } from '@/lib/admin';
import { updateInvoiceLead } from '../actions';
import { updateInvoiceAnalysis } from '../analysis-actions';

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

const analysisLabels = {
  pending: 'Pendiente',
  viable: 'Viable',
  review: 'Revisar',
  not_viable: 'No viable',
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

function analysisClass(value) {
  if (value === 'viable') return 'bg-[#F3FAEF] text-lakuntza-greenDark';
  if (value === 'review') return 'bg-amber-50 text-amber-700';
  if (value === 'not_viable') return 'bg-red-50 text-red-700';
  return 'bg-neutral-100 text-neutral-500';
}

function numberValue(value) {
  return value === null || value === undefined ? '' : String(value).replace('.', ',');
}

function normalizeSpanishPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('34') && digits.length >= 11) return digits;
  if (digits.length === 9) return `34${digits}`;
  return digits;
}

function buildWhatsappMessage(lead) {
  const firstName = String(lead.name || '').trim().split(/\s+/)[0] || '';
  const greeting = firstName ? `Hola ${firstName}, soy Electricidad Lakuntza.` : 'Hola, soy Electricidad Lakuntza.';

  if (lead.analysis_result === 'viable') {
    return `${greeting} Hemos revisado tu factura y vemos que puede merecer la pena comentarla contigo. No es una recomendación automática: queremos explicarte el resultado y confirmar algunos datos antes de hacer cualquier cambio.`;
  }

  if (lead.precheck_result === 'bonus_social_case' || lead.bonus_status === 'si') {
    return `${greeting} Hemos recibido tu factura. Al indicar bono social, familia numerosa o un caso especial, preferimos revisarlo contigo con cuidado antes de recomendar ningún cambio.`;
  }

  if (lead.analysis_result === 'not_viable') {
    return `${greeting} Hemos revisado tu factura y, con los datos actuales, no vemos claro recomendar un cambio sin comentarlo antes. Te llamamos o hablamos por aquí y te lo explicamos con transparencia.`;
  }

  return `${greeting} Hemos recibido tu factura para revisión. Queremos comentarte el resultado y confirmar algunos datos para ver si merece la pena mejorar condiciones.`;
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

  const normalizedPhone = normalizeSpanishPhone(lead.phone);
  const telHref = normalizedPhone ? `tel:+${normalizedPhone}` : '#';
  const whatsappHref = normalizedPhone ? `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(buildWhatsappMessage(lead))}` : '#';
  const analysisReasons = Array.isArray(lead.analysis_reasons) ? lead.analysis_reasons : [];

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
            <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] ${analysisClass(lead.analysis_result)}`}>
              Análisis: {analysisLabels[lead.analysis_result] || 'Pendiente'}
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
              <a href={telHref} className="inline-flex w-full items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-black text-neutral-800 transition hover:border-lakuntza-green">
                Llamar cliente
              </a>
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-black text-white transition hover:bg-lakuntza-greenDark">
                WhatsApp cliente
              </a>
              <a href={`/admin/facturas/${lead.id}/eliminar`} className="inline-flex w-full items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-black text-red-700 transition hover:bg-red-100">
                Eliminar solicitud
              </a>
            </div>
          </section>
        </aside>
      </div>

      <section className="mt-6 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">Análisis interno</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-neutral-950">Datos extraídos y viabilidad</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
              Rellena los datos principales de la factura. El resultado es interno y sirve para acelerar la revisión, no para comunicar una promesa automática al cliente.
            </p>
          </div>
          <span className={`inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.14em] ${analysisClass(lead.analysis_result)}`}>
            {analysisLabels[lead.analysis_result] || 'Pendiente'}
          </span>
        </div>

        <div className="mt-6 rounded-2xl bg-neutral-50 p-5">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">Motivos actuales</p>
          {analysisReasons.length > 0 ? (
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-neutral-700">
              {analysisReasons.map((reason) => <li key={reason}>• {reason}</li>)}
            </ul>
          ) : (
            <p className="mt-3 text-sm leading-6 text-neutral-500">Sin motivos guardados todavía.</p>
          )}
        </div>

        <form action={updateInvoiceAnalysis} className="mt-6 grid gap-5">
          <input type="hidden" name="id" value={lead.id} />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="grid gap-2 text-sm font-black text-neutral-800">
              CUPS
              <input name="extractedCups" defaultValue={lead.extracted_cups || ''} className="min-h-12 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-lakuntza-green" placeholder="ES..." />
            </label>
            <label className="grid gap-2 text-sm font-black text-neutral-800">
              Tarifa / peaje
              <input name="extractedTariff" defaultValue={lead.extracted_tariff || ''} className="min-h-12 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-lakuntza-green" placeholder="2.0TD, RL.1..." />
            </label>
            <label className="grid gap-2 text-sm font-black text-neutral-800">
              Potencia kW
              <input name="contractedPowerKw" defaultValue={numberValue(lead.contracted_power_kw)} inputMode="decimal" className="min-h-12 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-lakuntza-green" placeholder="4,6" />
            </label>
            <label className="grid gap-2 text-sm font-black text-neutral-800">
              Consumo kWh
              <input name="consumptionKwh" defaultValue={numberValue(lead.consumption_kwh)} inputMode="decimal" className="min-h-12 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-lakuntza-green" placeholder="350" />
            </label>
            <label className="grid gap-2 text-sm font-black text-neutral-800">
              Total factura €
              <input name="invoiceTotalEur" defaultValue={numberValue(lead.invoice_total_eur)} inputMode="decimal" className="min-h-12 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-lakuntza-green" placeholder="95,40" />
            </label>
            <label className="grid gap-2 text-sm font-black text-neutral-800">
              Días facturados
              <input name="billingDays" defaultValue={lead.billing_days || ''} inputMode="numeric" className="min-h-12 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-lakuntza-green" placeholder="30" />
            </label>
            <label className="grid gap-2 text-sm font-black text-neutral-800">
              Resultado interno
              <select name="analysisResult" defaultValue={lead.analysis_result || 'pending'} className="min-h-12 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-lakuntza-green">
                <option value="pending">Calcular / pendiente</option>
                <option value="viable">Viable</option>
                <option value="review">Revisar</option>
                <option value="not_viable">No viable</option>
              </select>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-black text-neutral-800">
              <input name="hasExtraServices" type="checkbox" defaultChecked={Boolean(lead.has_extra_services)} className="h-4 w-4 accent-lakuntza-green" />
              Servicios añadidos
            </label>
          </div>

          <label className="grid gap-2 text-sm font-black text-neutral-800">
            Motivos / observaciones del análisis
            <textarea name="analysisReasons" rows={5} defaultValue={analysisReasons.join('\n')} className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium leading-6 outline-none focus:border-lakuntza-green" placeholder="Un motivo por línea. Ej.: potencia alta, consumo alto, servicios añadidos, bono social..." />
          </label>

          <button className="rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-black text-white transition hover:bg-lakuntza-greenDark">
            Guardar análisis
          </button>
        </form>
      </section>
    </AdminShell>
  );
}

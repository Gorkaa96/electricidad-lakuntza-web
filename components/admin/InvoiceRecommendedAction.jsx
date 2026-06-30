function numberValue(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(String(value).replace(',', '.'));
  return Number.isFinite(number) ? number : null;
}

function getOcrData(latestOcr) {
  return latestOcr?.extracted_json || {};
}

function buildRecommendation({ lead, latestOcr }) {
  const ocrData = getOcrData(latestOcr);
  const signals = ocrData.commercial_signals || {};
  const review = ocrData.review || {};

  const total = numberValue(lead.invoice_total_eur ?? ocrData.amounts?.total_eur ?? ocrData.invoice?.total_amount_eur);
  const consumption = numberValue(lead.consumption_kwh ?? ocrData.electricity?.consumption_kwh?.total);
  const isBusiness = lead.customer_type === 'negocio' || lead.customer_type === 'comunidad';
  const hasExtraServices = Boolean(lead.has_extra_services || signals.has_extra_services_billed);
  const hasPromoMessage = Boolean(signals.has_promotional_service_message);
  const sensitiveCase = lead.bonus_status === 'si' || lead.precheck_result === 'bonus_social_case' || signals.possible_sensitive_case;
  const ocrStatus = latestOcr?.ocr_status || lead.ocr_status || 'pending';
  const confidence = numberValue(latestOcr?.confidence_avg ?? lead.ocr_confidence_avg);

  if (sensitiveCase) {
    return {
      eyebrow: 'Revisión manual',
      title: 'Caso sensible: revisar antes de recomendar.',
      description: 'Hay señales de bono social, PVPC, TUR, familia numerosa o caso especial. Antes de hablar de cambio hay que revisar bien que no pierda ninguna ventaja.',
      tone: 'amber',
      action: 'Revisar factura y condiciones antes de contactar.',
      reasons: ['Caso sensible detectado', 'No recomendar cambio automático', 'Confirmar situación regulada o ayudas'],
    };
  }

  if (ocrStatus === 'failed') {
    return {
      eyebrow: 'Revisión manual',
      title: 'La lectura automática ha fallado.',
      description: 'No conviene contactar con una conclusión. Abre la factura, rellena los datos principales manualmente y guarda el análisis.',
      tone: 'red',
      action: 'Abrir factura y revisar manualmente.',
      reasons: ['OCR fallido', 'Faltan datos estructurados'],
    };
  }

  if (ocrStatus !== 'succeeded') {
    return {
      eyebrow: 'Pendiente',
      title: 'Procesar la lectura gratuita primero.',
      description: 'Todavía no hay datos suficientes para priorizar comercialmente esta factura. Ejecuta la lectura gratuita o revisa el PDF manualmente.',
      tone: 'neutral',
      action: 'Procesar lectura gratuita.',
      reasons: ['OCR pendiente', 'Faltan datos de consumo, potencia o total'],
    };
  }

  if (confidence !== null && confidence < 70) {
    return {
      eyebrow: 'Revisar datos',
      title: 'Confianza baja: confirmar campos clave.',
      description: 'La lectura ha funcionado, pero la confianza es baja. Antes de contactar, confirma CUPS, consumo, potencia, total y periodo.',
      tone: 'amber',
      action: 'Validar datos extraídos y guardar análisis.',
      reasons: [`Confianza ${confidence}%`, 'Riesgo de campo mal leído'],
    };
  }

  if (lead.analysis_result === 'viable' || hasExtraServices || isBusiness || (total !== null && total >= 90) || (consumption !== null && consumption >= 300)) {
    const reasons = [];
    if (lead.analysis_result === 'viable') reasons.push('Resultado interno viable');
    if (isBusiness) reasons.push('Negocio o comunidad');
    if (hasExtraServices) reasons.push('Posibles servicios añadidos facturados');
    if (hasPromoMessage) reasons.push('Mensaje comercial/mantenimiento detectado');
    if (total !== null && total >= 90) reasons.push(`Importe relevante: ${String(total).replace('.', ',')} €`);
    if (consumption !== null && consumption >= 300) reasons.push(`Consumo relevante: ${String(consumption).replace('.', ',')} kWh`);

    return {
      eyebrow: 'Prioridad alta',
      title: 'Contactar hoy y explicar la revisión.',
      description: 'Hay señales suficientes para tratar esta factura como oportunidad comercial. No prometas ahorro automático: comenta que se ha revisado y que merece la pena explicarlo.',
      tone: 'green',
      action: 'Llamar o enviar WhatsApp hoy.',
      reasons: reasons.length ? reasons : ['Señales comerciales detectadas'],
    };
  }

  if (lead.analysis_result === 'not_viable') {
    return {
      eyebrow: 'Baja prioridad',
      title: 'No priorizar comercialmente.',
      description: 'Con los datos actuales no parece una oportunidad clara. Se puede responder con transparencia o dejar para seguimiento posterior.',
      tone: 'neutral',
      action: 'Contactar sin urgencia o archivar si no interesa.',
      reasons: ['Resultado interno no viable'],
    };
  }

  return {
    eyebrow: 'Revisión normal',
    title: 'Revisar manualmente antes de contactar.',
    description: 'La lectura ha extraído datos, pero no hay una señal comercial fuerte. Confirma precio, potencia y posibles servicios antes de decidir.',
    tone: 'amber',
    action: 'Validar datos y decidir contacto.',
    reasons: review.reasons?.length ? review.reasons : ['No hay señal comercial fuerte'],
  };
}

function toneClasses(tone) {
  if (tone === 'green') return 'border-lakuntza-green/30 bg-[#F3FAEF] text-lakuntza-greenDark';
  if (tone === 'red') return 'border-red-200 bg-red-50 text-red-700';
  if (tone === 'amber') return 'border-amber-200 bg-amber-50 text-amber-800';
  return 'border-neutral-200 bg-white text-neutral-800';
}

function buttonClasses(tone) {
  if (tone === 'green') return 'bg-lakuntza-green text-white hover:bg-lakuntza-greenDark';
  if (tone === 'red') return 'bg-red-600 text-white hover:bg-red-700';
  return 'bg-neutral-950 text-white hover:bg-lakuntza-greenDark';
}

export default function InvoiceRecommendedAction({ lead, latestOcr, whatsappHref, telHref }) {
  const recommendation = buildRecommendation({ lead, latestOcr });
  const reasons = recommendation.reasons || [];

  return (
    <section className={`mb-6 rounded-[2rem] border p-6 shadow-card sm:p-8 ${toneClasses(recommendation.tone)}`}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] opacity-70">Siguiente acción recomendada</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-neutral-950">{recommendation.title}</h2>
          <p className="mt-3 max-w-3xl text-sm font-bold leading-7 opacity-80">{recommendation.description}</p>
          <p className="mt-4 inline-flex rounded-full bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-neutral-800">
            {recommendation.eyebrow} · {recommendation.action}
          </p>
        </div>

        <div className="grid min-w-full gap-3 sm:min-w-[220px] lg:min-w-[240px]">
          <a href={telHref || '#'} className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-black transition ${buttonClasses(recommendation.tone)}`}>
            Llamar
          </a>
          <a href={whatsappHref || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-black text-neutral-800 transition hover:border-lakuntza-green">
            WhatsApp
          </a>
        </div>
      </div>

      {reasons.length > 0 ? (
        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.slice(0, 6).map((reason) => (
            <div key={reason} className="rounded-2xl bg-white/70 p-4 text-sm font-bold leading-6 text-neutral-800">
              {reason}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

// No promise of savings: only like-for-like totals should be compared.
export function euros(value) {
  if (typeof value === 'number') return Number.isFinite(value) && value >= 0 ? value : null;
  if (!value) return null;
  const cleaned = String(value).trim().replace(/\s/g, '').replace(/€/g, '');
  const normalized = cleaned.includes(',') ? cleaned.replace(/\./g, '').replace(',', '.') : cleaned;
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;
  const n = Number(normalized);
  return Number.isFinite(n) && n >= 0 && n <= 1000000 ? n : null;
}
const round = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const iso = (d) => {
  const m = String(d || '').match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/);
  return m ? `${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}` : null;
};
export function extractOfferSnapshot(text) {
  const t = String(text || '').replace(/\u00a0/g,' ').replace(/\r/g,'\n').slice(0,120000);
  // Restrict auto-detection to an unambiguous all-in amount; do not mistake an
  // advertised saving, a price per kWh or an annual estimate for a total.
  const lines = t.split(/\n/).map(s=>s.trim()).filter(Boolean);
  let totalEur = null, withTax = false;
  for (const line of lines) {
    if (!/(?:total\s+(?:de\s+)?(?:la\s+)?propuesta|coste\s+total\s+(?:propuest[oa]|estimado)|importe\s+total\s+propuesto)/i.test(line)) continue;
    if (/ahorro|descuento|anual|mensual|kwh|€\s*\/\s*kwh/i.test(line)) continue;
    const money=line.match(/\b((?:\d{1,3}(?:\.\d{3})+|\d+),\d{2}|\d+\.\d{2})\s*(?:€|EUR)\b/i);
    if (!money) continue;
    totalEur=euros(money[1]);
    withTax=/iva\s+incluid[oa]|impuestos\s+incluid[oa]/i.test(line);
    break;
  }
  const period=t.match(/per[ií]odo\s+(?:de\s+)?(?:simulaci[oó]n|facturaci[oó]n|comparaci[oó]n)\s*:?\s*(\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{4})\s*(?:al?|hasta|–|-)\s*(\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{4})/i);
  const kwh=t.match(/consumo\s+(?:considerado|simulado|comparado|total)\s*:?\s*([\d.,]+)\s*kwh/i);
  const consumed = kwh ? euros(kwh[1]) : null;
  return {
    totalEur, includesTaxes:withTax,
    periodStart:period?iso(period[1]):null,periodEnd:period?iso(period[2]):null,
    consumptionKwh:consumed,
    needsAttention:/permanencia|penalizaci[oó]n|descuento\s+(?:temporal|primer)|servicios\s+adicionales/i.test(t),
    textReadable: t.trim().length>80
  };
}
export function compareOffer(invoice, offer, { humanVerified = false } = {}) {
  const current = euros(invoice?.totalEur), proposed = euros(offer?.totalEur);
  const unknown = (reason) => ({status:'not_comparable',differenceEur:null,percent:null,reason});
  if (current == null || current <= 0 || proposed == null) return unknown('Falta un importe total comparable de factura o propuesta.');
  if (!humanVerified) {
    if (!offer?.includesTaxes) return unknown('No se confirma que la propuesta incluya los mismos impuestos.');
    if (!invoice?.periodStart || !invoice?.periodEnd || !offer?.periodStart || !offer?.periodEnd ||
        invoice.periodStart !== offer.periodStart || invoice.periodEnd !== offer.periodEnd)
      return unknown('No se confirma el mismo periodo de facturación.');
    if (invoice?.consumptionKwh == null || offer?.consumptionKwh == null ||
        Math.abs(Number(invoice.consumptionKwh)-Number(offer.consumptionKwh))>0.01)
      return unknown('No se confirma el mismo consumo de la factura.');
  }
  const differenceEur = round(current - proposed);
  return {
    status:differenceEur>0?'estimated_better':differenceEur<0?'estimated_worse':'estimated_equal',
    differenceEur,percent:round(differenceEur/current*100),
    reason:humanVerified?'Validado por una persona: importes totales con impuestos, mismo periodo, consumo y servicios comparables.':
      'Lectura preliminar: periodos, consumo e impuestos coinciden. Revisar antes de comunicar al cliente.'
  };
}
export function offerEmail({name,invoiceTotal,proposalTotal,difference,notes}) {
  const first=String(name||'').trim().split(/\s+/)[0] || 'cliente';
  const amount=v=>Number(v).toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';
  const result=difference>0?`una diferencia estimada a favor de ${amount(difference)}`:difference<0?`un importe estimado ${amount(Math.abs(difference))} superior`:'un importe estimado igual';
  return `Hola ${first}:\n\nHemos revisado tu factura y preparado una propuesta de Feníe Energía.\n\nFactura actual: ${amount(invoiceTotal)}.\nPropuesta: ${amount(proposalTotal)}.\nLa comparación arroja ${result} para el periodo y consumo revisados.\n\n${notes?String(notes).slice(0,500)+'\n\n':''}Adjuntamos tu factura y la propuesta correspondiente para que puedas revisar las condiciones. Esta comparación es informativa y no implica una contratación ni garantiza ahorros futuros.\n\nSi tienes alguna duda, puedes responder a este correo.\n\nUn saludo,\nElectricidad Lakuntza`;
}

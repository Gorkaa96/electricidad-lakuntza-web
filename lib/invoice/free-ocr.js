function normalizeText(text) {
  return String(text || '')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function compactText(text) {
  return normalizeText(text).replace(/\n+/g, ' ');
}

function parseNumber(value) {
  if (value === null || value === undefined) return null;
  const cleaned = String(value).replace(/\./g, '').replace(',', '.').replace(/[^0-9.-]/g, '');
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
}

function parseDate(value) {
  if (!value) return null;
  const match = String(value).match(/(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})/);
  if (!match) return null;
  const day = match[1].padStart(2, '0');
  const month = match[2].padStart(2, '0');
  const year = match[3].length === 2 ? `20${match[3]}` : match[3];
  return `${year}-${month}-${day}`;
}

function asArray(patterns) {
  return Array.isArray(patterns) ? patterns : [patterns];
}

function findFirst(text, patterns) {
  for (const pattern of asArray(patterns)) {
    const match = text.match(pattern);
    if (match?.[1]) return String(match[1]).trim();
  }
  return null;
}

function findNumber(text, patterns) {
  const value = findFirst(text, patterns);
  return parseNumber(value);
}

function detectSupplier(text) {
  const suppliers = ['TotalEnergies', 'Iberdrola', 'Endesa', 'Naturgy', 'Repsol', 'Fenie Energía', 'EDP', 'Holaluz'];
  return suppliers.find((supplier) => new RegExp(supplier.replace('í', '[ií]'), 'i').test(text)) || null;
}

function detectAccessTariff(text) {
  const match = text.match(/\b(2\.0TD|3\.0TD|6\.1TD|RL\.?\s?\d|RLTA\.?\s?\d)\b/i);
  return match ? match[1].replace(/\s+/g, '').toUpperCase() : null;
}

function detectCups(text) {
  const match = text.match(/\bES[0-9A-Z]{16,24}\b/i);
  return match ? match[0].toUpperCase() : null;
}

function detectPeriod(text) {
  const patterns = [
    /periodo\s+de\s+facturaci[oó]n[^0-9]{0,30}(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})\s*(?:a|-|–|—|hasta)\s*(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i,
    /(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})\s*(?:a|-|–|—)\s*(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1] && match?.[2]) {
      const start = parseDate(match[1]);
      const end = parseDate(match[2]);
      const days = start && end ? Math.round((new Date(end) - new Date(start)) / 86400000) + 1 : null;
      return { start, end, days };
    }
  }

  return { start: null, end: null, days: null };
}

function detectConsumptionByPeriod(text) {
  const result = { total: null, p1: null, p2: null, p3: null };
  result.total = findNumber(text, [
    /consumo\s+total[^0-9]{0,30}([0-9.]+,[0-9]+|[0-9.]+)\s*kwh/i,
    /consumo[^0-9]{0,30}([0-9.]+,[0-9]+|[0-9.]+)\s*kwh/i,
  ]);

  const p1 = text.match(/(?:punta|p1)[^0-9]{0,30}([0-9.]+,[0-9]+|[0-9.]+)\s*kwh/i);
  const p2 = text.match(/(?:llano|p2)[^0-9]{0,30}([0-9.]+,[0-9]+|[0-9.]+)\s*kwh/i);
  const p3 = text.match(/(?:valle|p3)[^0-9]{0,30}([0-9.]+,[0-9]+|[0-9.]+)\s*kwh/i);

  result.p1 = p1?.[1] ? parseNumber(p1[1]) : null;
  result.p2 = p2?.[1] ? parseNumber(p2[1]) : null;
  result.p3 = p3?.[1] ? parseNumber(p3[1]) : null;

  if (!result.total && [result.p1, result.p2, result.p3].every((value) => typeof value === 'number')) {
    result.total = result.p1 + result.p2 + result.p3;
  }

  return result;
}

function detectContractedPower(text) {
  const value = findNumber(text, [
    /potencia\s+contratada[^0-9]{0,80}([0-9]+,[0-9]+|[0-9]+(?:\.[0-9]+)?)\s*kw/i,
    /potencia[^0-9]{0,40}([0-9]+,[0-9]+|[0-9]+(?:\.[0-9]+)?)\s*kw/i,
  ]);
  return { p1: value, p2: value, p3: null };
}

function detectMaxDemand(text) {
  return {
    p1: findNumber(text, [/max[ií]metro[^\n]{0,80}p1[^0-9]{0,20}([0-9]+,[0-9]+|[0-9]+(?:\.[0-9]+)?)\s*kw/i, /punta[^\n]{0,80}([0-9]+,[0-9]+|[0-9]+(?:\.[0-9]+)?)\s*kw/i]),
    p2: findNumber(text, [/max[ií]metro[^\n]{0,80}p2[^0-9]{0,20}([0-9]+,[0-9]+|[0-9]+(?:\.[0-9]+)?)\s*kw/i, /llano[^\n]{0,80}([0-9]+,[0-9]+|[0-9]+(?:\.[0-9]+)?)\s*kw/i]),
    p3: findNumber(text, [/max[ií]metro[^\n]{0,80}p3[^0-9]{0,20}([0-9]+,[0-9]+|[0-9]+(?:\.[0-9]+)?)\s*kw/i, /valle[^\n]{0,80}([0-9]+,[0-9]+|[0-9]+(?:\.[0-9]+)?)\s*kw/i]),
  };
}

function calculateConfidence(fields) {
  const relevant = Object.values(fields);
  const filled = relevant.filter((value) => value !== null && value !== undefined && value !== '').length;
  return Math.round((filled / relevant.length) * 100);
}

function buildReview({ totalAmount, totalConsumption, contractedPower, hasExtraServices, hasPromoMessage, accessTariff }) {
  const reasons = [];
  let result = 'review';

  if (totalConsumption !== null) reasons.push(`Consumo detectado: ${totalConsumption} kWh`);
  if (totalAmount !== null) reasons.push(`Importe total detectado: ${totalAmount} €`);
  if (contractedPower?.p1 !== null && contractedPower?.p1 !== undefined) reasons.push(`Potencia contratada detectada: ${contractedPower.p1} kW`);
  if (accessTariff) reasons.push(`Tarifa/peaje detectado: ${accessTariff}`);
  if (hasExtraServices) reasons.push('Se detectan posibles servicios añadidos facturados.');
  if (hasPromoMessage) reasons.push('Se detectan mensajes promocionales o de mantenimiento en la factura.');

  if (hasExtraServices || (totalAmount !== null && totalAmount >= 90) || (totalConsumption !== null && totalConsumption >= 300)) {
    result = 'viable';
  }

  if (totalAmount !== null && totalAmount < 35 && totalConsumption !== null && totalConsumption < 120 && !hasExtraServices) {
    result = 'not_viable';
  }

  return {
    requires_manual_review: true,
    suggested_analysis_result: result,
    reasons,
  };
}

export async function extractPdfTextFree(buffer) {
  const pdfParseModule = await import('pdf-parse');
  const pdfParse = pdfParseModule.default || pdfParseModule;
  const result = await pdfParse(buffer);
  return normalizeText(result.text || '');
}

export function parseInvoiceTextFree(text) {
  const normalized = normalizeText(text);
  const compact = compactText(normalized);
  const period = detectPeriod(compact);
  const supplier = detectSupplier(compact);
  const invoiceNumber = findFirst(compact, [
    /factura\s*(?:n[ºo.]|num(?:ero)?\.?|número)?[^A-Z0-9]{0,20}([A-Z0-9][A-Z0-9\/-]{5,})/i,
    /n[ºo.]\s*factura[^A-Z0-9]{0,20}([A-Z0-9][A-Z0-9\/-]{5,})/i,
  ]);
  const issueDate = parseDate(findFirst(compact, [/fecha\s+de\s+emisi[oó]n[^0-9]{0,20}(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i]));
  const dueDate = parseDate(findFirst(compact, [/fecha\s+(?:de\s+)?(?:pago|cargo|vencimiento)[^0-9]{0,20}(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i]));
  const cups = detectCups(compact);
  const accessTariff = detectAccessTariff(compact);
  const contractedPower = detectContractedPower(compact);
  const maxDemand = detectMaxDemand(compact);
  const consumption = detectConsumptionByPeriod(compact);
  const totalAmount = findNumber(compact, [
    /total\s+(?:factura|a\s+pagar|importe)[^0-9]{0,30}([0-9.]+,[0-9]{2})\s*€/i,
    /importe\s+total[^0-9]{0,30}([0-9.]+,[0-9]{2})\s*€/i,
    /total[^0-9]{0,20}([0-9.]+,[0-9]{2})\s*€/i,
  ]);

  const energyPrice = findNumber(compact, [/([0-9]+,[0-9]{5,}|[0-9]+\.[0-9]{5,})\s*€\/?kwh/i]);
  const powerPrice = findNumber(compact, [/([0-9]+,[0-9]{5,}|[0-9]+\.[0-9]{5,})\s*€\/?kw\s*d[ií]a/i]);
  const energyAmount = findNumber(compact, [/energ[ií]a[^€]{0,120}([0-9.]+,[0-9]{2})\s*€/i, /consumo[^€]{0,120}([0-9.]+,[0-9]{2})\s*€/i]);
  const powerAmount = findNumber(compact, [/potencia[^€]{0,120}([0-9.]+,[0-9]{2})\s*€/i]);
  const meterRental = findNumber(compact, [/alquiler[^€]{0,80}([0-9.]+,[0-9]{2})\s*€/i]);
  const electricityTax = findNumber(compact, [/impuesto\s+el[eé]ctrico[^€]{0,80}([0-9.]+,[0-9]{2})\s*€/i]);
  const vat = findNumber(compact, /iva[^€]{0,80}([0-9.]+,[0-9]{2})\s*€/i);
  const contractEndDate = parseDate(findFirst(compact, [/fin\s+(?:de\s+)?contrato[^0-9]{0,40}(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i]));
  const hasPromoMessage = /facilita|mantenimiento|servicio\s+de\s+reparaci[oó]n|protecci[oó]n/i.test(compact);
  const hasExtraServicesBilled = /servicios\s+adicionales[^€]{0,80}[0-9.]+,[0-9]{2}\s*€|mantenimiento[^€]{0,80}[0-9.]+,[0-9]{2}\s*€/i.test(compact);

  const confidence = calculateConfidence({ supplier, invoiceNumber, issueDate, cups, accessTariff, totalAmount, totalConsumption: consumption.total, contractedPower: contractedPower.p1 });
  const review = buildReview({ totalAmount, totalConsumption: consumption.total, contractedPower, hasExtraServices: hasExtraServicesBilled, hasPromoMessage, accessTariff });

  return {
    raw_text: normalized,
    confidence_avg: confidence,
    invoice: {
      supplier,
      invoice_number: invoiceNumber,
      issue_date: issueDate,
      billing_period_start: period.start,
      billing_period_end: period.end,
      billing_days: period.days,
      due_date: dueDate,
      supply_type: cups ? 'electricity' : null,
      total_amount_eur: totalAmount,
    },
    customer: {
      name: null,
      tax_id: null,
      supply_address: null,
      locality: null,
      province: null,
    },
    electricity: {
      cups,
      access_tariff: accessTariff,
      contracted_power_kw: contractedPower,
      max_demand_kw: maxDemand,
      consumption_kwh: consumption,
      energy_price_eur_kwh: energyPrice,
      power_price_eur_kw_day: powerPrice,
    },
    amounts: {
      energy_amount_eur: energyAmount,
      power_amount_eur: powerAmount,
      meter_rental_eur: meterRental,
      other_charges_eur: null,
      electricity_tax_eur: electricityTax,
      vat_eur: vat,
      total_eur: totalAmount,
    },
    commercial_signals: {
      has_extra_services_billed: hasExtraServicesBilled,
      has_promotional_service_message: hasPromoMessage,
      contract_end_date: contractEndDate,
      possible_sensitive_case: /bono\s+social|familia\s+numerosa|pvpc|tur/i.test(compact),
      sensitive_case_reason: null,
    },
    review,
  };
}

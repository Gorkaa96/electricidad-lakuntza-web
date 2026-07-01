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
    /periodo\s+facturaci[oó]n\s+elec\.?[^0-9]{0,30}(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})\s*(?:a|-|–|—|hasta)\s*(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i,
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

function detectBillingDays(text, fallback) {
  const value = findNumber(text, [
    /per[ií]odo\s+x\s+potencia\s+([0-9]{1,3})\s*d[ií]a\(s\)/i,
    /([0-9]{1,3})\s*d[ií]a\(s\)\s*x\s*[0-9]+[,\.][0-9]+\s*kw/i,
    /alquiler\s+de\s+equipos\s*\(([0-9]{1,3})\s*d[ií]as\)/i,
  ]);
  return value || fallback || null;
}

function detectConsumptionByPeriod(text) {
  const result = { total: null, p1: null, p2: null, p3: null };

  const grouped = text.match(/los\s+consumos\s+han\s+sido[^.]{0,120}punta:\s*([0-9.]+,[0-9]+|[0-9.]+)\s*kwh[^.]{0,80}llano:\s*([0-9.]+,[0-9]+|[0-9.]+)\s*kwh[^.]{0,80}valle:\s*([0-9.]+,[0-9]+|[0-9.]+)\s*kwh/i);
  if (grouped) {
    result.p1 = parseNumber(grouped[1]);
    result.p2 = parseNumber(grouped[2]);
    result.p3 = parseNumber(grouped[3]);
  }

  if (result.p1 === null) {
    const p1 = text.match(/(?:los\s+consumos\s+han\s+sido[^.]{0,80})?punta:\s*([0-9.]+,[0-9]+|[0-9.]+)\s*kwh/i);
    result.p1 = p1?.[1] ? parseNumber(p1[1]) : null;
  }
  if (result.p2 === null) {
    const p2 = text.match(/(?:los\s+consumos\s+han\s+sido[^.]{0,120})?llano:\s*([0-9.]+,[0-9]+|[0-9.]+)\s*kwh/i);
    result.p2 = p2?.[1] ? parseNumber(p2[1]) : null;
  }
  if (result.p3 === null) {
    const p3 = text.match(/(?:los\s+consumos\s+han\s+sido[^.]{0,160})?valle:\s*([0-9.]+,[0-9]+|[0-9.]+)\s*kwh/i);
    result.p3 = p3?.[1] ? parseNumber(p3[1]) : null;
  }

  result.total = findNumber(text, [
    /consumo\s+en\s+el\s+periodo\s+facturado\s+ha\s+sido\s+de\s+([0-9.]+,[0-9]+|[0-9.]+)\s*kwh/i,
    /consumo\s+total[^0-9]{0,30}([0-9.]+,[0-9]+|[0-9.]+)\s*kwh/i,
    /cantidad\s+([0-9.]+,[0-9]+|[0-9.]+)\s*kwh\s*=/i,
  ]);

  if ([result.p1, result.p2, result.p3].every((value) => typeof value === 'number')) {
    const sum = result.p1 + result.p2 + result.p3;
    if (result.total === null || result.total < sum) result.total = sum;
  }

  return result;
}

function detectContractedPower(text) {
  const p1p2 = text.match(/P1:\s*([0-9]+,[0-9]+|[0-9]+(?:\.[0-9]+)?)\s*P2:\s*([0-9]+,[0-9]+|[0-9]+(?:\.[0-9]+)?)\s*kW/i);
  if (p1p2) {
    return { p1: parseNumber(p1p2[1]), p2: parseNumber(p1p2[2]), p3: null };
  }

  const value = findNumber(text, [
    /potencia\s+contratada[^0-9]{0,80}([0-9]+,[0-9]+|[0-9]+(?:\.[0-9]+)?)\s*kw/i,
    /potencia[^0-9]{0,40}([0-9]+,[0-9]+|[0-9]+(?:\.[0-9]+)?)\s*kw/i,
  ]);
  return { p1: value, p2: value, p3: null };
}

function detectMaxDemand(text) {
  const grouped = text.match(/potencias\s+m[aá]ximas\s+demandadas[^.]{0,80}([0-9]+,[0-9]+|[0-9]+(?:\.[0-9]+)?)\s*kw\s+en\s+p1[^.]{0,80}([0-9]+,[0-9]+|[0-9]+(?:\.[0-9]+)?)\s*kw\s+en\s+p2[^.]{0,80}([0-9]+,[0-9]+|[0-9]+(?:\.[0-9]+)?)\s*kw\s+en\s+p3/i);
  if (grouped) {
    return { p1: parseNumber(grouped[1]), p2: parseNumber(grouped[2]), p3: parseNumber(grouped[3]) };
  }

  return {
    p1: findNumber(text, [/max[ií]metro[^\n]{0,80}p1[^0-9]{0,20}([0-9]+,[0-9]+|[0-9]+(?:\.[0-9]+)?)\s*kw/i]),
    p2: findNumber(text, [/max[ií]metro[^\n]{0,80}p2[^0-9]{0,20}([0-9]+,[0-9]+|[0-9]+(?:\.[0-9]+)?)\s*kw/i]),
    p3: findNumber(text, [/max[ií]metro[^\n]{0,80}p3[^0-9]{0,20}([0-9]+,[0-9]+|[0-9]+(?:\.[0-9]+)?)\s*kw/i]),
  };
}

function calculateConfidence(fields) {
  const relevant = Object.values(fields);
  const filled = relevant.filter((value) => value !== null && value !== undefined && value !== '').length;
  return Math.round((filled / relevant.length) * 100);
}

function detectSensitiveCase(text) {
  const normalized = compactText(text).toLowerCase();

  // Muchas facturas incluyen "financiación bono social" como coste regulado obligatorio.
  // Eso no significa que el cliente tenga bono social ni que sea un caso protegido.
  const explicitBonus = /(beneficiari[oa]|titular|acogid[oa]|dispone|tiene|aplica|con)\s+(?:del\s+)?bono\s+social|bono\s+social\s*[:\-]\s*(s[ií]|aplicado|activo)/i.test(normalized);
  const family = /familia\s+numerosa/i.test(normalized);
  const regulatedTariff = /\b(pvpc|tur)\b/i.test(normalized);

  if (explicitBonus) return { value: true, reason: 'Bono social indicado explícitamente en factura.' };
  if (family) return { value: true, reason: 'Familia numerosa indicada en factura.' };
  if (regulatedTariff) return { value: true, reason: 'PVPC/TUR indicado en factura.' };
  return { value: false, reason: null };
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
  const billingDays = detectBillingDays(compact, period.days);
  const totalAmount = findNumber(compact, [
    /importe\s+total\s+electricidad\s*\+\s*tasas\s+e\s+impuestos[^0-9]{0,30}([0-9.]+,[0-9]{2})\s*€/i,
    /factura\s+electricidad\s+n[ºo.]?[^.]{0,120}valor\s+de\s+([0-9.]+,[0-9]{2})\s*euros/i,
    /cu[aá]nto\s+tengo\s+que\s+pagar\??[^0-9]{0,40}([0-9.]+,[0-9]{2})\s*€/i,
    /importe\s+total[^0-9]{0,30}([0-9.]+,[0-9]{2})\s*€/i,
    /total\s+(?:factura|a\s+pagar|importe)[^0-9]{0,30}([0-9.]+,[0-9]{2})\s*€/i,
  ]);

  const energyPrice = findNumber(compact, [/([0-9]+,[0-9]{5,}|[0-9]+\.[0-9]{5,})\s*€\/?kwh/i]);
  const powerPrice = findNumber(compact, [/([0-9]+,[0-9]{5,}|[0-9]+\.[0-9]{5,})\s*€\/?kw\s*d[ií]a/i]);
  const energyAmount = findNumber(compact, [/consumo[^€]{0,120}([0-9.]+,[0-9]{2})\s*€/i, /energ[ií]a[^€]{0,120}([0-9.]+,[0-9]{2})\s*€/i]);
  const powerAmount = findNumber(compact, [/potencia[^€]{0,120}([0-9.]+,[0-9]{2})\s*€/i]);
  const meterRental = findNumber(compact, [/alquiler[^€]{0,80}([0-9.]+,[0-9]{2})\s*€/i]);
  const electricityTax = findNumber(compact, [/impuesto\s+el[eé]ctrico[^€]{0,80}([0-9.]+,[0-9]{2})\s*€/i]);
  const vat = findNumber(compact, /iva[^€]{0,80}([0-9.]+,[0-9]{2})\s*€/i);
  const contractEndDate = parseDate(findFirst(compact, [/fin\s+(?:de\s+)?contrato[^0-9]{0,40}(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i]));
  const hasPromoMessage = /facilita|mantenimiento|servicio\s+de\s+reparaci[oó]n|protecci[oó]n/i.test(compact);
  const hasExtraServicesBilled = /servicios\s+adicionales[^€]{0,80}[0-9.]+,[0-9]{2}\s*€|mantenimiento[^€]{0,80}[0-9.]+,[0-9]{2}\s*€/i.test(compact);
  const sensitiveCase = detectSensitiveCase(compact);

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
      billing_days: billingDays,
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
      possible_sensitive_case: sensitiveCase.value,
      sensitive_case_reason: sensitiveCase.reason,
    },
    review,
  };
}

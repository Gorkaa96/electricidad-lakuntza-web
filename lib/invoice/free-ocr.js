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
  const raw = String(value).trim();
  const cleaned = (raw.includes(',') ? raw.replace(/\./g, '').replace(',', '.') : raw).replace(/[^0-9.-]/g, '');
  if (!cleaned || !/^-?\d+(?:\.\d+)?$/.test(cleaned)) return null;
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

function summaryAmount(text, label) {
  const pattern = new RegExp('^\\s*(?:' + label + ')\\s*:?\\s+([0-9]+(?:\\.[0-9]{3})*,[0-9]{2}|[0-9]+\\.[0-9]{2})\\s*(?:€|EUR)?\\s*$', 'im');
  return parseNumber(text.match(pattern)?.[1]);
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
    /per[ií]odo\s+de\s+facturaci[oó]n\s*:?\s*(?:del?\s+)?(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})\s*(?:al?|hasta|-|–|—)\s*(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i,
    /periodo\s+facturaci[oó]n\s+elec\.?[^0-9]{0,30}(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})\s*(?:a|-|–|—|hasta)\s*(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i,
    /periodo\s+de\s+facturaci[oó]n[^0-9]{0,30}(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})\s*(?:a|-|–|—|hasta)\s*(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i,
    /(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})\s*(?:a|-|–|—)\s*(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1] && match?.[2]) {
      const start = parseDate(match[1]);
      const end = parseDate(match[2]);
      const days = start && end ? Math.round((new Date(end) - new Date(start)) / 86400000) : null;
      return { start, end, days };
    }
  }

  return { start: null, end: null, days: null };
}

function detectBillingDays(text, fallback) {
  const value = findNumber(text, [
    /t[eé]rmino\s+fijo\s*\(P[1-6]\)\s*[0-9.,]+\s*kW\s*x\s*(\d{1,3})\s*d[ií]as/i,
    /per[ií]odo\s+x\s+potencia\s+([0-9]{1,3})\s*d[ií]a\(s\)/i,
    /([0-9]{1,3})\s*d[ií]a\(s\)\s*x\s*[0-9]+[,\.][0-9]+\s*kw/i,
    /alquiler\s+de\s+equipos\s*\(([0-9]{1,3})\s*d[ií]as\)/i,
  ]);
  return value || fallback || null;
}

function detectConsumptionByPeriod(text) {
  const result = { total: null, p1: null, p2: null, p3: null, p4: null, p5: null, p6: null };
  // The active-energy row has six explicitly labelled periods. Never use
  // historical charts or reactive-energy rows as the billed consumption.
  const active = text.match(/\bActiva\s*-\s*Consumo\s+del\s+periodo\s+((?:[0-9.,]+\s*kWh\s*){6})/i);
  if (active) {
    const values = [...active[1].matchAll(/([0-9.,]+)\s*kWh/gi)].map((m) => parseNumber(m[1]));
    if (values.length === 6 && values.every((v) => v !== null)) {
      values.forEach((v, i) => { result['p' + (i + 1)] = v; });
      result.total = Math.round(values.reduce((a, b) => a + b, 0) * 1000) / 1000;
      return result;
    }
  }

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
  const labelled = Object.fromEntries([...text.matchAll(/\bP([1-6])\s*=\s*([0-9.,]+)\s*kW/gi)].map((m) => ['p' + m[1], parseNumber(m[2])]));
  if (Object.keys(labelled).length) {
    return Object.fromEntries([1, 2, 3, 4, 5, 6].map((n) => ['p' + n, labelled['p' + n] ?? null]));
  }
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

  // Extraction cannot establish savings or eligibility. Compare offers in the
  // official Feníe CRM and let a person record the commercial decision.

  return {
    requires_manual_review: true,
    suggested_analysis_result: result,
    reasons,
  };
}

export async function extractPdfTextFree(buffer) {
  const { CanvasFactory, getPath } = await import('pdf-parse/worker');
  const { PDFParse } = await import('pdf-parse');
  PDFParse.setWorker(getPath());
  // Own the bytes: do not transfer a pooled Node Buffer to the PDF worker.
  const parser = new PDFParse({ data: new Uint8Array(buffer), CanvasFactory, isEvalSupported: false });
  try {
    const result = await parser.getText();
    return normalizeText(result.text || '');
  } finally {
    await parser.destroy();
  }
}

export function parseInvoiceTextFree(text) {
  const normalized = normalizeText(text);
  const compact = compactText(normalized);
  const period = detectPeriod(compact);
  const supplier = detectSupplier(compact);
  const invoiceNumber = findFirst(compact, [
    /fecha\s+y\s+n[ºo°.]?\s*factura\s*:\s*\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\s*\/\s*([A-Z0-9][A-Z0-9/-]{5,})/i,
    /factura\s+(?:n[ºo.]|num(?:ero)?\.?|número)\s*:?\s*([A-Z0-9][A-Z0-9\/-]{5,})/i,
    /n[ºo.]\s*factura[^A-Z0-9]{0,20}([A-Z0-9][A-Z0-9\/-]{5,})/i,
  ]);
  const issueDate = parseDate(findFirst(compact, [/fecha\s+y\s+n[ºo°.]?\s*factura\s*:\s*(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i, /fecha\s+de\s+emisi[oó]n[^0-9]{0,20}(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i]));
  const dueDate = parseDate(findFirst(compact, [/fecha\s+(?:de\s+)?(?:pago|cargo|vencimiento)(?:\s+factura)?[^0-9]{0,20}(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i]));
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
    /total\s+(?:factura|a\s+pagar|importe)[^0-9]{0,30}([0-9.]+,[0-9]{2})\s*(?:€|EUR)/i,
  ]);

  const energyPrice = findNumber(compact, [/([0-9]+,[0-9]{5,}|[0-9]+\.[0-9]{5,})\s*€\/?kwh/i]);
  const powerPrice = findNumber(compact, [/([0-9]+,[0-9]{5,}|[0-9]+\.[0-9]{5,})\s*€\/?kw\s*d[ií]a/i]);
  // Read complete amounts from labelled summary lines. A greedy cross-line
  // expression can silently truncate 196,70 to 6,70 or read the taxable base as IVA.
  const energyAmount = summaryAmount(normalized, 'consumo|energ[ií]a');
  const powerAmount = summaryAmount(normalized, 't[eé]rmino fijo|potencia');
  const meterRental = summaryAmount(normalized, 'alquiler(?: de contador| de equipos)?');
  const electricityTax = summaryAmount(normalized, 'impuesto el[eé]ctrico');
  const vat = summaryAmount(normalized, 'iva(?:\\s*\\([^\\n]*?\\))?(?:\\s+de\\s+[0-9.,]+)?');
  const regulatedCharges = summaryAmount(normalized, 'financiaci[oó]n bono social');
  const contractEndDate = parseDate(findFirst(compact, [/f(?:in|echa final)\s+(?:de\s+)?contrato[^0-9]{0,40}(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i]));
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
      energy_price_eur_kwh: /^(3\.0TD|6\.1TD)$/.test(accessTariff || '') ? null : energyPrice,
      power_price_eur_kw_day: powerPrice,
    },
    amounts: {
      energy_amount_eur: energyAmount,
      power_amount_eur: powerAmount,
      meter_rental_eur: meterRental,
      other_charges_eur: regulatedCharges,
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

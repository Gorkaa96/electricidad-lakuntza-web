import test from 'node:test';
import assert from 'node:assert/strict';
import { parseInvoiceTextFree } from '../lib/invoice/free-ocr.js';

test('decimal-point prices retain their decimal value', () => {
  const parsed = parseInvoiceTextFree('Precio energía 0.149426 €/kWh. Total factura 1.234,56 €');
  assert.equal(parsed.electricity.energy_price_eur_kwh, 0.149426);
  assert.equal(parsed.amounts.total_eur, 1234.56);
});
test('large and small invoices both require a professional comparison', () => {
  for (const total of ['150,00', '20,00']) {
    const parsed = parseInvoiceTextFree('Total factura ' + total + ' €');
    assert.equal(parsed.review.suggested_analysis_result, 'review');
    assert.equal(parsed.review.requires_manual_review, true);
  }
});

test('six-period summary preserves full amounts, explicit days and zero periods', () => {
  // Entirely fictitious values; no customer document or identifier is stored.
  const parsed = parseInvoiceTextFree("Repsol\nPeriodo de Facturación: del 01.01.2025 al 01.02.2025\nFecha y Nº Factura: 03.02.2025 / QA20250001\nFecha de cargo factura: 04.02.2025\nPeaje de transporte y distribución:3.0TD\nPotencias Contratadas: P1=16,5kW; P2=16,5kW; P3=16,5kW;\nP4=16,5kW; P5=16,5kW; P6=16,5kW\nTérmino fijo 88,25 €\nConsumo 210,40 €\nImpuesto Eléctrico 15,27 €\nAlquiler de contador 6,08 €\nIVA (21 %) de 320,00 67,20 €\nTOTAL FACTURA 387,20 €\nPeriodo1 Periodo2 Periodo3 Periodo4 Periodo5 Periodo6\nActiva - Consumo del periodo 0 kWh 0 kWh 510 kWh 420 kWh 0 kWh 120 kWh\nReactiva - Consumo del periodo 0 KVArh 0 KVArh 30 KVArh 25 KVArh 0 KVArh 5 KVArh\nTérmino fijo (P1) 16,500 kW x 31 días x 20,000000 €/kWaño 28,03\nConsumo (P3) 510 kWh x 0,200000 €/kWh 102,00\nFinanciación Bono Social 31 días x 0,025000 €/día 0,78\nFecha final contrato: 01.02.2026");
  assert.equal(parsed.invoice.invoice_number, 'QA20250001');
  assert.equal(parsed.invoice.issue_date, '2025-02-03');
  assert.equal(parsed.invoice.due_date, '2025-02-04');
  assert.equal(parsed.invoice.billing_days, 31);
  assert.equal(parsed.electricity.contracted_power_kw.p6, 16.5);
  assert.deepEqual(parsed.electricity.consumption_kwh, {total:1050,p1:0,p2:0,p3:510,p4:420,p5:0,p6:120});
  assert.equal(parsed.electricity.energy_price_eur_kwh, null, 'six-period price must not be flattened to one period');
  assert.equal(parsed.amounts.energy_amount_eur, 210.4);
  assert.equal(parsed.amounts.power_amount_eur, 88.25);
  assert.equal(parsed.amounts.electricity_tax_eur, 15.27);
  assert.equal(parsed.amounts.vat_eur, 67.2);
  assert.equal(parsed.amounts.meter_rental_eur, 6.08);
  assert.equal(parsed.amounts.total_eur, 387.2);
  assert.equal(parsed.commercial_signals.contract_end_date, '2026-02-01');
  assert.equal(parsed.commercial_signals.possible_sensitive_case, false);
  assert.equal(parsed.review.requires_manual_review, true);
});

test('taxable base and generic prose do not become invoice values', () => {
  const parsed = parseInvoiceTextFree('Tu factura de electricidad\nIVA (21 %) de 320,00\nConsumo estimado del gráfico 210,40 €');
  assert.equal(parsed.invoice.invoice_number, null);
  assert.equal(parsed.amounts.vat_eur, null);
  assert.equal(parsed.amounts.energy_amount_eur, null);
});

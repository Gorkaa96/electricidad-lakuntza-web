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

import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSyntheticInvoicePdf } from './fixtures/invoice-pdf.mjs';
import { extractPdfTextFree, parseInvoiceTextFree } from '../lib/invoice/free-ocr.js';

test('the synthetic QA invoice is a readable PDF with no commercial decision', async () => {
  const bytes = buildSyntheticInvoicePdf();
  assert.equal(bytes.subarray(0, 5).toString('ascii'), '%PDF-');
  const text = await extractPdfTextFree(bytes);
  assert.match(text, /FACTURA SINTETICA/);
  assert.match(text, /150,00 EUR/);
  assert.equal(parseInvoiceTextFree(text).review.suggested_analysis_result, 'review');
});

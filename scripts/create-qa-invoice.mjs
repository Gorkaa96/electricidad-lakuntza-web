import { mkdir, writeFile } from 'node:fs/promises';
import { buildSyntheticInvoicePdf } from '../tests/fixtures/invoice-pdf.mjs';
await mkdir('qa-output', { recursive: true });
await writeFile('qa-output/factura-sintetica.pdf', buildSyntheticInvoicePdf());
console.log('Synthetic invoice created in qa-output; contains no real personal data.');

// No real customer, address, account or supply identifiers.
export function buildSyntheticInvoicePdf() {
  const lines = [
    'FACTURA SINTETICA - SOLO PRUEBA',
    'Documento ficticio. No valido para contratar ni facturar.',
    'Contacto QA: prueba@example.invalid',
    'Referencia: QA-LAKUNTZA-001',
    'Periodo: 01/10/2026 a 31/10/2026',
    'Consumo total: 300 kWh',
    'Total factura: 150,00 EUR',
  ];
  const escape = text => text.replace(/([\\()])/g, '\\$1');
  const stream = 'BT /F1 12 Tf 50 780 Td 20 TL ' +
    lines.map((line, i) => (i ? 'T* ' : '') + '(' + escape(line) + ') Tj').join('\n') + ' ET';
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Length ' + Buffer.byteLength(stream, 'latin1') + ' >>\nstream\n' + stream + '\nendstream',
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, 'latin1'));
    pdf += (index + 1) + ' 0 obj\n' + object + '\nendobj\n';
  });
  const xref = Buffer.byteLength(pdf, 'latin1');
  pdf += 'xref\n0 6\n0000000000 65535 f \n' +
    offsets.slice(1).map(offset => String(offset).padStart(10, '0') + ' 00000 n \n').join('') +
    'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF\n';
  return Buffer.from(pdf, 'latin1');
}

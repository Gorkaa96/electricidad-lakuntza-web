import test from 'node:test';
import assert from 'node:assert/strict';
import {euros,extractOfferSnapshot,compareOffer,offerEmail} from '../lib/fenie/compare.mjs';
const invoice={totalEur:125.40,periodStart:'2026-10-01',periodEnd:'2026-10-31',consumptionKwh:310};
test('parse amounts in Spanish format',()=>{assert.equal(euros('1.234,56'),1234.56);assert.equal(euros('-10'),null);});
test('a complete like-for-like proposal yields preliminary improvement',()=>{
 const offer=extractOfferSnapshot('Simulación de Feníe Energía.\nPeriodo de comparación: 01/10/2026 al 31/10/2026\nConsumo considerado: 310 kWh\nCoste total propuesto: 108,40 € IVA incluido\n');
 assert.equal(offer.totalEur,108.40);assert.equal(compareOffer(invoice,offer).differenceEur,17);
});
test('missing or mismatched periods cannot report savings',()=>{assert.equal(compareOffer(invoice,{totalEur:100,includesTaxes:true}).status,'not_comparable');});
test('human reviewed data can correctly report higher costs',()=>{let d=compareOffer(invoice,{totalEur:138.4},{humanVerified:true});assert.equal(d.status,'estimated_worse');assert.equal(d.differenceEur,-13);});
test('draft says estimated and never claims actual sending',()=>{let body=offerEmail({name:'Marta',invoiceTotal:125.4,proposalTotal:108.4,difference:17});assert.match(body,/diferencia estimada/);assert.match(body,/Adjuntamos tu factura/);});

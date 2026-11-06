import test from 'node:test';
import assert from 'node:assert/strict';
import { quotaOutcome } from '../lib/invoice/quota-outcome.mjs';
test('only an explicit successful false response means quota exceeded', () => {
  assert.equal(quotaOutcome({data:false,status:200}), 'limited');
  assert.equal(quotaOutcome({data:true,status:200}), 'allowed');
  for (const result of [{data:false,status:401},{data:true,error:{code:'FAIL'}},{data:null,status:200},{data:false,error:{code:'NETWORK'}}]) assert.equal(quotaOutcome(result), 'unavailable');
});

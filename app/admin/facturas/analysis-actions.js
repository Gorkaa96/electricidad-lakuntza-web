'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';

const allowedResults = ['pending', 'viable', 'review', 'not_viable'];

function clean(value, limit = 500) {
  return String(value || '').trim().slice(0, limit);
}

function numberOrNull(value) {
  const parsed = Number(String(value || '').replace(',', '.').trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function integerOrNull(value) {
  const parsed = numberOrNull(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : null;
}

export async function updateInvoiceAnalysis(formData) {
  const { supabase } = await requireAdmin();
  const id = clean(formData.get('id'), 80);
  if (!id) redirect('/admin/facturas?error=datos');

  const selectedResult = clean(formData.get('analysisResult'), 30);
  const analysisResult = allowedResults.includes(selectedResult) ? selectedResult : 'review';
  const hasExtraServices = formData.get('hasExtraServices') === 'on';
  const notes = clean(formData.get('analysisReasons'), 1500);
  const reasons = notes ? notes.split('\n').map((item) => item.trim()).filter(Boolean) : [];

  const { error } = await supabase
    .from('invoice_review_leads')
    .update({
      extracted_cups: clean(formData.get('extractedCups'), 80).toUpperCase() || null,
      extracted_tariff: clean(formData.get('extractedTariff'), 80) || null,
      contracted_power_kw: numberOrNull(formData.get('contractedPowerKw')),
      consumption_kwh: numberOrNull(formData.get('consumptionKwh')),
      invoice_total_eur: numberOrNull(formData.get('invoiceTotalEur')),
      billing_days: integerOrNull(formData.get('billingDays')),
      has_extra_services: hasExtraServices,
      analysis_result: analysisResult,
      analysis_reasons: reasons,
    })
    .eq('id', id);

  if (error) redirect(`/admin/facturas/${id}?error=analisis`);

  revalidatePath('/admin/facturas');
  revalidatePath(`/admin/facturas/${id}`);
  redirect(`/admin/facturas/${id}?success=analisis`);
}

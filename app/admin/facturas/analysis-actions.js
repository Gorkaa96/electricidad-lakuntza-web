'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';

const allowedResults = ['pending', 'viable', 'review', 'not_viable'];

const resultLabels = {
  pending: 'Pendiente',
  viable: 'Viable',
  review: 'Revisar',
  not_viable: 'No viable',
};

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
  const contractedPower = numberOrNull(formData.get('contractedPowerKw'));
  const consumption = numberOrNull(formData.get('consumptionKwh'));
  const total = numberOrNull(formData.get('invoiceTotalEur'));
  const billingDays = integerOrNull(formData.get('billingDays'));

  const { error } = await supabase
    .from('invoice_review_leads')
    .update({
      extracted_cups: clean(formData.get('extractedCups'), 80).toUpperCase() || null,
      extracted_tariff: clean(formData.get('extractedTariff'), 80) || null,
      contracted_power_kw: contractedPower,
      consumption_kwh: consumption,
      invoice_total_eur: total,
      billing_days: billingDays,
      has_extra_services: hasExtraServices,
      analysis_result: analysisResult,
      analysis_reasons: reasons,
    })
    .eq('id', id);

  if (error) redirect(`/admin/facturas/${id}?error=analisis`);

  await supabase.from('invoice_lead_events').insert({
    lead_id: id,
    event_type: 'analysis_saved',
    title: `Análisis guardado: ${resultLabels[analysisResult] || analysisResult}`,
    description: reasons.length ? reasons.slice(0, 3).join(' · ') : 'Análisis interno actualizado manualmente.',
    metadata: {
      analysis_result: analysisResult,
      contracted_power_kw: contractedPower,
      consumption_kwh: consumption,
      invoice_total_eur: total,
      billing_days: billingDays,
      has_extra_services: hasExtraServices,
      reasons_count: reasons.length,
    },
  });

  revalidatePath('/admin/facturas');
  revalidatePath(`/admin/facturas/${id}`);
  redirect(`/admin/facturas/${id}?success=analisis`);
}

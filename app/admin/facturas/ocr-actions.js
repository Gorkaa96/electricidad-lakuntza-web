'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';

export async function prepareInvoiceOcr(formData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get('id') || '').trim();

  if (!id) redirect('/admin/facturas?error=datos');

  const { data: lead, error: leadError } = await supabase
    .from('invoice_review_leads')
    .select('id, file_path')
    .eq('id', id)
    .maybeSingle();

  if (leadError || !lead) redirect('/admin/facturas?error=datos');
  if (!lead.file_path) redirect(`/admin/facturas/${id}?error=ocr_archivo`);

  const { error: insertError } = await supabase
    .from('invoice_ocr_results')
    .insert({
      lead_id: id,
      provider: 'pending_provider',
      ocr_status: 'pending',
      source_file_path: lead.file_path,
      extracted_json: {},
      requires_manual_review: true,
    });

  if (insertError) redirect(`/admin/facturas/${id}?error=ocr`);

  const { error: updateError } = await supabase
    .from('invoice_review_leads')
    .update({
      ocr_status: 'pending',
      ocr_confidence_avg: null,
      ocr_requires_manual_review: true,
      ocr_processed_at: null,
    })
    .eq('id', id);

  if (updateError) redirect(`/admin/facturas/${id}?error=ocr`);

  revalidatePath('/admin/facturas');
  revalidatePath(`/admin/facturas/${id}`);
  redirect(`/admin/facturas/${id}?success=ocr_preparado`);
}

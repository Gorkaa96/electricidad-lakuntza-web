'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';

const allowedStatuses = ['new', 'reviewing', 'contacted', 'converted', 'discarded'];

function statusPayload(status) {
  const payload = { status };
  const now = new Date().toISOString();
  if (status === 'contacted') payload.contacted_at = now;
  if (status === 'converted') payload.converted_at = now;
  return payload;
}

export async function updateInvoiceLead(formData) {
  const { supabase } = await requireAdmin();

  const id = String(formData.get('id') || '').trim();
  const status = String(formData.get('status') || '').trim();
  const adminNotes = String(formData.get('adminNotes') || '').trim().slice(0, 2000);

  if (!id || !allowedStatuses.includes(status)) {
    redirect('/admin/facturas?error=datos');
  }

  const payload = {
    ...statusPayload(status),
    admin_notes: adminNotes || null,
  };

  const { error } = await supabase
    .from('invoice_review_leads')
    .update(payload)
    .eq('id', id);

  if (error) {
    redirect(`/admin/facturas/${id}?error=estado`);
  }

  revalidatePath('/admin/facturas');
  revalidatePath(`/admin/facturas/${id}`);
  redirect(`/admin/facturas/${id}?success=estado`);
}

export async function quickUpdateInvoiceStatus(formData) {
  const { supabase } = await requireAdmin();

  const id = String(formData.get('id') || '').trim();
  const status = String(formData.get('status') || '').trim();

  if (!id || !allowedStatuses.includes(status)) {
    redirect('/admin/facturas?error=datos');
  }

  const { error } = await supabase
    .from('invoice_review_leads')
    .update(statusPayload(status))
    .eq('id', id);

  if (error) {
    redirect(`/admin/facturas/${id}?error=estado`);
  }

  revalidatePath('/admin/facturas');
  revalidatePath(`/admin/facturas/${id}`);
  redirect(`/admin/facturas/${id}?success=estado`);
}

export async function deleteInvoiceLead(formData) {
  const { supabase } = await requireAdmin();

  const id = String(formData.get('id') || '').trim();
  const confirm = String(formData.get('confirmDelete') || '').trim().toUpperCase();

  if (!id || confirm !== 'ELIMINAR') {
    redirect(`/admin/facturas/${id || ''}?error=confirmacion`);
  }

  const { data: lead, error: readError } = await supabase
    .from('invoice_review_leads')
    .select('id, file_path')
    .eq('id', id)
    .maybeSingle();

  if (readError || !lead) {
    redirect('/admin/facturas?error=datos');
  }

  if (lead.file_path) {
    await supabase.storage.from('invoice-files').remove([lead.file_path]);
  }

  const { error } = await supabase
    .from('invoice_review_leads')
    .delete()
    .eq('id', id);

  if (error) {
    redirect(`/admin/facturas/${id}?error=eliminar`);
  }

  revalidatePath('/admin/facturas');
  redirect('/admin/facturas?success=eliminada');
}

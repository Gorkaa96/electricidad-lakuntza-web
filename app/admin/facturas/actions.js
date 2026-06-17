'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';

const allowedStatuses = ['new', 'reviewing', 'contacted', 'converted', 'discarded'];

export async function updateInvoiceLead(formData) {
  const { supabase } = await requireAdmin();

  const id = String(formData.get('id') || '').trim();
  const status = String(formData.get('status') || '').trim();
  const adminNotes = String(formData.get('adminNotes') || '').trim().slice(0, 2000);

  if (!id || !allowedStatuses.includes(status)) {
    redirect('/admin/facturas?error=datos');
  }

  const payload = {
    status,
    admin_notes: adminNotes || null,
  };

  if (status === 'contacted') payload.contacted_at = new Date().toISOString();
  if (status === 'converted') payload.converted_at = new Date().toISOString();

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

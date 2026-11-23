'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requirePermission } from '@/lib/admin';
import { hasPermission } from '@/lib/rolePermissions';

export async function assignInvoiceLead(formData) {
  const { supabase, admin } = await requirePermission('leads.assign');

  // An assigner must also have full edit permission. The database enforces it.
  if (!hasPermission(admin, 'leads.edit_all')) redirect('/admin/sin-permisos');

  const id = String(formData.get('id') || '').trim();
  const assignee = String(formData.get('assignedTo') || '').trim();

  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect('/admin/facturas?error=datos');

  if (assignee && !/^[0-9a-f-]{36}$/i.test(assignee)) {
    redirect(`/admin/facturas/${id}?error=asignacion`);
  }

  if (assignee) {
    const { data: member, error: memberError } = await supabase
      .from('admin_users')
      .select('user_id, role, active')
      .eq('user_id', assignee)
      .maybeSingle();
    if (memberError || !member || !member.active || member.role !== 'agent') {
      redirect(`/admin/facturas/${id}?error=asignacion`);
    }
  }

  const { data: updated, error } = await supabase
    .from('invoice_review_leads')
    .update({ assigned_to: assignee || null })
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error || !updated) redirect(`/admin/facturas/${id}?error=asignacion`);

  const { error: eventError } = await supabase
    .from('invoice_lead_events')
    .insert({
      lead_id: id,
      event_type: 'assignment_changed',
      title: assignee ? 'Solicitud asignada a un agente' : 'Solicitud sin agente asignado',
      metadata: { assigned_to: assignee || null },
    });

  if (eventError) {
    console.error('[lead-assignment] Could not record change event', eventError.code || 'unknown');
    redirect(`/admin/facturas/${id}?error=historial`);
  }

  revalidatePath('/admin/facturas');
  revalidatePath(`/admin/facturas/${id}`);
  redirect(`/admin/facturas/${id}?success=asignacion`);
}

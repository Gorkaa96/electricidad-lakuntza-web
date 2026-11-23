'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAnyPermission, requirePermission } from '@/lib/admin';

const allowedStatuses = ['new', 'reviewing', 'contacted', 'converted', 'discarded'];

const statusLabels = {
  new: 'Nueva',
  reviewing: 'En revisión',
  contacted: 'Contactado',
  converted: 'Convertido',
  discarded: 'Descartado',
};

function statusPayload(status) {
  const payload = { status };
  const now = new Date().toISOString();
  if (status === 'contacted') payload.contacted_at = now;
  if (status === 'converted') payload.converted_at = now;
  return payload;
}

function eventTypeForStatus(status) {
  if (status === 'contacted') return 'contacted';
  if (status === 'converted') return 'converted';
  if (status === 'discarded') return 'discarded';
  return 'status_changed';
}

async function insertStatusEvent({ supabase, leadId, status, source, adminNotes }) {
  await supabase.from('invoice_lead_events').insert({
    lead_id: leadId,
    event_type: eventTypeForStatus(status),
    title: `Estado actualizado: ${statusLabels[status] || status}`,
    description: adminNotes ? `Notas: ${adminNotes}` : `Cambio realizado desde ${source}.`,
    metadata: {
      status,
      source,
    },
  });
}

export async function updateInvoiceLead(formData) {
  const { supabase } = await requireAnyPermission('leads.edit_all', 'leads.edit_assigned');

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

  const { data: updatedLead, error } = await supabase
    .from('invoice_review_leads')
    .update(payload)
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error || !updatedLead) {
    redirect(`/admin/facturas/${id}?error=estado`);
  }

  await insertStatusEvent({ supabase, leadId: id, status, source: 'formulario de gestión', adminNotes });

  revalidatePath('/admin/facturas');
  revalidatePath(`/admin/facturas/${id}`);
  redirect(`/admin/facturas/${id}?success=estado`);
}

export async function quickUpdateInvoiceStatus(formData) {
  const { supabase } = await requireAnyPermission('leads.edit_all', 'leads.edit_assigned');

  const id = String(formData.get('id') || '').trim();
  const status = String(formData.get('status') || '').trim();

  if (!id || !allowedStatuses.includes(status)) {
    redirect('/admin/facturas?error=datos');
  }

  const { data: updatedLead, error } = await supabase
    .from('invoice_review_leads')
    .update(statusPayload(status))
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error || !updatedLead) {
    redirect(`/admin/facturas/${id}?error=estado`);
  }

  await insertStatusEvent({ supabase, leadId: id, status, source: 'acción rápida' });

  revalidatePath('/admin/facturas');
  revalidatePath(`/admin/facturas/${id}`);
  redirect(`/admin/facturas/${id}?success=estado`);
}

export async function deleteInvoiceLead(formData) {
  const { supabase } = await requirePermission('leads.delete');

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

  const {data:proposalDocs,error:proposalError}=await supabase.from('fenie_proposals')
    .select('file_path').eq('lead_id',id);
  if(proposalError) redirect(`/admin/facturas/${id}?error=archivo_eliminar`);
  if(proposalDocs?.length){
    const {error:removeProposals}=await supabase.storage.from('invoice-files')
      .remove(proposalDocs.map(row=>row.file_path));
    if(removeProposals){
      console.error('[invoice-delete] Proposal removal failed', {leadId:id});
      redirect(`/admin/facturas/${id}?error=archivo_eliminar`);
    }
  }

  if (lead.file_path) {
    const { error: fileDeleteError } = await supabase.storage.from('invoice-files').remove([lead.file_path]);
    // Never report a complete deletion while a private invoice may remain in storage.
    if (fileDeleteError) {
      console.error('[invoice-delete] Private file removal failed', { leadId: id, code: fileDeleteError.statusCode || 'unknown' });
      redirect(`/admin/facturas/${id}?error=archivo_eliminar`);
    }
  }

  const { data: deletedLead, error } = await supabase
    .from('invoice_review_leads')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error || !deletedLead) {
    redirect(`/admin/facturas/${id}?error=eliminar`);
  }

  revalidatePath('/admin/facturas');
  redirect('/admin/facturas?success=eliminada');
}

/** Update a quick status without navigating away from the current document. */
export async function setInvoiceStatusInline({id,expectedStatus,newStatus}) {
 const {supabase}=await requireAnyPermission('leads.edit_all','leads.edit_assigned');
 const uid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
 if(!uid.test(String(id||'')) || !allowedStatuses.includes(newStatus) ||
    !allowedStatuses.includes(expectedStatus) || expectedStatus===newStatus)
    return {ok:false,message:'Estado no válido.'};
 // Compare-and-set: never overwrite a colleague's more recent decision.
 const {data,error}=await supabase.from('invoice_review_leads')
  .update(statusPayload(newStatus)).eq('id',id).eq('status',expectedStatus)
  .select('id').maybeSingle();
 if(error || !data) return {ok:false,message:'No se ha guardado. Alguien pudo actualizar este expediente; recarga y revisa.'};
 await insertStatusEvent({supabase,leadId:id,status:newStatus,source:'estado rápido'});
 revalidatePath('/admin/facturas');
 revalidatePath('/admin/facturas/'+id);
 revalidatePath('/admin/oportunidades');
 return {ok:true,status:newStatus};
}

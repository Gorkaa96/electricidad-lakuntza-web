'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAnyPermission, requirePermission } from '@/lib/admin';
import { hasPermission } from '@/lib/rolePermissions';

const services = new Set(['luz', 'gas', 'luz_gas', 'alarmas', 'cargadores', 'asesoria']);
const customerTypes = new Set(['vivienda', 'negocio', 'comunidad', 'otro']);
const origins = new Set(['manual', 'whatsapp', 'telefono', 'email']);
const statuses = new Set(['new', 'reviewing', 'contacted', 'converted', 'discarded']);
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function clean(value, length = 160) {
  return String(value || '').trim().slice(0, length);
}

function followupDate(value) {
  const date = clean(value, 10);
  if (!date) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) return undefined;
  return date;
}

function validContact(phone, email) {
  if (!phone && !email) return false;
  if (phone && (phone.length < 7 || phone.length > 35 || !/^[+\d\s().-]+$/.test(phone))) return false;
  if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return false;
  return true;
}

export async function createCommercialLead(formData) {
  const { supabase, user } = await requirePermission('leads.edit_all');
  const service = clean(formData.get('service'), 40);
  const contactName = clean(formData.get('contactName'));
  const phone = clean(formData.get('contactPhone'), 35);
  const email = clean(formData.get('contactEmail'), 254).toLowerCase();
  const customerType = clean(formData.get('customerType'), 40);
  const origin = clean(formData.get('origin'), 40);
  const notes = clean(formData.get('notes'), 4000);
  const nextContactOn = followupDate(formData.get('nextContactOn'));

  if (!services.has(service) || contactName.length < 2 || !validContact(phone, email) ||
      !customerTypes.has(customerType) || !origins.has(origin) || nextContactOn === undefined) {
    redirect('/admin/oportunidades/nueva?error=datos');
  }

  const { data, error } = await supabase.from('commercial_leads')
    .insert({
      service,
      contact_name: contactName,
      contact_phone: phone || null,
      contact_email: email || null,
      customer_type: customerType,
      origin,
      notes: notes || null,
      next_contact_on: nextContactOn,
      created_by: user.id,
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('[commercial-crm] Cannot create opportunity', error?.code || 'unknown');
    redirect('/admin/oportunidades/nueva?error=guardar');
  }

  revalidatePath('/admin/oportunidades');
  redirect('/admin/oportunidades/' + data.id + '?success=creada');
}

export async function updateCommercialLead(formData) {
  const { supabase, admin } = await requireAnyPermission('leads.edit_all', 'leads.edit_assigned');
  const id = clean(formData.get('id'), 50);
  const status = clean(formData.get('status'), 30);
  const notes = clean(formData.get('notes'), 4000);
  const nextContactOn = followupDate(formData.get('nextContactOn'));

  if (!uuidPattern.test(id) || !statuses.has(status) || nextContactOn === undefined) {
    redirect('/admin/oportunidades?error=datos');
  }

  const payload = { status, notes: notes || null, next_contact_on: nextContactOn };
  if (status === 'contacted') payload.contacted_at = new Date().toISOString();
  if (status === 'converted') payload.converted_at = new Date().toISOString();

  if (formData.has('assignedTo') && hasPermission(admin, 'leads.assign') && hasPermission(admin, 'leads.edit_all')) {
    const assigneeId = clean(formData.get('assignedTo'), 50);
    if (assigneeId && !uuidPattern.test(assigneeId)) {
      redirect('/admin/oportunidades/' + id + '?error=asignacion');
    }
    if (assigneeId) {
      const { data: member, error: memberError } = await supabase.from('admin_users')
        .select('user_id, role, active').eq('user_id', assigneeId).maybeSingle();
      if (memberError || !member?.active || member.role !== 'agent') {
        redirect('/admin/oportunidades/' + id + '?error=asignacion');
      }
    }
    payload.assigned_to = assigneeId || null;
  }

  const { data, error } = await supabase.from('commercial_leads')
    .update(payload).eq('id', id).select('id').maybeSingle();

  if (error || !data) {
    console.error('[commercial-crm] Cannot update opportunity', error?.code || 'unknown');
    redirect('/admin/oportunidades/' + id + '?error=guardar');
  }

  revalidatePath('/admin/oportunidades');
  revalidatePath('/admin/oportunidades/' + id);
  redirect('/admin/oportunidades/' + id + '?success=actualizada');
}

export async function deleteCommercialLead(formData) {
  const { supabase } = await requirePermission('leads.delete');
  const id = clean(formData.get('id'), 50);
  const confirmation = clean(formData.get('confirmation'), 30).toUpperCase();
  if (!uuidPattern.test(id) || confirmation !== 'ELIMINAR') {
    redirect('/admin/oportunidades/' + id + '?error=confirmacion');
  }

  // A linked invoice owns its CRM entry. Delete it from the private invoice
  // workflow so the document, the invoice and the linked CRM row disappear together.
  const { data: linked, error: linkedError } = await supabase.from('commercial_leads')
    .select('invoice_review_lead_id').eq('id', id).maybeSingle();
  if (linkedError || !linked) redirect('/admin/oportunidades?error=datos');
  if (linked.invoice_review_lead_id) {
    redirect('/admin/facturas/' + linked.invoice_review_lead_id + '?error=eliminar_desde_factura');
  }
  const { data, error } = await supabase.from('commercial_leads')
    .delete().eq('id', id).select('id').maybeSingle();

  if (error || !data) {
    console.error('[commercial-crm] Cannot delete opportunity', error?.code || 'unknown');
    redirect('/admin/oportunidades/' + id + '?error=eliminar');
  }

  revalidatePath('/admin/oportunidades');
  redirect('/admin/oportunidades?success=eliminada');
}

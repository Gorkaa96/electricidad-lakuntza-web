'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { siteUrl } from '@/lib/site';

const allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const maxFileSize = 10 * 1024 * 1024;

function cleanText(value, fallback = '') {
  return String(value || fallback).trim().slice(0, 500);
}

function safeFileName(name) {
  return String(name || 'factura')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
    .slice(0, 90);
}

function getPrecheckResult({ bonusStatus }) {
  // A form submission is not evidence of savings. Human review is always required.
  return bonusStatus === 'si' ? 'bonus_social_case' : 'manual_review';
}

async function notifyByEmail({ leadId, name, phone, email, locality, supplyType, customerType, bonusStatus, currentCompany }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[invoice-notification] RESEND_API_KEY missing; lead remains in admin');
    return false;
  }

  const to = process.env.INVOICE_REVIEW_TO || 'eleclakuntza@yahoo.es';
  const from = process.env.RESEND_FROM || 'Electricidad Lakuntza <onboarding@resend.dev>';
  const adminUrl = `${siteUrl}/admin/facturas/${leadId}`;

  const body = [
    'Nueva factura recibida para revisión.',
    '',
    `Nombre: ${name}`,
    `Teléfono: ${phone}`,
    `Email: ${email || 'No indicado'}`,
    `Localidad: ${locality || 'No indicada'}`,
    `Suministro: ${supplyType}`,
    `Cliente: ${customerType}`,
    `Bono social / familia numerosa: ${bonusStatus}`,
    `Compañía actual: ${currentCompany || 'No indicada'}`,
    '',
    'Revisión humana pendiente: no se ha realizado comparación de tarifas.',
    `Abrir la solicitud en admin: ${adminUrl}`,
    '',
    'La factura no se adjunta por email; se consulta desde el panel privado.',
  ].join('\\n');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject: 'Nueva factura recibida · Electricidad Lakuntza',
        text: body,
      }),
      signal: AbortSignal.timeout(7000),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('[invoice-notification] Resend rejected the notification. HTTP status:', response.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error('[invoice-notification] Transport failure:', error?.name || 'unknown');
    return false;
  }
}

export async function submitInvoiceReview(formData) {
  const supabase = createSupabaseServerClient();
  if (!supabase) redirect('/revision-factura-luz-gas?error=config');

  const name = cleanText(formData.get('name'));
  const phone = cleanText(formData.get('phone'));
  const email = cleanText(formData.get('email'));
  const locality = cleanText(formData.get('locality'));
  const supplyType = cleanText(formData.get('supplyType'), 'luz');
  const customerType = cleanText(formData.get('customerType'), 'vivienda');
  const bonusStatus = cleanText(formData.get('bonusStatus'), 'no_lo_se');
  const currentCompany = cleanText(formData.get('currentCompany'));
  const notes = cleanText(formData.get('notes'));
  const consentAccepted = formData.get('consent') === 'on';
  if (formData.get('website')) redirect('/revision-factura-luz-gas/gracias?estado=pending');
  const file = formData.get('invoice');

  if (!name || !phone || !consentAccepted) redirect('/revision-factura-luz-gas?error=datos');
  if (!file || typeof file === 'string' || !file.size) redirect('/revision-factura-luz-gas?error=factura');
  if (!['luz', 'gas', 'luz_gas'].includes(supplyType) || !['vivienda', 'negocio', 'comunidad'].includes(customerType) || !['si', 'no', 'no_lo_se'].includes(bonusStatus)) redirect('/revision-factura-luz-gas?error=datos');
  if (!allowedFileTypes.includes(file.type)) redirect('/revision-factura-luz-gas?error=tipo');
  if (file.size > maxFileSize) redirect('/revision-factura-luz-gas?error=tamano');

  const leadId = crypto.randomUUID();
  const fileName = safeFileName(file.name);
  const filePath = `${leadId}/${Date.now()}-${fileName}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from('invoice-files')
    .upload(filePath, bytes, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) redirect('/revision-factura-luz-gas?error=subida');

  const precheckResult = getPrecheckResult({ bonusStatus, supplyType, customerType, currentCompany, notes });
  const userAgent = headers().get('user-agent') || '';

  const { error: insertError } = await supabase.from('invoice_review_leads').insert({
    id: leadId,
    name,
    phone,
    email: email || null,
    locality: locality || null,
    supply_type: supplyType,
    customer_type: customerType,
    bonus_status: bonusStatus,
    current_company: currentCompany || null,
    notes: notes || null,
    file_path: filePath,
    file_name: file.name,
    file_type: file.type,
    file_size: file.size,
    precheck_result: precheckResult,
    consent_accepted: consentAccepted,
    user_agent: userAgent,
  });

  if (insertError) {
    await supabase.storage.from('invoice-files').remove([filePath]);
    redirect('/revision-factura-luz-gas?error=registro');
  }

  await notifyByEmail({
    leadId,
    name,
    phone,
    email,
    locality,
    supplyType,
    customerType,
    bonusStatus,
    currentCompany,
  });

  redirect(`/revision-factura-luz-gas/gracias?estado=${precheckResult}`);
}

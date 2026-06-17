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

function getPrecheckResult({ bonusStatus, supplyType, customerType, currentCompany, notes }) {
  const text = `${currentCompany} ${notes}`.toLowerCase();

  if (bonusStatus === 'si') return 'bonus_social_case';
  if (supplyType === 'luz_gas') return 'potential_improvement';
  if (customerType !== 'vivienda') return 'potential_improvement';
  if (text.includes('servicio') || text.includes('mantenimiento') || text.includes('permanencia')) return 'potential_improvement';

  return 'manual_review';
}

function getPrecheckSummary(result) {
  if (result === 'bonus_social_case') {
    return 'Caso especial: posible bono social o familia numerosa. Conviene revisar manualmente antes de recomendar cualquier cambio.';
  }

  if (result === 'potential_improvement') {
    return 'Puede haber margen de mejora por tipo de suministro, condiciones del contrato o servicios asociados. Revisión prioritaria.';
  }

  return 'Factura recibida correctamente. Revisión manual necesaria para confirmar si existe margen de mejora.';
}

async function notifyByEmail({ leadId, name, phone, email, locality, supplyType, customerType, bonusStatus, currentCompany, result, summary }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

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
    `Tipo de suministro: ${supplyType}`,
    `Tipo de cliente: ${customerType}`,
    `Bono social / familia numerosa: ${bonusStatus}`,
    `Compañía actual: ${currentCompany || 'No indicada'}`,
    `Resultado inicial: ${result}`,
    `Resumen: ${summary}`,
    '',
    `Ver en el panel: ${adminUrl}`,
  ].join('\n');

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject: 'Nueva factura recibida para revisión',
      text: body,
    }),
  }).catch(() => null);
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
  const file = formData.get('invoice');

  if (!name || !phone || !consentAccepted) redirect('/revision-factura-luz-gas?error=datos');
  if (!file || typeof file === 'string' || !file.size) redirect('/revision-factura-luz-gas?error=factura');
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
  const resultSummary = getPrecheckSummary(precheckResult);
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
    result: precheckResult,
    summary: resultSummary,
  });

  redirect(`/revision-factura-luz-gas/gracias?estado=${precheckResult}`);
}

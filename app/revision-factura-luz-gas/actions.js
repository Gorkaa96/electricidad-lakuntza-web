'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { siteUrl } from '@/lib/site';
import { validateInvoiceContact } from '@/lib/invoice/validate-contact.mjs';

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

function getPrecheckResult() {
  // A form submission is never proof of savings or contract eligibility.
  return 'manual_review';
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
  ].join('\n');

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

  if (!validateInvoiceContact({ name, phone, email, consentAccepted })) {
    redirect('/revision-factura-luz-gas?error=datos#formulario');
  }
  if (!file || typeof file === 'string' || !file.size) redirect('/revision-factura-luz-gas?error=factura#formulario');
  if (!['luz', 'gas', 'luz_gas'].includes(supplyType) || !['vivienda', 'negocio', 'comunidad'].includes(customerType) || !['si', 'familia_numerosa', 'no', 'no_lo_se'].includes(bonusStatus)) redirect('/revision-factura-luz-gas?error=datos#formulario');
  if ((supplyType === 'luz' || supplyType === 'luz_gas') && ['si', 'familia_numerosa'].includes(bonusStatus)) redirect('/revision-factura-luz-gas?error=bono#formulario');
  if (!allowedFileTypes.includes(file.type)) redirect('/revision-factura-luz-gas?error=tipo#formulario');
  if (file.size > maxFileSize) redirect('/revision-factura-luz-gas?error=tamano#formulario');
  // La comprobación barata de datos se realiza antes de crear clientes o leer archivos.
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect('/revision-factura-luz-gas?error=config#formulario');

  const leadId = crypto.randomUUID();
  const fileName = safeFileName(file.name);
  const filePath = `${leadId}/${Date.now()}-${fileName}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const validSignature = (
    (file.type === 'application/pdf' && bytes.subarray(0, 5).toString('ascii') === '%PDF-') ||
    (file.type === 'image/jpeg' && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) ||
    (file.type === 'image/png' && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) ||
    (file.type === 'image/webp' && bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP')
  );
  if (!validSignature) redirect('/revision-factura-luz-gas?error=tipo#formulario');

  const { error: uploadError } = await supabase.storage
    .from('invoice-files')
    .upload(filePath, bytes, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) redirect('/revision-factura-luz-gas?error=subida#formulario');

  const precheckResult = getPrecheckResult({ bonusStatus, supplyType, customerType, currentCompany, notes });
  const userAgent = (await headers()).get('user-agent') || '';

  const { error: insertError } = await supabase.from('invoice_review_leads').insert({
    id: leadId,
    name,
    phone,
    email: email || null,
    locality: locality || null,
    supply_type: supplyType,
    customer_type: customerType,
    // Reuse existing DB values until the column's CHECK/enum can be verified.
    bonus_status: bonusStatus === 'familia_numerosa' ? 'si' : bonusStatus,
    current_company: currentCompany || null,
    notes: bonusStatus === 'familia_numerosa' ? ['Familia numerosa declarada (consulta de gas).', notes].filter(Boolean).join(' ').slice(0, 500) : (notes || null),
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
    redirect('/revision-factura-luz-gas?error=registro#formulario');
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

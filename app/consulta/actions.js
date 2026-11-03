'use server';

import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createCommercialIntakeClient } from '@/lib/supabase/commercial-intake';
import { commercialIntakeReady, verifyPublicHuman, consumePublicQuotas } from '@/lib/invoice/protection';
import { newCommercialReceipt } from '@/lib/commercial/receipt';
import { validContactChannels } from '@/lib/contact-validation.mjs';
import { PRIVACY_NOTICE_VERSION } from '@/lib/privacy-notice.mjs';
import { recordNotificationResult } from '@/lib/intake-notification';
import { siteUrl } from '@/lib/site';

const services = new Set(['luz','gas','luz_gas','alarmas','cargadores','asesoria']);
const types = new Set(['vivienda','negocio','comunidad','otro']);

const clean = (value, limit) => String(value || '').trim().slice(0, limit);

async function notifyCommercial(leadId, service) {
  const from = process.env.RESEND_FROM;
  const to = process.env.COMMERCIAL_LEAD_TO;
  const key = process.env.RESEND_API_KEY;

  if (!from || !to || !key) return false;

  try {
    const result = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from, to,
        subject: 'Nueva oportunidad comercial · Electricidad Lakuntza',
        text: [
          'Nueva consulta registrada en el CRM.',
          'Servicio: ' + service,
          'Consultar expediente: ' + (process.env.ADMIN_PANEL_BASE_URL?.startsWith('https://') ? process.env.ADMIN_PANEL_BASE_URL.replace(/\/$/, '') : siteUrl) + '/admin/oportunidades/' + leadId,
          'Los datos de contacto solo están disponibles en el panel privado.',
        ].join('\n'),
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(7000),
    });
    return result.ok;
  } catch (e) {
    console.error('[commercial-notification] Transport error', e?.name || 'unknown');
    return false;
  }
}

export async function submitCommercialInquiry(formData) {
  if (!commercialIntakeReady()) redirect('/consulta?error=config');

  const service = clean(formData.get('service'), 24);
  const contactName = clean(formData.get('contactName'), 160);
  const phone = clean(formData.get('contactPhone'), 35);
  const email = clean(formData.get('contactEmail'), 254).toLowerCase();
  const customerType = clean(formData.get('customerType'), 24);
  const notes = clean(formData.get('message'), 1000);

  if (formData.get('website')) redirect('/consulta?error=verificacion');
  if (!services.has(service) || contactName.length < 2 || !types.has(customerType) ||
      !validContactChannels(phone, email) ||
      notes.length < 10 || formData.get('consent') !== 'on') {
    redirect('/consulta?error=datos');
  }

  const h = await headers();
  if (!(await verifyPublicHuman({ token: formData.get('cf-turnstile-response'), requestHeaders: h, flow: 'commercial' }))) {
    redirect('/consulta?error=verificacion');
  }

  const client = createCommercialIntakeClient();
  if (!client) redirect('/consulta?error=config');

  if (!(await consumePublicQuotas({
    supabase: client,
    requestHeaders: h,
    contact: phone || email,
    flow: 'commercial',
  }))) redirect('/consulta?error=limite');

  const { data: lead, error } = await client.from('commercial_leads')
    .insert({
      service,
      contact_name: contactName,
      contact_phone: phone || null,
      contact_email: email || null,
      customer_type: customerType,
      origin: 'web',
      consent_accepted_at: new Date().toISOString(),
      privacy_notice_version: PRIVACY_NOTICE_VERSION,
      notification_status: 'pending',
      status: 'new',
      notes,
    }).select('id').single();

  if (error || !lead?.id) {
    console.error('[commercial-intake] Failed to store opportunity', error?.code || 'unknown');
    redirect('/consulta?error=registro');
  }

  const notified = await notifyCommercial(lead.id, service);
  await recordNotificationResult(client, 'commercial_leads', lead.id, notified);
  if (!notified) {
    console.warn('[commercial-intake] Lead saved but email notification was not delivered');
  }

  const receipt = newCommercialReceipt();
  if (receipt) (await cookies()).set(receipt.name, receipt.value, receipt.options);
  redirect('/consulta/gracias');
}

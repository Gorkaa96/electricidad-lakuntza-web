'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const DEFAULT_OCR_MODEL = 'gpt-5.5';

const allowedAnalysisResults = new Set(['pending', 'viable', 'review', 'not_viable']);

function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(String(value).replace(',', '.'));
  return Number.isFinite(number) ? number : null;
}

function toInteger(value) {
  const number = toNumber(value);
  return number === null ? null : Math.round(number);
}

function getOutputText(responseJson) {
  if (typeof responseJson?.output_text === 'string') return responseJson.output_text;

  const parts = [];
  for (const item of responseJson?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === 'string') parts.push(content.text);
    }
  }
  return parts.join('\n').trim();
}

function parseJsonOutput(text) {
  const trimmed = String(text || '').trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed);
  } catch (_) {
    const match = trimmed.match(/```json\s*([\s\S]*?)```/i) || trimmed.match(/```\s*([\s\S]*?)```/i);
    if (match?.[1]) {
      try {
        return JSON.parse(match[1].trim());
      } catch (_) {
        return null;
      }
    }
    return null;
  }
}

function valueFromPower(power) {
  if (power === null || power === undefined) return null;
  if (typeof power === 'number' || typeof power === 'string') return toNumber(power);
  return toNumber(power.p1 ?? power.P1 ?? power.punta ?? power.total ?? power.value);
}

function normalizeAnalysisResult(value) {
  return allowedAnalysisResults.has(value) ? value : 'review';
}

function buildPrompt() {
  return `Eres un extractor de datos de facturas de luz y gas para Electricidad Lakuntza.

Tarea:
1. Lee la factura adjunta.
2. Extrae los datos relevantes.
3. Devuelve SOLO JSON válido, sin markdown, sin explicación y sin texto fuera del JSON.
4. No inventes datos. Si un campo no aparece, usa null.
5. Diferencia servicios añadidos facturados de simples mensajes promocionales.
6. El resultado interno es orientativo y siempre requiere revisión humana.

Formato exacto de salida:
{
  "raw_text": "texto bruto relevante de la factura",
  "confidence_avg": 0,
  "invoice": {
    "supplier": null,
    "invoice_number": null,
    "issue_date": null,
    "billing_period_start": null,
    "billing_period_end": null,
    "billing_days": null,
    "due_date": null,
    "supply_type": null,
    "total_amount_eur": null
  },
  "customer": {
    "name": null,
    "tax_id": null,
    "supply_address": null,
    "locality": null,
    "province": null
  },
  "electricity": {
    "cups": null,
    "access_tariff": null,
    "contracted_power_kw": { "p1": null, "p2": null, "p3": null },
    "max_demand_kw": { "p1": null, "p2": null, "p3": null },
    "consumption_kwh": { "total": null, "p1": null, "p2": null, "p3": null },
    "energy_price_eur_kwh": null,
    "power_price_eur_kw_day": null
  },
  "amounts": {
    "energy_amount_eur": null,
    "power_amount_eur": null,
    "meter_rental_eur": null,
    "other_charges_eur": null,
    "electricity_tax_eur": null,
    "vat_eur": null,
    "total_eur": null
  },
  "commercial_signals": {
    "has_extra_services_billed": false,
    "has_promotional_service_message": false,
    "contract_end_date": null,
    "possible_sensitive_case": false,
    "sensitive_case_reason": null
  },
  "review": {
    "requires_manual_review": true,
    "suggested_analysis_result": "review",
    "reasons": []
  }
}`;
}

async function markOcrFailure({ supabase, leadId, ocrId, sourceFilePath, message }) {
  if (ocrId) {
    await supabase
      .from('invoice_ocr_results')
      .update({
        ocr_status: 'failed',
        source_file_path: sourceFilePath,
        error_message: message,
        processed_at: new Date().toISOString(),
      })
      .eq('id', ocrId);
  }

  await supabase
    .from('invoice_review_leads')
    .update({
      ocr_status: 'failed',
      ocr_requires_manual_review: true,
      ocr_processed_at: new Date().toISOString(),
    })
    .eq('id', leadId);
}

export async function prepareInvoiceOcr(formData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get('id') || '').trim();

  if (!id) redirect('/admin/facturas?error=datos');

  const { data: lead, error: leadError } = await supabase
    .from('invoice_review_leads')
    .select('id, file_path, file_name, file_type')
    .eq('id', id)
    .maybeSingle();

  if (leadError || !lead) redirect('/admin/facturas?error=datos');
  if (!lead.file_path) redirect(`/admin/facturas/${id}?error=ocr_archivo`);

  if (!process.env.OPENAI_API_KEY) {
    redirect(`/admin/facturas/${id}?error=ocr_config`);
  }

  const provider = `openai:${process.env.OPENAI_OCR_MODEL || DEFAULT_OCR_MODEL}`;

  const { data: ocrRow, error: insertError } = await supabase
    .from('invoice_ocr_results')
    .insert({
      lead_id: id,
      provider,
      ocr_status: 'processing',
      source_file_path: lead.file_path,
      extracted_json: {},
      requires_manual_review: true,
    })
    .select('id')
    .single();

  if (insertError || !ocrRow) redirect(`/admin/facturas/${id}?error=ocr`);

  await supabase
    .from('invoice_review_leads')
    .update({
      ocr_status: 'processing',
      ocr_confidence_avg: null,
      ocr_requires_manual_review: true,
      ocr_processed_at: null,
    })
    .eq('id', id);

  const { data: fileData, error: downloadError } = await supabase.storage
    .from('invoice-files')
    .download(lead.file_path);

  if (downloadError || !fileData) {
    await markOcrFailure({ supabase, leadId: id, ocrId: ocrRow.id, sourceFilePath: lead.file_path, message: 'No se ha podido descargar el archivo desde Supabase Storage.' });
    revalidatePath('/admin/facturas');
    revalidatePath(`/admin/facturas/${id}`);
    redirect(`/admin/facturas/${id}?error=ocr_archivo`);
  }

  const arrayBuffer = await fileData.arrayBuffer();
  const base64File = Buffer.from(arrayBuffer).toString('base64');
  const mimeType = lead.file_type || fileData.type || 'application/pdf';
  const fileName = lead.file_name || 'factura.pdf';

  let redirectPath = `/admin/facturas/${id}?success=ocr_completado`;

  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_OCR_MODEL || DEFAULT_OCR_MODEL,
        input: [
          {
            role: 'user',
            content: [
              {
                type: 'input_file',
                filename: fileName,
                file_data: `data:${mimeType};base64,${base64File}`,
              },
              {
                type: 'input_text',
                text: buildPrompt(),
              },
            ],
          },
        ],
      }),
    });

    const responseJson = await response.json();

    if (!response.ok) {
      const message = responseJson?.error?.message || 'OpenAI ha devuelto un error al procesar la factura.';
      await markOcrFailure({ supabase, leadId: id, ocrId: ocrRow.id, sourceFilePath: lead.file_path, message });
      redirectPath = `/admin/facturas/${id}?error=ocr`;
    } else {
      const outputText = getOutputText(responseJson);
      const extracted = parseJsonOutput(outputText);

      if (!extracted) {
        await markOcrFailure({ supabase, leadId: id, ocrId: ocrRow.id, sourceFilePath: lead.file_path, message: 'La IA no ha devuelto JSON válido.' });
        redirectPath = `/admin/facturas/${id}?error=ocr_json`;
      } else {
        const now = new Date().toISOString();
        const confidenceAvg = toNumber(extracted.confidence_avg);
        const suggestedResult = normalizeAnalysisResult(extracted.review?.suggested_analysis_result);
        const reasons = Array.isArray(extracted.review?.reasons) ? extracted.review.reasons.filter(Boolean).map(String) : [];
        const totalConsumption = toNumber(extracted.electricity?.consumption_kwh?.total);
        const totalAmount = toNumber(extracted.amounts?.total_eur ?? extracted.invoice?.total_amount_eur);
        const contractedPower = valueFromPower(extracted.electricity?.contracted_power_kw);
        const requiresManualReview = extracted.review?.requires_manual_review !== false || confidenceAvg === null || confidenceAvg < 85;

        await supabase
          .from('invoice_ocr_results')
          .update({
            ocr_status: 'succeeded',
            raw_text: extracted.raw_text || outputText,
            extracted_json: extracted,
            confidence_avg: confidenceAvg,
            requires_manual_review: requiresManualReview,
            error_message: null,
            processed_at: now,
          })
          .eq('id', ocrRow.id);

        await supabase
          .from('invoice_review_leads')
          .update({
            extracted_cups: extracted.electricity?.cups || null,
            extracted_tariff: extracted.electricity?.access_tariff || null,
            contracted_power_kw: contractedPower,
            consumption_kwh: totalConsumption,
            invoice_total_eur: totalAmount,
            billing_days: toInteger(extracted.invoice?.billing_days),
            has_extra_services: Boolean(extracted.commercial_signals?.has_extra_services_billed),
            analysis_result: suggestedResult,
            analysis_reasons: reasons,
            ocr_status: 'succeeded',
            ocr_confidence_avg: confidenceAvg,
            ocr_requires_manual_review: requiresManualReview,
            ocr_processed_at: now,
          })
          .eq('id', id);
      }
    }
  } catch (error) {
    await markOcrFailure({ supabase, leadId: id, ocrId: ocrRow.id, sourceFilePath: lead.file_path, message: error?.message || 'Error inesperado al procesar OCR.' });
    redirectPath = `/admin/facturas/${id}?error=ocr`;
  }

  revalidatePath('/admin/facturas');
  revalidatePath(`/admin/facturas/${id}`);
  redirect(redirectPath);
}

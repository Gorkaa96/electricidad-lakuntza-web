import 'server-only';
import { extractPdfTextFree, parseInvoiceTextFree } from './free-ocr';
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

function valueFromPower(power) {
  if (power === null || power === undefined) return null;
  if (typeof power === 'number' || typeof power === 'string') return toNumber(power);
  return toNumber(power.p1 ?? power.P1 ?? power.punta ?? power.total ?? power.value);
}

function normalizeAnalysisResult(value) {
  return allowedAnalysisResults.has(value) ? value : 'review';
}

async function insertOcrEvent({ supabase, leadId, status, title, description, metadata = {} }) {
  await supabase.from('invoice_lead_events').insert({
    lead_id: leadId,
    event_type: 'ocr_processed',
    title,
    description,
    metadata: {
      status,
      ...metadata,
    },
  });
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

  await insertOcrEvent({
    supabase,
    leadId,
    status: 'failed',
    title: 'Lectura fallida',
    description: message,
    metadata: { ocr_id: ocrId, source_file_path: sourceFilePath },
  });
}

async function saveExtractedInvoice({ supabase, leadId, ocrId, extracted }) {
  const now = new Date().toISOString();
  const confidenceAvg = toNumber(extracted.confidence_avg);
  const suggestedResult = normalizeAnalysisResult(extracted.review?.suggested_analysis_result);
  const reasons = Array.isArray(extracted.review?.reasons) ? extracted.review.reasons.filter(Boolean).map(String) : [];
  const totalConsumption = toNumber(extracted.electricity?.consumption_kwh?.total);
  const totalAmount = toNumber(extracted.amounts?.total_eur ?? extracted.invoice?.total_amount_eur);
  const contractedPower = valueFromPower(extracted.electricity?.contracted_power_kw);
  const requiresManualReview = extracted.review?.requires_manual_review !== false || confidenceAvg === null || confidenceAvg < 85;

  const { error: ocrSaveError } = await supabase
    .from('invoice_ocr_results')
    .update({
      ocr_status: 'succeeded',
      raw_text: extracted.raw_text || null,
      extracted_json: extracted,
      confidence_avg: confidenceAvg,
      requires_manual_review: requiresManualReview,
      error_message: null,
      processed_at: now,
    })
    .eq('id', ocrId);
  if (ocrSaveError) throw new Error('No se pudo guardar la lectura del documento.');

  const { error: analysisSaveError } = await supabase
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
    .eq('id', leadId);
  if (analysisSaveError) throw new Error('No se pudo guardar el resultado de revisión.');

  await insertOcrEvent({
    supabase,
    leadId,
    status: 'succeeded',
    title: 'Lectura completada',
    description: `Confianza ${confidenceAvg ?? 'sin dato'}%. Resultado interno: ${suggestedResult}.`,
    metadata: {
      ocr_id: ocrId,
      confidence_avg: confidenceAvg,
      analysis_result: suggestedResult,
      total_amount: totalAmount,
      consumption_kwh: totalConsumption,
      contracted_power_kw: contractedPower,
    },
  });
}


async function runInvoiceReading({supabase,id,automatic=false}) {
  const {data:lead,error}=await supabase.from('invoice_review_leads')
    .select('id,file_path,file_name,file_type,ocr_status,ocr_processed_at').eq('id',id).maybeSingle();
  if(error||!lead?.file_path)return 'ocr_archivo';
  if(automatic && lead.ocr_status==='succeeded')return null;
  // Compare-and-set avoids concurrent automatic/manual workers on one invoice.
  if(lead.ocr_status==='processing' && (!lead.ocr_processed_at || Date.now()-Date.parse(lead.ocr_processed_at)<600000))return 'ocr';
  const {data:claimed,error:claimError}=await supabase.from('invoice_review_leads')
    .update({ocr_status:'processing',ocr_processed_at:new Date().toISOString()})
    .eq('id',id).eq('ocr_status',lead.ocr_status).select('id').maybeSingle();
  if(claimError||!claimed)return 'ocr';
  const provider = 'free:pdf-text-extraction';

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

  if (insertError || !ocrRow) {
    await markOcrFailure({supabase,leadId:id,sourceFilePath:lead.file_path,message:'No se pudo iniciar la lectura. Puedes reintentar desde el expediente.'});
    return 'ocr';
  }

  await supabase
    .from('invoice_review_leads')
    .update({
      ocr_status: 'processing',
      ocr_confidence_avg: null,
      ocr_requires_manual_review: true,
      ocr_processed_at: new Date().toISOString(),
    })
    .eq('id', id);

  const { data: fileData, error: downloadError } = await supabase.storage
    .from('invoice-files')
    .download(lead.file_path);

  if (downloadError || !fileData) {
    await markOcrFailure({ supabase, leadId: id, ocrId: ocrRow.id, sourceFilePath: lead.file_path, message: 'No se ha podido descargar el archivo desde Supabase Storage.' });
    return 'ocr_archivo';
  }

  const mimeType = lead.file_type || fileData.type || 'application/pdf';
  const isPdf = mimeType.includes('pdf') || String(lead.file_name || '').toLowerCase().endsWith('.pdf');

  if (!isPdf) {
    await markOcrFailure({
      supabase,
      leadId: id,
      ocrId: ocrRow.id,
      sourceFilePath: lead.file_path,
      message: 'La lectura actual solo procesa PDF con texto seleccionable. Para imágenes hará falta Tesseract o revisión manual.',
    });
    return 'ocr_tipo';
  }

  let resultError = null;
  try {
    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const rawText = await extractPdfTextFree(buffer);

    if (!rawText || rawText.length < 80) {
      await markOcrFailure({
        supabase,
        leadId: id,
        ocrId: ocrRow.id,
        sourceFilePath: lead.file_path,
        message: 'El PDF no contiene texto suficiente. Probablemente es una factura escaneada o una imagen dentro de PDF.',
      });
      resultError = 'ocr_texto';
    }

    if (!resultError) {
      const extracted = parseInvoiceTextFree(rawText);
      await saveExtractedInvoice({ supabase, leadId: id, ocrId: ocrRow.id, extracted });
    }
  } catch (error) {
    await markOcrFailure({
      supabase,
      leadId: id,
      ocrId: ocrRow.id,
      sourceFilePath: lead.file_path,
      message: 'No se pudo leer el PDF. Comprueba que no esté protegido, dañado o escaneado y revisa el documento.',
    });
    resultError = 'ocr';
  }


  return resultError;
}

export async function processInvoiceReading(args) {
  try {return await runInvoiceReading(args);}
  catch {
    console.error('[invoice-reading] Processing unavailable');
    await args.supabase.from('invoice_ocr_results').update({ocr_status:'failed',requires_manual_review:true,error_message:'Lectura interrumpida. Reintenta desde el expediente.',processed_at:new Date().toISOString()}).eq('lead_id',args.id).eq('ocr_status','processing');
    await args.supabase.from('invoice_review_leads').update({ocr_status:'failed',ocr_requires_manual_review:true,ocr_processed_at:new Date().toISOString()}).eq('id',args.id).eq('ocr_status','processing');
    return 'ocr';
  }
}

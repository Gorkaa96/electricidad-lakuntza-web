'use server';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {requireAnyPermission} from '@/lib/admin';
import {extractPdfTextFree} from '@/lib/invoice/free-ocr';
import {extractOfferSnapshot, compareOffer, euros} from '@/lib/fenie/compare.mjs';

const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const base=(id)=>'/admin/facturas/'+id;
const issue=(id,code)=>redirect(base(id)+'?propuestaError='+code+'#propuesta-fenie');
const maxBytes=4*1024*1024;
const refresh=(id)=>{revalidatePath(base(id));revalidatePath('/admin/facturas');};

export async function uploadFenieProposal(formData) {
  const {supabase,user}=await requireAnyPermission('leads.edit_all','leads.edit_assigned');
  const leadId=String(formData.get('leadId')||'').trim();
  if(!uuid.test(leadId)) redirect('/admin/facturas?error=datos');
  const file=formData.get('proposal');
  if(!file || typeof file==='string' || file.size>maxBytes || file.size<100
      || file.type!=='application/pdf' || !/\.pdf$/i.test(file.name))
    issue(leadId,'formato');
  const bytes=Buffer.from(await file.arrayBuffer());
  if(bytes.subarray(0,5).toString('ascii')!=='%PDF-') issue(leadId,'formato');

  // RLS determines whether the member may read and edit this invoice.
  const {data:lead,error:leadError}=await supabase.from('invoice_review_leads')
    .select('id,invoice_total_eur,consumption_kwh,assigned_to')
    .eq('id',leadId).maybeSingle();
  if(leadError||!lead) issue(leadId,'permiso');
  let snapshot={textReadable:false,totalEur:null,includesTaxes:false,
    periodStart:null,periodEnd:null,consumptionKwh:null,needsAttention:false};
  try {
    const text=await extractPdfTextFree(bytes);
    if(text?.trim().length>80) snapshot=extractOfferSnapshot(text);
  } catch { /* The file remains available for a manual comparison. */ }
  const {data:ocr}=await supabase.from('invoice_ocr_results')
    .select('extracted_json').eq('lead_id',leadId)
    .eq('ocr_status','succeeded').order('created_at',{ascending:false}).limit(1).maybeSingle();
  const extracted=ocr?.extracted_json||{};
  const analysis=compareOffer({
    totalEur:lead.invoice_total_eur,
    periodStart:extracted.invoice?.billing_period_start,
    periodEnd:extracted.invoice?.billing_period_end,
    consumptionKwh:lead.consumption_kwh,
  },snapshot);
  const {data:prior,error:priorError}=await supabase.from('fenie_proposals')
    .select('version').eq('lead_id',leadId).order('version',{ascending:false}).limit(1);
  if(priorError) issue(leadId,'guardar');
  const proposalId=crypto.randomUUID();
  const filePath='propuestas/'+leadId+'/'+proposalId+'.pdf';
  const {error:storageError}=await supabase.storage.from('invoice-files')
    .upload(filePath,bytes,{contentType:'application/pdf',upsert:false});
  if(storageError) issue(leadId,'subida');
  const {error:dbError}=await supabase.from('fenie_proposals').insert({
    id:proposalId,lead_id:leadId,version:(prior?.[0]?.version||0)+1,
    file_path:filePath,file_name:String(file.name).slice(0,255),file_size:bytes.length,
    created_by:user.id, parsed_data:snapshot,
    current_total_eur:euros(lead.invoice_total_eur),
    offer_total_eur:snapshot.totalEur,
    difference_eur:analysis.differenceEur,comparison_status:analysis.status,
    comparison_reason:analysis.reason,
  });
  if(dbError){
    // This cleanup is authorized only when the member has file deletion rights.
    const {error:cleanup}=await supabase.storage.from('invoice-files').remove([filePath]);
    if(cleanup) console.error('[fenie-proposal] Orphan needs cleanup:',proposalId);
    issue(leadId,'guardar');
  }
  refresh(leadId);
  redirect(base(leadId)+'?propuestaOk=subida#propuesta-fenie');
}

export async function reviewFenieProposal(formData) {
  const {supabase,user}=await requireAnyPermission('leads.edit_all','leads.edit_assigned');
  const leadId=String(formData.get('leadId')||'').trim();
  const proposalId=String(formData.get('proposalId')||'').trim();
  if(!uuid.test(leadId)||!uuid.test(proposalId)) redirect('/admin/facturas?error=datos');
  if(formData.get('confirmed')!=='on') issue(leadId,'confirmar');
  const proposed=euros(formData.get('offerTotal'));
  if(proposed===null || proposed<=0) issue(leadId,'importe');
  const {data:proposal,error}=await supabase.from('fenie_proposals')
    .select('id,current_total_eur,reviewed_at').eq('lead_id',leadId).eq('id',proposalId).maybeSingle();
  if(error||!proposal || proposal.reviewed_at) issue(leadId,'permiso');
  const analysis=compareOffer({totalEur:proposal.current_total_eur},{totalEur:proposed},{humanVerified:true});
  if(analysis.status==='not_comparable') issue(leadId,'importe');
  const note=String(formData.get('conditions')||'').trim().slice(0,1000);
  const {data:updated,error:saveError}=await supabase.from('fenie_proposals').update({
    offer_total_eur:proposed,difference_eur:analysis.differenceEur,
    comparison_status:analysis.status,comparison_reason:analysis.reason,
    reviewed_by:user.id,reviewed_at:new Date().toISOString(),
    notes:note||null,
  }).eq('id',proposalId).eq('lead_id',leadId).is('reviewed_at',null).select('id').maybeSingle();
  if(saveError||!updated) issue(leadId,'guardar');
  refresh(leadId);
  redirect(base(leadId)+'?propuestaOk=revisada#propuesta-fenie');
}

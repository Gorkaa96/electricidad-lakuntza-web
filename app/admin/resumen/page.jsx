import AdminShell from '@/components/admin/AdminShell';
import {canEditLeads} from '@/lib/rolePermissions';
import {businessToday,activeOpportunityStatuses} from '@/lib/commercial/follow-up.mjs';
import {requireAnyPermission} from '@/lib/admin';
import {ArrowUpRight, FileText, BriefcaseBusiness, Clock3, CircleCheck} from 'lucide-react';
export const dynamic='force-dynamic';
export const metadata={title:'Resumen del CRM',robots:{index:false,follow:false}};
const statusLabels={new:'Nueva',reviewing:'En revisión',contacted:'Contactada',quoted:'Propuesta enviada',won:'Ganada',lost:'Descartada',converted:'Convertida',discarded:'Descartada'};
const services={luz:'Luz',gas:'Gas',luz_gas:'Luz y gas',alarmas:'Alarmas',cargadores:'Cargadores',asesoria:'Asesoría'};
export default async function CrmOverview(){
 const {supabase,admin}=await requireAnyPermission('leads.read_all','leads.read_assigned');
 // All queries use the member session and RLS: agents see only assigned records.
 const today=businessToday();
 const results=await Promise.all([
  supabase.from('commercial_leads').select('id,contact_name,service,status,created_at,invoice_review_lead_id').order('created_at',{ascending:false}).limit(8),
  supabase.from('commercial_leads').select('id',{head:true,count:'exact'}).eq('status','new'),
  supabase.from('commercial_leads').select('id',{head:true,count:'exact'}).in('status',['reviewing','contacted']),
  supabase.from('invoice_review_leads').select('id',{head:true,count:'exact'}).in('ocr_status',['pending','failed']),
  supabase.from('commercial_leads').select('id',{head:true,count:'exact'}).eq('status','converted'),
  supabase.from('commercial_leads').select('id',{head:true,count:'exact'}).in('status',activeOpportunityStatuses).lte('next_contact_on',today),
  supabase.from('commercial_leads').select('id',{head:true,count:'exact'}).in('status',activeOpportunityStatuses).is('next_contact_on',null),
 ]);
 const error=results.some(r=>r.error);
 const cards=[
  ['1. Solicitudes nuevas',results[1].count,BriefcaseBusiness,'/admin/oportunidades?estado=new','Atender las nuevas consultas'],
  ['2. Facturas por revisar',results[3].count,FileText,'/admin/facturas?view=all','Abrir facturas y propuestas de Feníe'],
  ['3. Llamadas pendientes',results[5].count,Clock3,'/admin/oportunidades?seguimiento=pendiente','Seguimientos vencidos o para hoy'],
 ];
 const secondaryCards=[
  ['En seguimiento',results[2].count,Clock3,'/admin/oportunidades','En revisión y contactadas'],
  ['Finalizadas',results[4].count,CircleCheck,'/admin/oportunidades?estado=converted','Contrataciones registradas'],
  ['Sin fecha programada',results[6].count,Clock3,'/admin/oportunidades?seguimiento=sin-fecha','Casos abiertos sin fecha'],
 ];
 return <AdminShell title="Resumen" description="Empieza por las solicitudes nuevas, revisa las facturas y atiende los seguimientos de hoy." action={canEditLeads(admin)?<a href="/admin/oportunidades/nueva" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#1B4E3D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#123D2E]">Nueva oportunidad</a>:null}>
  {error?<div role="alert" className="mb-5 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">No se han podido cargar todos los datos. Recarga la página; los guiones no significan que no haya actividad.</div>:null}
  <section aria-label="Qué hacer ahora">
    <h2 className="mb-4 text-xl font-semibold text-[#193B2B]">¿Qué hay que hacer hoy?</h2>
    <div className="grid gap-4 md:grid-cols-3">{cards.map(([label,count,Icon,href,caption])=><a href={href} key={label} className="flex min-h-44 flex-col justify-between rounded-xl border-2 border-[#C9DDCE] bg-white p-5 transition hover:border-[#457B57] hover:bg-[#F5FAF5] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#457B57]"><div className="flex items-center justify-between gap-3"><h3 className="text-base font-semibold text-[#234C34]">{label}</h3><Icon size={24} aria-hidden="true" className="text-[#3D6E54]"/></div><p className="mt-4 text-4xl font-semibold tabular-nums tracking-tight">{error?'—':count??0}</p><p className="mt-2 text-sm leading-6 text-[#4D6356]">{caption}</p></a>)}</div>
   </section>
   <details className="mt-5 rounded-xl border border-[#DFE6E2] bg-white p-5">
     <summary className="cursor-pointer text-base font-semibold text-[#285D44]">Ver otros indicadores</summary>
     <div className="mt-4 grid gap-3 sm:grid-cols-3">{secondaryCards.map(([label,count,Icon,href,caption])=><a href={href} key={label} className="rounded-xl border border-[#DFE6E2] p-4 hover:bg-[#F6F9F7]"><div className="flex items-center justify-between gap-2"><h3 className="text-sm font-semibold">{label}</h3><Icon size={18} aria-hidden="true"/></div><p className="mt-3 text-2xl font-semibold tabular-nums">{error?'—':count??0}</p><p className="mt-1 text-xs text-[#52655C]">{caption}</p></a>)}</div>
   </details>
  <section className="mt-7 overflow-hidden rounded-xl border border-[#DFE6E2] bg-white"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5EBE8] p-5"><h2 className="text-lg font-semibold">Últimas oportunidades</h2><a href="/admin/oportunidades" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#285D44]">Ver todas <ArrowUpRight size={16} aria-hidden="true"/></a></div>
  {!error&&results[0].data?.length?<div className="divide-y divide-[#E7EDE9]">{results[0].data.map(lead=><a key={lead.id} href={'/admin/oportunidades/'+lead.id} className="grid gap-3 p-5 hover:bg-[#F6F9F7] sm:grid-cols-[minmax(0,1fr)_150px_140px] sm:items-center"><div className="min-w-0"><h3 className="break-words text-sm font-semibold">{lead.contact_name}</h3><p className="mt-1 text-xs text-[#617269]">{new Date(lead.created_at).toLocaleDateString('es-ES')}{lead.invoice_review_lead_id?' · Con factura':''}</p></div><span className="text-sm text-[#52655C]">{services[lead.service]||lead.service}</span><span className="w-fit rounded-full bg-[#EDF4EF] px-3 py-1 text-xs font-medium text-[#285D44]">{statusLabels[lead.status]||lead.status}</span></a>)}</div>:<p className="p-7 text-sm leading-6 text-[#617269]">{error?'Datos temporalmente no disponibles.':'Las consultas de la web y las altas del equipo aparecerán aquí.'}</p>}</section>
  <div className="mt-6 grid gap-4 md:grid-cols-2"><a href="/admin/facturas?view=all" className="flex items-center justify-between gap-5 rounded-xl border border-[#DFE6E2] bg-white p-5"><div><h2 className="font-semibold">Facturas y lectura</h2><p className="mt-2 text-sm leading-6 text-[#617269]">Los PDF se leen al recibirlos. Contrasta los datos antes de comparar en Feníe.</p></div><FileText className="shrink-0 text-[#3D6E54]" aria-hidden="true"/></a><div className="rounded-xl border border-[#DFE6E2] bg-[#EAF2ED] p-5"><h2 className="font-semibold">Un expediente, todo el seguimiento</h2><p className="mt-2 text-sm leading-6 text-[#425D4D]">Registra cada contacto y actualiza el estado de la oportunidad para que el equipo pueda continuar la gestión.</p></div></div>
 </AdminShell>;
}

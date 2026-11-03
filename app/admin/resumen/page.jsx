import AdminShell from '@/components/admin/AdminShell';
import {requireAnyPermission} from '@/lib/admin';
import {ArrowUpRight, FileText, BriefcaseBusiness, Clock3, CircleCheck} from 'lucide-react';
export const dynamic='force-dynamic';
export const metadata={title:'Resumen del CRM',robots:{index:false,follow:false}};
const statusLabels={new:'Nueva',reviewing:'En revisión',contacted:'Contactada',quoted:'Propuesta enviada',won:'Ganada',lost:'Descartada',converted:'Convertida',discarded:'Descartada'};
const services={luz:'Luz',gas:'Gas',luz_gas:'Luz y gas',alarmas:'Alarmas',cargadores:'Cargadores',asesoria:'Asesoría'};
export default async function CrmOverview(){
 const {supabase}=await requireAnyPermission('leads.read_all','leads.read_assigned');
 // All queries use the member session and RLS: agents see only assigned records.
 const results=await Promise.all([
  supabase.from('commercial_leads').select('id,contact_name,service,status,created_at,invoice_review_lead_id').order('created_at',{ascending:false}).limit(8),
  supabase.from('commercial_leads').select('id',{head:true,count:'exact'}).eq('status','new'),
  supabase.from('commercial_leads').select('id',{head:true,count:'exact'}).in('status',['reviewing','contacted']),
  supabase.from('invoice_review_leads').select('id',{head:true,count:'exact'}).in('ocr_status',['pending','failed']),
  supabase.from('commercial_leads').select('id',{head:true,count:'exact'}).eq('status','converted'),
 ]);
 const error=results.some(r=>r.error);
 const cards=[
  ['Por atender',results[1].count,BriefcaseBusiness,'/admin/oportunidades','Nuevas consultas'],
  ['En seguimiento',results[2].count,Clock3,'/admin/oportunidades','En revisión y contactadas'],
  ['Lecturas por revisar',results[3].count,FileText,'/admin/facturas?view=all','Pendientes o no legibles'],
  ['Oportunidades ganadas',results[4].count,CircleCheck,'/admin/oportunidades','Contrataciones registradas'],
 ];
 return <AdminShell title="Resumen" description="Tu mesa de trabajo: nuevas consultas, seguimiento y facturas para revisar." action={<a href="/admin/oportunidades/nueva" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#1B4E3D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#123D2E]">Nueva oportunidad</a>}>
  {error?<div role="alert" className="mb-5 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">No se han podido cargar todos los datos. Recarga la página; los guiones no significan que no haya actividad.</div>:null}
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label,count,Icon,href,caption])=><a href={href} key={label} className="rounded-xl border border-[#DFE6E2] bg-white p-5 hover:border-[#7DA58B]"><div className="flex items-center justify-between gap-3"><h2 className="text-sm font-medium text-[#52655C]">{label}</h2><Icon size={19} aria-hidden="true" className="text-[#3D6E54]"/></div><p className="mt-5 text-3xl font-semibold tabular-nums tracking-tight">{error?'—':count??0}</p><p className="mt-2 text-xs text-[#617269]">{caption}</p></a>)}</div>
  <section className="mt-7 overflow-hidden rounded-xl border border-[#DFE6E2] bg-white"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5EBE8] p-5"><h2 className="text-lg font-semibold">Últimas oportunidades</h2><a href="/admin/oportunidades" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#285D44]">Ver todas <ArrowUpRight size={16} aria-hidden="true"/></a></div>
  {!error&&results[0].data?.length?<div className="divide-y divide-[#E7EDE9]">{results[0].data.map(lead=><a key={lead.id} href={'/admin/oportunidades/'+lead.id} className="grid gap-3 p-5 hover:bg-[#F6F9F7] sm:grid-cols-[minmax(0,1fr)_150px_140px] sm:items-center"><div className="min-w-0"><h3 className="break-words text-sm font-semibold">{lead.contact_name}</h3><p className="mt-1 text-xs text-[#617269]">{new Date(lead.created_at).toLocaleDateString('es-ES')}{lead.invoice_review_lead_id?' · Con factura':''}</p></div><span className="text-sm text-[#52655C]">{services[lead.service]||lead.service}</span><span className="w-fit rounded-full bg-[#EDF4EF] px-3 py-1 text-xs font-medium text-[#285D44]">{statusLabels[lead.status]||lead.status}</span></a>)}</div>:<p className="p-7 text-sm leading-6 text-[#617269]">{error?'Datos temporalmente no disponibles.':'Las consultas de la web y las altas del equipo aparecerán aquí.'}</p>}</section>
  <div className="mt-6 grid gap-4 md:grid-cols-2"><a href="/admin/facturas?view=all" className="flex items-center justify-between gap-5 rounded-xl border border-[#DFE6E2] bg-white p-5"><div><h2 className="font-semibold">Facturas y lectura</h2><p className="mt-2 text-sm leading-6 text-[#617269]">Los PDF se leen al recibirlos. Contrasta los datos antes de comparar en Feníe.</p></div><FileText className="shrink-0 text-[#3D6E54]" aria-hidden="true"/></a><div className="rounded-xl border border-[#DFE6E2] bg-[#EAF2ED] p-5"><h2 className="font-semibold">Un expediente, todo el seguimiento</h2><p className="mt-2 text-sm leading-6 text-[#425D4D]">Registra cada contacto y actualiza el estado de la oportunidad para que el equipo pueda continuar la gestión.</p></div></div>
 </AdminShell>;
}

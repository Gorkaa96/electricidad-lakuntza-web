import {uploadFenieProposal,reviewFenieProposal} from '@/app/admin/facturas/proposal-actions';
import {offerEmail} from '@/lib/fenie/compare.mjs';
import FenieEmailDraft from './FenieEmailDraft.jsx';
const eur=(v)=> v==null?'—':Number(v).toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';
const label={
 estimated_better:['Posible mejora','text-[#206235] bg-[#EDF8EF] border-[#9CCFA9]'],
 estimated_worse:['La propuesta sale más cara','text-[#9D371F] bg-[#FFF3EF] border-[#E6B3A7]'],
 estimated_equal:['Coste similar','text-[#415967] bg-[#EFF4F7] border-[#BFCFD8]'],
 not_comparable:['Faltan datos para comparar','text-amber-900 bg-amber-50 border-amber-200']
};
const errors={
 formato:'Selecciona un PDF válido de hasta 4 MB.',
 permiso:'No tienes acceso a esta factura o propuesta.',
 subida:'No se ha podido subir el PDF; inténtalo de nuevo.',
 guardar:'No se han podido guardar los cambios.',
 confirmar:'Comprueba las condiciones y marca la casilla de validación.',
 importe:'Necesitamos un importe total válido, con impuestos incluidos.'
};
export default function FenieProposalPanel({lead,proposals=[],canEdit=false,notice={}}) {
 const proposal=proposals[0];
 const approved=Boolean(proposal?.reviewed_at);
 const [title,tone]=label[proposal?.comparison_status]||label.not_comparable;
 const invoiceHref='/admin/facturas/'+lead.id+'/archivo';
 const proposalHref=proposal?'/admin/facturas/'+lead.id+'/propuesta/'+proposal.id+'/archivo':null;
 const hasEmail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email||'');
 const canEmail=approved && proposal?.difference_eur!=null && hasEmail;
 return <section id="propuesta-fenie" className="mt-6 scroll-mt-24 rounded-xl border-2 border-[#BED8C1] bg-white p-5 sm:p-7" aria-labelledby="fenie-section-title">
  <div className="flex flex-wrap items-center justify-between gap-3">
   <div><p className="text-sm font-semibold text-[#2D6743]">Paso 2 · Comparar y responder</p>
    <h2 id="fenie-section-title" className="mt-2 text-2xl font-semibold tracking-tight text-[#193B2B]">Propuesta de Feníe Energía</h2>
    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#536457]">Sube el PDF descargado del portal oficial de Feníe. Guardamos cada versión y mostramos si mejora la factura actual o si faltan datos.</p>
   </div>{proposal?<span className="rounded-full bg-[#EAF2EA] px-4 py-2 text-sm font-semibold text-[#246037]">Versión {proposal.version}</span>:null}
  </div>
  {notice.error && errors[notice.error]?<p role="alert" className="mt-4 rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-800">{errors[notice.error]}</p>:null}
  {notice.ok?<p role="status" className="mt-4 rounded-lg bg-[#ECF7EF] p-4 text-sm font-semibold text-[#245A37]">{notice.ok==='subida'?'Propuesta guardada y revisada automáticamente. Comprueba los resultados.':'Comparación validada por el equipo. Ya puedes preparar el correo.'}</p>:null}
  {proposal?<div className="mt-6 grid gap-4 lg:grid-cols-3">
   <div className="rounded-xl bg-[#F5F8F5] p-5"><p className="text-sm text-neutral-600">Factura original</p><p className="mt-2 text-3xl font-semibold tabular-nums">{eur(proposal.current_total_eur)}</p></div>
   <div className="rounded-xl bg-[#F5F8F5] p-5"><p className="text-sm text-neutral-600">Propuesta Feníe</p><p className="mt-2 text-3xl font-semibold tabular-nums">{eur(proposal.offer_total_eur)}</p></div>
   <div className={'rounded-xl border p-5 '+tone}><p className="text-sm font-semibold">{title}</p><p className="mt-2 text-3xl font-semibold tabular-nums">{proposal.difference_eur==null?'Sin cálculo':(proposal.difference_eur>0?'+':'')+eur(proposal.difference_eur)}</p><p className="mt-2 text-xs">{approved?'Comprobada por una persona':'Estimación pendiente de validar'}</p></div>
  </div>:<p className="mt-5 rounded-lg bg-[#F3F8F2] p-5 text-base">Todavía no hay ninguna propuesta. Puedes añadir la primera a continuación.</p>}
  {proposal?<div className="mt-4 rounded-xl border border-[#DDE7DA] p-4">
   <p className="text-sm font-semibold text-[#263D2C]">{approved?'Validada manualmente':'Revisión pendiente'}</p>
   <p className="mt-2 text-sm leading-6 text-neutral-700">{proposal.comparison_reason}</p>
   {proposal.parsed_data?.needsAttention?<p className="mt-2 text-sm font-semibold text-amber-800">Comprueba también permanencias, descuentos temporales y servicios adicionales.</p>:null}
   <a href={proposalHref} className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-[#215C37] underline underline-offset-4">Descargar propuesta PDF (v{proposal.version})</a>
   {proposals.length>1?<details className="mt-4 border-t pt-3"><summary className="cursor-pointer text-sm font-semibold">Versiones anteriores ({proposals.length-1})</summary><ul className="mt-3 space-y-2">{proposals.slice(1).map(p=><li key={p.id}><a className="text-sm text-[#245D38] underline" href={'/admin/facturas/'+lead.id+'/propuesta/'+p.id+'/archivo'}>Propuesta v{p.version} · {new Date(p.created_at).toLocaleDateString('es-ES')}</a></li>)}</ul></details>:null}
  </div>:null}
  {canEdit?<div className="mt-6 grid gap-5 lg:grid-cols-2">
   <form action={uploadFenieProposal} className="rounded-xl border border-[#D7E7D8] bg-[#F7FAF6] p-5">
    <h3 className="text-lg font-semibold">{proposal?'Subir nueva versión':'1. Subir propuesta PDF'}</h3>
    <input type="hidden" name="leadId" value={lead.id}/>
    <label className="mt-4 grid gap-2 text-sm font-semibold">Archivo oficial de Feníe (PDF, máximo 4 MB)<input name="proposal" type="file" required accept=".pdf,application/pdf" className="min-h-12 w-full rounded-lg border bg-white p-3 text-sm"/></label>
    <button type="submit" className="mt-4 min-h-12 w-full rounded-lg bg-[#245E36] px-5 text-base font-semibold text-white hover:bg-[#17482A]">Subir y comparar</button>
   </form>
   {proposal && !approved?<form action={reviewFenieProposal} className="rounded-xl border border-amber-200 bg-amber-50 p-5">
    <h3 className="text-lg font-semibold">Revisar y confirmar</h3>
    <p className="mt-2 text-sm leading-6">Comprueba la factura y propuesta antes de enviar. Si el PDF no incluye el total final, escríbelo tú.</p>
    <input type="hidden" name="leadId" value={lead.id}/><input type="hidden" name="proposalId" value={proposal.id}/>
    <label className="mt-3 grid gap-2 text-sm font-semibold">Total de la propuesta, impuestos incluidos (€)<input name="offerTotal" inputMode="decimal" required defaultValue={proposal.offer_total_eur==null?'':String(proposal.offer_total_eur).replace('.',',')} className="min-h-12 w-full rounded-lg border border-amber-300 bg-white px-4"/></label>
    <label className="mt-3 grid gap-2 text-sm font-semibold">Observaciones (opcional)<textarea name="conditions" rows={2} maxLength={1000} placeholder="Permanencia, descuentos, servicios, vigencia…" className="w-full rounded-lg border border-amber-300 bg-white p-3 text-sm"/></label>
    <label className="mt-4 flex items-start gap-3 text-sm font-medium leading-6"><input name="confirmed" type="checkbox" required className="mt-1.5 h-5 w-5 shrink-0"/>He comprobado el mismo consumo, periodo, impuestos, extras y condiciones de ambos documentos.</label>
    <button className="mt-4 min-h-12 w-full rounded-lg bg-[#245E36] px-5 text-base font-semibold text-white">Confirmar comparación</button>
   </form>:null}
  </div>:null}
  {proposal && approved?<div className="mt-6 rounded-xl border border-[#C8DCC8] p-5">
   <h3 className="text-xl font-semibold">3. Preparar correo al cliente</h3>
   {canEmail?<FenieEmailDraft to={lead.email} subject="Tu revisión de luz y gas | Electricidad Lakuntza"
      body={offerEmail({name:lead.name,invoiceTotal:proposal.current_total_eur,proposalTotal:proposal.offer_total_eur,difference:proposal.difference_eur,notes:proposal.notes})}
      invoiceHref={invoiceHref} proposalHref={proposalHref}/>:<p className="mt-3 text-sm leading-6 text-amber-800">No se puede preparar el correo: falta una dirección de email válida o una comparación completa. Revisa el contacto.</p>}
  </div>:null}
  <p className="mt-4 text-xs leading-5 text-neutral-600">Las cifras son orientativas para el periodo y consumo verificados. No se garantiza ahorro anual ni se contrata nada automáticamente. El PDF queda privado.</p>
 </section>;
}

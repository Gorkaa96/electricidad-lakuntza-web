'use client';
import {useState} from 'react';

export default function FenieEmailDraft({to,subject,body,invoiceHref,proposalHref}) {
 const [copied,setCopied]=useState(false);
 const draft=`Para: ${to}\nAsunto: ${subject}\n\n${body}`;
 const mailto='mailto:'+encodeURIComponent(to)+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
 async function copyDraft() {
   try {await navigator.clipboard.writeText(draft);setCopied(true);}
   catch {setCopied(false);}
 }
 return <div className="mt-4 space-y-4">
  <p className="text-sm leading-6 text-neutral-700"><strong>Destino:</strong> {to}. Usa el Yahoo habitual. Nada se envía automáticamente: revisa destinatario, texto y adjuntos antes de pulsar Enviar.</p>
  <div className="grid gap-3 sm:grid-cols-2">
   <a href={invoiceHref} className="flex min-h-12 items-center justify-center rounded-lg border border-[#B8D4BB] bg-white px-4 text-sm font-semibold text-[#205934]">1. Descargar factura original</a>
   <a href={proposalHref} className="flex min-h-12 items-center justify-center rounded-lg border border-[#B8D4BB] bg-white px-4 text-sm font-semibold text-[#205934]">2. Descargar propuesta Feníe</a>
  </div>
  <label className="grid gap-2 text-sm font-semibold">Texto preparado para copiar
   <textarea value={draft} readOnly rows={9} className="w-full rounded-lg border border-neutral-300 bg-[#F8FAF7] p-4 text-sm font-normal leading-6" aria-label="Borrador del mensaje"/>
  </label>
  <div className="flex flex-wrap gap-3">
   <button onClick={copyDraft} type="button" className="min-h-12 rounded-lg bg-[#24602F] px-5 text-sm font-semibold text-white">3. Copiar mensaje</button>
   <a href="https://mail.yahoo.com/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center rounded-lg border border-[#A5C5AE] bg-white px-5 text-sm font-semibold text-[#205934]">4. Abrir Yahoo Mail</a>
   <a href={mailto} className="inline-flex min-h-12 items-center px-2 text-sm font-semibold text-[#205934] underline underline-offset-4">Abrir en mi aplicación de correo</a>
  </div>
  {copied?<p role="status" className="text-sm font-semibold text-[#24602F]">Mensaje copiado. Pégalo en Yahoo Mail y añade los dos PDF descargados antes de enviarlo.</p>:null}
  <p className="text-sm font-semibold text-amber-800">Recuerda adjuntar ambos PDF: el navegador no puede adjuntarlos automáticamente a Yahoo. El CRM no marcará el correo como enviado solo por abrir Yahoo.</p>
 </div>;
}

'use client';
import {useState,useTransition,useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {setInvoiceStatusInline} from '@/app/admin/facturas/actions';

const steps=[['reviewing','En revisión'],['contacted','Contactado'],['converted','Contratado'],['discarded','Descartado']];
export default function QuickStatusButtons({leadId,initialStatus}) {
 const router=useRouter();
 const [status,setStatus]=useState(initialStatus);
 const [pending,startTransition]=useTransition();
 const [message,setMessage]=useState('');
 useEffect(()=>{setStatus(initialStatus)},[initialStatus]);
 function update(next) {
  if(pending || status===next)return;
  setMessage('Guardando...');
  startTransition(async()=>{
   try{
    const result=await setInvoiceStatusInline({id:leadId,expectedStatus:status,newStatus:next});
    if(result?.ok){setStatus(result.status);setMessage('Guardado correctamente.');router.refresh();}
    else{setMessage(result?.message||'No se pudo guardar.');router.refresh();}
   } catch{setMessage('Error al guardar. Recarga y vuelve a intentarlo.');}
  });
 }
 return <div className="mt-3">
  <div className="grid gap-2 sm:grid-cols-2">
   {steps.map(([value,label])=><button key={value} type="button" disabled={pending||status===value} onClick={()=>update(value)}
    aria-pressed={status===value} className={`min-h-12 rounded-lg border px-3 py-3 text-base font-semibold transition disabled:cursor-not-allowed ${status===value?'border-[#24662D] bg-[#E8F4E9] text-[#205A36]':'border-[#BED2C0] bg-white text-[#203D2A] hover:border-[#24662D]'}`}>
    {status===value?label+' ✓':label}
   </button>)}
  </div>
  <p role="status" aria-live="polite" className="mt-2 min-h-6 text-sm font-medium text-[#315A3B]">{message}</p>
 </div>;
}

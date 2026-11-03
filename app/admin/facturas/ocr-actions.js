'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAnyPermission } from '@/lib/admin';
import { processInvoiceReading } from '@/lib/invoice/process-reading';
export async function prepareInvoiceOcr(formData) {
  const {supabase}=await requireAnyPermission('leads.edit_all','leads.edit_assigned');
  const id=String(formData.get('id')||'').trim();
  if(!/^[a-f0-9-]{36}$/i.test(id))redirect('/admin/facturas?error=datos');
  const error=await processInvoiceReading({supabase,id});
  revalidatePath('/admin/facturas');
  revalidatePath('/admin/resumen');
  revalidatePath('/admin/facturas/'+id);
  redirect('/admin/facturas/'+id+(error?'?error='+error:'?success=ocr_completado'));
}

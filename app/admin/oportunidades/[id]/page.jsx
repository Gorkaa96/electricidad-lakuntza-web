import { notFound } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { requireAnyPermission } from '@/lib/admin';
import { canEditLeads, hasPermission } from '@/lib/rolePermissions';
import { updateCommercialLead, deleteCommercialLead } from '../actions';

export const metadata = { title: 'Detalle de oportunidad', robots: { index: false, follow: false } };
export const revalidate = 0;

const statusNames = {
  new: 'Nueva', reviewing: 'En revisión', contacted: 'Contactado',
  converted: 'Convertido', discarded: 'Descartado',
};
const serviceNames = {
  luz: 'Luz', gas: 'Gas', alarmas: 'Alarmas',
  cargadores: 'Cargadores eléctricos', asesoria: 'Asesoría energética',
};
const sourceNames = {
  manual: 'Otro contacto directo', whatsapp: 'WhatsApp',
  telefono: 'Teléfono', email: 'Email', web: 'Web',
};
const field = 'min-h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#347C3B]';

function detail(label, value) {
  return (
    <div className="rounded-xl bg-[#F6F8F5] p-4">
      <dt className="text-xs font-medium text-neutral-500">{label}</dt>
      <dd className="mt-2 break-words text-sm font-semibold text-neutral-900">{value || 'No indicado'}</dd>
    </div>
  );
}

export default async function CommercialOpportunityDetail({ params, searchParams }) {
  const { supabase, admin } = await requireAnyPermission('leads.read_all', 'leads.read_assigned');
  const { id } = await params;
  const alerts = await searchParams;
  const { data: lead, error } = await supabase.from('commercial_leads')
    .select('id,service,contact_name,contact_phone,contact_email,customer_type,origin,status,notes,next_contact_on,assigned_to,created_at,updated_at')
    .eq('id', id).maybeSingle();

  if (error || !lead) notFound();

  const { data: events } = await supabase.from('commercial_lead_events')
    .select('id,event_type,description,created_at').eq('lead_id', lead.id)
    .order('created_at', { ascending: false }).limit(40);

  const canEdit = canEditLeads(admin);
  const canAssign = hasPermission(admin, 'leads.assign') && hasPermission(admin, 'leads.edit_all');
  const canDelete = hasPermission(admin, 'leads.delete');

  let agents = [];
  if (canAssign) {
    const { data: members } = await supabase.from('admin_users')
      .select('user_id,email,role,active').eq('role','agent').eq('active',true).order('email');
    agents = members || [];
  }

  return (
    <AdminShell
      title="Detalle de oportunidad"
      description="Seguimiento comercial interno. No se ha realizado ninguna contratación desde el panel."
      action={<a href="/admin/oportunidades" className="text-sm font-semibold text-[#24662D] underline underline-offset-4">Volver a oportunidades</a>}
    >
      {alerts?.success ? <p role="status" className="mb-6 rounded-xl bg-[#ECF7EA] p-4 text-sm text-[#24662D]">Cambios guardados correctamente.</p> : null}
      {alerts?.error ? <p role="alert" className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-800">No se ha podido completar la operación. Comprueba los datos y permisos.</p> : null}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#ECF7EA] px-3 py-1 text-xs font-semibold text-[#2B6C33]">{serviceNames[lead.service] || lead.service}</span>
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">{statusNames[lead.status] || lead.status}</span>
        </div>
        <h2 className="mt-4 break-words text-2xl font-semibold tracking-[-.03em] text-neutral-950">{lead.contact_name}</h2>
        <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {detail('Teléfono', lead.contact_phone)}
          {detail('Correo', lead.contact_email)}
          {detail('Origen', sourceNames[lead.origin] || lead.origin)}
          {detail('Tipo de cliente', lead.customer_type)}
          {detail('Fecha de registro', new Date(lead.created_at).toLocaleDateString('es-ES'))}
          {detail('Siguiente seguimiento', lead.next_contact_on)}
        </dl>
      </section>

      {canEdit ? (
        <section className="mt-7 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-neutral-950">Actualizar seguimiento</h2>
          <p className="mt-2 text-sm leading-7 text-neutral-600">El registro de cambios de estado y de asignación se conserva automáticamente. Los agentes solo pueden actualizar solicitudes asignadas.</p>
          <form action={updateCommercialLead} className="mt-6 grid gap-5">
            <input type="hidden" name="id" value={lead.id} />
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">Estado
                <select name="status" defaultValue={lead.status} required className={field}>
                  {Object.entries(statusNames).map(([value,label])=><option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold">Próximo seguimiento
                <input name="nextContactOn" type="date" defaultValue={lead.next_contact_on || ''} className={field} />
              </label>
            </div>
            {canAssign ? (
              <label className="grid max-w-md gap-2 text-sm font-semibold">Responsable
                <select name="assignedTo" defaultValue={lead.assigned_to || ''} className={field}>
                  <option value="">Sin asignar</option>
                  {agents.map(person => <option key={person.user_id} value={person.user_id}>{person.email}</option>)}
                </select>
              </label>
            ) : null}
            <label className="grid gap-2 text-sm font-semibold">Notas de seguimiento
              <textarea name="notes" defaultValue={lead.notes || ''} maxLength={4000} rows={5} className={field + ' min-h-32'} placeholder="Comentarios relevantes, respuesta y próxima acción." />
            </label>
            <button type="submit" className="min-h-12 justify-self-start rounded-xl bg-[#24662D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#194D20]">Guardar cambios</button>
          </form>
        </section>
      ) : null}

      <section className="mt-7 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-neutral-950">Historial</h2>
        {(events || []).length === 0 ? <p className="mt-4 text-sm text-neutral-600">Todavía no hay eventos registrados.</p> : (
          <ol className="mt-5 divide-y divide-neutral-100">
            {events.map(event => (
              <li key={event.id} className="py-4">
                <p className="text-sm font-semibold text-neutral-900">{event.description}</p>
                <p className="mt-1 text-xs text-neutral-500">{new Date(event.created_at).toLocaleString('es-ES')}</p>
              </li>
            ))}
          </ol>
        )}
      </section>

      {canDelete ? (
        <section className="mt-7 rounded-2xl border border-red-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-red-800">Eliminar oportunidad</h2>
          <p className="mt-2 text-sm leading-7 text-neutral-600">La eliminación también borra su historial interno. Es irreversible. Escribe ELIMINAR para confirmar.</p>
          <form action={deleteCommercialLead} className="mt-4 flex flex-wrap items-end gap-3">
            <input type="hidden" name="id" value={lead.id} />
            <label className="grid gap-2 text-sm font-semibold">Confirmación
              <input name="confirmation" type="text" placeholder="ELIMINAR" autoComplete="off" className={field + ' max-w-56'} required />
            </label>
            <button type="submit" className="min-h-12 rounded-xl border border-red-300 px-5 text-sm font-semibold text-red-700 hover:bg-red-50">Eliminar definitivamente</button>
          </form>
        </section>
      ) : null}
    </AdminShell>
  );
}

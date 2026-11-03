import AdminShell from '@/components/admin/AdminShell';
import { requireAnyPermission } from '@/lib/admin';
import { hasPermission } from '@/lib/rolePermissions';

export const metadata = { title: 'Oportunidades comerciales', robots: { index: false, follow: false } };
export const revalidate = 0;

const serviceNames = {
  luz: 'Luz', gas: 'Gas', luz_gas: 'Luz y gas', alarmas: 'Alarmas',
  cargadores: 'Cargadores eléctricos', asesoria: 'Asesoría energética',
};
const statusNames = {
  new: 'Nueva', reviewing: 'En revisión', contacted: 'Contactado',
  converted: 'Convertido', discarded: 'Descartado',
};

export default async function CommercialOpportunitiesPage({ searchParams }) {
  const { supabase, admin } = await requireAnyPermission('leads.read_all', 'leads.read_assigned');
  const params = await searchParams;
  const selectedStatus = Object.hasOwn(statusNames, params?.estado) ? params.estado : '';
  const selectedService = Object.hasOwn(serviceNames, params?.servicio) ? params.servicio : '';

  let request = supabase.from('commercial_leads')
    .select('id,service,contact_name,contact_phone,contact_email,origin,status,assigned_to,next_contact_on,created_at')
    .order('created_at', { ascending: false }).limit(200);
  if (selectedStatus) request = request.eq('status', selectedStatus);
  if (selectedService) request = request.eq('service', selectedService);

  const { data, error } = await request;
  const leads = data || [];

  return (
    <AdminShell
      title="Oportunidades"
      description="Seguimiento comercial de luz, gas, alarmas, cargadores y asesoría. Las solicitudes de factura se vinculan automáticamente a su oportunidad."
      action={hasPermission(admin, 'leads.edit_all') ? (
        <a href="/admin/oportunidades/nueva" className="inline-flex min-h-11 items-center rounded-xl bg-[#24662D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#194D20]">Nueva oportunidad</a>
      ) : null}
    >
      {params?.success === 'eliminada' ? <p role="status" className="mb-6 rounded-xl bg-[#ECF7EA] p-4 text-sm text-[#24662D]">Oportunidad eliminada.</p> : null}
      <section className="mb-7 rounded-2xl border border-[#D5E5D2] bg-white p-5 sm:p-6">
        <p className="text-sm font-semibold text-[#285D30]">Registro comercial interno</p>
        <p className="mt-2 text-sm leading-7 text-neutral-600">Registra únicamente consultas que hayamos recibido legítimamente. Evita introducir CUPS, documentos de identidad, datos bancarios o información innecesaria. El acceso se limita según el rol del usuario.</p>
      </section>
      <form method="GET" className="mb-6 flex flex-wrap items-end gap-3">
        <label className="grid min-w-[170px] gap-2 text-xs font-semibold text-neutral-700">
          Servicio
          <select name="servicio" defaultValue={selectedService} className="min-h-11 rounded-xl border border-neutral-300 bg-white px-3 text-sm">
            <option value="">Todos los servicios</option>
            {Object.entries(serviceNames).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="grid min-w-[170px] gap-2 text-xs font-semibold text-neutral-700">
          Estado
          <select name="estado" defaultValue={selectedStatus} className="min-h-11 rounded-xl border border-neutral-300 bg-white px-3 text-sm">
            <option value="">Todos los estados</option>
            {Object.entries(statusNames).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <button type="submit" className="min-h-11 rounded-xl border border-[#B8CDB5] bg-white px-5 text-sm font-semibold text-[#255D2A] hover:bg-[#F1F8ED]">Filtrar</button>
        <a href="/admin/oportunidades" className="inline-flex min-h-11 items-center px-3 text-sm text-neutral-600 underline underline-offset-4">Limpiar</a>
      </form>

      {error ? (
        <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          No se han podido cargar las oportunidades. Comprueba la conexión y los permisos.
        </div>
      ) : leads.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8">
          <h2 className="text-xl font-semibold text-neutral-900">No hay oportunidades en esta vista.</h2>
          <p className="mt-3 text-sm leading-7 text-neutral-600">Cuando registres una consulta aparecerá aquí, con su servicio y estado. No es necesario cargar datos ficticios.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <p className="border-b border-neutral-200 px-5 py-3 text-xs text-neutral-500">Mostrando {leads.length} de las oportunidades recientes que puedes consultar (máximo 200).</p>
          <div className="divide-y divide-neutral-100">
            {leads.map((lead) => (
              <a href={'/admin/oportunidades/' + lead.id} key={lead.id} className="grid gap-3 p-5 transition-colors hover:bg-[#F6FAF4] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#EDF5E9] px-3 py-1 text-xs font-semibold text-[#2A6331]">{serviceNames[lead.service] || lead.service}</span>
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">{statusNames[lead.status] || lead.status}</span>
                  </div>
                  <h2 className="mt-3 break-words text-lg font-semibold text-neutral-900">{lead.contact_name}</h2>
                  <p className="mt-1 text-sm text-neutral-600">{lead.contact_phone || lead.contact_email || 'Sin contacto visible'} · {lead.origin}</p>
                  {lead.next_contact_on ? <p className="mt-1 text-xs text-[#8D5E00]">Próximo seguimiento: {lead.next_contact_on}</p> : null}
                </div>
                <span className="text-sm font-semibold text-[#24662D]">Abrir expediente</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </AdminShell>
  );
}

import AdminShell from '@/components/admin/AdminShell';
import { requirePermission } from '@/lib/admin';
import { createCommercialLead } from '../actions';

export const metadata = { title: 'Nueva oportunidad comercial', robots: { index: false, follow: false } };

const field = 'min-h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#347C3B]';
const services = [
  ['luz', 'Luz'], ['gas', 'Gas'], ['luz_gas', 'Luz y gas'], ['alarmas', 'Alarmas'],
  ['cargadores', 'Cargadores eléctricos'], ['asesoria', 'Asesoría energética'],
];

export default async function NewCommercialOpportunityPage({ searchParams }) {
  await requirePermission('leads.edit_all');
  const params = await searchParams;

  return (
    <AdminShell
      title="Nueva oportunidad"
      description="Registra consultas recibidas por teléfono, WhatsApp o correo. El registro es interno: no envía mensajes ni contrata servicios."
      action={<a href="/admin/oportunidades" className="text-sm font-semibold text-[#24662D] underline underline-offset-4">Volver a oportunidades</a>}
    >
      {params?.error ? <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">No se ha podido guardar. Revisa los datos de contacto y vuelve a intentarlo.</p> : null}
      <form action={createCommercialLead} className="grid max-w-3xl gap-7 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">Servicio *
            <select name="service" required className={field}>
              {services.map(([value,label])=><option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold">Tipo de cliente *
            <select name="customerType" defaultValue="vivienda" className={field}>
              <option value="vivienda">Vivienda</option>
              <option value="negocio">Negocio</option>
              <option value="comunidad">Comunidad</option>
              <option value="otro">Otro</option>
            </select>
          </label>
        </div>
        <label className="grid gap-2 text-sm font-semibold">Nombre de contacto *
          <input name="contactName" required minLength={2} maxLength={160} autoComplete="off" className={field} placeholder="Nombre de quien realiza la consulta" />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">Teléfono
            <input name="contactPhone" type="tel" maxLength={35} autoComplete="off" className={field} placeholder="Teléfono para contactar" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">Correo electrónico
            <input name="contactEmail" type="email" maxLength={254} autoComplete="off" className={field} placeholder="Opcional" />
          </label>
        </div>
        <p className="-mt-5 text-xs leading-6 text-neutral-500">Se necesita al menos un dato de contacto: teléfono o correo electrónico.</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">Canal de entrada *
            <select name="origin" defaultValue="whatsapp" className={field}>
              <option value="whatsapp">WhatsApp</option>
              <option value="telefono">Teléfono</option>
              <option value="email">Email</option>
              <option value="manual">Otro contacto directo</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold">Próximo seguimiento
            <input name="nextContactOn" type="date" className={field} />
          </label>
        </div>
        <label className="grid gap-2 text-sm font-semibold">Notas internas
          <textarea name="notes" maxLength={4000} rows={4} className={field + ' min-h-32'} placeholder="Necesidad, condiciones consultadas y siguiente paso. No incluyas datos sensibles." />
        </label>
        <p className="rounded-xl bg-[#F2F7EE] p-4 text-xs leading-6 text-[#3E6041]">Antes de registrar datos personales, confirma que se han facilitado para atender una consulta y que se ha informado de su tratamiento. No introduzcas DNI, datos bancarios ni documentos de clientes.</p>
        <button type="submit" className="min-h-12 justify-self-start rounded-xl bg-[#24662D] px-7 py-3 text-sm font-semibold text-white hover:bg-[#194D20]">Guardar oportunidad</button>
      </form>
    </AdminShell>
  );
}

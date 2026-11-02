import { UserPlus, Users, ShieldCheck } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import { requirePermission } from '@/lib/admin';
import { hasPermission, ROLE_DEFAULTS, ROLE_LABELS, PERMISSION_OPTIONS } from '@/lib/rolePermissions';
import { inviteTeamMember, updateTeamMember } from './actions';

export const metadata = { title: 'Usuarios y permisos', robots: { index: false, follow: false } };
export const revalidate = 0;

const errors = {
  config: 'Las invitaciones aún no están configuradas. Revisa el secreto de servidor, la URL de invitación y el correo SMTP.',
  datos: 'Revisa el correo, rol y permisos seleccionados.',
  existe: 'Ya existe un usuario registrado con ese correo.',
  self: 'No puedes cambiar los permisos de tu propia cuenta desde este formulario.',
  protegido: 'No puedes modificar al propietario ni a un administrador de nivel superior.',
  permisos: 'No tienes permiso para asignar ese rol o ese privilegio.',
  invitacion: 'No se pudo enviar la invitación. Comprueba la configuración de SMTP y los límites de correo en Supabase.',
  membresia: 'Se envió la invitación, pero no se pudo asignar el rol. No se podrá acceder hasta corregirlo.',
  servidor: 'No se pudo guardar el cambio. Vuelve a intentarlo.',
};

function PermissionFields({ selected = [], manager, prefix }) {
  return (
    <fieldset className="mt-5">
      <legend className="text-sm font-semibold text-neutral-800">Permisos individuales</legend>
      <input type="hidden" name="permissionsPresent" value="true" />
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {PERMISSION_OPTIONS.map((option) => (
          <label key={prefix + option.key} className="flex min-h-11 items-center gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm">
            <input type="checkbox" name="permissions" value={option.key} defaultChecked={selected.includes(option.key)} disabled={!hasPermission(manager, option.key)} className="h-4 w-4 accent-[#24662D]" />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <p className="mt-3 text-xs leading-6 text-neutral-500">Un agente solo ve las solicitudes asignadas, salvo que se le concedan otros permisos. Las restricciones se aplican también en la base de datos.</p>
    </fieldset>
  );
}

export default async function TeamMembersPage({ searchParams }) {
  const { supabase, admin } = await requirePermission('users.manage');
  const params = await searchParams;
  const { data: users, error } = await supabase
    .from('admin_users')
    .select('user_id, email, role, permissions, active, created_at')
    .order('created_at', { ascending: true });

  const readyToManage = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const readyToInvite = readyToManage && Boolean(process.env.ADMIN_INVITATION_BASE_URL);
  const canInviteAdmin = admin.role === 'owner';

  return (
    <AdminShell title="Usuarios y permisos" description="Controla quién accede al panel y qué operaciones puede realizar.">
      {params?.success ? <p role="status" className="mb-6 rounded-xl border border-[#BED6BE] bg-[#ECF7EA] p-4 text-sm font-semibold text-[#24662D]">{params.success === 'invitado' ? 'Invitación enviada. El usuario debe aceptarla para entrar.' : 'Permisos actualizados.'}</p> : null}
      {params?.error ? <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{errors[params.error] || 'No ha sido posible completar la operación.'}</p> : null}
      {!readyToInvite ? <div className="mb-7 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900"><strong>Invitaciones no activadas.</strong> Configura el secreto de Supabase solo en Vercel (servidor), la URL de invitaciones y SMTP. La consulta de usuarios y las políticas de permisos sí están disponibles.</div> : null}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3"><UserPlus className="text-[#286B2C]" /><h2 className="text-xl font-semibold">Invitar a una persona</h2></div>
        <p className="mt-3 text-sm leading-7 text-neutral-600">El usuario recibe un enlace para activar su cuenta. No enviamos ni almacenamos contraseñas en el panel.</p>
        <form action={inviteTeamMember} className="mt-6 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">Correo electrónico
              <input name="email" type="email" required autoComplete="off" maxLength={254} placeholder="agente@empresa.com" className="min-h-12 rounded-xl border border-neutral-300 px-4 py-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">Rol
              <select name="role" defaultValue="agent" className="min-h-12 rounded-xl border border-neutral-300 px-4 py-3">
                <option value="agent">Agente</option>
                {canInviteAdmin ? <option value="admin">Administrador</option> : null}
              </select>
            </label>
          </div>
          <PermissionFields selected={ROLE_DEFAULTS.agent} manager={admin} prefix="new-" />
          <button type="submit" disabled={!readyToInvite} className="min-h-12 justify-self-start rounded-xl bg-[#24662D] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Enviar invitación</button>
        </form>
      </section>

      <section className="mt-8">
        <div className="mb-5 flex items-center gap-3"><Users className="text-[#286B2C]"/><h2 className="text-2xl font-semibold tracking-[-.03em]">Usuarios actuales</h2></div>
        {error ? <p role="alert" className="rounded-xl bg-red-50 p-5 text-red-700">No hemos podido consultar los usuarios.</p> : (
          <div className="grid gap-5">
            {(users || []).map((member) => {
              const isOwner = member.role === 'owner';
              const canEdit = !isOwner && (admin.role === 'owner' || member.role === 'agent');
              return (
                <article key={member.user_id} className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div><h3 className="break-all text-lg font-semibold">{member.email}</h3><p className="mt-1 text-sm text-neutral-500">{ROLE_LABELS[member.role] || member.role} · {member.active ? 'Acceso activo' : 'Acceso desactivado'}</p></div>
                    {isOwner ? <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#286B2C]"><ShieldCheck size={16}/> Cuenta protegida</span> : null}
                  </div>
                  {canEdit ? <form action={updateTeamMember} className="mt-5 border-t border-neutral-200 pt-5">
                    <input type="hidden" name="userId" value={member.user_id}/>
                    <label className="grid max-w-sm gap-2 text-sm font-semibold">Rol
                      <select name="role" defaultValue={member.role} className="min-h-11 rounded-xl border border-neutral-300 px-3 py-2">
                        <option value="agent">Agente</option>
                        {admin.role === 'owner' ? <option value="admin">Administrador</option> : null}
                      </select>
                    </label>
                    <PermissionFields selected={member.permissions || []} manager={admin} prefix={member.user_id}/>
                    <label className="mt-5 flex items-center gap-3 text-sm"><input type="checkbox" name="active" defaultChecked={member.active} className="h-4 w-4 accent-[#24662D]"/>Permitir acceso al panel</label>
                    <button type="submit" disabled={!readyToManage} className="mt-5 min-h-11 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Guardar permisos</button>
                  </form> : null}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </AdminShell>
  );
}

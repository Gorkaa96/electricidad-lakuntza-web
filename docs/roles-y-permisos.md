# Electricidad Lakuntza — acceso multiusuario y permisos

Fecha: 2026-11-02. Implementación en la rama de preparación, sin promoción a producción.

## Modelo

- `owner` (propietario): autoridad completa, no se puede degradar o desactivar desde el panel; el primer admin existente fue promovido en migración.
- `admin`: puede administrar agentes y gestionar solicitudes / contenido según permisos otorgados. Solo propietario puede crear o promover administradores.
- `agent`: permisos asignados individualmente, por defecto lectura/edición **de solicitudes asignadas**, sin ver todas las facturas ni gestionar usuarios.

Permisos disponibles:
- `leads.read_all`: consultar todas las solicitudes.
- `leads.read_assigned`: consultar solo las asignadas.
- `leads.edit_all`: gestionar todas.
- `leads.edit_assigned`: gestionar asignadas; un trigger impide alterar identidad del cliente, titularidad y archivo.
- `leads.assign`: asignar a agente; la acción requiere también `leads.edit_all`.
- `leads.delete`: eliminar solicitud y documento.
- `projects.manage`: crear y editar trabajos y fotos (conservados para un futuro).
- `users.manage`: invitar y editar miembros de niveles permitidos.

Los permisos se verifican en el **servidor** y en **RLS Supabase**; ocultar botones es solo UX. Los administradores no pueden editar su propio rol desde el formulario ni eliminar la cuenta propietaria.

## Aplicado en Supabase

- `supabase/roles_permissions_v1.sql` (migración `roles_and_agent_permissions_v1`).
- `supabase/agent_assignments_v1.sql` (migración `agent_assignments_v1`).
- `supabase/agent_limited_edit_v1.sql` (migración `agent_limited_edit_v1`).
- `app_private.has_permission` no se publica en la Data API, comprueba membership `active` y `auth.uid`.
- `invoice_review_leads.assigned_to` es una FK a `admin_users`. Los archivos de factura en `invoice-files` siguen privados; la visibilidad corresponde a la solicitud accesible.

## Invitaciones (PENDIENTES DE ACTIVAR)

Requiere configuración del propietario en las variables de entorno de **Preview** de Vercel:
1. `SUPABASE_SERVICE_ROLE_KEY`: secreto **solo servidor**, nunca `NEXT_PUBLIC_`. Este rol omite RLS, restringir acceso al proyecto Vercel.
2. `ADMIN_INVITATION_BASE_URL`: URL HTTPS exacta del despliegue autorizado; redirección final a `/admin/activar-cuenta` y URL registrada en Supabase Authentication > URL Configuration.
3. SMTP personalizado en Supabase Auth para destinatarios externos, plantilla de invitación revisada y dominio remitente verificado.
4. Validación E2E: invitación, establecer contraseña, acceso por rol, modificación, bloqueo y revocación, sin exponer secretos.

La pantalla de usuarios aparece aunque estas variables no existan, pero las invitaciones quedan desactivadas. **No habilitar `INVOICE_INTAKE_ENABLED` todavía**: acceso al administrador y captación pública de facturas son procesos diferentes. Configurar SMTP y almacenamiento de documentos cumpliendo RGPD.

## Pruebas pendientes

Simular agentes/no-admin reales mediante sesiones independientes, comprobar que un agente no ve solicitudes ajenas ni puede alterar `assigned_to` o datos personales, prueba de asignación y revocación, comprobación de Storage con JWT, emails de invitación y renovación de sesión. Mantener PR como borrador hasta validar.

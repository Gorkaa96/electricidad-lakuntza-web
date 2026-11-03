# Electricidad Lakuntza — activación segura cloud (03/11/2026)

Entorno actual: GitHub `Gorkaa96/electricidad-lakuntza-web`, rama `integration/launch-prep-2026-10-29`, PR #9 DRAFT; Supabase `yvrjrvropgouvzltwwvm`; Vercel `prj_CNVoTiZ9IcAxsRdWhpRYN9iqUqeZ`.

**No almacenar contraseñas ni claves privadas en GitHub, ChatGPT, WhatsApp o documentación. Configurar las variables en Vercel > Project > Settings > Environment Variables para Preview.**

## Variables de entorno

| Variable | Tipo | Finalidad |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Pública | URL del Supabase nuevo |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Pública | Clave publishable de Supabase, no la de servicio |
| `SUPABASE_SERVICE_ROLE_KEY` | Secreto servidor | Exclusivamente acciones internas validadas; jamás en frontend |
| `NEXT_PUBLIC_SITE_URL` | Pública | URL canónica, revisable al definir el dominio |
| `ADMIN_PANEL_BASE_URL` | Servidor | URL HTTPS confiable del panel para avisos por email |
| `ADMIN_INVITATION_BASE_URL` | Servidor | URL estable de Preview, habilitada en Supabase Auth URL allowlist |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Pública | Sitekey de Cloudflare Turnstile |
| `TURNSTILE_SECRET_KEY` | Secreto servidor | Validación server-to-server en Cloudflare |
| `INTAKE_RATE_LIMIT_SECRET` | Secreto servidor | Cadena aleatoria >=32 caracteres para HMAC de límites de tasa |
| `RESEND_API_KEY` | Secreto servidor | Envío de aviso interno tras guardar un expediente |
| `RESEND_FROM` | Servidor | Remitente con dominio verificado en Resend |
| `INVOICE_REVIEW_TO` | Servidor | Correo interno para aviso de factura (sin adjuntos) |
| `COMMERCIAL_LEAD_TO` | Servidor | Correo interno para aviso de consulta comercial (sin datos sensibles) |
| `INVOICE_INTAKE_ENABLED` | Servidor | Mantener `false` hasta aprobar todo el test de facturas |
| `PUBLIC_COMMERCIAL_INTAKE_ENABLED` | Servidor | Mantener `false` hasta aprobar todo el test de consultas |
| `NEXT_PUBLIC_PUBLICATION_ENABLED` | Pública | Mantener `false` hasta el lanzamiento y revisión SEO |

Los dos formularios públicos fallan en modo cerrado si faltan claves, Turnstile, HMAC o configuración obligatoria de aviso. Las páginas conservan WhatsApp, email y teléfono mientras están desactivados.

## Turnstile

1. Crear widget gestionado en Cloudflare Turnstile; registrar únicamente los hostnames concretos autorizados (dominio final y Preview estable de pruebas).
2. Guardar Sitekey pública y Secret key privada en sus variables correspondientes.
3. La web envía la acción `invoice_review` en el formulario de facturas y `commercial_inquiry` en el de consultas.
4. El servidor hace llamada `siteverify` para cada envío y comprueba `success`, `action` y hostname; si algo no coincide, deniega el envío.
5. La base aplica además un máximo atómico de **4 intentos por hora** para cada identificador de contacto y, si se obtiene, IP del visitante, seudonimizados con HMAC; conserva los contadores hasta 48 h aproximadamente.

**Importante:** los enlaces de Preview de Vercel cambian por commit y no siempre están dados de alta en Turnstile. Para pruebas integrales utilizar una URL estable incluida en los hostnames permitidos.

## Invitaciones de usuarios y acceso

1. Configurar el SMTP personalizado/verificado en Supabase Authentication (no asumir que el SMTP de prueba enviará invitaciones a cualquier dominio).
2. Registrar la redirección de invitación `https://PREVIEW_ESTABLE/admin/activar-cuenta` en la allowlist de Supabase Auth y usar el mismo origen como `ADMIN_INVITATION_BASE_URL`.
3. Verificar la variable `SUPABASE_SERVICE_ROLE_KEY` **solo servidor** y la URL pública correcta de Supabase.
4. Desde `/admin/usuarios`, el propietario puede invitar administradores o agentes según permiso; los administradores pueden invitar agentes si su rol lo permite.
5. Probar con una cuenta ficticia separada: invitación → establecer contraseña → acceso solo a oportunidades asignadas → revocar permisos → acceso denegado.
6. No crear usuarios para clientes; este panel es exclusivo para personal autorizado.

## E2E antes de activar captación real

- Desde un navegador con sesión real: crear oportunidad, editar, asignar, comprobar historial y borrar.
- Con un agente de prueba: verificar que no ve otro expediente ni puede cambiar identidad, asignación o roles.
- Formulario de consultas: comprobar Turnstile, errores por robot, rate-limit (quinto intento bloqueado), guardado, aviso interno y confirmación firmada.
- Factura completamente **sintética**: PDF/imagen de prueba, firma y tamaño, Storage privado, análisis, enlace a CRM, avisos sin archivo, estado sincronizado y borrado completo. Comprobar 403/denegación en acceso sin rol.
- Error de Resend: el expediente permanece en el administrador y debe ser visible para seguimiento manual.
- Revisar aviso legal y política RGPD por el titular real del negocio, responsables, bases jurídicas, proveedores, derechos, retención y transferencias.
- Confirmar precios y alcance real del canal comercial Feníe con Javier.

Solo con todos los puntos verificados se podrán cambiar las banderas de intake a `true`, una a una, en Preview primero. No fusionar PR #9 ni promocionar Production automáticamente.

## Modalidad cloud

Las modificaciones se versionan en GitHub y se despliegan en Vercel por rama. No es necesario un repositorio local en el portátil. Para el E2E navegando por una sesión autenticada, utilizar **Work** con navegador conectado o Codex cloud con acceso autorizado y pruebas reproducibles.


## Verificación adicional en Work — 03/11/2026

La API de Vercel devuelve 403 para variables, pero se ha revisado la pantalla de Environment Variables con la sesión existente, sin revelar valores. Solo se muestran `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `INVOICE_INTAKE_ENABLED`, `OPENAI_OCR_MODEL` y `OPENAI_API_KEY`. Las variables de servidor/Turnstile/Resend/invitaciones de la tabla superior no figuran. No basta con cambiar la bandera de facturas.

Los nombres OPENAI corresponden a configuración anterior: el código actual inspeccionado no los utiliza. Revisar su necesidad con el propietario; no se han leído ni eliminado sus valores.

La aceptación web registra fecha y versión del aviso. El estado del aviso por email se conserva como pending/accepted/failed y aparece en el panel; accepted significa aceptación por Resend, no entrega al destinatario. Si queda pending o failed, atender la solicitud desde el CRM.

Pendiente para Javier/Kristina: [preguntas concretas](preguntas-javier-kristina.md). Las banderas siguen sin habilitarse.

Antes de publicar, el propietario debe proteger `main` con un ruleset: PR obligatorio, revisión aprobada y CI requerido. La consulta de GitHub devolvió `protected=false`; el estado draft por sí solo no impone estas garantías.

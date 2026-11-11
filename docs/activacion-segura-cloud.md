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

Los ensayos con datos sintéticos se realizan primero en el runner aislado y después en la Preview protegida, siguiendo el procedimiento de activación controlada de este documento. Production permanece cerrada hasta aprobación explícita.

## Modalidad cloud

Las modificaciones se versionan en GitHub y se despliegan en Vercel por rama. No es necesario un repositorio local en el portátil. Para el E2E navegando por una sesión autenticada, utilizar **Work** con navegador conectado o Codex cloud con acceso autorizado y pruebas reproducibles.


## Estado actualizado de configuración — 03/11/2026
Se guardaron por UI en Vercel exclusivamente para Preview de la rama de integración:
- ADMIN_PANEL_BASE_URL y ADMIN_INVITATION_BASE_URL: https://electricidad-lakuntza-git-c5cfe9-gorkahernandez6-9437s-projects.vercel.app
- INVOICE_INTAKE_ENABLED=false, PUBLIC_COMMERCIAL_INTAKE_ENABLED=false y NEXT_PUBLIC_PUBLICATION_ENABLED=false.

Configurado y verificado en Supabase Auth el 03/11/2026, con autorización expresa: Site URL = origen Preview anterior; única redirección exacta registrada:
https://electricidad-lakuntza-git-c5cfe9-gorkahernandez6-9437s-projects.vercel.app/admin/activar-cuenta

La API de variables de Vercel devuelve 403. La sesión del navegador permite consultar/configurar Preview, pero no se han revelado ni rotado secretos. No figuran aún las credenciales servidor/captcha/correo necesarias; no basta con habilitar los flags.

OPENAI_API_KEY y OPENAI_OCR_MODEL son configuración anterior: el lector actual no los utiliza. No se han leído ni eliminado sus valores. Los PDF con texto se procesan con pdf-parse; imágenes y escaneados requieren revisión manual.

## Prueba reproducible sin tocar la instalación alojada
El workflow Verify isolated backend levanta Supabase local en un runner de GitHub, aplica los SQL del proyecto y crea cuentas y facturas ficticias. Las claves locales generadas quedan en temporal y se enmascaran. No utiliza el proyecto alojado ni claves de sus cuentas.
El preload de proveedores vive solo en tests/backend, exige CI y URL loopback y no se importa desde el código de la aplicación. Controla captcha y avisos exclusivamente en esa prueba; impide contactar proveedores reales. No copiar su configuración al alojamiento.
Las invitaciones de esa prueba sí recorren Auth y SMTP local hasta el buzón de prueba. No certifican entrega del SMTP corporativo.

## Activación controlada sobre Preview alojada
1. Completar credenciales desde las cuentas autorizadas y hostname Turnstile. La Site URL y allowlist exacta de Supabase ya están guardadas.
2. Mantener protegida la Preview con Vercel Authentication. Usar solo datos sintéticos y destinatarios de prueba autorizados.
3. Cuando estén cerrados los controles previos, habilitar cada flujo solo en esa Preview protegida para repetir el circuito. No habilitar recepción pública ni Production.
4. Registrar evidencias de captcha real, guardado, CRM, aviso y entrega, permisos, revocación y borrado; volver a cerrar el flujo si falla un control.
5. Solicitar la aprobación separada de publicación únicamente con datos legales, configuración y pruebas completas.

El aviso accepted significa aceptación por el proveedor, no entrega. pending/failed se atienden desde el CRM. No adjuntar facturas a los avisos.

## Protección y publicación
El ruleset de main 26449542 está guardado, activo y verificado mediante la API de GitHub tras la verificación de identidad de la cuenta propietaria. Incluye una revisión aprobada, los checks Build with Node.js 24 e Isolated Auth, Storage, CRM and browser, ramas actualizadas y bloqueo de borrado/force-push.
PR #9 permanece draft. No fusionar ni promocionar Production automáticamente.

Pendientes vigentes: [lista única](lista-unica-cierre.md).

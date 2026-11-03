# Recepción real en Preview protegida
03/11/2026. Rama integration/launch-prep-2026-10-29, PR #9 draft.

## Experiencia final
Retirado el ejemplo y la comprobación local. No hay datos prellenados, botón de ejemplo ni confirmación simulada. Gorka preparará y enviará su propio documento.
La solicitud solo aparece en /admin/facturas después del envío real y guardado correcto. Lo introducido en el antiguo ensayo local nunca se guardó ni puede recuperarse del panel.

## Configuración autorizada y guardada
- Cloudflare: widget gestionado, pre-clearance desactivado, un único hostname: electricidad-lakuntza-git-c5cfe9-gorkahernandez6-9437s-projects.vercel.app.
- Resend: clave de solo envío; remitente Electricidad Lakuntza <onboarding@resend.dev>; avisos de facturas y consultas dirigidos exclusivamente a gorkahernandez6@gmail.com.
- Vercel: RESEND_API_KEY, TURNSTILE_SECRET_KEY, SUPABASE_SERVICE_ROLE_KEY e INTAKE_RATE_LIMIT_SECRET guardados como Secret solo en Preview de esta rama. Se ha usado la clave moderna de servidor ya existente de Supabase, sin rotarla ni generar nuevos permisos en base de datos.
- NEXT_PUBLIC_TURNSTILE_SITE_KEY pública y remitentes/destinatarios guardados como Config en el mismo ámbito.
- INVOICE_INTAKE_ENABLED=true y PUBLIC_COMMERCIAL_INTAKE_ENABLED=true solo en Preview de esta rama, tras autorización expresa y verificación de identidad Vercel realizada por el propietario.
- NEXT_PUBLIC_PUBLICATION_ENABLED continúa false. No se ha modificado Production ni main.
No se incluyen valores de claves en documentación, commits, CI ni Keep. Portapapeles limpiado tras las copias.

## Validación y alcance
Código 6bebab0: 27 unitarias, 54 pruebas públicas aprobadas y 2 omisiones intencionadas por tamaño; build/audit de producción aprobados. Backend desechable: SQL, 7 API y 12 E2E aprobados. Se conservan pruebas de envío real y persistencia del proveedor en ese entorno aislado.
La configuración alojada se entrega para la prueba de Gorka. No se crea otro expediente de ejemplo automáticamente ni se da por aprobada la entrega corporativa o un circuito alojado aún no ejecutado.

## Cómo comprobar tu envío
1. Abrir la Preview protegida y /revision-factura-luz-gas.
2. Completar campos, seleccionar documento, consentimiento y verificación de seguridad.
3. Enviar y comprobar confirmación real; si falla un control, se muestra error y no se anuncia éxito.
4. Abrir /admin/facturas con sesión de personal autorizado y comprobar solicitud/archivo.
5. Consultar el aviso en el Gmail autorizado. En Resend accepted no garantiza entrega; revisar estados del proveedor y bandeja.
6. Si algo falla, guardar únicamente el tipo de error y hora; no copiar datos del documento ni claves al repo.

El proveedor permite el dominio resend.dev solo para pruebas dirigidas a la propia cuenta: https://resend.com/docs/knowledge-base/403-error-resend-dev-domain.
Para avisar a Javier u otros destinatarios hay que verificar un dominio remitente. No usar esta configuración como lanzamiento público.

## Rollback
Ante fallo, volver a false los dos flags de Preview y redesplegar esa rama. No borrar claves, documentos o registros sin autorización; revocar claves si se comprometen. No publicar producción automáticamente.

## Incidencia corregida durante la conexión
La copia inicial confundió la clave pública de Turnstile con su secreto. Ese secreto quedó en NEXT_PUBLIC_TURNSTILE_SITE_KEY y en el despliegue protegido dpl_7BZc6tA4KbLj9Qh64rwwTmCyWmg3; la comprobación real del navegador lo detectó por el error 400020. No se consideran válidas las comprobaciones del captcha de esa versión.
Se corrigió la variable pública contrastándola con site_key del widget. Gorka rotó el secreto en Cloudflare; se comprobó que el nuevo difiere del anterior y se guardó exclusivamente como Secret servidor de Vercel. No se incluye ningún valor en este documento.
Cloudflare mantiene una transición de dos horas para el secreto antiguo: https://developers.cloudflare.com/turnstile/troubleshooting/rotate-secret-key/. No utilizar el despliegue antiguo; el enlace estable debe apuntar al despliegue posterior a esta corrección. La incidencia no se oculta como prueba aprobada.
Antes del envío del propietario, el recuento alojado era 0 solicitudes y 0 archivos privados. No se creó otro ejemplo.

## Tamaño de archivo para este alojamiento
La solicitud multipart pasa por Vercel Functions, cuyo límite de cuerpo es 4.5 MB. Se ha ajustado el archivo público a 4 MiB (indicado como 4 MB) en selector y servidor, con prueba del límite +1 byte, dejando margen para los campos y el multipart. El bucket privado conserva su capacidad de 10 MiB; esa capacidad no es una promesa del formulario público. Referencia: https://vercel.com/docs/functions/limitations#request-body-size.

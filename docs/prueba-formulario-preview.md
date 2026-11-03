# Validar el formulario sin NIF ni dominio definitivo
03/11/2026. Solo Preview de integration/launch-prep-2026-10-29.

1. Abrir https://electricidad-lakuntza-git-c5cfe9-gorkahernandez6-9437s-projects.vercel.app/revision-factura-luz-gas#formulario
2. Pulsar Usar datos y factura de ejemplo. No hace falta descargar nada ni aportar documentos personales.
3. Elegir suministro y responder sobre bono social; probar también gas y luz/gas.
4. Marcar consentimiento y pulsar Comprobar formulario sin enviar.
5. Verificar que aparece comprobación local completada. Probar teléfono inválido, falta de consentimiento, formato y tamaño no admitidos.

Es el mismo contenido y componentes de la solicitud real. La envoltura de prueba valida en el navegador y no tiene acción de servidor. Sin JavaScript, sus campos y botón están deshabilitados. No almacena en cookies/localStorage ni envía datos/archivo; no simula éxito de recepción ni OCR.
Solo se muestra cuando intake no está listo y las variables de sistema de Vercel indican Preview y esta rama exacta. No se habilita por URL ni en Production. El formulario real conserva todos sus controles y se prueba por separado en Supabase desechable.

## Qué impide ahora el envío alojado
Revisados los nombres de variables en Vercel: faltan SUPABASE_SERVICE_ROLE_KEY, INTAKE_RATE_LIMIT_SECRET, TURNSTILE_SECRET_KEY, NEXT_PUBLIC_TURNSTILE_SITE_KEY, RESEND_API_KEY, RESEND_FROM e INVOICE_REVIEW_TO/COMMERCIAL_LEAD_TO. Resend conduce a login; no hay sesión del proveedor disponible.
No son bloqueos por NIF o dominio final. Para ensayar correo puede utilizarse una identidad de prueba permitida por el proveedor y destinatario autorizado; requiere entrar en esa cuenta y obtener sus credenciales.
Configurar secretos directamente en las plataformas sin pasarlos al repositorio ni al chat. El panel de Vercel es accesible por navegador; el conector devuelve 403 para variables.

## Otras acciones aplicadas
Cierre de alta libre en Supabase Auth, comprobado tras recargar. No se han cambiado contraseñas, generado cuentas ni comprado planes.
Se mantienen las banderas de publicación y captación cerradas y la PR #9 draft.

## Volver atrás
Revertir el commit de formulario en la misma rama; no force-push ni cambios de producción. El cambio no añade datos ni modifica esquema.

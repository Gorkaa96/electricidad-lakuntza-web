# Formulario final y recepción real en Preview
03/11/2026.

Se ha retirado el modo de ejemplo y toda comprobación local que pudiera confundirse con una recepción real. El propietario preparará su propio ejemplo. No se crean facturas de prueba automáticamente.

La Preview muestra los campos finales y el selector de archivo. El botón de envío permanece deshabilitado hasta completar las variables de servidor, Turnstile y avisos. Con configuración completa utiliza la misma acción probada con Storage/CRM; no hay un flujo simulado.
Una solicitud solo aparecerá en /admin/facturas cuando el envío real termine correctamente. Lo introducido en el antiguo ensayo local nunca se guardó y no puede recuperarse del panel.

## Configuración pendiente
Cuentas de Cloudflare y Resend creadas y sesiones comprobadas.
- Turnstile gestionado: hostname exacto de Preview y sitekey/secreto.
- Resend: clave de solo envío; para prueba privada, onboarding@resend.dev y exclusivamente el correo de la cuenta autorizada. Verificar restricciones vigentes del proveedor.
- Vercel: guardar claves como Secret solo en Preview de esta rama. SUPABASE_SERVICE_ROLE_KEY y secreto HMAC >=32 caracteres solo servidor.
- Mantener INVOICE_INTAKE_ENABLED y PUBLIC_COMMERCIAL_INTAKE_ENABLED false hasta completar controles/configuración; después habilitar solo Preview protegida para prueba real.
- Repetir circuito con el ejemplo que aporte Gorka y sesión autorizada; comprobar guardado en panel, archivo privado y aviso.
No publicar producción ni abrir captación pública automáticamente. El NIF y dominio final siguen pendientes para publicación.

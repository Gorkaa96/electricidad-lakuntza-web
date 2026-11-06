# Plan vigente de publicación y CRM — 5 de noviembre de 2026

Este documento actualiza el estado a esta fecha; los informes anteriores son históricos. Rama integration/launch-prep-2026-10-29, PR #9 en borrador. No autoriza publicación ni compra.

## Decisiones de Javier, Kristina y Gorka
Equipo de dos personas. Javier es principalmente técnico. Prefieren electricidadlakuntza.com. Una sola línea y una sola cuenta WhatsApp Business compartida mediante dispositivos vinculados; llamadas y desvíos se decidirán después. Correo, telefonía, redirecciones y envío desde CRM se configuran después de comprar el dominio.

Correo obligatorio para nuevas facturas de luz/gas: formulario y servidor deben rechazar vacío o inválido, además de teléfono y consentimiento. No alterar retrospectivamente los expedientes previos sin correo. Otras consultas generales mantienen su validación independiente.

Flujo comercial deseado: cliente sube factura -> lectura automática -> agente genera comparación en portal oficial Feníe -> descarga y adjunta propuesta al expediente privado -> extracción/comparación de factura y propuesta con revisión humana -> prepara mensaje estándar y adjunto -> confirma destinatario/versiones y envía desde CRM con cuenta corporativa -> historial y seguimiento. No inventar tarifas ni confundir lectura con análisis comercial ni aceptación del proveedor de correo con entrega en bandeja.

## Compra del dominio
Namecheap comprobado hoy: electricidadlakuntza.com disponible, alta 12,08 USD según conector; no incluye confirmación del total final, renovación o impuestos. .es devuelto no disponible. Revalidar en pago, no prometer reserva. Cuenta del negocio con acceso/recuperación controlados por titulares; no es obligatorio Gmail. Si crean Gmail dedicado, evitar usarlo como contraseña compartida del CRM. Contactos/facturación/registrante del negocio con datos fiscales documentales. Comprar únicamente dominio; hosting web ya resuelto por Vercel. No contratar correo ni otros extras todavía. Activar segundo factor, renovación y conservar justificante. Compra no equivale a web publicada.

## Verificaciones realizadas hoy y límites
- Revisión del formulario y acción del servidor: antes correo opcional. Corrección y pruebas incluidas en este cambio.
- Supabase alojado: RLS habilitado en las ocho tablas públicas actuales; invoice-files privado; project-images público para imágenes de trabajos. No convertir este último en almacén de facturas/propuestas.
- Archivo de facturas pasa por ruta autenticada, comprueba miembro activo y acceso a fila, descarga con sesión y cabeceras private/no-store y attachment. No entrega una URL pública persistente.
- Asesor de seguridad Supabase: aviso de protección de contraseñas filtradas desactivada. Evaluar habilitación y disponibilidad en plan antes del lanzamiento. Referencia: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- Aviso informativo de RLS sin política en app_private.public_intake_quota: no añadir acceso público para silenciarlo; comprobar privilegios/RPC en revisión específica. RLS activado no demuestra por sí solo que todas las políticas sean correctas.
- El cambio rápido de estado sigue terminando en redirect; nueva interacción local pendiente.
- Esta revisión no es auditoría exhaustiva ni acredita producción lista. Verificar con nuevas pruebas cada bloque.

## Trabajo técnico pendiente (no requiere que el negocio lo implemente)
1. Ficha y estados sin navegación completa: guardado visible, errores, concurrencia, historial y sincronización con oportunidad.
2. Documentos privados de propuesta Feníe: carga validada, versiones, autor, fecha, vigencia; acceso por permisos y eliminación coherente.
3. Extracción de propuesta y comparador equivalente: mismo consumo/periodo/impuestos/unidades; desglose, extras, permanencia, descuentos y explicación. No declarar ahorro con datos incompletos o sin revisión.
4. Preparar correo desde expediente con destinatario comprobado, texto estándar editable, adjunto exacto, confirmación y trazabilidad; protección contra duplicados, fallos y reintentos. Sin envío automático al cargar.
5. Bandeja de seguimientos, responsables, filtros y revisión móvil/teclado/estados vacíos del CRM y web.
6. OCR visual/IDP para fotografías/PDF escaneados. Actual lector PDF con texto no cubre estos formatos; mantener ruta de revisión manual y no mostrar exactitud no medida.
7. Revisión de seguridad completa: RLS y Storage por owner/admin/agent, revocación, llamadas directas, rutas sin sesión, límites/antibot, subida de archivos, cabeceras, dependencias, secretos, registros y pruebas de abuso; implementar correcciones derivadas.
8. Preparar copias y ensayar restauración integral (base y archivos), monitorización, recuperación, rollback de aplicación y migraciones.
9. Revisión de privacidad: responsable actualizado, finalidad/base jurídica, acceso, conservación/borrado, encargados/proveedores, derechos y transparencia. Confirmar decisión del negocio/asesoría.
10. Configuración del dominio cuando comprado: DNS/Vercel/HTTPS, canonical, remitente verificado y autenticación de correo; SMTP de invitaciones separado de correo transaccional del CRM. Probar bandeja real y rebotes.
11. Pruebas E2E aisladas y prueba aceptada de todo el flujo alojado antes de abrirlo; revisión accesible con lector de pantalla y aceptación del equipo.

## Datos y decisiones que pediremos gradualmente
- Justificante fiscal actual/gestoría para confirmar denominación, NIF E31283476, forma jurídica y domicilio, ya aportados verbalmente. No volver a pedir los mismos datos como si faltasen.
- Compra: confirmar registrador, dominio adquirido y quién controla cuenta/recuperación.
- Una comparativa exportada de Feníe preferiblemente anonimizada, y criterio de lectura/coste/condiciones; imprescindible para validar extracción de ese documento concreto.
- Remitente corporativo, destino de consultas, responsable y suplente/plazo de respuesta. Nuevo número y atención/desvíos más adelante.
- Recepción presencial/horario/zona para Google Business Profile; comprobar ficha previa antes de crear otra. LinkedIn ya creado, pendiente identificar página y configurar.
- Condiciones vigentes por servicio y aprobación comercial; no reutilizar promociones caducadas.
- Conservación y textos legales; aceptación del flujo y autorización final de lanzamiento.

## Publicación progresiva
A. Comprar dominio y asegurar cuenta. B. Validar cambios en Preview. C. Conectar dominio y canales sin abrir captación hasta cumplir controles. D. Validar factura/propuesta/envío/seguimiento y accesos con pruebas acordadas. E. Aprobar versión y activar producción de forma controlada con monitorización y rollback. Cada bloque debe tener evidencia y límite conocido; no marcar el conjunto como terminado por tener dominio.

# Flujo operativo de revisión de facturas — Electricidad Lakuntza

Estado: propuesta técnica de referencia, pendiente de ensayo real contra Supabase y aprobación operativa con Javier/Kristina.

## Principio de diseño

El cliente solo debe aportar lo imprescindible para que una persona de Electricidad Lakuntza pueda estudiar una factura y contactar con quien solicita la revisión. Nunca se promete ahorro ni se realiza un cambio contractual automáticamente.

## Datos que pide el formulario

| Dato | Obligatorio | Por qué |
|---|---|---|
| Servicio (luz, gas o ambos) | Sí | Clasificación de la consulta |
| Tipo de cliente (vivienda, negocio, comunidad) | Sí | Identificar condiciones comerciales y revisión apropiada |
| Bono social eléctrico / familia numerosa (solo si incluye luz) | Sí | Evitar perjudicar al titular al proponer un cambio |
| **Nombre de la persona de contacto** | Sí | Poder dirigirse a la persona que envía la solicitud; no tiene que ser titular |
| Teléfono de contacto | Sí | Medio principal para explicar la revisión y aclarar dudas |
| Correo electrónico | No | Canal adicional si se facilita |
| Factura PDF/JPG/PNG/WebP (máx. 10 MB) | Sí | Permite revisar las condiciones reales |
| Comentarios | No | Casos especiales y preferencias |
| Confirmación de permiso y privacidad | Sí | El remitente confirma que puede facilitar la factura, incluso de otro titular |

**No pedir aparte:** titular de contrato, comercializadora, localidad, CUPS, potencia, consumo, importe, tarifa o dirección. Son datos presentes habitualmente en la factura. Si faltan o se necesita confirmar alguno, se pregunta más adelante.

**Titular y remitente distintos:** es normal, por ejemplo, en una pareja. El nombre del formulario identifica al interlocutor, no sustituye la identidad del titular en una contratación. Nadie contrata ni modifica un suministro solo por enviar una factura. El cliente debe contar con permiso si remite datos de otro titular.

## Flujo del cliente

1. Elegir luz, gas o ambos y tipo de cliente.
2. Responder la comprobación sobre bono social si solicita luz.
3. Indicar nombre de contacto y teléfono; correo opcional.
4. Adjuntar factura; comentarios opcionales.
5. Confirmar permisos de uso de datos y enviar.
6. Mostrar confirmación **solo tras guardar la solicitud y el archivo**. No indicar que hay ahorro ni que el cambio está aprobado.
7. Electricidad Lakuntza revisa y contacta; la recomendación es humana y sin obligación de contratar.

Si existe bono social eléctrico o potencial derecho relevante, informar antes de tramitar un cambio eléctrico y ofrecer una vía alternativa de consulta. No simplificar esta cautela por ahorrar un campo.

## Flujo interno del administrador

- **Nueva (new):** llega archivo privado + fila de solicitud, con marca temporal y consentimientos.
- **En revisión (reviewing):** revisar titular, suministro, CUPS, tarifa, periodo, potencia, energía, impuestos, servicios añadidos y precio efectivo por periodos. Lectura automática gratuita solo para PDF con texto; fotos o PDF escaneados requieren revisión manual o un OCR adecuado.
- **Contactado (contacted):** comunicar diagnóstico verificado, pedir datos faltantes y confirmar quién está autorizado a contratar. Registrar cuándo hubo contacto y siguiente seguimiento.
- **Convertido (converted):** registrar resultado solo con evidencia de que la contratación se completó, no por haber enviado oferta.
- **Descartado (discarded):** por no convenir cambiar, falta de respuesta, duplicado u otro motivo. Evitar perseguir leads sin valor.

Conviene registrar el resultado final de cada oportunidad, la compañía elegida, la fecha y la comisión *cuando el negocio lo confirme*; no asumir importes o tarifas.

## Condiciones de lanzamiento obligatorias

1. Supabase activo y vinculado a los entornos correctos de Vercel.
2. Bucket `invoice-files` privado. Comprobar que un visitante no puede listar, leer, descargar ni borrar archivos de otra solicitud.
3. Políticas RLS verificadas sobre `invoice_review_leads`, `invoice_ocr_results`, `invoice_lead_events`, `admin_users`, `projects` y `project_images`.
4. Usuarios autorizados y permisos reales del panel. Una sesión sin rol de administrador no puede ver ni cambiar solicitudes.
5. Protección antispam/limitación de frecuencia en el servidor y validaciones de tamaño, extensión y firma de archivo.
6. Prueba real controlada: subir archivo, confirmar fila, abrir desde panel, registrar análisis, marcar estado, enviar aviso, eliminar archivo y fila; comprobar el resultado tras cada operación.
7. Avisos de correo: confirmar dominio y destinatario de Resend, registrar fallo y disponer de seguimiento interno. Nunca adjuntar la factura a un correo automático.
8. Definir y aplicar criterio de conservación/depuración de documentación personal conforme a política de privacidad y obligaciones pertinentes.
9. Contar con textos legales revisados y contacto efectivo de la empresa.
10. No activar captación ni prometer privacidad verificada hasta superar estas pruebas.

## Limitaciones conocidas (29/10/2026)

- El proyecto Supabase referenciado por la preview es `vprczjegprkwzashxyul` y figura inactivo.
- Su reactivación fue rechazada por el límite de proyectos gratuitos activos del usuario.
- No se ha podido verificar esquema, políticas, usuarios, bucket ni notificaciones reales.
- La preview más reciente de Vercel está en estado READY; no equivale a producción validada.

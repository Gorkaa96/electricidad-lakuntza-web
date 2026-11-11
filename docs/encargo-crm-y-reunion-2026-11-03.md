# Encargo guardado y auditoría previa del CRM — 3 noviembre 2026

## Alcance y momento
Gorka pide guardar este encargo, pensar mejoras y auditar para implementarlas mañana. Hoy solo se documenta y prepara; no se implementan estos nuevos flujos ni se publica producción. Mantener rama integration/launch-prep-2026-10-29 y PR #9 en borrador. No programar envíos ni contactar a clientes.

## Petición original
«Dentro de una factura tiene que ser muy claro y directo. El cambio de estado tiene que ser algo rápido y vivo que no recargue toda la web. Que podamos añadir la comparativa que realizaremos en el CRM de Feníe, poder contactar desde aquí con nuestro cliente y enviar la comparativa o hablar sobre ella. Datos claros, fáciles de ver. Un comparador de lo actual con la comparativa nueva para ver cambios rápidamente. Y poder ver si mejoramos o no y por qué. Mejorar todo lo interno tanto en esta pantalla como en el resto.»

## Hallazgos verificados en código y pantalla actual
- app/admin/facturas/actions.js: acciones de estado terminan en redirect y revalidatePath; el flujo recarga/navega el expediente. No hay resultado estructurado para actualización local.
- components/admin/SimpleInvoiceActionPanel.jsx: teléfono y WhatsApp son enlaces. No hay envío de comparativa desde el CRM ni registro automático fiable de envío/entrega; abrir WhatsApp no demuestra que se haya enviado nada.
- El panel recomienda contactar por tipo de cliente, importe >=90 o consumo >=300. Estos umbrales no demuestran mejora comercial y deben sustituirse por un siguiente paso basado en datos pendientes/validación real.
- En las pantallas revisadas no existe una comparativa estructurada actual/propuesta ni versión de oferta Feníe adjunta.
- El detalle mezcla contacto, lectura, gestión, asignación y formulario largo. La jerarquía y las acciones rápidas deben revisarse para reducir desplazamiento y duplicación.
- La lectura PDF y el seguimiento comercial son cosas distintas. El porcentaje mide campos detectados, no exactitud ni ahorro. Fotos y PDF escaneados siguen siendo una limitación reconocida.
Esta es una auditoría funcional preliminar de las pantallas y código revisados, no una nueva certificación exhaustiva de seguridad o cumplimiento.

## Propuesta para mañana
### Ficha del expediente
Cabecera compacta con cliente, suministro, responsable, estado y siguiente acción. Barra de acciones: llamar, abrir WhatsApp, preparar correo/comparativa y registrar contacto. Resumen visible de consumo, potencia, periodo y total. Documento original accesible junto al resumen. Secciones o pestañas: Resumen, Comparativa, Actividad y Documentos; evitar duplicar el mismo dato en varias zonas.

### Estado sin recarga completa
Componente cliente con actualización local inmediata, indicador de guardado, confirmación accesible y recuperación del estado anterior si falla. Acción de servidor autenticada, RLS y comprobación de permisos en cada cambio. Bloquear dobles pulsaciones y resolver concurrencia entre agentes; no mostrar éxito antes de confirmación. Actualizar también la oportunidad enlazada y su historial. Aplicar el patrón a facturas, oportunidades y asignaciones.

### Comparativa Feníe
Añadir una propuesta realizada en el CRM oficial de Feníe: PDF privado y/o datos estructurados, fecha, referencia, versión, autor, producto y vigencia. No automatizar acceso al CRM externo ni inventar ofertas. Guardar los datos actuales contrastados y la propuesta como versiones trazables; no sobrescribir una propuesta ya enviada.

Comparación equivalente: mismo periodo y consumo, misma base fiscal y servicios comparables. Separar energía por periodo, potencia por periodo y unidad, alquiler, impuestos, cargos regulados, servicios extra y descuentos temporales. Mostrar coste actual, propuesto, diferencia en euros y porcentaje, tanto mejora como empeoramiento. Ahorro anual solo con datos anuales suficientes o supuestos explícitos; no multiplicar una factura aislada por doce como si fuese una garantía. Diferenciar coste, permanencia, garantías de precio y condiciones.

Resultado legible: mejora económica estimada / empeora / no comparable / faltan datos. Explicar qué partidas cambian y qué condiciones justifican la diferencia. Confirmación profesional antes de presentar la propuesta.

### Contacto y envío
Preparar mensaje o correo con vista previa, destinatario confirmado, documento y versión concretos. El usuario del CRM confirma cada envío. Registrar preparado/enviado/aceptado/entregado/fallido cuando el proveedor lo permita; nunca equiparar abrir un enlace con enviar. Llamadas y conversaciones: registro explícito con resumen, fecha y próximo seguimiento. Documentos siempre privados; no usar enlaces de Storage públicos ni adjuntar datos innecesarios. Revisar protección de enlaces y vencimiento/revocación antes de implementarlos.

### CRM completo
Bandeja de pendientes y seguimientos vencidos, filtros por servicio/estado/responsable, búsqueda y paginación. Responsables y próxima acción visibles. Estados y etiquetas consistentes en factura y oportunidad, cronología única sin duplicar contactos. Formularios cortos, guardado visible y conservación de cambios ante errores. Estados vacíos y fallos útiles, uso móvil y teclado. No inventar métricas ni inferir oportunidades por tamaño de factura.

## Orden y validación
1. Ficha clara y cambios de estado fluidos con permisos.
2. Comparativa actual/propuesta, cálculos, adjunto privado y versiones.
3. Contacto, preparación/envío confirmado y trazabilidad.
4. Seguimientos y extensión del patrón al resto del CRM.
Probar errores, dobles clics, concurrencia, asignación/revocación, sincronización factura/oportunidad, unidades/precios por periodo, descuentos, datos incompletos, resultados negativos, documentos privados, fallos de correo y accesibilidad. Migraciones y pruebas aisladas antes de aplicar cambios alojados. Ninguna clave o factura real en repo/CI.

## Reunión con Javier y Kristina
- Denominación legal exacta, NIF y domicilio; validar «sociedad irregular» con asesoría.
- Confirmar teléfono, correo, dominio deseado y quién controla DNS/cuentas.
- Quién atiende cada servicio, suplente, zona y plazo de respuesta.
- Ejemplo de comparativa exportable del CRM Feníe, preferiblemente anonimizado: PDF/Excel, campos, referencia, vigencia y cómo explican el resultado.
- Criterio real para considerar una propuesta mejor; permanencia, descuentos, servicios extra, productos y comisiones del canal.
- Canal para enviar propuestas (WhatsApp/correo), remitente oficial y quién autoriza los envíos.
- Alarmas: campaña vigente, precio, permanencia/penalizaciones, cobertura, instalación y posventa. No usar como vigente la promoción de cerradura de octubre sin confirmar.
- Cargadores propios: zona, visita, presupuesto, alcance, garantías y posventa.
- Asesoría propia: alcance, entregable y coste.
- Aprobación de diseño, textos y explicación de papeles: Feníe en luz/gas y comercialización de alarmas; Movistar Prosegur instala/presta alarmas; Lakuntza instala cargadores y presta asesoría.
- Titular y asesoría: privacidad, conservación de facturas/propuestas, atención de derechos y textos legales.
- Acordar responsables de cuentas, accesos, copias y recuperación. La configuración técnica que administra Gorka no se debe trasladar como trabajo pendiente de Javier/Kristina.

## Pendientes previos que siguen abiertos
SMTP corporativo y entrega real de invitaciones; dominio remitente y entrega de avisos a bandeja; OCR de imágenes/escaneados; copias/restauración integral; MFA del equipo; revisión con lector de pantalla; aceptación de uso y autorización explícita de lanzamiento. No confundir la Preview funcional con producción definitiva.

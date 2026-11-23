# Decisiones y requisitos — 5 de noviembre de 2026

El usuario está reunido con Javier y Kristina. Prioridad inmediata: compra del dominio. Telefonía, correo y configuración posterior se harán después. Equipo de dos personas: evitar complejidad y costes innecesarios.

## Dominio

Propuesta: electricidadlakuntza.es principal, electricidadlakuntza.com defensivo/redirigido. Ambos disponibles en consulta Namecheap del 5/11/2026, sin reserva ni compra. Propuesta de proveedor OVHcloud por oferta publicada para España, precios finales y renovación a revisar en carrito. Cuenta controlada por el negocio, correo externo existente o Gmail dedicado a gestión creado/controlado por los titulares; no cuenta personal de Gorka. Titular registral y facturación deben corresponder al negocio con datos fiscales exactos; contacto representante real. No inventar una forma jurídica ni seleccionar SL por comodidad. Recuperación y doble factor bajo control de los titulares. Comprar solo dominios; hosting ya es Vercel, correo se decide después. Conectar DNS no equivale a aprobar lanzamiento público.

## Telefonía

Un número de empresa, una cuenta WhatsApp Business y dispositivos vinculados para ambos. No necesitan dos líneas para usar el chat. Las llamadas de telefonía son una decisión separada: un número no hace sonar automáticamente dos móviles; valorar desvíos/centralita solo si lo requieren. Sin integración API de WhatsApp en este bloque.

## Requisitos confirmados para desarrollar

- Correo obligatorio para clientes que suben facturas de luz/gas, tanto formulario como validación del servidor. No extender automáticamente a todos los servicios. Pendiente implementar y probar. Registros anteriores sin correo requieren completarlo antes del envío.
- Conservar factura original privada del cliente y comparativa generada en el CRM oficial de Feníe, descargada y subida por el agente. No sustituir ninguno por el otro.
- Comparativa versionada, asociada al cliente/oportunidad/factura, con autor, fecha, referencia, condiciones y validación humana.
- Extraer datos del documento de propuesta y de la factura; comparar periodos, consumo, potencia, impuestos, extras, descuentos y condiciones sobre bases equivalentes. Documentos escaneados necesitan OCR/IDP adicional: la lectura actual de PDF con texto no lo cubre.
- Mostrar ahorro o sobrecoste y motivos; si faltan datos, indicar que no es comparable. La extracción no acredita por sí misma que la oferta sea mejor.
- Preparar correo desde el CRM con plantilla estándar, destinatario revisable y adjunto exacto de la comparativa validada. Confirmación explícita del agente antes de enviar; historial de versión y estado real del envío, errores y reintentos sin duplicados.
- Correo corporativo autenticado y ruta de respuesta pendiente de configurar después del dominio; reenvío al Yahoo no basta para enviar como dominio. No activar envíos reales a clientes en este bloque.
- CRM profesional adaptado a dos personas: estados rápidos sin recarga, responsables, próximos pasos, contacto e historial claro. Mantener planificación previa docs/encargo-crm-y-reunion-2026-11-03.md.

## Puertas de publicación y pendientes claros

Estos requisitos están registrados, no implementados ni certificados por este documento. Revisar y aplicar mejoras con evidencia en Preview/PR draft antes del lanzamiento progresivo. Auditar web, CRM, permisos owner/admin/agent, RLS y Storage privado, lectura automática y precisión, adjuntos, envío y errores, formularios, accesibilidad móvil/teclado, seguridad, privacidad, dependencias, recuperación y rollback.

Pendiente externo: confirmar datos fiscales documentalmente y forma jurídica; comprar dominio y disponer de acceso DNS; correo remitente/recepción y SMTP de invitaciones; nuevo número; muestra anonimizada real de propuesta Feníe y sus condiciones; horario/zona y atención presencial para Google; aprobaciones de textos y lanzamiento. Pendiente técnico: requisitos CRM arriba, OCR de escaneados, pruebas reales controladas de punta a punta, restauración completa de respaldo, MFA y validación final accesible. No presentar todo como terminado. No producir mensajes reales ni desplegar producción sin aprobación de ese paso.

# Electricidad Lakuntza — cierre de diseño, CRM y pendientes

Fecha de revisión: 03/11/2026. Entorno de trabajo: rama `integration/launch-prep-2026-10-29`, PR #9 **DRAFT**. No fusionar ni promocionar a producción sin E2E, seguridad y conformidad comercial.

## Decisiones cerradas

1. Orientación de la web: luz, gas, alarmas, cargadores eléctricos y asesoría energética. No captación de instalaciones generales.
2. Instalaciones, telecomunicaciones y galería de trabajos históricos ocultas mediante configuración; el código, las fichas y las fotos se conservan para reactivación futura.
3. Claridad sobre Feníe Energía: marca visible en portada, franja de colaboración, navegación y pie. Se explica que Feníe es la comercializadora y Electricidad Lakuntza es el agente que asesora y acompaña.
4. Enlaces oficiales: `https://www.fenieenergia.es/es` y `https://www.fenieenergia.es/es/sobre-fenie/historia`. Se abren aparte, evitando confundir al usuario sobre el sitio en el que está.
5. Precios Feníe publicados solo como consulta interna, no como ofertas firmes en el sitio web. Cargadores, alarmas y promociones requieren confirmación individual.

## CRM — primera fase implementada (solo interno, con pruebas técnicas)

- Migración de Supabase `commercial_crm_v1` aplicada a `yvrjrvropgouvzltwwvm`. Tablas `commercial_leads` y `commercial_lead_events`, ambas con RLS.
- Panel `/admin/oportunidades`: lista con filtros por servicio y estado. Alta manual `/admin/oportunidades/nueva`; ficha de oportunidad con estado, notas, próxima fecha de seguimiento, asignación a agente e historial de cambios.
- Cinco categorías: `luz`, `gas`, `alarmas`, `cargadores`, `asesoria`. Estados: `new`, `reviewing`, `contacted`, `converted`, `discarded`.
- Se reutilizan los permisos `leads.*` existentes. El agente ve solo expedientes asignados y puede cambiar estado, notas y seguimiento, no identidad ni asignación. El propietario conserva control completo.
- Pruebas transaccionales con `ROLLBACK`: propietario creó/editó/eliminó oportunidad ficticia y se verificó creación de eventos; un agente simulado vio 1 de 2 expedientes, actualizó el asignado y no pudo modificar uno ajeno ni el nombre de contacto.
- Base de datos tras pruebas: 0 oportunidades comerciales, 0 eventos, 0 facturas; único propietario sin cambios.
- **Limitación de fase:** no se han integrado aún las facturas recibidas con esta tabla; tampoco existe captación pública del nuevo CRM. No usar como CRM plenamente unificado hasta cerrar esa sincronización.
- **Falta E2E de navegador autenticado:** probar formulario real, filtros, edición, asignación, visibilidad, cierre y borrado. Las pruebas SQL no sustituyen estos recorridos.

## P0 — impedimentos antes de aceptar solicitudes reales

| Prioridad | Pendiente | Responsable / dependencia | Criterio de cierre |
|---|---|---|---|
| Crítica | Flujo de facturas seguro | Técnico; claves de Preview y política de datos | Subida de PDF sintético, acceso privado, OCR/manual, estado, borrado completo y aviso probados E2E |
| Crítica | Protección contra abuso | Técnico | Rate limit/anti-bot probado; nunca activar `INVOICE_INTAKE_ENABLED=true` antes |
| Crítica | Privacidad y conservación | Titulares de Electricidad Lakuntza + revisión RGPD | Responsable, fines, base jurídica, conservación, derechos y acceso administrativo revisados |
| Alta | Invitaciones y roles | Propietario: SMTP, URLs de Auth, secreto servidor SOLO Preview | Agente recibe enlace, activa cuenta, ve únicamente lo asignado, se puede revocar y desactivar |
| Alta | CRM unificado sin duplicados | Técnico | Captación por los cinco servicios, enlace correcto con facturas y trazabilidad por origen |
| Alta | Datos de empresa y canales | Javier/Kristina | Teléfono, correo corporativo, responsable legal y atención a leads confirmados |

## P1 — antes de lanzamiento de producción

| Pendiente | Cierre |
|---|---|
| Catálogo comercial con Javier | Lista completa de productos Feníe habilitados para el agente, tarifarios oficiales, fechas, condiciones, promociones, comisiones, recurrencia y cancelaciones |
| Alarmas | Elegibilidad, proveedor real, instalación, cuota, permanencia, posventa y alcance del agente |
| Cargadores | Cobertura, quién presupuesta/instala/legaliza, coste y margen, garantía y responsabilidad |
| Asesoría energética | Definir qué análisis ofrecemos realmente, quién lo realiza, alcance gratuito/de pago y límites |
| Revisión responsive, accesibilidad y QA | Pantallas móvil/escritorio, navegación, contraste, formularios y pruebas reales de sesiones/roles |
| Dominio, SEO y canales | Dominio corporativo, canonical, metadatos, robots en lanzamiento, LinkedIn y correo verificado |
| Métricas comerciales | Seguimiento de origen, conversiones, tiempos de contacto, rendimiento por servicio y agente |
| Release | Revisar y aprobar PR #9, migraciones versionadas, despliegue controlado y rollback documentado |

## P2 — después del lanzamiento

- Alertas y recordatorios de seguimiento, sin generar spam automático.
- Registro de contrataciones confirmadas y comisiones reales, evitando estimaciones.
- Automatización de mantenimiento y depuración de expedientes según el periodo de conservación aprobado.
- Recuperar instalaciones históricas solo si el negocio decide retomar esa actividad y existe capacidad operativa.
- Plan de continuidad del servicio tras la jubilación de Javier, evitando dependencia de una sola persona.

## Orden de ejecución recomendado

1. Validar la nueva presentación de Feníe y comprobar responsive, una sola vez.
2. Probar en navegador real el CRM interno (alta, seguimiento y permisos).
3. Resolver invitaciones de agentes (Secret de servidor, redirecciones, SMTP).
4. Integrar entradas de luz/gas, alarmas, cargadores y asesoría con `commercial_leads`, sin duplicar facturas; protección antispam y RGPD.
5. Ejecutar test E2E con datos sintéticos, comprobar borrados y avisos.
6. Confirmar precios, condiciones, reparto operativo y riesgos con Javier.
7. Sólo entonces decidir dominio y lanzamiento, levantar bloqueo de robots, revisar LinkedIn y fusionar el PR.

**No introducir datos de clientes reales en las pruebas**. Usar únicamente expedientes sintéticos y mantener el formulario público de facturas desactivado.

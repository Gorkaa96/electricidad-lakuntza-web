# Auditoría y plan de cierre — Electricidad Lakuntza

Fecha: **03/11/2026** · alcance: PR #9 (DRAFT), rama `integration/launch-prep-2026-10-29` de `Gorkaa96/electricidad-lakuntza-web`. Supabase `yvrjrvropgouvzltwwvm`. Vercel `prj_CNVoTiZ9IcAxsRdWhpRYN9iqUqeZ`.

**Decisión de despliegue:** mantener **Preview**, no fusionar en `main`, no activar `INVOICE_INTAKE_ENABLED` ni `PUBLIC_COMMERCIAL_INTAKE_ENABLED` hasta superar las pruebas pendientes y revisión legal/comercial.

## Modelo de servicios — definitivo

| Servicio | Electricidad Lakuntza | Terceros |
|---|---|---|
| Luz y gas | Agente de Feníe Energía; compara opciones del portal profesional de Feníe y acompaña contratación | Feníe Energía es la comercializadora que formaliza los contratos |
| Alarmas | Comercial y atención inicial a través de Feníe | Movistar Prosegur instala y presta seguridad |
| Cargadores eléctricos | Estudia, presupuesta e instala directamente | No presentar como servicio instalado por Feníe |
| Asesoría energética | Revisión y asesoramiento realizados directamente | Si hay cambio de tarifa, únicamente se contrastan propuestas del catálogo Feníe; no comparación de todo el mercado |

La portada presenta 4 grupos en orden: **Luz y gas → Alarmas → Cargadores eléctricos → Asesoría energética**. Catálogo de 5 servicios individualizados. Se ha eliminado el lenguaje explicativo técnico para visitantes y se ofrecen enlaces a la web de Feníe.

Instalaciones tradicionales, telecomunicaciones y galería histórica ocultas (404), sin borrar código, datos ni funcionalidades administrativas. No se garantizan precios ni promociones sin confirmar con Javier.

## Cambios implementados y verificados

### Base de datos y CRM
- Tablas `commercial_leads` y `commercial_lead_events` con RLS habilitada.
- El panel `/admin/oportunidades` dispone de alta manual, filtros, ficha, estado, seguimiento, asignación y auditoría.
- Categorización de `luz_gas` añadida cuando una factura incluye ambos suministros.
- `invoice_review_leads` crea automáticamente una oportunidad vinculada. Estado y agente sincronizados en ambos sentidos; al eliminar la factura se elimina su oportunidad y eventos relacionados.
- El panel impide eliminar una oportunidad vinculada a factura desde la sección incorrecta.
- Pruebas SQL con transacciones reversibles: alta, actualización, cambios bidireccionales y cascada completados, sin datos de prueba persistentes.
- Un agente simulado solo ve/edita oportunidades asignadas, no puede modificar la identidad del cliente ni expedientes ajenos.
- Índices de FK pendientes creados y aplicados.
- Queda **una cuenta propietaria** con 8 permisos, ningún agente añadido, y un borrador de trabajo histórico conservado.

### Formularios y seguridad
- Ambos envíos públicos (facturas y nuevas consultas) tienen bandera independiente, desactivada por defecto.
- **Fail-closed:** deben existir proyecto Supabase, clave privada solo servidor, Cloudflare Turnstile (sitekey + secret), secreto de HMAC para cuota, Resend y destinatario interno.
- Verificación Turnstile siempre desde servidor, comprobando `success`, `action`, hostname y tiempo máximo de respuesta.
- Limitación SQL atómica de **4 intentos por identificador/hora**, con HMAC de contacto y, cuando está disponible, IP. Contadores depurados tras 48 h. Función RPC ejecutable exclusivamente por `service_role`.
- El PDF o imagen exige tipo permitido, firma real del contenido, máximo 10 MB, consentimiento; bucket `invoice-files` privado (10 MB).
- Confirmación de recepción protegida con cookie firmada breve: abrir la URL de confirmación sin enviar datos no muestra un éxito falso.
- Avisos de correo no contienen la factura ni identificadores personales: abren el expediente en el administrador, usando un origen HTTPS configurable.
- `/consulta` queda preparado para registrar los cinco servicios en CRM cuando pase el test y se active la bandera; hasta entonces ofrece teléfono, WhatsApp y email. La portada solo muestra el botón de envío web cuando está preparado.
- Formulario auxiliar antiguo corregido: no ofrece captación de instalaciones tradicionales.

### Verificaciones
- GitHub CI ejecuta `npm test` y `npm run build`; **comprobar el último commit antes de fusionar**.
- Vercel Preview: home, servicios, páginas individuales, formularios y páginas legales HTTP 200. Rutas de instalaciones/galería HTTP 404. Administrador sin sesión muestra login.
- El JavaScript de acceso en Preview apunta al **Supabase nuevo** y no contiene la referencia al proyecto eliminado.
- Seguridad Supabase: 8 tablas públicas con RLS; acceso `anon` denegado a `admin_users`, facturas y oportunidades; únicamente `projects` y `project_images` tienen permiso de SELECT público, condicionado por RLS a trabajos publicados. Bucket de facturas privado, bucket de imágenes de portfolio público (vacío).
- Las dos tablas de captación y el bucket de facturas permanecen sin expedientes reales de prueba.
- Advisors: una advertencia de Auth sobre comprobación de contraseñas filtradas no habilitada. Aviso INFO de RLS sin políticas en `app_private.public_intake_quota` **esperado**: es tabla privada con acceso deliberadamente restringido. Avisos de índices no usados en base casi vacía no requieren borrarlos.

## Pendientes críticos (P0) — bloquean el lanzamiento

1. **Pruebas E2E desde navegador autenticado** en Preview: crear/editar/asignar/eliminar oportunidades, alta de agente real de prueba, revocación, roles/impersonación, PDF sintético, acceso privado, correo y borrado completo de Storage. SQL y HTTP no bastan.
2. **Configurar variables externas** por propietario desde Vercel: Turnstile real con host estable, Resend con remitente verificado, SMTP de Supabase Auth, `ADMIN_PANEL_BASE_URL`, `ADMIN_INVITATION_BASE_URL`, URLs allowlist de Supabase y claves de servidor. La integración de Vercel sigue devolviendo 403 al listar/editar envs.
3. **RGPD/LSSI**: identificar al titular legal real (autónomo/s), NIF/datos obligatorios, contratos de tratamiento con proveedores, bases jurídicas, conservación exacta, borrado verificado, transferencias internacionales y política de cookies/tracking. Los textos actuales no constituyen dictamen legal.
4. **Control de operación y avisos**: definir responsable diario de leads, tiempos máximos de respuesta, proceso cuando fallen Resend/SMTP, y procedimiento ante incidencia de seguridad.
5. **Criterio de backup/recuperación** para facturas y CRM, teniendo en cuenta las características de Supabase Free y la criticidad de los datos personales.
6. **Verificación de la producción actual**: el despliegue `main` anterior (`9993bb2b...`) ha generado un error `Error loading projects from Supabase: fetch failed` al acceder a `/`. No confundir este error histórico de producción con la nueva Preview sana. Planificar sustitución o hotfix según el impacto comprobado, sin lanzar el PR completo de forma precipitada.

## Pendientes altos (P1) — antes de la campaña comercial

1. **Javier y Kristina:** validar disponibilidad de productos, tarifarios del canal agente, comisiones, recurrencia, cobertura y permanencia; responsabilidad contractual, garantías y posventa de alarmas y cargadores, y alcance/coste de la asesoría propia.
2. **QA UX final:** responsive real en móvil/tablet/escritorio, accesibilidad de formularios, lectores de pantalla, navegación por teclado, contraste y enlaces de Feníe.
3. **Dominio y correo corporativo:** resolver, verificar y configurar HTTPS, metadatos, URLs canónicas, sitemap, robots e indexación al lanzar.
4. **Admin de usuarios:** SMTP de Auth, flujo de invitación y contraseña, mínimos privilegios, MFA si está disponible, bloqueo de cuentas y auditoría de accesos.
5. **CRM operativo:** cada WhatsApp/llamada recibida debe introducirse manualmente hasta que exista integración autorizada con WhatsApp Business; no afirmar captura automática de mensajes externos.
6. **Plan de métricas:** solicitudes por canal/servicio, contacto en 24 h, contratos firmados, costes y comisiones efectivas, responsable de cada tarea.

## Pendientes poslanzamiento (P2)
- Recordatorios automáticos no intrusivos de seguimiento.
- Métricas y reporting de agentes.
- Registros económicos de comisiones y valor del cliente.
- Revisión de continuidad de negocio conforme a la jubilación de Javier y Kristina.
- Reactivación deliberada y controlada de instalaciones tradicionales solo si vuelve a existir capacidad.

## Próxima secuencia

1. Auditoría visual y funcional real en navegador autenticado con Work o Codex cloud.
2. Configuración externa y prueba de SMTP, Turnstile y Resend con cuentas autorizadas; nunca compartir secretos.
3. Pruebas de aceptación contra datos y ficheros **sintéticos**; revisión legal y operativa de Javier/Kristina.
4. Activar una bandera de captación cada vez en Preview, monitorizar fallos; únicamente después decidir merge y despliegue productivo.
5. Aprobación final explícita del propietario antes de fusionar.

La gestión del código es 100 % cloud: GitHub para commits/PR, Supabase para SQL/RLS y Vercel para compilación y Preview. No requiere repositorio local de un único portátil.

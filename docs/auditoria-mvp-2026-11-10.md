# Electricidad Lakuntza — Auditoría y cierre de MVP

Revisión: 10 de noviembre de 2026. Versión de preparación: PR #9 (rama integration/launch-prep-2026-10-29).

## Objetivo y alcance
Publicar una **versión piloto para comprobación interna** en los dominios finales y, después de aprobar legal/seguridad/comercial, activar captación e indexación. Los dominios son públicos incluso en modo piloto: **noindex no es control de acceso**. Hasta cierre de P0 comercial, no aceptar datos ni facturas de clientes reales.

### Lo que ya está implantado
- Web pública: luz, gas, alarmas, cargadores y asesoría; otras instalaciones y galería de trabajos ocultas.
- Portal interno: Inicio, Consultas, Facturas y Usuarios. Rol owner/admin/agente, asignación y cambios con RLS y almacenamiento privado.
- Feníe: carga de propuestas PDF, versiones, comparador y validación humana antes de comunicar el resultado.
- Envío a clientes: borrador estándar y descarga de PDF. **No** envía automáticamente desde Yahoo.
- Cloudflare: widget Turnstile para dominio oficial y alias estable de Preview, verificación servidor por hostname/acción, rate limit por HMAC. El error 110200 significa hostname no autorizado.
- Corrección: Preview efímera de esta rama redirige los formularios al alias estable para evitar errores 110200 en cada despliegue.
- Permiso projects.manage: oculto en las nuevas invitaciones y excluido de los valores predeterminados de administrador; registros y ACL heredados conservados.
- Cookies: solo técnicas para sesión/recibo; política de cookies actualizada; sin analítica publicitaria en la web pública.
- Tests: Playwright responsive/accesibilidad, npm audit y CI de backend aislado. Siempre verificar el último SHA en GitHub antes de lanzar.

## P0 — Requisitos antes de usar públicamente la web para captar clientes
| Bloqueo | Criterio de cierre | Responsable |
|---|---|---|
| Identificación jurídica | Documentación del titular emisor y NIF correcto revisados con asesoría; aviso legal y privacidad definitivos | Propiedad/asesoría |
| Recepción y datos personales | Subida real de factura **sintética** y solicitud comercial; Turnstile real, RLS, OCR, cuotas, avisos, borrado completo | Técnico/propiedad |
| Recuperación | Copia verificable de base, Auth/config y PDFs de Storage; restauración ensayada y procedimiento | Técnico |
| Acceso propietario | Login desde admin.electricidadlakuntza.com, roles, cambio de sesión, MFA si está disponible | Técnico/propiedad |
| Alojamiento comercial | Migrar equipo Vercel Hobby a plan que permita uso comercial antes de captar clientes | Propiedad |
| Puesta en producción | CI verde, verificar DNS-only/SSL, web y CRM, robots y controles, rollback probado | Técnico |

## Piloto de pruebas en el dominio oficial
- Producción se puede desplegar con **PUBLIC_LAUNCH_APPROVED distinto de true**, que bloquea tanto la indexación como la recepción de solicitudes y facturas. La web comercial sigue visible y el CRM puede usarse para comprobar navegación y login.
- Mantener los formularios activos **solo en Preview protegida** para realizar pruebas con datos ficticios.
- Para lanzamiento comercial, configurar PUBLIC_LAUNCH_APPROVED=true, flags de cada formulario y variables de Cloudflare/Resend, desplegar, verificar pruebas desde hostname oficial y entonces indexar.
- La prueba real de Turnstile debe hacerse desde hostname autorizado: electricidadlakuntza.com/www o el alias estable de rama, no URL efímera de cada despliegue.
- Antes de publicar guardar ID del despliegue anterior de producción. Referencia previa (10/11/2026): dpl_4drQhhLxhtx6tfcfytuCgm3QcFiu. Solo revertir aliases/despliegue si es compatible con la configuración vigente; nunca restaurar secretos antiguos.

## P1 — Mejoras de UX/funcionalidad tras el piloto, antes del lanzamiento completo
1. Verificar que la comparativa Feníe detecta también condiciones no homogéneas (periodo, kWh, servicios extras, impuestos, descuentos, permanencia) sin prometer ahorro automático.
2. Probar que una factura escaneada se identifica como revisión manual y no genera importe inventado.
3. Auditar textos y CTA en móvil, tablet y escritorio con usuarios reales. Especial foco en dos adultos de ~60 años y tareas diarias.
4. Confirmar que las listas de consultas y facturas tienen filtros y seguimiento coherentes; no duplicar información comercial.
5. Aclarar si corresponde pedir teléfono **y** correo en revisión de facturas; consentimiento, privacidad y errores claros.
6. Afinar SEO, sitemap y páginas legales solo tras aprobación e indexación explícita.
7. Validar promociones de alarmas en la oferta oficial de Feníe y consultar precio y permanencia sin inventar cifras.

## P2 — Después del MVP
- Alta de dos usuarios del equipo desde CRM, uno por persona, sin compartir credenciales; SMTP/invitaciones cuando se acuerde proveedor.
- Correo corporativo y telefonía; envío real automático desde el remitente autorizado con adjuntos y trazabilidad.
- Supervisión de tiempos de respuesta, analítica mínima respetuosa con privacidad, automatismos de seguimiento.
- Migración gradual de titularidad técnica a cuentas corporativas (GitHub, Vercel, Supabase y widget Turnstile, hoy en cuenta Cloudflare distinta).
- Módulo Trabajos conservado sin exposición en navegación/invitaciones hasta una decisión posterior.

## Pruebas manuales para dar el MVP por aceptado
- Abrir www.electricidadlakuntza.com desde incógnito móvil/escritorio y revisar 5 servicios, navegación y CTA.
- Abrir admin.electricidadlakuntza.com, login, Inicio, Consultas, Facturas, Usuarios y cierre de sesión.
- Preview: subir 01_factura_luz_hogar.pdf, verificar importe/consumo, añadir 05_propuesta_fenie_mejora_luz_01.pdf, revisar comparabilidad y generar borrador de email. Repetir con factura gas, escaneada y propuesta más cara.
- Crear/editar una oportunidad ficticia y verificar filtros, rol, cambios, cierre y eliminación de PDF y metadatos.
- Comprobar que en **producción piloto no aparecen formularios capaces de registrar datos**, y que robots bloquea indexación.
- Consultar GitHub Actions y Vercel: no dar por bueno el último commit hasta tener CI verde y deployment READY.

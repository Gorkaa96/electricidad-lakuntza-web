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


## Publicación piloto verificada el 10/11/2026
- Producción nueva: `dpl_HfSMSpiNLjrSNfUcuSQ86HzFRUoM`, commit `4b397b937fc68417031d37041220617c7b3aa41f`, estado READY.
- Dominios `www.electricidadlakuntza.com` y `admin.electricidadlakuntza.com` apuntan al nuevo despliegue. Comprobación HTTP 200 de portada, login, consultas y páginas legales.
- Recepción en producción: se comprobó que la revisión de facturas no presenta formulario para enviar datos; `robots.txt` contiene `Disallow: /`; la portada sigue con noindex.
- Alias estable de Preview `electricidad-lakuntza-git-c5cfe9-gorkahernandez6-9437s-projects.vercel.app` reasignado al despliegue de Preview `dpl_883Emn4E7tcLgtLdqxsjsKtSmxvr`, después de que la publicación de producción lo reasignase temporalmente. El formulario ficticio permanece visible en esa Preview.
- Cloudflare DNS: registros A/CNAME de raíz, www y admin en `proxied:false`. Los tres registros estaban en proxy naranja y se corrigieron a DNS-only.
- Rollback de referencia: despliegue anterior `dpl_4drQhhLxhtx6tfcfytuCgm3QcFiu`; verificar siempre compatibilidad de las variables actuales y mantener el circuito de datos bloqueado.
- No se ha comprobado Turnstile con un navegador humano real después de cambiar dominios; prueba manual obligatoria antes de aceptar el flujo como resuelto.
- **Nota de seguridad:** noindex no restringe acceso; es una web piloto técnicamente accesible. Mantener el control de formularios y no usar datos reales todavía.

## Verificación funcional comunicada por propietario — 10/11/2026
- **P0 SUPERADO EN PREVIEW (comprobación manual del propietario):** Turnstile permite completar la comprobación de seguridad y enviar facturas ficticias.
- **P0 SUPERADO EN PREVIEW (comprobación manual del propietario):** circuito factura → OCR → comparativa Feníe → correo preparado → eliminación.
- **Alcance:** validación de la Preview protegida, **no** validación de captación en producción. El formulario público continúa deshabilitado hasta aprobación de lanzamiento y cierre de los P0 de seguridad, respaldo, titularidad legal y alojamiento.
- **Siguiente P0:** respaldo verificable de base de datos, ficheros privados y procedimiento de restauración, sin borrar datos reales.


## Respaldo y seguridad — inspección del 10/11/2026
- Protocolo de copia y restauración preparado en `docs/backup-recuperacion-crm.md`.
- Supabase Free: NO hay backup diario gestionado. DB 12 MB; bucket privado de facturas 2 objetos (~90 KB) con 0 archivos huérfanos identificados. No se descargaron datos personales ni archivos.
- Auth: 1 usuario de equipo activo; 0 factores MFA verificados. Seguridad: leaked password protection desactivado. No se alteraron sesiones ni roles.
- **P0 respaldo permanece abierto**: falta acordar almacenamiento cifrado externo, generar las copias de base y PDF, y demostrar restauración en destino aislado. No marcar «Hecho» solo por disponer de instrucciones.


## Decisión de respaldo — 11/11/2026
- El propietario ha elegido **sin nuevas suscripciones**: alternativa gratuita local con exportación de Supabase Free y respaldo cifrado externo de facturas.
- Se ha añadido el script `scripts/backup-crm-windows.ps1` y el procedimiento de Windows al documento `docs/backup-recuperacion-crm.md`.
- **No se ha ejecutado todavía** en el PC del propietario, ni se han copiado los PDF ni creado destino externo, ni se ha probado restauración; conservar el bloqueo de recuperación ABIERTO.
- Próxima acción del propietario: instalar/confirmar Supabase CLI + Docker + 7-Zip, vincular su clon local al proyecto y descargar el contenido actual del bucket privado con su estructura. No revelar contraseñas ni subir copias al repositorio.

# Auditoría de cierre en Work — 3 de noviembre de 2026

## Dictamen
**NO APTO para lanzar captación pública ni fusionar a producción.** Se han implementado y comprobado correcciones adicionales en la rama `integration/launch-prep-2026-10-29`, PR #9 draft. Hay controles técnicos aprobados y bloqueos externos concretos. No se presenta como E2E completo ni como certificación de cumplimiento RGPD/WCAG.

Código y pruebas gestionados mediante GitHub; SQL mediante Supabase; compilaciones Preview mediante Vercel. No se ha instalado un checkout local ni solicitado archivos/claves al usuario. Únicamente se ha leído el PDF ya adjunto a «Auditoria» y recuperado un artefacto de dependencias generado en GitHub.

## Implementación realizada antes del cierre
1. Metadatos Open Graph corregidos: ya no atribuyen los cinco servicios a Feníe. El catálogo y la explicación comercial nombran el CRM oficial de Feníe.
2. Eliminado el enlace al catálogo de cargadores de Feníe desde la explicación de la instalación propia. Continúan los enlaces generales de Feníe.
3. Teléfono validado por número real de dígitos; se rechazan cadenas de signos. Una misma numeración española con formato nacional, +34, 0034, espacios o guiones comparte cuota HMAC. Validador común para consultas, facturas y alta manual.
4. Fecha y versión del aviso de privacidad aceptado registradas en ambos flujos web. Sin rellenar retroactivamente datos de aceptación inexistentes.
5. Estado de notificación persistente pending/accepted/failed, visible en el CRM y ficha de factura. Se sincroniza desde la factura a su oportunidad. accepted = el proveedor aceptó el envío; **no confirma entrega**.
6. Descargas privadas mediante ruta autenticada en cada petición, RLS y Storage con la sesión del usuario; sin service role ni enlaces firmados emitidos por la ficha. Respuesta sin caché y descarga como adjunto.
7. Renovación de cookies de sesión en middleware de Next.js 15 para el área admin; autorización central y RLS conservadas. Respuestas privadas sin caché.
8. Extracción de precios con punto decimal corregida. No se clasifica automáticamente una factura como viable/no viable según importe o consumo. La decisión exige revisión humana y comparación profesional.
9. Guardado de resultados OCR comprueba errores; un redirect de Next ya no es capturado como error del PDF.
10. Roles desconocidos y permisos inexistentes fallan cerrados. La base ya restringía los roles válidos.
11. Dependencia PostCSS vulnerable detectada por el nuevo control de CI y corregida a 8.5.32, incluida la copia transitiva de Next, sin cambiar de versión mayor de Next. Versiones directas exactas y package-lock.json generado en GitHub; CI usa npm ci.
12. Acciones de CI fijadas por SHA y checkout sin credenciales persistentes. Control npm audit de producción bloquea vulnerabilidades altas; no se ocultan sus fallos.
13. Textos de privacidad/cookies actualizados sobre proveedores actuales, confirmación técnica breve, aceptación registrada y cuotas seudonimizadas. Falta validación del titular y de las condiciones jurídicas reales.

Migraciones aditivas aplicadas: `intake_traceability_v1`, `sync_intake_traceability_v1`. SQL conservado en `supabase/`. No se han activado banderas ni creado usuarios permanentes de prueba.

## Modelo comercial verificado
| Servicio | Papel de Electricidad Lakuntza | Prestación/contratación |
|---|---|---|
| Luz | Agente; compara situación actual con ofertas del CRM oficial Feníe | Contrato con Feníe Energía |
| Gas | Agente; comparación en CRM oficial Feníe | Contrato con Feníe Energía |
| Alarmas | Comercialización mediante Feníe | Movistar Prosegur instala y presta servicio |
| Cargadores | Estudia, presupuesta e instala directamente | Electricidad Lakuntza |
| Asesoría | Presta directamente el asesoramiento | Electricidad Lakuntza |

La portada mantiene cuatro grupos con idéntico tratamiento: Luz y gas, Alarmas, Cargadores, Asesoría. Luz y gas se diferencian en el catálogo y formularios. Instalaciones, telecomunicaciones y portfolio históricos ocultos, con código conservado. El CRM interno organiza oportunidades; no compara tarifas ni sustituye el CRM Feníe. WhatsApp/llamadas requieren registro manual; no existe captura automática de esos mensajes.

## Evidencia técnica de esta sesión
- CI de la corrección de PostCSS: [ejecución 144](https://github.com/Gorkaa96/electricidad-lakuntza-web/actions/runs/41622853995), 0 vulnerabilidades de producción, 24/24 tests y build aprobados.
- Dependencias bloqueadas y descarga autenticada: [ejecución 145](https://github.com/Gorkaa96/electricidad-lakuntza-web/actions/runs/41623288469) aprobada con npm ci, audit, tests y build.
- Middleware de renovación de sesión: [ejecución 146](https://github.com/Gorkaa96/electricidad-lakuntza-web/actions/runs/41623518416) aprobada con audit, tests y build. La renovación con sesión real sigue pendiente.
- HEAD documental 472dfa5: [ejecución 147](https://github.com/Gorkaa96/electricidad-lakuntza-web/actions/runs/41623841116) aprobada y Preview READY. Esta revisión documental posterior aclara la procedencia del 401 observado.
- La ejecución 143 falló al descubrir PostCSS; se corrigió, no se omitió el control. Consultar siempre el check del HEAD final del PR.
- Prueba SQL reproducible: `tests/sql/security-regression.sql`, ejecutada con BEGIN/ROLLBACK contra el proyecto indicado, sin contraseñas ni sesiones de usuario creadas.
- PASS: owner con permisos; admin limitado sin delete/users.manage; agente solo ve su factura/oportunidad asignada; no puede cambiar identidad, aceptación ni asignación; no puede escalar rol.
- PASS: desactivación del agente elimina su acceso SQL usando las mismas claims; no depende de renovar su JWT.
- PASS: estado sincronizado factura→CRM y CRM→factura; aceptación/aviso sincronizados; borrado de factura en SQL elimina oportunidad vinculada.
- PASS: anon sin lectura de facturas ni inserción de CRM ni ejecución de RPC de cuota; quinto intento de cuota denegado.
- Estado tras ROLLBACK: 1 propietario, 0 facturas, 0 oportunidades, 0 objetos Storage y 0 residuos de cuota de prueba.
- 8 tablas públicas con RLS; sin grants TRUNCATE/TRIGGER/REFERENCES a anon/authenticated; funciones SECURITY DEFINER públicas no ejecutables por anon/authenticated.
- Bucket invoice-files privado, límite 10 MiB y tipos PDF/JPEG/PNG/WebP. project-images público, vacío. Su carácter público exige no subir datos privados al futuro portfolio.
- Advisors: warning real de protección de contraseñas filtradas desactivada; INFO de tabla privada de cuota sin políticas esperada por diseño. Índices sin uso en base vacía, sin eliminarlos.

## Frontend y recorrido observado
Se revisaron respuestas HTTP de 18 rutas en la Preview de `081f3e3`, además de `/consulta`; las modificaciones posteriores de seguridad deben revisarse con su HEAD.
1. **Portada/escritorio — correcto en observación:** cuatro opciones visibles en el orden solicitado, Feníe presente y atribuciones separadas. Captura de pantalla inspeccionada en navegador.
2. **Servicios — HTTP correcto:** luz/gas, alarmas, cargadores y asesoría responden 200. Catálogo, atribución, enlaces y metadatos inspeccionados.
3. **Captación — desactivada correctamente:** /consulta y revisión de facturas ofrecen contacto alternativo. No se envían facturas reales. Las páginas /gracias sin comprobante firmado muestran ayuda, no un éxito falso.
4. **Área privada — acceso denegado sin sesión:** /admin/oportunidades y /admin/usuarios terminan en login. En el navegador con acceso a Vercel, la descarga con UUID válido y sin sesión de la app muestra «Documento no disponible». El código contempla 401 sin usuario; el conector HTTP devolvió un 401 de la capa de protección de Vercel, por lo que no se usa como medición del status de la aplicación.
5. **Rutas antiguas/SEO — correcto en HTTP:** instalaciones, telecomunicaciones y trabajos dan 404. robots.txt tiene Disallow: / y Preview noindex; sitemap sin catálogo antiguo.
6. **Móvil, accesibilidad y E2E autenticado — pendientes:** la capacidad de viewport del navegador conectado no aplicó 390 px (medición real 1762 px); el navegador integrado encontró la protección de Vercel. No se afirma revisión móvil superada ni conformidad WCAG. La sesión de la aplicación en el navegador mostró login, no una cuenta owner abierta.

Las capturas visuales se inspeccionaron dentro de la sesión; no hay un juego de imágenes exportado y aceptado como informe visual. Este documento constituye informe técnico con observación visual limitada, no auditoría visual exhaustiva. Quedan teclado, lector de pantalla, zoom, contraste medido, tablet/móvil y errores de formularios activos.

Cabeceras verificadas: DENY/nosniff/HSTS/Permissions-Policy; páginas privadas no-store. No se ha realizado pentest externo, prueba de carga, análisis antimalware de documentos ni auditoría de todo el historial Git.

## Configuración externa: comprobada, no supuesta
El conector de Vercel devuelve 403 al listar variables. Se usó la sesión de Vercel existente para consultar **nombres y entornos, sin revelar valores**. Solo figuran:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- INVOICE_INTAKE_ENABLED
- OPENAI_OCR_MODEL
- OPENAI_API_KEY

No figuran las variables de service role, Turnstile, HMAC, Resend ni invitaciones. Los nombres OPENAI no se utilizan en el código actual inspeccionado: revisar con el propietario; no se han leído ni borrado sus valores.

La producción observada conserva el despliegue `dpl_4drQhhLxhtx6tfcfytuCgm3QcFiu` de `9993bb2`. Su portada devuelve 200 en esta sesión. El error histórico de consulta a Supabase documentado previamente no demuestra por sí solo un fallo actual completo. No se ha tocado la producción ni main (`7f1a437`).

## Bloqueos reales y acciones necesarias
| Prioridad | Bloqueo | Acción y responsable |
|---|---|---|
| P0 | No hay sesión de la app para E2E | Propietario inicia sesión en Preview estable; probar crear/editar/asignar, agente, revocación y descarga con datos sintéticos |
| P0 | Faltan secretos y remitentes | Propietario configura variables directamente en Vercel Preview; ver activacion-segura-cloud.md. Nunca pegarlas en chat/repo |
| P0 | SMTP/invitaciones no verificadas | En Supabase Auth configurar SMTP y redirect allowlist al origen Preview estable; probar invitación, activación, caducidad y desactivación |
| P0 | Turnstile/avisos reales no probados | Configurar hosts concretos y remitente Resend verificado; probar error de captcha, cuota, guardado, aviso y fallo de correo |
| P0 | RGPD/LSSI e identidad incompletos | Preguntar a Javier/Kristina denominación jurídica, NIF, domicilio y dominio; validar responsable, bases, destinatarios, transferencias, retención y derechos con asesoría |
| P0 | Ciclo real de Storage sin probar | Subir PDF sintético desde flujo habilitado solo para QA autorizado, descargar con owner/agente, denegar a otros y borrar documento+CRM; comprobar fallo parcial y ausencia de huérfanos |
| P0 | Recuperación/conservación sin decisión | Acordar backup de BD y objetos, restauración de prueba, retención y responsable; no confundir backup de BD con copia de archivos |
| P0 | main sin protección técnica | Propietario crea ruleset con PR/revisión/checks requeridos. API devolvió protected=false. Draft no sustituye estos controles |
| P1 | Auth warning | Revisar activación de protección de contraseñas filtradas según disponibilidad del plan; no contratar ni cambiar plan automáticamente |
| P1 | Endurecimiento adicional | Evaluar MFA de equipo, CSP compatible y revisión de documentos antes de uso; verificar sesión expirada y errores intermedios de invitación |
| P1 | UX/accesibilidad | Repetir pruebas a tamaños reales y con teclado/lector de pantalla; no rediseñar por estética |
| P1 | Operación comercial | Confirmar canal, tarifas, garantías y posventa con Javier; responsable diario de leads, suplencia y tratamiento de avisos fallidos |
| P1 | Cadena de desarrollo | Audit de producción aprobado; sigue pendiente modernizar ESLint 8/acciones Node20 deprecadas y revisar vulnerabilidades de desarrollo por separado |

No hay aprobación de lanzamiento. Se conserva la recepción pública cerrada incluso si la Preview compila.

## Datos familiares pendientes, sin volver a solicitarlos ahora
Gorka indicó que no conoce todavía la denominación jurídica/NIF/dominio y pidió anotarlos para preguntar a Javier y Kristina. Se ha hecho en [preguntas-javier-kristina.md](preguntas-javier-kristina.md). El chat «Auditoria» y su adjunto no aportan esos datos completos. Correo de Javier confirmado: eleclakuntza@yahoo.es.

## Rollback y aceptación
- Volver al código previo mediante commits de revert en esta misma rama; referencia anterior al trabajo: `0035b56e19e7fe4858cad373cebfd1d6d7fcc208`. No force-push.
- Mantener INVOICE_INTAKE_ENABLED y PUBLIC_COMMERCIAL_INTAKE_ENABLED deshabilitadas ante cualquier incidencia.
- Las migraciones nuevas solo añaden columnas y amplían la sincronización; son compatibles con el código previo. Conservarlas al revertir aplicación evita borrar evidencias. No aplicar un DROP destructivo de forma automática.
- Validar el commit exacto, CI y Preview después de cualquier revert. No usar la producción antigua como restauración de datos de Supabase.
- Activar cada flujo solo después de sus pruebas y aprobación explícita del propietario. No merge ni promoción automática.

## Referencias de comprobación
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Sesiones SSR con Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Turnstile: validación servidor](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Advisory de PostCSS](https://github.com/advisories/GHSA-r28c-9q8g-f849)
- [LSSI, artículo 10](https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758#a10)
- [AEPD: garantías en transferencias](https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/medidas-de-cumplimiento/garantias-transferencias-datos-personales)

Estos enlaces fundamentan los controles y pendientes; los resultados concretos del proyecto proceden de sus herramientas, código y pruebas de esta sesión.

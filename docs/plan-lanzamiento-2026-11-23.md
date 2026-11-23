# Electricidad Lakuntza — Plan de puesta en marcha · semana 48

Fecha de revisión: 23/11/2026. **Objetivo estimado de lanzamiento comercial: 16/12/2026 (ventana 14–18/12)**; contingencia 21–23/12. La fecha no autoriza a captar datos antes de cerrar los controles P0.

## Estado confirmado
- Supabase Free yvrjrvropgouvzltwwvm ACTIVE_HEALTHY, un único owner/admin y 2 objetos privados. No hay MFA verificado.
- www/admin apuntan al despliegue piloto de Vercel READY dpl_HfSMSpiNLjrSNfUcuSQ86HzFRUoM (commit 4b397b9), no necesariamente al último código de PR.
- PR #9 integration/launch-prep-2026-10-29 sigue DRAFT y sin fusionar; CI del último commit requiere verificación antes de publicar.
- Web comercial y CRM operativos en modo piloto; recepción real bloqueada. Flujo factura→OCR→comparativa→correo preparado→eliminación y Turnstile fueron validados manualmente en Preview con documentos ficticios, no en producción comercial.
- Archivo cifrado 18/11 validado y descifrado desde OneDrive; el respaldo incluye datos Auth sensibles y PDFs, pero recuperación SQL local FALLÓ en rol reservado supabase_admin. Entorno local PC-GHU detenido y fuera del portátil corporativo.
- Nueva interfaz MFA TOTP y rutas de verificación desarrolladas en PR pero **ocultas por CRM_MFA_ROLLOUT_ENABLED (false por ausencia)**. RLS AAL2, recovery y pruebas finales todavía pendientes. Ver docs/mfa-crm-rollout-2026-11-23.md.
- Correcciones UX de bajo riesgo: texto de invitación genérico y pantalla de error de Facturas con título coherente. Revisión de código favorable sobre prioridades comerciales de portada y filtros CRM; **no sustituye auditoría visual** en móviles y autenticación real.

## Calendario propuesto
| Fecha | Entregable verificable | Dependencia |
|---|---|---|
| 23–27 nov | Preparación MFA, documentación RLS y diagnóstico UX; documentación fiscal solicitada | GitHub/Supabase; titular |
| 30 nov–4 dic | Restauración aislada PC-GHU (esquema/datos/Auth/PDF), seguridad RLS y proceso backup | Acceso PC-GHU; test sin secretos |
| 7–11 dic | Acceso MFA y permisos verificados; QA final web/CRM; pruebas con Javier y Kristina; plan de alojamiento aprobado | Aprobación titular; diseño sin nuevos módulos |
| 14–18 dic | Lanzamiento controlado: Vercel comercial u opción compatible, últimos checks CI, formularios y Turnstile real, indexación, LinkedIn y seguimiento | P0 completados y autorización expresa |
| 21–23 dic | Contingencia y estabilización | Incidencias reales |

## Gate de lanzamiento (todos los requisitos obligatorios)
- [ ] Restauración aislada exitosa con recuentos, accesos, Auth y PDF; copias y conservación/alerta acordadas.
- [ ] MFA/recovery probados para el único owner; protección de rutas, Server Actions, PostgREST y Storage por RLS; alta de usuarios del equipo solo con aprobación.
- [ ] Razón/titular/NIF/domicilio y contacto correctos; aviso legal, privacidad, consentimiento y tratamiento de facturas revisados con asesoría.
- [ ] Alojamiento compatible con uso comercial. Hobby está restringido a uso no comercial según https://vercel.com/docs/plans/hobby . Pro se oferta desde 20 USD/mes por asiento más posibles consumos; no contratar sin autorización. Evaluar alternativa solo si no retrasa lanzamiento.
- [ ] PR #9 consolidada y CI verde en SHA de lanzamiento; Vercel producción READY y rollback compatible.
- [ ] Web y CRM auditados visualmente en móvil y escritorio, contenidos correctos (Feníe agente; alarmas Movistar Prosegur; servicios propios); formación práctica con equipo.
- [ ] Formulario real en dominio definitivo, reCAPTCHA/Turnstile, rate limits, correo notificación, OCR, PDF, comparación y eliminación comprobados con datos sintéticos.
- [ ] Activación explícita de flags, comprobación SEO, Search Console, LinkedIn y recepción de oportunidades.
- [ ] Procedimiento operativo: responsable de consultas, atención y seguimiento diario, gestión de incidencias y canales comerciales.

## Titularidad legal: nombre confirmado el 23/11/2026
- El propietario ha confirmado que la denominación de la empresa es **Electricidad Lakuntza, C.B.**, utilizada habitualmente en toda la documentación. La marca abreviada visible puede seguir siendo Electricidad Lakuntza.
- Se han ajustado aviso legal, privacidad y copyright del pie de página en la rama de integración. **El NIF, domicilio fiscal oficial y datos de contacto deben contrastarse aún con factura/documentación vigente** antes de autorizar la captación comercial. No inventar NIF ni suscribir servicios sin titular correcto.
- Las cuotas y alternativas de infraestructura/correo están en docs/presupuesto-operativo-2026-11-23.md; aprobación de Javier y Kristina pendiente.

## Material que se necesita de propiedad
1. Factura reciente emitida por Electricidad Lakuntza, C.B., o datos fiscales oficiales: NIF, domicilio fiscal y contacto. Denominación C.B. confirmada por el propietario.
2. Aprobación del alojamiento comercial y presupuesto operativo, sin cambio unilateral de plan.
3. Breve sesión real con Javier y Kristina para comprobar el CRM e identificar responsable y suplente.
4. Línea base opcional: número de clientes y contratos vigentes de luz/gas/alarmas y comisiones agregadas. No bloquea apertura pero permite medir crecimiento.

## Qué NO se hará ahora
- No abrir el almacenamiento de PDF, datos reales o credenciales desde el portátil de Barranquesa.
- No migrar cuentas corporativas ni contratar correo/teléfono antes de resolver P0, salvo decisión explícita.
- No ampliar funcionalidades del CRM ni publicar módulos Trabajos/Instalaciones.
- No activar captación mientras legal, recuperación y alojamiento estén pendientes. No fusionar PR sin CI y QA.

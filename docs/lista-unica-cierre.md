# Lista única de cierre — Electricidad Lakuntza

Actualizada el 03/11/2026. Rama integration/launch-prep-2026-10-29, PR #9 en borrador.

## Cerrado y comprobado
25 pruebas unitarias (extracción real de PDF sintético incluida), 48 pruebas públicas en escritorio/móvil/tablet con axe, compilación y auditoría de dependencias de producción aprobadas en [CI](https://github.com/Gorkaa96/electricidad-lakuntza-web/actions/runs/41627055477). Regresión SQL transaccional aprobada con rollback.

Configuradas en Vercel exclusivamente para Preview y esta rama: ADMIN_PANEL_BASE_URL, ADMIN_INVITATION_BASE_URL y los tres interruptores de publicación/captación en false. No requieren pedir sus valores al propietario. Los secretos y las pruebas reales siguen pendientes.

## Nueva información recibida el 03/11
Revisados los tres folletos de alarmas enviados por Javier. Precio base, beneficio de puntos y fechas de campañas documentados; la cerradura promocionada hasta octubre está caducada. [Detalle y preguntas restantes](revision-correos-2026-11-03.md).

Factura real disponible y lectura PDF/parser contrastados en temporal privado, sin subirla a GitHub/Keep ni al entorno de aplicación. Añadidas dos regresiones con valores inventados; comprobación de la versión actual en los checks de PR #9. La recepción y circuito E2E desplegado siguen pendientes.

## Información que hay que pedir (una sola recopilación)

### Javier y Kristina
- [ ] Denominación jurídica y NIF del titular. Confirmar con César Donázar qué corresponde a la forma declarada «sociedad irregular».
- [ ] Confirmación de domicilio y teléfono publicados. El correo eleclakuntza@yahoo.es ya está confirmado; no volver a pedirlo como desconocido.
- [ ] Dominio definitivo, correo corporativo y quién tiene acceso al DNS.
- [ ] Responsable diario de solicitudes, suplente y plazo de respuesta aceptado.
- [ ] Confirmar campaña vigente de alarmas del canal Feníe (folletos ya recibidos), renovación de cerradura si existe, cobertura, permanencia/penalización y comisiones. Condiciones vigentes de productos luz/gas.
- [ ] Alarmas: circuito contractual y posventa con Movistar Prosegur mediante Feníe.
- [ ] Cargadores propios: alcance, capacidad, zonas, presupuestación, garantías y posventa.
- [ ] Asesoría propia: alcance y coste.

### Asesoría y titular
- [ ] Validación de identificación legal y textos RGPD/LSSI.
- [ ] Bases jurídicas, encargados, contratos de tratamiento y transferencias internacionales.
- [ ] Plazos de conservación por finalidad, derechos, borrado, copias e incidencias.
- [ ] Aprobación del destino/frecuencia/retención de copias, responsables, objetivo de recuperación y presupuesto.

## Acciones de propietario que faltan, sin pedir contraseñas ni claves por chat
- [ ] Iniciar sesión de owner en la aplicación Preview.
- [ ] Configurar los secretos servidor de Vercel Preview/Supabase; mantener los flags cerrados.
- [ ] Configurar Turnstile para el hostname de prueba.
- [ ] Verificar dominio/remitente de Resend y destinatario de avisos.
- [ ] Configurar SMTP Auth y allowlist de invitaciones. SMTP de invitaciones y avisos de nuevas solicitudes son dos flujos distintos.
- [ ] Revisar comprobación de contraseñas filtradas y MFA según disponibilidad del plan.
- [ ] Una cuenta con administración del repositorio debe proteger main con PR, revisión y checks. La conexión actual tiene push=true y admin=false; no puede imponer esta configuración.

Pasos y nombres de variables: [activación segura](activacion-segura-cloud.md). No comprar dominio, ampliar plan ni conceder accesos sin decisión del titular.

## Validaciones pendientes por esas dependencias
- [ ] Factura sintética (la lectura aislada de una factura real ya se ha probado): subida → Storage privado → CRM → aviso → seguimiento → borrado integral.
- [ ] Sesiones owner/admin/agent: asignación, descarga, expediente ajeno, renovación y revocación.
- [ ] Invitación real: entrega, activación, caducidad y desactivación.
- [ ] Turnstile real, cuota y fallo de correo sin pérdida de solicitud.
- [ ] Restauración de base de datos y objetos en entorno aislado.
- [ ] Revisión manual con lector de pantalla y aceptación final sobre Preview configurada.
- [ ] Aprobación explícita para publicación/activación, tras pasar los controles.

## Documentación ya preparada
- Modelo comercial, privacidad técnica y controles: [auditoría](auditoria-work-2026-11-03.md).
- Procedimiento diario, cuentas, borrado, copias e incidencias: [operativa y recuperación](operativa-y-recuperacion.md).
- Pruebas SQL reversibles: tests/sql/security-regression.sql.
- Pruebas públicas de navegador y accesibilidad: e2e/public-flows.spec.mjs, tres tamaños, sin datos ni secretos.
- PDF de prueba: npm run qa:fixture; sin ningún dato de cliente.

## Límites
Pasar CI o los ensayos aislados no valida SMTP, Storage, Auth ni RGPD en la instalación real. No confundir tareas preparadas con configuraciones ejecutadas.

Las mejoras futuras de métricas avanzadas, comisiones y automatizaciones no son requisitos para activar una primera recepción controlada y quedan fuera del cierre de lanzamiento.

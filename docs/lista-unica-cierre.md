# Lista única de cierre — Electricidad Lakuntza
Actualizada el 03/11/2026. Rama integration/launch-prep-2026-10-29; PR #9 en borrador.

## Formulario de cliente final
Retirado el modo de ejemplo y su comprobación local a petición de Gorka. La Preview de integración muestra el formulario final sin datos prellenados ni botón de ejemplo. Si aún faltan credenciales, el envío permanece deshabilitado; no se anuncia recepción ni aparece un expediente inexistente.
NIF y dominio definitivo no son requisitos para probar el envío privado. Cuentas Cloudflare/Resend ya creadas; faltan sus credenciales y la configuración privada en Vercel.
[Conexión del envío real](prueba-formulario-preview.md).

## Versión preparada para presentar
[Web Preview protegida](https://electricidad-lakuntza-git-c5cfe9-gorkahernandez6-9437s-projects.vercel.app/) · [guion para Javier y Kristina](presentacion-javier-kristina.md).
Se mantiene la identidad visual. Corregidos descubrimiento de los cuatro servicios en móvil, barra de servicios/teléfono/WhatsApp, acciones de revisión con y sin factura y contraste del panel.
Instalaciones generales siguen ocultas, con el código conservado.

## Comprobaciones implementadas y reproducibles
Los checks de la [PR #9](https://github.com/Gorkaa96/electricidad-lakuntza-web/pull/9) son la referencia del último commit.
- Pruebas unitarias, extracción de PDF sintético, compilación y auditoría de dependencias de producción.
- Navegación pública, tres tamaños, teclado, accesibilidad automática, formulario cerrado, privacidad y descargas anónimas denegadas.
- Supabase desechable en GitHub: SQL del proyecto aplicado desde cero y regresión transaccional con rollback.
- Sesiones Auth auténticas de owner/admin/agent, descarga de archivo privado, expediente ajeno bloqueado y revocación con token ya emitido.
- CRM de los cinco servicios, sincronización de estado/asignación, lectura PDF desde el panel y borrado de archivo y registros asociados.
- Invitación recibida por SMTP local y activación de cuenta desde el enlace recibido. Corregido el tratamiento del token de invitación.
- Formulario habilitado solo en el runner: bono social, gas, consentimiento, formatos, tamaño y rechazo de verificación ausente.
- Envío completo sintético con captcha y avisos controlados en el runner, incluido fallo de aviso sin pérdida de expediente. No se contacta con Cloudflare ni Resend reales.
- Copia y restauración byte a byte de un archivo sintético. No sustituye una restauración integral de la instalación alojada.

La factura real del correo se contrastó en temporal privado. No se copió al repositorio, CI ni Keep. Fotos y PDF escaneados se revisan manualmente.

## Pedir a Javier y Kristina
- [ ] Denominación jurídica exacta y NIF. Validar con su asesoría la forma declarada «sociedad irregular».
- [ ] Confirmación de domicilio y teléfonos publicados. eleclakuntza@yahoo.es ya está confirmado.
- [ ] Dominio final, correo corporativo y quién controla el DNS.
- [ ] Responsable diario, suplente y plazo de respuesta.
- [ ] Condiciones de luz/gas del canal Feníe: productos y comisiones.
- [ ] Alarmas: confirmar campaña actual, renovación de cerradura si existe, permanencia/penalizaciones, cobertura, negocios y circuito de posventa. Los tres folletos ya están recibidos y revisados.
- [ ] Cargadores: alcance, zona, capacidad, presupuesto, garantías y posventa.
- [ ] Asesoría propia: alcance y coste.
- [ ] Aprobación del contenido y diseño presentado.

## Validar con el titular y su asesoría
- [ ] Identidad legal y textos RGPD/LSSI.
- [ ] Bases jurídicas, proveedores/encargados, contratos y transferencias.
- [ ] Conservación por finalidad, atención de derechos, borrado e incidencias.
- [ ] Responsable, destino, frecuencia y retención de copias de base de datos y archivos; objetivos de recuperación y presupuesto.

## Acciones de cuentas que necesitan acceso o verificación del propietario
Estas tareas NO son falta de información comercial ni se deben atribuir a Javier si las cuentas las administra Gorka.
- [ ] Completar los secretos servidor en Vercel Preview/Supabase, sin enviarlos por chat ni al repositorio.
- [ ] Configurar Turnstile para el hostname de prueba.
- [ ] Verificar remitente/dominio de Resend, destinatario de avisos y entrega real.
- [x] Site URL de Supabase y redirección exacta de invitación configuradas hacia la Preview HTTPS protegida, con autorización del propietario.
- [ ] Configurar SMTP Auth y acceder como owner a la aplicación; verificar entrega real.
- [x] Alta libre de Auth desactivada y persistencia verificada tras recargar. El panel es interno; se mantiene acceso de cuentas existentes y circuito administrativo de invitación.
- [ ] Revisar protección de contraseñas filtradas (la UI exige Pro o superior; plan actual Free) y MFA.
- [x] Ruleset de main activo y verificado (26449542): una aprobación, dos checks de GitHub Actions requeridos, ramas actualizadas, conversaciones resueltas y bloqueo de borrado/force-push.

Ya se configuraron en Vercel únicamente para Preview de esta rama los dos orígenes administrativos y tres flags false.
La conexión GitHub de herramientas tiene push y no administración. La sesión del navegador de la cuenta propietaria permitió guardar las reglas tras la verificación de identidad autorizada por Gorka.

## Validación final sobre la instalación alojada
- [ ] Repetir con datos sintéticos el circuito aprobado en CI sobre la Preview protegida y configuración real, incluido captcha y entrega de correo.
- [ ] Verificar la invitación, sesión y revocación con el SMTP y usuarios de prueba autorizados.
- [ ] Ejecutar una restauración integral aislada de base de datos y objetos con la política de copias acordada.
- [ ] Revisión manual con lector de pantalla y aceptación de uso por Javier/Kristina.
- [ ] Aprobación explícita de publicación y recepción pública después de cerrar los controles.

## Referencias
[Activación paso a paso y rollback](activacion-segura-cloud.md) · [Operativa y recuperación](operativa-y-recuperacion.md) · [Revisión de correos](revision-correos-2026-11-03.md).
No comprar dominio, contratar proveedores, ampliar planes ni conceder nuevos accesos automáticamente. Producción y recepción pública continúan cerradas.

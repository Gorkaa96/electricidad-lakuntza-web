# Presentación de Electricidad Lakuntza — 3 de noviembre de 2026

## Abrir la versión que se está revisando
[Web Preview de la rama de integración](https://electricidad-lakuntza-git-c5cfe9-gorkahernandez6-9437s-projects.vercel.app/).
Está protegida por Vercel. Mostrarla desde la sesión autorizada de Gorka. No es el dominio público definitivo.
[PR #9](https://github.com/Gorkaa96/electricidad-lakuntza-web/pull/9): sigue en borrador y no modifica producción.

## Recorrido de cinco minutos
1. Portada en móvil: los cuatro accesos se ven antes de la barra inferior, en el orden Luz y gas, Alarmas, Cargadores, Asesoría. La barra ofrece Servicios, Llamar y WhatsApp.
2. Luz y gas: revisión humana, comparación con el CRM oficial de Feníe y contrato con Feníe. «Solicitar revisión» baja al siguiente paso; «Consultar sin factura» conserva un mensaje específico.
3. Alarmas: comercialización mediante Feníe e instalación/servicio de Movistar Prosegur. La cerradura no se anuncia con la campaña caducada. Las ventajas del Plan Épico son puntos sujetos a condiciones.
4. Cargadores y asesoría: servicios prestados por Electricidad Lakuntza. Presupuesto y alcance para cada caso, sin precios inventados.
5. Contacto y gestión: mientras no se apruebe la recepción, la web ofrece consulta por WhatsApp, teléfono y correo. Las facturas reales no se envían durante esta presentación.

## Demostración del panel y de la lectura
El trabajo del panel se verifica en GitHub con cuentas ficticias y un Supabase desechable del propio runner: los roles no se simulan. Los archivos y datos de prueba son sintéticos. Las capturas de las pruebas autenticadas quedan en el artefacto isolated-backend-browser de los checks de la PR.
La factura real recibida por correo se usó solo para contrastar el lector en temporal privado. No aparece en repositorio, capturas de CI ni en esta presentación.
Las imágenes y los PDF escaneados se revisan manualmente; el lector automático actual procesa PDF con texto seleccionable.

No presentar el correo local de pruebas como validación de entrega del correo corporativo ni el ensayo aislado como certificación del entorno alojado.

## Decisiones y datos que deben confirmar Javier y Kristina
- Titular jurídico exacto y NIF; forma legal y domicilio que deben publicarse, con la asesoría.
- Dominio elegido, correo corporativo y quién controla el dominio/DNS.
- Quién atenderá las consultas, suplente y plazo de respuesta.
- Luz/gas: condiciones y alcance comercial del canal Feníe (productos y comisiones).
- Alarmas: campaña vigente, renovación de cerradura si existe, permanencia y penalización, cobertura geográfica, propuesta para negocios y posventa.
- Cargadores: zona, capacidad de trabajo, alcance del presupuesto, garantías y posventa.
- Asesoría propia: alcance y coste.
- Conservación, derechos, proveedores, copias e incidencias: aprobación del titular con la asesoría.
- Aceptación de la presentación final y, más adelante, aprobación separada de publicación y captación.

## Acciones de cuentas que no son preguntas comerciales
La configuración de secretos de Vercel/Supabase, Cloudflare Turnstile, Resend, SMTP y DNS necesita acceso a sus cuentas y remitentes autorizados. No atribuirlo a una falta de respuesta comercial de Javier.
El cierre de estas configuraciones y la prueba alojada están detallados en [activación segura](activacion-segura-cloud.md).
No compartir contraseñas ni claves en la reunión, el chat o el repositorio.

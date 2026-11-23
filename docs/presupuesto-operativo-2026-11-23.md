# Electricidad Lakuntza, C.B. — Presupuesto para puesta en marcha
Revisión de precios públicos: 23/11/2026. **No se ha contratado, comprado ni cambiado ningún plan**. Comparar importe final, impuestos, forma de pago, condiciones y facturación empresarial antes de aprobar. Los precios en USD y EUR se mantienen en su moneda original para no asumir tipo de cambio.

## Presupuesto recomendado para producción comercial

| Concepto | Precio de referencia | Cantidad propuesta | Coste base estimado/mes | Decisión |
|---|---|---|---|---|
| Vercel Pro | **20 USD/mes** de base, un puesto de desarrollador | 1 | **20 USD** + posible consumo adicional | Necesario si se mantiene este alojamiento: Hobby solo uso no comercial |
| Supabase Pro | **25 USD/mes** para una organización/proyecto base, más posibles excesos | 1 | **25 USD** + posible consumo adicional | Recomendado para un CRM con datos reales: evita pausas por inactividad y permite backups diarios 7 días |
| Microsoft 365 Empresa Básico EEE **sin Teams** | **4,67 €/usuario/mes**, compromiso anual, sin IVA; alternativa mensual **5,60 €/usuario/mes** | 3 usuarios propuestos | **14,01 €**/mes equivalente anual, sin IVA (o **16,80 €**/mes en suscripción mensual) | Recomendado: correo y OneDrive empresarial (1 TB por usuario); designar usuarios nominativos, no compartir contraseñas |
| Resend Free (emails transaccionales) | 0 USD hasta 3.000 emails/mes, máximo 100/día | 1 | 0 | Suficiente al inicio; no sustituye automáticamente un buzón de atención ni envía comparativas desde Yahoo |
| Cloudflare Free, Turnstile y DNS | 0 | Actual | 0 | Mantener |
| GitHub Free | 0 | Actual | 0 | Mantener si necesidades de colaboración/seguridad caben |
| LinkedIn Page / Search Console | 0 | Actual | 0 | Mantener |
| Dominio electricidadlakuntza.com | Ya comprado | 1 | 0 adicional inmediato | Renovación anual pendiente de importe exacto de factura/registrador |

**Total de referencia recomendado:** **45 USD/mes + 14,01 €/mes**, antes de impuestos, tipo de cambio, uso extra y renovación del dominio; Microsoft con compromiso anual. Si Microsoft se contrata mes a mes, serían **45 USD/mes + 16,80 €/mes**. Si se parte solo con 1 licencia Microsoft, la partida de correo sería 4,67 €/mes (anual) o 5,60 €/mes (mensual), con las restricciones de acceso compartido que se acuerden.

Los dos servicios en USD facturan según plan/uso y pueden sumar impuestos. No publicar un coste global fijo en euros sin confirmar cambio/tipo de factura y límites de consumo. No añadir desarrolladores de pago en Vercel sin necesidad. Configurar presupuesto y alertas/hard cap con cuidado: un límite duro puede interrumpir el servicio, no solo reducir el gasto.

## Alternativas de correo
- **Microsoft Exchange Online (Plan 1)**: 3,50 €/usuario/mes con compromiso anual, sin IVA, para correo/calendario sin el 1 TB empresarial de OneDrive. 3 cuentas: 10,50 €/mes. Alternativa si no se necesita almacenamiento corporativo del paquete Microsoft 365.
- Google Workspace Business Starter: desde 6,80 €/usuario/mes en su oferta española consultada; 30 GB de almacenamiento conjunto por usuario. Más caro que Microsoft 365 Básico sin Teams en esta comparativa, sujeto a duración/oferta.
- Microsoft 365 Empresa Básico EEE sin Teams propuesto arriba por gestión Outlook, archivos corporativos y flexibilidad. Evaluar almacenamiento y protección efectiva de backups; sincronización no sustituye un backup independiente.
- Buzones compartidos (por ejemplo info@) sin licencia adicional dentro de límites Microsoft, **solo mediante delegación de usuarios con licencia**, nunca compartir la contraseña. admin@ puede ser alias/identidad técnica según diseño. No inventar emails personales sin aprobación.
- Teléfono: conservar el existente (649 853 448) al inicio; número nuevo o centralita solo si la operativa lo justifica.

## Opcionales / externos
- Resend Pro: 20 USD/mes si se supera Free o se necesita más capacidad; no se recomienda inicialmente.
- Microsoft 365 más licencias, Vercel más asientos, Supabase mayor compute, dominio personalizado de Supabase, backups adicionales, analítica, gestoría o revisión externa de RGPD: **no contratar aún; presupuestar cuando aparezca necesidad real**.
- Servicios de asesoría jurídica/privacidad: posible importe puntual, no inventar tarifa; solicitar a asesoría habitual.
- El actual OneDrive personal de PC-GHU no debe transformarse automáticamente en destino único de backups de datos reales. Al migrar usar custodia de la empresa, cifrado, dos destinos y pruebas de restauración.
- Configurar MX, SPF, DKIM, DMARC y SMTP/control de invitaciones antes de poner en producción nuevas direcciones; evitar cortar comunicación Yahoo durante transición.

## Orden de contratación, condicionado a aprobación de la propiedad
1. Aprobar presupuesto y titularidad de facturación **Electricidad Lakuntza, C.B.** con NIF vigente.
2. Crear/organizar las identidades y un buzón corporativo en Microsoft 365; configurar DNS sin alterar registros de web ni romper Yahoo. Separar acceso por usuario y añadir MFA.
3. Subir el proyecto Supabase de Free a Pro para evitar pausa y disponer de backups gestionados (los archivos de Storage requieren copia aparte). Revisar caps de gasto.
4. Cambiar Vercel a Pro y asegurar que todo el proyecto/dominio comercial reside en el equipo de facturación correcto; alertas y límite de gasto. Hacerlo antes de permitir captación real.
5. Validar Resend Free, dominio remitente y recepción, y pruebas de invitación.
6. Cerrar recuperación, MFA, legal, QA y formación; publicar mediante autorización expresa.

**No contratar nada desde una cuenta personal nueva sin decidir titularidad y recuperación de administrador.** Tampoco trasladar secretos, PDFs ni SQL al portátil de Barranquesa.

## Fuentes públicas de precios, consulta 23/11/2026
- Vercel https://vercel.com/pricing y https://vercel.com/docs/plans/hobby
- Supabase https://supabase.com/pricing y https://supabase.com/docs/guides/platform/backups
- Microsoft 365 Básico https://www.microsoft.com/es-es/microsoft-365/business/microsoft-365-business-basic
- Exchange Plan 1 https://www.microsoft.com/es-es/microsoft-365/outlook/outlook-business-email-plans
- Google Workspace https://workspace.google.com/intl/es/business/
- Resend https://resend.com/pricing
- Microsoft buzón compartido https://learn.microsoft.com/en-us/microsoft-365/admin/email/about-shared-mailboxes

## Estado de lanzamiento
Producción técnica piloto READY pero captación real BLOQUEADA. Pendiente restauración integral, MFA RLS, NIF/legal, pago de alojamiento comercial, remitentes e invitaciones, QA final en dominios y prueba con Javier/Kristina. Objetivo indicativo 16/12/2026 condicionado a P0.

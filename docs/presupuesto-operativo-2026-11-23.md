# Electricidad Lakuntza, C.B. — Presupuesto para puesta en marcha
Revisión de precios públicos: 23/11/2026. **No se ha contratado, comprado ni cambiado ningún plan**. Comparar importe final, impuestos, forma de pago, condiciones y facturación empresarial antes de aprobar. Los precios en USD y EUR se mantienen en su moneda original para no asumir tipo de cambio.

## Presupuesto recomendado para producción comercial

| Concepto | Precio de referencia | Cantidad propuesta | Coste base estimado/mes | Decisión |
|---|---|---|---|---|
| Vercel Pro | **20 USD/mes** de base, un puesto de desarrollador | 1 | **20 USD** + posible consumo adicional | Necesario si se mantiene este alojamiento: Hobby solo uso no comercial |
| Supabase Pro | **25 USD/mes** para una organización/proyecto base, más posibles excesos | 1 | **25 USD** + posible consumo adicional | Recomendado para un CRM con datos reales: evita pausas por inactividad y permite backups diarios 7 días |
| Microsoft 365 Empresa Básico EEE **sin Teams** | **4,67 €/usuario/mes**, compromiso anual, sin IVA; alternativa mensual **5,60 €/usuario/mes** | 2 usuarios operativos propuestos (Javier y Kristina), tercero opcional para soporte técnico | **9,34 €**/mes equivalente anual, sin IVA (o **11,20 €**/mes en suscripción mensual) | Recomendado: correo y OneDrive empresarial (1 TB por usuario), accesos separados. Tercer buzón de Gorka solo si realmente lo necesita |
| Resend Free (emails transaccionales) | 0 USD hasta 3.000 emails/mes, máximo 100/día | 1 | 0 | Suficiente al inicio; no sustituye automáticamente un buzón de atención ni envía comparativas desde Yahoo |
| Cloudflare Free, Turnstile y DNS | 0 | Actual | 0 | Mantener |
| GitHub Free | 0 | Actual | 0 | Mantener si necesidades de colaboración/seguridad caben |
| LinkedIn Page / Search Console | 0 | Actual | 0 | Mantener |
| Dominio electricidadlakuntza.com | Ya comprado | 1 | 0 adicional inmediato | Renovación anual pendiente de importe exacto de factura/registrador |

**Total base recomendado para dos usuarios operativos:** **45 USD/mes + 9,34 €/mes**, antes de impuestos, tipo de cambio, uso extra y renovación del dominio; Microsoft con compromiso anual. En suscripción mensual Microsoft serían **45 USD/mes + 11,20 €/mes**. Con tres licencias en vez de dos, el total sería **45 USD/mes + 14,01 €/mes** (compromiso anual). Gorka colabora técnicamente pero no es empleado ni socio: no comprar una tercera licencia por defecto; asignar permisos técnicos nominativos de forma autorizada, sin que su identidad personal sea la única propietaria de servicios corporativos.

Los dos servicios en USD facturan según plan/uso y pueden sumar impuestos. No publicar un coste global fijo en euros sin confirmar cambio/tipo de factura y límites de consumo. No añadir desarrolladores de pago en Vercel sin necesidad. Configurar presupuesto y alertas/hard cap con cuidado: un límite duro puede interrumpir el servicio, no solo reducir el gasto.

## Alternativas de correo
- **Microsoft Exchange Online (Plan 1)**: 3,50 €/usuario/mes con compromiso anual, sin IVA, para correo/calendario sin el 1 TB empresarial de OneDrive. 2 cuentas: 7,00 €/mes (3 cuentas: 10,50 €/mes). Alternativa si no se necesita almacenamiento corporativo del paquete Microsoft 365.
- Google Workspace Business Starter: desde 6,80 €/usuario/mes en su oferta española consultada; 30 GB de almacenamiento conjunto por usuario. Más caro que Microsoft 365 Básico sin Teams en esta comparativa, sujeto a duración/oferta.
- Microsoft 365 Empresa Básico EEE sin Teams propuesto arriba por gestión Outlook, archivos corporativos y flexibilidad. Evaluar almacenamiento y protección efectiva de backups; sincronización no sustituye un backup independiente.
- Buzones compartidos (por ejemplo info@) sin licencia adicional dentro de límites Microsoft, **solo mediante delegación de usuarios con licencia**, nunca compartir la contraseña. admin@ puede ser alias/identidad técnica según diseño. No inventar emails personales sin aprobación.
- Teléfono: conservar por ahora el 649 853 448 porque ya lo conocen los clientes, pero preguntar si es personal de Javier o exclusivo del negocio. Si es exclusivo y pertenece/controla la empresa, valorar migrar ese mismo número a la app gratuita WhatsApp Business; si mezcla vida personal, valorar segunda línea económica (precio por presupuestar) para WhatsApp Business y captación. No contratar centralita ni WhatsApp API al inicio. El número de atención debe poder continuar cuando Javier se jubile.

## Opcionales / externos
- Resend Pro: 20 USD/mes si se supera Free o se necesita más capacidad; no se recomienda inicialmente.
- Microsoft 365 más licencias, Vercel más asientos, Supabase mayor compute, dominio personalizado de Supabase, backups adicionales, analítica, gestoría o revisión externa de RGPD: **no contratar aún; presupuestar cuando aparezca necesidad real**.
- Servicios de asesoría jurídica/privacidad: posible importe puntual, no inventar tarifa; solicitar a asesoría habitual.
- El actual OneDrive personal de PC-GHU no debe transformarse automáticamente en destino único de backups de datos reales. Al migrar usar custodia de la empresa, cifrado, dos destinos y pruebas de restauración.
- Configurar MX, SPF, DKIM, DMARC y SMTP/control de invitaciones antes de poner en producción nuevas direcciones; evitar cortar comunicación Yahoo durante transición.

## Orden de contratación, condicionado a aprobación de la propiedad
1. Aprobar presupuesto, decidir 2 licencias de correo operativas o tercera opcional, teléfono actual versus segunda línea para WhatsApp Business, y titularidad de facturación **Electricidad Lakuntza, C.B.** con NIF vigente.
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

## Nota de dimensionamiento (23/11/2026)
Electricidad Lakuntza, C.B. opera con Javier y Kristina; Gorka ayuda en el ámbito técnico pero **no es socio ni empleado**. Por ello se recomiendan **2 licencias nominativas** para la operación diaria y una tercera solo si se demuestra una necesidad real de correo/OneDrive de Gorka. Acceso técnico delegado, trazable y con MFA; facturación y propiedad de las cuentas, dominio y datos a nombre de la empresa. **WhatsApp Business App** puede usarse gratis y con dispositivos vinculados; una nueva línea solo se presupuesta si el 649 853 448 es de uso personal o se desea separar clientes nuevos. Fuentes: https://faq.whatsapp.com/641572844337957 y https://blog.whatsapp.com/one-whatsapp-account-now-across-multiple-phones .

## Decisión de telefonía: 23/11/2026
El propietario confirma que el **649 853 448 es el número personal de Javier**, utilizado también profesionalmente. Por tanto, la propuesta cambia de «nueva línea opcional» a **«nueva línea corporativa recomendada»** para los formularios y el WhatsApp Business de nuevos clientes. Mantener el número conocido para los contactos habituales durante la transición, sin retirar ni alterar el número personal de Javier; cuando la nueva línea esté operativa y verificada, sustituir progresivamente el teléfono y WhatsApp públicos de la web y sus CTA. El número nuevo debe contratarse a nombre de Electricidad Lakuntza, C.B., si el operador lo permite, con capacidad de recibir SMS/llamadas para verificaciones y acceso recuperable por negocio, no solo por Javier o por el técnico.

Referencias de tarifas de noviembre de 2026, **no contratadas**:
- DIGI Móvil 5 GB + 100 minutos nacionales: 3 €/mes precio final, https://www.digimobil.es/movil/
- simyo 15 GB + 120 minutos: 3,50 €/mes (consultar condiciones y facturación), https://www.simyo.es/tarifas-movil.html
- WhatsApp Business App: descarga gratuita, funciones básicas sin suscripción; https://faq.whatsapp.com/641572844337957/

Presupuesto de lanzamiento orientativo con 2 licencias de correo: **45 USD/mes + 12,34–12,84 €/mes** (9,34 € de Microsoft sin IVA, con compromiso anual, más 3–3,50 € del teléfono según precios publicados, IVA incluido según operador; totales con impuestos mixtos, no comparar como cifra final de factura). Añadir impuestos de otras plataformas, divisas y consumos variables. La cobertura en Lakuntza, portabilidad no necesaria, eSIM/SIM, llamadas, verificación SMS, titularidad jurídica y costes reales deben confirmarse antes de contratar.

No requiere segundo teléfono físico si el dispositivo principal admite WhatsApp personal y Business con números distintos, o dispositivos vinculados. Antes del alta elegir quién custodiará la SIM/eSIM principal y cómo accederá Kristina al WhatsApp del negocio, especialmente pensando en la jubilación de Javier. Gorka ayuda técnicamente, **no es empleado ni socio**, y no debe ser titular personal de la línea.


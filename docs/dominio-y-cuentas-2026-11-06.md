# Dominio y cuentas — 6 noviembre 2026

## Confirmaciones del negocio
- Dominio comprado en Cloudflare: electricidadlakuntza.com. Usuario confirma factura recibida.
- Cuenta Cloudflare del negocio conectada por MCP con eleclakuntza@yahoo.es. No trasladar este dominio a la cuenta personal de Gorka.
- Corrección expresa del usuario: la razón social que usarán, según confirmación de Javier/Kristina de lo registrado en Hacienda y sus facturas, es Electricidad Lakuntza, con NIF E31283476. Sustituye la interpretación anterior de los nombres personales como razón social. No se ha inspeccionado justificante fiscal. Francisco Javier Hernandez Santana es contacto personal del registro; respetar transliteración sin tilde si el proveedor la exige. Forma jurídica no deducida.
- Usuario quiere seguir por pasos: cuentas del negocio, correo, traspasos controlados, teléfono único/WhatsApp Business, CRM y web, auditoría/producción gradual. LinkedIn se deja para después.

## Comprobación conectada de hoy (solo lectura)
Cloudflare zona electricidadlakuntza.com activa, servidores ara.ns.cloudflare.com y garret.ns.cloudflare.com. Lista completa DNS devuelta vacía. Por tanto falta crear los registros web; no afirmar que basta esperar propagación.
Vercel proyecto existente reconoce electricidadlakuntza.com y www.electricidadlakuntza.com con verified=true. El raíz redirige 308 a www; dominio adjunto a producción (sin rama específica). Configuración DNS reporta misconfigured=true. Verificación de propiedad no equivale a DNS/HTTPS funcionales. No se modificó DNS ni producción en esta revisión.

## Propuesta de organización proporcionada al tamaño de dos personas
1. Elegir correo alojado con dos identidades individuales, Javier y Kristina; info@ pública y admin@ para gestión como alias/grupos/delegación según proveedor. Evitar contraseñas compartidas y cuatro buzones de pago por defecto. Valorar Zoho Mail Lite como solución de correo sin contratar una suite completa; precio final/región/funciones a confirmar antes de contratar. Workspace es alternativa si quieren Gmail/Drive, con mayor coste por usuario.
2. Mantener recuperación externa al dominio y segundo factor/códigos controlados por el negocio. No retirar Yahoo ni cambiar todos los accesos a la vez.
3. Cloudflare registrador/DNS; proveedor de correo para buzones; Resend existente para envíos CRM con dominio verificado y Reply-To atendido. No confundir alias/reenvío con buzón completo ni correo aceptado con entregado.
4. GitHub en organización del negocio con usuarios individuales y accesos técnicos delegados; Vercel/Supabase en equipos/organizaciones del negocio con propiedad/facturación adecuadas. Transferir proyecto/repositorio existente, no reconstruirlo, después de inventario/copias, condiciones/coste/permisos de transferencia y prueba de integraciones. Revisar reglas de GitHub según plan y uso comercial de Vercel (Hobby no admite uso comercial). No se ha contratado, transferido ni modificado membresía hoy.
5. Reconciliar DNS y acceso público con el plan de lanzamiento existente: dominio añadido a producción no implica aprobación para publicar cambios de PR ni abrir captación. Preparar/verificar antes de mutar.
6. Un número del negocio y una sola cuenta WhatsApp Business con dispositivos vinculados; llamadas/desvíos pendientes.

El detalle técnico de CRM/web/pruebas/seguridad y bloqueos sigue en docs/plan-publicacion-y-crm-2026-11-05.md y docs/encargo-crm-y-reunion-2026-11-03.md. Pasos siguientes dependen de la selección del correo y aprobación del presupuesto, no volver a pedir todos los datos de golpe.

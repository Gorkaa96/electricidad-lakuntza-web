# Dominio, titularidad y siguiente paso — 6 noviembre 2026

Actualiza las referencias de compra y titularidad de documentos anteriores. No supone lanzamiento ni traslado ejecutado.

## Datos confirmados por el usuario
- electricidadlakuntza.com comprado en Cloudflare, factura recibida. Cuenta del negocio con correo eleclakuntza@yahoo.es; conector Electricidad Lakuntza.
- El usuario corrigió la identificación: confirma que Electricidad Lakuntza es la razón social con la que consta el NIF E31283476 en Hacienda y en facturas de compra/venta. Usar este dato comunicado en lugar de presentar automáticamente los nombres de los socios como denominación de la entidad. No se ha cotejado documento fiscal por el agente. Forma jurídica pendiente de confirmación documental; no inventar CB/SL/sociedad irregular.
- Contacto del registro: Francisco Javier Hernandez Santana. Aceptar caracteres sin tilde cuando el formulario lo requiera.
- Objetivo: empresa de dos personas; web clara para clientes y CRM profesional propio; una línea/WhatsApp Business compartida, correo corporativo, propuesta oficial Feníe y seguimiento; migración gradual de control de los servicios al negocio. LinkedIn después del cierre de la plataforma.

## Comprobación de conectores
- Cloudflare: zona active, nameservers ara.ns.cloudflare.com y garret.ns.cloudflare.com, cuenta 6707af3f0cbc5384bcfdd07e9dec7522.
- La zona tiene cero registros DNS (respuesta total_count=0). No es solo propagación pendiente: falta configurar registros.
- Vercel: electricidadlakuntza.com y www.electricidadlakuntza.com agregados y verified=true. Dominio raíz redirige 308 a www. Sin gitBranch, asociados a producción actual.
- get_domain_config devuelve misconfigured=true para ambos, sin direcciones ni CNAME resueltos. Recomendaciones actuales devueltas: CNAME 91a4a8a2a39baa36.vercel-dns-017.com.; grupo IPv4 preferido 216.198.79.1 y 64.29.17.1. Volver a consultar antes de modificar DNS. No sustituir NS de Cloudflare por los de Vercel.
- No se han creado registros ni cambiado producción. HTTPS y disponibilidad web aún no acreditados con el dominio final. Decidir qué versión mostrar antes de conectar: la producción actual no es la Preview del CRM.

## Secuencia acordada de trabajo
1. Cerrar conexión del dominio y HTTPS con versión de destino explícita; no activar recepción pública por conectar DNS.
2. Asegurar control del negocio: cuentas individuales, recuperación y MFA; organización GitHub del negocio, equipo Vercel y organización Supabase. Gorka con acceso técnico delegado. Inventariar además Resend, Turnstile y secretos alojados; no copiar claves al repo/chat.
3. Preparar traspasos revisables preservando repo, rama, PR, integración Git, entornos Preview, permisos y datos; comprobar planes/costes y compatibilidad de protecciones antes de mover nada. Evitar transferir todos los servicios simultáneamente. No recrear base ni perder historial por cambiar propietario.
4. Configurar correo corporativo (recepción, respuestas, envío CRM y SMTP de invitaciones) y nuevo teléfono/WhatsApp.
5. Implementar pendientes técnicos del CRM del plan del 5 noviembre: estados fluidos, ficha, propuestas privadas versionadas, extracción/comparación revisada, correo con confirmación/adjunto/historial, seguimientos. Correo de cliente ya obligatorio en nuevas facturas.
6. Auditoría y correcciones de web, permisos, seguridad, privacidad, copias/restauración, E2E y aceptación. Autorizar lanzamiento por bloques con rollback.
7. LinkedIn y presencia en Google tras la base operativa.

## Traspasos y planes
GitHub debe quedar en organización del negocio con propietarios humanos y usuarios individuales, no un único usuario admin compartido. Vercel: revisar plan comercial y costes del equipo destino; Hobby es para uso personal no comercial, no asumir que basta para la web del negocio. Supabase permite transferencia entre organizaciones con requisitos; preparar revisión de integraciones, permisos y facturación. Ningún plan de pago ni traspaso se contrata/ejecuta con este documento.

Fuentes: https://docs.github.com/en/get-started/learning-about-github/types-of-github-accounts ; https://vercel.com/docs/plans/hobby ; https://supabase.com/docs/guides/platform/project-transfer

Pendientes completos: docs/plan-publicacion-y-crm-2026-11-05.md. Este nuevo estado prevalece sobre su apartado de compra y sobre la denominación comunicada inicialmente.

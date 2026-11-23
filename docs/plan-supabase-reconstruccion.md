# Recuperación y nueva configuración de Supabase — Electricidad Lakuntza

Estado: plan para ejecutar tras confirmar el proyecto nuevo y su coste (consultado: 0 €/mes). No se ha creado ni migrado la base de datos.

## Contexto verificado

- Organización Supabase: `electricidad-lakuntza`, ID `wdijjhuqptvwhhmhncss`.
- El 29/10/2026 la organización aparecía sin proyectos.
- La URL Supabase incrustada en la preview anterior era `vprczjegprkwzashxyul.supabase.co`, proyecto ahora eliminado.
- Vercel tiene una versión de preview READY, pero la base antigua ya no existe.
- La consulta de variables de entorno en Vercel devolvió HTTP 403: no se ha podido corregir la conexión desde herramientas autorizadas.

## Secuencia segura

1. Crear un proyecto Supabase limpio `electricidad-lakuntza-web`, región europea, dentro de la organización correcta, después de confirmar el coste.
2. Inventariar esquema real y dependencias. No asumir que `supabase/schema.sql` es completo: contiene solo tablas básicas de proyectos y no las tablas de revisión de facturas.
3. Preparar migración íntegra, idempotente y revisada. No aplicarla parcialmente sin RLS.
4. Tablas de trabajo: `admin_users` (membresía del panel), `invoice_review_leads` (solicitudes), `invoice_ocr_results` (lectura y diagnóstico auxiliar), `invoice_lead_events` (historial), `projects` y `project_images` (trabajos y fotos).
5. Buckets: `invoice-files` privado y `project-images` público solo para imágenes de proyectos autorizados. Comprobar política de subida, lectura y borrado desde roles anon/authenticated.
6. Configurar autorización del panel basada en ID de usuario de Auth y `admin_users` con políticas explícitas. No usar metadatos editables de usuario para roles.
7. Invitar al primer usuario administrador mediante Supabase Auth. No crear accesos compartidos ni registrar contraseñas en GitHub.
8. Conectar Vercel Preview y Production a las nuevas variables. Claves de servicio solo del lado servidor y nunca `NEXT_PUBLIC_`. Permisos de administrador de Vercel necesarios para crear/actualizar envs. Recompilar: Next.js incrusta la URL pública en los bundles.
9. Las nuevas solicitudes deben registrar el contacto y subir archivo de forma atómica o con compensación comprobada. Nunca mostrar confirmación real sin verificar insert + upload.
10. Notificación por email con remitente/dominio verificado; si falla, solicitud debe quedar marcada para seguimiento.
11. Probar fin a fin con archivo sintético sin datos personales: envío, lectura, permisos, registro de estado, notificación, borrado, ausencia de accesos anónimos.
12. Solo después publicar la web sin protección y activar SEO.

## Seguridad imprescindible

- RLS habilitada en **todas** las tablas `public`, con acceso a información privada restringido a administradores autorizados. `authenticated` sin condiciones adicionales NO equivale a administrador.
- Subidas anónimas protegidas frente a abuso: validaciones de tipo/tamaño/firma en el servidor y límite de tasa o mecanismo anti-bot. Si se usa un cliente de servicio para la inserción, debe permanecer exclusivamente en servidor y ejecutar las validaciones.
- No permitir SELECT público de solicitudes ni lectura pública de `invoice-files`.
- Los enlaces firmados deben tener duración breve.
- Las operaciones de eliminación no deben dar éxito si falla eliminar el archivo privado.
- No exponer variables de entorno, llaves privadas ni datos de facturas en logs.
- Política de conservación de documentos, privacidad y respuesta a solicitudes de supresión.
- El panel debe mostrar **error de conexión** si falla Supabase, nunca una lista vacía como si no hubiera solicitudes.

## Bloqueos operativos

- Falta confirmación de creación del proyecto nuevo (cifra consultada: 0 €/mes).
- El acceso a variables de entorno de Vercel está restringido (HTTP 403).
- No hay base activa donde probar migraciones, RLS, autenticación ni flujo real de facturas.

## Documentos relacionados

- `docs/flujo-revision-facturas.md`: recorrido del cliente y tratamiento interno.
- `supabase/schema.sql`: esquema parcial anterior, insuficiente para lanzar facturas.

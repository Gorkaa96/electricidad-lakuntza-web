# Guía de puesta en marcha — Electricidad Lakuntza (sin activar captación)

Última revisión: 30/10/2026. Documento interno. Ninguna credencial real está en el repositorio.

## 1. Supabase — proyecto ya creado

- Organización: `electricidad-lakuntza` (`wdijjhuqptvwhhmhncss`).
- Proyecto: `electricidad-lakuntza-web` (`yvrjrvropgouvzltwwvm`).
- Región: `eu-west-1` (Europa / Irlanda).
- Dashboard: https://supabase.com/dashboard/project/yvrjrvropgouvzltwwvm
- URL de API pública: `https://yvrjrvropgouvzltwwvm.supabase.co`.
- Estado comprobado: `ACTIVE_HEALTHY` el 30/10/2026.
- **No publicar ni conectar a producción** hasta completar usuarios, variables de Vercel y pruebas de seguridad.

## 2. Base de datos — migración aplicada y verificada

- Migración aplicada: `20261030112700_bootstrap_electricidad_lakuntza_secure_v2`.
- Fuente versionada: `supabase/bootstrap_v2.sql`. **No volver a ejecutarla** sin revisar las migraciones existentes.
- Seis tablas con RLS activado: `admin_users`, `invoice_review_leads`, `invoice_ocr_results`, `invoice_lead_events`, `projects`, `project_images`.
- Buckets: `invoice-files` **privado**, 10 MB; `project-images` público, 5 MB para imágenes de trabajos autorizados.
- Políticas inspeccionadas. El analizador de **seguridad** de Supabase no devolvió incidencias.
- Avisos de **rendimiento**: índices sin uso en una base vacía y políticas de lectura superpuestas para proyectos publicados/administradores. No son bloqueos de seguridad, pero conviene revisar tras empezar a usar el sistema.
- **Aún no probado de extremo a extremo**: inicio de sesión real, denegación por usuarios anónimos, subida, notificación y borrado de una factura sintética.

Para dar acceso al primer administrador, crear personalmente un usuario individual en Supabase **Authentication > Users** y confirmar su correo; después insertar su UUID en `public.admin_users` mediante un proceso autorizado. Nunca enviar contraseñas ni compartir claves secretas por chat. Deshabilitar registro público si no está previsto.

### Verificación posterior (30/10/2026)

- Usuario de Authentication: **1**, correo confirmado.
- Tabla `public.admin_users`: **1 administrador**, asociado al usuario autenticado. No hay facturas ni trabajos creados.
- La comprobación de seguridad detecta **`auth_leaked_password_protection`**, funcionalidad de Supabase Pro; se mantiene en Free. Exigir una contraseña larga y única; valorar MFA antes del lanzamiento.
- El despliegue de prueba `dpl_GGWpqSjsDsAite5CCHJJjkTzvibZ` recompiló la rama con las variables Preview actuales.
- En el bundle de la nueva preview se comprobó la **clave publishable del Supabase nuevo**, pero `NEXT_PUBLIC_SUPABASE_URL` todavía apunta al antiguo `vprczjegprkwzashxyul`. **No probar acceso ni usar facturas hasta actualizar la URL de Preview** a `https://yvrjrvropgouvzltwwvm.supabase.co` y lanzar una nueva compilación.
- La API de Vercel devuelve 403 al consultar las variables; el propietario debe cambiar la URL desde Project Settings > Environment Variables, evitando valores duplicados o específicos de rama.
- El acceso real autenticado al administrador y las pruebas E2E siguen pendientes.

## 3. Variables Vercel

**Configurar primero SOLO Preview.** La base antigua fue eliminada y la producción continúa en una versión anterior. No reutilizar su referencia.

| Nombre | Visibilidad | Función |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Pública | URL de la base nueva |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Pública | Clave publishable/anon del proyecto |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secreto de servidor** | Guardar solo para subida validada desde la acción de servidor |
| `INVOICE_INTAKE_ENABLED` | Servidor | `false` en pruebas iniciales; `true` **solo** tras pasar seguridad y antispam |
| `RESEND_API_KEY` | Secreto de servidor | Aviso opcional por correo tras registrar lead |
| `RESEND_FROM` | Servidor | Remitente verificado en Resend |
| `INVOICE_REVIEW_TO` | Servidor | Destinatario interno autorizado |

La clave `SUPABASE_SERVICE_ROLE_KEY` nunca puede llevar el prefijo `NEXT_PUBLIC_`. Después de modificar claves públicas, recompilar para que el navegador use la referencia nueva. **Bloqueo confirmado el 30/10/2026:** la integración de Vercel devolvió HTTP 403 tanto al listar como al crear variables. El propietario del proyecto deberá introducirlas desde Vercel > Project > Settings > Environment Variables o revisar los permisos del conector. No se ha configurado ninguna variable nueva desde esta sesión.

## 4. Prueba controlada antes de publicar

1. Comprobar que el formulario **no acepta envíos** si `INVOICE_INTAKE_ENABLED` no es `true`.
2. Añadir protección frente a abuso (limitación real de tasa y/o desafío anti-bot, pendiente) antes de activar.
3. Enviar una factura sintética sin datos personales, con una persona de contacto distinta del titular ficticio.
4. Confirmar que el archivo queda privado y la solicitud existe una única vez.
5. Entrar con usuario administrador y confirmar acceso a datos, documento, diagnóstico, estados e historial.
6. Acceder sin sesión y con usuario no autorizado: comprobar prohibición.
7. Simular un fallo de email: debe permanecer la solicitud interna sin perderse.
8. Borrar la solicitud y comprobar que desaparecen archivo y filas; probar denegación al eliminar documento.
9. Verificar legal, conservación, teléfono/correo y notificación.
10. Publicar en producción únicamente tras superar lo anterior y comprobar rutas de dominio/SEO.

## 5. Contexto de diseño

Diseño V3 y mejoras de facturas integradas en PR #9; los antiguos PR #6 y #8 están cerrados como propuestas independientes. Rama `integration/launch-prep-2026-10-29` reúne el trabajo y añade control de acceso al envío. No fusionar a `main` hasta la validación de esta rama y la del backend.

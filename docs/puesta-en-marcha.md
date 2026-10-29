# Guía de puesta en marcha — Electricidad Lakuntza (sin activar captación)

Última revisión: 29/10/2026. Documento interno. Ninguna credencial real está en el repositorio.

## 1. Supabase y cuota

La organización `electricidad-lakuntza` (`wdijjhuqptvwhhmhncss`) no tiene proyectos actualmente. Si un proyecto gratuito no puede crearse aun así, verificar la cuota del usuario y la de otros propietarios o administradores de esa organización. El límite Free se calcula considerando los proyectos activos de los miembros con esos permisos en todas sus organizaciones. No crear otra cuenta Gmail como primera medida.

El coste consultado para crear un proyecto Free en esta organización fue **0 por mes**, pero su creación requiere una confirmación explícita en Supabase. No se ha aplicado ningún esquema ni se han creado usuarios.

## 2. Base de datos

Una vez creado el proyecto: revisar y ejecutar `supabase/bootstrap_v2.sql` solo si el proyecto está nuevo y vacío. No ejecutarlo sobre bases existentes sin auditoría/migración. Validar que existen tablas, políticas RLS y buckets. El archivo es un **borrador sin ensayo en una base real**.

Comprobar expresamente:
- No se pueden consultar solicitudes, OCR o documentos con clave pública y sin sesión.
- Usuario autenticado que no esté en `admin_users`: denegado.
- Administrador legítimo: acceso únicamente tras inicio de sesión.
- El bucket `invoice-files` es **privado**.
- `project-images` es público: subir únicamente fotografías autorizadas y sin datos de terceros (incluso si el proyecto aún es borrador).

Crear un usuario individual en Supabase Auth, verificar su email y añadir su UUID al registro `public.admin_users`. No publicar contraseñas ni guardarlas en el código. Desactivar el registro público si no está previsto.

## 3. Variables Vercel

La Preview y Production necesitan la URL y clave pública correctas del proyecto. La base antigua fue eliminada; no reutilizar su referencia.

| Nombre | Visibilidad | Función |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Pública | URL de la base nueva |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Pública | Clave publishable/anon del proyecto |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secreto de servidor** | Guardar solo para subida validada desde la acción de servidor |
| `INVOICE_INTAKE_ENABLED` | Servidor | `false` en pruebas iniciales; `true` **solo** tras pasar seguridad y antispam |
| `RESEND_API_KEY` | Secreto de servidor | Aviso opcional por correo tras registrar lead |
| `RESEND_FROM` | Servidor | Remitente verificado en Resend |
| `INVOICE_REVIEW_TO` | Servidor | Destinatario interno autorizado |

La clave `SUPABASE_SERVICE_ROLE_KEY` nunca puede llevar el prefijo `NEXT_PUBLIC_`. Después de modificar claves públicas, recompilar para que el navegador use la referencia nueva. La herramienta de Vercel actualmente no permite inspeccionar variables (403); se necesita el acceso adecuado.

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

Diseño V3 en PR #8. Mejora de facturas en PR #6. Rama `integration/launch-prep-2026-10-29` reúne el trabajo y añade control de acceso al envío. No fusionar a `main` hasta la validación de esta rama y la del backend.

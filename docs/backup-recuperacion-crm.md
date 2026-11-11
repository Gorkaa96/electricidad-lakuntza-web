# Electricidad Lakuntza — Copias de seguridad y recuperación del CRM

**Estado: diseño de procedimiento, NO hay copia recuperable verificada.** Última inspección: 10/11/2026. Sin clientes reales en captación de producción.

## 1. Inventario técnico comprobado (metadatos, sin datos personales)
- Plataforma: Supabase Free (sin copias diarias gestionadas).
- Base de datos: ~12 MB (incluye índices, esquema y tablas del sistema).
- Storage: bucket privado `invoice-files`, 2 objetos (~90 KB), ambos referenciados por expedientes; `project-images`, 0 objetos.
- Aplicación: 1 cuenta de equipo activa y ningún factor MFA verificado en Auth.
- Expedientes: factura, OCR, propuesta Feníe y consulta comercial presentes. No confundir con datos ficticios eliminados ni borrar archivos automáticamente.
- El repositorio contiene migraciones de base de datos, pero **migraciones no son copias de datos**.

## 2. Política mínima propuesta antes de captar datos reales
**Objetivo de recuperación:** punto máximo de pérdida ≤ 24 horas y prueba de restauración fuera de producción. Las copias y los secretos no deben guardarse en GitHub, Vercel, el chat ni en un disco compartido sin cifrar.

1. Base de datos (roles + esquema + datos) exportada diariamente desde un equipo/ejecutor de confianza.
2. Archivos completos de **Storage**, descargados con su ruta y tamaño/huella; los volcados SQL contienen metadatos pero NO los PDF.
3. Auth y configuración: plan específico para cuentas, identificadores, ajustes de proyecto, URL de redirección, SMTP y claves; **el comando Supabase CLI db dump excluye los esquemas internos como auth y storage**. No asumir que `roles.sql + schema.sql + data.sql` reconstruye usuarios o archivos.
4. Copia externa **cifrada AES-256 o equivalente**, con acceso restringido, dos destinos distintos y claves custodiadas por propietario. Registro de fecha/resultado. Retención propuesta: últimos 7 diarios y 4 semanales, ajustada por finalidad/privacidad y capacidad.
5. Ensayo de recuperación en **entorno aislado**, nunca sobre la base en uso. Comprobar que se pueden ver expedientes, abrir los PDF, iniciar sesión y respetar los permisos RLS. Si no se verifica, el P0 permanece abierto.
6. Cuando se usen copias automáticas gestionadas de Supabase Pro, **continuar respaldando Storage por separado**.

## 3. Exportación manual de la base de datos en plan Free (instrucciones, no ejecutadas)

Documentación oficial: https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore

El propietario instala **Supabase CLI y Docker Desktop** en equipo de confianza. Obtiene el enlace de conexión desde Supabase Dashboard → Connect → Session pooler. No pegar contraseñas, URLs con credenciales ni archivos de backup en ChatGPT, tickets o GitHub.

En una carpeta local cifrada, con variable de entorno `DB_URL` establecida de forma segura y sin registrar el valor en el historial:

```bash
supabase db dump --db-url "$DB_URL" --role-only -f roles.sql
supabase db dump --db-url "$DB_URL" -f schema.sql
supabase db dump --db-url "$DB_URL" --data-only --use-copy -f data.sql
```

> **Límite importante:** los archivos generados son una parte del respaldo: no incluyen los objetos privados de Storage, el contenido completo de Auth gestionado por Supabase ni toda la configuración del proyecto. Evitar prometer restauración completa con solo estos tres archivos. Verificar la semántica actual de CLI y la lista de esquemas incluidos antes de cada ejecución.

**Verificación mínima:** los tres archivos se generan sin errores, no están vacíos cuando deben contener datos; calcular y guardar sumas SHA-256 en un manifiesto junto con la fecha/versión del CLI y el destino. Cifrar inmediatamente, retirar las copias en claro, comprobar que el archivo cifrado puede descifrarse. No registrar contraseñas en logs.

## 4. Exportación de documentos privados de Storage
Documentación: https://supabase.com/docs/guides/storage/management/download-objects

- Hasta que haya cientos de ficheros, el propietario puede guardar una copia cifrada desde **Storage → Files** del bucket privado `invoice-files`, preservando subcarpetas/identificadores. Asegurar también `project-images` si se utiliza en el futuro.
- Para automatizar: cliente compatible S3 como rclone/Cyberduck o scripts oficiales de migración; secretos de acceso limitados y rotados, destino externo cifrado. No hacer públicos los buckets.
- Registrar el número de archivos, rutas y suma de tamaños y compararlos con el inventario SQL. Restaurar uno de prueba en un entorno aislado y verificar que se abre el PDF.
- La eliminación de un expediente debe eliminar su PDF y propuesta conforme a política de conservación; no restaurar indiscriminadamente datos cuyo borrado ha sido solicitado por el interesado.

## 5. Restauración de prueba — criterios de aceptación
1. Aislar el destino (otro proyecto, base de ensayo o sandbox) y comprobar permisos antes de importar. **No restaurar sobre producción durante pruebas**.
2. Restaurar el esquema y los datos de aplicación desde la exportación siguiendo la documentación oficial; resolver dependencias de Auth y Storage antes de conectar el frontend.
3. Recuperar objetos privados conservando rutas y acceso privado.
4. Probar una cuenta de prueba, permisos por rol, 1 expediente, 1 OCR, 1 propuesta PDF y un caso de borrado.
5. Comprobar una fila de cada tabla crítica y el número de archivos. Validar que la web pública no expone ningún archivo.
6. Documentar fecha, responsable, resultado y problema detectado; si falla la recuperación, NO cerrar el bloqueo.

## 6. Cómo decidir el destino del backup
- **Opción A — sin nueva suscripción:** exportar manualmente y almacenar copias cifradas fuera de Supabase (equipo/USB empresarial seguro más segunda ubicación controlada). Requiere disciplina y no reemplaza una restauración probada.
- **Opción B — operación comercial recomendada:** Supabase Pro para backup diario gestionado y anti-pausa, más exportación externa independiente de los PDF; comprobar también Auth y restaurar en sandbox. Es una suscripción de pago: **no se contrata sin aprobación expresa**.
- **Automatización posterior:** escoger un almacenamiento empresarial controlado (R2/Drive/OneDrive con cifrado), configurar credenciales mínimas y un trabajo programado, con alerta si falla. Evitar GitHub Actions artifacts sin cifrar, ya que contienen documentación personal.

## 7. Puntos de seguridad asociados
- Sin factor MFA verificado, por tanto el refuerzo de acceso **aún no está cerrado**. Preparar incorporación TOTP de propietario sin bloquear su sesión, después exigir MFA gradualmente.
- Supabase Security Advisor advierte `auth_leaked_password_protection` desactivado y `app_private.public_intake_quota` con RLS sin políticas. La segunda tabla es interna; verificar que solo se consume por función protegida. No abrir políticas por simple eliminación de avisos.
- Revisar y revocar sesiones antiguas tras activar MFA y garantizar recuperación de acceso, no antes.

## 8. Registro de aceptación
| Control | Estado |
|---|---|
| Inventario BD/Storage | Comprobado |
| Destino cifrado externo aprobado | Pendiente |
| Volcado de datos generado | Pendiente |
| Archivos PDF copiados | Pendiente |
| Cuentas/Auth recuperables | Pendiente |
| Restauración en entorno aislado | Pendiente |
| Periodicidad y alerta de fallo | Pendiente |
| P0 respaldos y recuperación | **ABIERTO** |


## 9. Primera ejecución gratis en Windows — actualización 11/11/2026

Herramienta preparada en **scripts/backup-crm-windows.ps1**, en esta misma rama de GitHub. **No ha sido ejecutada ni validada en el PC del propietario**; el P0 de recuperación continúa abierto.

### Requisitos sin contratar servicios
1. Clonar/descargar esta rama del repositorio a un directorio no sincronizado. Instalar [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started), [Docker Desktop](https://www.docker.com/products/docker-desktop/) y [7-Zip](https://www.7-zip.org/).
2. Abrir PowerShell en la raíz del proyecto y vincularlo una sola vez con estos dos comandos (pueden solicitar iniciar sesión y contraseña de base de datos; **no pegar secretos en el chat**):

    supabase login
    supabase link --project-ref yvrjrvropgouvzltwwvm

   La CLI requiere un proyecto inicializado. Si falta la configuración local, usar un directorio limpio separado, ejecutar supabase init y vincularlo allí; situar allí también el script dentro de una carpeta scripts. No sobrescribir las migraciones del repositorio.
3. Abrir Supabase Dashboard → Storage → bucket privado **invoice-files**. Descargar cada objeto manteniendo los subdirectorios y nombres relativos en una carpeta local protegida, como C:\ElectricidadLakuntza\storage-descargado. No cambiar el bucket a público. Actualmente el inventario tiene dos objetos, pero **confirmar el número antes de cada copia**.
4. Con el PC y el disco cifrados (BitLocker u otro equivalente), ejecutar desde la raíz del proyecto:

    .\scripts\backup-crm-windows.ps1 -StorageFolder 'C:\ElectricidadLakuntza\storage-descargado' -ExpectedStorageFiles 2

   La política de ejecución de PowerShell puede bloquear scripts descargados. Revisar el archivo antes de permitir su ejecución. No desactivar las protecciones del sistema globalmente ni ejecutarlo como administrador.

### Funcionamiento y limitaciones
- Verifica Docker, Supabase CLI, 7-Zip, el identificador del proyecto remoto y el recuento de ficheros descargados.
- Genera una copia lógica de roles, esquema y datos (roles.sql, schema.sql y data.sql) y añade los documentos descargados. Calcula SHA-256 de cada fichero en un manifiesto interno.
- Crea un archivo **7z cifrado** con los nombres también cifrados. La contraseña se solicita de forma interactiva; nunca debe pasarse por línea de comandos. Se solicita de nuevo para comprobar la integridad.
- Elimina los **ficheros temporales creados por el script**, no las descargas originales del usuario. Evitar PCs sin cifrado de disco porque existen temporales SQL en claro durante la operación.
- El archivo no equivale a una copia íntegra de los sistemas internos de Auth y Storage ni del proyecto Supabase. No reconstruye por sí solo usuarios, identidades o configuraciones de acceso.
- El origen de los archivos PDF (directorio storage-descargado) sigue en claro: se debe proteger y, después de comprobar el archivo cifrado y una segunda copia, eliminar con arreglo a la política de conservación.

### Para aceptar el respaldo
- Verificar el archivo cifrado y guardar el hash SHA-256 de la copia.
- Copiar el 7z cifrado a **otro dispositivo o destino controlado**, independiente del PC. Guardar la contraseña por separado, sin publicarla ni enviarla por correo/chat.
- Demostrar una **restauración de datos y PDF en entorno de prueba aislado**, sin tocar producción, y disponer de un plan de recuperación de las cuentas Auth. Hasta completar estos puntos, **P0 de recuperación abierto**.

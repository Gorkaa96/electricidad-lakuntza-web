# Electricidad Lakuntza — Copias de seguridad y recuperación del CRM

**Estado a 18/11/2026: copia lógica cifrada generada y comprobada; segunda copia de OneDrive comprobada por propietario; restauración integral pendiente.** Sin captación autorizada de clientes reales.

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
3. Auth y configuración: el volcado concreto de noviembre **sí incluye datos de auth.users, auth.identities y otras tablas Auth, además de metadatos Storage**; se confirmó al inspeccionar sus sentencias COPY. Esto no garantiza restauración de los servicios gestionados, ajustes, claves, SMTP, OAuth ni los bytes de Storage. Plan específico para reconstrucción de cuentas y servicios. No asumir que roles.sql + schema.sql + data.sql es una recuperación integral.
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

> **Límite importante:** los archivos generados son una parte del respaldo: no incluyen los bytes de objetos privados de Storage ni toda la configuración del proyecto. El data.sql inspeccionado sí contiene auth.users, auth.identities y otras tablas Auth, con sesiones/tokens potencialmente sensibles. La recuperación funcional sigue sin estar acreditada. Evitar prometer restauración completa con solo estos tres archivos. Verificar la semántica actual de CLI y la lista de esquemas incluidos antes de cada ejecución.

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
| Segunda ubicación cifrada | OneDrive personal; archivo leído, descifrado y SHA-256 comprobado por propietario 18/11/2026 |
| Volcado de datos generado | Verificado por propietario 18/11/2026 |
| Archivos PDF copiados | Incluidos en copia verificada 18/11/2026 |
| Cuentas/Auth recuperables | Pendiente |
| Restauración en entorno aislado | Pendiente |
| Periodicidad y alerta de fallo | Pendiente |
| P0 respaldos y recuperación | **ABIERTO** |


## 9. Primera ejecución gratis en Windows — actualización 11/11/2026

Herramienta preparada en **scripts/backup-crm-windows.ps1**, en esta misma rama de GitHub. **Fue ejecutada y el archivo cifrado se validó en PC-GHU el 18/11/2026**, como detallan los apartados posteriores. El P0 de restauración integral continúa abierto.

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


## 10. Primera copia cifrada verificada — 18/11/2026

Ejecución del propietario desde Windows confirmada mediante el registro de PowerShell:
- Supabase CLI v3.1.0: exportaciones de roles.sql, schema.sql y data.sql correctas usando --remote.
- 7-Zip 26.06: creación del archivo con 6 ficheros (172105 bytes sin comprimir) y comprobación interactiva de contraseña e integridad exitosa (Everything is Ok); método 7zAES.
- Archivo: ElectricidadLakuntza-20261118-172614.7z (77072 bytes).
- SHA-256: f57c196d2a0d3af618a50f0124afd5190d689e7f0503d3241f89eeedd0f12eb6.
- Inventario remoto consultado después: 2 PDF privados, 46181 y 45565 bytes, con las mismas rutas y fechas de modificación del 10/11 que en la descarga original. project-images sigue vacío.
- Evidencia recibida: registro de ejecución e inventario; no se ha recibido ni inspeccionado el archivo cifrado ni su contraseña.

Estado actualizado: **copia lógica y PDF generados y comprobados por el propietario**. No equivale a recuperación completa.
Pendientes: segunda ubicación independiente bajo control del propietario; plan de recuperación Auth y configuración; restauración integral aislada y periodicidad regular con comprobación de fallos. Mantener P0 recuperación ABIERTO. Sin nuevas suscripciones y sin cambios en producción.


## 11. Segunda ubicación — comunicación del propietario 18/11/2026
- Archivo cifrado de prueba copiado al OneDrive personal del propietario desde PC-GHU, equipo de sobremesa designado para copias y pruebas locales. El código se mantiene en GitHub y se utiliza también desde portátil.
- Copia externa comunicada, no se ha inspeccionado la cuenta ni verificado sincronización o descarga independiente. Para datos reales, revisar autorización corporativa, condiciones del proveedor y acceso/retención; no guardar PDF ni SQL en claro en OneDrive.
- La restauración aislada y el plan Auth/config siguen pendientes. No se autoriza captación de datos reales por este avance.


## 12. Cierre de sesión — 18/11/2026

- PC-GHU: copia OneDrive leída, hash del archivo coincide con el original; extracción de 6 archivos correcta y SHA-256 de los 5 elementos del manifiesto correcto. No se comprobó una descarga independiente desde otro equipo.
- IMPORTANTE: rectificación de alcance de backup: la inspección de cabeceras COPY de data.sql confirma que incluye auth.users, auth.identities, otras tablas Auth (incluyendo sesiones y tokens) y metadatos Storage, además de los datos CRM. No asumir exclusión de los datos Auth. El esquema gestionado y la configuración de proyecto no quedan reconstruidos automáticamente. Los volcados son sensibles y se deben cifrar.
- Entorno CLI local separado, PostgreSQL 17, proyecto local prueba-restauracion-20261118, puertos API 55321, DB 55322, Studio 55323; no vinculado a producción. Contenedor supabase_db_prueba-restauracion-20261118.
- Se generó data-restauracion-local.sql excluyendo COPY de sesiones/tokens y otras tablas Auth salvo users/identities, y Storage (recuperación posterior por API). Se copiaron roles.sql, schema.sql y SQL filtrado al contenedor. La importación en transacción única con ON_ERROR_STOP falló en roles.sql línea 13: supabase_admin es rol reservado. La consulta posterior confirma que public.admin_users no existe. No hay restauración SQL exitosa todavía.
- Próxima sesión: revisar únicamente sentencias de roles y sus dependencias sin exponer secretos, excluir ALTER de roles administrados cuando ya existan localmente (no elevar privilegios ni modificar producción), verificar esquema/funciones/policies y compatibilidad de Auth, evitar reactivar sesiones originales, usar credenciales de ensayo y recuperar PDFs por Storage API manteniendo sus rutas. Validar recuentos, integridad referencial y acceso permitido/denegado; borrar copias SQL temporales del contenedor y limpiar entorno de ensayo al terminar.
- El propietario estará fuera y retoma cuando tenga disponibilidad. Objetivo declarado: antes del 31/12/2026, web y CRM publicados para captación y gestión real, LinkedIn preparado y activo. El propietario aportará cifra inicial de clientes y contratos para establecer línea base. Mantener bloqueo comercial hasta criterios de seguridad, legalidad, recuperación y alojamiento.
- Recomendada parada del entorno local con supabase stop desde su carpeta (ejecución no confirmada), conservar archivo cifrado y proteger temporales en claro. No se han hecho cambios en producción.


## 13. Próximo ensayo LOCAL (cuando se retome PC-GHU; no ejecutado)

La importación anterior utilizó ON_ERROR_STOP + --single-transaction e interrumpió el proceso con el error de rol gestionado "supabase_admin" al procesar /tmp/roles.sql. Por eso public.admin_users no existía al verificar después.

Ruta local protegida: C:\Users\gorka\CopiasElectricidadLakuntza\prueba-restauracion-20261118; base local 127.0.0.1:55322; contenedor supabase_db_prueba-restauracion-20261118. No relink remoto. Verificar que el entorno realmente está en ese contexto y proteger los puertos (CLI los expone por 0.0.0.0; evitar redes no confiables). No subir dumps a GitHub ni a portátil de Barranquesa.

**Próxima prueba sugerida:** inspeccionar localmente los roles declarados y las sentencias que afectan a roles internos; como los roles gestionados ya existen en la pila local, ensayar una importación de schema.sql + data-restauracion-local.sql sin roles.sql, solo en la base nueva/aislada y bajo transacción única con ON_ERROR_STOP. Primero comprobar las dependencias de roles y si se requieren roles propios; no borrar ni crear roles privilegiados a ciegas. No restaurar encima de producción ni ejecutar supabase db reset sobre un proyecto vinculado.

Tras éxito: comparar recuentos (no contenido) de tablas, comprobar Auth sin sesiones originales, roles y RLS; restaurar los PDF a Storage local conservando rutas y bucket privado; probar acceso autorizado y denegado. Si falla, detener y registrar error en vez de repetir en bucle.

Al terminar, eliminar de forma segura los SQL extraídos y los temporales en el contenedor, manteniendo únicamente copia cifrada y evidencias no sensibles. El cierre P0 requiere recuperación funcional, no solo SQL importado.

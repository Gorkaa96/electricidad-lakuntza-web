# Operativa preparada para validar con el titular

Fecha: 03/11/2026. No activa recepción pública, no cambia planes ni ejecuta borrados/restauraciones.

## Atención diaria
1. La persona responsable abre Oportunidades y Facturas al comenzar y antes de finalizar la jornada. No depender exclusivamente del email.
2. Revisa nuevas, sin asignar, seguimiento vencido y avisos pending/failed. accepted solo significa aceptación por el proveedor de correo.
3. Asigna a un agente autorizado y registra la siguiente acción. Introduce manualmente las consultas recibidas por WhatsApp/teléfono; no existe importación automática.
4. Las ofertas de luz/gas se comparan en el CRM oficial Feníe. El CRM interno no genera tarifas ni contratos. La persona revisora comunica la propuesta y registra la decisión.
5. Cargadores y asesoría son trabajos propios; alarmas se comercializan mediante Feníe y Movistar Prosegur presta el servicio.
6. No copiar facturas a correos, chats ni notas de seguimiento. Registrar solo lo necesario.

**Pendiente de decisión:** responsable, suplente, horario y tiempo de respuesta. Propuesta operativa para aprobar: revisión cada día laborable y primer contacto en el siguiente día laborable. No publicar ese compromiso hasta aceptarlo.

## Alta y baja de equipo
- Owner conserva la capacidad de administración; no se comparten cuentas.
- Agente con lectura/edición de asignadas por defecto. Ampliar permisos solo si existe necesidad.
- Invitar mediante correo SMTP verificado; la persona invitada establece su contraseña.
- Si llega la invitación pero falla la membresía, no asumir acceso válido: revisar Auth y admin_users con el propietario y reparar de forma controlada.
- Al dar de baja, desactivar membresía y revisar expedientes asignados. Las nuevas peticiones consultan permisos actuales; una descarga ya completada no puede recuperarse del equipo receptor.
- MFA y comprobación de contraseñas filtradas quedan pendientes de configuración/viabilidad del plan.

## Borrado y derechos
- Identificar la solicitud con información mínima; no pedir documentos de identidad de forma automática.
- Factura vinculada: usar el flujo de eliminación de Facturas para intentar retirar primero el objeto y después los datos/CRM. Ante fallo, no anunciar eliminación completa.
- Consultas sin archivo: usar eliminación de oportunidad con confirmación.
- Si hay error parcial, conservar el expediente y registrar la incidencia para reconciliar fila/objeto. No limpiar storage.objects por SQL.
- La expiración y borrado en copias deben formar parte del procedimiento de derechos.
- **No existe borrado automático por antigüedad:** faltan los plazos aprobados por finalidad. No inventar un plazo legal ni aplicar eliminación masiva.

## Copia y recuperación: procedimiento preparado, ejecución pendiente
La copia de la base de datos no incluye los bytes de Storage: [documentación oficial](https://supabase.com/docs/guides/platform/backups).

Antes de admitir datos reales, el propietario debe aprobar:
- Responsable y suplente de copias/restauración.
- Destino privado cifrado y control de acceso; nunca GitHub ni el bucket público.
- Frecuencia, retención y pérdida máxima de datos aceptable; propuesta a validar: copia diaria y comprobación periódica.
- Objetivo de recuperación y presupuesto, sin contratar servicios automáticamente.

### Ejecución autorizada
1. Mantener las dos banderas de captación desactivadas mientras se prueba recuperación.
2. Inventariar tablas, esquema/migraciones, roles y bucket privado. Comprobar si el plan tiene backups y con qué retención; no presumirlo.
3. Obtener copia consistente de base de datos por la vía soportada de Supabase y copia separada de los objetos. Mantener un manifiesto protegido de objeto, tamaño y hash.
4. Restaurar primero en un entorno aislado aprobado, no sobre este proyecto. La creación del entorno y su coste requieren decisión del propietario.
5. Verificar recuentos, integridad, RLS, membresías, enlaces de archivo y lectura/borrado de un PDF sintético con los roles permitidos; denegar anon/agente ajeno.
6. Registrar fecha, origen, entorno, duración, errores, recuentos y hashes. No guardar claves ni datos personales en el informe.
7. Solo considerar operativa la copia cuando el ensayo de restauración pasa. No borrar una copia válida durante el ensayo.

## Incidencia
1. Cerrar captación mediante flags; mantener la evidencia necesaria con acceso restringido.
2. Identificar el alcance con el titular y el responsable técnico. No reenviar documentos privados para diagnosticar.
3. Corregir/rotar lo afectado directamente en las plataformas, restaurar solo con alcance aprobado y verificar permisos.
4. La asesoría/titular decide las obligaciones y comunicaciones aplicables. Este procedimiento técnico no sustituye esa valoración.
5. Reabrir únicamente tras pruebas y autorización del titular.

## Aceptación
El procedimiento está redactado; quedan por aprobar responsables, tiempos, retención, destino/plan de copias y ejecutar la recuperación real. Ninguno consta como realizado por tener este documento.

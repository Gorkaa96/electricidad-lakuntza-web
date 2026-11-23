# Diseño y lectura automática — 3 noviembre 2026

Web: marca verde Lakuntza (#245E36), fondo claro (#F7FAF6), texto verde profundo (#173A29), superficies blancas y bordes (#DCE6DE). Tipografía del sistema sin proveedor externo. Portada con una acción principal de factura y cuatro accesos ordenados: luz/gas, alarmas, cargadores, asesoría. El catálogo y CRM conservan los cinco servicios. Feníe mantiene su papel real y no recibe atribución de servicios propios.

CRM: fondo gris frío (#F3F5F6), texto (#182A25), acción verde profundo (#1B4E3D). Navegación persistente, resumen operativo con datos sujetos a RLS, búsqueda de facturas y estados legibles. Sin métricas inventadas, decoración comercial o cambios de permisos.

La extracción se ejecuta desde la acción de recepción, después de guardar documento, expediente y aviso. Se espera en el servidor, sin depender de abrir el panel. El procesamiento manual usa el mismo servicio con autenticación y RLS. Una actualización condicionada impide iniciar dos lecturas simultáneas; el reintento explícito permite recuperar bloqueos de más de diez minutos. Fallos de lectura conservan factura y expediente para revisión.

PDF con texto: lectura automática. Imágenes, PDF escaneados o protegidos: revisión manual; OCR de imagen todavía no implementado. La cobertura de campos no es porcentaje de exactitud. No se realizan comparación comercial, contratación ni promesas de ahorro automáticas. Comparación final en el CRM oficial de Feníe.

Validar: E2E de recepción comprueba lectura automática sin pulsar el botón; lectura manual conserva su prueba separada. Pruebas públicas revisan móvil, teclado y accesibilidad. Validar sesiones de owner/admin/agent y restricciones de asignación. No publicar producción con esta rama sin aprobación.

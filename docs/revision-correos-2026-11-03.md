# Revisión de adjuntos de Javier — 03/11/2026

## Alarmas: información ya recibida
Correo «Alarmas» del 02/11/2026. Se han leído los tres PDF originales y contrastado visualmente el flyer y las condiciones de la cerradura. Los originales permanecen en Gmail; no se copian al repositorio.

- Flyer hogar de octubre: cuota anunciada 48,90 €/mes IVA incluido, con actualizaciones previstas en contrato.
- Instalación promocionada hasta el 30/11/2026, condicionada a evaluación crediticia positiva. No equivale a instalación gratuita incondicional.
- Beneficio Feníe: 10 €/mes en puntos del Plan Épico, máximo 24 meses, manteniendo activos suministro Feníe y alarma en cada asignación. El folleto excluye el beneficio si se cancela la alarma en los primeros seis meses. No es un descuento automático de 10 € sobre la cuota de alarma.
- Seguros denominados comercialmente garantías antiocupación/antirrobo, seguro antiatraco y custodia de llaves: el flyer indica 24 meses y remite al contrato. No confundir esta duración con la permanencia de la alarma.
- Folleto de seis páginas: CRA, control por app y equipamiento/opciones para interiores, exteriores y mascotas. Intervención presencial sujeta a cobertura geográfica.
- Cerradura inteligente: control remoto, cierre automático, sensor y bombín, instalación profesional MPA. Su promoción de pack gratis a 48,90 €/mes y 99 € de instalación indica únicamente hasta el 31 de octubre: **caducada**, pendiente de renovación expresa.

La página incorpora las opciones estables y explica el carácter de puntos del Plan Épico. No publica precios ni campañas como vigentes basándose solo en un PDF pasado. Movistar Prosegur Alarmas instala y presta el servicio; Electricidad Lakuntza comercializa mediante Feníe.

### Pedir solamente lo que aún falta
Confirmación de campaña actual del canal y renovación de cerradura si procede; permanencia/penalización y condiciones completas del contrato; cobertura efectiva en la zona; propuesta de negocio; comisiones y circuito de alta/posventa. El correo no explica estos extremos.

## Factura real: ensayo privado del lector
Documento adjunto del segundo correo señalado por el usuario. No se guardan nombre, NIF, CUPS, dirección, número de factura, IBAN, importes concretos del cliente ni el PDF en GitHub, artefactos CI o Keep.

El PDF contiene dos páginas y texto seleccionable. Se ejecuta el mismo lector pdf-parse 2.4.5 y la misma función de extracción que usa la aplicación, en temporal privado. No necesita OCR de imagen ni proveedor de IA externo.

El ensayo detectó fallos del parser: referencias/fechas ausentes, consumo de seis periodos ignorado, potencias incompletas y expresiones codiciosas que truncaban los importes de resumen. Se corrigen:
- Referencia y fechas del bloque «Fecha y Nº Factura»; periodo «del … al …» y días explícitos.
- Potencias P1–P6, consumo activo P1–P6 con ceros y suma, sin confundirlo con reactiva o históricos.
- Importes completos desde líneas de resumen, IVA separado de su base y fecha final de contrato.
- Evitar resumir una tarifa de seis periodos en un único precio de energía.
- CRM muestra los seis periodos sin etiquetar P1/P2/P3 como punta/llano/valle en una 3.0TD; porcentaje identificado como campos detectados, no probabilidad de acierto.
- Revisión humana obligatoria, sin dictamen automático de ahorro.

Regresiones públicas usan datos íntegramente ficticios con el mismo patrón de maquetación. No contienen valores de la factura.

## Límite de la prueba
Lectura y parsing del PDF real contrastados contra sus páginas; esto no prueba subida web, Storage, Auth, correo ni el circuito CRM desplegado. Esos pasos siguen bloqueados por la sesión owner y configuración pendiente de captcha/secretos/correo. No se crea una oportunidad real ni se contacta a la clienta. Producción y recepción pública siguen cerradas.

Ver [lista única](lista-unica-cierre.md) y [activación](activacion-segura-cloud.md).

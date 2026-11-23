# Propuesta de diseño corporativo V2 — Electricidad Lakuntza

**Estado:** propuesta para revisión, no versión definitiva ni autorizada para lanzamiento. 29 de octubre de 2026.

## Objetivo

La web debe generar confianza y solicitudes reales sobre dos servicios comerciales destacados al mismo nivel visual: **luz/gas y alarmas**. La energía es la primera prioridad del funnel; las alarmas ocupan el mismo peso visual. Las instalaciones son la tercera línea y se ofrecen conforme a la capacidad operativa real. No afirmar precios, ahorros, certificaciones ni resultados no verificados.

## Identidad visual

- **Carbón verde profundo** `#0D1712`: superficies de presentación, portada y contacto.
- **Verde bosque** `#193021`: gradiente secundario de fondo.
- **Verde CTA** `#3F981D`: acciones prioritarias y navegación.
- **Verde claro** `#ADEB8D`: énfasis sobre superficies oscuras.
- **Gris muy claro** `#F5F7F4`: fondo del panel y secciones de descanso.
- **Blanco** `#FFFFFF`: tarjetas, formularios y documentos.

Jerarquía tipográfica: titulares contundentes y legibles, texto en frase normal, botones de acción concretos y sin promesas. Preferir una única familia sans-serif bien ajustada antes que añadir fuentes sin justificar su carga.

Evitar superficies enteramente negras, degradados decorativos sin objetivo, sombras excesivas, insignias repetidas y efectos que distraigan. El contraste y el foco de teclado deben mantenerse visibles.

## Arquitectura de la web comercial

**Portada**: mensaje que explica energía y seguridad + dos tarjetas de acceso equivalentes. Instalaciones como enlace secundario. Sin números de ahorro inventados.

```
[Logo]               Luz y gas | Alarmas | Instalaciones | Contacto
-------------------------------------------------------------------------
[Marca / contexto Feníe]              [Luz y gas                →]
LUZ, GAS Y ALARMAS.                    [Revisar factura            ]
Decide con información clara.          [-----------------------------]
Descripción breve y concreta.         [Alarmas                  →]
Revisión sin coste · Trato directo     [Consultar una alarma        ]
Instalaciones eléctricas →             [-----------------------------]
-------------------------------------------------------------------------
[Servicios, garantías y proceso] [Información Feníe] [Contacto]
```

La portada debe funcionar en móvil apilando la descripción antes de las dos tarjetas. No duplicar botones en exceso.

**Página de facturas**: descripción breve + acceso directo al formulario. Captura de archivo grande, sensible a teclado y pantalla táctil. Campos mínimos: servicio, tipo de cliente, bono social si hay electricidad, persona de contacto, teléfono, correo opcional, archivo, notas opcionales, permiso. Sin precio ni ofertas automáticas.

**Página de alarmas**: qué ofrece Electricidad Lakuntza, papel de Feníe/Movistar Prosegur, cómo consultar, contacto sin datos sensibles. Precios solo cuando Javier confirme condiciones actualizadas.

**Instalaciones**: portafolio y alcance geográfico real, sin prometer disponibilidad inmediata.

**Elementos de confianza**: identidad empresarial real, contacto verificado, legales correctos, información del canal comercial y compromiso con revisión humana. No inventar testimonios.

## Administrador como herramienta de trabajo

Diseñar para Javier/Kristina o responsable interno, no como escaparate.

```
[Logo y título del panel]    [Solicitudes]  [Trabajos] [Web] [Salir]

Gestión / Solicitudes                   Título y explicación breve
[Pendientes  4] [En revisión 2] [Contactadas 3] [Cerradas 8]
-------------------------------------------------------------------------
[Nombre de CONTACTO]       [Nueva] [Lectura pendiente]
Teléfono · servicio          Ver solicitud
Fecha recepción · seguimiento pendiente
-------------------------------------------------------------------------
```

Detalles: ficha de contacto, documento privado, resultado de lectura, diagnóstico, siguiente acción, estado y anotaciones. Mostrar fallos de carga como errores reales, nunca como «no hay solicitudes». Evitar datos repetidos de la factura en 12 tarjetas idénticas. El administrador debe mantener sesión segura y ruta no indexable.

**No exponer datos personales en métricas públicas**. Notificación interna sin adjuntar facturas. URL firmada de corta duración.

## Secuencia de validación

1. Comparar diseño escritorio y móvil (360–390 px, 768 px, 1280–1440 px).
2. Navegación con teclado, contraste, tamaño de toque y formularios.
3. Compilación CI Next.js y comprobación de preview.
4. Validación de administrador y recorrido real de facturas contra Supabase correcto.
5. Pruebas de seguridad, RLS, borrado, comunicaciones y privacidad.
6. Revisar con Javier precios y proceso de alarmas; validar correo y teléfono corporativo.
7. Solo entonces fusionar los cambios aprobados y publicar.

## Referencias utilizadas

- Anthropic: `skills/frontend-design` — dirección visual intencional.
- Vercel: `skills/web-design-guidelines` — revisión de accesibilidad/UX.
- Vercel skill ya conectada: `react-best-practices` — calidad React.
- Vercel skill ya conectada: `verification` — flujo completo de extremo a extremo.

# Diseño corporativo V3 — Electricidad Lakuntza

**Candidato visual, no producción**. Elaborado el 29/10/2026 tras leer los `SKILL.md` originales de Anthropic Frontend Design y Vercel Web Design Guidelines y las últimas reglas del proyecto Web Interface Guidelines.

## Dirección

Señal distintiva: un bloque editorial junto a un **único selector con dos servicios del mismo rango visual (luz/gas y alarmas)**, en lugar de hileras repetidas de tarjetas. Las instalaciones permanecen visibles como línea de trabajo secundaria. Evitamos fotografías de stock, ahorros ficticios y mensajes que presenten a Electricidad Lakuntza como comparador independiente o instaladora de alarmas.

### Paleta y tipografía

| Token | Color | Uso |
|---|---|---|
| Grafito vegetal | `#0D1712` | Portada |
| Bosque | `#193021` | Degradado corporativo |
| Verde de acción | `#24662D` | Botones |
| Verde de texto | `#2E7136` | Titulares auxiliares |
| Blanco tenue | `#F5F8F4` | Fondos luminosos |
| Blanco | `#FFFFFF` | Tarjetas y formulario |

Tipografía sans de sistema (Segoe UI / Inter / Helvetica / system-ui) sin descarga externa. Titulares semibold y escala marcada. Sin etiquetas ALL CAPS innecesarias.

### Estructura

```
[Logo]    Luz y gas   Alarmas   Instalaciones    [Contactar]
┌────────────────────────────────────────────────────────────┐
│ Gran titular editorial     │ ¿En qué podemos ayudarte?    │
│ Mensaje claro              │ Revisar mi factura           │
│ Instalaciones →            │ Consultar una alarma         │
└────────────────────────────────────────────────────────────┘
[Proceso real de tres pasos]
[Feníe: rol, condiciones, trato directo]
[Proyectos reales autorizados, si existen]
[Contacto sobre superficie clara]
[Pie grafito y datos legales]
```

Panel: navegación lateral o compacta móvil, selección visible, listado con estado/fecha/acción, ficha sin ornamentos. Los errores reales de Supabase nunca se deben mostrar como lista vacía.

### Autocrítica

- V2 resultaba todavía genérica por repetir tarjetas, badges y CTAs.
- V3 reduce esas repeticiones, deja respirar la tipografía y concentra la atención en el selector de servicios.
- No se incluyen nuevas fuentes remotas ni fotografías ficticias.
- Sigue pendiente revisión visual de escritorio/móvil y E2E contra base de datos real.
- No fusionar ni publicar sin validar rutas, permisos, RLS y formularios.

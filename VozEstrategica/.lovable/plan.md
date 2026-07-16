
# Reposicionamiento Voz Estratégica

**Regla de oro:** mantengo el diseño actual (crema #F4F1E3, amarillo #EAC945, negro #141310, tipografías, componentes, logo). Solo cambio **estructura y contenido**.

Ejecuto todo en un flujo continuo, por bloques, para no romper el sitio.

---

## Bloque 1 — Navegación y Footer
- Header: nuevo menú **Inicio · Soluciones · Programas · Conferencistas · Casos · Recursos · Nosotros** + botón "Solicitar propuesta".
- Rename `Speakers → Conferencistas` (mantengo ruta `/speakers` y añado alias `/conferencistas`).
- Footer: nueva descripción + links al nuevo menú.
- Eventos y Libros salen del menú pero mantienen sus rutas.

## Bloque 2 — Home (top-down)
1. **Hero**: eyebrow, subcopy y botones nuevos ("Explorar soluciones" / "Solicitar propuesta").
2. **Cifras**: sin cambios.
3. **Nueva sección "5 Territorios"** debajo de cifras (Liderazgo · Comunicación · Cultura · Transformación · Ventas y cliente).
4. **Diagrama actual (FlowDiagram)**: ajusto solo el texto de la 3ª salida a "Una capacidad instalada".
5. **Nueva sección "Soluciones"**: 4 unidades + escalera de 6 pasos.
6. **Nueva sección destacada "Escuela Voz Estratégica"** (fondo negro, método de 5 pasos).
7. **Conferencistas** (antes "Speakers destacados"): rótulos e intro nuevos.
8. **Agenda**: sin cambios.
9. **Nueva sección "Casos"**: logos + testimonios con placeholders.
10. **Libros → Recursos**: rótulo `03 · Recursos`, CTA a `/recursos`.
11. **CTA final**: "¿Listo para desarrollar a tu equipo?".

## Bloque 3 — Páginas nuevas
Creo con estilo del sitio:
- `/soluciones` — 4 unidades + escalera + 5 territorios.
- `/programas` — Escuela Voz Estratégica (hero oscuro, método, programas, para quién).
- `/conferencistas` — alias/redirect a `/speakers` con intro nuevo.
- `/casos` — hero + 3 casos placeholder + logos.
- `/recursos` — hero + newsletter (guarda en tabla `subscribers` de Lovable Cloud) + libros + estudios.
- `/nosotros` — misión, visión, territorios, Tatiana, presencia.

## Bloque 4 — Globales, SEO, integraciones
- **WhatsApp**: nuevo mensaje "propuesta de aprendizaje (conferencia, taller o programa)".
- **SEO** (`__root.tsx`): título + description + OG/Twitter con el nuevo posicionamiento. Cada página nueva con su propio `head()`.
- **Formulario `/contratar`**: campos nuevos "¿Qué te interesa?" (obligatorio) y "¿Dónde nos conociste?" (opcional).
- **Newsletter**: tabla `subscribers` en Lovable Cloud + server function para insert desde `/recursos`.

## Lo que NO toco
- Banner masterclass, TopBar, BottomBar, landing masterclass y pago Bold.
- Sistema de speakers individuales, admin, orders.
- Diseño visual, colores, tipografías, layout de componentes.

## Notas técnicas
- Datos centralizados en `src/data/content.ts` — muchos textos del Home se editan ahí.
- Rutas nuevas en `src/routes/` (`soluciones.tsx`, `programas.tsx`, etc.).
- Uso `PageHero` existente para consistencia visual.
- Casos y logos quedan con placeholders (no invento métricas ni clientes).

---

¿Ejecuto los 4 bloques de corrido, o prefieres que pare y revisemos entre bloque y bloque?

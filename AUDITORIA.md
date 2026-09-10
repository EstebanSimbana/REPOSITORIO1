# Auditoría de accesibilidad, UX y responsive

## 1. Resumen ejecutivo

Se revisaron los archivos del proyecto `index.html`, `styles.css` y `script.js` sin modificar ningún origen. La auditoría se enfocó en WCAG 2.2 AA, experiencia de usuario y diseño responsive para los tamaños 320px, 390px, 768px y escritorio.

### Estado general

- Archivos verificados: sí.
- Sintaxis JavaScript: válida. Se ejecutó `node --check script.js` y no devolvió errores.
- Resultado general: el proyecto presenta una base sólida y con varios criterios de accesibilidad bien resueltos.

### Criterios que cumplen

- Estructura semántica adecuada: `header`, `nav`, `main`, `section`, `footer` están bien definidos en `index.html`.
- Jerarquía de encabezados coherente: hay un `h1` principal y subtítulos `h2`/`h3` organizados por secciones.
- Enlace de acceso directo implementado: `skip-link` para saltar al contenido principal.
- Foco visible: `a:focus-visible` y `button:focus-visible` tienen contorno visible en `styles.css`.
- Navegación con teclado: los elementos interactivos son enlaces y botones y se gestionan con `keydown` para cerrar el menú móvil con `Escape` en `script.js`.
- Uso correcto de botones y enlaces: los controles de navegación y timeline usan `button`, mientras que los enlaces de navegación y fuentes usan `a` con propósito claro.
- ARIA aplicada con criterio: `aria-expanded`, `aria-controls`, `aria-label` y `aria-live` presentes en componentes clave.
- Imágenes decorativas manejadas adecuadamente: la imagen hero usa `alt=""` y `aria-hidden="true"` porque no aporta contenido informativo.
- Responsive implementado: existen media queries para pantallas reducidas y se adaptan columnas y menú móvil.
- Objetivos táctiles razonables: los controles tienen altura mínima y elementos móviles con dimensiones apropiadas para interacción.
- Sin evidencia de overflow horizontal visible en la estructura actual. La construcción usa `width: min(...)` y `max-width` junto con `box-sizing: border-box`.

### Conclusión

No se encontraron hallazgos críticos, altos o medios con base suficiente en el código. El proyecto está en una situación buena de accesibilidad y respuesta visual, con una observación menor en enlaces externos.

---

## 2. Hallazgos críticos, altos, medios y bajos

### Críticos

- Ninguno.

### Altos

- Ninguno.

### Medios

- Ninguno.

### Bajos

1. Enlaces externos que abren una nueva pestaña sin avisar al usuario.
   - Impacto: bajo.
   - Motivo: el sitio usa varios enlaces con `target="_blank"`, pero no informa explícitamente que se abre en otra pestaña.

---

## 3. Evidencia concreta

### Hallazgo bajo 1

- Archivo: `index.html`
- Elemento afectado: enlaces externos dentro de `hero-actions`, `gallery-card figcaption` y `source-list`.
- Ejemplo concreto: `href="https://www.cristianoronaldo.com/" target="_blank" rel="noopener noreferrer"` y otros enlaces con `target="_blank"`.
- Justificación: la apertura en nueva pestaña es una mejora útil, pero sin texto o mensaje alternativo el usuario no siempre sabe que va a salir del contexto actual.

### Criterios cumplidos con evidencia

- Archivo: `index.html`
- Elemento: `a class="skip-link" href="#contenido"`
- Evidencia: existe un enlace visible al foco para saltar al contenido principal.

- Archivo: `styles.css`
- Elemento: `a:focus-visible, button:focus-visible` y `outline: 3px solid var(--gold)`
- Evidencia: se implementa un foco visible claro.

- Archivo: `styles.css`
- Elemento: media queries `@media (max-width: 900px)`, `@media (max-width: 720px)`
- Evidencia: hay adaptaciones específicas para tablet y móvil.

- Archivo: `script.js`
- Elemento: `document.addEventListener("keydown", (event) => { if (event.key === "Escape") { closeMenu(); } });`
- Evidencia: se soporta cierre del menú por teclado.

- Archivo: `script.js`
- Elemento: `const counterObserver = new IntersectionObserver(...);`
- Evidencia: las estadísticas cuentan con animación pausada y no bloquean la navegación.

---

## 4. Recomendación de corrección para cada hallazgo

### Recomendación para el hallazgo bajo 1

- Añadir texto visible o `aria-label` para indicar apertura en nueva pestaña, por ejemplo:
  - `Visitar sitio oficial (abre en una nueva pestaña)`
  - o incluir un símbolo accesible y descripción legible.
- Mantener `target="_blank"` solo si es necesario, pero avisar al usuario explícitamente.

### Recomendación general para reforzar el cumplimiento

- Seguir manteniendo la estrategia actual de foco visible.
- Continuar con pruebas de teclado y viewport móvil después de cada cambio visual.

---

## 5. Pruebas que deberían repetirse después de corregir

1. Validación de navegador en 320px, 390px, 768px y escritorio.
2. Prueba con teclado completo:
   - Tabulación por enlaces y botones
   - Verificación del foco visible
   - Apertura y cierre del menú móvil con `Enter`, `Espacio` y `Escape`
3. Revisión de contraste en:
   - fondo verde + texto blanco
   - botón dorado + texto oscuro
   - enlaces en verde sobre fondo claro
4. Verificación del flujo de lectura con lector de pantalla:
   - skip link
   - estructura del encabezado
   - nombres accesibles de enlaces y botones
5. Revisión de enlaces externos para confirmar que se señala claramente la apertura en otra pestaña.
6. Control de overflow horizontal en cada breakpoint con la herramienta de inspección del navegador.
7. Validación de sintaxis del JavaScript después de cualquier modificación: `node --check script.js`.

---

## Pruebas y validaciones realizadas

- Verificación de existencia de archivos: `index.html`, `styles.css` y `script.js` sí existen en la carpeta del proyecto.
- Validación de sintaxis JavaScript: `node --check script.js` no reportó errores.
- Revisión estática de semántica, foco, navegación, responsive y ARIA en el código.
- No se modificó ningún archivo del proyecto; solo se generó este informe de auditoría.

## Conclusión final

El proyecto se encuentra bien estructurado desde la perspectiva de accesibilidad y UX, con un nivel de cumplimiento alto y sin hallazgos críticos. La única observación menor justificada es la falta de advertencia explícita al abrir enlaces externos en una nueva pestaña.

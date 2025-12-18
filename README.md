# Form Validator — Demo (ES)

Este repositorio contiene una **librería de validación de formularios en Vanilla JavaScript**, creada como demo para un caso de uso en RRHH (Workana).

El objetivo es ofrecer una solución **reutilizable, liviana y sin dependencias**, enfocada exclusivamente en **validación del lado del cliente**, con buenas prácticas de UX y accesibilidad.

---

## Características

- Validación mediante atributos `data-validate` y/o configuración por JavaScript.
- Reglas soportadas:
  - `required`
  - `email`
  - `phone`
  - `min`
  - `max`
  - `pattern` (expresiones regulares)
  - `date`
  - `numeric`
  - `minValue`
  - `maxValue`
- Validación en tiempo real (`input` / `blur`) configurable.
- Mensajes de error accesibles (`aria-describedby`, `role="alert"`).
- Indicadores visuales de estado válido / inválido mediante clases CSS.
- Soporte para múltiples formularios con una misma instancia.
- Mensajes localizables (`es`, `en`).
- Sin dependencias externas.

---

## Uso

### Ejemplo básico

```js
import FormValidator from './validator.js';

const validator = new FormValidator('#myForm', {
  realtime: true,
  lang: 'es'
});
Las reglas de validación pueden definirse mediante:

Atributos HTML (required, minlength, maxlength, pattern)

Atributo data-validate

Configuración JavaScript usando la opción rules

Manejo del envío del formulario
La librería no envía datos ni depende de servicios externos.

Cuando un formulario pasa la validación, se dispara un evento custom:

js
Copiar código
form.addEventListener('fv:submit', (e) => {
  e.preventDefault(); // opcional
  // Implementar aquí la lógica de envío (fetch, backend, etc.)
});
Si el evento no es cancelado, el formulario se envía de forma normal.

Este enfoque mantiene la validación desacoplada de la infraestructura o del backend.

Demo
Instalar dependencias de desarrollo (solo esbuild):

bash
Copiar código
npm install
Generar el bundle:

bash
Copiar código
npm run build
Abrir examples/index.html en el navegador
(funciona vía file:// ya que Tailwind se carga desde CDN).

Campos de ejemplo orientados a RRHH
El formulario de demo incluye campos habituales en procesos de selección:

salary: campo numérico

Se rechazan valores con ceros a la izquierda (ej. 012345)

currency: selector obligatorio (USD, EUR, ARS)

schedule: selector obligatorio con rangos horarios predefinidos

email, phone, date, etc.

Estos campos son solo demostrativos; la librería es agnóstica al dominio.

Estructura del proyecto
pgsql
Copiar código
src/
 ├── validator.js
 ├── rules.js
 ├── messages.js
 ├── utils.js
examples/
 ├── index.html
 ├── styles.css
dist/
 └── bundle.js
Notas
El proyecto se enfoca exclusivamente en validación.

El envío del formulario, almacenamiento de datos o integración con backend
quedan fuera del alcance y deben implementarse según las necesidades del proyecto.

Diseñado para navegadores modernos.

Licencia
MIT
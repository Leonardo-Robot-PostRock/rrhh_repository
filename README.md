# Form Validator — Demo (ES)

Este repositorio contiene un pequeño validador de formularios en Vanilla JS pensado como demo para un cliente de RRHH (Workana).

## Características

- Validación por atributos `data-validate`.
- Reglas: `required`, `email`, `phone`, `min`, `max`, `pattern`, `date`, `numeric`, `minValue`, `maxValue`.
- Mensajes localizables (`es`, `en`).
- Demo con estilos Tailwind para aspecto corporativo.

## Uso

1. Instalar dependencias (solo `esbuild` como dev):

```bash
npm install
```

2. Construir el bundle:

```bash
npm run build
```

3. Abrir `examples/index.html` en un navegador (sirve con `file://` ya que usa CDN para Tailwind).

## Campos añadidos para RRHH

- `salary`: campo numérico con validación `numeric|minValue:30000|maxValue:200000`.
- `salary`: campo numérico validado como `numeric`. Los rangos (mín/max) se aplican según la `currency` seleccionada.

Cómo funcionan los rangos de `salary`:
- Por defecto el validador aplica límites por moneda (ejemplo):
	- `USD`: min 30000, max 200000
	- `EUR`: min 25000, max 180000
	- `ARS`: min 3000000, max 15000000
- No pongas `minValue`/`maxValue` fijos en el atributo `data-validate` del `input[name="salary"]` — el validador usará la moneda seleccionada para decidir los límites.
- Si necesitas sobrescribir los límites, usa atributos `data-` en el propio `input`:
	- `data-salary-min-usd="35000"` y `data-salary-max-usd="250000"` (ocurre como dataset `salaryMinUsd` / `salaryMaxUsd`)
	- o genérico `data-salary-min="20000"` / `data-salary-max="1000000"`
- `currency`: selector obligatorio (`USD`, `EUR`, `ARS`).
- `schedule`: selector obligatorio con horarios predefinidos.
 
## Configurar el email destinatario

El proyecto incluye un fichero JSON para configurar el email al que debería enviarse (o registrarse) la solicitud. Por defecto está en `config/email.json` con el valor de ejemplo del cliente.

Ejemplo (`config/email.json`):

```json
{
	"recipient": "anshegol@gmail.com"
}
```

Cuando generes el HTML bundle (`dist/bundle.html`), el script `scripts/inline.js` inyecta automáticamente una meta tag en el `head` con el email configurado:

```html
<meta name="recipient-email" content="anshegol@gmail.com">
```

Esto facilita al cliente cambiar únicamente el JSON para apuntar a otro email. La lógica de envío (por ejemplo un endpoint servidor) debe leer este valor si se desea usarlo en producción.

## Desarrollo y documentación

- Código modular en `src/` con JSDoc en funciones principales.
- Ejecuta `npm run build` para regenerar `dist/bundle.js`.

---

If you need further translations or adjustments, run the build and edit the example layout in `examples/index.html`.

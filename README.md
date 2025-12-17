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

## Envío de Email

El bundle soporta enviar emails via EmailJS (https://www.emailjs.com/), que permite enviar emails con adjuntos directamente desde el cliente.

Para habilitar el envío de email:

1. Regístrate en EmailJS y crea un servicio, template, y obtén tu public key.
2. Configura el template con variables para cada campo del formulario (ej. {{name}}, {{email}}, etc.) y establece el destinatario a {{to_email}}.
3. Edita `config/emailjs.json` con tus credenciales de EmailJS:

```json
{
  "serviceId": "tu_service_id",
  "templateId": "tu_template_id",
  "publicKey": "tu_public_key"
}
```

4. Reconstruye el bundle con `npm run build`.

El bundle usará automáticamente la configuración del archivo JSON. Si no está configurado, recurre a abrir el enlace mailto.

Nota: EmailJS tiene límites de uso; para producción, considera envío server-side.

## Campos añadidos para RRHH

- `salary`: campo numérico validado como `numeric`. Además, los valores que comiencen con un cero a la izquierda (por ejemplo `012345`) son rechazados.
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

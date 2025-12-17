# Form Validator — Demo (EN)

This repository contains a small vanilla JS form validator intended as a demo for an HR client (Workana).

## Features

- Validation via `data-validate` attributes.
- Rules: `required`, `email`, `phone`, `min`, `max`, `pattern`, `date`, `numeric`, `minValue`, `maxValue`.
- Localizable messages (`es`, `en`).
- Tailwind-styled demo for a corporate look.

## Usage

1. Install dev deps (esbuild):

```bash
npm install
```

2. Build the bundle:

```bash
npm run build
```

3. Open `examples/index.html` in a browser (works via `file://` since Tailwind is loaded from CDN).

## Email Submission

The bundle supports sending emails via EmailJS (https://www.emailjs.com/), which allows sending emails with attachments directly from the client.

To enable email sending:

1. Sign up for EmailJS and create a service, template, and get your public key.
2. Configure the template with variables for each form field (e.g., {{name}}, {{email}}, etc.) and set the recipient to {{to_email}}.
3. In the JavaScript initialization, add the emailjs options:

```javascript
const validator = new FormValidator('#demoForm', { 
  realtime: true, 
  lang: 'es',
  emailjs: {
    serviceId: 'your_service_id',
    templateId: 'your_template_id',
    publicKey: 'your_public_key'
  }
});
```

If emailjs is not configured, it falls back to opening the mailto link.

Note: EmailJS has usage limits; for production, consider server-side sending.

## HR-specific fields

- `salary`: numeric field validated as `numeric`. Additionally, values are rejected if they begin with a leading zero (e.g. `012345`).
- `currency`: required select (`USD`, `EUR`, `ARS`).
- `schedule`: required select with predefined time ranges.

## Development & docs

- Modular source under `src/` with JSDoc comments in main functions/classes.
- Run `npm run build` to regenerate `dist/bundle.js`.

## Configure recipient email

The project includes a small JSON file to configure the recipient email. By default it's `config/email.json` and contains the client's example address.

Example (`config/email.json`):

```json
{
	"recipient": "anshegol@gmail.com"
}
```

When building the single-file HTML (`dist/bundle.html`) the `scripts/inline.js` script injects a meta tag into the document head with the configured email:

```html
<meta name="recipient-email" content="anshegol@gmail.com">
```

Change the JSON value to point the bundle to another recipient address. Actual sending must be implemented server-side and can read this meta or the JSON directly.

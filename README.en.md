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

## HR-specific fields

- `salary`: numeric field validated with `numeric|minValue:30000|maxValue:200000`.
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

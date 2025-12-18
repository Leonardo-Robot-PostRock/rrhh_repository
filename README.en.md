# Form Validator — Demo (EN)

This repository contains a small **vanilla JavaScript form validation library**, created as a demo project for an HR-related use case (Workana).

The goal is to provide a **reusable, dependency-free** solution focused exclusively on **client-side form validation**, following good UX and accessibility practices.

---

## Features

- Validation via `data-validate` attributes and/or JS configuration.
- Supported rules:
  - `required`
  - `email`
  - `phone`
  - `min`
  - `max`
  - `pattern` (regex)
  - `date`
  - `numeric`
  - `minValue`
  - `maxValue`
- Real-time validation (`input` / `blur`) — optional.
- Accessible inline error messages (`aria-describedby`, `role="alert"`).
- Visual validation states via CSS classes.
- Supports multiple forms with a single validator instance.
- Localized messages (`en`, `es`).
- No external dependencies.

---

## Usage

### Basic example

```js
import FormValidator from './validator.js';

const validator = new FormValidator('#myForm', {
  realtime: true,
  lang: 'en'
});
Validation rules can be defined using:

required, minlength, maxlength, pattern HTML attributes

data-validate attributes

JavaScript configuration via the rules option

Custom submit handling
The validator does not send data and does not depend on any backend or third-party service.

When a form passes validation, a custom event is dispatched:

js
Copiar código
form.addEventListener('fv:submit', (e) => {
  e.preventDefault(); // optional
  // Handle submission logic here (fetch, backend, etc.)
});
If the event is not prevented, the form will submit normally.

This design keeps validation decoupled from transport or infrastructure concerns.

Demo
Install dev dependencies (esbuild):

bash
Copiar código
npm install
Build the bundle:

bash
Copiar código
npm run build
Open examples/index.html in a browser
(works via file:// — Tailwind is loaded from CDN).

HR-oriented example fields
The demo form includes common HR-related inputs:

salary: numeric field

Rejects values with leading zeros (e.g. 012345)

currency: required select (USD, EUR, ARS)

schedule: required select with predefined time ranges

email, phone, date, etc.

These are examples only; the validator itself is form-agnostic.

Project structure
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
Notes
This project focuses only on validation.

Form submission, email sending, file uploads, or backend integration
are intentionally out of scope and must be implemented by the consuming application.

Designed for modern browsers.

License
MIT
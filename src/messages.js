/**
 * messages.js — default localized messages
 * Exported so they can be reused and documents can point to them.
 */
export const DEFAULT_MESSAGES = {
  en: {
    required: 'This field is required.',
    email: 'Please enter a valid email address.',
    phone: 'Please enter a valid phone number.',
    min: 'Please enter at least {0} characters.',
    max: 'Please enter no more than {0} characters.',
    pattern: 'The value does not match the required format.',
    numeric: 'Please enter a valid number.',
    minValue: 'Please enter a value greater than or equal to {0}.',
    maxValue: 'Please enter a value less than or equal to {0}.',
    file: 'Please attach a PDF file.',
    linkedin: 'Please enter a valid LinkedIn profile URL.',
    date: 'Please enter a valid date.',
    default: 'The value is invalid.'
  },
  es: {
    required: 'Este campo es obligatorio.',
    email: 'Por favor ingresa un correo electrónico válido.',
    phone: 'Por favor ingresa un número de teléfono válido.',
    min: 'Por favor ingresa al menos {0} caracteres.',
    max: 'Por favor no ingreses más de {0} caracteres.',
    pattern: 'El valor no coincide con el formato requerido.',
    numeric: 'Por favor ingresa un número válido.',
    minValue: 'Por favor ingresa un valor mayor o igual a {0}.',
    maxValue: 'Por favor ingresa un valor menor o igual a {0}.',
    file: 'Por favor adjunta un archivo PDF.',
    linkedin: 'Por favor ingresa una URL válida de LinkedIn.',
    date: 'Por favor ingresa una fecha válida.',
    default: 'El valor no es válido.'
  }
};

export default DEFAULT_MESSAGES;
